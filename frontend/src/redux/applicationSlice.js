import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
        statusUpdated: false,
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setStatusUpdated: (state, action) => {
            state.statusUpdated = action.payload;
        },
    }
});
export const { setAllApplicants, setStatusUpdated } = applicationSlice.actions;
export default applicationSlice.reducer;