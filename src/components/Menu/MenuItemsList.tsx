import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { cartItemType } from '../../context/contextApi';
import PlusMinusQuantityBtn from '../PlusMinusQuantityBtn';
import ItemsAlreadyInCartPopup from './ItemsAlreadyInCartPopup';
import { useDispatch } from 'react-redux';
import { resInfoType, setCartItemData, setRestaurantInfo, updateQuantityInState } from '../../utils/cartSlice';
import { FoodDto, RestaurantDto } from '../../interfaces/apiModels/RestaurantList';
import { UpdateCartModel } from '../../interfaces/apiModels/CartDtos';
import axiosInstance from '../../config/AxiosInstance';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../utils/hooks';


type iProps = {
    itemCards: FoodDto[],
    restaurantData: RestaurantDto
}

const MenuItemsList = ({ itemCards, restaurantData }: iProps) => {

    const [showPopup, setShowPopup] = useState(false);
    const [itemToAddToCartAfterPopupIsClosed, setItemToAddToCartAfterPopupIsClosed] = useState<FoodDto | null>(null);

    const cartData = useAppSelector(state => state.cartSlice.cartItems);
    const resInfo = useAppSelector(state => state.cartSlice.resInfo);

    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);

    const dispatch = useDispatch();

    const handleAddtoCart = (foodItem: FoodDto) => {

        console.log('test', resInfo?.restaurantId, restaurantData.id)
        if (resInfo !== null && resInfo?.restaurantId && resInfo?.restaurantId  !== restaurantData.id) {       //If an item from different restaurant, open popup 
            setShowPopup(true);
            setItemToAddToCartAfterPopupIsClosed(foodItem);                                     // Sets the item to be added to cart when popup is closed with yes 
        } else {
            addItemToCart(foodItem);        // if another item is ordered from same restaurant, just add it to cart
        }
    }

    const addItemToCart = async (foodItem: FoodDto | null) => {
        console.log('addtocart', foodItem, resInfo);

        if (resInfo === null) {          // if resInfo.restaurantId is blank then set it to current restaurant's id
            console.log('inside if', restaurantData, resInfo);
            dispatch(setRestaurantInfo(
                {
                    restaurantId: restaurantData.id,
                    restaurantName: restaurantData.name,
                    areaName: restaurantData.areaName,
                    image: restaurantData.imageId
                } as resInfoType
            ))
        }



        if (isLoggedIn) {

            if (resInfo?.restaurantId !== foodItem?.restaurantId) {
                // clear the cart
                await clearCart();
            }

            axiosInstance.post("api/cart/cartItem", {
                foodId: foodItem?.id,
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

            if (foodItem) {
                dispatch(updateQuantityInState({
                    foodId: foodItem?.id,
                    restaurantId: restaurantData.id,     //couldnt find in swiggy api
                    quantity: 1,
                    totalPrice: foodItem?.price ? foodItem.price / 100 : 0,
                    foodItemName: foodItem?.name,
                    image: foodItem?.imageId,
                    isVeg: foodItem?.vegetarian,
                    operation: 'ADD'
                }))
            }
        }
    }

    const clearCart = async () => {
        await axiosInstance.delete("/api/cart/clear");
    }

    const showAddButton = (foodItem: FoodDto) => {
        if (!cartData || cartData.filter((cartItem: cartItemType) => cartItem.foodId === foodItem?.id).length === 0)
            return true;
    }

    return (
        <div className='pt-2'>
            {itemCards && itemCards?.length &&
                itemCards?.map((foodItem, index) => (
                    <div key={index} >
                        <div className='flex justify-between'>
                            <div className='flex flex-col w-3/4' >
                                <img
                                    className='w-4 h-4'
                                    src={foodItem.vegetarian ? vegIcon : nonVegIcon}
                                />
                                <p className='font-bold text-[#414448] '>{foodItem?.name}</p>
                                <div className='flex font-semibold font-roboto tracking-tighter'>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' />{
                                        <p className='text-gray-900 text-sm'>{foodItem?.price / 100}</p>
                                    }
                                </div>
                                <div className='pt-2'>
                                    <p className='text-gray-500 text-xs font-cabin'>{foodItem?.description}</p>
                                </div>
                            </div>
                            <div className=' mb-6 relative'>
                                {foodItem?.imageId && (<img                                                        //food items image 
                                    src={foodItem?.imageId}
                                    className='w-32 h-32 rounded-2xl  z-10 relative'
                                />)}
                                <div className={`border-2 border-slate-200   py-1
                                                ${foodItem?.imageId ? 'mx-auto w-[70%]' : 'mt-3 w-24 mr-4'}
                                                   flex items-center justify-center -mt-5
                                                 bg-white z-10 relative rounded-xl font-extrabold text-green-600 text-sm tracking-tighter font-display`}
                                >
                                    {
                                        showAddButton(foodItem) ?
                                            <p onClick={() => handleAddtoCart(foodItem)}>ADD</p> :
                                            <PlusMinusQuantityBtn
                                                foodId={foodItem?.id}
                                                image={foodItem?.imageId}
                                                foodItemName={foodItem?.name}
                                                totalPrice={foodItem?.price / 100}
                                                isVeg={foodItem?.vegetarian}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                        {index !== itemCards.length - 1 && <hr className='py-2'></hr>}
                    </div>
                ))
            }

            <ItemsAlreadyInCartPopup showPopup={showPopup} setShowPopup={setShowPopup} addItemToCart={() => addItemToCart(itemToAddToCartAfterPopupIsClosed)} />
        </div>
    )
}

export default MenuItemsList