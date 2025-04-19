import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';



const OrderConfirmationPage = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {checkout}=useSelector((state)=>state.checkout);
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);
  
  const calculateEstimateDelivery = (createdAt) => {
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-10">
        Thank You For Your Order!
      </h1>

      {checkout && (
        <div className="space-y-6">
          {/* Order Info */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Order ID: <span className="text-gray-700">{checkout._id}</span></h2>
            <p className="text-gray-600">Order Date: {new Date(checkout.createdAt).toLocaleDateString()}</p>
            <p className="text-emerald-600 font-medium mt-1">
              Estimated Delivery: {calculateEstimateDelivery(checkout.createdAt)}
            </p>
          </div>

          {/* Shipping Address from Array */}
          {checkout.shippingAddress.length > 0 && (
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              {checkout.shippingAddress.map((address, index) => (
                <div key={index}>
                  <p>{address.name}</p>
                  <p>{address.address1}</p>
                  <p>{address.city}, {address.country}</p>
                </div>
              ))}
            </div>
          )}

          {/* Payment & Delivery Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <p>{checkout.paymentMethod}</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Delivery Method</h3>
              <p>{checkout.deliveryMethod}</p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {checkout.checkoutItems.map((item) => (
                <div key={item.productId} className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">Color:{item.color} | Size:{item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">${item.price}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
