import { jobPreferences } from "@/Api/profile";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
        "Please enter a workLocation or select 'Open to working remotely'";
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

  const transformFormData = (formData) => {
    // Map job types with correct values from schema
    const openToMap = {
      fullTime: "Full-time Employee",
      contractor: "Contractor",
      cofounder: "Co-founder",
      freelancer: "Freelancer",
      internship: "Internship",
      partTime: "Part-time",
      consultant: "Consultant",
    };

    // Format remote preference to match backend schema enum
    let formattedRemotePreference = formData.remotePreference;
    if (formData.remotePreference === "Remote only") {
      formattedRemotePreference = "Remote Only";
    }

    // Map currency selections to correct format
    const currencyMap = {
      "United States Dollars ($)": "USD",
      "Euro (€)": "EUR",
      "British Pounds (£)": "GBP",
      USD: "USD",
      Euro: "EUR",
      GBP: "GBP",
    };

    return {
      needsSponsorship: formData.needsSponsorship === "Yes",
      authorizedToWork: formData.authorizedToWork === "Yes",
      jobType: formData.jobType,
      openTo: Object.keys(formData.openTo)
        .filter((key) => formData.openTo[key])
        .map((type) => openToMap[type] || type),
      workLocation: formData.workLocation,
      openToRemote: formData.openToRemote,
      remotePreference: formData.openToRemote ? formattedRemotePreference : undefined,
      desiredSalary: formData.desiredSalary
        ? Number(formData.desiredSalary)
        : undefined,
      salaryCurrency: currencyMap[formData.salaryCurrency] || "USD",
      companySizePreferences: Object.entries(
        formData.companySizePreferences
      ).map(([size, preference]) => ({
        size: size, // Use the size key directly as it already matches schema
        ideal: preference === "Ideal",
        interested: preference === "Ideal" || preference === "Yes",
      })),
    };
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

    const transformedData = transformFormData(formData);

    try {
      await jobPreferences(transformedData);

      // Success actions
      setIsSuccess(true);
      toast.success("Job preferences saved successfully!");
      setFormData(initialFormData); // reset form
      setErrors({});
      setIsSubmitted(false);
    } catch (err) {
      // Error handling
      setIsError(true);
      setErrorMessage(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-auto mx-auto px-6 py-8 border border-gray-200 bg-white rounded-lg shadow-md">
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

        {isSuccess && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
            Preferences submitted successfully!
          </div>
        )}

        {isError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
            {errorMessage}
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
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        {/* Overall form error summary (optional) */}
        {/* {isSubmitted && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc pl-5 mt-2">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )} */}
      </form>
    </div>
  );
}
