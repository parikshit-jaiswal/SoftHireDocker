import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Share2, MapPin, DollarSign, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedJob } from "@/redux/UserJobSlice";
import { createApplication } from "@/Api/application";
import DetailSection from "@/components/Dashboard/DetailsSection";
import { toast } from "react-toastify";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add fallback values to prevent destructuring errors
  const jobsState = useSelector((state) => state.userJobs || {});
  const { jobs = [], selectedJob = null } = jobsState;
  const [interestText, setInterestText] = useState("");

  useEffect(() => {
    // If selectedJob is not set or doesn't match the URL, find it from jobs array
    if (!selectedJob || selectedJob._id !== jobId) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) {
        dispatch(setSelectedJob(job));
      } else {
        // If job not found in current jobs array, you might want to fetch it
        navigate("/dashboard");
      }
    }
  }, [jobId, selectedJob, jobs, dispatch, navigate]);

  if (!selectedJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `${salary.currency || "$"}${salary.min}-${salary.max}`;
    }
    return "Salary not specified";
  };

  const formatLocation = (locations) => {
    if (locations && locations.length > 0) {
      return locations.join(" • ");
    }
    return "Location not specified";
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `Posted ${diffDays} days ago`;
  };

  const renderJobDescription = (description) => {
    return { __html: description };
  };

  const handleApply = async () => {
    try {
      const formData = {
        jobId: selectedJob._id,
        coverLetter: interestText,
      };

      await createApplication(formData);
      toast.success("Application submitted successfully!");
      setInterestText(""); // Reset the textarea
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Apply Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>
          <div className="text-2xl font-bold">SoftHire</div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 flex gap-4">
        {/* Job details */}
        <div className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-600">{selectedJob.companyName}</p>
                <div className="mt-1">
                  {selectedJob.isHiring && (
                    <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Actively Hiring
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formatLocation(selectedJob.location)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 ml-4">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatSalary(selectedJob.salary)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {formatPostedDate(selectedJob.postedAt)} • Recruiter Currently
                  active
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {selectedJob.companyName?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-6" />

            {/* Job details columns */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <DetailSection title="Job Location">
                  {formatLocation(selectedJob.location)}{" "}
                  {selectedJob.remotePolicy && ` • ${selectedJob.remotePolicy}`}
                </DetailSection>

                <DetailSection title="Remote Work Policy">
                  {selectedJob.remotePolicy || "Not specified"}
                </DetailSection>

                <DetailSection title="Work Experience">
                  {selectedJob.workExperience || "Not specified"}
                </DetailSection>

                <DetailSection title="Skills">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedJob.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded"
                      >
                        {skill}
                      </span>
                    )) || (
                      <span className="text-gray-500">No skills specified</span>
                    )}
                  </div>
                </DetailSection>
              </div>

              <div>
                <DetailSection title="Visa Sponsorship">
                  {selectedJob.visaSponsorship ? "Available" : "Not Available"}
                </DetailSection>

                <DetailSection title="Company Size">
                  {selectedJob.companySize || "Not specified"}
                </DetailSection>

                <DetailSection title="Relocation">
                  {selectedJob.relocationRequired ? "Required" : "Not Required"}
                  {selectedJob.relocationAssistance &&
                    " • Assistance Available"}
                </DetailSection>

                <DetailSection title="Job Type">
                  {selectedJob.jobType || "Not specified"}
                </DetailSection>
              </div>
            </div>

            <hr className="my-6" />

            <DetailSection title={`About ${selectedJob.companyName}`}>
              <p>
                We are a growing company looking for talented individuals to
                join our team. Our mission is to create innovative solutions
                that make a difference in the world.
              </p>
            </DetailSection>

            <hr className="my-6" />

            <DetailSection title="Job Description">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={renderJobDescription(
                  selectedJob.jobDescription
                )}
              />
            </DetailSection>

            {selectedJob.responsibilities &&
              selectedJob.responsibilities.length > 0 && (
                <>
                  <hr className="my-6" />
                  <DetailSection title="Key Responsibilities">
                    <ul className="list-disc ml-5 space-y-2">
                      {selectedJob.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        )
                      )}
                    </ul>
                  </DetailSection>
                </>
              )}

            {selectedJob.qualifications &&
              selectedJob.qualifications.length > 0 && (
                <>
                  <hr className="my-6" />
                  <DetailSection title="Qualifications and Skills">
                    <ul className="list-disc ml-5 space-y-2">
                      {selectedJob.qualifications.map(
                        (qualification, index) => (
                          <li key={index}>{qualification}</li>
                        )
                      )}
                    </ul>
                  </DetailSection>
                </>
              )}
          </div>
        </div>

        {/* Application form */}
        <div className="w-72 bg-white rounded-lg border border-gray-200 overflow-hidden h-fit">
          <div className="p-6">
            <h2 className="text-lg font-bold">
              Apply to {selectedJob.companyName}
            </h2>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                What interests you about working for this company?
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={interestText}
                onChange={(e) => setInterestText(e.target.value)}
                placeholder="Tell us why you're interested in this role..."
              />
            </div>

            <button
              className="mt-4 block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md transition-colors"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
