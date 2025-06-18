import { getApplicants, updateStatus } from '@/Api/ApplicantServices';
import Loader from '@/components/miniComponents/Loader';
import { setApplicants } from '@/redux/applicantSlice';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function ApplicantCard({ applicant }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleStatus = async (id, status) => {
        try {
            const response = await updateStatus(id, status);
            dispatch(setApplicants(response));
            toast.success("Status updated successfully!");
            // console.log(response);
        } catch (error) {
            toast.error("Failed to update status. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-300 w-full hover:shadow-md transition-shadow duration-200 p-3 sm:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Profile Section */}
                <div onClick={() => navigate(`/recruiter/applicants/profile/${applicant.userId}`)} className="flex  cursor-pointer items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border rounded-full overflow-hidden flex-shrink-0">
                        <img
                            src={applicant?.profileImage || 'https://via.placeholder.com/150'}
                            alt={applicant?.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{applicant?.name}</h3>
                        <p className="text-gray-700 text-sm sm:text-base truncate">{applicant?.primaryRole}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                            Applied{' '}
                            <span className="hidden sm:inline">on</span>: {applicant?.appliedOn ? new Date(applicant.appliedOn).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:flex-shrink-0 w-full md:w-auto">
                    <div className="flex flex-col gap-2 w-full sm:w-auto sm:items-start">
                        {/* <p className='text-red-500 text-sm sm:text-base text-left w-full'>Rejected on 14/05/2025</p> */}
                        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => handleStatus(applicant._id, 'Saved')}
                                className="py-2 px-3 sm:px-4 border border-red-300 text-red-500 rounded hover:bg-red-50 text-sm font-medium whitespace-nowrap w-full sm:w-auto"
                            >
                                Save for Later
                            </button>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => handleStatus(applicant._id, 'Rejected')}
                                    className="flex-1 sm:flex-none py-2 px-3 sm:px-4 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium whitespace-nowrap w-full sm:w-auto"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatus(applicant._id, 'Accepted')}
                                    className="flex-1 sm:flex-none py-2 px-3 sm:px-4 bg-[#3AA76D] text-white rounded hover:bg-[#37a169c7] text-sm font-medium whitespace-nowrap w-full sm:w-auto"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NeedReview() {

    const dispatch = useDispatch();
    const { applicants } = useSelector(state => state.applicant);
    const { selectedJob } = useSelector(state => state.job);
    const [loading, setLoading] = useState(false);

    const fetchApplicants = async (id, status) => {
        try {
            setLoading(true);
            const response = await getApplicants(id, status);
            dispatch(setApplicants(response));
            // console.log("Fetched applicants:", response);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedJob || !selectedJob._id) return;
        const status = 'Submitted';
        fetchApplicants(selectedJob._id, status);
    }, [selectedJob]);

    if (loading) {
        return <div className='flex justify-center items-center'><Loader /></div>;
    }
    return (

        <>
            <div className="space-y-5">
                {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                        <ApplicantCard key={applicant._id} applicant={applicant} />
                    ))
                ) : (
                    <div className="text-center text-gray-500">No applicants found at the moment.</div>
                )}
            </div>
        </>
    )
}

export default NeedReview;