import React from "react";

function PricingBanner() {
  return (
    <div className="h-[65vh] mt-[4rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/pricing/bgp.svg')] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white">
      <div className="relative text-center flex flex-col items-center justify-center z-10 gap-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Transparent Pricing for All <br /> Your Needs
        </h1>
        <p className="mt-2 text-md md:text-lg">
          Flexible plans for organizations and individuals. Choose
          <br /> the plan that suits you best, with no hidden fees.
        </p>
      </div>
    </div>
  );
}

export default PricingBanner;
