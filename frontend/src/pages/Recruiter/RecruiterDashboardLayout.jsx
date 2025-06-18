import RecruiterNavbar from "@/components/Recruiter/RecruiterNavbar";
import JobProvider from "@/Context/JobContext/JobProvider";
import { Outlet } from "react-router-dom";

export default function RecruiterDashboardLayout() {
    return (
        <>
            <JobProvider>
                <RecruiterNavbar />
                <Outlet />
            </JobProvider>
        </>
    );
}

