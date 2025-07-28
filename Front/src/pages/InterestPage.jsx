import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import topicList from '../data/topicList';
import '../css/InterestPage.css';

function InterestPage() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopics(prevSelectedTopics =>
      prevSelectedTopics.includes(topic)
        ? prevSelectedTopics.filter(t => t !== topic)
        : [...prevSelectedTopics, topic]
    );
  };

  const handleSubmit = () => {
    console.log('Selected topics:', selectedTopics);
    navigate('/'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <p style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '0' }}>Choose your interests</p>
        <div className="topic-container">
          {Object.values(topicList).flat().map(topic => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopics.includes(topic) ? 'selected' : ''}`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      <button
          type="button"
          className="btn btn-interest-submit"
          onClick={handleSubmit}
          disabled={selectedTopics.length === 0}
        >
          Sign up
      </button>
    </div>
  );
}

export default InterestPage;
