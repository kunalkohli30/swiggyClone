import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { cartContext, cartItemType } from '../../context/contextApi';
import { fetchSwiggyImagesDomainPath } from '../../StandardConstants';
import PlusMinusQuantityBtn from '../PlusMinusQuantityBtn';
import ItemsAlreadyInCartPopup from './ItemsAlreadyInCartPopup';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, setRestaurantInfo } from '../../utils/cartSlice';

const MenuItemsList = ({ itemCards, restaurantId }) => {

    const [showPopup, setShowPopup] = useState(false);
    const [itemToAddToCartAfterPopupIsClosed, setItemToAddToCartAfterPopupIsClosed] = useState(null);

    const cartData = useSelector(state => state.cartSlice.cartItems);
    const resInfo = useSelector(state => state.cartSlice.resInfo);

    const dispatch = useDispatch();


    const handleAddtoCart = item => {

        if (resInfo?.restaurantId !== '' && resInfo?.restaurantId !== restaurantId) {       //If an item from different restaurant, open popup 
            setShowPopup(true);
            setItemToAddToCartAfterPopupIsClosed(item);                                     // Sets the item to be added to cart when popup is closed with yes 
        } else {                                                
            addItemToCart(item);        // if another item is ordered from same restaurant, just add it to cart
        }
    }

    const addItemToCart = item => {
        if (resInfo?.restaurantId === '')           // if resInfo.restaurantId is blank then set it to current restaurant's id
            dispatch(setRestaurantInfo({
                resInfo: {
                    restaurantId: restaurantId
                }
            }))
        dispatch(addToCart({
            cartItem: {
                foodId: item?.card?.info?.id,
                restaurantId: restaurantId,     //couldnt find in swiggy api
                quantity: 1,
                totalPrice: (item?.card?.info?.price | item?.card?.info?.defaultPrice) / 100,
                name: item?.card?.info?.name,
                image: item?.card?.info?.imageId,
                isVeg: item?.card?.info?.itemAttribute?.vegClassifier === "VEG"
            } as cartItemType
        }))
    }

    const showAddButton = item => {
        if (!cartData || cartData.filter((cartItem: cartItemType) => cartItem.foodId === item?.card?.info?.id).length === 0)
            return true;
    }

    return (
        <div className='pt-2'>
            {itemCards && itemCards?.length &&
                itemCards?.map((item, index) => (
                    <div key={index} >
                        <div className='flex justify-between'>
                            <div className='flex flex-col w-3/4' >
                                <img
                                    className='w-4 h-4'
                                    src={item?.card?.info?.itemAttribute?.vegClassifier === "NONVEG" ? nonVegIcon : vegIcon}
                                />
                                <p className='font-bold text-[#414448] '>{item?.card?.info?.name}</p>
                                <div className='flex font-semibold font-roboto tracking-tighter'>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' />{
                                        <p className='text-gray-900 text-sm'>{(item?.card?.info?.price | item?.card?.info?.defaultPrice) / 100}</p>
                                    }
                                </div>
                                <div className='pt-2'>
                                    <p className='text-gray-500 text-xs font-cabin'>{item?.card?.info?.description}</p>
                                </div>
                            </div>
                            <div className=' mb-6 relative'>
                                <img                                                        //food items image 
                                    src={fetchSwiggyImagesDomainPath + item?.card?.info?.imageId}
                                    className='w-32 h-32 rounded-2xl  z-10 relative'
                                />
                                <div className='border-2 border-slate-200 mx-auto w-[70%]  py-1
                                                   flex items-center justify-center -mt-5
                                                 bg-white z-10 relative rounded-xl font-extrabold text-green-600 text-sm tracking-tighter font-display'
                                >
                                    {
                                        showAddButton(item) ?
                                            <p onClick={() => handleAddtoCart(item)}>ADD</p> :
                                            <PlusMinusQuantityBtn
                                                foodId={item?.card?.info?.id}
                                                imageId={item?.card?.info?.imageId}
                                                name={item?.card?.info?.name}
                                                price={(item?.card?.info?.price | item?.card?.info?.defaultPrice) / 100}
                                                isVeg={item?.card?.info?.itemAttribute?.vegClassifier === "VEG"}
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