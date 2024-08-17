import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        post:[]
    },
    reducers:{
        setAuthUser(state,action){
            state.user=action.payload
        },
        setsuggestedUsers(state,action){
            state.suggestedUsers=action.payload
        },
        getAllPost(state,action){
            state.post=action.payload
        }
    }
})


export const {setAuthUser,setsuggestedUsers,getAllPost}=authSlice.actions;
export default authSlice.reducer