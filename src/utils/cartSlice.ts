import { createSlice } from "@reduxjs/toolkit";
import { cartItemType } from "../context/contextApi";


const cartSlice = createSlice({
    name: "cartSlice",
    initialState: {
        cartItems: [] as cartItemType[],
        resInfo: {restaurantId: ''} as { restaurantId: string }
    },
    reducers: {
        addToCart: (state, action) => {
            state.cartItems = [...state.cartItems, action.payload.cartItem]
        },
        incrementQuantity: (state, action) => {
            const foodId = action.payload;
            const cartItem = state.cartItems.filter(item => item.foodId === foodId)[0];
            if (cartItem)
                cartItem.quantity = cartItem.quantity + 1;
        },
        decrementQuantity: (state, action) => {
            const foodId = action.payload;
            const existingCartItem = state.cartItems.filter(item => item.foodId === foodId);        //existing cart item with same foodId

            if (existingCartItem?.length) {
                existingCartItem[0].quantity === 1 ?
                    state.cartItems = state.cartItems.filter(item => item?.foodId != foodId) :      //remove that fooditem from cart
                    existingCartItem[0].quantity = existingCartItem[0].quantity - 1;                                //decrement quantity by one
            }
            if(state.cartItems?.length === 0)
                state.resInfo.restaurantId = '';        //if cart gets empty, set resInfo.restaurantId to blank
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.resInfo = {restaurantId: ''};
        },
        setRestaurantInfo: (state, action) => {
            state.resInfo = action.payload.resInfo;
        }
    }
})

export const { addToCart, clearCart, setRestaurantInfo, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;