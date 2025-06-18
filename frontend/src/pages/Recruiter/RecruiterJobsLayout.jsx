import JobSidebar from '@/components/Recruiter/Jobs/JobSidebar';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

function RecruiterJobsLayout() {

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable page scroll
        return () => {
            document.body.style.overflow = 'auto'; // Restore on unmount
        };
    }, []);

    return (
        <>
            <div className="flex mb-10 h-screen w-screen">
                <JobSidebar />
                <div className="px-[3%] py-8 pb-20 w-full overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default RecruiterJobsLayout