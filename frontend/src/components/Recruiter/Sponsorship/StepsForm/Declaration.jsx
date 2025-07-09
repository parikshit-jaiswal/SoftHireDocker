import React, { useState, useEffect } from 'react'
import { Input, Question, OptionSelect, DateInput } from "@/components/miniComponents/MiniInputComponents.jsx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { getDeclarations, submitOrUpdateDeclarations } from '@/Api/SpocershipApplicationServices';


function Declaration() {
  const [answers, setAnswers] = useState({});
  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getDeclarations(applicationId);
      if (response) {
        setAnswers(mapBackendToAnswers(response));
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

  const mapBackendToAnswers = (data) => {
    if (!data) return {};
    return {
      serviceType: data.serviceType || "",
      canMeetSponsorDuties: data.canMeetSponsorDuties === true ? "Yes" : "No",
      agreeToTerms: data.agreesToTerms === true ? "Yes" : "No"
    };
  };

  const data = {
    serviceType: answers.serviceType,
    canMeetSponsorDuties: answers.canMeetSponsorDuties === "Yes",
    agreesToTerms: answers.agreeToTerms === "Yes"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await submitOrUpdateDeclarations(applicationId, { ...data });
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
    if (!answers.serviceType) return false;
    // Must agree to terms
    if (answers.agreeToTerms !== "Yes") return false;
    // Must confirm sponsor duties
    if (answers.canMeetSponsorDuties !== "Yes") return false;

    return true;
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <>
      <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
        <div>
          <OptionSelect
            label="Please select which service you'd like to proceed with?"
            value={answers.serviceType || ""}
            options={[
              { label: "Standard", value: "Standard" },
              { label: "Priority", value: "Priority" }
            ]}
            onChange={val => handleSelect("serviceType", val)}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Sponsor Duties</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-800">
            <li>Report absences, dismissals, resignations, changes in circumstances, breaches of conditions of leave, engagement in terrorism or criminal activity, etc.</li>
            <li>Monitor compliance by tracking and recording attendance.</li>
            <li>Ensure foreign workers are qualified and competent.</li>
            <li>Keep records with regards to a migrant worker's BRP, UKNI details, payslips, bank transfers etc.</li>
            <li>Keep records of the pre-employment process, such as DBS checks, Right to Work Checks, recruitment process etc.</li>
            <li>Ensure that we only employ workers who are qualified and competent, and that we only assign Certificates of Sponsorship when there is a genuine vacancy and the candidate is likely to fill the legal and professional requirements.</li>
          </ul>
        </div>

        <Question
          name="canMeetSponsorDuties"
          label="Will you be able to meet the sponsor duties if your application is granted?"
          answers={answers}
          handleSelect={handleSelect}
        />
        <Question
          name="agreeToTerms"
          label={<span><b>Softhire Declarations:</b> By submitting this application, you confirm that all information you’ve provided is accurate & to date. Do you agree to Softhire Terms & Conditions?</span>}
          answers={answers}
          handleSelect={handleSelect}
        />

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
    </>
  )
}

export default Declaration