// Simple browser TTS helper using SpeechSynthesis API

const languageMap = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  te: "te-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  ur: "ur-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  as: "as-IN",
};

export function isTtsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getPreferredLangCode() {
  const globalPreferred = (window && window.appLanguage) || null;
  if (globalPreferred && languageMap[globalPreferred]) return languageMap[globalPreferred];
  const nav = (navigator && (navigator.language || (navigator.languages && navigator.languages[0]))) || "en-IN";
  return nav;
}

export function pickVoiceForLang(targetLang) {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  // Try exact match
  let voice = voices.find((v) => (v.lang || "").toLowerCase() === (targetLang || "").toLowerCase());
  if (voice) return voice;
  // Try startsWith by language only (e.g., hi)
  const base = (targetLang || "en-IN").split("-")[0].toLowerCase();
  voice = voices.find((v) => (v.lang || "").toLowerCase().startsWith(base));
  return voice || voices[0];
}

export function speakText(text, langCode) {
  if (!isTtsSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const lang = langCode || getPreferredLangCode();
  utter.lang = lang;
  const voice = pickVoiceForLang(lang);
  if (voice) utter.voice = voice;
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  try {
    if (isTtsSupported()) {
      window.speechSynthesis.cancel();
    }
    if (window.__ttsCurrentAudio) {
      try { window.__ttsCurrentAudio.pause(); } catch (_) {}
      try { window.URL.revokeObjectURL(window.__ttsObjectUrl); } catch (_) {}
      window.__ttsCurrentAudio = null;
      window.__ttsObjectUrl = null;
    }
  } catch (_) {}
}

// Optional: allow external code to set preferred app language (e.g., from navbar)
if (typeof window !== "undefined" && !window.setAppLanguage) {
  window.setAppLanguage = function (lang) {
    window.appLanguage = lang;
  };
}

// Cloud TTS fallback using our backend (Google Cloud TTS)
export async function speakViaCloud(text, options = {}) {
  const { lang = getPreferredLangCode(), voiceName, speakingRate = 1.0, pitch = 0.0, audioEncoding = 'MP3', apiBase } = options;
  const base = apiBase || (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1');
  // Stop any current playback
  stopSpeaking();
  const res = await fetch(`${base}/tts/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang, voiceName, speakingRate, pitch, audioEncoding }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Cloud TTS failed');
    throw new Error(msg || 'Cloud TTS failed');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  window.__ttsCurrentAudio = audio;
  window.__ttsObjectUrl = url;
  await audio.play();
  audio.onended = () => URL.revokeObjectURL(url);
  return audio;
}

export function isSpeaking() {
  try {
    const browserSpeaking = isTtsSupported() && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
    const audioPlaying = !!(window.__ttsCurrentAudio && !window.__ttsCurrentAudio.paused);
    return browserSpeaking || audioPlaying;
  } catch (_) {
    return false;
  }
}


