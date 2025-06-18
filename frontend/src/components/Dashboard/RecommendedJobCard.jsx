import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';

export default function RecommendedJobCard({ job, onLearnMore }) {
  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `${salary.currency || '$'}${salary.min}-${salary.max}`;
    }
    return 'Salary not specified';
  };

  const formatLocation = (locations) => {
    if (locations && locations.length > 0) {
      return locations.join(', ');
    }
    return 'Location not specified';
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {job.companyName?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.companyName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{formatLocation(job.location)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{job.jobType}</span>
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {job.isHiring && (
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Actively Hiring
                </span>
              )}
              {job.remotePolicy && (
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {job.remotePolicy}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              Posted {formatPostedDate(job.postedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onLearnMore}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}