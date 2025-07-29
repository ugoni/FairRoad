import React from 'react';
import '../css/ExhibitionCard.css'; 

function ExhibitionCard({ exhibition }) {
  return (
    <div className="exhibition-card">
      <img src={exhibition.image} alt={exhibition.name} className="exhibition-image" />
      <div className="exhibition-info">
        <h5 className="exhibition-name">{exhibition.name}</h5>
        <p className="exhibition-place">{exhibition.place}</p>
        <p className="exhibition-date">{exhibition.date}</p>
      </div>
    </div>
  );
}

export default ExhibitionCard;
