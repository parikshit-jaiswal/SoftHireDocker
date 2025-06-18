import React, { useEffect, useState } from 'react';
import { Search, Plus, Menu, X, Cross } from 'lucide-react';
import useJob from '@/Context/JobContext/useJob';
import { Link } from 'react-router-dom';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedJob } from '@/redux/jobSlice';

const ApplicantsSidebar = () => {
    const [searchValue, setSearchValue] = useState('');
    const { jobOption, setJobOption, isSidebarOpen, setIsSidebarOpen } = useJob();
    const { jobs, selectedJob } = useSelector((state) => state.job || {});
    const dispatch = useDispatch();
    const { fetchJobs } = useGetAllJobs();

    // Fetch jobs when component mounts and when jobOption changes
    useEffect(() => {
        fetchJobs();
    }, []);

    const jobList = jobs || [];

    const ActiveJobs = jobList.filter(job => job.isDraft === false);
    const DraftJobs = jobList.filter(job => job.isDraft === true);

    // Filter jobs based on search value
    const filteredActiveJobs = ActiveJobs.filter(job =>
        job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredDraftJobs = DraftJobs.filter(job =>
        job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Fix: When a job is selected, also close the sidebar on mobile
    const handleSelectJob = (job) => {
        dispatch(setSelectedJob(job));
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="relative flex h-screen pb-16">
            {/* Mobile Toggle Button - positioned relative to parent container */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-3 left-0 z-50 p-2"
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? <X /> : <Menu size={24} />}
            </button>
            {/* Sidebar - Fixed position on mobile, relative on desktop */}
            <div
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 fixed md:relative top-0 left-0 h-full w-80 bg-[#F4F3F2] 
                transition-transform duration-300 ease-in-out z-40 pt-16 md:pt-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
                    </div>

                    {/* Search and Filters */}
                    <div className="p-4 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Jobs"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex space-x-2 w-full">
                            <Link className='w-1/2' to="/recruiter/applicants">
                                <button
                                    onClick={() => setJobOption('active')}
                                    className={`flex-1 w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${jobOption === 'active'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-[#F3E4E2] border border-red-600 text-gray-700'
                                        }`}
                                >
                                    Active ({filteredActiveJobs.length})
                                </button>
                            </Link>
                            <Link className='w-1/2' to="/recruiter/applicants">
                                <button
                                    onClick={() => setJobOption('drafts')}
                                    className={`flex-1  w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${jobOption === 'drafts'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-[#F3E4E2] border border-red-600 text-gray-700'
                                        }`}
                                >
                                    Drafts ({filteredDraftJobs.length})
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Job List */}
                    <div className="flex-1 overflow-y-auto">
                        {jobOption === 'active' ? (
                            filteredActiveJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className={`p-3 border-l-4 mr-4 ${selectedJob?._id === job._id ? 'border-[#EA4C25] bg-white' : 'border-transparent'
                                        } hover:bg-gray-50 cursor-pointer transition-colors`}
                                    onClick={() => handleSelectJob(job)}
                                >
                                    <div className={`text-xs mb-1`}>
                                        Last Edited: {new Date(job.postedAt).toLocaleDateString()}
                                    </div>
                                    <div className="font-semibold text-gray-900 text-sm mb-1">
                                        {job.title}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {Array.isArray(job.location) ? job.location.join(', ') : job.location}
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredDraftJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className={`p-3 border-l-4 mr-4 ${selectedJob?._id === job._id ? 'border-[#EA4C25] bg-white' : 'border-transparent'
                                        } hover:bg-gray-50 cursor-pointer transition-colors`}
                                    onClick={() => handleSelectJob(job)}
                                >
                                    <div className={`text-xs mb-1`}>
                                        Last Edited: {new Date(job.postedAt).toLocaleDateString()}
                                    </div>
                                    <div className="font-semibold text-gray-900 text-sm mb-1">
                                        {job.title}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {Array.isArray(job.location) ? job.location.join(', ') : job.location}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Semi-transparent overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default ApplicantsSidebar;