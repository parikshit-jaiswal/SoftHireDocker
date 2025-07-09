import React, { useState, useEffect } from 'react'
import { Input, Question, OptionSelect, DateInput } from "@/components/miniComponents/MiniInputComponents.jsx";
import { countryOptions, prospectiveRolesOptions, timeFormatOptions } from "@/constants/sponcerLicenseFormOptions.js";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Plus, X } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { getActivityAndNeeds, updateActivityAndNeeds } from '@/Api/SpocershipApplicationServices';

function ActivityNeeds() {
  const [answers, setAnswers] = useState({});
  const [isProspectiveRolesSheetOpen, setIsProspectiveRolesSheetOpen] = useState(false);
  const [isEmployeeSheetOpen, setIsEmployeeSheetOpen] = useState(false);
  const [prospectiveRoles, setProspectiveRoles] = useState([]);
  const [prospectiveRole, setProspectiveRole] = useState({ role: "", proposedRoleTitle: "", jobDescription: "", isConfirmed: false, timeFormat: "", hoursPerWeek: "", amount: "" });

  const isPerspectiveRoleValid = prospectiveRole.role && prospectiveRole.hoursPerWeek && prospectiveRole.amount;

  const [Employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({ firstName: "", lastName: "", email: "", role: "", dateOfBirth: "", nationality: "", currentCountry: "", currentlyEmployed: "" });

  const isEmployeeValid = employee.nationality && employee.firstName && employee.lastName && employee.role && employee.currentCountry && employee.currentlyEmployed;

  const { applicationId } = useSelector((state) => state.sponcershipApplication);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddProspectiveRole = () => {
    if (isPerspectiveRoleValid) {
      const updatedRoles = [...prospectiveRoles, prospectiveRole];
      setProspectiveRoles(updatedRoles); // update local state for table
      handleSelect('prospectiveRoles', updatedRoles); // update answers for parent
      setProspectiveRole({ role: "", proposedRoleTitle: "", jobDescription: "", isConfirmed: false, timeFormat: "", hoursPerWeek: "", amount: "" }); // reset form
      setIsProspectiveRolesSheetOpen(false);
    }
  };

  const handleAddEmployee = () => {
    if (isEmployeeValid) {
      const updatedEmployees = [...Employees, employee];

      setEmployees(updatedEmployees); // update local state for table
      handleSelect('Employees', updatedEmployees); // update answers for parent
      setEmployee({ firstName: "", lastName: "", email: "", role: "", dateOfBirth: "", nationality: "", currentCountry: "", currentlyEmployed: "" }); // reset form
      setIsEmployeeSheetOpen(false);
      console.log(updatedEmployees)
      console.log(answers)
    }
  };

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getActivityAndNeeds(applicationId);
      if (response) {
        const mapped = mapBackendToAnswers(response);
        setAnswers(mapped);
        setProspectiveRoles(mapped.prospectiveRoles || []);
        setEmployees(mapped.Employees || []);
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

  const mapBackendToAnswers = (data) => ({
    numberOfEmployeesInUK: data.numberOfEmployeesUK?.toString() || "",
    employsMigrantWorkers: data.employsMigrantWorkers === true ? "Yes" : "No",
    numberOfMigrantWorkers: data.migrantWorkerCount?.toString() || "",
    numberOfUndefinedCoSfor12mnth: data.undefinedCosRequired?.toString() || "",
    numberOfDefinedCoSfor12mnth: data.definedCosRequired?.toString() || "",
    reasonsToSponsor: data.reasonsForSponsorship || [],
    reasonForHiring: data.sponsorshipJustification || "",
    hasIdentifiedCandidates: data.hasIdentifiedCandidates === true ? "Yes" : "No",
    Employees: data.hasIdentifiedCandidates
      ? (Array.isArray(data.prospectiveEmployees)
        ? data.prospectiveEmployees.map(emp => ({
          ...emp,
          currentlyEmployed: emp.currentlyEmployed ? "Yes" : "No",
          currentCountry: emp.currentResidence || ""
        }))
        : [])
      : [],
    prospectiveRoles: data.prospectiveRoles || [],
    howHaveYouTriedToRecruitForAbovePositions: data.howHaveYouTriedToRecruitForAbovePositions || [],
    doYouHaveHRPlatform: data.hasHRPlatform === true ? "Yes" : "No",
    HRPlatformName: data.hrPlatformName || "",
    currentPlatformCoversFollowing: typeof data.hrPlatformCoversAll === "boolean" ? (data.hrPlatformCoversAll ? "Yes" : "No") : undefined,
    needComplianceApp: typeof data.wantsBorderlessApp === "boolean" ? (data.wantsBorderlessApp ? "Yes" : "No") : undefined,
    planToMaintainHomeOfficeCompliance: data.compliancePlan || "",
  });

  const data = {
    numberOfEmployeesUK: Number(answers.numberOfEmployeesInUK),
    employsMigrantWorkers: answers.employsMigrantWorkers === "Yes",
    migrantWorkerCount: answers.employsMigrantWorkers === "Yes" ? Number(answers.numberOfMigrantWorkers) : undefined,
    undefinedCosRequired: Number(answers.numberOfUndefinedCoSfor12mnth),
    definedCosRequired: Number(answers.numberOfDefinedCoSfor12mnth),
    reasonsForSponsorship: answers.reasonsToSponsor || [],
    sponsorshipJustification: answers.reasonForHiring || "",
    hasIdentifiedCandidates: answers.hasIdentifiedCandidates === "Yes",
    prospectiveEmployees: answers.hasIdentifiedCandidates === "Yes"
      ? (answers.Employees || []).map(emp => ({
        ...emp,
        currentlyEmployed: emp.currentlyEmployed === "Yes",
        currentResidence: emp.currentCountry
      }))
      : [],
    prospectiveRoles: answers.prospectiveRoles || [],
    howHaveYouTriedToRecruitForAbovePositions: answers.howHaveYouTriedToRecruitForAbovePositions || [],
    hasHRPlatform: answers.doYouHaveHRPlatform === "Yes",
    hrPlatformName: answers.doYouHaveHRPlatform === "Yes" ? answers.HRPlatformName : undefined,
    hrPlatformCoversAll: answers.doYouHaveHRPlatform === "Yes" ? (answers.currentPlatformCoversFollowing === "Yes") : undefined,
    wantsBorderlessApp: (answers.doYouHaveHRPlatform === "Yes" && answers.currentPlatformCoversFollowing === "Yes") ? (answers.needComplianceApp === "Yes") : undefined,
    compliancePlan: ((answers.doYouHaveHRPlatform === "No") || (answers.needComplianceApp === "No")) ? answers.planToMaintainHomeOfficeCompliance : undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateActivityAndNeeds(applicationId, data);
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
    // numberOfEmployeesUK (required, allow 0)
    if (answers.numberOfEmployeesInUK === undefined || answers.numberOfEmployeesInUK === "" || isNaN(Number(answers.numberOfEmployeesInUK))) return false;
    // employsMigrantWorkers (required)
    if (answers.employsMigrantWorkers !== "Yes" && answers.employsMigrantWorkers !== "No") return false;
    // numberOfMigrantWorkers (required if employsMigrantWorkers is Yes, allow 0)
    if (answers.employsMigrantWorkers === "Yes" && (answers.numberOfMigrantWorkers === undefined || answers.numberOfMigrantWorkers === "" || isNaN(Number(answers.numberOfMigrantWorkers)))) return false;
    // numberOfUndefinedCoSfor12mnth (required, allow 0)
    if (answers.numberOfUndefinedCoSfor12mnth === undefined || answers.numberOfUndefinedCoSfor12mnth === "" || isNaN(Number(answers.numberOfUndefinedCoSfor12mnth))) return false;
    // numberOfDefinedCoSfor12mnth (required, allow 0)
    if (answers.numberOfDefinedCoSfor12mnth === undefined || answers.numberOfDefinedCoSfor12mnth === "" || isNaN(Number(answers.numberOfDefinedCoSfor12mnth))) return false;
    // reasonsToSponsor (required, at least one)
    if (!Array.isArray(answers.reasonsToSponsor) || answers.reasonsToSponsor.length === 0) return false;
    // reasonForHiring (required)
    if (!answers.reasonForHiring || answers.reasonForHiring.trim() === "") return false;
    // prospectiveRoles (required, at least one)
    if (!Array.isArray(answers.prospectiveRoles) || answers.prospectiveRoles.length === 0) return false;
    // hasIdentifiedCandidates (required)
    if (answers.hasIdentifiedCandidates !== "Yes" && answers.hasIdentifiedCandidates !== "No") return false;
    // Employees (required if hasIdentifiedCandidates is Yes)
    if (answers.hasIdentifiedCandidates === "Yes") {
      if (!Array.isArray(answers.Employees) || answers.Employees.length === 0) return false;
      for (const emp of answers.Employees) {
        if (!emp.firstName || !emp.lastName || !emp.role || !emp.nationality || !emp.currentCountry || typeof emp.currentlyEmployed !== "string") return false;
      }
    }
    // howHaveYouTriedToRecruitForAbovePositions (required, at least one)
    if (!Array.isArray(answers.howHaveYouTriedToRecruitForAbovePositions) || answers.howHaveYouTriedToRecruitForAbovePositions.length === 0) return false;
    // doYouHaveHRPlatform (required)
    if (answers.doYouHaveHRPlatform !== "Yes" && answers.doYouHaveHRPlatform !== "No") return false;
    if (answers.doYouHaveHRPlatform === "Yes") {
      // HRPlatformName (required)
      if (!answers.HRPlatformName || answers.HRPlatformName.trim() === "") return false;
      // currentPlatformCoversFollowing (required)
      if (answers.currentPlatformCoversFollowing !== "Yes" && answers.currentPlatformCoversFollowing !== "No") return false;
      if (answers.currentPlatformCoversFollowing === "Yes") {
        // needComplianceApp (required)
        if (answers.needComplianceApp !== "Yes" && answers.needComplianceApp !== "No") return false;
        if (answers.needComplianceApp === "No") {
          // planToMaintainHomeOfficeCompliance (required)
          if (!answers.planToMaintainHomeOfficeCompliance || answers.planToMaintainHomeOfficeCompliance.trim() === "") return false;
        }
      }
    } else {
      // planToMaintainHomeOfficeCompliance (required if no HR platform)
      if (!answers.planToMaintainHomeOfficeCompliance || answers.planToMaintainHomeOfficeCompliance.trim() === "") return false;
    }
    return true;
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  return (
    <>
      <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
        <Input name="numberOfEmployeesInUK" label="How many employees do you have in the UK? (both full-time & part-time)" type="number" placeholder='Add your VAT number' value={answers.numberOfEmployeesInUK || ""} onChange={e => handleSelect('numberOfEmployeesInUK', e.target.value)} />
        <Question name="employsMigrantWorkers" label="Do you currently employ migrant workers? (e.g students, dependents, EU workers without a settled status)" answers={answers} handleSelect={handleSelect} />
        {answers.employsMigrantWorkers === "Yes" && (
          <Input name="numberOfMigrantWorkers" label="How many migrants workers do you employ?" type="number" placeholder='' value={answers.numberOfMigrantWorkers || ""} onChange={e => handleSelect('numberOfMigrantWorkers', e.target.value)} />
        )}
        <Input name="numberOfUndefinedCoSfor12mnth" label="How many undefined CoS's do you need for the next 12 months?" type="number" placeholder='' value={answers.numberOfUndefinedCoSfor12mnth || ""} onChange={e => handleSelect('numberOfUndefinedCoSfor12mnth', e.target.value)} />
        <Input name="numberOfDefinedCoSfor12mnth" label="How many defined CoS's do you need for the next 12 months?" type="number" placeholder='' value={answers.numberOfDefinedCoSfor12mnth || ""} onChange={e => handleSelect('numberOfDefinedCoSfor12mnth', e.target.value)} />

        {/* Reasons to sponsor workers multi-select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-gray-900 text-sm ">What are the reasons you need to sponsor workers? (Select all that apply)</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <div className="flex flex-col gap-3 mb-6" id="reasonsToSponsor">
            {[
              "Hiring challenges",
              "Need to expand the business",
              "Specialist skills required",
              "Sponsoring an existing worker"
            ].map((reason) => (
              <label key={reason} className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md transition-all duration-150"
                  checked={Array.isArray(answers.reasonsToSponsor) && answers.reasonsToSponsor.includes(reason)}
                  onChange={e => {
                    const prev = Array.isArray(answers.reasonsToSponsor) ? answers.reasonsToSponsor : [];
                    if (e.target.checked) {
                      handleSelect('reasonsToSponsor', [...prev, reason]);
                    } else {
                      handleSelect('reasonsToSponsor', prev.filter(r => r !== reason));
                    }
                  }}
                />
                <span className="text-base text-gray-900">{reason}</span>
              </label>
            ))}
          </div>
          {/* Info/warning box */}
          <div className="bg-[#fcf7e8] border border-[#e18f05] rounded-lg px-5 py-4 text-[#e18f05] text-base mt-2">
            This is the heart of your application and the case you must make to the Home Office. Softhire will add much more detail to ensure your application is granted, but please provide as much content for us as possible.
          </div>
        </div>

        <div className="">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-gray-900 text-sm">In as much detail as possible, please provide us with the reason why you need to hire sponsored workers. Detail any company growth plans, recent vacancies, staff shortages, and difficulties recruiting.</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <textarea
            className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
            placeholder=""
            value={answers.reasonForHiring || ""}
            onChange={e => handleSelect("reasonForHiring", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="font-bold text-2xl">Prospective Roles</p>
            <Sheet open={isProspectiveRolesSheetOpen} onOpenChange={setIsProspectiveRolesSheetOpen}>
              <SheetTrigger asChild>
                <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-2">
                  <Plus size={16} />
                  Add Role(s)
                </button>
              </SheetTrigger>
              <SheetContent side="rightSm" className="overflow-y-auto">
                <SheetTitle className="hidden">Company Address</SheetTitle>
                <div className="">
                  <p className="font-bold text-center text-lg mb-5">Add Prospective Roles</p>
                  <div className="space-y-7 pb-10">
                    <OptionSelect label="Proposed Role" value={prospectiveRole.role} onChange={val => setProspectiveRole({ ...prospectiveRole, role: val })} options={prospectiveRolesOptions} />
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-800">
                      Please ensure that the home office description above corresponds with your job vacancy. If it doesn't, please select a different proposed role. There are multiple roles with similar names. The Home Office may request additional information if you select the incorrect role.
                    </div>
                    <Input name="prospectiveRoleTitle" label="Proposed Role Title" required={false} value={prospectiveRole.proposedRoleTitle} onChange={e => setProspectiveRole({ ...prospectiveRole, proposedRoleTitle: e.target.value })} />

                    <div className="">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-bold text-gray-900 text-sm">Job Description</label>
                        {/* <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span> */}
                      </div>
                      <textarea
                        className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                        placeholder=""
                        value={prospectiveRole.jobDescription}
                        onChange={e => setProspectiveRole({ ...prospectiveRole, jobDescription: e.target.value })}

                      />
                    </div>

                    {/* Confirmation and Find Minimum Salary Requirements button */}
                    <div className="flex flex-col gap-6 mt-8">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-5 h-5 mt-1 rounded-md border-gray-300 focus:ring-blue-500"
                          checked={prospectiveRole.isConfirmed}
                          onChange={e => setProspectiveRole({ ...prospectiveRole, isConfirmed: e.target.checked })}
                        />
                        <span className="text-base text-gray-900">I confirm this job description corresponds with the home office role description</span>
                      </label>
                      <button
                        type="button"
                        className="flex items-center w-fit gap-2 px-8 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-semibold text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                        onClick={() => { navigate("/salary-calculator") }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z" />
                        </svg>
                        Find Minimum Salary Requirements
                      </button>
                    </div>
                    <OptionSelect label="Time Format" value={prospectiveRole.timeFormat} required={false} onChange={val => setProspectiveRole({ ...prospectiveRole, timeFormat: val })} options={timeFormatOptions} />
                    <Input name="hoursPerWeek" label="Hours (per week)" type="number" placeholder='30-48' value={prospectiveRole.hoursPerWeek || ""} onChange={e => setProspectiveRole({ ...prospectiveRole, hoursPerWeek: e.target.value })} />
                    <Input name="amount" label="Amount" type="number" value={prospectiveRole.amount || ""} onChange={e => setProspectiveRole({ ...prospectiveRole, amount: e.target.value })} />
                  </div>
                </div>
                <div className="w-full z-50">
                  <button
                    type="button"
                    className={`px-8 py-2 rounded-lg font-semibold text-base ${isPerspectiveRoleValid ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    onClick={handleAddProspectiveRole}
                    disabled={!isPerspectiveRoleValid}
                  >
                    Submit
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Prospective Roles Table */}
          {prospectiveRoles.length > 0 && (
            <div className="mt-8">
              <table className="w-full text-left rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white text-gray-500 text-xs uppercase">
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Hourly Rate</th>
                    <th className="py-3 px-6">Weekly Hours</th>
                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {prospectiveRoles.map((role, idx) => (
                    <tr key={idx} className="bg-gray-50 hover:bg-gray-100 border-b">
                      <td className="py-4 px-6 font-bold text-gray-900">{role.role}{role.isConfirmed === false ? ' [Inactive]' : ''}</td>
                      <td className="py-4 px-6">{role.amount ? (Number(role.amount) / (Number(role.hoursPerWeek) || 1)).toFixed(2) : ''}</td>
                      <td className="py-4 px-6">{role.hoursPerWeek}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          className="text-gray-400 hover:text-gray-700"
                          onClick={e => {
                            e.preventDefault();
                            const updated = prospectiveRoles.filter((_, i) => i !== idx);
                            setProspectiveRoles(updated);
                            handleSelect('prospectiveRoles', updated);
                          }}
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Question
          name="hasIdentifiedCandidates"
          label="Have you already identified people you want to hire? We strongly recommend naming the prospective employees to increase the chances the Home Office grants you the requested CoS's."
          answers={answers}
          handleSelect={handleSelect}
        />
        {answers.hasIdentifiedCandidates === 'Yes' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="font-bold text-2xl">Prospective Employees</p>
                <Sheet open={isEmployeeSheetOpen} onOpenChange={setIsEmployeeSheetOpen}>
                  <SheetTrigger asChild>
                    <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-2">
                      <Plus size={16} />
                      Add Employee
                    </button>
                  </SheetTrigger>
                  <SheetContent side="rightSm" className="overflow-y-auto">
                    <SheetTitle className="hidden">Company Address</SheetTitle>
                    <div className="">
                      <p className="font-bold text-center text-lg mb-5">Add Employee Details</p>
                      <div className="space-y-7 pb-10">
                        <Input name="firstName" label="First Name" value={employee.firstName} onChange={e => setEmployee({ ...employee, firstName: e.target.value })} />
                        <Input name="lastName" label="Last Name" value={employee.lastName} onChange={e => setEmployee({ ...employee, lastName: e.target.value })} />
                        <Input name="email" label="Email" required={false} value={employee.email} onChange={e => setEmployee({ ...employee, email: e.target.value })} />
                        <Input name="dateOfBirth" label="Date of Birth" required={false} type='date' value={employee.dateOfBirth} onChange={e => setEmployee({ ...employee, dateOfBirth: e.target.value })} />
                        <Input name="role" label="Role" required={true} type='text' value={employee.role} onChange={e => setEmployee({ ...employee, role: e.target.value })} />
                        <OptionSelect label="Nationality" value={employee.nationality} required={true} onChange={val => setEmployee({ ...employee, nationality: val })} options={countryOptions} />
                        <OptionSelect label="Current Country of Residence" value={employee.currentCountry} required={true} onChange={val => setEmployee({ ...employee, currentCountry: val })} options={countryOptions} />
                        <Question name="currentlyEmployed" label="Is this employee currently employed at your company?" required={true} answers={employee} handleSelect={(name, val) => { setEmployee({ ...employee, [name]: val }) }} />
                      </div>
                      <div className="w-full z-50">
                        <button
                          type="button"
                          className={`px-8 py-2 rounded-lg font-semibold text-base ${isEmployeeValid ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                          onClick={handleAddEmployee}
                          disabled={!isEmployeeValid}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {Employees.length > 0 && (
                <div className="mt-8">
                  <table className="w-full text-left rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-white text-gray-500 text-xs uppercase">
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Role</th>
                        <th className="py-3 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Employees.map((employee, idx) => (
                        <tr key={idx} className="bg-gray-50 hover:bg-gray-100 border-b">
                          <td className="py-4 px-6 font-bold text-gray-900">{employee.firstName} {employee.lastName}</td>
                          <td className="py-4 px-6">{employee.email}</td>
                          <td className="py-4 px-6">{employee.role}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              className="text-gray-400 hover:text-gray-700"
                              onClick={e => {
                                e.preventDefault();
                                const updated = Employees.filter((_, i) => i !== idx);
                                setEmployees(updated);
                                handleSelect('Employees', updated);
                              }}
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}




        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-gray-900 text-sm ">How have you tried to recruit for the above positions?</label>
            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
          </div>
          <div className="flex flex-col gap-3 mb-6" id="howHaveYouTriedToRecruitForAbovePositions">
            {[
              "Social Media (LinkedIn or Facebook etc)",
              "Company Website",
              "Indeed",
              "Sponsoring an existing worker",
              "Career Fairs",
              "Referrals",
              "Other"
            ].map((reason) => (
              <label key={reason} className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md transition-all duration-150"
                  checked={Array.isArray(answers.howHaveYouTriedToRecruitForAbovePositions) && answers.howHaveYouTriedToRecruitForAbovePositions.includes(reason)}
                  onChange={e => {
                    const prev = Array.isArray(answers.howHaveYouTriedToRecruitForAbovePositions) ? answers.howHaveYouTriedToRecruitForAbovePositions : [];
                    if (e.target.checked) {
                      handleSelect('howHaveYouTriedToRecruitForAbovePositions', [...prev, reason]);
                    } else {
                      handleSelect('howHaveYouTriedToRecruitForAbovePositions', prev.filter(r => r !== reason));
                    }
                  }}
                />
                <span className="text-base text-gray-900">{reason}</span>
              </label>
            ))}
          </div>
        </div>
        <Question name="doYouHaveHRPlatform" label="Do you have a HR Platform?" answers={answers} handleSelect={handleSelect} />
        {answers.doYouHaveHRPlatform === "Yes" && (
          <>
            <Input name="HRPlatformName" label="Which HR Platform do you currently use? You must have a HR platform to maintain Home Office compliance. If you do not yet have you one, you may state that you use spreadsheets but this is not recommended." type="text" placeholder='' value={answers.HRPlatformName || ""} onChange={e => handleSelect('HRPlatformName', e.target.value)} />
            <Question name="currentPlatformCoversFollowing" label="Does your current platform cover the following?" content={<ul className="list-disc list-inside text-sm text-gray-500">
              <li>Payslip</li>
              <li>Rotas</li>
              <li>Annual Leave</li>
              <li>Sick Leave</li>
            </ul>} answers={answers} handleSelect={handleSelect} />
            {answers.currentPlatformCoversFollowing === "Yes" && (
              <Question name="needComplianceApp" label="Would you like to use Softhire's Compliance app to support you with your Home Office compliance needs?" answers={answers} handleSelect={handleSelect} />
            )}
          </>
        )}
        {((answers.doYouHaveHRPlatform === "No") || (answers.needComplianceApp === "No")) && (
          <div className="">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-gray-900 text-sm">How are you planning to maintain the Home Office's compliance?.</label>
              <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
            </div>
            <textarea
              className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
              placeholder=""
              value={answers.planToMaintainHomeOfficeCompliance || ""}
              onChange={e => handleSelect("planToMaintainHomeOfficeCompliance", e.target.value)}
              required
            />
          </div>
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

export default ActivityNeeds;