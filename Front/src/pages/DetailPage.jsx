import React from 'react';
import { useParams } from 'react-router-dom';
import dummyExhibitions2 from '../data/dummyExhibitions2';
import '../css/DetailPage.css';

const DetailPage = () => {
  const { id } = useParams();
  const allExhibitions = [...dummyExhibitions2];
  const exhibition = allExhibitions.find(ex => ex.id === parseInt(id));

  if (!exhibition) {
    return <div>전시회를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <img src={exhibition.image} alt={exhibition.name} className="detail-image" />
        <div className="detail-info">
          <h1>{exhibition.name}</h1>
          <p><strong>Date </strong> {exhibition.date}</p>
          <p><strong>Location </strong> {exhibition.place}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
