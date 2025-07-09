import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";
import jobPreferencesService from "@/Api/jobPreferencesService";

export default function Preferences() {
  const initialFormData = {
    needsSponsorship: "Yes",
    authorizedToWork: "Yes",
    jobType: "Intern",
    openTo: {
      fullTime: false,
      contractor: false,
      cofounder: false,
      freelancer: false,
      internship: false,
      partTime: false,
      consultant: false,
    },
    openToRemote: false,
    workLocation: "",
    remotePreference: "",
    salaryCurrency: "USD",
    desiredSalary: "",
    companySizePreferences: {
      Seed: "Ideal",
      Early: "Ideal",
      "Mid-size": "Ideal",
      Large: "Ideal",
      "Very Large": "Ideal",
      Massive: "Ideal",
      Startup: "Ideal",
      "Public Company": "Ideal",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingPreferences, setHasExistingPreferences] = useState(false);
  const [showSavedPreferences, setShowSavedPreferences] = useState(false);
  const [savedPreferencesData, setSavedPreferencesData] = useState(null);

  // Load existing preferences on component mount
  useEffect(() => {
    loadExistingPreferences();
  }, []);

  const loadExistingPreferences = async () => {
    setIsLoading(true);
    try {
      const result = await jobPreferencesService.getJobPreferences();

      if (result.success && result.data) {
        // Store the raw saved data for display
        setSavedPreferencesData(result.data);

        // Format the data for display in the form
        const formattedData = jobPreferencesService.formatPreferencesForDisplay(
          result.data
        );
        setFormData(formattedData);
        setHasExistingPreferences(true);

        // Don't show success toast on initial load, only when explicitly loading
        console.log("Existing preferences loaded successfully");
      } else {
        // No existing preferences found, use initial form data
        console.log("No existing preferences found, starting fresh");
        setHasExistingPreferences(false);
        setSavedPreferencesData(null);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      setIsError(true);
      setErrorMessage("Failed to load existing preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPreferences = async () => {
    toast.info("Refreshing preferences...");
    await loadExistingPreferences();
    if (hasExistingPreferences) {
      toast.success("Preferences refreshed successfully!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this field when user changes it
    setErrors({
      ...errors,
      [name]: "",
    });

    if (type === "checkbox" && name.startsWith("openTo.")) {
      const jobType = name.split(".")[1];
      setFormData({
        ...formData,
        openTo: {
          ...formData.openTo,
          [jobType]: checked,
        },
      });
    } else if (type === "checkbox" && name === "openToRemote") {
      setFormData({
        ...formData,
        openToRemote: checked,
        // Clear remote preference if unchecking "work remotely"
        remotePreference: checked ? formData.remotePreference : "",
      });
    } else if (name.startsWith("companySizePreferences.")) {
      const sizeKey = name.split(".")[1];
      setFormData({
        ...formData,
        companySizePreferences: {
          ...formData.companySizePreferences,
          [sizeKey]: value,
        },
      });
    } else if (name === "desiredSalary") {
      // Only allow numbers for salary field
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate work authorization fields
    if (!formData.needsSponsorship) {
      newErrors.needsSponsorship = "Please select an option";
    }

    if (!formData.authorizedToWork) {
      newErrors.authorizedToWork = "Please select an option";
    }

    // Validate job type
    if (!formData.jobType) {
      newErrors.jobType = "Please select a job type";
    }

    // Validate work location
    if (!formData.workLocation && !formData.openToRemote) {
      newErrors.workLocation =
        "Please enter a work location or select 'Open to working remotely'";
    }

    // Validate remote preference if work remotely is selected
    if (formData.openToRemote && !formData.remotePreference) {
      newErrors.remotePreference = "Please select a remote work preference";
    }

    // Validate salary if entered (not required)
    if (
      formData.desiredSalary &&
      (isNaN(formData.desiredSalary) || parseInt(formData.desiredSalary) <= 0)
    ) {
      newErrors.desiredSalary = "Please enter a valid salary amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitted(true);
    setIsError(false);
    setErrorMessage("");
    setIsSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const transformedData = jobPreferencesService.transformFormDataForAPI(formData);

    try {
      let result;

      if (hasExistingPreferences) {
        // Update existing preferences
        result = await jobPreferencesService.updateJobPreferences(transformedData);
      } else {
        // Create new preferences
        result = await jobPreferencesService.saveJobPreferences(transformedData);
      }

      if (result.success) {
        // Success actions
        setIsSuccess(true);
        setHasExistingPreferences(true);
        setSavedPreferencesData(result.data);
        toast.success(result.message || "Job preferences saved successfully!");
        setErrors({});
        setIsSubmitted(false);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      // Error handling
      setIsError(true);
      setErrorMessage(
        err?.message || err?.response?.data?.message || "Something went wrong. Please try again."
      );
      toast.error(
        err?.message || err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All unsaved changes will be lost.")) {
      setFormData(initialFormData);
      setErrors({});
      setIsSubmitted(false);
      setIsError(false);
      setErrorMessage("");
      setIsSuccess(false);
      toast.info("Form reset to default values");
    }
  };

  const handleDelete = async () => {
    if (!hasExistingPreferences) {
      toast.error("No preferences to delete");
      return;
    }

    const confirmDelete = window.confirm(
      "⚠️ DELETE CONFIRMATION\n\nAre you sure you want to permanently delete all your job preferences?\n\nThis action cannot be undone and will:\n• Remove all your saved preferences\n• Reset the form to default values\n• Require you to set up preferences again\n\nClick OK to delete or Cancel to keep your preferences."
    );

    if (confirmDelete) {
      setLoading(true);
      try {
        const result = await jobPreferencesService.deleteJobPreferences();

        if (result.success) {
          setFormData(initialFormData);
          setHasExistingPreferences(false);
          setSavedPreferencesData(null);
          setShowSavedPreferences(false);
          toast.success("✅ Job preferences deleted successfully!");

          // Clear any existing states
          setIsSuccess(false);
          setIsError(false);
          setErrorMessage("");
          setErrors({});
          setIsSubmitted(false);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error("❌ Failed to delete preferences. Please try again.");
        setIsError(true);
        setErrorMessage("Failed to delete preferences. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatSavedPreferencesForDisplay = (data) => {
    if (!data) return null;

    return {
      workAuthorization: {
        needsSponsorship: data.needsSponsorship ? "Yes" : "No",
        authorizedToWork: data.authorizedToWork ? "Yes" : "No",
      },
      jobDetails: {
        jobType: data.jobType || "Not specified",
        openTo: data.openTo && data.openTo.length > 0 ? data.openTo.join(", ") : "None selected",
      },
      location: {
        workLocation: data.workLocation || "Not specified",
        openToRemote: data.openToRemote ? "Yes" : "No",
        remotePreference: data.remotePreference || "Not specified",
      },
      compensation: {
        desiredSalary: data.desiredSalary 
          ? `${data.salaryCurrency || 'USD'} ${data.desiredSalary.toLocaleString()}` 
          : "Not specified",
      },
      companySizes: data.companySizePreferences || [],
    };
  };

  // Show loading spinner while fetching existing preferences
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading your preferences...</span>
      </div>
    );
  }

  const displayData = formatSavedPreferencesForDisplay(savedPreferencesData);

  return (
    <div className="w-full max-w-auto mx-auto px-6 py-8 border border-gray-200 bg-white rounded-lg shadow-md">
      {/* Header with status */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Preferences</h1>
          <div className="flex items-center space-x-3">
            {hasExistingPreferences && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✅ Preferences Saved
              </span>
            )}

            <button
              type="button"
              onClick={refreshPreferences}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              title="Refresh preferences"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>

            {hasExistingPreferences && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className={`flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Trash2 size={16} />
                <span>{loading ? "Deleting..." : "Delete All"}</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          {hasExistingPreferences
            ? "Update your job preferences to help us match you with better opportunities."
            : "Set your job preferences to help us match you with the right opportunities."}
        </p>
      </div>

      {/* Saved Preferences Display */}
      {hasExistingPreferences && displayData && (
        <div className="mb-8 border border-blue-200 rounded-lg bg-blue-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">
              📋 Your Saved Preferences
            </h3>
            <button
              onClick={() => setShowSavedPreferences(!showSavedPreferences)}
              className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 transition-colors"
            >
              {showSavedPreferences ? <EyeOff size={18} /> : <Eye size={18} />}
              <span>{showSavedPreferences ? "Hide" : "Show"} Details</span>
            </button>
          </div>

          {showSavedPreferences && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Work Authorization */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold text-gray-900 mb-2">Work Authorization</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Needs Sponsorship:</span> {displayData.workAuthorization.needsSponsorship}</p>
                  <p><span className="font-medium">Authorized to Work:</span> {displayData.workAuthorization.authorizedToWork}</p>
                </div>
              </div>

              {/* Job Details */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Job Type:</span> {displayData.jobDetails.jobType}</p>
                  <p><span className="font-medium">Also Open To:</span> {displayData.jobDetails.openTo}</p>
                </div>
              </div>

              {/* Location Preferences */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Work Location:</span> {displayData.location.workLocation}</p>
                  <p><span className="font-medium">Open to Remote:</span> {displayData.location.openToRemote}</p>
                  {displayData.location.openToRemote === "Yes" && (
                    <p><span className="font-medium">Remote Preference:</span> {displayData.location.remotePreference}</p>
                  )}
                </div>
              </div>

              {/* Compensation */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold text-gray-900 mb-2">Compensation</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Desired Salary:</span> {displayData.compensation.desiredSalary}</p>
                </div>
              </div>

              {/* Company Size Preferences */}
              {displayData.companySizes && displayData.companySizes.length > 0 && (
                <div className="bg-white p-4 rounded border md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Company Size Preferences</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {displayData.companySizes.map((comp, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-medium">{comp.size}:</span>{" "}
                        <span className={
                          comp.ideal ? "text-green-600" : 
                          comp.interested ? "text-blue-600" : "text-gray-600"
                        }>
                          {comp.ideal ? "Ideal" : comp.interested ? "Yes" : "No"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-100 rounded text-blue-800 text-sm">
            <p><strong>Last Updated:</strong> {savedPreferencesData?.updatedAt ? new Date(savedPreferencesData.updatedAt).toLocaleString() : 'Unknown'}</p>
          </div>
        </div>
      )}

      <form className="space-y-12" onSubmit={handleSubmit}>
        {/* US Work Authorization */}
        <section className="space-y-6 border-b pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">
                US Work Authorization*
              </h2>
            </div>
            <div className="md:w-2/3 space-y-6">
              <div>
                <p className="font-medium mb-2">
                  Do you or will you require sponsorship for a US employment
                  visa?*
                </p>
                <div className="flex flex-wrap gap-6">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="needsSponsorship"
                        value={option}
                        checked={formData.needsSponsorship === option}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {isSubmitted && errors.needsSponsorship && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.needsSponsorship}
                  </p>
                )}
              </div>

              <div>
                <p className="font-medium mb-2">
                  Are you legally authorized to work in the United States?*
                </p>
                <div className="flex flex-wrap gap-6">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="authorizedToWork"
                        value={option}
                        checked={formData.authorizedToWork === option}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {isSubmitted && errors.authorizedToWork && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.authorizedToWork}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Job Type */}
        <section className="space-y-6 border-b pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Job Type*</h2>
            </div>
            <div className="md:w-2/3 space-y-4">
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.jobType ? "border-red-500" : "border-gray-300"
                } rounded focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select job type...</option>
                {[
                  "Intern",
                  "Entry Level",
                  "Mid Level",
                  "Senior Level",
                  "Manager",
                  "Director",
                  "VP",
                  "C-Level",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {isSubmitted && errors.jobType && (
                <p className="text-red-500 text-sm mt-1 error-message">
                  {errors.jobType}
                </p>
              )}

              <div>
                <p className="font-medium mb-2">
                  Also open to the following job types:
                </p>
                <div className="space-y-2">
                  {[
                    { key: "fullTime", label: "Full-time Employee" },
                    { key: "contractor", label: "Contractor" },
                    { key: "cofounder", label: "Co-founder" },
                    { key: "freelancer", label: "Freelancer" },
                    { key: "internship", label: "Internship" },
                    { key: "partTime", label: "Part-time" },
                    { key: "consultant", label: "Consultant" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`openTo.${key}`}
                        checked={formData.openTo[key]}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* workLocation */}
        <section className="space-y-6 border-b pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Work Location*</h2>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                  placeholder="e.g., Manchester"
                  className={`w-full p-3 pl-10 border ${
                    errors.workLocation ? "border-red-500" : "border-gray-300"
                  } rounded focus:ring-2 focus:ring-blue-500`}
                />
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
                    />
                  </svg>
                </div>
                {isSubmitted && errors.workLocation && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.workLocation}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="openToRemote"
                  checked={formData.openToRemote}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Open to working remotely</span>
              </div>

              <select
                name="remotePreference"
                value={formData.remotePreference}
                onChange={handleChange}
                disabled={!formData.openToRemote}
                className={`w-full p-3 border ${
                  formData.openToRemote && errors.remotePreference
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:ring-2 focus:ring-blue-500 ${
                  !formData.openToRemote ? "bg-gray-100" : ""
                }`}
              >
                <option value="">Select remote preference...</option>
                <option value="Remote Only">Remote Only</option>
                <option value="Fully Remote">Fully Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
              {isSubmitted &&
                formData.openToRemote &&
                errors.remotePreference && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {errors.remotePreference}
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* Salary */}
        <section className="space-y-6 border-b pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Desired Salary</h2>
              <p className="text-gray-500 text-sm">Expected annual salary.</p>
            </div>
            <div className="md:w-2/3 flex flex-col gap-4">
              <div className="flex gap-4">
                <select
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  className="w-1/2 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>

                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="desiredSalary"
                    value={formData.desiredSalary}
                    onChange={handleChange}
                    placeholder="Amount"
                    className={`w-full p-3 pl-8 border ${
                      errors.desiredSalary
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:ring-2 focus:ring-blue-500`}
                  />
                  <span className="absolute left-3 top-3 text-gray-400">
                    {formData.salaryCurrency === "USD"
                      ? "$"
                      : formData.salaryCurrency === "EUR"
                      ? "€"
                      : formData.salaryCurrency === "GBP"
                      ? "£"
                      : "$"}
                  </span>
                </div>
              </div>
              {isSubmitted && errors.desiredSalary && (
                <p className="text-red-500 text-sm error-message">
                  {errors.desiredSalary}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Company Size Preferences */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">
                Company Size Preferences
              </h2>
              <p className="text-gray-500 text-sm">
                Preferred company size to work at.
              </p>
            </div>
            <div className="md:w-2/3">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { key: "Seed", label: "Seed (1-10 employees)" },
                    { key: "Early", label: "Early (11-50 employees)" },
                    { key: "Mid-size", label: "Mid-size (50-200 employees)" },
                    { key: "Large", label: "Large (201-500 employees)" },
                    {
                      key: "Very Large",
                      label: "Very Large (501-1000 employees)",
                    },
                    { key: "Massive", label: "Massive (1001+ employees)" },
                    { key: "Startup", label: "Startup (1-10 employees)" },
                    { key: "Public Company", label: "Public Company " },
                  ].map((size) => (
                    <tr key={size.key} className="border-b last:border-0">
                      <td className="py-4">{size.label}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-4">
                          {["Ideal", "Yes", "No"].map((value) => (
                            <label
                              key={value}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                name={`companySizePreferences.${size.key}`}
                                value={value}
                                checked={
                                  formData.companySizePreferences[size.key] ===
                                  value
                                }
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600"
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Success/Error Messages */}
        {isSuccess && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
            ✅ {hasExistingPreferences ? "Preferences updated successfully!" : "Preferences saved successfully!"}
          </div>
        )}

        {isError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
            ❌ {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : hasExistingPreferences ? "Update Preferences" : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
