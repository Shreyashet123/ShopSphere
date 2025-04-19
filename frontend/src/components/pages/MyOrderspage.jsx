import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../redux/slices/orderSlice';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error.message}</div>;

  return (
    <div className='bg-white rounded-2xl shadow p-6'>
      <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>My Orders</h2>

      {orders.length === 0 ? (
        <div className='text-center text-gray-500'>No orders found.</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 text-sm text-gray-700'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='px-6 py-4 text-left'>Image</th>
                <th className='px-6 py-4 text-left'>Order ID</th>
                <th className='px-6 py-4 text-left'>Created</th>
                <th className='px-6 py-4 text-left'>Address</th>
                <th className='px-6 py-4 text-left'>Items</th>
                <th className='px-6 py-4 text-left'>Total</th>
                <th className='px-6 py-4 text-left'>Status</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className='px-6 py-4'>
                    <div className="flex gap-2 flex-wrap">
                      {order.orderItems.map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className='w-10 h-10 object-cover rounded'
                        />
                      ))}
                    </div>
                  </td>
                  <td className='px-6 py-4'>{order._id}</td>
                  <td className='px-6 py-4'>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>
                    {order.shippingAddress
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4'>
                    {order.orderItems.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.qty}
                      </div>
                    ))}
                  </td>
                  <td className='px-6 py-4'>₹{order.totalPrice}</td>
                  <td className='px-6 py-4'>
                    {order.isPaid ? (
                      <span className='text-green-600 font-medium'>Paid</span>
                    ) : (
                      <span className='text-yellow-600 font-medium'>Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
