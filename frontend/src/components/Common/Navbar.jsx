import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiMenu, HiX } from 'react-icons/hi';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const {cart}=useSelector((state)=>state.cart);
  const cartitemcount=cart?.products?.reduce((acc,product)=>acc+product.quantity,0)||0;
  const {user}=useSelector((state)=>state.auth);


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className='w-full flex items-center justify-between py-4 px-6 bg-black shadow-md' ref={navbarRef}>
        {/* Logo */}
        <div className='text-2xl font-semibold text-white'>
          <Link to='/'>Shop<span className='text-cyan-300'>Sphere</span></Link>
        </div>

        {/* Desktop Nav Links */}
        <div className='hidden md:flex space-x-6'>
          <Link to='/collections/all?gender=Men' className='text-white hover:text-gray-400'>Men</Link>
          <Link to='/collections/all?gender=Women' className='text-white hover:text-gray-400'>Women</Link>
          <Link to='/collections/all?category=Top Wear' className='text-white hover:text-gray-400'>Top Wear</Link>
          <Link to='/collections/all?category=Bottom Wear' className='text-white hover:text-gray-400'>Bottom Wear</Link>
        </div>

        {/* Right Icons */}
        <div className='flex items-center space-x-6'>
          {
            user && user.role==="admin" && (
              <Link to="/admin" className='block text-black bg-white text-sm px-4 py-2 rounded hover:bg-gray-400 cursor-pointer '>Admin</Link>
            )
          }

          <SearchBar className="text-white cursor-pointer" searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

          <Link to='/profile' className='text-white hover:text-gray-400 flex items-center'>
            <HiOutlineUser size={24} />
          </Link>

          <button className='relative text-white hover:text-gray-400 flex items-center' onClick={toggleCartDrawer}>
            <HiOutlineShoppingBag size={24} />
            {
              cartitemcount>0 &&( <span className='absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>{cartitemcount}</span>)
            }
           
          </button>


          {/* Hamburger Icon for Mobile */}
          <div className='md:hidden'>
            <button onClick={() => setIsSidebarOpen(true)} className='text-white focus:outline-none'>
              <HiMenu size={30} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
          <span className='text-xl font-bold'>Menu</span>
          <button onClick={() => setIsSidebarOpen(false)}>
            <HiX size={28} className="text-white" />
          </button>
        </div>
        <div className='flex flex-col p-4 space-y-4'>
          <Link to='/collections/all?gender=Men' onClick={() => setIsSidebarOpen(false)} className='hover:text-gray-400'>Men</Link>
          <Link to='/collections/all?gender=Women'onClick={() => setIsSidebarOpen(false)} className='hover:text-gray-400'>Women</Link>
          <Link to='/collections/all?category=Top Wear' onClick={() => setIsSidebarOpen(false)} className='hover:text-gray-400'>Top Wear</Link>
          <Link to='/collections/all?category=Bottom Wear' onClick={() => setIsSidebarOpen(false)} className='hover:text-gray-400'>Bottom Wear</Link>
        </div>
      </div>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
};

export default Navbar;
