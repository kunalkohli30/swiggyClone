import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartItemType } from "../context/contextApi";
import { RootState } from "./Store";
import { CartResponseModel } from "../interfaces/apiModels/CartDtos";
import axiosInstance from "../config/AxiosInstance";
import { act } from "react";

export interface resInfo {
    restaurantId: number,
    restaurantName: string,
    areaName: string,
    image: string
}

export const fetchCart = createAsyncThunk<
    CartResponseModel | null
>("cartSlice/fetchCart", async (actions, { getState, dispatch }) => {

    const g = getState() as RootState;

    console.log('user logged in');
    if (g.loginSlice.isLoggedIn) {
        const response = await axiosInstance.get('/api/cart');

        console.log('cart api response received in async thunk');
        const cartResponse: CartResponseModel = response.data;
        if (cartResponse.cartItems?.length === 0) {
            // clear cart and save cartSlice data into db
            console.log('gng for post request', g.cartSlice?.resInfo);
            await axiosInstance.post(process.env.BACKEND_URL + 'api/cart',
                {
                    restaurantId: g.cartSlice?.resInfo?.restaurantId,
                    cartItems: g.cartSlice?.cartItems.map(item => { return { foodId: item.foodId, quantity: item.quantity } })
                })
                .catch(error => {
                    console.log('failed to save cartData on login. Error: ', error);
                })
            return null;
        } else {
            // fetch cart data to cartSlice
            dispatch(setRestaurantInfo({
                restaurantId: cartResponse?.restaurantId,
                restaurantName: cartResponse?.restaurantName,
                areaName: cartResponse?.restaurantAreaName,
                image: cartResponse?.restaurantImageUrl
            } as resInfo));
            // console.log('before saving data for resinfo', cartResponse);

            const cartItems = cartResponse.cartItems.map(item => {
                return {
                    foodId: item.foodId,
                    foodItemName: item.foodItemName,
                    restaurantId: cartResponse.restaurantId,
                    quantity: item.quantity,
                    isVeg: item.veg,
                    totalPrice: item.totalPrice
                } as cartItemType
            });
            dispatch(setCartData(cartItems));
            return cartResponse;
        }

    }
    return null;
})

const cartSlice = createSlice({
    name: "cartSlice",
    initialState: {
        cartItems: [] as cartItemType[],
        resInfo: null as resInfo | null
    },

    reducers: {
        addToCart: (state, action) => {
            state.cartItems = [...state.cartItems, action.payload.cartItem]
        },
        incrementQuantity: (state, action) => {
            const foodId = action.payload;
            // state.cartItems.filter(item => item.foodId === action.payload.)
            const cartItem = state.cartItems.filter(item => item.foodId === foodId)[0];
            if (cartItem)
                cartItem.quantity = cartItem.quantity + 1;
        },
        updateQuantityInState: (state, action: PayloadAction<cartItemType & {operation? : 'ADD' | 'REDUCE'}> ) => {
            const foodId = action.payload.foodId;
            const existingCartItem = state.cartItems.filter(item => item.foodId === action.payload.foodId);        //existing cart item with same foodId
            
            const { operation, ...cartItem}= action.payload;

            if(existingCartItem.length === 0 && operation === 'ADD') {
                state.cartItems = [...state.cartItems, cartItem];
            }
            else if (existingCartItem?.length) {
                existingCartItem[0].quantity = operation === 'ADD' ? existingCartItem[0].quantity +1 : existingCartItem[0].quantity -1;

                if(existingCartItem[0].quantity === 0) 
                    state.cartItems = state.cartItems.filter(item => item?.foodId != foodId);           //remove that fooditem from cart
            }  
            if (state.cartItems?.length === 0)
                state.resInfo = null;        //if cart gets empty, set resInfo.restaurantId to blank
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.resInfo = null;
        },
        setCartItemData: (state, action: PayloadAction<cartItemType>) => {
            console.log('payload', action.payload);
            if (state.cartItems.filter(item => item.foodId === action.payload.foodId).length === 0) {
                state.cartItems = [...state.cartItems, action.payload];
            } else {
                if (action.payload.quantity === 0)
                    state.cartItems = state.cartItems.filter(item => item.foodId !== action.payload.foodId)
                else
                    state.cartItems = state.cartItems.map(item => item.foodId === action.payload.foodId ? { ...item, quantity: action.payload.quantity } : item);
            }
        },
        setCartData: (state, action: PayloadAction<cartItemType[]>) => {
            state.cartItems = action.payload;
        },
        setRestaurantInfo: (state, action: PayloadAction<resInfo>) => {
            console.log('set resinfo', action)
            state.resInfo = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchCart.pending, (state, action) => {
            console.log('pedninig');
            // state
        }).addCase(fetchCart.fulfilled, (state, action) => {

            console.log(action.payload?.cartId);
        })
    }
})

export const { addToCart, clearCart, setRestaurantInfo, incrementQuantity, updateQuantityInState, setCartItemData, setCartData } = cartSlice.actions;
export default cartSlice.reducer;