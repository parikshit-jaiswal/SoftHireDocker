import { useState, useEffect } from "react";
import { MapPin, User } from "lucide-react";
import RecommendedJobCard from "@/components/Dashboard/RecommendedJobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, setSelectedJob } from "@/redux/UserJobSlice";
import { useNavigate } from "react-router-dom";

export default function JobSearch() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchRole, setSearchRole] = useState("");       // For job title/role filter
  const [searchLocation, setSearchLocation] = useState(""); // For location filter

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobsState = useSelector((state) => state.userJobs || {});
  const { jobs = [], loading = false, error = null } = jobsState;

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const handleJobSelect = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/dashboard/job-details/${job._id}`);
  };

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Filter jobs by both role and location
  const filteredJobs = jobs.filter((job) => {
    const roleMatch = job.title
      .toLowerCase()
      .includes(searchRole.toLowerCase());
    
    // job.location might be an array or string; handle both
    const locationData = Array.isArray(job.location)
      ? job.location.join(", ").toLowerCase()
      : (job.location || "").toLowerCase();
    const locationMatch = locationData.includes(searchLocation.toLowerCase());

    return roleMatch && locationMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Search for Jobs</h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200">
          <button className="py-2 px-4 font-medium text-gray-900 border-b-2 border-gray-900">
            Browse All
          </button>
          <button className="py-2 px-4 font-medium text-gray-500">
            Saved{" "}
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-sm">
              {savedJobs.length}
            </span>
          </button>
        </div>

        {/* Search Tabs */}
        <div className="flex mb-4 items-center">
          <div className="flex items-center mr-2">
            <button className="py-2 px-4 bg-gray-100 rounded-lg text-sm flex items-center">
              Saved Searches <span className="ml-2">2</span>
            </button>
          </div>
          <button className="p-2 border border-gray-300 rounded-lg">
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Search Form */}
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
            <button className="text-gray-400">
              {/* Icon or search button */}
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
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
            <button className="text-gray-400">
              {/* Icon or search button */}
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
          {loading && <p>Loading jobs...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col gap-4">
            {!loading &&
              !error &&
              filteredJobs.map((job, idx) => (
                <RecommendedJobCard
                  key={job._id || idx}
                  job={job}
                  onLearnMore={() => handleJobSelect(job)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
