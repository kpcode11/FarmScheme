import React, { useEffect, useRef } from "react";

// Get API key from Vite environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

const Maps = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!API_KEY) {
      alert("Google Maps API key is missing!");
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Define initMap globally for callback
    window.initMap = function () {
      const userLocation = {
        lat: 19.72683088297692,
        lng: 75.22276582663706,
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "You are here",
      });

      const request = {
        location: userLocation,
        radius: 50000,
        keyword: "department of agriculture",
      };

      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            const marker = new window.google.maps.Marker({
              map: map,
              position: place.geometry.location,
              title: place.name,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<strong>${place.name}</strong><br>${place.vicinity}`,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          });
        } else {
          alert("No government offices found nearby or API limit reached.");
        }
      });
    };

    // Cleanup
    return () => {
      delete window.initMap;
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2>Nearby Government Offices (Manual Coordinates)</h2>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "90vh", width: "100%" }}
      ></div>
    </div>
  );
};

export default Maps;