import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const toggleSlice = createSlice({
    name: "toggleSlice",
    initialState: {
        searchToggle: false,
        loginToggle: false,
        showLoginInSlider: true,
        showAddressSlider: false,
        foodDetailsCardPopUp: false
    },
    reducers: {
        toggleSearchBar: (state) => {
            state.searchToggle = !state.searchToggle
        },
        toggleLogin: (state) => {
            state.loginToggle = !state.loginToggle
        },
        openLoginInSlider: (state) => {
            console.log('openLoginInSlide', state.showLoginInSlider)
            state.showLoginInSlider = true
        },
        openSignupInSlider: (state) => {
            console.log('signupInSlide', state.showLoginInSlider);
            state.showLoginInSlider = false
        },
        showAdrSlider: (state) => {
            console.log('show address sldier')
            state.showAddressSlider = true;
        },
        hideAddressSlider: state => {
            state.showAddressSlider = false;
        },
        setShowFoodDetailsCard: (state, action: PayloadAction<boolean>) => {
            state.foodDetailsCardPopUp = action.payload;
        }
    }
})

export const {toggleSearchBar, toggleLogin, openLoginInSlider, openSignupInSlider, showAdrSlider, hideAddressSlider, setShowFoodDetailsCard} = toggleSlice.actions;
export default toggleSlice.reducer