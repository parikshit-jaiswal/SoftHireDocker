import ProfileCard from '@/components/miniComponents/ProfileCard';
import { Separator } from '@/components/ui/separator'
import useJob from '@/Context/JobContext/useJob';
import { Dot, Trash2 } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';

function JobHeader({ activeTab, setActiveTab }) {
    const { jobOption } = useJob();
    const { selectedJob } = useSelector((state) => state.job || {});

    const isdraftJob = selectedJob?.isDraft;

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-wrap space-y-4 justify-between items-start  w-full">
                <div>
                    <div className="flex items-center gap-3 mt-3">
                        <h1 className="text-2xl font-bold text-gray-900">{selectedJob?.title}</h1>
                        {<span className={`text-sm ${selectedJob?.isDraft ? "text-gray-500 bg-gray-100" : "text-red-500 border border-red-500"} px-2 py-0 rounded`}>{selectedJob?.isDraft ? "Draft" : "Live"}</span>}
                    </div>
                </div>
                <div className="flex gap-3 items-center mb-5">
                    <button
                        disabled
                        onClick={() => { }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-50 cursor-not-allowed"
                    >
                        {isdraftJob ? "Publish" : "Unpublish"}
                    </button>
                    <button
                        disabled
                        onClick={() => { }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-50 cursor-not-allowed"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-400 mb-5">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "preview"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {jobOption === 'active' ? "Overview" : "Preview"}
                    </button>
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "edit"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Edit Job
                    </button>
                </nav>
            </div>
        </div>
    );
}

function JobPreview({ activeTab, setActiveTab }) {
    const { selectedJob } = useSelector((state) => state.job || {});
    const { jobOption } = useJob();

    if (!selectedJob) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a job to view its details</p>
            </div>
        );
    }

    const jobData = {
        title: selectedJob?.title,
        status: selectedJob?.isDraft ? "Draft" : "Live",
        salary: selectedJob?.salary?.min != null && selectedJob?.salary?.max != null
            ? `${selectedJob?.currency?.match(/\(([^)]+)\)/)?.[1] || '$'}${selectedJob.salary.min} - ${selectedJob.salary.max}`
            : 'Unpaid',
        description: selectedJob?.jobDescription,
        location: selectedJob?.location,
        hires: selectedJob?.acceptWorldwide ? 'Worldwide' : selectedJob?.hiresIn?.join(', ') || 'Not specified',
        workPolicy: selectedJob?.remotePolicy,
        timezone: selectedJob?.timeZones?.join(', ') || 'Not specified',
        collaborationHours: selectedJob?.collaborationHours,
        jobType: selectedJob?.jobType,
        primaryRole: selectedJob?.primaryRole,
        additionalRoles: selectedJob?.additionalRoles,
        workExperience: selectedJob?.workExperience,
        visaSponsorship: selectedJob?.visaSponsorship ? 'Yes' : 'No',
        relocationRequired: selectedJob?.relocationRequired ? 'Yes' : 'No',
        relocationAssistance: selectedJob?.relocationAssistance ? 'Yes' : 'No',
        skills: selectedJob?.skills || [],
        companySize: selectedJob?.companySize,
        remoteCulture: selectedJob?.remoteCulture,
    };

    return (
        <>
            <JobHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="border border-black rounded-lg py-2 pb-8">
                <div className="text-xl mx-5 font-medium text-gray-900">
                    <div className="mt-3 mx-5">{jobOption === 'active' ? 'Job Overview' : 'Job Preview'}</div>
                    <div className="mt-4"> <Separator /></div>
                </div>
                <div className="lg:mx-10 mx-5 mt-5">
                    <div className="">
                        <p className='text-xl font-bold text-gray-900'>{jobData.title}</p>
                        {jobData.salary && jobData.salary != null && (
                            <p className='text-gray-500 text-lg font-medium mt-1'>{jobData.salary}</p>
                        )}
                    </div>
                    <div className="sm:grid sm:grid-cols-11 gap-7 mt-5">
                        <div className="col-span-7 custom-styles">
                            <div dangerouslySetInnerHTML={{ __html: jobData?.description?.replace(/^"(.*)"$/, '$1') }} />
                        </div>
                        <div className="col-span-4 space-y-3">
                            {/* Primary Role */}
                            <div className="">
                                <p className='text-lg font-semibold'>Primary Role</p>
                                <p className='text-gray-500'>{jobData.primaryRole}</p>
                            </div>

                            {/* Additional Roles */}
                            {jobData.additionalRoles && jobData.additionalRoles.length > 0 && (
                                <div className="">
                                    <p className='text-lg font-semibold'>Additional Roles</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {jobData.additionalRoles.map((role, index) => (
                                            <div key={index} className="bg-[#F6F6F6] px-2 py-1 rounded-lg text-sm">{role}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Work Experience */}
                            <div className="">
                                <p className='text-lg font-semibold'>Work Experience</p>
                                <p className='text-gray-500'>{jobData.workExperience}</p>
                            </div>

                            {/* Company Size */}
                            <div className="">
                                <p className='text-lg font-semibold'>Company Size</p>
                                <p className='text-gray-500'>{jobData.companySize}</p>
                            </div>

                            {/* Location */}
                            <div className="">
                                <p className='text-lg font-semibold'>Location</p>
                                <p className='text-gray-500'>{Array.isArray(jobData.location) ? jobData.location.join(', ') : jobData.location}</p>
                            </div>

                            {/* Hires */}
                            <div className="">
                                <p className='text-lg font-semibold'>Hires Remotely</p>
                                <p className='text-gray-500'>{jobData.hires}</p>
                            </div>

                            {/* Remote Work Policy */}
                            <div className="">
                                <p className='text-lg font-semibold'>Remote Work Policy</p>
                                <p className='text-gray-500'>{jobData.workPolicy}</p>
                            </div>

                            {/* Remote Culture */}
                            {jobData.remoteCulture && (
                                <div className="">
                                    <p className='text-lg font-semibold'>Remote Culture</p>
                                    <p className='text-gray-500'>{jobData.remoteCulture}</p>
                                </div>
                            )}

                            {/* Preferred Timezone */}
                            <div className="">
                                <p className='text-lg font-semibold'>Preferred Timezone</p>
                                <p className='text-gray-500'>{jobData.timezone}</p>
                            </div>

                            {/* Collaboration Hours */}
                            <div className="">
                                <p className='text-lg font-semibold'>Collaboration Hours</p>
                                <p className='text-gray-500'>
                                    {jobData.collaborationHours && jobData.collaborationHours.start && jobData.collaborationHours.end
                                        ? `${jobData.collaborationHours.start} - ${jobData.collaborationHours.end} ${jobData.collaborationHours.timeZone || ''}`
                                        : 'Not specified'}
                                </p>
                            </div>

                            {/* Job Type */}
                            <div className="">
                                <p className='text-lg font-semibold'>Job Type</p>
                                <p className='text-gray-500'>{jobData.jobType}</p>
                            </div>

                            {/* Relocation */}
                            <div className="">
                                <p className='text-lg font-semibold'>Relocation</p>
                                <p className='text-gray-500'>
                                    {jobData.relocationRequired
                                        ? `Required${jobData.relocationAssistance ? ' (with assistance)' : ''}`
                                        : 'Not required'}
                                </p>
                            </div>

                            {/* Visa Sponsorship */}
                            <div className="">
                                <p className='text-lg font-semibold'>Visa Sponsorship</p>
                                <p className='text-gray-500'>{jobData.visaSponsorship}</p>
                            </div>

                            {/* Skills */}
                            <div className="">
                                <p className='text-lg font-semibold'>Skills</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {jobData.skills.map((skill, index) => (
                                        <div key={index} className="bg-[#F6F6F6] px-2 py-1 rounded-lg text-sm">{skill}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default JobPreview;