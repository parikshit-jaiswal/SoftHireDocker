import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RecruiterProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);

    const isRecruiter = user?.role === 'recruiter';
    const isUser = user?.role === 'candidate';

    if (!user) {
        return <Navigate to="/login" replace />;
    } else {
        if (isUser) {
            return <Navigate to="/dashboard" replace />;
        }
        if (!isRecruiter) {
            return <Navigate to="/login" replace />;
        }
    }
    return <Outlet />;
};

export default RecruiterProtectedRoute;
