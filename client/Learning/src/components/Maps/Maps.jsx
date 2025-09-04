import React, { useRef } from "react";
import useGoogleMaps from "./useGoogleMaps";

// Get API key from Vite environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

function initMap(mapRef) {
  return function () {
    const userLocation = { lat: 19.72683088297692, lng: 75.22276582663706 };
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: userLocation,
      map,
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
            map,
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
      }
    });
  };
}

const Maps = () => {
  const mapRef = useRef(null);

  useGoogleMaps(API_KEY, "initMap", initMap(mapRef));

  return (
    <div>
      <h2>Nearby Government Offices (Manual Coordinates)</h2>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "90vh", width: "100%" }}
      />
    </div>
  );
};

export default Maps;