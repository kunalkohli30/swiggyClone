import { createSlice } from "@reduxjs/toolkit";


const filterSlice = createSlice({
    name: 'filterSlice',
    initialState: {
        selectedFilters: [] as string[]
    },
    reducers: {
        updateFilter: (state, action) => {
            if (state.selectedFilters.includes(action.payload))
                state.selectedFilters = state.selectedFilters.filter(id => id != action.payload);
            else
                state.selectedFilters = [...state.selectedFilters, action.payload];
        }
    }
})

export const { updateFilter } = filterSlice.actions;
export default filterSlice.reducer;