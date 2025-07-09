import React, { useEffect, useState } from 'react'
import { Input, Question, OptionSelect, DateInput } from "@/components/miniComponents/MiniInputComponents.jsx";
import { countryOptions, prospectiveRolesOptions, timeFormatOptions } from "@/constants/sponcerLicenseFormOptions.js";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AlertCircleIcon, Plus, X } from 'lucide-react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { getAuthorisingOfficer, updateAuthorisingOfficer } from '@/Api/SpocershipApplicationServices';


function AboutYou() {
  const [answers, setAnswers] = React.useState({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [officerDetails, setOfficerDetails] = useState({ haveNationalInsuranceNumber: "", isSettledWorker: "" });
  const [officerList, setOfficerList] = useState([]);

  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isOfficerDetailsValid = () => {
    // Required fields
    if (!officerDetails.firstname || !officerDetails.lastname || !officerDetails.dob || !officerDetails.email || !officerDetails.role || !officerDetails.haveNationalInsuranceNumber || !officerDetails.nationality) {
      return false;
    }
    // National Insurance Number: only required if answered Yes
    if (officerDetails.haveNationalInsuranceNumber === 'Yes') {
      if (!officerDetails.nationalInsuranceNumber || officerDetails.nationalInsuranceNumber.length !== 9 || !officerDetails.nationalInsuranceNumber.match(/^[A-Z]{2}\d{6}[A-Z]$/)) {
        return false;
      }
    }
    // Immigration status: required if not a settled worker
    if (officerDetails.isSettledWorker === 'No') {
      if (!officerDetails.immigrationStatus) {
        return false;
      }
    }
    // Conviction details: required if hasCriminalConvictions is Yes
    if (officerDetails.hasCriminalConvictions === 'Yes') {
      if (!officerDetails.convictionDetails) {
        return false;
      }
    }
    return true;
  }

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getAuthorisingOfficer(applicationId);
      if (response) {
        const mapped = mapBackendToAnswers(response);
        setAnswers(mapped);
        setOfficerList(mapped.officerList || []);
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
    // Accept both array and object
    const officers = Array.isArray(data) ? data : (Array.isArray(data.authorisingOfficers) ? data.authorisingOfficers : [data]);
    return {
      officerList: officers.map(officer => ({
        title: officer.title || "",
        firstname: officer.firstName || "",
        lastname: officer.lastName || "",
        previouslyKnownAs: officer.previouslyKnownAs || "",
        phoneNo: officer.phoneNumber || "",
        email: officer.email || "",
        dob: officer.dateOfBirth ? officer.dateOfBirth.slice(0, 10) : "",
        role: officer.companyRole || officer.role || "",
        haveNationalInsuranceNumber: typeof officer.hasNationalInsuranceNumber === 'boolean' ? (officer.hasNationalInsuranceNumber ? "Yes" : "No") : "",
        nationalInsuranceNumber: officer.nationalInsuranceNumber || "",
        niNumberExemptReason: officer.niNumberExemptReason || "",
        nationality: officer.nationality || "",
        isSettledWorker: typeof officer.isSettledWorker === 'boolean' ? (officer.isSettledWorker ? "Yes" : "No") : "",
        immigrationStatus: officer.immigrationStatus || "",
        hasCriminalConvictions: typeof officer.hasConvictions === 'boolean' ? (officer.hasConvictions ? "Yes" : "No") : "",
        convictionDetails: officer.convictionDetails || "",
        hasPlannedHoliday: typeof officer.hasUpcomingHoliday === 'boolean' ? (officer.hasUpcomingHoliday ? "Yes" : "No") : "",
      }))
    };
  };

  const data = {
    authorisingOfficers: officerList.map(officer => ({
      title: officer.title || undefined,
      firstName: officer.firstname,
      lastName: officer.lastname,
      previouslyKnownAs: officer.previouslyKnownAs || undefined,
      phoneNumber: officer.phoneNo,
      email: officer.email,
      dateOfBirth: officer.dob,
      companyAddress: answers.companyAddress, // should be a string or object as per backend
      companyRole: officer.role,
      hasNationalInsuranceNumber: officer.haveNationalInsuranceNumber === 'Yes',
      nationalInsuranceNumber: officer.nationalInsuranceNumber || undefined,
      niNumberExemptReason: officer.niNumberExemptReason || undefined,
      nationality: officer.nationality,
      isSettledWorker: officer.isSettledWorker === 'Yes',
      immigrationStatus: officer.immigrationStatus || '',
      hasConvictions: officer.hasCriminalConvictions === 'Yes',
      convictionDetails: officer.convictionDetails || undefined,
      hasUpcomingHoliday: officer.hasPlannedHoliday === 'Yes',
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateAuthorisingOfficer(applicationId, data);
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
    if (officerList?.length > 0) return true;
    else { return false };
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
      <div className="bg-blue-50 text-blue-900 rounded-xl px-6 py-4 text-base font-medium mt-8">
        The Authorising Officer is the most senior person at your company responsible for the recruitment and sponsorship of migrants. They must be based in the UK and have responsibility to ensure your company's sponsorship duties are fulfilled.
      </div>

      <div className="space-y-2 ">
        <div className="">
          <div className="flex items-center justify-between mt-10 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Authorising Officer</h2>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg px-5 py-2 text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                >
                  <Plus size={20} /> Add
                </button>
              </SheetTrigger>
              <SheetContent side="rightSm" className="overflow-y-auto">
                <SheetTitle className="hidden">title</SheetTitle>
                <div className="">
                  <p className="font-bold text-center text-lg mb-5">Add Authorising Officer Details</p>
                  <div className="space-y-7 pb-10">
                    <div className="bg-[#fcf7e8] border border-[#e18f05] rounded-lg px-5 py-4 text-[#e18f05] text-base flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01M12 7v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Please enter your name exactly as it appears on your passport.
                    </div>
                    <OptionSelect label="Title" value={officerDetails.title || ""} onChange={label => setOfficerDetails(prev => ({ ...prev, title: label }))} required={false} options={[
                      { label: 'Mr', value: 'Mr' },
                      { label: 'Mrs', value: 'Mrs' },
                      { label: 'Miss', value: 'Miss' },
                      { label: 'Ms', value: 'Ms' },
                      { label: 'Mx', value: 'Mx' },
                      { label: 'Dr', value: 'Dr' }
                    ]} />

                    <Input name="firstname" label="First Name" value={officerDetails.firstname || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, firstname: e.target.value }))} />
                    <Input name="lastname" label="Last Name" value={officerDetails.lastname || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, lastname: e.target.value }))} />
                    <Input name="previouslyKnownAs" label="Previously Known As" type="text" placeholder='if applicable' required={false} value={officerDetails.previouslyKnownAs || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, previouslyKnownAs: e.target.value }))} />
                    <Input name="phoneNo" label="Phone Number" type="tel" required={false} placeholder='11 digits starting with 0' value={officerDetails.phoneNo || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, phoneNo: e.target.value }))} />
                    <Input name="email" label="Email Address" type="email" placeholder='please enter your work email' value={officerDetails.email || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, email: e.target.value }))} />
                    <div className="bg-[#fef6f5] border border-[#f87171] rounded-lg px-5 py-4 text-[#ef4444] text-base flex items-start gap-2">
                      <div className="h-5 mt-5"><AlertCircleIcon size={20} /></div>
                      <span>
                        - Please ensure that this email address is secure, <b>CORRECTLY SPELLED</b> and accessible to one person only. The Home Office uses this email as the sole form of communication for updates on your application.<br /><br />
                        - <b>DO NOT</b> use common emails such as 'info@', 'reception@', etc.
                      </span>
                    </div>
                    <Input name="dob" label="Date of Birth" type='date' value={officerDetails.dob || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, dob: e.target.value }))} />
                    <Input name="role" label="Your role in your company" type='text' value={officerDetails.role || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, role: e.target.value }))} />
                    <Question
                      name="haveNationalInsuranceNumber"
                      label="Do you have a National Insurance Number?"
                      answers={officerDetails}
                      handleSelect={(name, value) => setOfficerDetails(prev => ({ ...prev, [name]: value }))}
                    />
                    {officerDetails.haveNationalInsuranceNumber === 'Yes' && (
                      <div className="bg-[#e3ebfa]  rounded-lg px-5 py-4 text-base flex items-start gap-2">
                        <span>
                          Your National Insurance number is 9 digits long and starts with two letters, followed by six numbers and one letter e.g. AB123456C. If you have lost it www.gov.uk/lost-national-insurance-number may help you find it.
                        </span>
                      </div>
                    )}
                    <Input name="nationalInsuranceNumber" label="Please enter your National Insurance Number" type='text' placeholder='' value={officerDetails.nationalInsuranceNumber || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, nationalInsuranceNumber: e.target.value }))} />
                    <OptionSelect name="nationality" label="Nationality" options={countryOptions} value={officerDetails.nationality} onChange={e => setOfficerDetails(prev => ({ ...prev, nationality: e }))} />
                    <Question
                      name="isSettledWorker"
                      label="Are you a settled worker? (e.g. on Indefinite Leave to Remain, settled under EUSS scheme, etc)"
                      answers={officerDetails}
                      handleSelect={(name, value) => setOfficerDetails(prev => ({ ...prev, [name]: value }))}
                    />
                    {officerDetails.isSettledWorker === 'No' && (
                      <Input name="immigrationStatus" label="What’s your Immigration status in the UK as displayed on your BRP? (e.g pre-settled status, skilled worker)" type='text' placeholder='' value={officerDetails.immigrationStatus || ""} onChange={e => setOfficerDetails(prev => ({ ...prev, immigrationStatus: e.target.value }))} />
                    )}
                    <Question
                      name="hasCriminalConvictions"
                      label="Do you have any convictions or penalties?"
                      answers={officerDetails}
                      handleSelect={(name, value) => setOfficerDetails(prev => ({ ...prev, [name]: value }))}
                    />
                    {officerDetails.hasCriminalConvictions === 'Yes' && (
                      <div className="">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-bold text-gray-900 text-sm">Conviction Details</label>
                          {/* <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span> */}
                        </div>
                        <textarea
                          className="w-full rounded-lg border hover:border-gray-400 bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                          placeholder=""
                          value={officerDetails.convictionDetails || ""}
                          onChange={e => setOfficerDetails(prev => ({ ...prev, convictionDetails: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                    <Question
                      name="hasPlannedHoliday"
                      label="Do you have a planned holiday in the next month?"
                      answers={officerDetails}
                      handleSelect={(name, value) => setOfficerDetails(prev => ({ ...prev, [name]: value }))}
                    />
                    {officerDetails.hasPlannedHoliday === 'Yes' && (
                      <div className="bg-[#fef6f5] border border-[#f87171] rounded-lg px-5 py-4 text-[#ef4444] text-base flex items-start gap-2">
                        <div className="h-5 mt-5"><AlertCircleIcon size={20} /></div>
                        <span>
                          Please make sure you are working for the duration of this Sponsor License application. This is of utmost importance to maintain compliance & to not miss out on any communication from the HO on your email provided above. If you have planned holidays, please appoint another person in your company as an Authorising Officer.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full z-50">
                  <button
                    type="button"
                    className={`px-8 py-2 rounded-lg font-semibold text-base ${isOfficerDetailsValid() ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    onClick={() => {
                      if (isOfficerDetailsValid()) {
                        setOfficerList(prev => {
                          const updated = [...prev, officerDetails];
                          setAnswers(a => ({ ...a, officerList: updated }));
                          return updated;
                        });
                        setIsSheetOpen(false);
                        setOfficerDetails({});
                      }
                    }}
                    disabled={!isOfficerDetailsValid()}
                  >
                    Submit
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="mt-6">
          {officerList.length > 0 && (
            <div className="divide-y">
              {officerList.map((ref, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-2 md:gap-0 bg-blue-50 rounded-lg px-4 my-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <div className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                      {ref.title && <span>{ref.title}</span>} {ref.firstname} {ref.lastname}
                    </div>
                    <div className="text-gray-700 text-base">{ref.role}</div>
                    <div className="text-gray-700 text-base">{ref.email}</div>
                    <div className="text-gray-700 text-base">{ref.nationality}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                    onClick={() => {
                      setOfficerList(prev => prev.filter((_, i) => i !== idx));
                      setAnswers(a => ({ ...a, officerList: officerList.filter((_, i) => i !== idx) }));
                    }}
                  >
                    <X size={18} /> Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
    </form >
  )
}

export default AboutYou