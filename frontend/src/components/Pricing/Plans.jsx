import React from "react";
import { plans } from "@/constants/plans";
const PricingPlans = () => {

  return (
    <div className="flex flex-col items-center py-12">
      <h2 className="text-4xl  font-bold">Pricing Plans for Organisations</h2>
      <p className="text-gray-500 mt-2">Select the best plan for your needs</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="border rounded-lg p-5 shadow-sm w-80 relative"
          >
            {plan.popular && (
              <span className="absolute top-0 right-0 bg-red-400 text-white text-xs px-2 py-1 rounded-bl-md">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-black-500 mb-4">{plan.description}</p>
            <p className="text-3xl font-bold">{plan.price} <span className="text-base font-normal">{plan.per}</span></p>
            <button className="bg-red-400 text-white py-2 px-4 mt-4 w-full rounded">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
