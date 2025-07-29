import React, { useState } from 'react';
import '../css/ExhibitionCard.css';

function ExhibitionCard({ exhibition }) {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(prev => !prev);
  };

  return (
    <div className="exhibition-card">
      <div className="card-image-wrapper">
        <img src={exhibition.image} alt={exhibition.name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="info-text">
          <h5 className="card-title">{exhibition.name}</h5>
          <p className="card-location">{exhibition.place}</p>
          <p className="card-date">{exhibition.date}</p>
          <p className="card-details">----------------Details-----------------</p>
          <div
            className="bookmark"
            onClick={toggleBookmark}
            role="button"
          >
            <img
              width="25" height="20"
              src={
                bookmarked
                  ? "https://img.icons8.com/ios-filled/50/fa314a/bookmark-ribbon.png"
                  : "https://img.icons8.com/ios/50/1A1A1A/bookmark-ribbon.png" 
              }
              alt="bookmark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExhibitionCard;
