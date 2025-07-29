// ExhibitionCard.jsx
import React from 'react';
import '../css/ExhibitionCard.css';

function ExhibitionCard({ exhibition }) {
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
        </div>
        <div className="bookmark">
          <img width="25" height="15" 
          src="https://img.icons8.com/ios/50/1A1A1A/bookmark-ribbon.png" alt="bookmark-ribbon"/>
        </div>
      </div>
    </div>
  );
}

export default ExhibitionCard;
