import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, User, ArrowRight, Briefcase, LogOut } from "lucide-react";
import { ApplicationCard } from "@/components/Dashboard/ApplicationCard";
import RecommendedJobCard from "@/components/Dashboard/RecommendedJobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, setSelectedJob } from "@/redux/UserJobSlice";
import { useNavigate } from "react-router-dom";
import userService from "@/Api/UserService";
import profileService from "@/Api/profileService";
import { logout } from "@/Api/AuthService";

export default function SoftHireApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]); // Track applied job IDs
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const jobsState = useSelector((state) => state.userJobs || {});
  const { jobs = [], loading = false, error = null } = jobsState;

  useEffect(() => {
    dispatch(fetchAllJobs());
    loadUserData();
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingApplications(true);
      
      // Load user profile from profileService
      const profileResult = await profileService.getCurrentUserProfile();
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }

      // Load recent applications - limit to 4
      const applicationsResult = await userService.getAppliedJobs();
      if (applicationsResult.success) {
        const formatted = userService.formatApplicationData(applicationsResult.data);
        setRecentApplications(formatted.slice(0, 4));
        
        // Extract applied job IDs for comparison with available jobs
        const jobIds = applicationsResult.data.map(app => {
          // Try different possible ID fields from the API response
          return app.jobId || app.job?._id || app.job?.id || app._id || app.id;
        }).filter(Boolean); // Remove any undefined/null values
        
        console.log("Applied Job IDs:", jobIds); // Debug log
        setAppliedJobIds(jobIds);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleJobSelect = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/dashboard/job-details/${job._id}`);
  };

  const handleApplicationDetails = (applicationId) => {
    // Navigate to applied page with specific application expanded
    navigate('/dashboard/applied', { state: { expandedId: applicationId } });
  };

  const handleViewAllApplications = () => {
    navigate('/dashboard/applied');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowProfileDropdown(false);
      
      // Call the logout API
      const result = await logout();
      
      if (result.success || result.message) {
        // Clear any stored user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear any Redux state if needed
        // dispatch(clearUserData()); // Uncomment if you have a clearUserData action
        
        // Navigate to login page
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const getProfileCompleteness = (profile) => {
    if (!profile) return 0;
    
    const fields = [
      profile.name || profile.user?.fullName,
      profile.bio,
      profile.location,
      profile.skills?.length > 0,
      profile.workExperience?.length > 0,
      profile.education?.college,
      profile.profileImage || profile.user?.avatar
    ];
    
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Check if a job has been applied to
  const isJobApplied = (jobId) => {
    return appliedJobIds.includes(jobId);
  };

  const completeness = getProfileCompleteness(userProfile);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get display name
  const displayName = userProfile?.name || userProfile?.user?.fullName || "User";
  const firstName = displayName.split(' ')[0];

  // Get profile image
  const profileImage = userProfile?.profileImage || userProfile?.user?.avatar;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 p-4 md:p-6">
        {/* Header - Responsive (Removed Bell Notification) */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <div className="text-xl md:text-2xl font-bold">SoftHire</div>
            <div className="text-xs md:text-sm text-gray-500">{currentDate}</div>
          </div>
          <div className="flex items-center">
            {/* Profile Dropdown - Now the only element in the header right section */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                onClick={toggleProfileDropdown}
                disabled={isLoggingOut}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center ${profileImage ? 'hidden' : 'flex'}`}
                >
                  <User size={14} className="md:w-4 md:h-4" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isLoggingOut ? "Logging out..." : "Click for options"}
                  </span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`hidden sm:block md:w-4 md:h-4 transition-transform ${
                    showProfileDropdown ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>View Profile</span>
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut size={16} />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading overlay when logging out */}
        {isLoggingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Logging out...</span>
            </div>
          </div>
        )}

        {/* Welcome Section - Responsive */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Welcome back, {firstName}! 👋
          </h1>

          {/* Profile Completion Banner - Responsive */}
          {completeness < 100 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Complete your profile</h3>
                  <p className="text-blue-700 text-sm">
                    {completeness}% complete - Add more details to get better job matches
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/dashboard/profile")}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Complete Profile
                </button>
              </div>
              <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Recent Applications Section - Responsive */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold">Recent Applications</h2>
              {recentApplications.length > 0 && (
                <button 
                  onClick={handleViewAllApplications}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <span>View All Applications</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {loadingApplications ? (
              <div className="flex justify-center py-8 bg-white rounded-lg border">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading applications...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app, idx) => (
                    <ApplicationCard 
                      key={app.id || idx} 
                      application={app}
                      onViewDetails={() => handleApplicationDetails(app.id)}
                      showViewDetails={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500 bg-white rounded-lg border">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm md:text-base">No applications yet. Start applying to jobs!</p>
                    <button 
                      onClick={() => navigate("/dashboard/jobs")}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base transition-colors"
                    >
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Jobs Section - Now with Applied Status Check */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold">Recommended Jobs</h2>
            <button 
              onClick={() => navigate("/dashboard/jobs")}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              <span>View All Jobs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-8 bg-white rounded-lg border">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading jobs...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 bg-white rounded-lg border">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => dispatch(fetchAllJobs())}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          <div className="space-y-4">
            {!loading && !error && jobs.slice(0, 6).map((job, idx) => (
              <RecommendedJobCard
                key={job._id || idx}
                job={job}
                onLearnMore={() => handleJobSelect(job)}
                isCompact={true}
                isApplied={isJobApplied(job._id)} // Pass applied status
              />
            ))}
          </div>

          {/* Show More Jobs Button */}
          {!loading && !error && jobs.length > 6 && (
            <div className="text-center mt-6">
              <button 
                onClick={() => navigate("/dashboard/jobs")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View More Jobs ({jobs.length - 6} more available)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
