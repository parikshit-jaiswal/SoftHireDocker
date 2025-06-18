import { useState } from "react";
import debounce from "lodash.debounce";
import API from "../Api/api";
export default function ImmigrationCalculator() {
  // State for form inputs
  const [role, setRole] = useState("2141 - Web design professionals");
  const [sponsorSize, setSponsorSize] = useState("small");
  const [location, setLocation] = useState("uk");
  const [visaType, setVisaType] = useState("student");
  const [sponsorshipLength, setSponsorshipLength] = useState("");
  const [enteredAsStudent, setEnteredAsStudent] = useState("yes");
  const [needsPriorityProcessing, setNeedsPriorityProcessing] = useState("no");
  const [partnerNeedsPriorityProcessing, setPartnerNeedsPriorityProcessing] =
    useState("no");
  const [applyingWithPartner, setApplyingWithPartner] = useState("no");
  const [applyingWithChildren, setApplyingWithChildren] = useState("no");
  const [searchText, setSearchText] = useState("");
  const [jobOptions, setJobOptions] = useState([]);
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [childrenNeedsPriorityProcessing, setChildrenNeedsPriorityProcessing] =
    useState("no");
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

  const handleSearch = debounce((text) => {
    if (text.length === 0) {
      setJobOptions([]);
    } else {
      fetchFilteredJobs(text);
    }
  }, 300);

  const handleJobSelect = (job) => {
    setRole(job.occupationCode);
    setSearchText(`${job.occupationCode} - ${job.jobType}`);
    setJobOptions([]);
  };

  // Handle form changes
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleSponsorSizeChange = (value) => setSponsorSize(value);
  const handleLocationChange = (value) => setLocation(value);
  const handleVisaTypeChange = (value) => setVisaType(value);
  const handleSponsorshipLengthChange = (e) =>
    setSponsorshipLength(e.target.value);
  const handleEnteredAsStudentChange = (value) => setEnteredAsStudent(value);
  const handlePriorityProcessingChange = (value) =>
    setNeedsPriorityProcessing(value);
  const handlePartnerNeedsPriorityProcessingChange = (value) => {
    // console.log("Partner Priority Processing:", value);
    setPartnerNeedsPriorityProcessing(value);
  };
  const handleChildrenNeedsPriorityProcessingChange = (value) => {
    // console.log("Children Priority Processing:", value);
    setChildrenNeedsPriorityProcessing(value);
  };
  const handleApplyingWithPartnerChange = (value) =>
    setApplyingWithPartner(value);
  const handleApplyingWithChildrenChange = (value) =>
    setApplyingWithChildren(value);

  const visaGovFeeAmount = sponsorshipLength <= "3" ? 390 : 510; // number, no "£"
  const candidateIHS = sponsorshipLength * 1040; // already a number
  const priorityVisaFee = needsPriorityProcessing === "yes" ? 510 : 0;

  const partnerVisaGovFeeAmount = sponsorshipLength <= "3" ? 390 : 510; // number, no "£"
  const partnerCandidateIHS = sponsorshipLength * 1040; // already a number
  const partnerPriorityVisaFee =
    partnerNeedsPriorityProcessing === "yes" ? 510 : 0;

  const childrenVisaGovFee =
    sponsorshipLength <= "3" ? 390 * numberOfChildren : 510 * numberOfChildren;
  const childrenIHS = numberOfChildren * 1040;
  const childrenPriorityFee =
    childrenNeedsPriorityProcessing === "yes" ? 510 * numberOfChildren : 0;

  const totalChildrenFees =
    childrenVisaGovFee + childrenIHS + childrenPriorityFee;

  const totalCandidateFees = visaGovFeeAmount + candidateIHS + priorityVisaFee;
  const totalDependantFees =
    partnerVisaGovFeeAmount +
    partnerCandidateIHS +
    partnerPriorityVisaFee +
    totalChildrenFees;

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 bg-gray-50 rounded-lg max-w-6xl mx-auto">
      {/* Calculator Form */}
      <div className="w-full md:w-1/2 border-2 border-blue-300 border-dashed rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-200 pb-2">
          Immigration Skill Charge Calculator
        </h2>

        {/* Role Selection */}
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

        {/* Sponsor Size */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Sponsor Size
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="small"
              name="sponsorSize"
              value="small"
              checked={sponsorSize === "small"}
              onChange={handleSponsorSizeChange}
              label="Small"
            />
            <RadioButton
              id="large"
              name="sponsorSize"
              value="large"
              checked={sponsorSize === "large"}
              onChange={handleSponsorSizeChange}
              label="Large"
            />
          </div>
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Current Location of the Candidate
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="uk"
              name="location"
              value="uk"
              checked={location === "uk"}
              onChange={handleLocationChange}
              label="UK"
            />
            <RadioButton
              id="overseas"
              name="location"
              value="overseas"
              checked={location === "overseas"}
              onChange={handleLocationChange}
              label="Overseas"
            />
          </div>
        </div>

        {/* Current Visa Type */}
        {location === "uk" && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Current Visa Type
            </label>
            <div className="flex flex-wrap gap-3">
              <RadioButton
                id="student"
                name="visaType"
                value="student"
                checked={visaType === "student"}
                onChange={handleVisaTypeChange}
                label="Student"
              />
              <RadioButton
                id="dependent"
                name="visaType"
                value="dependent"
                checked={visaType === "dependent"}
                onChange={handleVisaTypeChange}
                label="Dependent"
              />
              <RadioButton
                id="skilled"
                name="visaType"
                value="skilled"
                checked={visaType === "skilled"}
                onChange={handleVisaTypeChange}
                label="Skilled"
              />
              <RadioButton
                id="graduate"
                name="visaType"
                value="graduate"
                checked={visaType === "graduate"}
                onChange={handleVisaTypeChange}
                label="Graduate"
              />
              <RadioButton
                id="other"
                name="visaType"
                value="other"
                checked={visaType === "other"}
                onChange={handleVisaTypeChange}
                label="Other"
              />
              <RadioButton
                id="mobility"
                name="visaType"
                value="mobility"
                checked={visaType === "mobility"}
                onChange={handleVisaTypeChange}
                label="Youth Mobility Visa"
              />
            </div>
          </div>
        )}

        {/* Length of Sponsorship */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Length of Sponsorship (In Years)
          </label>
          <div className="relative">
            <input
              className="w-full p-2 border rounded appearance-none bg-white"
              value={sponsorshipLength}
              onChange={handleSponsorshipLengthChange}
              placeholder="1-5 years"
            ></input>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M7 10l5 5 5-5H7z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Did the candidate initially enter the UK as a student? */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Did the candidate initially enter the UK as a student?
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="student-yes"
              name="enteredAsStudent"
              value="yes"
              checked={enteredAsStudent === "yes"}
              onChange={handleEnteredAsStudentChange}
              label="Yes"
            />
            <RadioButton
              id="student-no"
              name="enteredAsStudent"
              value="no"
              checked={enteredAsStudent === "no"}
              onChange={handleEnteredAsStudentChange}
              label="No"
            />
          </div>
        </div>

        {/* Will the candidate need priority visa processing? */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Will the candidate need priority visa processing?
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="priority-yes"
              name="needsPriorityProcessing"
              value="yes"
              checked={needsPriorityProcessing === "yes"}
              onChange={handlePriorityProcessingChange}
              label="Yes"
            />
            <RadioButton
              id="priority-no"
              name="needsPriorityProcessing"
              value="no"
              checked={needsPriorityProcessing === "no"}
              onChange={handlePriorityProcessingChange}
              label="No"
            />
          </div>
        </div>

        {/* Will the candidate apply with their partner? */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Will the candidate apply with their partner?
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="partner-yes"
              name="applyingWithPartner"
              value="yes"
              checked={applyingWithPartner === "yes"}
              onChange={handleApplyingWithPartnerChange}
              label="Yes"
            />
            <RadioButton
              id="partner-no"
              name="applyingWithPartner"
              value="no"
              checked={applyingWithPartner === "no"}
              onChange={handleApplyingWithPartnerChange}
              label="No"
            />
          </div>
        </div>

        {applyingWithPartner === "yes" && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Will the Parnter need priority visa processing?
            </label>
            <div className="flex space-x-4">
              <RadioButton
                id="partner-priority-yes"
                name="partnerNeedsPriorityProcessing"
                value="yes"
                checked={partnerNeedsPriorityProcessing === "yes"}
                onChange={handlePartnerNeedsPriorityProcessingChange}
                label="Yes"
              />
              <RadioButton
                id="partner-priority-no"
                name="partnerNeedsPriorityProcessing"
                value="no"
                checked={partnerNeedsPriorityProcessing === "no"}
                onChange={handlePartnerNeedsPriorityProcessingChange}
                label="No"
              />
            </div>
          </div>
        )}

        {/* Will the candidate be applying with any children? */}
        <div className="mb-2">
          <label className="block text-lg font-semibold mb-2">
            Will the candidate be applying with any children?
          </label>
          <div className="flex space-x-4">
            <RadioButton
              id="children-yes"
              name="applyingWithChildren"
              value="yes"
              checked={applyingWithChildren === "yes"}
              onChange={handleApplyingWithChildrenChange}
              label="Yes"
            />
            <RadioButton
              id="children-no"
              name="applyingWithChildren"
              value="no"
              checked={applyingWithChildren === "no"}
              onChange={handleApplyingWithChildrenChange}
              label="No"
            />
          </div>
        </div>

        {applyingWithChildren === "yes" && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Number of Children
            </label>
            <div>
              <input
                className="w-full p-2 border rounded appearance-none bg-white"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
                placeholder="1-5 years"
              ></input>
            </div>
          </div>
        )}

        {applyingWithChildren === "yes" && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Will the Children need priority visa processing?
            </label>
            <div className="flex space-x-4">
              <RadioButton
                id="children-priority-yes"
                name="childrenNeedsPriorityProcessing"
                value="yes"
                checked={childrenNeedsPriorityProcessing === "yes"}
                onChange={handleChildrenNeedsPriorityProcessingChange}
                label="Yes"
              />
              <RadioButton
                id="children-priority-no"
                name="childrenNeedsPriorityProcessing"
                value="no"
                checked={childrenNeedsPriorityProcessing === "no"}
                onChange={handleChildrenNeedsPriorityProcessingChange}
                label="No"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="w-full md:w-1/2">
        {/* Employer Fees Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Employer Fees</h2>
          <p className="text-gray-600 mb-4">
            These are fees that must be paid by the employer legally
          </p>

          <div className="flex justify-between py-2">
            <span>Certificate of Sponsorship (CoS)</span>
            <span className="font-medium">£525</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Immigration Skills Charge (ISC)</span>
            <span className="font-medium">Not Applicable</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex justify-between">
              <span className="font-bold">Total Employer Fees</span>
              <span className="font-bold">£525.00</span>
            </div>
          </div>
        </div>

        {/* Candidate Fees Section */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Candidate Fees</h2>
          <p className="text-gray-600 mb-4">
            These are fees that need to be paid by the candidate. Employers may
            cover some or all of these fees if they wish
          </p>

          <div className="flex justify-between py-2">
            <span>VISA Government Fee</span>
            <span className="font-medium">£{visaGovFeeAmount}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Immigration Health Surcharge (IHS)</span>
            <span className="font-medium">£{candidateIHS}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Priority VISA Fee</span>
            <span className="font-medium">
              {priorityVisaFee > 0 ? `£${priorityVisaFee}` : "Not Applicable"}
            </span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex justify-between">
              <span className="font-bold">Total Candidate Fees</span>
              <span className="font-bold">£{totalCandidateFees}</span>
            </div>
          </div>

          <div className="bg-red-100 p-4 rounded-lg mt-4">
            <p className="text-sm">
              There may be additional fees charged by the biometrics centre in
              certain countries. This is usually between £100-£200.
            </p>
          </div>
        </div>
        {applyingWithPartner === "yes" && (
          <div>
            <h2 className="text-2xl font-bold mb-1">Dependant Fees</h2>
            <p className="text-gray-600 mb-4">
              These are fees that need to be paid by the candidate. Employers
              may cover some or all of these fees if they wish
            </p>

            <div className="flex justify-between py-2">
              <span>Partner VISA Government Fee</span>
              <span className="font-medium">{partnerPriorityVisaFee}</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Partner Immigration Health Surcharge (IHS)</span>
              <span className="font-medium">£{partnerCandidateIHS}</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Partner Priority VISA Fee</span>
              <span className="font-medium">
                {partnerPriorityVisaFee > 0
                  ? `£${partnerPriorityVisaFee}`
                  : "Not Applicable"}
              </span>
            </div>

            {applyingWithChildren === "yes" && (
              <div>
                <div className="flex justify-between py-2">
                  <span>Children VISA Government Fee</span>
                  <span className="font-medium">£{childrenVisaGovFee}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Children Immigration Health Surcharge (IHS)</span>
                  <span className="font-medium">£{childrenIHS}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Children Priority VISA Fee</span>
                  <span className="font-medium">
                    {childrenPriorityFee > 0
                      ? `£${childrenPriorityFee}`
                      : "Not Applicable"}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between">
                <span className="font-bold">Total Dependant Fees</span>
                <span className="font-bold">£{totalDependantFees}</span>
              </div>
            </div>

            <div className="bg-red-100 p-4 rounded-lg mt-4">
              <p className="text-sm">
                There may be additional fees charged by the biometrics centre in
                certain countries. This is usually between £100-£200.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable RadioButton component
function RadioButton({ id, name, value, checked, onChange, label }) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer text-sm ${
          checked
            ? "bg-gray-800 text-white"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
