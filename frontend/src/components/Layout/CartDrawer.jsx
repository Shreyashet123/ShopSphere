import React from 'react';
import { IoMdClose } from 'react-icons/io';
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg
      transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
      
      {/* close button */}
      <div className='flex justify-end p-4'>
        <button onClick={toggleCartDrawer} className='cursor-pointer'>
          <IoMdClose className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {/* cart contents */}
      <div className='flex-grow overflow-y-auto'>
        <h2 className='text-sm font-semibold mb-4 p-2'>Your Cart Items</h2>
        {
          cart && cart.products.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p className='text-center text-gray-500 text-sm'>Your Cart is Empty</p>
          )
        }
      </div>

      {/* checkout button */}
      <div className='p-4 bg-white sticky bottom-0'>
        {
          cart && cart.products.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className='w-full bg-purple-900 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-400'
              >
                Checkout
              </button>
              <p className='text-xs text-gray-500 mt-2'>
                Applicable shipping fees, taxes, and discounts will be calculated at checkout.
              </p>
            </>
          )
        }
      </div>
    </div>
  );
};

export default CartDrawer;
