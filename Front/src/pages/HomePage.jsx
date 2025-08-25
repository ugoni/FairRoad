import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import ExhibitionSlider from '../components/ExhibitionSlider';
import TopicSelector from '../components/TopicSelector';
import ExhibitionList from '../components/ExhibitionList';
import dummyExhibitions2 from '../data/dummyExhibitions2';
import '../css/HomePage.css';

function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const filteredExhibitions = selectedTopic
    ? dummyExhibitions2.filter(ex => ex.topic === selectedTopic)
    : [];
    
  return (
    <div className="mt-4">
      <h1 className="mb-2 fw-bold">Today's Hot Fairs</h1>
      <KakaoMap />
      <h1 className="mb-2 fw-bold mt-2">How about something like this?</h1>
      <ExhibitionSlider />
      <TopicSelector selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
      <div className="exhibition-grid2 mt-4">
        {filteredExhibitions.slice(0, 12).map(exhibition => (
          <ExhibitionList key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
      {filteredExhibitions.length > 12 && (
      <div className="text-end mt-2">
        <Link to="/topics" className="more-link">
          More &gt;
        </Link>
      </div>
    )}
    </div>
  );
}

export default HomePage;
