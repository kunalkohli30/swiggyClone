import { configureStore } from "@reduxjs/toolkit";
import toggleSlice from './toggleSlice'
import cartSlice from './cartSlice'
import filterSlice from './filterSlice'
import loginSlice from "./userLoginSlice";

const store = configureStore({
    reducer: {
        toggleSlice: toggleSlice,
        cartSlice: cartSlice,
        filterSlice: filterSlice,
        loginSlice: loginSlice
    }
})

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];
export default store;