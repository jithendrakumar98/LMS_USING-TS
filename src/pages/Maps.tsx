import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';

const customMarker = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function KLUniversityMap() {
  const klUniversityLocation = { lat: 16.4419, lng: 80.6227 }; // KL University coordinates
  const [searchLocation, setSearchLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    if (!query) {
      toast.error('Please enter a location to search.');
      return;
    }

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        toast.error('Location not found. Please try again.');
      }
    } catch {
      toast.error('Failed to fetch location. Try again later.');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Map to KL University</h1>
        <p className="mt-1 text-gray-500">
          KL University is pinned as the fixed location. Use the search box to explore nearby areas.
        </p>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search for a location"
          className="p-2 border rounded-md w-2/3"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
        />
        <button
          onClick={() => handleSearch(document.querySelector('input').value)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="relative border rounded-lg overflow-hidden shadow-md" style={{ height: '400px' }}>
        <MapContainer
          center={[klUniversityLocation.lat, klUniversityLocation.lng]} // Default center fixed at KL University
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker for KL University */}
          <Marker position={[klUniversityLocation.lat, klUniversityLocation.lng]} icon={customMarker}>
            <Popup>KL University</Popup>
          </Marker>

          {/* Marker for searched location (if any) */}
          {searchLocation && (
            <Marker position={[searchLocation.lat, searchLocation.lng]} icon={customMarker}>
              <Popup>Searched Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
