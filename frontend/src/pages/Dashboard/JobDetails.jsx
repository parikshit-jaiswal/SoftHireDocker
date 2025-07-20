import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Share2, MapPin, DollarSign, ArrowLeft, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedJob } from "@/redux/UserJobSlice";
import { createApplication, checkApplicationStatus } from "@/Api/application";
import userService from "@/Api/UserService";
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
  const [loadingAppliedJobs, setLoadingAppliedJobs] = useState(true);
  const [applying, setApplying] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // ✅ NEW: Add a flag to prevent state overrides
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    // If selectedJob is not set or doesn't match the URL, find it from jobs array
    if (!selectedJob || selectedJob._id !== jobId) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) {
        dispatch(setSelectedJob(job));
      } else {
        navigate("/dashboard");
      }
    }
  }, [jobId, selectedJob, jobs, dispatch, navigate]);

  // ✅ UPDATED: Check application status with protection against state override
  const checkIfApplied = async (skipStateUpdate = false) => {
    try {
      if (!skipStateUpdate) {
        setLoadingAppliedJobs(true);
      }
      
      console.log(`🔍 Checking application status for job: ${jobId}`);
      const result = await checkApplicationStatus(jobId);
      
      console.log("📊 Application check result:", result);
      
      if (result.success) {
        // ✅ Only update state if we haven't just submitted an application
        if (!applicationSubmitted || result.isApplied) {
          setIsApplied(result.isApplied);
          console.log(`✅ Application status: ${result.isApplied ? 'APPLIED' : 'NOT APPLIED'}`);
        }
      } else {
        console.log("❌ Failed to check application status");
        // ✅ Only set to false if we haven't just submitted
        if (!applicationSubmitted) {
          setIsApplied(false);
        }
      }
    } catch (error) {
      console.error("💥 Error checking application status:", error);
      // ✅ Only set to false if we haven't just submitted
      if (!applicationSubmitted) {
        setIsApplied(false);
      }
    } finally {
      if (!skipStateUpdate) {
        setLoadingAppliedJobs(false);
      }
    }
  };

  // ✅ UPDATED: Load application status on mount with delay to avoid race conditions
  useEffect(() => {
    if (jobId && !applicationSubmitted) {
      // Small delay to avoid race conditions
      const timer = setTimeout(() => {
        checkIfApplied();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [jobId, applicationSubmitted]);

  const handleInterestTextChange = (e) => {
    setInterestText(e.target.value);
    if (validationError) {
      setValidationError("");
    }
  };

  const validateApplicationForm = () => {
    const trimmedText = interestText.trim();
    
    if (!trimmedText) {
      setValidationError("Please tell us why you're interested in this role.");
      return false;
    }
    
    if (trimmedText.length < 10) {
      setValidationError("Please provide at least 10 characters describing your interest.");
      return false;
    }
    
    if (trimmedText.length > 500) {
      setValidationError("Please keep your response under 500 characters.");
      return false;
    }
    
    return true;
  };

  // ✅ UPDATED: Enhanced application submission with resume check
  const submitJobApplication = async () => {
    if (isApplied || applicationSubmitted) {
      toast.info("You have already applied to this job.");
      return;
    }

    if (!validateApplicationForm()) {
      return;
    }

    try {
      setApplying(true);
      
      const applicationData = {
        jobId: selectedJob._id,
        coverLetter: interestText.trim(),
      };

      console.log("📤 Submitting application:", applicationData);

      // ✅ UPDATED: Call the API and handle response
      const submissionResult = await createApplication(applicationData);
      
      console.log("📬 Raw submission result:", submissionResult);

      // ✅ IMMEDIATELY set applied state and lock it
      setApplicationSubmitted(true);
      setIsApplied(true);
      setInterestText("");
      setValidationError("");
      
      // ✅ UPDATED: Simple success toast
      toast.success("Application submitted successfully!");
      
      console.log("✅ Application submitted successfully - UI locked");
      
      // ✅ Optional: Verify with API after 3 seconds but don't override UI
      setTimeout(() => {
        checkIfApplied(true); // Skip state update, just log
      }, 3000);
      
    } catch (error) {
      console.error("💥 Application submission error:", error);
      
      // ✅ UPDATED: Handle 201 status as success
      if (error.response?.status === 201) {
        console.log("✅ Got 201 status - treating as success");
        
        setApplicationSubmitted(true);
        setIsApplied(true);
        setInterestText("");
        setValidationError("");
        
        // ✅ UPDATED: Simple success toast
        toast.success("Application submitted successfully!");
        
        return; // Exit early since this is actually a success
      }
      
      const errorMessage = error.response?.data?.message || error.message;
      
      // ✅ NEW: Handle resume requirement specifically
      if (errorMessage && errorMessage.includes("resume")) {
        toast.error(
          <div className="flex flex-col">
            <span className="font-medium">Resume Required</span>
            <span className="text-sm">Please upload your resume before applying for jobs.</span>
            <button 
              onClick={() => navigate('/dashboard/profile')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Upload Resume Now →
            </button>
          </div>,
          {
            duration: 6000, // Show for 6 seconds
            position: 'top-center',
          }
        );
        
        // Reset flags since application wasn't submitted
        setApplicationSubmitted(false);
        return;
      }
      
      if (errorMessage && errorMessage.includes("already applied")) {
        setApplicationSubmitted(true);
        setIsApplied(true);
        toast.info("You have already applied to this job.");
      } else {
        // ✅ UPDATED: Simple error toast
        toast.error("Failed to submit application. Please try again.");
        // Reset flags on actual error
        setApplicationSubmitted(false);
      }
      
    } finally {
      setApplying(false);
    }
  };

  // ✅ UPDATED: Manual refresh with simple toast
  const handleRefresh = async () => {
    setRefreshing(true);
    console.log("🔄 Manual refresh triggered");
    
    if (applicationSubmitted) {
      // Just confirm the status without changing UI
      await checkIfApplied(true);
      toast.info("Status confirmed");
    } else {
      await checkIfApplied();
      toast.info("Status refreshed");
    }
    
    setRefreshing(false);
  };

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
          
          {/* ✅ Debug info */}
          {/* <div className="text-xs text-gray-500">
            Applied: {isApplied ? 'Yes' : 'No'} | Submitted: {applicationSubmitted ? 'Yes' : 'No'}
          </div> */}
          
          {/* ✅ Enhanced refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-auto px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            {refreshing ? (
              <div className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700"></div>
                <span>Refreshing...</span>
              </div>
            ) : (
              "Refresh Status"
            )}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 flex gap-4">
        {/* Job details */}
        <div className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                  {/* ✅ FIXED: Applied badge */}
                  {(isApplied || applicationSubmitted) && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle size={14} />
                      <span>Applied</span>
                    </div>
                  )}
                </div>
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
                  {formatPostedDate(selectedJob.postedAt)} • Recruiter Currently active
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

        {/* ✅ FIXED: Application form with proper conditional rendering */}
        <div className="w-72 bg-white rounded-lg border border-gray-200 overflow-hidden h-fit relative">
          <div className="p-6">
            <h2 className="text-lg font-bold">
              Apply to {selectedJob.companyName}
            </h2>

            {/* ✅ FIXED: Proper conditional rendering syntax */}
            {(isApplied || applicationSubmitted) ? (
              // Already Applied State
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                  <CheckCircle size={20} />
                  <span className="font-medium">Application Submitted!</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your application has been successfully submitted. The recruiter will review your application and get back to you soon.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/dashboard/applied')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
                  >
                    View Application Status
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-md transition-colors text-sm disabled:opacity-50"
                  >
                    {refreshing ? "Refreshing..." : "Confirm Status"}
                  </button>
                </div>
              </div>
            ) : (
              // Application Form
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What interests you about working for this company? *
                  </label>
                  <textarea
                    className={`mt-1 block w-full border rounded-md p-2 h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={interestText}
                    onChange={handleInterestTextChange}
                    placeholder="Tell us why you're interested in this role..."
                    disabled={loadingAppliedJobs || applying || applicationSubmitted}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-gray-500">
                      {interestText.length}/500 characters
                    </div>
                    <div className="text-xs text-gray-500">
                      Minimum 10 characters
                    </div>
                  </div>
                  {validationError && (
                    <p className="text-red-500 text-xs mt-1">{validationError}</p>
                  )}
                </div>

                <button
                  className={`mt-4 block w-full font-medium py-2 rounded-md transition-colors ${
                    !interestText.trim() || interestText.trim().length < 10 || applicationSubmitted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                  onClick={submitJobApplication}
                  disabled={applying || loadingAppliedJobs || !interestText.trim() || interestText.trim().length < 10 || applicationSubmitted}
                >
                  {applying ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Applying...</span>
                    </div>
                  ) : loadingAppliedJobs ? (
                    "Checking status..."
                  ) : applicationSubmitted ? (
                    "Application Submitted"
                  ) : (
                    "Apply"
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  * Required field
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}