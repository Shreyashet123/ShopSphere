import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCollection = () => {
  return (
    <section className='py-16 px-6 lg:px-0'>
      <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-100 rounded-3xl overflow-hidden shadow-lg'>
        {/* Left Content */}
        <div className='lg:w-1/2 p-8 lg:p-12 text-center lg:text-left'>
          <h2 className='text-xl font-semibold text-green-800 mb-4'>
            Comfort Meets Style
          </h2>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6'>
            Everyday Essentials Designed Just For You
          </h1>
          <p className='text-gray-700 text-base md:text-lg mb-8'>
            Discover our exclusive collection tailored for your daily comfort and style. Whether you're working from home or out with friends, our outfits blend modern design with maximum ease.
          </p>
          <Link
            to='/collections/all'
            className='inline-block bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition'
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className='lg:w-1/2'>
          <img
            src='https://images.unsplash.com/photo-1679136343735-d3d41d9fd038?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Featured Collection'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
