import React from 'react';
import TopicSelector from '../components/TopicSelector';
function HomePage() {
  return (
    <div className="mt-4">
      <h1 className="mb-2 fw-bold mt-4">Collect by Topic</h1>
      <TopicSelector />
    </div>
  );
}

export default HomePage;
