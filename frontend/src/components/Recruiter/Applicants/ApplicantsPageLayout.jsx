import React from 'react'
import ApplicantsHeader from './ApplicantsHeader'
import NeedReview from './NeedReview'
import { Outlet } from 'react-router-dom'

function ApplicantsPageLayout() {
    return (
        <>
            <div className="sticky top-0 z-10 bg-white">
                <ApplicantsHeader />
            </div>
            <Outlet />
        </>
    )
}

export default ApplicantsPageLayout