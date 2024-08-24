import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        post: []
    },
    reducers: {
        setAuthUser(state, action) {
            console.log("s", action.payload)
            state.user = action.payload
        },
        setsuggestedUsers(state, action) {
            state.suggestedUsers = action.payload
        },
        getAllPost(state, action) {
            state.post = action.payload
        }, setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
    }
})


export const { setAuthUser, setsuggestedUsers, getAllPost, setUserProfile } = authSlice.actions;
export default authSlice.reducer