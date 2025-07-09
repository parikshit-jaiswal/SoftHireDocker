import RecruiterNavbar from '@/components/Recruiter/RecruiterNavbar';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

function RecruiterSponcerLicenseLayout() {

    return (
        <>
            <RecruiterNavbar />
            <div className="px-2">
                <Outlet />
            </div>
        </>
    )
}

export default RecruiterSponcerLicenseLayout