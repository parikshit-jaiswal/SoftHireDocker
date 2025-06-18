import { MoveUpRight, Plus } from 'lucide-react';
import React, { useState } from 'react';


function Input({ label = "Label", placeholder = "", name, value, onChange }) {
  return (
    <div className="w-full">
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <label className="block font-bold text-gray-900 text-sm ">{label}</label>
          <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
        </div>
        <input
          type="text"
          className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

function Question({ name, label, answers, handleSelect }) {
  return (
    <div key={name} className="flex flex-col gap-2 sm:gap-0">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-gray-900 text-base sm:text-md">
          {label}
        </label>
        <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
          Required
        </span>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "Yes"
            ? "bg-blue-50 border-blue-500 text-blue-600"
            : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          onClick={() => handleSelect(name, "Yes")}
        >
          Yes
        </button>
        <button
          type="button"
          className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "No"
            ? "bg-blue-50 border-blue-500 text-blue-600"
            : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          onClick={() => handleSelect(name, "No")}
        >
          No
        </button>
      </div>
    </div>
  );
}

function AboutYourCompany() {
  const [answers, setAnswers] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);

  const handleSelect = (name, value) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    console.log(answers); // This will log the updated state
  }, [answers]);

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
        <Input name="companyTradingName" label="Company Trading Name" value={answers.companyTradingName || ""} onChange={e => handleSelect("companyTradingName", e.target.value)} />
        <Input name="registeredCompanyName" label="What is the registered name of your company?" value={answers.registeredCompanyName || ""} onChange={e => handleSelect("registeredCompanyName", e.target.value)} />
        <Input name="companyWebsite" label="Company Website" value={answers.companyWebsite || ""} onChange={e => handleSelect("companyWebsite", e.target.value)} />
        <Input name="companiesHouseReferenceNumber" label="Companies House Reference Number" placeholder="As listed on Companies House" value={answers.companiesHouseReferenceNumber || ""} onChange={e => handleSelect("companiesHouseReferenceNumber", e.target.value)} />

        <div className="space-y-2">
          <p className='block font-bold text-gray-900 text-base sm:text-md'>What is your registered company address? (As listed on Companies House)</p>
          <div className="flex items-center justify-between mb-2 hover:bg-[#f3f4f6] cursor-pointer p-3 rounded-lg">
            <p className=''>Add your company's addressAdd your company's address</p>
            <p className='bg-[#e9eef7] rounded-full p-1'><MoveUpRight color='#91b0eb' /></p>
          </div>
        </div>

        <Question name="hasEmployerPayeeRef" label="Do you have an employer PAYE reference?" answers={answers} handleSelect={handleSelect} />
        {answers["hasEmployerPayeeRef"] === "No" && (
          <Input name="payeExemptReason" label="PAYE Exempt Reason" value={answers.payeExemptReason || ""} onChange={e => handleSelect("payeExemptReason", e.target.value)} />
        )}
        {answers["hasEmployerPayeeRef"] === "Yes" && (
          <div className="space-y-2 ">
            <p className='block font-bold text-gray-900 text-base sm:text-md'>Please provide at least one PAYE Reference:</p>
            <div className="w-[50%] mx-auto mt-2 flex items-center justify-center mb-2 hover:bg-[#f1f5fd] cursor-pointer p-2 rounded-lg">
              <div className="flex gap-1 text-[#749ce7]"><Plus /> Add PAYEE Reference</div>
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
              <div className="flex gap-1 text-[#749ce7]"><Plus /> Add Work Location(s)</div>
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

      </div>
    </>
  );
}

export default AboutYourCompany;