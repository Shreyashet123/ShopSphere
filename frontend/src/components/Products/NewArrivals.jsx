import React, { useEffect, useRef, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [newarrivals, setNewArrivals] = useState([]);
  const [canScroll, setCanScroll] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [newarrivals]);

  const isNewArrival = (createdAt) => {
    const oneHour = 60 * 60 * 1000;
    return Date.now() - new Date(createdAt).getTime() < oneHour;
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight text-gray-900">
          Explore New Arrivals
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Discover the latest trends handpicked just for you — stylish, comfortable, and made to impress.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {canScroll && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black cursor-pointer bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <RiArrowLeftSLine size={28} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-6 hide-scrollbar"
        >
          {newarrivals.map((item) => (
            <div
              key={item._id}
              className="min-w-[240px] md:min-w-[280px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative"
            >
              {item.images?.[0]?.url ? (
                <Link to={`/product/${item._id}`}>
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].altText || item.name}
                    className="w-full h-[340px] object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    draggable="false"
                  />
                </Link>
              ) : (
                <div className="w-full h-[340px] bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* New Arrival Badge */}
              {isNewArrival(item.createdAt) && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md animate-pulse">
                  New Arrival
                </span>
              )}

              <div className="p-4 text-left">
                <Link to={`/product/${item._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {canScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70 cursor-pointer"
          >
            <RiArrowRightSLine size={28} />
          </button>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
