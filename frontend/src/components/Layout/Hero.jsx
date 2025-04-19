import React, { useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import hero1 from '../../assets/hero1.avif';
import hero2 from '../../assets/hero2.webp';
import hero3 from '../../assets/hero3.jpg';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom arrows
const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
    onClick={onClick}
  >
    <RiArrowLeftSLine size={30} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
    onClick={onClick}
  >
    <RiArrowRightSLine size={30} />
  </div>
);

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [hero1, hero2, hero3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    fade: false,
    cssEase: 'ease-in-out',
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  return (
    <section className="w-full flex items-center justify-center py-10 mt-">
      <div className="w-full max-w-7xl px-4 relative">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center h-[300px] md:h-[500px] lg:h-[600px]"
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="object-cover h-full w-full rounded-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white p-4 md:p-6 lg:p-10 bg-opacity-40 rounded-md">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Fashnova
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl mb-6 max-w-xl mx-auto">
                    Style that speaks volumes – shop the latest arrivals in men's and women's fashion.
                  </p>
                  <Link
                    to="/collections/all"
                    className="inline-block bg-white text-black px-6 py-3 text-lg rounded-sm hover:bg-gray-200 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Hero;
