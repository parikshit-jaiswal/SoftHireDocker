import React, { useState, useEffect } from 'react'
import { Input, Question, OptionSelect, DateInput } from "@/components/miniComponents/MiniInputComponents.jsx";
import { sectorOptions, companyTypeOptions, entityTypeOptions, tradingLengthOptions } from "@/constants/sponcerLicenseFormOptions.js";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Plus } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { getCompanyStructure, updateCompanyStructure } from '@/Api/SpocershipApplicationServices';


function CompanyStructure() {
  const [answers, setAnswers] = useState({});
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previousTrade, setPreviousTrade] = useState({ name: '', from: '', to: '', address: '' });
  const [previousTradingNames, setPreviousTradingNames] = useState([])
  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getCompanyStructure(applicationId);
      if (response) {
        const mapped = mapBackendToAnswers(response);
        setAnswers(mapped);
        setSelectedRegions(mapped.selectedRegions || []);
        setPreviousTradingNames(mapped.previousTradingNames || []);
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
      sector: data.sector || "",
      operatesInCareSector: data.operatesInCareSector === true ? "Yes" : data.operatesInCareSector === false ? "No" : undefined,
      operatesInDomiciliaryCareSector: data.operatesInDomiciliaryCare === true ? "Yes" : data.operatesInDomiciliaryCare === false ? "No" : undefined,

      companyType: data.companyType || "",
      entityType: data.entityType || "",
      tradingDuration: data.tradingDuration || "",

      selectedRegions: Array.isArray(data.operatingRegions) ? data.operatingRegions : [],

      tradedUnderOtherName: data.tradedUnderOtherNames === true ? "Yes" : data.tradedUnderOtherNames === false ? "No" : undefined,
      previousTradingNames: Array.isArray(data.previousTradingNames) ? data.previousTradingNames : [],

      isVATRegistered: data.vatRegistered === true ? "Yes" : data.vatRegistered === false ? "No" : undefined,
      vatNumber: data.vatNumber || "",

      isCQCRegistered: data.isCQCRegistered === true ? "Yes" : data.isCQCRegistered === false ? "No" : undefined, // <-- add this line

      isCompanyRequiredToRegisterOrAccreditedByGoverningBody: data.requiresGoverningBodyRegistration === true ? "Yes" : data.requiresGoverningBodyRegistration === false ? "No" : undefined,
      governingBodyName: data.governingBodyDetails?.name || "",
      governingBodyRegistrationNumber: data.governingBodyDetails?.registrationNumber || "",
      governingBodyRegistrationExpiryDate: data.governingBodyDetails?.expiryDate || "",
      accountsOfficeReference: data.accountsOfficeReference || ""
    };
  };

  const data = {
    sector: answers.sector,
    operatesInCareSector: answers.operatesInCareSector === "Yes",
    operatesInDomiciliaryCare: answers.operatesInDomiciliaryCareSector === "Yes" ? true : answers.operatesInDomiciliaryCareSector === "No" ? false : undefined,

    companyType: answers.companyType,
    entityType: answers.entityType,
    tradingDuration: answers.tradingDuration,

    operatingRegions: selectedRegions,

    tradedUnderOtherNames: answers.tradedUnderOtherName === "Yes",
    previousTradingNames: Array.isArray(previousTradingNames)
      ? previousTradingNames.map(tn => ({
        name: tn.name,
        from: tn.from,
        to: tn.to,
        address: tn.address,
        wasTradingNameAddressSameAsRegistered: tn.wasTradingNameAddressSameAsRegistered
      }))
      : [],

    vatRegistered: answers.isVATRegistered === "Yes",
    ...(answers.isVATRegistered === "Yes" && { vatNumber: answers.vatNumber }),

    isCQCRegistered: answers.isCQCRegistered === "Yes", // <-- add this line

    requiresGoverningBodyRegistration: answers.isCompanyRequiredToRegisterOrAccreditedByGoverningBody === "Yes",
    ...(answers.isCompanyRequiredToRegisterOrAccreditedByGoverningBody === "Yes" && {
      governingBodyDetails: {
        name: answers.governingBodyName,
        registrationNumber: answers.governingBodyRegistrationNumber,
        expiryDate: answers.governingBodyRegistrationExpiryDate
      }
    }),

    accountsOfficeReference: answers.accountsOfficeReference || "" // <-- add this line
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateCompanyStructure(applicationId, data);
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
    // Sector, company type, entity type, trading duration
    if (!answers.sector) return false;
    if (!answers.companyType) return false;
    if (!answers.entityType) return false;
    if (!answers.tradingDuration) return false;

    // Region(s) required
    if (!Array.isArray(selectedRegions) || selectedRegions.length === 0) return false;

    // Care sector logic
    if (answers.operatesInCareSector === undefined) return false;
    if (answers.operatesInCareSector === "Yes" && answers.operatesInDomiciliaryCareSector === undefined) return false;

    // CQC registration required
    if (answers.isCQCRegistered === undefined) return false;

    // Previous trading names logic
    if (answers.tradedUnderOtherName === undefined) return false;
    if (answers.tradedUnderOtherName === "Yes" && (!Array.isArray(previousTradingNames) || previousTradingNames.length === 0)) return false;

    // VAT registration logic
    if (answers.isVATRegistered === undefined) return false;
    if (answers.isVATRegistered === "Yes" && !answers.vatNumber) return false;

    // Accounts office reference required
    if (!answers.accountsOfficeReference) return false;

    // Governing body logic
    if (answers.isCompanyRequiredToRegisterOrAccreditedByGoverningBody === undefined) return false;
    if (answers.isCompanyRequiredToRegisterOrAccreditedByGoverningBody === "Yes") {
      if (!answers.governingBodyName) return false;
      if (!answers.governingBodyRegistrationNumber) return false;
      if (!answers.governingBodyRegistrationExpiryDate) return false;
    }

    return true;
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <>
      <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
        <div>
          <OptionSelect label="What sector do you operate in?" value={answers.sector} onChange={label => handleSelect('sector', label)} options={sectorOptions} />
        </div>
        <Question name="operatesInCareSector" label="Do you operate in the Care sector?" answers={answers} handleSelect={handleSelect} />
        {answers["operatesInCareSector"] === "Yes" && (
          <Question name="operatesInDomiciliaryCareSector" label="Do you operate in the domiciliary care sector?" answers={answers} handleSelect={handleSelect} />
        )}
        <Question name="isCQCRegistered" label="Is your company CQC registered?" answers={answers} handleSelect={handleSelect} />
        {answers["isCQCRegistered"] === "No" && (
          <div className="bg-[#fcf7e8] p-4 rounded-lg font-medium text-[#d77a00]">
            Please Note: You cannot sponsor Carers with occupation code 6135 & 6136
          </div>
        )}
        <OptionSelect label="Company Type" value={answers.companyType} onChange={label => handleSelect('companyType', label)} options={companyTypeOptions} />
        <OptionSelect label="Entity Type" value={answers.entityType} onChange={label => handleSelect('entityType', label)} options={entityTypeOptions} />
        <OptionSelect label="How long have you been trading for?" value={answers.tradingDuration} onChange={label => handleSelect('tradingDuration', label)} options={tradingLengthOptions} />

        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-gray-900 text-base">Select the region(s) where your company operates.</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {['Wales', 'Northern Ireland', 'Scotland', 'England'].map((region) => {
              const isSelected = selectedRegions.includes(region);
              return (
                <button
                  key={region}
                  type="button"
                  className={`px-6 py-2 rounded-full border text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'}`}
                  onClick={() => {
                    setSelectedRegions((prev) => {
                      const updated = prev.includes(region)
                        ? prev.filter((r) => r !== region)
                        : [...prev, region];
                      setAnswers((a) => ({ ...a, selectedRegions: updated }));
                      return updated;
                    });
                  }}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        <Question name="tradedUnderOtherName" label="Has your company traded under any other name in the last four years?" answers={answers} handleSelect={handleSelect} />
        {answers["tradedUnderOtherName"] === "Yes" && (
          <div className="space-y-2 ">
            <div className="">
              <p className='block font-bold text-gray-900 text-base sm:text-md'>Please provide the previous trading name(s):</p>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <div className="w-[50%] mx-auto mt-2 flex items-center justify-center mb-2 hover:bg-[#f1f5fd] cursor-pointer p-2 rounded-lg">
                    <div className="flex gap-1 text-[#749ce7] cursor-pointer"><Plus /> <span>Add Previous Trading Name</span></div>
                  </div>
                </SheetTrigger>
                <SheetContent side="rightSm" className="overflow-y-auto">
                  <SheetTitle className="hidden">title</SheetTitle>
                  <div className="">
                    <p className="font-bold text-center text-lg mb-5">Add Previous Trading Name</p>
                    <div className="space-y-7 pb-10">
                      <Input name="name" label="Name" value={previousTrade.name || ""} onChange={e => setPreviousTrade(prev => ({ ...prev, name: e.target.value }))} />
                      <Input
                        name="from"
                        label="From"
                        type="date"
                        value={previousTrade.from || ""}
                        onChange={e => setPreviousTrade(prev => ({ ...prev, from: e.target.value }))}
                      />
                      <Input
                        name="to"
                        label="To"
                        type="date"
                        value={previousTrade.to || ""}
                        onChange={e => setPreviousTrade(prev => ({ ...prev, to: e.target.value }))}
                      />
                      <Question name="wasTradingNameAddressSameAsRegistered" label="Was the trading name address the same as your current registered address?" answers={previousTrade} handleSelect={(name, value) => setPreviousTrade(prev => ({ ...prev, [name]: value }))} />
                      {previousTrade["wasTradingNameAddressSameAsRegistered"] === "No" && (
                        <Input name="address" label="Please add the trading name address:" placeholder='Add complete address' value={previousTrade.address || ""} onChange={e => setPreviousTrade(prev => ({ ...prev, address: e.target.value }))} />
                      )}
                    </div>
                  </div>
                  <div className="w-full z-50">
                    <button
                      type="button"
                      className={`px-8 py-2 rounded-lg font-semibold text-base ${previousTrade.name && previousTrade.from && previousTrade.to && (previousTrade["wasTradingNameAddressSameAsRegistered"] !== "No" || previousTrade.address) ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      onClick={() => {
                        if (previousTrade.name && previousTrade.from && previousTrade.to && (previousTrade["wasTradingNameAddressSameAsRegistered"] !== "No" || previousTrade.address)) {
                          setPreviousTradingNames(prev => {
                            const updated = [...prev, previousTrade];
                            setAnswers(a => ({ ...a, previousTradingNames: updated }));
                            return updated;
                          });
                          setIsSheetOpen(false);
                          setPreviousTrade({ name: '', from: '', to: '', address: '', wasTradingNameAddressSameAsRegistered: '' });
                        }
                      }}
                      disabled={!(previousTrade.name && previousTrade.from && previousTrade.to && (previousTrade["wasTradingNameAddressSameAsRegistered"] !== "No" || previousTrade.address))}
                    >
                      Submit
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="mt-6">
              {previousTradingNames.length > 0 && (
                <div className="divide-y">
                  {previousTradingNames.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4">
                      <div>
                        <div className="font-bold text-md text-gray-900">{ref.name}</div>
                        <div className="text-gray-600 text-base">
                          {isValid(parseISO(ref.from)) ? format(parseISO(ref.from), 'd MMMM yyyy') : ref.from}
                          {ref.from && ref.to && ' to '}
                          {isValid(parseISO(ref.to)) ? format(parseISO(ref.to), 'd MMMM yyyy') : ref.to}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-900 px-2"
                        onClick={() => {
                          setPreviousTradingNames(prev => {
                            const updated = prev.filter((_, i) => i !== idx);
                            setAnswers(a => ({ ...a, previousTradingNames: updated }));
                            return updated;
                          });
                        }}
                        aria-label="Remove Previous Trading Name"
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

        <Question name="isVATRegistered" label="Is your company VAT registered?" answers={answers} handleSelect={handleSelect} />
        {answers["isVATRegistered"] === "Yes" && (
          <>
            <Input name="vatNumber" label="What is your VAT registration number?" placeholder='Add your VAT number' value={answers.vatNumber || ""} onChange={e => handleSelect('vatNumber', e.target.value)} />
          </>
        )}
        <Input name="accountsOfficeReference" label="What is your accounts office reference number? (This would have been sent to you by HMRC)" placeholder='Add your accounts office reference number' value={answers.accountsOfficeReference || ""} onChange={e => handleSelect('accountsOfficeReference', e.target.value)} />

        <Question name="isCompanyRequiredToRegisterOrAccreditedByGoverningBody" label="Is your company required to be registered with or accredited by a governing body to operate legally in the UK? (e.g CQC, FCA, Ofsted, etc.)" answers={answers} handleSelect={handleSelect} />
        {answers["isCompanyRequiredToRegisterOrAccreditedByGoverningBody"] === "Yes" && (
          <>
            <Input name="governingBodyName" label="Governing Body Name" placeholder='Add the name of the governing body' value={answers.governingBodyName || ""} onChange={e => handleSelect('governingBodyName', e.target.value)} />
            <Input name="governingBodyRegistrationNumber" label="Governing Body Registration Number" placeholder='Add the governing body registration number' value={answers.governingBodyRegistrationNumber || ""} onChange={e => handleSelect('governingBodyRegistrationNumber', e.target.value)} />
            <DateInput name="governingBodyRegistrationExpiryDate" label="Expiry Date for the Governing Body Registration Number" value={answers.governingBodyRegistrationExpiryDate || ""} onChange={date => handleSelect('governingBodyRegistrationExpiryDate', date)} />
          </>
        )}
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
    </>
  )
}

export default CompanyStructure