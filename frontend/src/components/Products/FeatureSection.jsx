import React from 'react';
import { FaShippingFast, FaShieldAlt } from 'react-icons/fa';
import { BsArrowRepeat } from 'react-icons/bs';

const features = [
  {
    icon: <FaShippingFast className="text-4xl text-green-600" />,
    title: 'Free Worldwide Delivery',
    description: 'Shop from anywhere — we’ll bring your order to your doorstep at no extra cost.',
  },
  {
    icon: <BsArrowRepeat className="text-4xl text-green-600" />,
    title: 'Hassle-Free Returns',
    description: 'Changed your mind? Return within 45 days — no questions asked.',
  },
  {
    icon: <FaShieldAlt className="text-4xl text-green-600" />,
    title: '100% Secure Payments',
    description: 'Your data is safe. Checkout with confidence using industry-standard protection.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-gray-100 mb-4 ml-4 mr-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-3 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
