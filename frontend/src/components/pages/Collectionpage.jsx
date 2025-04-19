import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSideBar from '../Products/FilterSideBar';
import SortOptions from '../Products/SortOptions';
import ProductGrid from '../Products/ProductGrid';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchedProductByFilters } from '../../redux/slices/productSlice';

const Collectionpage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, totalProducts, loading, error } = useSelector((state) => state.products);

  const queryParams = Object.fromEntries([...searchParams]);
  const sideBarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(queryParams.page) || 1);
  const limit = 8;

  const totalPages = Math.ceil(totalProducts / limit);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutside = (e) => {
    if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const query = { ...queryParams, collections: collection, page: currentPage, limit };
    dispatch(fetchedProductByFilters(query));
  }, [dispatch, collection, searchParams, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    navigate(`?${newParams.toString()}`);
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* Mobile Filter Button */}
      <div className='lg:hidden p-4'>
        <button
          onClick={toggleSidebar}
          className='flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition'
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sideBarRef}
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed z-50 top-0 left-0 w-64 h-full bg-white border-r shadow-md overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:border-none`}
      >
        <FilterSideBar />
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4'>
        <h2 className='text-2xl font-bold mb-4'>All Collections</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`px-4 py-2 rounded border ${
                currentPage === 1 || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {loading && currentPage !== 1 ? 'Loading...' : 'Previous'}
            </button>

            <span className="text-lg font-semibold">
              {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {loading && currentPage !== totalPages ? 'Loading...' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collectionpage;
