import { createSlice } from "@reduxjs/toolkit"

const assessmentSlice = createSlice({
    name: "result",
    initialState: {
        result: null,
    },
    reducers: {
        setResult: (state, action) => {
            state.result = action.payload;
        },

    }
});
export const {
    setResult
} = assessmentSlice.actions;
export default assessmentSlice.reducer;