import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ChloroplethMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [no2Data, setNo2Data] = useState({});

  useEffect(() => {
    // Load GeoJSON data
    fetch('/path/to/india_states_geojson.json')
      .then(response => response.json())
      .then(data => setGeoData(data));

    // Load NO₂ data
    fetch('/path/to/no2_data.json')
      .then(response => response.json())
      .then(data => setNo2Data(data));
  }, []);

  const getColor = (value) => {
    return value > 100 ? '#800026' :
           value > 50  ? '#BD0026' :
           value > 20  ? '#E31A1C' :
           value > 10  ? '#FC4E2A' :
           value > 5   ? '#FD8D3C' :
                         '#FED976';
  };

  const style = (feature) => {
    const state = feature.properties.state_name;
    const value = no2Data[state] || 0;
    return {
      fillColor: getColor(value),
      weight: 2,
      opacity: 0.5,
      color: 'black',
      dashArray: '3'
    };
  };

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {geoData && (
        <GeoJSON
          data={geoData}
          style={style}
        >
          <Tooltip>
            {(layer) => {
              const state = layer.feature.properties.state_name;
              const value = no2Data[state] || 'N/A';
              return `<strong>${state}</strong><br/>NO2 Value: ${value}`;
            }}
          </Tooltip>
        </GeoJSON>
      )}
    </MapContainer>
  );
};

export default ChloroplethMap;
