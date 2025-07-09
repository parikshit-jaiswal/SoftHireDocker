import React, { useEffect, useState } from 'react'
import { AlertCircleIcon, Plus, Info, EllipsisVertical, Check, FileCheck } from 'lucide-react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FileUpload, Input, Question } from '@/components/miniComponents/MiniInputComponents.jsx';
import { getSupportingDocuments, submitSupportingDocument, uploadSingleSupportingDocument } from '@/Api/SpocershipApplicationServices';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ifApplicable = [
  { label: 'Authorising Officer Passport', required: true, tag: "authorisingOfficerPassport" },
  { label: 'Authorising Officer BRP', required: true, tag: "authorisingOfficerBRP" },
  { label: 'Letter of Rejection', required: true, tag: "letterOfRejection" },
  { label: 'Letter of Revocation or Suspension', required: true, tag: "letterOfRevocationOrSuspension" },
  { label: 'Recruiters Form of Authority', required: true, tag: "recruitersAuthority" },
  { label: 'Audited Annual Account', required: true, tag: "auditedAnnualAccounts" },
  { label: 'Governing Body Registration', required: true, tag: "governingBodyRegistration" },
  { label: 'Franchise Agreement', required: true, tag: "franchiseAgreement" },
];

const additional = [
  { label: 'Service User Agreements', required: true, tag: "serviceUserAgreements" },
  { label: 'VAT Registration', required: true, tag: "vatRegistration" },
  { label: 'PAYE & HMRC Accounts Office Confirmation', required: true, tag: "payeHMRCAcountsOfficeConfirmation" },
  { label: 'Proof of Business Premise / Lease', required: true, tag: "businessPremiseProof" },
  { label: 'HMRC Company Tax Returns - CT603 and CT600', required: true, tag: "hmrcTaxReturns" },
  { label: 'Current Vacancies / Job Ads', required: true, tag: "currentVacancies" },
  { label: 'Contracts / Tender Agreements', required: true, tag: "contractsTenderAgreements" },
  { label: 'Organisation Chart', required: true, tag: "organisationChart" }
];

const mandatory = [
  { label: 'Certificate of Incorporation / Registration', required: true, tag: "certificateOfIncorporation" },
  { label: 'Business Bank Statement or Letter', required: true, tag: "businessBankStatement" },
  { label: 'Employers Liability Insurance Certificate', required: true, tag: "employersLiabilityInsurance" },
];

const forAdmin = [
  { label: 'Submission Sheet', required: false, tag: "submissionSheet" },
]

