import React, { createContext, Dispatch } from "react";

export interface cartItemType  {
    foodId: string,
    restaurantId: string,
    quantity: number,
    totalPrice: number,
    name: string,
    image: string,
    isVeg: boolean
}

export const Visibility = createContext({visible: false, setVisible: (state: boolean) => {}});
export const cartContext = createContext<{cartData: cartItemType[], setCartData: Dispatch<React.SetStateAction<cartItemType[]>>}>({
    cartData: [],
    setCartData: () => {}
});