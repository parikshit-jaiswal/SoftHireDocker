import React from "react";
import { MapPin } from "lucide-react";

const JobCard = ({ job, isSaved, onSave }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="text-gray-500">{job.company}</p>

          {job.activelyHiring && (
            <span className="inline-block mt-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs">
              Actively hiring
            </span>
          )}

          {job.growingFast && (
            <div className="flex items-center mt-2 text-xs text-gray-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span className="ml-1">Growing Fast</span>
            </div>
          )}

          <div className="flex mt-4 space-x-6">
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>{job.salary}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center text-white text-xl font-bold mb-2`}
          >
            {job.logo}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-2 space-x-2">
        <button
          className="px-4 py-2 border border-gray-800 bg-gray-800 text-white rounded"
          onClick={onSave}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
