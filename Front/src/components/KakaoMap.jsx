import React, { useState, useRef } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import { dummyExhibitions } from '../data/dummyExhibitions';
import '../css/KakaoMap.css';

function KakaoMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(8);
  const mapRef = useRef();

  const handleBoundsChanged = (map) => {
    const newBounds = map.getBounds();
    setBounds(newBounds);
    setZoomLevel(map.getLevel());
  };

  const isVisible = (latlng) => {
    if (!bounds) return true;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return (
      latlng.lat >= sw.getLat() &&
      latlng.lat <= ne.getLat() &&
      latlng.lng >= sw.getLng() &&
      latlng.lng <= ne.getLng()
    );
  };

  const visibleExhibitions = dummyExhibitions.filter((exhibition) =>
    isVisible(exhibition.latlng)
  );

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    const newLevel = Math.max(1, map.getLevel() - 1);
    map.setLevel(newLevel);
    setZoomLevel(newLevel);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    const newLevel = Math.min(14, map.getLevel() + 1);
    map.setLevel(newLevel);
    setZoomLevel(newLevel);
  };

  return (
    <div className="map-wrapper">
      <Map
        center={{ lat: 37.5665, lng: 126.978 }}
        style={{ width: '100%', height: '400px', borderRadius: '12px', border: '2px solid #ccc' }}
        level={zoomLevel}
        onBoundsChanged={handleBoundsChanged}
        onClick={() => setSelectedMarker(null)}
        ref={mapRef}
      >
        {dummyExhibitions.map((exhibition) => (
          <MapMarker
            key={exhibition.id}
            position={exhibition.latlng}
            onClick={() => setSelectedMarker(exhibition)}
          />
        ))}

        {selectedMarker && (
          <MapInfoWindow
            position={selectedMarker.latlng}
            onClose={() => setSelectedMarker(null)}
          >
            <div style={{ padding: '10px', fontSize: '12px' }}>
              <h4>{selectedMarker.title}</h4>
              <p>{selectedMarker.address}</p>
            </div>
          </MapInfoWindow>
        )}
      </Map>
      <div className="map-floating-list">
        <ul className="list-unstyled">
          {visibleExhibitions.map((item) => (
            <li
              key={item.id}
              className="list-group-item list-group-item-action"
              onClick={() => setSelectedMarker(item)}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  selectedMarker?.id === item.id ? '#e0f7fa' : 'white',
                marginBottom: '10px',
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              <strong>{item.title}</strong>
              <br />
              <small>{item.address}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className="zoom-controls">
        <button onClick={zoomOut} className="zoom-button" disabled={zoomLevel >= 14}>
          -
        </button>
        <button onClick={zoomIn} className="zoom-button" disabled={zoomLevel <= 1}>
          +
        </button>
      </div>
    </div>
  );
}

export default KakaoMap;
