import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { removefromcart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        guestId,
        userId,
        size,
        color,
      }));
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removefromcart({
      productId,
      guestId,
      userId,
      size,
      color,
    }));
  };

  return (
    <div>
      {
        cart.products.map((product, index) => (
          <div key={index} className='flex justify-between items-center py-4 border-b border-gray-200 px-4'>
            <div className='flex items-center'>
              <img src={product.image} alt={product.name} className='w-20 h-20 mr-4 rounded object-cover' />
              <div>
                <h3 className='font-medium'>{product.name}</h3>
                <p className='text-gray-500 text-sm'>Size: {product.size} | Color: {product.color}</p>
                <div className='flex items-center mt-2'>
                  <button
                    onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}
                    className='border border-gray-200 rounded px-2 text-xl font-medium mb-1'
                  >-</button>
                  <span className='mx-2 text-sm border border-gray-200 rounded px-2 py-1 mb-1'>{product.quantity}</span>
                  <button
                    onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}
                    className='border border-gray-200 rounded px-2 text-xl font-medium mb-1'
                  >+</button>
                </div>
              </div>
            </div>

            <div className='text-right'>
              <p className='text-gray-500 text-sm'>${product.price.toLocaleString()}</p>
              <button
                onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
                className='text-red-500 text-sm'
              >
                <FaTrash className='h-4 w-4 mt-2 text-red-600' />
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default CartContents;
