import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authslice'
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../../redux/slices/cartSlice';

const Register = () => {
  const [name, setName] = useState('');
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
          navigate(isCheckoutRedirect?"/checkout":"/")
        })
      }else{
        navigate(isCheckoutRedirect?"/checkout":"/")
      }
    }
  },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    dispatch(registerUser({ name, email, password }));

    console.log('Registering with:', { name, email, password });
    alert('Registration successful!');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold text-black mb-6">Shopshere</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create your account 👋</h2>
          <p className="text-gray-500 mb-8">Join us and start shopping in style!</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <p className='text-sm text-gray-500'>Password must be at least 6 characters long</p>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Register
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{' '}
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-black font-semibold hover:underline">
                           Login
              </Link>

            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Full Image */}
      <div className="hidden md:block w-full md:w-1/2 h-screen">
        <img
          src="https://p0.pikist.com/photos/248/20/people-girl-woman-beauty-model-landscape-dress-fashion-clothing.jpg"
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
