import React from 'react';
import { useParams } from 'react-router-dom';
import dummyExhibitions2 from '../data/dummyExhibitions2';
import '../css/DetailPage.css';
import Calendar from '../components/Calendar';

const DetailPage = () => {
  const { id } = useParams();
  const exhibition = dummyExhibitions2.find(ex => ex.id === parseInt(id));

  if (!exhibition) {
    return <div>전시회를 찾을 수 없습니다.</div>;
  }

  const [startDateStr, endDateStr] = exhibition.date.split(' ~ ');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-3 text-center">
          <img
            src={exhibition.image}
            alt={exhibition.name}
            className="img-fluid border"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
          <button className="btn btn-info mt-3 w-100">예매하기</button>
        </div>
        <div className="col-md-9">
          <h4 className="fw-bold">{exhibition.name}</h4>
          <p className="text-muted">{exhibition.organizer || '주최'}</p>
          <div className="d-flex flex-wrap">
          </div>
          <div className="row mt-2">
            <div className="col-md-6 mb-2">
              <div className="row">
                <div className="col-12">
                  <p className="me-4">
                    <strong>Date</strong> {exhibition.date}
                  </p>
                  <Calendar date={startDate} startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="col-12">
                <p className="me-4">
                  <strong>Location</strong> {exhibition.place}
                </p>
                <div style={{ height: '200px', border: '1px solid black' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item col-6 text-center border-end">
              <a className="nav-link active" href="#details" style={{ backgroundColor: '#f8f9fa' }}>
                상세 정보
              </a>
            </li>
            <li className="nav-item col-6 text-center">
              <a className="nav-link" href="#reviews" style={{ backgroundColor: '#e9ecef' }}>
                리뷰
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
