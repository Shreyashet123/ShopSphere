import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchedProductByFilters, setFilters } from '../../redux/slices/productSlice';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchTerm);
    dispatch(setFilters({search:searchTerm}));
    dispatch(fetchedProductByFilters({search:searchTerm}));
    navigate(`/collections/all?search=${searchTerm}`)
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? 'absolute top-0 left-0 w-full bg-white h-24 z-50' : 'w-auto'
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearchSubmit}
          className='relative flex items-center justify-center w-full'
        >
          <div className='relative w-full sm:w-1/2 md:w-1/3 lg:w-1/2'>
            <input
              type='text'
              placeholder='Search'
              className='w-full h-10 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type='submit'
              className='absolute right-2 top-2'
            >
              <HiMagnifyingGlass className='h-6 w-6 text-gray-400 cursor-pointer' />
            </button>
          </div>

          {/* Close button */}
          <button
            type='button'
            onClick={handleClose}
            className='absolute right-14 top-2 text-gray-500'
          >
            <HiMiniXMark className='h-6 w-6' />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className='h-6 w-6 text-white cursor-pointer' />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
