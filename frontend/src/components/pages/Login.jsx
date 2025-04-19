import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {loginUser} from '../../redux/slices/authslice'
import { mergeCart } from '../../redux/slices/cartSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const {user,guestId}=useSelector((state)=>state.auth);
  const  {cart} =useSelector((state)=>state.cart);

  const redirect=new URLSearchParams(location.search).get('redirect') || '/';
  const isCheckoutRedirect=redirect.includes("checkout");
  useEffect(() => {
    if (user) {
      if(cart?.products.length>0 && guestId){
        dispatch(mergeCart({guestId,user})).then(()=>{
          navigate(isCheckoutRedirect?"checkout":"/")
        })
      }else{
        navigate(isCheckoutRedirect?"checkout":"/")
      }
    }
  },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }
  
    try {
      const action = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(action)) {
        alert('Login successful!');
        // You can redirect here if needed, e.g. navigate('/')
      } else {
        alert(action.payload || 'Login failed');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10">
        <h1 className="text-4xl font-bold text-black mb-6">Shopshere</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Hey there 👋</h2>
        <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{' '}
            <Link to={`/register/?redirect=${encodeURIComponent(redirect)}`} className="text-black font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side: Full-height Image */}
      <div className="hidden md:block w-full md:w-1/2 h-screen">
        <img
          src="https://p0.pikist.com/photos/248/20/people-girl-woman-beauty-model-landscape-dress-fashion-clothing.jpg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
