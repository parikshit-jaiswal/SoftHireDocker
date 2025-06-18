import { jobCulture } from '@/Api/profile';
import { useState } from 'react';

export default function Culture() {
  const [jobDescription, setJobDescription] = useState('');
  const [workEnvironment, setWorkEnvironment] = useState('');
  const [importantFactors, setImportantFactors] = useState([]);
  const [flexibleRemoteImportance, setFlexibleRemoteImportance] = useState('');
  const [quietOfficeImportance, setQuietOfficeImportance] = useState('');
  const [interestedMarkets, setInterestedMarkets] = useState([]);
  const [notInterestedMarkets, setNotInterestedMarkets] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleImportantFactorsChange = (factor) => {
    if (importantFactors.includes(factor)) {
      setImportantFactors(importantFactors.filter(item => item !== factor));
    } else if (importantFactors.length < 2) {
      setImportantFactors([...importantFactors, factor]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (!workEnvironment) newErrors.workEnvironment = 'Please select a work environment';
    if (importantFactors.length === 0) newErrors.importantFactors = 'Please select at least one important factor';
    else if (importantFactors.length > 2) newErrors.importantFactors = 'You can select maximum 2 factors';
    if (!flexibleRemoteImportance) newErrors.flexibleRemoteImportance = 'Please select remote work policy importance';
    if (!quietOfficeImportance) newErrors.quietOfficeImportance = 'Please select quiet office importance';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      const requestData = {
        jobDescription,
        workEnvironment,
        importantFactors,
        flexibleRemoteImportance,
        quietOfficeImportance,
        interestedMarkets,
        notInterestedMarkets
      };

      try {
        const result = await jobCulture(requestData);
        // console.log('API Response:', result);
        alert('Form submitted successfully!');
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit the form. Please try again.');
      }
    }
  };

  const WORK_ENV_OPTIONS = [
    'Structured (clear roles, feedback)',
    'Flexible (figure things out on your own)'
  ];

  const IMPORTANT_FACTORS = [
    'Having a say in what I work on and how I work',
    'Opportunities to progress within the company',
    'Team members I can learn from',
    'A company with a good growth trajectory',
    "Having a say in the company's and/or my team's direction",
    'Mentorship opportunities',
    'Learn new things and develop my skills',
    'Challenging problems to work on',
    'A diverse team'
  ];

  const IMPORTANCE_LEVELS = ['Very important', 'Important', 'Not important'];

  const MARKETS = ['Fintech', 'Healthcare', 'Education', 'Retail', 'Technology'];

  return (
    <div className="max-w-auto mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <form className="space-y-10" onSubmit={handleSubmit}>

        {/* Job Description */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">Describe what you are looking for in your next job</h3>
              <p className="text-sm text-gray-500 mt-2">Startups tell us this is one of the first things they look at in a profile.</p>
            </div>
            <div className="md:w-2/3">
              <textarea
                className={`w-full border ${errors.jobDescription ? 'border-red-500' : 'border-gray-300'} rounded-md p-4 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="Describe what you are looking for in your next job"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              {errors.jobDescription && <p className="mt-1 text-sm text-red-500">{errors.jobDescription}</p>}
            </div>
          </div>
        </div>

        {/* Work Environment */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">What environment do you work better in?</h3>
            </div>
            <div className="md:w-2/3 space-y-4">
              {WORK_ENV_OPTIONS.map((option, index) => (
                <label key={index} className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="environment"
                    value={option}
                    checked={workEnvironment === option}
                    onChange={() => setWorkEnvironment(option)}
                    className="mt-1"
                  />
                  <span>{option}</span>
                </label>
              ))}
              {errors.workEnvironment && <p className="mt-1 text-sm text-red-500">{errors.workEnvironment}</p>}
            </div>
          </div>
        </div>

        {/* Important Factors */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">What's most important to you in your next job? (Max 2)</h3>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMPORTANT_FACTORS.map((factor, index) => (
                <label key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={importantFactors.includes(factor)}
                    onChange={() => handleImportantFactorsChange(factor)}
                    className="mt-1"
                  />
                  <span>{factor}</span>
                </label>
              ))}
              {errors.importantFactors && <p className="mt-1 text-sm text-red-500 col-span-full">{errors.importantFactors}</p>}
            </div>
          </div>
        </div>

        {/* Remote Policy Importance */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">How important is flexible remote work policy?</h3>
            </div>
            <div className="md:w-2/3 space-y-4">
              {IMPORTANCE_LEVELS.map((option, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="remote"
                    value={option}
                    checked={flexibleRemoteImportance === option}
                    onChange={() => setFlexibleRemoteImportance(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
              {errors.flexibleRemoteImportance && <p className="mt-1 text-sm text-red-500">{errors.flexibleRemoteImportance}</p>}
            </div>
          </div>
        </div>

        {/* Quiet Office Importance */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">How important is it to work in a quiet office?</h3>
            </div>
            <div className="md:w-2/3 space-y-4">
              {IMPORTANCE_LEVELS.map((option, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="quiet"
                    value={option}
                    checked={quietOfficeImportance === option}
                    onChange={() => setQuietOfficeImportance(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
              {errors.quietOfficeImportance && <p className="mt-1 text-sm text-red-500">{errors.quietOfficeImportance}</p>}
            </div>
          </div>
        </div>

        {/* Interested Markets */}
        <div className="border-b pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">Which markets are you MOST interested in?</h3>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 gap-4">
              {MARKETS.map((market, index) => (
                <label key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={interestedMarkets.includes(market)}
                    onChange={() => toggleSelection(market, interestedMarkets, setInterestedMarkets)}
                  />
                  <span>{market}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Not Interested Markets */}
        <div className="pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-xl">Which markets are you NOT willing to work in?</h3>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 gap-4">
              {MARKETS.map((market, index) => (
                <label key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={notInterestedMarkets.includes(market)}
                    onChange={() => toggleSelection(market, notInterestedMarkets, setNotInterestedMarkets)}
                  />
                  <span>{market}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
