import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../../redux/slices/orderSlice';

const OrderDetailspage = () => {
  const { id } = useParams();
 const dispatch=useDispatch();
  const {orderDetails,loading,error}=useSelector((state)=>state.orders)
  useEffect(()=>{
    dispatch(fetchOrderDetails(id))
  },[dispatch,id]);
  
  if(loading) return <div>Loading...</div>
  if(error) return <div>Error: {error}</div>

 

  const calculateTotal = () => {
    return orderDetails?.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getHashedId = (rawId) => {
    try {
      return btoa(rawId).slice(0, 10); // Simple hash-like encoding
    } catch (e) {
      return rawId;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      {orderDetails && (
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center text-emerald-600 mb-6">🧾 Order Summary</h1>

          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Order ID:</span> #{getHashedId(orderDetails._id)}</p>
              <p><span className="font-semibold">Order Date:</span> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderDetails.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {orderDetails.isPaid ? '✅ Paid' : '❌ Unpaid'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderDetails.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {orderDetails.isDelivered ? '🚚 Delivered' : '📦 Delivery Pending'}
              </span>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">💳 Payment Info</h3>
              <p>Method: <span className="font-medium">{orderDetails.paymentMethod}</span></p>
              <p>Status: {orderDetails.isPaid ? '✅ Paid' : '❌ Not Paid'}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">🚚 Shipping Info</h3>
              <p>{orderDetails.shippingAddress.address}</p>
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
              <p>{orderDetails.shippingAddress.country}</p>
              <p>Method: {orderDetails.shippingMethod}</p>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-t">
                    <td className="px-4 py-4 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <span>{item.name}</span>
                    </td>
                    <td className="px-4 py-4">${item.price}</td>
                    <td className="px-4 py-4">{item.quantity}</td>
                    <td className="px-4 py-4 font-medium">${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan="3" className="px-4 py-3 text-right">Grand Total:</td>
                  <td className="px-4 py-3 text-emerald-700 text-lg">${calculateTotal()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Link to="/my-orders" className="bg-emerald-700 text-white px-4 py-2 rounded-md mt-4 inline-block">Back To My Orders</Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailspage;
