import React, { useRef, useState } from "react";
import useGoogleMaps from "./useGoogleMaps";

// Get API key from Vite environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

function initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef, userLocation) {
  return function () {
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
      keyword: "department of agriculture OR agriculture office OR krishi vigyan kendra OR nabard OR cooperative bank OR rural development office OR common service center"
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
  const [userLocation, setUserLocation] = useState({ lat: 19.72683088297692, lng: 75.22276582663706 });
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setIsLoadingLocation(false);
        // Reinitialize map with new location
        if (window.google && window.google.maps) {
          initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef, newLocation)();
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access or enter manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            break;
        }
      }
    );
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setLocationError('Please enter valid latitude and longitude numbers.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setLocationError('Latitude must be between -90 and 90.');
      return;
    }

    if (lng < -180 || lng > 180) {
      setLocationError('Longitude must be between -180 and 180.');
      return;
    }

    const newLocation = { lat, lng };
    setUserLocation(newLocation);
    setLocationError(null);
    setManualLat('');
    setManualLng('');
    
    // Reinitialize map with new location
    if (window.google && window.google.maps) {
      initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef, newLocation)();
    }
  };

  useGoogleMaps(API_KEY, "initMap", initMap(mapRef, setPlaces, markersRef, mapInstanceRef, infoWindowRef, userLocation));

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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden rounded-3xl mb-8 border border-gray-700 shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Help Centers Near You
                </h1>
                <p className="text-lg text-gray-300 mt-2 font-light">
                  Discover nearby government offices and agricultural support centers
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Controls */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-gray-700 shadow-xl">
          <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Set Your Location
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg ${
                isLoadingLocation 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105'
              }`}
            >
              {isLoadingLocation ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Use My Location
                </>
              )}
            </button>
            
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="number"
                step="any"
                placeholder="Latitude (e.g., 19.0760)"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="flex-1 px-4 py-3.5 border-2 border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleManualCoordinates()}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude (e.g., 72.8777)"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="flex-1 px-4 py-3.5 border-2 border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleManualCoordinates()}
              />
              <button
                onClick={handleManualCoordinates}
                disabled={!manualLat.trim() || !manualLng.trim()}
                className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                  !manualLat.trim() || !manualLng.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:scale-105'
                }`}
              >
                Go
              </button>
            </div>
          </div>
          
          {locationError && (
            <div className="mt-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-200 font-medium">{locationError}</span>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-300 bg-gray-700/30 rounded-lg px-4 py-3 border border-gray-600">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Current location:</span>
            <span className="text-white font-mono">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>
        </div>
        {/* Map Container */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-2 border border-gray-700 shadow-2xl mb-8 overflow-hidden">
          <div
            id="map"
            ref={mapRef}
            style={{ height: "70vh", width: "100%", borderRadius: 16 }}
          />
        </div>

        {/* Locations List */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">
                Nearby Offices
              </h3>
              <p className="text-gray-400 text-sm">
                {places.length > 0 ? `Found ${places.length} locations` : 'Searching for locations...'}
              </p>
            </div>
          </div>
          
          {places && places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((p) => (
                <div key={p.place_id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 overflow-hidden group">
                  {/* Gradient Accent Bar */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
                  
                  <div className="p-6">
                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-100 mb-3 leading-tight group-hover:text-white transition-colors">
                      {p.name}
                    </h4>
                    
                    {/* Address */}
                    {p.vicinity && (
                      <div className="flex items-start gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-300 leading-relaxed">{p.vicinity}</p>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {typeof p.rating === 'number' && (
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs font-semibold rounded-lg border border-yellow-500/30">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {p.rating}
                        </span>
                      )}
                      {p.user_ratings_total ? (
                        <span className="inline-flex items-center px-3 py-1.5 bg-gray-700/80 text-gray-300 text-xs font-semibold rounded-lg border border-gray-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {p.user_ratings_total} reviews
                        </span>
                      ) : null}
                      {p.opening_hours && typeof p.opening_hours.open_now === 'boolean' && (
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                          p.opening_hours.open_now 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {p.opening_hours.open_now ? 'Open now' : 'Closed'}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      onClick={() => focusPlace(p)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Map
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center border border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-300 text-lg font-medium">Loading nearby locations...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maps;