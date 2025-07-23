import React from 'react';
import KakaoMap from '../components/KakaoMap';
import ExhibitionSlider from '../components/ExhibitionSlider';
// import TopicSelector from '../components/TopicSelector';
function HomePage() {
  return (
    <div className="mt-4">
      <h1 className="mb-2 fw-bold">Today's Hot Fairs</h1>
      <KakaoMap />
      <h1 className="mb-2 fw-bold mt-2">How about something like this?</h1>
      <ExhibitionSlider />
      <h1 className="mb-2 fw-bold mt-4">Collect by Topic</h1>
      {/* <TopicSelector /> */}
    </div>
  );
}

export default HomePage;
