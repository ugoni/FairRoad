import React from 'react';
import '../css/ExhibitionList.css';

function ExhibitionList({ exhibition }) {

  return (
    <div className="exhibition-list">
      <div className="list-image-wrapper">
        <img src={exhibition.image} alt={exhibition.name} className="list-image" />
      </div>
      <div className="list-info">
        <div className="info-text">
          <h5 className="list-title">{exhibition.name}</h5>
          <p className="list-location">{exhibition.place}</p>
          <p className="list-date">{exhibition.date}</p>
          <p className="list-details">----------------Details-----------------</p>
        </div>
      </div>
    </div>
  );
}

export default ExhibitionList;
