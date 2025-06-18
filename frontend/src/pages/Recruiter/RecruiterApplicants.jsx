import ApplicantsSidebar from '@/components/Recruiter/Applicants/ApplicantsSidebar';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

function RecruiterApplicants() {

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable page scroll
        return () => {
            document.body.style.overflow = 'auto'; // Restore on unmount
        };
    }, []);

    return (
        <>
            <div className="flex mb-10 h-screen w-screen">
                <ApplicantsSidebar />
                <div className="px-[3%]  pb-20 w-full overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
export default RecruiterApplicants