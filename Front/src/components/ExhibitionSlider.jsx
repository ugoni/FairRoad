import React, { useState } from 'react';
import { dummyExhibitions } from '../data/dummyExhibitions';
import '../css/ExhibitionSlider.css';

const ExhibitionSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = dummyExhibitions.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const getSlideIndex = (offset) => {
    return (currentIndex + offset + total) % total;
  };

  return (
    <div className="slider-container border p-3">
      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={prevSlide}>
          &#10094;
        </button>

        <div className="slider-track">
          {[ -1, 0, 1 ].map((offset) => {
            const slide = dummyExhibitions[getSlideIndex(offset)];
            return (
              <div
                key={slide.id}
                className={`slider-card ${offset === 0 ? 'active' : 'inactive'}`}
              >
                <h3>{slide.title}</h3>
                <p>{slide.address}</p>
              </div>
            );
          })}
        </div>

        <button className="slider-btn right" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ExhibitionSlider;
