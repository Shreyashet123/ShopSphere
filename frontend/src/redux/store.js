import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice'; 
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/AdminSlice";  // Fixed this line
import adminProductReducer from './slices/AdminProductSlice';
import adminOrdersReducer from './slices/adminOrderSlice';
import adminReviewsReducer from './slices/adminReviews';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,  // Now correctly pointing to your admin slice
    adminProducts: adminProductReducer,
    adminOrders: adminOrdersReducer,
    adminReviews: adminReviewsReducer

  },
});

export default store;