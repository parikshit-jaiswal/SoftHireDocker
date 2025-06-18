import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleContactSales = (e) => {
    e.preventDefault();
    // console.log('Contact Sales clicked with data:', formData);
    // Add your sales contact logic here
  };

  const handleStartFreeTrial = (e) => {
    e.preventDefault();
    // console.log('Start Free Trial clicked with data:', formData);
    // Add your free trial logic here
  };

  return (
    <div className="flex flex-col md:flex-row p-8 bg-white rounded-lg shadow-sm max-w-6xl mx-auto gap-2">
      <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-6 md:mb-0 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Get Started Now</h1>
        <p className="text-md text-gray-700">
          Sign up for a free trial or contact our sales team for more information
        </p>
      </div>
      
      <div className="w-full md:w-1/2">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-2xl font-medium text-gray-900 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Required</p>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-2xl font-medium text-gray-900 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Required</p>
          </div>
          
          <div className="flex justify-between gap-4 pt-4">
            <button
              onClick={handleContactSales}
              className="flex-1 px-6 py-3 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-center"
            >
              Contact Sales
            </button>
            <button
              onClick={handleStartFreeTrial}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center"
            >
              Start Free Trial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;