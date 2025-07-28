import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import interestList from '../data/topicList';
import '../css/InterestPage.css';

function InterestPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  const handleInterestClick = (Interest) => {
    setSelectedInterests(prevSelectedInterests =>
      prevSelectedInterests.includes(Interest)
        ? prevSelectedInterests.filter(t => t !== Interest)
        : [...prevSelectedInterests, Interest]
    );
  };

  const handleSubmit = () => {
    console.log('Selected Interests:', selectedInterests);
    navigate('/'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <p style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '0' }}>Choose your interests</p>
        <div className="interest-container">
          {Object.values(interestList).flat().map(Interest => (
            <button
              key={Interest}
              className={`interest-btn ${selectedInterests.includes(Interest) ? 'selected' : ''}`}
              onClick={() => handleInterestClick(Interest)}
            >
              {Interest}
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

export default InterestPage;
