import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        allUsers: [],
        searchUserByText: "",
        warningClosed: false
    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        setSearchUserByText: (state, action) => {
            state.searchUserByText = action.payload;
        },
        setWarningClosed: (state, action) => {
            state.warningClosed = action.payload;
        }
    }
});
export const { setLoading, setUser, setWarningClosed, setAllUsers, setSearchUserByText } = authSlice.actions;
export default authSlice.reducer;