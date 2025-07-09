import { Lightbulb, MoveUpRight, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { countryOptions } from '@/constants/sponcerLicenseFormOptions.js';
import { Input, Question, OptionSelect } from "@/components/miniComponents/MiniInputComponents.jsx";
import { useNavigate } from 'react-router-dom';
import { getAboutYourCompany, updateAboutYourCompany } from '@/Api/SpocershipApplicationServices';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";

function AboutYourCompany() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    line3: "",
    city: "",
    county: "",
    postcode: "",
    country: "",
    telephone: ""
  });
  const [workLocations, setWorkLocations] = useState([]);
  const [workLocationAddress, setWorkLocationAddress] = useState({
    line1: "",
    line2: "",
    line3: "",
    city: "",
    county: "",
    postcode: "",
    country: "",
    telephone: ""
  });
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [isPayeeRefSheetOpen, setIsPayeeRefSheetOpen] = useState(false);
  const [isWorkLocationSheetOpen, setIsWorkLocationSheetOpen] = useState(false);
  const [payeReferenceNumber, setPayeReferenceNumber] = useState("");
  const [payeReferences, setPayeReferences] = useState([]);

  const payeRefPattern = /^\d{3}\/[A-Za-z0-9]{1,10}$/;
  const [payeRefError, setPayeRefError] = useState("");

  const isAddressValid = address.line1 && address.city && address.postcode && address.country && address.telephone;
  const isWorkLocationValid = workLocationAddress.line1 && workLocationAddress.city && workLocationAddress.postcode && workLocationAddress.country && workLocationAddress.telephone;

  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getAboutYourCompany(applicationId);
      if (response) {
        console.log("Fetched form data:", response);
        const mapped = mapBackendToAnswers(response);
        setAnswers(mapped);
        setAddress(mapped.address || {
          line1: "", line2: "", line3: "", city: "", county: "", postcode: "", country: "", telephone: ""
        });
        setWorkLocations(mapped.workLocations || []);
        setSelectedDays(mapped.selectedDays || []);
        setPayeReferences(mapped.payeReferences || []);
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

    // Address object
    const addressObj = data.registeredAddress || {
      line1: "", line2: "", line3: "", city: "", county: "", postcode: "", country: "", telephone: ""
    };

    // Work locations as array of objects
    const workLocationsArr = Array.isArray(data.otherWorkLocations)
      ? data.otherWorkLocations.map(loc => ({
        line1: loc.line1 || "",
        line2: loc.line2 || "",
        line3: loc.line3 || "",
        city: loc.city || "",
        county: loc.county || "",
        postcode: loc.postcode || "",
        country: loc.country || "",
        telephone: loc.telephone || ""
      }))
      : [];

    return {
      companyTradingName: data.tradingName || "",
      registeredCompanyName: data.registeredName || "",
      companyWebsite: data.website || "",
      companiesHouseReferenceNumber: data.companiesHouseNumber || "",
      hasEmployerPayeeRef: data.hasPayeReference === true ? "Yes" : data.hasPayeReference === false ? "No" : undefined,
      payeExemptReason: data.payeExemptReason || "",
      payeReferences: Array.isArray(data.payeReferences) ? data.payeReferences : [],
      haveAnyOtherWorkLocation: data.hasOtherLocations === true ? "Yes" : data.hasOtherLocations === false ? "No" : undefined,
      workLocations: workLocationsArr,
      ["trading&registeredAddressSame"]: data.sameAsRegistered === true ? "Yes" : data.sameAsRegistered === false ? "No" : undefined,
      serviceDescription: data.description || "",
      operatingHours: data.operatingHours || "",
      selectedDays: Array.isArray(data.operatingDays) ? data.operatingDays : [],
      address: addressObj
    };
  };

  const data = {
    tradingName: answers.companyTradingName,
    registeredName: answers.registeredCompanyName,
    website: answers.companyWebsite,
    companiesHouseNumber: answers.companiesHouseReferenceNumber,
    registeredAddress: address, // now an object

    hasPayeReference: answers.hasEmployerPayeeRef === "Yes",
    ...(answers.hasEmployerPayeeRef === "Yes"
      ? { payeReferences }
      : { payeExemptReason: answers.payeExemptReason }),

    hasOtherLocations: answers.haveAnyOtherWorkLocation === "Yes",
    ...(answers.haveAnyOtherWorkLocation === "Yes"
      ? { otherWorkLocations: workLocations } // now array of objects
      : {}),

    sameAsRegistered: answers["trading&registeredAddressSame"] === "Yes",
    ...(answers["trading&registeredAddressSame"] === "No"
      ? {
        tradingAddress:
          workLocations.length > 0
            ? workLocations[0]
            : {}
      }
      : {}),

    description: answers.serviceDescription,
    operatingHours: answers.operatingHours,
    operatingDays: selectedDays
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateAboutYourCompany(applicationId, data);
      toast.success("Sponsorship Application updated successfully!");
    } catch (error) {
      toast.error("Error submitting the form. Please try again.");
      console.error("Error Creating Sponsorship Application:", error);
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
    if (!answers.companyTradingName) return false;
    if (!answers.registeredCompanyName) return false;
    if (!answers.companyWebsite) return false;
    if (!answers.companiesHouseReferenceNumber) return false;
    if (!address.line1 || !address.city || !address.postcode || !address.country || !address.telephone) return false;

    // PAYE Reference logic
    if (answers.hasEmployerPayeeRef === undefined) return false;
    if (answers.hasEmployerPayeeRef === "Yes") {
      if (!Array.isArray(payeReferences) || payeReferences.length === 0) return false;
    } else if (answers.hasEmployerPayeeRef === "No") {
      if (!answers.payeExemptReason) return false;
    } else {
      return false;
    }

    // Work location logic
    if (answers.haveAnyOtherWorkLocation === undefined) return false;
    if (answers.haveAnyOtherWorkLocation === "Yes") {
      if (!Array.isArray(workLocations) || workLocations.length === 0) return false;
    }

    // Trading address logic
    if (answers["trading&registeredAddressSame"] === undefined) return false;
    if (answers["trading&registeredAddressSame"] === "No") {
      // If not same, require at least one work location
      if (!Array.isArray(workLocations) || workLocations.length === 0) return false;
    }

    // Description, hours, days
    if (!answers.serviceDescription) return false;
    if (!answers.operatingHours) return false;
    if (!Array.isArray(selectedDays) || selectedDays.length === 0) return false;

    return true;
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <>
      <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
        <Input name="companyTradingName" label="Company Trading Name" value={answers.companyTradingName || ""} onChange={e => handleSelect("companyTradingName", e.target.value)} />
        <Input name="registeredCompanyName" label="What is the registered name of your company?" value={answers.registeredCompanyName || ""} onChange={e => handleSelect("registeredCompanyName", e.target.value)} />
        <Input name="companyWebsite" label="Company Website" value={answers.companyWebsite || ""} onChange={e => handleSelect("companyWebsite", e.target.value)} />
        <Input name="companiesHouseReferenceNumber" label="Companies House Reference Number" placeholder="As listed on Companies House" value={answers.companiesHouseReferenceNumber || ""} onChange={e => handleSelect("companiesHouseReferenceNumber", e.target.value)} />

        <div className="space-y-2">
          <p className='block font-bold text-gray-900 text-base sm:text-md'>What is your registered company address? (As listed on Companies House)</p>
          <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
            <SheetTrigger asChild>
              <div className="flex items-center justify-between mb-2 hover:bg-[#f3f4f6] cursor-pointer p-3 rounded-lg">
                <div className="flex flex-col">
                  {address.line1 && <span>{address.line1}</span>}
                  {address.line2 && <span>{address.line2}</span>}
                  {address.line3 && <span>{address.line3}</span>}
                  {address.city && <span>{address.city}</span>}
                  {address.country && <span>{address.country}</span>}
                  {!address.line1 && !address.line2 && !address.line3 && !address.city && !address.country && (
                    <span>Add your company's address</span>
                  )}
                </div>
                <p className='bg-[#e9eef7] rounded-full p-1'><MoveUpRight color='#91b0eb' /></p>
              </div>
            </SheetTrigger>
            <SheetContent side="rightSm" className="overflow-y-auto">
              <SheetTitle className="hidden">Company Address</SheetTitle>
              <div className="">
                <p className="font-bold text-center text-lg mb-5">Company Address</p>
                <div className="space-y-7 pb-10">
                  <Input name="line1" label="Line 1" value={address.line1 || ""} onChange={e => setAddress({ ...address, line1: e.target.value })} />
                  <Input name="line2" label="Line 2" value={address.line2 || ""} required={false} onChange={e => setAddress({ ...address, line2: e.target.value })} />
                  <Input name="line3" label="Line 3" value={address.line3 || ""} required={false} onChange={e => setAddress({ ...address, line3: e.target.value })} />
                  <Input name="city" label="City" value={address.city || ""} onChange={e => setAddress({ ...address, city: e.target.value })} />
                  <Input name="county" label="County" value={address.county || ""} required={false} onChange={e => setAddress({ ...address, county: e.target.value })} />
                  <Input name="postcode" label="Postcode" value={address.postcode || ""} onChange={e => setAddress({ ...address, postcode: e.target.value })} />
                  <div>
                    <OptionSelect label="Country" value={address.country} onChange={val => setAddress({ ...address, country: val })} options={countryOptions} />
                  </div>
                  <Input name="telephone" label="Telephone Number" placeholder="All digit number starting with '0'" value={address.telephone || ""} onChange={e => setAddress({ ...address, telephone: e.target.value })} />
                </div>
              </div>
              <div className="w-full z-50">
                <button
                  type="button"
                  className={`px-8 py-2 rounded-lg font-semibold text-base ${isAddressValid ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  onClick={() => {
                    if (isAddressValid) {
                      handleSelect("address", address);
                      setIsAddressSheetOpen(false);
                    }
                  }}
                  disabled={!isAddressValid}
                >
                  Submit
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Question name="hasEmployerPayeeRef" label="Do you have an employer PAYE reference?" answers={answers} handleSelect={handleSelect} />
        {answers["hasEmployerPayeeRef"] === "No" && (
          <Input name="payeExemptReason" label="PAYE Exempt Reason" value={answers.payeExemptReason || ""} onChange={e => handleSelect("payeExemptReason", e.target.value)} />
        )}
        {answers["hasEmployerPayeeRef"] === "Yes" && (
          <div className="space-y-2 ">
            <div className="">
              <p className='block font-bold text-gray-900 text-base sm:text-md'>Please provide at least one PAYE Reference:</p>
              <Sheet open={isPayeeRefSheetOpen} onOpenChange={setIsPayeeRefSheetOpen}>
                <SheetTrigger asChild>
                  <div className="w-[50%] mx-auto mt-2 flex items-center justify-center mb-2 hover:bg-[#f1f5fd] cursor-pointer p-2 rounded-lg">
                    <div className="flex gap-1 text-[#749ce7] cursor-pointer"><Plus /> <span>Add PAYE Reference</span></div>
                  </div>
                </SheetTrigger>
                <SheetContent side="rightSm" className="overflow-y-auto">
                  <SheetTitle className="hidden">Company Address</SheetTitle>
                  <div className="">
                    <p className="font-bold text-center text-lg mb-5">Add PAYE Reference</p>
                    <div className="space-y-7 pb-10">
                      <div className="flex  gap-2 bg-yellow-50 rounded-lg p-4 mb-4 text-yellow-600 text-base">
                        <Lightbulb size={40} />
                        <div>
                          <div>The format of an employer PAYE reference (also known as an employer reference number) should be:</div>
                          <ul className="list-disc ml-6">
                            <li>3 numbers</li>
                            <li>a forward slash (/)</li>
                            <li>between 1 and 10 characters, which can be letters and numbers</li>
                          </ul>
                          <div>e.g. format of 123/XX12345, or 123/X12345 (prior to 2001)</div>
                        </div>
                      </div>
                      <Input name="payeReferenceNumber" label="Reference Number" placeholder="e.g. 123/XX12345" value={payeReferenceNumber} onChange={e => {
                        setPayeRefError("");
                        setPayeReferenceNumber(e.target.value);
                      }} />
                      {payeRefError && (
                        <div className="text-red-600 text-sm mt-1">{payeRefError}</div>
                      )}
                    </div>
                  </div>
                  <div className="w-full z-50">
                    <button
                      type="button"
                      className={`px-8 py-2 rounded-lg font-semibold text-base ${payeRefPattern.test(payeReferenceNumber) ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      onClick={() => {
                        if (payeRefPattern.test(payeReferenceNumber)) {
                          setPayeReferences(prev => {
                            const updated = [...prev, payeReferenceNumber];
                            setAnswers(a => ({ ...a, payeReferences: updated }));
                            return updated;
                          });
                          setIsPayeeRefSheetOpen(false);
                          setPayeReferenceNumber("");
                        } else {
                          setPayeRefError("Please enter a valid PAYE reference (e.g. 123/XX12345)");
                        }
                      }}
                      disabled={!payeRefPattern.test(payeReferenceNumber)}
                    >
                      Submit
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="mt-6">
              {payeReferences.length > 0 && (
                <div className="divide-y">
                  {payeReferences.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4">
                      <span className="text-lg text-gray-900">{ref}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-900 px-2"
                        onClick={() => {
                          setPayeReferences(prev => {
                            const updated = prev.filter((_, i) => i !== idx);
                            setAnswers(a => ({ ...a, payeReferences: updated }));
                            return updated;
                          });
                        }}
                        aria-label="Remove PAYE Reference"
                      >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#f3f4f6" /><path d="M7.5 7.5l5 5m0-5l-5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Question name="haveAnyOtherWorkLocation" label="Do you have any other work locations?" answers={answers} handleSelect={handleSelect} />
        <Question name="trading&registeredAddressSame" label="Is your Trading address the same as your registered address?" answers={answers} handleSelect={handleSelect} />
        {!(answers["haveAnyOtherWorkLocation"] === "No" && answers["trading&registeredAddressSame"] === "Yes") && (
          <div className="space-y-2 ">
            <p className='block font-bold text-gray-900 text-base sm:text-md'>What are the other work address? Please list all locations.</p>
            <div className="flex items-center justify-between text-sm font-medium mb-2 bg-[#e3ebfa] cursor-pointer p-3 rounded-lg">
              To maintain compliance with the Home Office, you must include all work addresses in your application. For workers without a fixed work address, please input the trading or office address.
            </div>
            <div className="w-[50%] mx-auto mt-2 flex items-center justify-center mb-2 hover:bg-[#f1f5fd] cursor-pointer p-2 rounded-lg">
              <Sheet open={isWorkLocationSheetOpen} onOpenChange={setIsWorkLocationSheetOpen}>
                <SheetTrigger asChild>
                  <div className="flex gap-1 text-[#749ce7] cursor-pointer"><Plus /> <span>Add Work Location(s)</span></div>
                </SheetTrigger>
                <SheetContent side="rightSm" className="overflow-y-auto">
                  <SheetTitle className="hidden">Add Work Location</SheetTitle>
                  <div className="">
                    <p className="font-bold text-center text-lg mb-5">Add Work Location</p>
                    <div className="space-y-7 pb-10">
                      <Input name="line1" label="Line 1" value={workLocationAddress.line1 || ""} onChange={e => setWorkLocationAddress({ ...workLocationAddress, line1: e.target.value })} />
                      <Input name="line2" label="Line 2" value={workLocationAddress.line2 || ""} required={false} onChange={e => setWorkLocationAddress({ ...workLocationAddress, line2: e.target.value })} />
                      <Input name="line3" label="Line 3" value={workLocationAddress.line3 || ""} required={false} onChange={e => setWorkLocationAddress({ ...workLocationAddress, line3: e.target.value })} />
                      <Input name="city" label="City" value={workLocationAddress.city || ""} onChange={e => setWorkLocationAddress({ ...workLocationAddress, city: e.target.value })} />
                      <Input name="county" label="County" value={workLocationAddress.county || ""} required={false} onChange={e => setWorkLocationAddress({ ...workLocationAddress, county: e.target.value })} />
                      <Input name="postcode" label="Postcode" value={workLocationAddress.postcode || ""} onChange={e => setWorkLocationAddress({ ...workLocationAddress, postcode: e.target.value })} />
                      <div>
                        <OptionSelect label="Country" value={workLocationAddress.country} onChange={val => setWorkLocationAddress({ ...workLocationAddress, country: val })} options={countryOptions} />
                      </div>
                      <Input name="telephone" label="Telephone Number" placeholder="All digit number starting with '0'" value={workLocationAddress.telephone || ""} onChange={e => setWorkLocationAddress({ ...workLocationAddress, telephone: e.target.value })} />
                    </div>
                  </div>
                  <div className="w-full z-50">
                    <button
                      type="button"
                      className={`px-8 py-2 rounded-lg font-semibold text-base ${isWorkLocationValid ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      onClick={() => {
                        if (isWorkLocationValid) {
                          setWorkLocations(prev => {
                            const updated = [...prev, workLocationAddress];
                            setAnswers(a => ({ ...a, workLocations: updated }));
                            return updated;
                          });
                          setIsWorkLocationSheetOpen(false);
                          setWorkLocationAddress({
                            line1: "",
                            line2: "",
                            line3: "",
                            city: "",
                            county: "",
                            postcode: "",
                            country: "",
                            telephone: ""
                          });
                        }
                      }}
                      disabled={!isWorkLocationValid}
                    >
                      Submit
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="mt-6">
              {workLocations.length > 0 && (
                <div className="divide-y">
                  {workLocations.map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4">
                      <span className="text-lg text-gray-900">
                        {loc.line1}
                        {loc.line2 && `, ${loc.line2}`}
                        {loc.line3 && `, ${loc.line3}`}
                        , {loc.city}, {loc.country}
                      </span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-900 px-2"
                        onClick={() => {
                          setWorkLocations(prev => {
                            const updated = prev.filter((_, i) => i !== idx);
                            setAnswers(a => ({ ...a, workLocations: updated }));
                            return updated;
                          });
                        }}
                        aria-label="Remove Work Location"
                      >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#f3f4f6" /><path d="M7.5 7.5l5 5m0-5l-5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-gray-900 text-base">Please provide a short (~100 word) description of the service that your company provides.</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <textarea
            className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
            placeholder="Please include information such as the type of services you offer, company values, and any specialised services you provide."
            value={answers.serviceDescription || ""}
            onChange={e => handleSelect("serviceDescription", e.target.value)}
            required
          />
        </div>

        <Input name="operatingHours" label="What are your operating hours? (Please enter the start & end time)" placeholder="e.g. 9am - 5pm" value={answers.operatingHours || ""} onChange={e => handleSelect("operatingHours", e.target.value)} />

        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-gray-900 text-base">Which days are you open? (Select Multiple)</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`px-6 py-2 rounded-full border text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'}`}
                  onClick={() => {
                    setSelectedDays((prev) => {
                      const updated = prev.includes(day)
                        ? prev.filter((d) => d !== day)
                        : [...prev, day];
                      setAnswers((a) => ({ ...a, selectedDays: updated }));
                      return updated;
                    });
                  }}
                >
                  {day}
                </button>
              );
            })}
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
            onClick={() => navigate("/sponsorship-license-application")}
            className="px-8 py-3 rounded-full bg-blue-50 text-gray-700 font-semibold text-base hover:bg-blue-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default AboutYourCompany;