function DocItem({ label, required, fieldName, onUploadSuccess, uploadedDocuments }) {

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [document, setDocument] = useState({});
  const [uploading, setUploading] = useState(false);

  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const isUploaded =
    uploadedDocuments[fieldName] &&
    typeof uploadedDocuments[fieldName] === "object" &&
    Object.keys(uploadedDocuments[fieldName]).length > 0;


  const uploadDocument = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await uploadSingleSupportingDocument(applicationId, fieldName, document.name, document.file);
      toast.success("Document uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(); // <-- call refresh
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Error uploading the document. Please try again.");
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-6 py-5 justify-between">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className=" rounded-full w-10 h-10 flex items-center justify-center">
            <img className="w-8 h-8" src={!isUploaded ? `/caution.svg` : `/greenTick.png`} alt="" />
          </div>
        </div>
        <span className="font-semibold text-base text-gray-900">{label}{false ? ' (Required)' : ""}</span>
      </div>
      {required && (
        <div className="flex justify-end gap-3">
          {!isUploaded ? (
            <button onClick={() => setIsSheetOpen(true)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-2 py-1 text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors">
              <Plus size={16} /> Upload
            </button>
          ) : (
            <button onClick={() => window.open(`${uploadedDocuments[fieldName].url}`, '_blank')} className="flex items-center gap-2 bg-[#6bb577] hover:bg-[#5a9e66] text-white font-semibold rounded-lg px-3 py-1 text-base shadow-none border-none ">
              <FileCheck size={20} /> View
            </button>
          )}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
            </SheetTrigger>
            <SheetContent side="rightSm" className="overflow-y-auto">
              <SheetTitle className="hidden">Company Address</SheetTitle>
              <div className="">
                <p className="font-bold text-center text-lg mb-5">Upload Document</p>
                <div className="bg-[#FEE2E2] text-[#B91C1C] rounded-lg px-6 py-3 mb-3 text-base font-medium flex items-center gap-2">Please make sure you upload the documents in .pdf, .jpeg, .jpg or .png format only!</div>
                <div className="space-y-4  mt-5">
                  <Input name="documentName" label="Document Name" required={true} value={document.name || ""} onChange={e => setDocument({ ...document, name: e.target.value })} />
                  <FileUpload value={document.file} onChange={file => setDocument({ ...document, file })} />
                </div>
              </div>
              <div className="w-full z-50 mt-5">
                <button
                  type="button"
                  className={`px-8 py-2 rounded-lg font-semibold text-base ${!(!document.name || !document.file || uploading) ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  onClick={uploadDocument}
                  disabled={(!document.name || !document.file || uploading)}
                >
                  {uploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <button className="flex items-center ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><EllipsisVertical /></DropdownMenuTrigger>
              <DropdownMenuContent className="font-semibold">
                <DropdownMenuItem onClick={() => setIsSheetOpen(true)} >Edit</DropdownMenuItem>
                {/* <DropdownMenuItem>Info</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        </div>
      )}
    </div>
  );
}

function SupportingDoc() {

  const { applicationId } = useSelector((state) => state.sponcershipApplication);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [rtwData, setRtwData] = useState({});
  const [uploading, setUploading] = useState(false);


  const navigate = useNavigate();

  const uploadDocument = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await uploadSingleSupportingDocument(applicationId, "rightToWorkChecks", rtwData.name, rtwData.file, rtwData);
      toast.success("Document uploaded successfully!");
      fetchSupportingDocuments();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Error uploading the document. Please try again.");
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const isRTFDataUploaded =
    uploadedDocuments["rightToWorkChecks"] &&
    typeof uploadedDocuments["rightToWorkChecks"] === "object" &&
    Object.keys(uploadedDocuments["rightToWorkChecks"]).length > 0;

  const fetchSupportingDocuments = async () => {
    try {
      setLoading(true);
      const response = await getSupportingDocuments(applicationId);
      if (response) {
        setUploadedDocuments(response.fields || {});
      }
    } catch (error) {
      // toast.error("Error fetching form data. Please try again.");
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) fetchSupportingDocuments();
  }, [applicationId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedDocuments || !uploadedDocuments["rightToWorkChecks"] || !uploadedDocuments.certificateOfIncorporation || !uploadedDocuments.businessBankStatement || !uploadedDocuments.employersLiabilityInsurance) {
      toast.error("Please upload all required or mandatory documents and Right to Work checks before submiting.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await submitSupportingDocument(applicationId);
      toast.success("Sponsorship Application updated successfully!");
    } catch (error) {
      toast.error("Error submitting the form. Please try again.");
      console.error("Error updating Sponsorship Application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-10">
      <div className="font-bold text-xl mb-4">Supporting Documents</div>
      <div className="bg-[#FEE2E2] text-[#B91C1C] rounded-lg px-6 py-3 mb-3 text-base font-medium flex items-center gap-2">
        <AlertCircleIcon className="text-[#F87171]" size={20} />
        <span>
          Please upload all <b>REQUIRED</b> documents & 1 <b>ADDITIONAL</b> document & Right to Work checks in support of your application.
        </span>
      </div>
      <div className="bg-[#FEF9C3] text-[#92400E] rounded-lg px-6 py-3 mb-6 text-base font-medium flex items-center gap-2">
        <AlertCircleIcon className="text-[#FBBF24]" size={20} />
        <span>
          Please ensure that the documents aren't password protected before uploading them here.
        </span>
      </div>

      <div className="space-y-6">
        <div className="">
          <div className="font-semibold text-xl mb-2">If Applicable</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            {ifApplicable.map((doc, idx) => (
              <div key={idx} className={idx !== ifApplicable.length - 1 ? 'border-b' : ''}>
                <DocItem
                  label={doc.label}
                  required={doc.required}
                  fieldName={doc.tag}
                  onUploadSuccess={fetchSupportingDocuments}
                  uploadedDocuments={uploadedDocuments}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="">
          <div className="font-semibold text-xl mb-2">Additional</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            {additional.map((doc, idx) => (
              <div key={idx} className={idx !== additional.length - 1 ? 'border-b' : ''}>
                <DocItem
                  label={doc.label}
                  required={doc.required}
                  fieldName={doc.tag}
                  onUploadSuccess={fetchSupportingDocuments}
                  uploadedDocuments={uploadedDocuments}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="">
          <div className="font-semibold text-xl mb-2">Mandatory</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            {mandatory.map((doc, idx) => (
              <div key={idx} className={idx !== mandatory.length - 1 ? 'border-b' : ''}>
                <DocItem
                  label={doc.label}
                  required={doc.required}
                  fieldName={doc.tag}
                  onUploadSuccess={fetchSupportingDocuments}
                  uploadedDocuments={uploadedDocuments}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="">
          <div className="font-semibold text-xl mb-2">For Admin</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            {forAdmin.map((doc, idx) => (
              <div key={idx} className={idx !== forAdmin.length - 1 ? 'border-b' : ''}>
                <DocItem
                  label={doc.label}
                  required={doc.required}
                  fieldName={doc.tag}
                  onUploadSuccess={fetchSupportingDocuments}
                  uploadedDocuments={uploadedDocuments}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="">
          <div className="bg-white rounded-xl border overflow-hidden p-5">
            <div className="bg-[#FEE2E2] text-[#B91C1C] rounded-lg px-6 py-3 mb-3 text-base font-medium flex items-center gap-2">
              <span>
                The Home Office has become stricter with sponsor license applications. You must upload  Right to Work checks for your current employees.
                For moredivation visit: https://www.gov.uk/prove-right-to-work
                <br />
                <br />
                The Right To Work check must have been done before the employee started working at your organisation, otherwise this is not compliant.
                <br />
                <br />
                If you have any migrant workers, please upload their Right To Work Checks. For the remaining Right to work checks, you can use British nationals. For British nationals, the RTW check is their passports.
              </span>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="">
                <p className='text-2xl font-bold'>Right to Work Checks</p>
                <p className='opacity-45'>Please upload  Right to Work checks!</p>
              </div>
              <div className="flex justify-end gap-3">
                {!isRTFDataUploaded ?
                  <button onClick={() => setIsSheetOpen(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-2 py-1 text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors">
                    <Plus size={20} /> Upload
                  </button> :
                  <button onClick={() => window.open(`${uploadedDocuments?.rightToWorkChecks?.file?.url}`, '_blank')} className="flex items-center gap-2 bg-[#6bb577] hover:bg-[#5a9e66] text-white font-semibold rounded-lg px-3 py-1 text-base shadow-none border-none ">
                    <FileCheck size={20} /> View
                  </button>
                }
                {/* <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-2 py-1 text-base border border-gray-300">
                  <Info size={20} /> Sample RTW check
                </button> */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                  </SheetTrigger>
                  <SheetContent side="rightSm" className="overflow-y-auto">
                    <SheetTitle className="hidden">Company Address</SheetTitle>
                    <div className="">
                      <p className="font-bold text-center text-lg mb-5">Add RTW Checks</p>
                      <div className="bg-[#fcf7e8] text-[#e49a1e] rounded-lg px-6 py-3 mb-3 text-base font-medium flex items-center gap-2">Right To Work checks must be done for every employee before they start working. For British nationals, this can be a scan of their passport. For migrant workers, this must have been done using the online RTW check</div>
                      <div className="space-y-4  mt-5">
                        <Question name={"isBritishNational"} label={"Is this a right to work check for a British national?"} answers={rtwData} handleSelect={(name, value) => setRtwData({ ...rtwData, [name]: value })} />
                        <Input name="startDate" label="When did this employee start working for the organisation?" type='date' required={true} value={rtwData.startDate || ""} onChange={e => setRtwData({ ...rtwData, startDate: e.target.value })} />
                        <Input name="rightToWorkDate" label="When did you conduct this Right To Work?" type='date' required={true} value={rtwData.rightToWorkDate || ""} onChange={e => setRtwData({ ...rtwData, rightToWorkDate: e.target.value })} />
                        <Input name="employeeName" label="Employee Name" required={true} value={rtwData.employeeName || ""} onChange={e => setRtwData({ ...rtwData, employeeName: e.target.value })} />
                        <FileUpload value={rtwData.file} onChange={file => setRtwData({ ...rtwData, file })} />
                      </div>
                    </div>
                    <div className="w-full z-50 mt-5">
                      <button
                        type="button"
                        className={`px-8 py-2 rounded-lg font-semibold text-base ${(rtwData.startDate && rtwData.rightToWorkDate && rtwData.employeeName && rtwData.file && !uploading) ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        onClick={uploadDocument}
                        disabled={
                          !rtwData.employeeName ||
                          !rtwData.startDate ||
                          !rtwData.rightToWorkDate ||
                          !rtwData.file ||
                          uploading
                        }
                      >
                        {uploading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
                <button className="flex items-center ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><EllipsisVertical /></DropdownMenuTrigger>
                    <DropdownMenuContent className="font-semibold">
                      <DropdownMenuItem onClick={() => setIsSheetOpen(true)} >Edit</DropdownMenuItem>
                      {/* <DropdownMenuItem>Info</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="">
          <div className="bg-white rounded-xl border overflow-hidden p-5">
            <div className="bg-[#e3ebfa]  rounded-lg px-6 py-3 mb-3 text-base font-medium flex items-center gap-2">
              <span>
                If you have more documents which could be helpful for your application, please upload them here. This is optional.
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="">
                <p className='text-2xl font-bold'>Add More Documents</p>
              </div>
              <div className="flex justify-end gap-3">
                <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-2 py-1 text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors">
                  <Plus size={20} /> Upload
                </button>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-2 py-1 text-base border border-gray-300">
                  <Info size={20} /> Info
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-end mt-16 border-t pt-8">
        <button
          type="submit"
          className={`px-8 py-3 rounded-full bg-blue-50 font-semibold text-base shadow-none border-none ${!submitting ? 'text-blue-700 cursor-pointer hover:bg-blue-100' : 'text-blue-300 cursor-not-allowed select-none'}`}
          disabled={submitting}
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

    </div>
  )
}

export default SupportingDoc