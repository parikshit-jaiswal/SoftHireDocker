// store/slices/jobsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllJobs } from '@/Api/dashboard';

// Async thunk for fetching all jobs
export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAllJobs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllJobs();
      return data || []; // Ensure we return an array even if no jobs are found
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

const initialState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

const userJobsSlice = createSlice({
  name: 'userJobs',
  initialState,
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedJob, clearSelectedJob, clearError } = userJobsSlice.actions;
export default userJobsSlice.reducer;