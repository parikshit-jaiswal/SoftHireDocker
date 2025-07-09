import React from "react";
import { SubscriptionDetails as plans, SingleTimeServices as oneTimePlans } from "@/constants/plans";
import { useNavigate } from "react-router-dom";

const PricingDetails = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/demo");
  };

  return (
    <>

      <div className="flex flex-col items-center p-8 mb-5">
        <h1 className="text-4xl font-bold">Subscription Plans</h1>
        <p className="text-black-600 mt-2">Select the best plan for your needs</p>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 shadow-md relative bg-white"
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {index === 0 ? "Just License" : "Most Common"}
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-gray-500">{plan.description}</p>
              <p className="text-3xl font-bold mt-4">{plan.price}</p>
              <button
                className="mt-4 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleClick}
              >
                Request Pricing
              </button>
              <h3 className="font-bold mt-4">Features</h3>
              <p className="text-gray-500 text-sm">
                Everything in the {plan.name}
              </p>
              <ul className="text-left mt-2 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-500 text-sm "
                  >
                    <img src="pricing/tick.svg" alt="tick" className="pt-1" />{" "}
                    <span className="ml-2 pt-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold">Single-Time Services</h1>
        {/* <p className="text-black-600 mt-2">Select the best ser for your needs</p> */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {oneTimePlans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 shadow-md relative bg-white"
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {index === 0 ? "Just License" : "Most Common"}
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-gray-500">{plan.description}</p>
              <p className="text-3xl font-bold mt-4">{plan.price}</p>
              <button
                className="mt-4 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleClick}
              >
                Request Pricing
              </button>
              {/* <h3 className="font-bold mt-4">Features</h3> */}
              {/* <p className="text-gray-500 text-sm">
                Everything in the {plan.name}
              </p> */}
              <ul className="text-left mt-2 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-500 text-sm "
                  >
                    <img src="pricing/tick.svg" alt="tick" className="pt-1" />{" "}
                    <span className="ml-2 pt-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PricingDetails;
