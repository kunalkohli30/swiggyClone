import { createSlice } from "@reduxjs/toolkit";


const toggleSlice = createSlice({
    name: "toggleSlice",
    initialState: {
        searchToggle: false
    },
    reducers: {
        toggleSearchBar: (state) => {
            state.searchToggle = !state.searchToggle
        }
    }
})

export const {toggleSearchBar} = toggleSlice.actions;
export default toggleSlice.reducer