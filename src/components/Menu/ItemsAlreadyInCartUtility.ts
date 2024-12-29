import { useState } from "react";
import { FoodDto } from "../../interfaces/apiModels/RestaurantList";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import axiosInstance from "../../config/AxiosInstance";
import { clearCart, resInfo, setCartItemData, setRestaurantInfo, setStagedCartItem, updateQuantityInState } from "../../utils/cartSlice";
import { UpdateCartModel } from "../../interfaces/apiModels/CartDtos";
import { AxiosError } from "axios";
import { cartItemType } from "../../context/contextApi";

const [showPopup, setShowPopup] = useState(false);
const [itemToAddToCartAfterPopupIsClosed, setItemToAddToCartAfterPopupIsClosed] = useState<cartItemType | null>(null);


const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);
const { cartItems, resInfo } = useAppSelector(state => state.cartSlice);

const dispatch = useAppDispatch();

const fetchRestaurantData = async (id: number) => {
    let restaurantData = await axiosInstance.get(`/api/public/restaurant/${id}`);

    const response: resInfo = {
        restaurantId: restaurantData.data.id,
        restaurantName: restaurantData.data.name,
        areaName: restaurantData.data.areaName,
        image: restaurantData.data.imageId
    };
    return response;
}

export const addItemToCart = async (cartItem: cartItemType) => {
    // console.log('addtocart', foodItem, resInfo);

    if (resInfo === null) {          // if resInfo.restaurantId is blank then set it to current restaurant's id
        // console.log('inside if', restaurantData, resInfo);
        const restaurantData = await fetchRestaurantData(cartItem?.restaurantId);
        dispatch(setRestaurantInfo(restaurantData));
    }

    if (isLoggedIn) {

        axiosInstance.post(process.env.BACKEND_URL + "api/cart/cartItem", {
            foodId: cartItem?.foodId,
            quantity: 1,
            operation: "ADD"
        } as UpdateCartModel
        ).then(response => {
            const data = response.data;
            dispatch(setCartItemData(data));
        }).catch((error: AxiosError) => {
            console.log('add item to cart api failed', error);
            if (error.status === 409) {

            }
        })
    } else {

        if (cartItem) {
            dispatch(updateQuantityInState({
                // foodId: cartItem?.id,
                // restaurantId: cartItem.restaurantId,     //couldnt find in swiggy api
                // quantity: 1,
                // totalPrice: cartItem?.price ? cartItem.price / 100 : 0,
                // foodItemName: cartItem?.name,
                // image: cartItem?.imageId,
                // isVeg: cartItem?.vegetarian,
                ...cartItem,
                operation: 'ADD'
            }))
        }
    }
}

export const handleAddtoCart = (cartItem: cartItemType) => {


    // console.log('test', resInfo?.restaurantId, restaurantId)

    if (resInfo !== null && resInfo?.restaurantId !== cartItem.restaurantId) {       //If an item from different restaurant, open popup 
        setShowPopup(true);
        setItemToAddToCartAfterPopupIsClosed(cartItem);                                     // Sets the item to be added to cart when popup is closed with yes 
        dispatch(setStagedCartItem(cartItem));
    } else { 
        addItemToCart(cartItem);        // if another item is ordered from same restaurant, just add it to cart
    }
}
