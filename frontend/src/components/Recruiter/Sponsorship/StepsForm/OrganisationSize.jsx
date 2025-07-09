import React, { useState, useEffect } from 'react'
import { OptionSelect } from "@/components/miniComponents/MiniInputComponents.jsx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { getDeclarations, getOrganizationSize, submitOrUpdateDeclarations, updateOrganizationSize } from '@/Api/SpocershipApplicationServices';

function OrganisationSize() {
  const [answers, setAnswers] = useState({});
  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationSize(applicationId);
      if (response) {
        setAnswers(response);
      }
    } catch (error) {
      // toast.error("Error fetching form data. Please try again.");
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) fetchFormData();
  }, [applicationId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateOrganizationSize(applicationId, answers);
      toast.success("Sponsorship Application updated successfully!");
    } catch (error) {
      toast.error("Error submitting the form. Please try again.");
      console.error("Error updating Sponsorship Application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (name, value) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    console.log("answers:", answers);
  }, [answers]);

  const isFormValid = () => {
    // All three questions are required
    if (!answers.turnover) return false;
    if (!answers.assets) return false;
    if (!answers.employees) return false;
    return true;
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
      <div className="bg-blue-100 text-blue-900 rounded-xl px-6 py-4 text-base font-medium">
        We need to ask these questions to determine whether you are a small or large organisation according to the Home Office. Small sponsors pay a £574 license fee while large sponsors pay £1579.
      </div>
      <div className="bg-blue-100 text-blue-900 rounded-xl px-6 py-4 text-base font-medium">
        Further, when sponsoring workers on an ongoing basis small sponsors pay an Immigration Skills Charge of £364 per year while large sponsors pay £1000 per year of sponsorship.
      </div>
      <div>
        <OptionSelect
          label="In the last financial reporting period, what was your turnover?"
          value={answers.turnover || ""}
          options={[
            { label: "less than £15 million", value: "less than £15 million" },
            { label: "more than or equal to £15 million", value: "more than or equal to £15 million" }
          ]}
          onChange={val => handleSelect("turnover", val)}
        />
      </div>
      <div>
        <label className="block font-bold text-gray-900 text-base mb-2"></label>
        <OptionSelect
          label="In the last financial reporting period, what was your total assets worth?"
          value={answers.assets || ""}
          options={[
            { label: "less than £7.5 million", value: "less than £7.5 million" },
            { label: "more than or equal to £7.5 million", value: "more than or equal to £7.5 million" }
          ]}
          onChange={val => handleSelect("assets", val)}
        />
      </div>
      <div>
        <OptionSelect
          label="In the last financial reporting period, how many employees did you have?"
          value={answers.employees || ""}
          options={[
            { label: "less than 50", value: "less than 50" },
            { label: "more than or equal to 50", value: "more than or equal to 50" }
          ]}
          onChange={val => handleSelect("employees", val)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-end mt-16 border-t pt-8">
        <button
          type="submit"
          className={`px-8 py-3 rounded-full bg-blue-50 font-semibold text-base shadow-none border-none ${isFormValid() && !submitting ? 'text-blue-700 cursor-pointer hover:bg-blue-100' : 'text-blue-300 cursor-not-allowed select-none'}`}
          disabled={!isFormValid() || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="loader border-2 border-blue-300 border-t-blue-700 rounded-full w-4 h-4 animate-spin"></span>
              Submitting...
            </span>
          ) : 'Submit'}
        </button>
        <button
          type="button"
          className="px-8 py-3 rounded-full bg-blue-50 text-gray-700 font-semibold text-base hover:bg-blue-100 transition-colors"
          onClick={() => navigate("/sponsorship-license-application")}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default OrganisationSize