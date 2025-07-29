import React, { useState } from 'react';
import TopicSelector from '../components/TopicSelector';
import ExhibitionCard from '../components/ExhibitionCard';
import dummyExhibitions2 from '../data/dummyExhibitions2';
import '../css/TopicListPage.css';

function TopicListPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredExhibitions = selectedTopic
    ? dummyExhibitions2.filter(ex => ex.topic === selectedTopic)
    : [];

  return (
    <div className="mt-4">
      <h1 className="mb-2 fw-bold mt-4">Collect by Topic</h1>
      <TopicSelector selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

      <div className="exhibition-grid mt-4">
        {filteredExhibitions.map(exhibition => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
    </div>
  );
}

export default TopicListPage;
