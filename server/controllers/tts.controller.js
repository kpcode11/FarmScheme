import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Lazy import to avoid hard dependency if not installed yet
let googleTTSClient = null;

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

// POST /api/v1/tts/synthesize { text, lang, voiceName, speakingRate, pitch, audioEncoding }
export const synthesize = asyncHandler(async (req, res) => {
  const { text, lang = 'en-IN', voiceName, speakingRate = 1.0, pitch = 0.0, audioEncoding = 'MP3' } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new ApiError(400, 'Missing text');
  }

  // Guard to avoid abuse
  if (text.length > 5000) throw new ApiError(413, 'Text too long');

  const client = await getClient();

  const request = {
    input: { text },
    voice: {
      languageCode: lang,
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
  res.setHeader('Content-Length', buf.length);
  return res.status(200).send(buf);
});


