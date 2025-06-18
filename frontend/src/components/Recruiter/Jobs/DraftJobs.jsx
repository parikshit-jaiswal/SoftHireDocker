import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import useJob from '@/Context/JobContext/useJob';
import EditJob from './EditJob';
import JobPreview from './JobPreview';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import EditDraft from './EditDraft';

function DraftJobs() {
    const dispatch = useDispatch();
    const selectedJob = useSelector(
        state => state.job.selectedJob,
        (a, b) => a?._id === b?._id
    );
    const [activeTab, setActiveTab] = useState('preview');
    const { jobOption } = useJob();
    const prevJobId = useRef(selectedJob?._id);

    useEffect(() => {
        if (selectedJob?._id && selectedJob._id !== prevJobId.current) {
            setActiveTab('preview');
            prevJobId.current = selectedJob._id;
        }
    }, [selectedJob?._id]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            {activeTab === 'preview' ? (
                <JobPreview activeTab={activeTab} setActiveTab={handleTabChange} />
            ) : (
                <EditDraft activeTab={activeTab} setActiveTab={handleTabChange} />
            )}
        </div>
    );
}

export default DraftJobs;