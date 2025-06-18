import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import useJob from '@/Context/JobContext/useJob';

function JobHeader({ newJob }) {
    const { jobEdit, setJobEdit, jobOption, setJobOption } = useJob();

    const [activeTab, setActiveTab] = useState("preview")

    const jobData = {
        title: "Senior Software Engineer",
        status: "Draft",
        salary: "$120,000 - $150,000",
        location: "Remote",
        lastEdited: "2 days ago"
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-wrap space-y-4 justify-between items-start mb-6 w-full">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{newJob ? "New Job Posting" : jobData?.title}</h1>
                        {!newJob && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{jobData?.status}</span>}
                    </div>
                    {!newJob && <p className="text-lg text-gray-600">{jobData?.salary}</p>}
                </div>
                {/* <div className="flex gap-3">
                    <button
                        onClick={() => console.log("Clone clicked")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => console.log("Publish clicked")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Publish
                    </button>
                    <button
                        onClick={() => console.log("Delete clicked")}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div> */}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-400 mb-5">
                <nav className="flex space-x-8">

                    <button
                        onClick={() => {
                            setJobEdit(false);
                            setActiveTab("preview");
                        }}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "preview"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {jobOption === 'active'
                            ? "Overview" : "Preview"
                        }
                    </button>
                    <button
                        onClick={() => {
                            setJobEdit(true);
                            setActiveTab("edit");
                        }}

                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "edit"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >Edit Job
                    </button>

                </nav>
            </div>
        </div >
    );
}

export default JobHeader;
