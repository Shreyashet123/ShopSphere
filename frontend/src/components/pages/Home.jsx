import React, { useEffect, useState } from 'react';
import Hero from '../Layout/Hero';
import GenderCollection from '../Products/GenderCollection';
import NewArrivals from '../Products/NewArrivals';
import ProductDetails from '../Products/ProductDetails';
import FeaturedCollection from '../Products/FeaturedCollection';
import FeatureSection from '../Products/FeatureSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchedProductByFilters } from '../../redux/slices/productSlice';
import ProductGrid from '../Products/ProductGrid';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSeller, setBestSeller] = useState(null);

  useEffect(() => {
    dispatch(
      fetchedProductByFilters({
        gender: 'Women',
        category: 'Bottom Wear',
        limit: 8,
      })
    );
    
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSeller(response.data);
      } catch (err) {
        console.error("Error fetching best seller: ", err);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />
      
      {/* Best-Seller Section */}
      <h2 className="text-3xl text-center font-bold mt-4 mb-4">Best Seller</h2>
      {bestSeller ? (
        <ProductDetails productId={bestSeller._id} />
      ) : (
        <p className="text-center">Loading...</p>
      )}
      
      <FeaturedCollection />
      <FeatureSection />
    </div>
  );
};

export default Home;
