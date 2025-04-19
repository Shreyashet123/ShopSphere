import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products,loading,error }) => {
  if(loading){
    return <p>Loading...</p>
  }
  if(error){
    return <p>Error: {error}</p>
  }
  if (!Array.isArray(products)) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {products.map((item) => (
        <Link
          key={item._id}
          to={`/product/${item._id}`}
          className='block group'
        >
          <div className='bg-white p-4 rounded-2xl shadow hover:shadow-xl transition duration-300'>
            <div className='w-full h-80 overflow-hidden rounded-xl mb-4'>
              <img
  
                src={item.images?.[0]?.url}
                alt={item.images?.[0]?.altText || item.name}

                className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
              />
            </div>
            <div className='flex flex-col items-start'>
              <h3 className='text-lg font-semibold text-gray-800 mb-1'>
                {item.name}
              </h3>
              <p className='text-sm font-medium text-black'>${item.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default ProductGrid;