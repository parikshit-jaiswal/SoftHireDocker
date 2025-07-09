import React from "react";
import { Calendar, MapPin, Building, Briefcase, Eye, ArrowRight } from "lucide-react";

export function ApplicationCard({ application, onViewDetails, showViewDetails = false }) {
  const getStatusColor = (status) => {
    const statusColors = {
      "Pending": "bg-yellow-400",
      "Submitted": "bg-blue-400",
      "Under Review": "bg-purple-400",
      "Interview Scheduled": "bg-green-400",
      "Shortlisted": "bg-emerald-400",
      "Rejected": "bg-red-400",
      "Withdrawn": "bg-gray-400",
      "Accepted": "bg-green-600",
      "Offer Extended": "bg-emerald-600"
    };
    return statusColors[status] || "bg-gray-400";
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return "?";
    return companyName
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500",
      "bg-yellow-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"
    ];
    const hash = companyName ? companyName.split("").reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        <div className={`w-10 h-10 ${getCompanyColor(application.company)} text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
          {getCompanyInitials(application.company)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate mb-1">
            {application.jobTitle}
          </h3>
          <div className="flex items-center space-x-1 text-gray-600 mb-2">
            <Building size={12} className="flex-shrink-0" />
            <span className="text-xs md:text-sm truncate">{application.company}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2 mb-3">
        <span className={`w-2 h-2 ${getStatusColor(application.status)} rounded-full`}></span>
        <span className="text-xs md:text-sm font-medium text-gray-900">{application.status}</span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center space-x-1 text-gray-500">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="text-xs truncate">{application.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <Briefcase size={12} className="flex-shrink-0" />
          <span className="text-xs">{application.jobType}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <Calendar size={12} className="flex-shrink-0" />
          <span className="text-xs">Applied: {application.appliedDate}</span>
        </div>
      </div>

      {/* Skills */}
      {Array.isArray(application.skills) && application.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {application.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {skill}
            </span>
          ))}
          {application.skills.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{application.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* View Details Button */}
      {showViewDetails && onViewDetails && (
        <button 
          onClick={onViewDetails}
          className="flex items-center justify-center space-x-1 w-full py-2 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors text-sm font-medium"
        >
          <Eye size={14} />
          <span>View Details</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
