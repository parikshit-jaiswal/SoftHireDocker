import React from 'react';
import { MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD: Import useNavigate

export default function RecommendedJobCard({ job, onLearnMore, isApplied = false }) {
  const navigate = useNavigate(); // ✅ ADD: Navigation hook

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

  // ✅ ADD: Handle apply button click
  const handleApplyClick = () => {
    // Navigate to job details page where user can apply
    navigate(`/dashboard/job-details/${job._id}`);
  };

  return (
    <div className={`bg-white rounded-lg border transition-shadow ${
      isApplied 
        ? 'border-green-200 shadow-sm bg-green-50/50' 
        : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {job.companyName?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  {isApplied && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle size={12} />
                      <span>Applied</span>
                    </div>
                  )}
                </div>
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

        {/* Action Buttons Section */}
        <div className="flex justify-end gap-2">
          <button 
            onClick={onLearnMore}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          
          {isApplied ? (
            <div className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md cursor-not-allowed">
              <CheckCircle size={16} />
              <span>Already Applied</span>
            </div>
          ) : (
            <button 
              onClick={handleApplyClick} // ✅ UPDATED: Navigate to job details
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}