import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../../redux/slices/AdminProductSlice';
import { fetchAllOrders } from '../../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading: productsloading,
    error: producterror,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalSales,
    loading: ordersloading,
    error: orderserror,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Admin Dashboard</h1>

      {productsloading || ordersloading ? (
        <p>Loading ..</p>
      ) : producterror ? (
        <p className='text-red-500'>Error Fetching Products: {producterror}</p>
      ) : orderserror ? (
        <p className='text-red-500'>Error Fetching Orders: {orderserror}</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
            <div className='bg-white shadow-sm p-6 rounded-lg border border-gray-200'>
              <h2 className='text-lg font-medium text-gray-600 mb-2'>Revenue</h2>
              <p className='text-2xl font-semibold text-green-600'>
                ${totalSales?.toFixed(2) || 0}
              </p>
            </div>

            <div className='bg-white shadow-sm p-6 rounded-lg border border-gray-200 flex flex-col justify-between'>
              <div>
                <h2 className='text-lg font-medium text-gray-600 mb-2'>Total Orders</h2>
                <p className='text-2xl font-semibold text-blue-600'>{orders.length}</p>
              </div>
              <Link
                to="/admin/orders"
                className='mt-4 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition'
              >
                Manage Orders
              </Link>
            </div>

            <div className='bg-white shadow-sm p-6 rounded-lg border border-gray-200 flex flex-col justify-between'>
              <div>
                <h2 className='text-lg font-medium text-gray-600 mb-2'>Total Products</h2>
                <p className='text-2xl font-semibold text-purple-600'>{products.length}</p>
              </div>
              <Link
                to="/admin/products"
                className='mt-4 inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded hover:bg-purple-700 transition'
              >
                Manage Products
              </Link>
            </div>
          </div>

          {/* Orders Table */}
          {orders.length > 0 ? (
            <div className='bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-200'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Order ID</th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>User</th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Total Price</th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {orders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 text-sm text-gray-700'>{order._id}</td>
                      <td className='px-6 py-4 text-sm text-gray-700'>{order.user?.name || 'Guest'}</td>
                      <td className='px-6 py-4 text-sm text-gray-700'>${order.totalPrice.toFixed(2)}</td>
                      <td className='px-6 py-4 text-sm'>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-600 border border-gray-200">
              No orders found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
