import React from 'react';
import topicList from '../data/topicList.js';
import '../css/TopicSelector.css';

function TopicSelector() {
  const topics = Object.keys(topicList);

  return (
    <div className="topic-selector">
      {topics.map((topic) => {
        const [emoji, ...nameParts] = topic.split(' ');
        const name = nameParts.join(' ');
        return (
          <button key={topic} className="topic-button">
            <span className="topic-emoji">{emoji}</span>
            <span className="topic-name">{name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TopicSelector;