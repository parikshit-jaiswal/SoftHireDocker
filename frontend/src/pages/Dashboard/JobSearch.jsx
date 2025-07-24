import { useState, useEffect } from "react";
import { MapPin, User } from "lucide-react";
import RecommendedJobCard from "@/components/Dashboard/RecommendedJobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, setSelectedJob } from "@/redux/UserJobSlice";
import { useNavigate } from "react-router-dom";
import userService from "@/Api/UserService";

export default function JobSearch() {
  // ✅ ADD: Active tab state
  const [activeTab, setActiveTab] = useState("browse"); // "browse" or "applied"
  const [searchRole, setSearchRole] = useState("");       // For job title/role filter
  const [searchLocation, setSearchLocation] = useState(""); // For location filter
  const [appliedJobIds, setAppliedJobIds] = useState([]); // Track applied job IDs
  const [appliedJobs, setAppliedJobs] = useState([]); // ✅ ADD: Store full applied job data
  const [loadingAppliedJobs, setLoadingAppliedJobs] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobsState = useSelector((state) => state.userJobs || {});
  const { jobs = [], loading = false, error = null } = jobsState;

  useEffect(() => {
    dispatch(fetchAllJobs());
    loadAppliedJobs();
  }, [dispatch]);

  // ✅ FIXED: Load applied jobs data with full job details
  const loadAppliedJobs = async () => {
    try {
      setLoadingAppliedJobs(true);
      const applicationsResult = await userService.getAppliedJobs();
      console.log("Applied Jobs API Response:", applicationsResult); // Debug log
      
      if (applicationsResult.success) {
        // Store full applied jobs data
        setAppliedJobs(applicationsResult.data || []);
        
        // Extract applied job IDs
        const jobIds = applicationsResult.data.map(app => {
          return app.jobId || app.job?._id || app.job?.id || app._id || app.id;
        }).filter(Boolean);
        
        console.log("Extracted Applied Job IDs:", jobIds); // Debug log
        setAppliedJobIds(jobIds);
      }
    } catch (error) {
      console.error("Failed to load applied jobs:", error);
    } finally {
      setLoadingAppliedJobs(false);
    }
  };

  const handleJobSelect = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/dashboard/job-details/${job._id}`);
  };

  // Check if a job has been applied to
  const isJobApplied = (jobId) => {
    return appliedJobIds.includes(jobId);
  };

  // ✅ FIXED: Get jobs based on active tab
  const getJobsToDisplay = () => {
    if (activeTab === "applied") {
      console.log("Applied Jobs Data:", appliedJobs); // Debug log
      
      // For applied tab, extract job data from applications
      return appliedJobs.map(app => {
        console.log("Processing application:", app); // Debug log
        
        // Try different ways to get job data
        let jobData = null;
        
        if (app.job) {
          jobData = app.job; // Direct job object
        } else if (app.jobDetails) {
          jobData = app.jobDetails; // Job details object
        } else {
          // Create job object from application data
          jobData = {
            _id: app.jobId || app._id,
            title: app.jobTitle || app.title || "Job Title Not Available",
            companyName: app.companyName || app.company || "Company Not Available",
            location: app.location || ["Location Not Available"],
            salary: app.salary || { min: 0, max: 0, currency: "£" },
            jobType: app.jobType || "Not Specified",
            skills: app.skills || [],
            postedAt: app.appliedAt || app.createdAt || new Date(),
            isHiring: true,
            jobDescription: app.jobDescription || "No description available"
          };
        }
        
        console.log("Final job data:", jobData); // Debug log
        return jobData;
      }).filter(job => job && job._id); // Filter out invalid jobs
    } else {
      // For browse tab, return all jobs with filtering
      return jobs.filter((job) => {
        const roleMatch = searchRole === "" || job.title
          .toLowerCase()
          .includes(searchRole.toLowerCase());
        
        // job.location might be an array or string; handle both
        const locationData = Array.isArray(job.location)
          ? job.location.join(", ").toLowerCase()
          : (job.location || "").toLowerCase();
        const locationMatch = searchLocation === "" || locationData.includes(searchLocation.toLowerCase());

        return roleMatch && locationMatch;
      });
    }
  };

  const displayJobs = getJobsToDisplay();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Search for Jobs</h2>

        {/* ✅ UPDATED: Tabs with functional switching */}
        <div className="flex mb-4 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("browse")}
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === "browse" 
                ? "text-gray-900 border-gray-900" 
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Browse All
          </button>
          <button 
            onClick={() => setActiveTab("applied")}
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === "applied" 
                ? "text-gray-900 border-gray-900" 
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Applied{" "}
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm">
              {appliedJobIds.length}
            </span>
          </button>
        </div>

        {/* ✅ REMOVED: Saved searches section completely */}
        {/* ✅ UPDATED: Only show search form for Browse tab */}
        {activeTab === "browse" && (
          <div className="flex mb-6 gap-4">
            <div className="flex items-center w-1/2 border border-gray-300 rounded-lg p-3 bg-white">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Add a Job Title"
                className="flex-1 outline-none"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              />
            </div>
            <div className="flex items-center w-1/2 border border-gray-300 rounded-lg p-3 bg-white">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Add a Location"
                className="flex-1 outline-none"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {activeTab === "applied" 
                ? "Applied Jobs" 
                : (searchRole || searchLocation ? 'Search Results' : 'All Jobs')
              }
            </h2>
            <div className="text-sm text-gray-600">
              {displayJobs.length} jobs found
              {activeTab === "browse" && appliedJobIds.length > 0 && (
                <span className="ml-2 text-green-600">
                  • {appliedJobIds.length} applied
                </span>
              )}
            </div>
          </div>

          {/* ✅ UPDATED: Loading states for different tabs */}
          {(loading && activeTab === "browse") || (loadingAppliedJobs && activeTab === "applied") ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">
                  {activeTab === "applied" ? "Loading applied jobs..." : "Loading jobs..."}
                </span>
              </div>
            </div>
          ) : null}

          {error && activeTab === "browse" && (
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

          <div className="flex flex-col gap-4">
            {!loading && !loadingAppliedJobs && displayJobs.length > 0 ? (
              displayJobs.map((job, idx) => (
                <RecommendedJobCard
                  key={job._id || idx}
                  job={job}
                  onLearnMore={() => handleJobSelect(job)}
                  isApplied={activeTab === "applied" ? true : isJobApplied(job._id)}
                />
              ))
            ) : !loading && !loadingAppliedJobs ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="text-gray-500">
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === "applied" ? "No applications yet" : "No jobs found"}
                  </h3>
                  <p className="text-sm">
                    {activeTab === "applied" 
                      ? "You haven't applied to any jobs yet. Browse jobs and start applying!"
                      : (searchRole || searchLocation 
                        ? "Try adjusting your search criteria" 
                        : "No jobs available at the moment"
                      )
                    }
                  </p>
                  {activeTab === "applied" ? (
                    <button 
                      onClick={() => setActiveTab("browse")}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Browse Jobs
                    </button>
                  ) : (searchRole || searchLocation) && (
                    <button 
                      onClick={() => {
                        setSearchRole("");
                        setSearchLocation("");
                      }}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear search filters
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ✅ ADDED: Debug info (remove in production) */}
        {/* {activeTab === "applied" && !loadingAppliedJobs && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <strong>Debug Info:</strong><br />
            Applied Jobs Count: {appliedJobs.length}<br />
            Display Jobs Count: {displayJobs.length}<br />
            Applied Job IDs: {appliedJobIds.join(", ") || "None"}
          </div>
        )} */}
      </div>
    </div>
  );
}
