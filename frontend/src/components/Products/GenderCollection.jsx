import React from 'react';
import { Link } from 'react-router-dom';
import gender1 from '../../assets/gender1.jpg';
import gender2 from '../../assets/gender2.webp';

const GenderCollection = () => {
  return (
    <section className="py-12 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Women's Collection */}
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden group">
          <img
            src={gender1}
            alt="Women's Collection"
            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
          />
          <div className="absolute inset-0  bg-opacity-30 group-hover:bg-opacity-50 transition duration-300" />
          <div className="absolute bottom-8 left-8 text-white z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="inline-block text-lg underline text-black hover:text-blue-300 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden group">
          <img
            src={gender2}
            alt="Men's Collection"
            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
          />
          <div className="absolute inset-0  bg-opacity-30 group-hover:bg-opacity-50 transition duration-300" />
          <div className="absolute bottom-8 left-8 text-white z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="inline-block text-lg underline text-black hover:text-blue-300 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GenderCollection;
