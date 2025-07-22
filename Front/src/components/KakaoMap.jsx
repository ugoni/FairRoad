import React, { useState } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import { dummyExhibitions } from '../data/dummyExhibitions';

function KakaoMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <Map
      center={{ lat: 37.5665, lng: 126.9780 }} // 지도의 중심 좌표 (서울 시청)
      style={{width: '100%', height: '400px', border: '2px solid #ccc', 
            borderRadius: '12px', overflow: 'hidden'}}
      level={8} // 지도 확대 레벨
      onClick={() => setSelectedMarker(null)}
    >
      {dummyExhibitions.map((exhibition) => (
        <MapMarker
          key={exhibition.id}
          position={exhibition.latlng}
          onClick={(e) => {
            e.stopPropagation?.(); 
            setSelectedMarker(exhibition);
          }}
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
  );
}

export default KakaoMap;
