import React, { useState } from 'react';
import JobContext from './JobContext';

const JobProvider = ({ children }) => {
    const [jobOption, setJobOption] = useState('active');
    const [jobEdit, setJobEdit] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    return (
        <JobContext.Provider value={{ jobOption, setJobOption, jobEdit, setJobEdit, isSidebarOpen, setIsSidebarOpen }}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;
