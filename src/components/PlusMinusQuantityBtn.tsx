import React, { useContext } from 'react'
import { cartContext, cartItemType } from '../context/contextApi'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity } from '../utils/cartSlice';

// const PlusMinusQuantityBtn = ({ foodId, price, name, imageId, isVeg }: { foodId: string, price: number, name: string, imageId: string, isVeg: boolean }) => {
const PlusMinusQuantityBtn = (cartItem: cartItemType) => {


    const cartData: cartItemType[] = useSelector(state => state.cartSlice.cartItems);
    const dispatch = useDispatch();

    const handleAddtoCart = () => {
        const existingFoodIteminCart = cartData?.filter((item: cartItemType) => item?.foodId === cartItem?.foodId)

        // console.log('exstimg ', existingFoodIteminCart);
        if (existingFoodIteminCart.length > 0) {
            dispatch(incrementQuantity(existingFoodIteminCart[0]?.foodId));
        } else {
            dispatch(addToCart(cartItem));
        }
    }

    const handleRemoveFromCart = () => {

        const existingFoodIteminCart = cartData?.filter(item => item?.foodId == cartItem?.foodId);
        dispatch(decrementQuantity(existingFoodIteminCart[0].foodId));
    }

    return (

        <div className='flex w-full justify-around text-base font-normal items-center '>
            <p className='cursor-pointer px-1 ' onClick={handleRemoveFromCart}>-</p>
            <p className='cursor-default text-sm font-semibold text-green-500'>{cartData.filter(item => item.foodId === cartItem?.foodId)[0]?.quantity}</p>
            <p className='cursor-pointer px-1 text-green-500 font-bold' onClick={handleAddtoCart}>+</p>
        </div>

    )
}

export default PlusMinusQuantityBtn