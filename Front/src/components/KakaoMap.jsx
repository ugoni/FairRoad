import React, { useState } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import { dummyExhibitions } from '../data/dummyExhibitions';
import '../css/KakaoMap.css';

function KakaoMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [bounds, setBounds] = useState(null);

    const handleBoundsChanged = (map) => {
    const newBounds = map.getBounds();
    setBounds(newBounds);
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


  return (
    <div className="map-wrapper">
      <Map
        center={{ lat: 37.5665, lng: 126.978 }}
        style={{ width: '100%', height: '400px', borderRadius: '12px', border: '2px solid #ccc' }}
        level={8}
        onBoundsChanged={handleBoundsChanged}
        onClick={() => setSelectedMarker(null)}
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
        <ul className="list-group">
          {visibleExhibitions.map((item) => (
            <li
              key={item.id}
              className="list-group-item list-group-item-action"
              onClick={() => setSelectedMarker(item)}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  selectedMarker?.id === item.id ? '#e0f7fa' : 'white',
              }}
            >
              <strong>{item.title}</strong>
              <br />
              <small>{item.address}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default KakaoMap;
