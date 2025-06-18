import React from 'react';
import { features } from '@/constants/plans';

const PricingTable = () => {

  return (
    <div className="p-6 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 font-bold text-lg w-1/4">Features</th>
              <th className="text-center py-4 px-4 font-bold text-lg w-1/4">Basic Plan</th>
              <th className="text-center py-4 px-4 font-bold text-lg w-1/4">Standard Plan</th>
              <th className="text-center py-4 px-4 font-bold text-lg w-1/4">Premium Plan</th>
            </tr>
          </thead>
          <tbody>
            {features.map((category, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td className="py-4 px-4 font-bold border-b" colSpan={4}>
                    {category.category}
                  </td>
                </tr>
                {category.items.map((item, itemIdx) => (
                  <tr key={itemIdx} className="border-b">
                    <td className="py-4 px-4 text-gray-600">{item.name}</td>
                    <td className="py-4 px-4 text-center">
                      {item.basic ? 
                        <div className="mx-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div> : 
                        <div className="mx-auto w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">✕</div>
                      }
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.standard ? 
                        <div className="mx-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div> : 
                        <div className="mx-auto w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">✕</div>
                      }
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.premium ? 
                        <div className="mx-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div> : 
                        <div className="mx-auto w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">✕</div>
                      }
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr>
              <td className="py-4 px-4"></td>
              <td className="py-4 px-4 text-center">
                <button className="bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded">
                  Get Started
                </button>
              </td>
              <td className="py-4 px-4 text-center">
                <button className="bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded">
                  Get Started
                </button>
              </td>
              <td className="py-4 px-4 text-center">
                <button className="bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded">
                  Get Started
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingTable;