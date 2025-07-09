import React, { useState, useEffect } from "react";
import { FileUp, Download, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import userService from "@/Api/UserService";

export default function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    loadExistingResume();
  }, []);

  const loadExistingResume = async () => {
    try {
      // Check localStorage first
      const localResume = localStorage.getItem("resume");
      if (localResume) {
        setCurrentResume(localResume);
      }

      // Also try to get from user profile
      const result = await userService.getProfile();
      if (result.success && result.data?.resume) {
        setCurrentResume(result.data.resume);
        setResumeData({
          url: result.data.resume,
          uploadedAt: result.data.updatedAt,
          name: 'Resume.pdf' // Default name since we might not have the original filename
        });
      }
    } catch (error) {
      console.error("Failed to load existing resume:", error);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleFiles(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    // Use userService validation
    const validation = userService.validateFile(file, ['application/pdf'], 5 * 1024 * 1024);

    if (validation.isValid) {
      setFile(file);
      setError(null);
    } else {
      setError(validation.message);
      toast.error(validation.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await userService.uploadResume(file);

      if (result.success) {
        setFile(null);
        const resumeUrl = result.data.resumeUrl || result.data.resume;
        localStorage.setItem("resume", resumeUrl);
        setCurrentResume(resumeUrl);
        setResumeData({
          url: resumeUrl,
          uploadedAt: new Date().toISOString(),
          name: file.name
        });
        toast.success(result.message);

        // Reset file input
        const fileInput = document.getElementById("resume-upload");
        if (fileInput) fileInput.value = "";
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = "Failed to upload resume. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResume = () => {
    if (currentResume) {
      window.open(currentResume, "_blank");
    }
  };

  const handleDownloadResume = () => {
    if (currentResume) {
      const link = document.createElement('a');
      link.href = currentResume;
      link.download = resumeData?.name || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteResume = () => {
    if (window.confirm("Are you sure you want to delete your current resume?")) {
      localStorage.removeItem("resume");
      setCurrentResume(null);
      setResumeData(null);
      toast.success("Resume deleted successfully");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Resume Display */}
      {currentResume && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Current Resume</h3>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-12 w-12 bg-green-100 text-green-600 rounded-lg">
                <FileUp size={24} />
              </div>
              <div>
                <p className="font-medium text-green-800">
                  {resumeData?.name || 'Resume.pdf'}
                </p>
                <p className="text-sm text-green-600">
                  Uploaded on {formatDate(resumeData?.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleViewResume}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View Resume"
              >
                <Eye size={16} />
                <span className="text-sm">View</span>
              </button>
              <button
                onClick={handleDownloadResume}
                className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Download Resume"
              >
                <Download size={16} />
                <span className="text-sm">Download</span>
              </button>
              <button
                onClick={handleDeleteResume}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Resume"
              >
                <Trash2 size={16} />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Resume */}
      <form onSubmit={handleSubmit}>
        <div className="border border-gray-300 rounded-lg p-8 bg-white">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-1">
              {currentResume ? "Upload a new resume or CV" : "Upload your recent resume or CV"}
            </h2>
            <p className="text-gray-600 mb-1">
              {currentResume ? "Replace your current resume with a newer version" : "Upload your most up-to-date resume"}
            </p>
            <p className="text-gray-600 mb-6">File types: PDF only (Max 5MB)</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div
              className={`border-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } 
                          rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
                          ${file ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50"}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload"
                className="w-full flex flex-col items-center cursor-pointer"
              >
                <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-lg mb-4">
                  {file ? (
                    <div className="text-sm font-semibold text-center">
                      <div>PDF</div>
                    </div>
                  ) : (
                    <FileUp size={32} className="text-blue-600" />
                  )}
                </div>
                <span className="text-blue-600 font-medium text-center mb-2">
                  {file ? file.name : isDragging ? "Drop your file here" : "Choose file or drag and drop"}
                </span>
                {!file && (
                  <span className="text-gray-500 text-sm text-center">
                    PDF files only, up to 5MB
                  </span>
                )}
                {file && (
                  <span className="text-green-600 text-sm text-center">
                    File selected: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </label>
            </div>

            {file && (
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition ${isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
                  }`}
              >
                {isLoading ? "Uploading..." : currentResume ? "Replace Resume" : "Upload Resume"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
