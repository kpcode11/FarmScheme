import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Lazy import to avoid hard dependency if not installed yet
let googleTTSClient = null;
let supportedLangsCache = null;

async function getClient() {
  if (googleTTSClient) return googleTTSClient;
  const { TextToSpeechClient } = await import('@google-cloud/text-to-speech');

  // Credentials strategy: prefer GOOGLE_APPLICATION_CREDENTIALS (file), fallback to GOOGLE_TTS_CREDENTIALS (base64 JSON)
  let clientOptions = {};
  if (process.env.GOOGLE_TTS_CREDENTIALS) {
    try {
      const credsJson = JSON.parse(Buffer.from(process.env.GOOGLE_TTS_CREDENTIALS, 'base64').toString('utf-8'));
      clientOptions.credentials = {
        client_email: credsJson.client_email,
        private_key: credsJson.private_key,
      };
      clientOptions.projectId = credsJson.project_id || process.env.GOOGLE_CLOUD_PROJECT;
    } catch (e) {
      // ignore; will rely on default env
    }
  }

  googleTTSClient = new TextToSpeechClient(clientOptions);
  return googleTTSClient;
}

async function getSupportedLangs(client) {
  if (supportedLangsCache) return supportedLangsCache;
  try {
    const [result] = await client.listVoices({});
    const langs = new Set();
    for (const v of result.voices || []) {
      for (const lc of v.languageCodes || []) langs.add(lc);
    }
    supportedLangsCache = Array.from(langs);
  } catch (_) {
    supportedLangsCache = [];
  }
  return supportedLangsCache;
}

function pickFallbackLang(requested) {
  const base = (requested || '').split('-')[0].toLowerCase();
  // Prefer Hindi and English as broad fallbacks
  if (base === 'en') return 'en-IN';
  if (base === 'hi') return 'hi-IN';
  // Map some common unsupported to closest
  const map = {
    pa: 'hi-IN', // Punjabi → fallback Hindi
    or: 'hi-IN', // Odia → fallback Hindi
    as: 'hi-IN', // Assamese → fallback Hindi
  };
  if (map[base]) return map[base];
  return 'hi-IN';
}

// POST /api/v1/tts/synthesize { text, lang, voiceName, speakingRate, pitch, audioEncoding }
export const synthesize = asyncHandler(async (req, res) => {
  const { text, lang = 'en-IN', voiceName, speakingRate = 1.0, pitch = 0.0, audioEncoding = 'MP3' } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new ApiError(400, 'Missing text');
  }

  // Guard to avoid abuse
  if (text.length > 5000) throw new ApiError(413, 'Text too long');

  const client = await getClient();
  const supported = await getSupportedLangs(client);
  let languageCode = lang;
  if (!supported.includes(languageCode)) {
    // try base match like 'hi'
    const base = (languageCode || '').split('-')[0];
    const baseMatch = supported.find((l) => l.split('-')[0] === base);
    if (baseMatch) languageCode = baseMatch;
  }
  if (!supported.includes(languageCode)) {
    languageCode = pickFallbackLang(languageCode);
  }

  const request = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName || undefined,
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding,
      speakingRate: Number(speakingRate) || 1.0,
      pitch: Number(pitch) || 0.0,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioContent = response.audioContent;
  if (!audioContent) throw new ApiError(500, 'No audio returned');

  const buf = Buffer.from(audioContent, 'base64');
  res.setHeader('Content-Type', audioEncoding === 'OGG_OPUS' ? 'audio/ogg' : 'audio/mpeg');
  res.setHeader('X-TTS-Lang-Used', languageCode);
  res.setHeader('Content-Length', buf.length);
  return res.status(200).send(buf);
});


