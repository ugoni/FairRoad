import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { dummyExhibitions } from '../data/dummyExhibitions';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/ExhibitionSlider.css';

const ExhibitionSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      loop={true}
      centeredSlides={true}
      spaceBetween={30}
      navigation={true}
      pagination={{ clickable: true }}
      watchSlidesProgress={true}
      onProgress={(swiper) => {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress;
          const scale = 1 - Math.abs(slideProgress) * 0.2;
          slide.style.transform = `scale(${scale})`;
          slide.style.opacity = 1 - Math.abs(slideProgress) * 0.5;
        });
      }}
      className="swiper-container"
      breakpoints={{
        // 640px 이상일 때
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // 768px 이상일 때
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        // 1024px 이상일 때
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      }}
    >
      {dummyExhibitions.map((exhibition) => (
        <SwiperSlide key={exhibition.id}>
          <h3>{exhibition.title}</h3>
          <p>{exhibition.address}</p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ExhibitionSlider;
