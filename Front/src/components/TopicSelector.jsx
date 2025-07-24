import React, { useState, useEffect, useRef } from 'react';
import topicList from '../data/topicList.js';
import '../css/TopicSelector.css';

function TopicSelector() {
  const topics = Object.keys(topicList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const intervalRef = useRef(null);

  const visibleTopics = 8;
  const maxIndex = topics.length > visibleTopics ? topics.length - visibleTopics : 0;

  useEffect(() => {
   
    clearInterval(intervalRef.current);

    if (selectedTopic === null && topics.length > visibleTopics) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1));
      }, 10000); 
    }

    return () => clearInterval(intervalRef.current);
  }, [selectedTopic, topics.length, maxIndex]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(prevSelected => (prevSelected === topic ? null : topic));
  };

  const topicButtonWidth = 120;
  const topicButtonGap = 16; 
  const scrollAmount = topicButtonWidth + topicButtonGap;

  return (
    <div className="topic-selector-wrapper">
      <div
        className="topic-selector"
        style={{ transform: `translateX(-${currentIndex * scrollAmount}px)` }}
      >
        {topics.map((topic) => {
          const [emoji, ...nameParts] = topic.split(' ');
          const name = nameParts.join(' ');
          return (
            <button
              key={topic}
              className={`topic-button ${selectedTopic === topic ? 'selected' : ''}`}
              onClick={() => handleTopicClick(topic)}
            >
              <span className="topic-emoji">{emoji}</span>
              <span className="topic-name">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TopicSelector;