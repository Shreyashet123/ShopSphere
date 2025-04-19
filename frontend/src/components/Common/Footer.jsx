import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const clothingImages = [
    "https://images.unsplash.com/photo-1743229995736-06cff31b9157?w=500&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1666789257692-ea5cf4218ae5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1605022600390-071c6f969b32?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1724184888115-e76e42f53dcc?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1666932521085-447127f3dcff?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1634001112793-60a4c8f34875?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1742290646655-be0801c8ee8d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1700932878277-0c590a33eac4?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1711583065828-994921fbfa5b?w=500&auto=format&fit=crop&q=60",
  ];

  return (
    <footer className="bg-black text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop Now</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to='/collections/all?gender=Men' className="hover:text-cyan-300">Men</Link></li>
            <li><Link to='/collections/all?gender=Women' className="hover:text-cyan-300">Women</Link></li>
            <li><Link tto='/collections/all?category=Top Wear' className="hover:text-cyan-300">Top Wear</Link></li>
            <li><Link to='/collections/all?category=Bottom Wear' className="hover:text-cyan-300">Bottom Wear</Link></li>
          </ul>
        </div>

        {/* Call Us */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Call Us</h4>
          <p className="text-sm">📞 +1 (234) 567-8901</p>
          <p className="text-sm mt-2">📧 support@shopsphere.com</p>
          <p className="text-sm mt-2">⏰ Mon - Fri: 9AM - 6PM</p>
        </div>

        {/* Additional Features */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Additional Features</h4>
          <ul className="text-sm space-y-2">
            <li>🔄 7-day return policy</li>
            <li>🚚 Free shipping over $100</li>
            <li>💳 Secure payments</li>
            <li>🎁 Gift cards available</li>
          </ul>
        </div>

        {/* Instagram Pics and Social Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us on Instagram</h4>

          <div className="grid grid-cols-3 gap-2 ">
            {clothingImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Clothing ${index + 1}`}
                className="w-full h-[60px] object-cover border border-black"
              />
            ))}
          </div>

          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 text-xl"
            >
              <i className="ri-instagram-line"></i>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 text-xl"
            >
              <i className="ri-facebook-circle-line"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-8 text-gray-400 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
