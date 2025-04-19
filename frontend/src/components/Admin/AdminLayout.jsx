import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminSideBar from './AdminSideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
      {/* Mobile Toggle Button */}
      <div className='flex md:hidden items-center p-4 bg-gray-900 text-white z-30'>
        <button onClick={toggleSideBar} className='flex items-center space-x-3'>
          <FaBars size={24} />
          <h1 className='text-xl font-medium'>Admin Dashboard</h1>
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden'
          onClick={toggleSideBar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white fixed md:relative top-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static z-20`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
      >
        <AdminSideBar />
      </div>

      {/* Content */}
      <div className='flex-grow p-6 overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
