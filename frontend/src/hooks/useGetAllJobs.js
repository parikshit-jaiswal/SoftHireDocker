import { useEffect, useState, useRef } from 'react';
import { getJobs } from '../Api/JobServices';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs, setSelectedJob } from '@/redux/jobSlice';
import { useLocation } from 'react-router-dom';

const useGetAllJobs = () => {
    // const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const { jobs, selectedJob } = useSelector((state) => state.job || {});
    const isFirstLoad = useRef(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await getJobs();
            const sortedJobs = response.jobs.sort((a, b) => 
                new Date(b.postedAt) - new Date(a.postedAt)
            );
            
            dispatch(setJobs(sortedJobs));
            
            // Only select most recent job on first load and if no job is selected
            if (isFirstLoad.current && !selectedJob && sortedJobs.length > 0) {
                dispatch(setSelectedJob(sortedJobs[0]));
                isFirstLoad.current = false;
            }
            
            return sortedJobs;
        } catch (err) {
            setError('Failed to fetch jobs');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Reset isFirstLoad when leaving the jobs page
    useEffect(() => {
        if (location.pathname !== '/recruiter/jobs') {
            isFirstLoad.current = true;
        }
    }, [location.pathname]);

    // Fetch jobs when component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, error, fetchJobs };
};

export default useGetAllJobs;
