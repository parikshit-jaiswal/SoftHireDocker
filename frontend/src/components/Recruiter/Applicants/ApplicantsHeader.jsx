import React from 'react';
import { ArrowLeft, Baby, Trash2, UserCheck } from 'lucide-react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ApplicantsHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedJob } = useSelector(state => ({
        selectedJob: state.job.selectedJob,
    }));

    // Determine active tab based on path
    const path = location.pathname;
    const isNeedsReview = path.endsWith('/recruiter/applicants');
    const isSavedForLater = path.endsWith('/recruiter/applicants/saved-for-later');
    const isRejected = path.endsWith('/recruiter/applicants/rejected');
    const isAccepted = path.endsWith('/recruiter/applicants/accepted');

    return (
        <div className="w-full pt-7">
            {/* Header Section */}
            <div className="flex flex-wrap space-y-3 justify-between items-start mb-6 w-full">
                <div className=''>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{selectedJob?.title || "Job Title"}</h1>
                        {<span className={`text-sm ${selectedJob?.isDraft ? "text-gray-500 bg-gray-100" : "text-red-500 border border-red-500"} px-2 py-0 rounded`}>{selectedJob?.isDraft ? "Draft" : "Live"}</span>}
                    </div>
                    <p className="mb-3">{selectedJob?.location || "Location"}</p>
                    {!isAccepted && (
                        <Link to="/recruiter/applicants/accepted" className="flex items-center gap-1 text-red-500 cursor-pointer hover:underline"><UserCheck />Go to accepted</Link>
                    )}
                    {isAccepted && (
                        <Link to="/recruiter/applicants" className="flex items-center gap-1 text-red-500 cursor-pointer hover:underline"><ArrowLeft />Go to needs review</Link>
                    )}
                </div>
                <div>
                    <button
                        onClick={() => {
                            navigate("/recruiter/jobs");
                        }}
                        className="px-4 py-2 text-red-500 border border-[#EA4C25] rounded-lg hover:bg-red-50 transition-colors"
                    >
                        View Job
                    </button>
                </div>
            </div>

            {/* Tabs */}
            {!isAccepted && (
                <div className="border-b border-gray-400 mb-5">
                    <nav className="flex space-x-8">
                        <Link
                            to={'/recruiter/applicants'}
                            className={`py-2 px-1 font-bold text-xl transition-colors hover:border-b-2 hover:border-black ${isNeedsReview ? 'border-b-2 border-black' : 'opacity-50'}`}
                        >
                            Needs Review
                        </Link>
                        <Link
                            to={'/recruiter/applicants/saved-for-later'}
                            className={`py-2 px-1 font-bold text-xl transition-colors hover:border-b-2 hover:border-black ${isSavedForLater ? 'border-b-2 border-black' : 'opacity-50'}`}
                        >
                            Saved for Later
                        </Link>
                        <Link
                            to={'/recruiter/applicants/rejected'}
                            className={`py-2 px-1 font-bold text-xl transition-colors hover:border-b-2 hover:border-black ${isRejected ? 'border-b-2 border-black' : 'opacity-50'}`}
                        >
                            Rejected
                        </Link>
                    </nav>
                </div>
            )}
            {isAccepted && (
                <div className="border-b border-gray-400 mb-5">
                    <nav className="flex space-x-8">
                        <Link
                            to={'/recruiter/applicants/accepted'}
                            className={`py-2 px-1 font-bold text-xl transition-colors hover:border-b-2 hover:border-black ${isAccepted ? 'border-b-2 border-black' : 'opacity-50'}`}
                        >
                            Accepted
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );

}

export default ApplicantsHeader;