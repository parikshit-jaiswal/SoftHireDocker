import { createSlice } from "@reduxjs/toolkit"

const applicantsSlice = createSlice({
    name: "applicant",
    initialState: {
        applicants: [],
        selectedApplicant: null,
    },
    reducers: {
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setSelectedApplicant: (state, action) => {
            state.selectedApplicant = action.payload;
        }
    }
});
export const {
    setSelectedApplicant,
    setApplicants
} = applicantsSlice.actions;
export default applicantsSlice.reducer;