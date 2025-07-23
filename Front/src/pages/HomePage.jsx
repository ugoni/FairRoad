import React from 'react';
import KakaoMap from '../components/KakaoMap';
import ExhibitionSlider from '../components/ExhibitionSlider';

function HomePage() {
  return (
    <div className="mt-4">
      <h1 className="mb-2 fw-bold">Today's Hot Fairs</h1>
      <KakaoMap />
      <h1 className="mb-2 fw-bold mt-2">How about something like this?</h1>
      <ExhibitionSlider />
    </div>
  );
}

export default HomePage;
