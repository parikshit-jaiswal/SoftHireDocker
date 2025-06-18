import React, { useState, useEffect } from 'react';

export default function SponsorLicenceCostEstimator() {
    const [licenceType, setLicenceType] = useState('-');
    const [sponsorSize, setSponsorSize] = useState('Small');
    const [priorityProcessing, setPriorityProcessing] = useState('No');
    const [licenceFee, setLicenceFee] = useState('£536');
    const [priorityFee, setPriorityFee] = useState('£500');
    const [totalFee, setTotalFee] = useState('£1,036.00');

    const options = [
        { value: 'Skilled Worker' },
        { value: 'Temporary Worker' },
        { value: 'Skilled Worker and Temporary Worker' },
    ];

    // Calculate fees based on selections
    useEffect(() => {
        let baseFee = 536;
        if (sponsorSize === 'Large') {
            baseFee = 1476;
        }
        if (licenceType === 'Temporary Worker') {
            baseFee = 536;
        }

        let priority = 0;
        if (priorityProcessing === 'Yes') {
            priority = 500;
        }

        setLicenceFee(`£${baseFee}`);
        setPriorityFee(`£${priority}`);
        setTotalFee(`£${(baseFee + priority).toFixed(2)}`);
    }, [licenceType, sponsorSize, priorityProcessing]);

    const handleReset = () => {
        setLicenceType('Skilled Worker');
        setSponsorSize('Small');
        setPriorityProcessing('No');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Sponsor Licence Cost Estimator</h1>

                {/* Type of Licence */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="font-medium text-gray-800">Type of Licence</label>
                        <span className="text-xs text-gray-500">Required</span>
                    </div>
                    <div className="relative">
                        <select
                            value={licenceType}
                            onChange={(e) => setLicenceType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white appearance-none pr-8"
                        >
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Sponsor Size */}
                <div className="mb-6">
                    <p className="font-medium text-gray-800 mb-2">Sponsor Size</p>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-1 rounded-full text-sm border ${sponsorSize === 'Small' ? 'bg-gray-100 border-black' : 'bg-white'}`}
                            onClick={() => setSponsorSize('Small')}
                        >
                            Small
                        </button>
                        <button
                            className={`px-4 py-1 rounded-full text-sm border ${sponsorSize === 'Large' ? 'bg-gray-100 border-black' : 'bg-white'}`}
                            onClick={() => setSponsorSize('Large')}
                        >
                            Large
                        </button>
                    </div>
                </div>

                {/* Priority Processing */}
                <div className="mb-6">
                    <p className="font-medium text-gray-800 mb-2">Would you like priority processing for this application?</p>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-1 rounded-full text-sm border ${priorityProcessing === 'Yes' ? 'bg-gray-100 border-black' : 'bg-white'}`}
                            onClick={() => setPriorityProcessing('Yes')}
                        >
                            Yes
                        </button>
                        <button
                            className={`px-4 py-1 rounded-full text-sm border ${priorityProcessing === 'No' ? 'bg-gray-100 border-black' : 'bg-white'}`}
                            onClick={() => setPriorityProcessing('No')}
                        >
                            No
                        </button>
                    </div>
                </div>

                {/* Fee Breakdown */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-gray-100 p-3 rounded">
                        <p className="text-sm text-gray-600 mb-1">Licence Fee</p>
                        <p className="text-lg font-semibold">{licenceFee}</p>
                    </div>
                    <div className="flex-1 bg-gray-100 p-3 rounded">
                        <p className="text-sm text-gray-600 mb-1">Priority Fee</p>
                        <p className="text-lg font-semibold">{priorityFee}</p>
                    </div>
                </div>

                {/* Total Fee */}
                <div className="bg-blue-100 p-4 rounded mb-4">
                    <p className="text-sm text-blue-800 mb-1">Total Licence Fee</p>
                    <p className="text-xl font-bold">{totalFee}</p>
                </div>

                {/* Information Box */}
                <div className="bg-green-100 p-4 rounded mb-6">
                    <p className="text-sm text-green-800">
                        These are one-time fees for your organization, with sponsorship licenses
                        valid indefinitely thereafter, allowing you to sponsor as many workers as
                        needed.
                    </p>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}