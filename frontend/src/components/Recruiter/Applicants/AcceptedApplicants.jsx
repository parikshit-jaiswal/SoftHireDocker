import { getApplicants, updateStatus } from '@/Api/ApplicantServices';
import Loader from '@/components/miniComponents/Loader';
import { setApplicants } from '@/redux/applicantSlice';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setMessages, setNewChat, setReceiver } from '@/redux/chatSlice';

export function ApplicantCard({ applicant }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMessageClick = () => {
        // console.log(applicant)
        dispatch(setReceiver(applicant?.candidateId));
        const chatUser = {
            name: applicant?.name,
            profileImage: applicant?.profileImage,
            _id: applicant?.candidateId,
            primaryRole: applicant?.primaryRole
        };
        dispatch(setNewChat(chatUser));
        dispatch(setMessages([]));
        navigate("/recruiter/messages");
    };

    return (
        <div className="bg-white rounded-lg border border-gray-300 w-full hover:shadow-md transition-shadow duration-200  p-3 sm:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Profile Section */}
                <div onClick={() => navigate(`/recruiter/applicants/profile/${applicant.userId}`)} className="flex items-center cursor-pointer space-x-3 md:space-x-4 flex-1 min-w-0">
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
                        <p className='text-red-500 text-sm sm:text-base text-left w-full'>Accepted on {applicant?.statusUpdatedAt ? new Date(applicant.statusUpdatedAt).toLocaleDateString() : 'N/A'}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    navigate(`/recruiter/applicants/profile/${applicant.userId}`);
                                }}
                                className="flex-1 sm:flex-none py-2 px-3 sm:px-4 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium whitespace-nowrap w-full sm:w-auto"
                            >
                                View Profile
                            </button>
                            <button onClick={() => handleMessageClick()} className="flex-1 sm:flex-none py-2 px-3 sm:px-4 bg-white text-red-500 rounded hover:bg-red-200 border border-red-500 text-sm font-medium whitespace-nowrap w-full sm:w-auto ">Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AcceptedApplicants() {

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
        const status = 'Accepted';
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

export default AcceptedApplicants