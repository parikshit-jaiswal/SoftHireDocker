import { createSlice } from "@reduxjs/toolkit"

const jobSlice = createSlice({
    name: "job",
    initialState: {
        job: null,
        jobDraft: null,
        selectedJob: null,
        jobOption: 'active',
        jobEdit: false,
        jobs: [],
    },
    reducers: {
        setJob: (state, action) => {
            state.job = action.payload;
        },
        setJobs: (state, action) => {
            state.jobs = action.payload;
        },
        setJobDraft: (state, action) => {
            state.jobDraft = action.payload;
        },
        setSelectedJob: (state, action) => {
            state.selectedJob = action.payload;
        },
        setJobOption: (state, action) => {
            state.jobOption = action.payload;
        },
        setJobEdit: (state, action) => {
            state.jobEdit = action.payload;
        },
    }
});
export const {
    setJob,
    setJobDraft,
    setSelectedJob,
    setJobOption,
    setJobs,
} = jobSlice.actions;
export default jobSlice.reducer;