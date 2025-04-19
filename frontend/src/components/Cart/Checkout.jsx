import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalbutton from './PayPalbutton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [checkoutId, setCheckoutId] = useState(null);

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    const isFormFilled = Object.values(shippingAddress).every(val => val.trim() !== '');
    if (!isFormFilled) {
      alert('Please fill in all fields.');
      return;
    }

    if (cart && cart.products.length > 0) {
      try {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "PayPal",
            totalPrice: cart.totalPrice,
          })
        );

        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);
        }
      } catch (err) {
        console.error("Checkout creation failed", err);
      }
    }
  };

  const handlePayPalSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      
        await handleFinalizeCheckout(checkoutId);
   
    } catch (error) {
      console.error("Payment Failed", error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
        navigate("/order-success");
      
    } catch (error) {
      console.error("Error finalizing checkout", error);
    }
  };

  if (loading) return <h1>Loading Cart...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <h1>Cart is Empty</h1>;
  }

  return (
    <div className='max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8'>
      {/* Left Section */}
      <div className='bg-white rounded-lg p-8 shadow-lg'>
        <h2 className='text-3xl font-bold uppercase mb-6 text-center'>Checkout</h2>

        <form onSubmit={handleCreateCheckout} className='space-y-4'>
          <h3 className='text-xl font-semibold mb-2'>Contact Details</h3>
          <div>
            <label className='block text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              value={user ? user.email : ''}
              disabled
              className='w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed'
            />
          </div>

          <h3 className='text-xl font-semibold mt-6 mb-2'>Shipping Address</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              value={shippingAddress.firstName}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              value={shippingAddress.lastName}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
          </div>

          <input
            type='text'
            name='address'
            placeholder='Address'
            value={shippingAddress.address}
            onChange={handleChange}
            className='w-full border border-gray-300 px-4 py-2 rounded-md'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={shippingAddress.city}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
            <input
              type='text'
              name='postalCode'
              placeholder='Postal Code'
              value={shippingAddress.postalCode}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              name='country'
              placeholder='Country'
              value={shippingAddress.country}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
            <input
              type='text'
              name='phone'
              placeholder='Phone'
              value={shippingAddress.phone}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-md'
            />
          </div>

          {!checkoutId ? (
            <button type='submit' className='w-full mt-6 bg-black text-white py-3 rounded-md'>
              Continue To Payment
            </button>
          ) : (
            <div className='mt-6'>
              <h3 className='text-lg mb-4 font-semibold'>Pay With PayPal</h3>
              <PayPalbutton
                amount={cart.totalPrice}
                onSuccess={handlePayPalSuccess}
                onError={() => alert("Payment Failed. Try Again")}
              />
            </div>
          )}
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className='bg-gray-50 p-6 rounded-lg shadow-md'>
        <h3 className='text-xl font-semibold mb-4'>Order Summary</h3>
        <div className='border-t py-4 mb-4'>
          {cart.products.map((product, index) => (
            <div key={index} className='flex items-center justify-between py-2 border-b'>
              <img src={product.image} alt={product.name} className='w-12 h-12 object-cover mr-4' />
              <div className='flex-1 ml-4'>
                <h4 className='text-md font-medium'>{product.name}</h4>
                <p className='text-gray-500 text-sm'>Size: {product.size}</p>
                <p className='text-gray-500 text-sm'>Color: {product.color}</p>
                <p className='text-gray-500 text-sm'>Qty: {product.quantity}</p>
              </div>
              <span className='text-sm font-semibold'>${product.price}</span>
            </div>
          ))}
        </div>
        <div className='text-sm'>
          <div className='flex justify-between py-1'>
            <span>Subtotal</span>
            <span>${cart.subtotalPrice || cart.totalPrice}</span>
          </div>
          <div className='flex justify-between py-1'>
            <span>Shipping</span>
            <span>${cart.shippingPrice || '0.00'}</span>
          </div>
          <div className='flex justify-between font-semibold py-2 border-t mt-2'>
            <span>Total</span>
            <span>${cart.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
