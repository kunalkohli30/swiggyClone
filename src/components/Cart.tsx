import { fetchSwiggyImagesDomainPath } from '../StandardConstants';
import vegIcon from '../assets/icons8-veg-48.png';
import nonVegIcon from '../assets/icons8-non-veg-50.png';
import PlusMinusQuantityBtn from './PlusMinusQuantityBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, resInfo, setCartData, setCartItemData, setRestaurantInfo } from '../utils/cartSlice';
import { openLoginInSlider, openSignupInSlider, toggleLogin } from '../utils/toggleSlice';
import UserType from '../interfaces/User';
import { MdVerified } from 'react-icons/md';

import UserAddresses from './UserAddresses';
import { useEffect } from 'react';
import { cartItemType } from '../context/contextApi';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { cartItemResponse, CartResponseModel } from '../interfaces/apiModels/CartDtos';
import { useAppDispatch, useAppSelector } from '../utils/hooks';


// We can store the image url in cartData context or directly fetch it from api using foodId.
// Implementing the first approach as not having any api from swiggy for fetching food  name, image using foodId
const Cart = () => {

    const greenTextColor = '[#60b246]';

    const [cookies] = useCookies(['auth_token']);
    const authToken = cookies.auth_token;

    // const { cartData, setCartData } = useContext(cartContext);
    const cartData: cartItemType[] = useAppSelector(state => state.cartSlice.cartItems);
    const resInfo: resInfo | null = useAppSelector(state => state.cartSlice.resInfo);
    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);
    const userData: UserType | null = useAppSelector(state => state.loginSlice.userData);

    const getUserName = () => {
        if (userData?.fullName) {
            let nameArray: string[] = userData?.fullName.split(' ');
            return nameArray.map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        }
    }
    const dispatch = useAppDispatch();

    const cssPropertiesToRemoveOverflowingText = {
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitLineClamp': '1',
        'WebkitBoxOrient': 'vertical'
    }

    const center = { lat: 28.649835, lng: 77.124298 };

    return (
        <div className="bg-gray-200 w-full h-screen px-6 md:px-20 lg:px-32">

            <div className=' pt-10 flex gap-7'>
                <div className='flex  w-2/5 min-w-[250px] bg-white '>
                    <div className='flex flex-col gap-4 p-4'>
                        <div className='flex gap-2  items-center ' >       {/*  restaurant image and name   */}
                            <img src={resInfo?.image} className='w-12 h-12 min-w-12' />
                            <div className='flex-col font-semibold'>
                                <p style={{ ...cssPropertiesToRemoveOverflowingText }}>{resInfo?.restaurantName}</p>     {/* //use api to fetch restaurant details    */}
                                <p className='text-sm text-gray-500 font-cabin font-light tracking-wide'>{resInfo?.areaName}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>           {/*  food items in cart  */}
                            {
                                cartData.map(cartItem => (
                                    <div className='flex justify-evenly items-center gap-1 md:gap-2 lg:gap-4 xl:gap-6 '>
                                        <img
                                            className='w-4 h-4'
                                            src={cartItem?.isVeg ? vegIcon : nonVegIcon}
                                        />
                                        <h2 className='font-display text-xs lg:text-sm text-gray-700 text-wrap w-20 lg:w-32 xl:w-52 '>{cartItem?.foodItemName}</h2>
                                        <div className='w-12     border-2 border-wid border-gray-200'>
                                            <PlusMinusQuantityBtn
                                                foodId={cartItem?.foodId}
                                                imageId={cartItem?.image}
                                                name={cartItem?.foodItemName}
                                                price={cartItem?.totalPrice}
                                                isVeg={cartItem?.isVeg}
                                            />
                                        </div>
                                        <h2 className='text-gray-500 text-xs tracking-wider text-nowrap w-7 lg:w-10'>
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] lg:pr-[2px]' />
                                            {cartItem?.totalPrice * cartItem?.quantity}
                                        </h2>
                                        {/* <img                                                        //food items image 
                                        src={fetchSwiggyImagesDomainPath + cartItem?.image}
                                        className='w-32 h-32 rounded-2xl  z-10 relative'
                                    /> */}

                                    </div>
                                ))
                            }
                        </div>

                        <div className='w- border-dotted border-b-gray-600 border-b-2 mt-12'></div>

                        <div className='font-display flex flex-col gap-2 mt-2'>             {/* Bill Details  */}
                            <p className='  font-semibold '>Bill Details</p>
                            <div>
                                <div className='flex justify-between text-gray-500 text-sm'>
                                    <p>Item Total</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {cartData.reduce((total, item) => total + item.totalPrice * item.quantity, 0)}</p>
                                </div>
                                <div className='flex justify-between text-gray-500 text-sm'>
                                    <p>Delivery Fee</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> 50</p>
                                </div>

                                <div className='border-b-2 my-2'></div>

                                <div className='flex justify-between text-gray-500 text-sm'>
                                    <p>Delivery Tip</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> 10</p>
                                </div>
                                <div className='flex justify-between text-gray-500 text-sm'>
                                    <p>GST and Restaurant Charges</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> 35</p>
                                </div>

                                <div className='border-b-2 my-2 border-black pt-3'></div>

                                <div className='flex justify-between text-gray-500 text-sm'>
                                    <p className='text-black font-semibold text-base'>To Pay</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> 35</p>
                                </div>
                            </div>
                        </div>
                        <button
                            className='text-xl w-5/6 mx-auto bg-green-700 text-white py-2 rounded-xl hover:scale-95 hover:bg-green-600 font-display'
                            onClick={() => dispatch(clearCart())}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
                <div className=' w-full flex flex-col  gap-4'>
                    <div className='bg-white'>
                        {
                            isLoggedIn ? //User logged in and username
                                (
                                    <div className='flex flex-col gap-6 p-6'>
                                        <div className='flex items-center gap-4'>
                                            <p className='font-display font-semibold text-gray-700 text-xl'>Logged In</p>
                                            <MdVerified className='text-[#60b246] text-xl' />
                                        </div>
                                        <div className='flex gap-4 items-center font-display font-semibold text-gray-700'>
                                            <p className=''>{getUserName()} </p>
                                            <p> | </p>
                                            <p>{`${userData?.phoneNumber ? userData.phoneNumber : userData?.email}`}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='p-6 '>
                                        <p className='text-lg font-semibold font-display text-gray-800' >Account</p>
                                        <p className='text-gray-500 font-cabin tracking-wide'>To place an order now, log in to your existing account or sign up</p>
                                        <div className='flex flex-col md:flex-row items-center md:flex-start gap-4 mt-10'>
                                            <button
                                                className='flex flex-col items-center px-1 sm:px-6 py-2 border-2 border-green-400 w-32 md:w-48'
                                                onClick={() => { dispatch(openLoginInSlider()); dispatch(toggleLogin()) }}
                                            >
                                                <p className='text-xs text-[#60b246] '>Already have an account ?</p>
                                                <p className='text-sm text-[#60b246] font-semibold'>LOG IN</p>
                                            </button>
                                            <button
                                                className='flex flex-col items-center  px-6 py-2 border-2 border-green-400 bg-[#60b246] w-32 md:w-48'
                                                onClick={() => { dispatch(openSignupInSlider()); dispatch(toggleLogin()) }}
                                            >
                                                <p className='text-xs text-white '>New to Urban Eats ?</p>
                                                <p className=' text-sm font-semibold text-white'>SIGN UP</p>
                                            </button>

                                        </div>
                                    </div>
                                )
                        }
                    </div>
                    {
                        isLoggedIn && <UserAddresses />
                    }
                </div>
            </div>


        </div >
    )
}

export default Cart