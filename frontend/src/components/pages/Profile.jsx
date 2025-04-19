import React, { useEffect } from 'react';
import MyOrderspage from './MyOrderspage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authslice';
import { clearCart } from '../../redux/slices/cartSlice';

const Profile = () => {

  const {user} =useSelector((state)=>state.auth);
  const navigate=useNavigate();
  const dispatch=useDispatch();


  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
  },[user,navigate])

  const handlelogout=()=>{
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Left Section */}
          <div className='w-full md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow p-6'>
            <div className='text-center'>
              <img
                src='https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg'
                alt='Avatar'
                className='w-24 h-24 rounded-full mx-auto mb-4'
              />
              <h1 className='text-xl font-semibold text-gray-800'>{user?.name}</h1>
              <p className='text-gray-500 mb-4'>{user?.email}</p>
              <button
              onClick={handlelogout}
               className='w-full bg-black hover:bg-red-600 text-white py-2 px-4 rounded'>
                Logout
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className='w-full md:w-2/3 lg:w-3/4'>
            <MyOrderspage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
