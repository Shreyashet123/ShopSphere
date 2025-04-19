import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
const dispatch=useDispatch();
const navigate=useNavigate();
const {user}= useSelector((state)=>state.auth)
const {orders,loading,error}=useSelector((state)=>state.adminOrders);
useEffect(()=>{
  if(!user || user.role!=='admin'){
    navigate('/')
  }else{
    dispatch(fetchAllOrders());
  }
},[dispatch,user,navigate])


const handleStatusChange= (orderId, status) => {
  dispatch(updateOrderStatus({id:orderId,status}));
}

if(loading) return <p>Loading...</p>
if (error) return <p className="text-red-500">Error: {error?.message || error}</p>

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Orders Management</h2>
      <div className='overflow-x-auto shadow-md sm:rounded-lg bg-white'>
        <table className='min-w-full text-left text-sm text-gray-700'>
          <thead className='bg-gray-100 text-xs uppercase text-gray-600'>
            <tr>
              <th className='py-3 px-4'>Order ID</th>
              <th className='py-3 px-4'>Customer</th>
              <th className='py-3 px-4'>Total Price</th>
              <th className='py-3 px-4'>Status</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
          {orders.length > 0 ? (
  orders.map((order) => (
    <tr key={order._id} className='border-b hover:bg-gray-50 transition'>
      <td className='py-3 px-4 font-medium text-gray-900'>{order._id}</td>
      <td className='py-3 px-4'>{order.user?.name || "Unknown"}</td>
      <td className='py-3 px-4'>${order.totalPrice.toFixed(2)}</td>
      <td className='py-3 px-4'>
        <select
          value={order.status}
          onChange={(e) =>
            handleStatusChange(order._id, e.target.value)
          }
          className='border border-gray-300 rounded px-2 py-1 focus:outline-none'
        >
          <option value='Processing'>Processing</option>
          <option value='Shipped'>Shipped</option>
          <option value='Delivered'>Delivered</option>
          <option value='Cancelled'>Cancelled</option>
        </select>
      </td>
      <td className='py-3 px-4'>
        {order.status !== 'Delivered' && (
          <button
            onClick={() => handleStatusChange(order._id, 'Delivered')}
            className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
          >
            Mark as Delivered
          </button>
        )}
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan='5' className='text-center py-6 text-gray-500 font-medium'>
      No orders found.
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderManagement
