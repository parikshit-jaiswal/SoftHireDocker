import React, { useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { ApplicationCard } from "@/components/Dashboard/ApplicationCard";
import { recentApplications } from "@/constants/dashboard";
import RecommendedJobCard from "@/components/Dashboard/RecommendedJobCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, setSelectedJob } from "@/redux/UserJobSlice";
import { useNavigate } from "react-router-dom";

export default function SoftHireApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add fallback values to prevent destructuring errors
  const jobsState = useSelector((state) => state.userJobs || {});
  const { jobs = [], loading = false, error = null } = jobsState;

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const handleJobSelect = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/dashboard/job-details/${job._id}`);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">SoftHire</div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-8">Welcome, John</h1>

          <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            {recentApplications.map((app, idx) => (
              <ApplicationCard key={app.id || idx} application={app} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
          {loading && <p>Loading jobs...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col gap-4">
            {!loading &&
              !error &&
              jobs.map((job, idx) => (
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
