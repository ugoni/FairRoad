import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ExhibitionList.css';

function ExhibitionList({ exhibition }) {

  return (
    <Link to={`/exhibition/${exhibition.id}`} className="exhibition-list-link">
      <div className="exhibition-list">
        <div className="list-image-wrapper">
          <img src={exhibition.image} alt={exhibition.name} className="list-image" />
        </div>
        <div className="list-info">
          <div className="info-text">
            <h5 className="list-title">{exhibition.name}</h5>
            <p className="list-location">{exhibition.place}</p>
            <p className="list-date">{exhibition.date}</p>
            <p className="list-details">-------------Details-------------</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ExhibitionList;
