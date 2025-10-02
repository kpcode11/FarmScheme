import React, { useRef, useState } from "react";
import useGoogleMaps from "./useGoogleMaps";

// Get API key from Vite environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

function initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef) {
  return function () {
    const userLocation = { lat: 19.72683088297692, lng: 75.22276582663706 };
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
    });
    mapInstanceRef.current = map;

    new window.google.maps.Marker({
      position: userLocation,
      map,
      title: "You are here",
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();

    const request = {
      location: userLocation,
      radius: 50000,
      keyword: "department of agriculture",
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
        results.forEach((place) => {
          const marker = new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });
          markersRef.current.set(place.place_id, marker);

          marker.addListener("click", () => {
            infoWindowRef.current.setContent(`<div style="color: black;"><strong>${place.name}</strong><br>${place.vicinity || ''}</div>`);
            infoWindowRef.current.open(map, marker);
          });
        });
      }
    });
  };
}

const Maps = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const infoWindowRef = useRef(null);
  const [places, setPlaces] = useState([]);

  useGoogleMaps(API_KEY, "initMap", initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef));

  const focusPlace = (place) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const marker = markersRef.current.get(place.place_id);
    if (marker) {
      map.panTo(marker.getPosition());
      map.setZoom(16);
      infoWindowRef.current.setContent(`<div style="color: black;"><strong>${place.name}</strong><br>${place.vicinity || ''}</div>`);
      infoWindowRef.current.open(map, marker);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-white mb-3">Nearby Government Offices</h2>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "70vh", width: "100%", borderRadius: 12 }}
      />
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-3">Locations</h3>
        {places && places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((p) => (
              <div key={p.place_id} className="card bg-slate-600 border border-base-300 shadow mb-4">
                <div className="card-body">
                  <h4 className="card-title text-white text-lg leading-tight">{p.name}</h4>
                  {p.vicinity && <p className="text-sm text-white opacity-80">{p.vicinity}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {typeof p.rating === 'number' && (
                      <div className="badge badge-outline">⭐ {p.rating}</div>
                    )}
                    {p.user_ratings_total ? (
                      <div className="badge badge-outline">{p.user_ratings_total} reviews</div>
                    ) : null}
                    {p.opening_hours && typeof p.opening_hours.open_now === 'boolean' && (
                      <div className={`badge ${p.opening_hours.open_now ? 'badge-success' : 'badge-error'}`}>
                        {p.opening_hours.open_now ? 'Open now' : 'Closed'}
                      </div>
                    )}
                  </div>
                  <div className="card-actions justify-end mt-3">
                    <button className="btn btn-primary btn-sm" onClick={() => focusPlace(p)}>View on Map</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white opacity-80">Loading locations…</div>
        )}
      </div>
    </div>
  );
};

export default Maps;