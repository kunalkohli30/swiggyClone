import { createSlice } from "@reduxjs/toolkit";
import UserType from "../interfaces/User";


const loginSlice = createSlice({
    name: "loginSlice",
    initialState: {
        isLoggedIn: false,
        userData: null as UserType | null
    },
    reducers: {
        setLoggedIn: (state) => {
            state.isLoggedIn = true;
            // localStorage.setItem("", action.payload);
        },
        setLoggedout: (state) => {
            state.isLoggedIn = false;
            // localStorage.setItem("authToken", "");
        },
        setUserData: (state, action) => {
            console.log('setuserdata dispatch called', action.payload);
            state.userData = action.payload.userData;
        },
        resetUserData: (state) => {
            state.userData = null
        }
    }
})

export const { setLoggedIn, setLoggedout, setUserData } = loginSlice.actions;
export default loginSlice.reducer;