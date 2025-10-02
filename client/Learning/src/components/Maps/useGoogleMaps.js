import { useEffect } from "react";

export default function useGoogleMaps(apiKey, callbackName, callbackFn) {
  useEffect(() => {
    if (!apiKey) return;

    // Always set the global callback to the latest initializer
    window[callbackName] = callbackFn;

    // If Google Maps is already loaded, initialize immediately
    if (window.google && window.google.maps) {
      try { callbackFn(); } catch (_) {}
      return () => { delete window[callbackName]; };
    }

    // Avoid injecting duplicate scripts
    const existing = document.getElementById("google-maps-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Do not remove the script on cleanup to prevent reload loops
    return () => {
      delete window[callbackName];
    };
  }, [apiKey, callbackName]);
}