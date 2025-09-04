import { useEffect } from "react";

export default function useGoogleMaps(apiKey, callbackName, callbackFn) {
  useEffect(() => {
    if (!apiKey) return;

    window[callbackName] = callbackFn;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      delete window[callbackName];
      document.body.removeChild(script);
    };
  }, [apiKey, callbackName, callbackFn]);
}