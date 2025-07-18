import React from 'react';
import { Map } from 'react-kakao-maps-sdk';

function KakaoMap() {
  return (
    <Map
      center={{ lat: 37.5665, lng: 126.9780 }} // 지도의 중심 좌표 (서울 시청)
      style={{ width: '100%', height: '400px' }} // 지도 크기
      level={3} // 지도 확대 레벨
    >
      {/* 나중에 마커 추가 */}
    </Map>
  );
}

export default KakaoMap;
