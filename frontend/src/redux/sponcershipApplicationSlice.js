import { createSlice } from "@reduxjs/toolkit"

const sponcershipApplicationSlice = createSlice({
    name: "sponcershipApplication",
    initialState: {
        applicationId: null,
        companyName: '',
    },
    reducers: {
        setApplicationId: (state, action) => {
            state.applicationId = action.payload;
        },
        setCompanyName: (state, action) => {
            state.companyName = action.payload;
        },
    }
});
export const {
    setApplicationId,
    setCompanyName,
} = sponcershipApplicationSlice.actions;
export default sponcershipApplicationSlice.reducer;