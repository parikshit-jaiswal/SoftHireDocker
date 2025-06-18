import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import API from "../Api/api";

export default function SalaryCalculator() {
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isInUK, setIsInUK] = useState("Yes");
  const [visaType, setVisaType] = useState("Student");
  const [isYounger, setIsYounger] = useState("Yes");
  const [annualSalary, setAnnualSalary] = useState("");
  const [hourlySalary, setHourlySalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [searchText, setSearchText] = useState("");

  // Fetch job options based on search text
  const fetchFilteredJobs = async (keyword) => {
    try {
      const res = await API.get("/salary/search", {
        params: { keyword },
      });
      setJobOptions(res.data.salaries || []);
    } catch (err) {
      console.error("Error fetching job options:", err);
      setJobOptions([]);
    }
  };

  // Debounced search handler
  const handleSearch = debounce((text) => {
    if (text.length === 0) {
      setJobOptions([]);
    } else {
      fetchFilteredJobs(text);
    }
  }, 300);

  // Handle job selection
  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setSearchText(`${job.occupationCode} - ${job.jobType}`);
    setJobOptions([]);

    try {
      setIsLoading(true);
      const res = await API.post("/salary/details", {
        occupationCode: job.occupationCode,
      });

      // Log the full response to inspect the data
      // console.log("API Response:", res);

      const salary =
        (res.data?.standardAnnualSalary || 0) +
        (res.data?.lowerAnnualSalary || 0);
      setAnnualSalary(salary ? `£${(salary / 2).toLocaleString()}` : "N/A");
      setHourlySalary(salary ? (salary / (24 * 30 * 12)).toFixed(2) : "N/A");
      setJobDescription(
        res.data?.notes || "No official job description available."
      );

      // Set min and max salary if available
      setMinSalary(res.data?.lowerAnnualSalary || "");
      setMaxSalary(res.data?.standardAnnualSalary || "");
    } catch (err) {
      console.error("Error fetching salary details:", err);
      alert("Something went wrong while fetching job details. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUKStatus = (status) => {
    setIsInUK(status);

    if (status === "No") {
      const salary =
        (parseFloat(minSalary) || 0) + (parseFloat(maxSalary) || 0);
      const avgSalary = salary / 2;

      setAnnualSalary(
        avgSalary ? `£${(avgSalary * 1.24).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary * 1.24) / (24 * 30 * 12)).toFixed(2) : "N/A"
      );
    } else {
      const salary =
        (parseFloat(minSalary) || 0) + (parseFloat(maxSalary) || 0);
      const avgSalary = salary / 2;

      setAnnualSalary(avgSalary ? `£${avgSalary.toLocaleString()}` : "N/A");
      setHourlySalary(
        avgSalary ? (avgSalary / (24 * 30 * 12)).toFixed(2) : "N/A"
      );
    }
  };

  const handleSetVisaType = (type) => {
    setVisaType(type);
    const salary = (parseFloat(minSalary) || 0) + (parseFloat(maxSalary) || 0);
    const avgSalary = salary / 2;

    setAnnualSalary(avgSalary ? `£${avgSalary.toLocaleString()}` : "N/A");
    setHourlySalary(
      avgSalary ? (avgSalary / (24 * 30 * 12)).toFixed(2) : "N/A"
    );
    if (visaType === "Student") {
      setIsYounger("Yes");
      setAnnualSalary(
        avgSalary ? `£${(avgSalary * 1.2).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary / (24 * 30 * 12)) * 1.2).toFixed(2) : "N/A"
      );
    } else if (visaType === "Dependent") {
      setIsYounger("No");
      setAnnualSalary(
        avgSalary ? `£${(avgSalary * 1.25).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary / (24 * 30 * 12)) * 1.25).toFixed(2) : "N/A"
      );
    } else if (visaType === "Skilled") {
      setIsYounger("No");
      setAnnualSalary(
        avgSalary ? `£${avgSalary * (1.3).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary / (24 * 30 * 12)) * 1.3).toFixed(2) : "N/A"
      );
    } else if (visaType === "Graduate") {
      setIsYounger("No");
      setAnnualSalary(
        avgSalary ? `£${avgSalary * (1.33).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary / (24 * 30 * 12)) * 1.33).toFixed(2) : "N/A"
      );
    } else {
      setIsYounger("No");
      setAnnualSalary(
        avgSalary ? `£${avgSalary * (1.0).toLocaleString()}` : "N/A"
      );
      setHourlySalary(
        avgSalary ? ((avgSalary / (24 * 30 * 12)) * 1.0).toFixed(2) : "N/A"
      );
    }
  };

  // Handle resetting the form
  const handleReset = () => {
    setSelectedJob(null);
    setIsInUK("Yes");
    setVisaType("Student");
    setIsYounger("Yes");
    setAnnualSalary("");
    setHourlySalary("");
    setJobDescription("");
    setMinSalary("");
    setMaxSalary("");
    setSearchText("");
    setJobOptions([]);
  };

  useEffect(() => {
    if (selectedJob && minSalary && maxSalary) {
      // Trigger the salary calculation based on selected job
      handleJobSelect(selectedJob);
    }
  }, [selectedJob]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6">
        <h1 className="text-xl font-bold text-center mb-6">
          Skilled Worker Minimum Salary Calculator
        </h1>

        {/* Searchable Job Role Input */}
        <div className="mb-4 relative">
          <label className="font-medium block mb-2">
            Role <span className="text-xs text-gray-500">Required</span>
          </label>
          <input
            type="text"
            placeholder="Search job role..."
            value={searchText}
            onChange={(e) => {
              const value = e.target.value;
              setSearchText(value);
              handleSearch(value);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {jobOptions.length > 0 && (
            <ul className="absolute z-10 bg-white w-full max-h-60 overflow-y-auto border mt-1 rounded shadow">
              {jobOptions.map((job) => (
                <li
                  key={job.occupationCode}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleJobSelect(job)} // Select job here
                >
                  {job.occupationCode} - {job.jobType}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Auto-Filled Salary Inputs */}
        {selectedJob && (
          <>
            <div className="mb-4">
              <label className="font-medium block mb-2">
                Lower Annual Salary
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label className="font-medium block mb-2">
                Standard Annual Salary
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        {/* UK Status */}
        <div className="mb-4">
          <p className="font-medium mb-2">
            Is this individual currently in the UK?
          </p>
          <div className="flex gap-2">
            {["Yes", "No"].map((val) => (
              <button
                key={val}
                className={`px-4 py-1 rounded-full text-sm ${
                  isInUK === val ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handleUKStatus(val)}
                disabled={isLoading}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Visa Type */}
        {isInUK === "No" && (
          <div className="mb-4">
            <p className="font-medium mb-2">Visa Type?</p>
            <div className="flex flex-wrap gap-2">
              {["Student", "Dependent", "Skilled", "Graduate", "Other"].map(
                (type) => (
                  <button
                    key={type}
                    className={`px-4 py-1 rounded-full text-sm ${
                      visaType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleSetVisaType(type)}
                    disabled={isLoading}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Age */}
        <div className="mb-4">
          <p className="font-medium mb-2">
            Is this individual younger than 26?
          </p>
          <div className="flex gap-2">
            {["Yes", "No"].map((val) => (
              <button
                key={val}
                className={`px-4 py-1 rounded-full text-sm ${
                  isYounger === val ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setIsYounger(val)}
                disabled={isLoading}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Result */}
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          annualSalary && (
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-blue-100 p-3 rounded">
                <p className="text-sm text-blue-600 mb-1">Annual Salary</p>
                <p className="text-lg font-bold">{annualSalary}</p>
              </div>
              <div className="flex-1 bg-blue-100 p-3 rounded">
                <p className="text-sm text-blue-600 mb-1">Hourly Salary</p>
                <p className="text-lg font-bold">£{hourlySalary}</p>
              </div>
            </div>
          )
        )}

        {/* Description */}
        {jobDescription && (
          <p className="text-sm text-gray-600 italic mb-4">{jobDescription}</p>
        )}

        <p className="text-xs text-gray-600 mb-4">
          This tool helps estimate UK skilled worker visa salary thresholds
          based on selected roles.
        </p>

        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
          disabled={isLoading}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
