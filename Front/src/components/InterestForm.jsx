import React, { useState } from 'react';
import interestList from '../data/topicList';
import '../css/InterestForm.css'

function InterestForm({ onInterestSubmit }) {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleInterestClick = (interest) => {
    setSelectedInterests(prevSelectedInterests =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter(t => t !== interest)
        : [...prevSelectedInterests, interest]
    );
  };

  const handleSubmit = () => {
    onInterestSubmit(selectedInterests);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <p style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '0' }}>Choose your interests</p>
        <div className="interest-container">
          {Object.values(interestList).flat().map(interest => (
            <button
              key={interest}
              className={`interest-btn ${selectedInterests.includes(interest) ? 'selected' : ''}`}
              onClick={() => handleInterestClick(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-interest-submit"
        onClick={handleSubmit}
        disabled={selectedInterests.length < 3}
      >
        Sign up
      </button>
    </div>
  );
}

export default InterestForm;
