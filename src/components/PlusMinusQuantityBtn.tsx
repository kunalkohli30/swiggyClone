import { cartItemType } from '../context/contextApi'
import { useDispatch } from 'react-redux';
import { setCartItemData, updateQuantityInState } from '../utils/cartSlice';
import { UpdateCartModel } from '../interfaces/apiModels/CartDtos';
import axiosInstance from '../config/AxiosInstance';
import { useAppSelector } from '../utils/hooks';

// const PlusMinusQuantityBtn = ({ foodId, price, name, imageId, isVeg }: { foodId: string, price: number, name: string, imageId: string, isVeg: boolean }) => {
const PlusMinusQuantityBtn = (cartItem: cartItemType) => {


    const cartData: cartItemType[] = useAppSelector(state => state.cartSlice.cartItems);
    const dispatch = useDispatch();
    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);

    const handleAddtoCart = () => {
        // const existingFoodIteminCart = cartData?.filter((item: cartItemType) => item?.foodId === cartItem?.foodId)
        if (isLoggedIn) {
            axiosInstance.post("api/cart/cartItem", {
                foodId: cartItem.foodId,
                quantity: 1,
                operation: "ADD"
            } as UpdateCartModel
            ).then(response => {
                const data = response.data;
                dispatch(setCartItemData(data));
            }).catch(error => {
                console.log('add item to cart api failed', error);
            })
        }
        else {
            dispatch(updateQuantityInState({ ...cartItem, operation: 'ADD' }))
        }
        // console.log('exstimg ', existingFoodIteminCart);
        // if (existingFoodIteminCart.length > 0) {
        //     dispatch(incrementQuantity(existingFoodIteminCart[0]?.foodId));
        // } else {
        //     dispatch(addToCart(cartItem));
        // }
    }

    const handleRemoveFromCart = () => {

        if (isLoggedIn) {
            axiosInstance.post("api/cart/cartItem", {
                foodId: cartItem.foodId,
                quantity: 1,
                operation: "SUBTRACT"
            } as UpdateCartModel)
                .then(response => {
                    const data = response.data;
                    dispatch(setCartItemData(data));
                })
                .catch(error => {
                    console.log('add item to cart api failed', error);
                })
        }
        else {
            dispatch(updateQuantityInState({ ...cartItem, operation: 'REDUCE' }))
        }
    }

    return (

        <div className='flex w-full justify-around text-base font-normal items-center gap-1 px-1'>
            <p className='cursor-pointer  ' onClick={handleRemoveFromCart}>-</p>
            <p className='cursor-default text-sm font-semibold text-green-500'>{cartData.filter(item => item.foodId === cartItem?.foodId)[0]?.quantity}</p>
            <p className='cursor-pointer  text-green-500 font-bold' onClick={handleAddtoCart}>+</p>
        </div>

    )
}

export default PlusMinusQuantityBtn