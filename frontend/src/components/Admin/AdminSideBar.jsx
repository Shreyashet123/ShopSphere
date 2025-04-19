import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaStore,FaStar } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authslice'
import { clearCart } from '../../redux/slices/cartSlice'

const AdminSideBar = () => {

  const navigate = useNavigate()
  const dispatch=useDispatch()
  

  const handleLogout = () => {
    // Clear auth if needed
    dispatch(logout());
    dispatch(clearCart())
    navigate('/login')
  }

  return (
    <div className='p-6 h-full flex flex-col justify-between'>
      <div>
        {/* Logo */}
        <div className='mb-6'>
          <Link to="/admin" className='text-2xl font-semibold text-white'>
            ShopSphere
          </Link>
        </div>

        {/* Shop Button */}
        <div className='mb-6'>
          <NavLink
            to="/"
            className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition duration-200 w-full text-center"
          >
            <FaStore />
            <span>Go to Shop</span>
          </NavLink>
        </div>

        {/* Admin Nav */}
        <h2 className='text-xl font-medium mb-4 text-center'>Admin Dashboard</h2>
        <nav className='flex flex-col space-y-2'>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Users</span>
          </NavLink>
          <NavLink
    to="/admin/products/create"
    className={({ isActive }) =>
      isActive
        ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
        : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
    }
  >
    <FaStore />
    <span>Create Product</span>
  </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            }
          >
            <FaUser />
            <span>Orders</span>
          </NavLink>

          <NavLink
  to="/admin/reviews"
  className={({ isActive }) =>
    isActive
      ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
      : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
  }
>
  <FaStar />
  <span>Reviews</span>
</NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition duration-200"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default AdminSideBar
