import React, { createContext, Dispatch } from "react";

export interface cartItemType  {
    foodId: number,
    foodItemName: string,
    restaurantId?: number,
    quantity?: number,
    totalPrice: number,
    image: string,
    isVeg: boolean,
    unitPrice?: number
}

export const Visibility = createContext({visible: false, setVisible: (_state: boolean) => {}});
export const cartContext = createContext<{cartData: cartItemType[], setCartData: Dispatch<React.SetStateAction<cartItemType[]>>}>({
    cartData: [],
    setCartData: () => {}
});