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
      slidesPerView={3}
      spaceBetween={30}
      navigation={true}
      pagination={{ clickable: true }}
      watchSlidesProgress={true} // 슬라이드 진행 상태 감시 활성화
      onProgress={(swiper) => {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress;
          const scale = 1 - Math.abs(slideProgress) * 0.2; // 중앙에서 멀어질수록 작아짐
          slide.style.transform = `scale(${scale})`;
          slide.style.opacity = 1 - Math.abs(slideProgress) * 0.5; // 중앙에서 멀어질수록 투명해짐
        });
      }}
      className="swiper-container"
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
