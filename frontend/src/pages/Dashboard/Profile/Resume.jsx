import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { toast } from "react-toastify";
import { resumeUpload } from "@/Api/profile";

export default function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const acceptableTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (acceptableTypes.includes(file.type)) {
      setFile(file);
    } else {
      alert("Please upload a DOC, DOCX, PDF, or TXT file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setIsLoading(true);
    try {
      const data = await resumeUpload(formData);
      if (data.error) {
        setError(data.error);
        toast.error("Failed to upload resume. Please try again.");
        return;
      }
      setFile(null);
      localStorage.setItem("resume", data.resumeUrl);
      setResume(data.resumeUrl);
      toast.success(data.message || "Resume uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-300 rounded-lg p-8 bg-white">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-1">
            Upload your recent resume or CV
          </h2>
          <p className="text-gray-600 mb-1">
            Upload your most up-to-date resume
          </p>
          <p className="text-gray-600 mb-6">File types: DOC, DOCX, PDF, TXT</p>

          <div
            className={`border-2 ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } 
                        rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer
                        ${file ? "bg-blue-50" : "bg-white"}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".doc,.docx,.pdf,.txt"
              onChange={handleFileChange}
            />
            <label
              htmlFor="resume-upload"
              className="w-full flex flex-col items-center cursor-pointer"
            >
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-lg mb-4">
                {file ? (
                  <div className="text-xl font-semibold">
                    {file.name.split(".").pop().toUpperCase()}
                  </div>
                ) : (
                  <FileUp size={32} className="text-blue-600" />
                )}
              </div>
              <span className="text-blue-600 font-medium text-center">
                {file ? file.name : "Upload new file"}
              </span>
            </label>
          </div>

          {file && (
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
