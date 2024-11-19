import { configureStore } from "@reduxjs/toolkit";
import toggleSlice from './toggleSlice'
import cartSlice from './cartSlice'

const store = configureStore({
    reducer: {
        toggleSlice: toggleSlice,
        cartSlice: cartSlice
    }
})

export default store;