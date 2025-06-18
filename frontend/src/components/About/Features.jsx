import React from "react";

const features = [
  "Seamless Online Booking",
  "AI-Powered Recommendations",
  "Secure Transactions",
  "24/7 Customer Support",
  "Exclusive Deals & Discounts",
];

const FeatureSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center p-6 md:p-12 bg-gray-100">
      {/* Left Section */}
      <div className="flex flex-col items-center md:w-1/2">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 pb-6">Key Features <br/> of SoftHire</h2>
        <ul className="space-y-3 pt-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-lg">
              <span className="text-blue-600 mr-2">✔</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex flex-col items-center mt-6 md:mt-0">
        <img
          src="About/image31.svg"
          alt="Seamless Booking Illustration"
          className="w-full max-w-md"
        />
        <h3 className="text-4xl font-bold mt-4">Seamless Online Booking</h3>
        <p className="text-gray-800 mt-2 text-center">
          Our intuitive and user-friendly booking system ensures a hassle-free
          experience. With just a few clicks, you can browse, compare, and
          secure your reservations instantly.
        </p>
      </div>
    </div>
  );
};

export default FeatureSection;
