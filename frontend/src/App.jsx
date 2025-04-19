import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './components/pages/Home'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from 'sonner'
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Collectionpage from './components/pages/Collectionpage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import OrderDetailspage from './components/pages/OrderDetailspage';
import MyOrderspage from './components/pages/MyOrderspage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/pages/AdminHomePage';

import ProductMangement from './components/Admin/ProductMangement';
import EditProduct from './components/Admin/EditProduct';
import OrderManagement from './components/Admin/OrderManagement';

import {Provider} from 'react-redux';
import store from './redux/store';
import Protectedroutes from './components/Common/Protectedroutes';
import UserManagement from './components/Admin/UserMangement';
import ReviewsManagement from './components/Admin/ReviewsManagement';
import CreateProductForm from './components/Admin/CreateProductForm';




const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
   <Toaster position="top-right"/>
   <Routes>
    <Route path="/" element={<UserLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="profile" element={<Profile/>}/>
      <Route path="collections/:collection" element={<Collectionpage/>}/>
      <Route path="product/:id" element={<ProductDetails/>}/>
      <Route path="checkout" element={<Checkout/>}/>
      <Route path="order-success" element={<OrderConfirmationPage/>}/>
      <Route path="order/:id" element={<OrderDetailspage/>}/>
      <Route path="my-orders" element={<MyOrderspage/>}/>
    </Route>
    {/* Admin Layout */}
    <Route path="/admin" 
    element={<Protectedroutes role="admin">
      <AdminLayout />
    </Protectedroutes>}>
      <Route index element={<AdminHomePage />} />
      <Route path="users" element={<UserManagement/>} />
      <Route path="products" element={<ProductMangement />} />
      <Route path="products/:id/edit" element={<EditProduct/>}/>
      <Route path="orders" element={<OrderManagement/>}/>
      <Route path="reviews" element={<ReviewsManagement />} /> 
      <Route path="products/create" element={<CreateProductForm/>} /> {/* ✅ MOVE THIS HERE */}
      
  </Route>
   </Routes>

   </BrowserRouter>
    </Provider>
  
   
  )
}

export default App