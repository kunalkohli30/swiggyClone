
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import PlusMinusQuantityBtn from '../PlusMinusQuantityBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { clearCart, fetchCart, resInfo } from '../../utils/cartSlice';
import { openLoginInSlider, openSignupInSlider, toggleLogin } from '../../utils/toggleSlice';
import UserType from '../../interfaces/User';
import { MdVerified } from 'react-icons/md';
import UserAddresses from './UserAddresses';
import { cartItemType } from '../../context/contextApi';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { IoLocationOutline } from 'react-icons/io5';
import { CiLogin } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { address } from './SaveDeliveryAddress';
import { motion } from "framer-motion";
import onlineShoppingBg from '../../assets/cart_empty.png'
import axiosInstance from '../../config/AxiosInstance';
import AddPhoneNumber from './AddPhoneNumber';



// We can store the image url in cartData context or directly fetch it from api using foodId.
// Implementing the first approach as not having any api from swiggy for fetching food  name, image using foodId
const Cart = () => {

    const greenTextColor = '[#60b246]';

    // const { cartData, setCartData } = useContext(cartContext);
    const cartData: cartItemType[] = useAppSelector(state => state.cartSlice.cartItems);
    const resInfo: resInfo | null = useAppSelector(state => state.cartSlice.resInfo);
    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);
    const userData: UserType | null = useAppSelector(state => state.loginSlice.userData);

    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<address | null>(null);
    const [phoneNoExists, setPhoneNoExists] = useState(false);

    const getUserName = () => {
        if (userData?.fullName) {
            let nameArray: string[] = userData?.fullName.split(' ');
            return nameArray.map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        }
    }
    const dispatch = useAppDispatch();
    const checkoutFees = useAppSelector(state => state.cartSlice.checkoutFees);

    const cssPropertiesToRemoveOverflowingText = {
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitLineClamp': '1',
        'WebkitBoxOrient': 'vertical'
    }

    const deliveryFee = checkoutFees.deliveryFee;
    const deliveryTip = checkoutFees.deliveryTip;
    const gst = checkoutFees.gst;
    const itemsTotal = cartData.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

    useEffect(() => { dispatch(fetchCart()) }, [])


    if (!isLoggedIn || cartData.length == 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 text-center p-6 -mt-10 " style={{ backgroundColor: '#F9F9F9' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-lg"
                >
                    <img
                        src={onlineShoppingBg}
                        alt="Food delivery illustration"
                        className="mx-auto mb-6 w-[300px] h-[300px]"
                    />
                    <h2 className="font-bold text-lg text-gray-800 font-display">Welcome to Your Cart</h2>
                    <p className="text-gray-500 mb-6 font-medium font-cabin">You can go to home page to view more restaurants.</p>
                    <button
                        // onClick={() => router.push("/login")}
                        className="px-4 py-2 bg-orange-600 text-white  font-semibold  hover:bg-orange-700 transition"
                    >
                        See restaurants near you
                    </button>
                </motion.div>
            </div>
        )
    }
    else
        return (
            <div className="bg-gray-200 w-full h-full px-6 md:px-14  xl:px-40">

                <div className=' pt-10 flex gap-10'>
                    <div className='flex  w-[55%] min-w-[250px] max-w-[330px] bg-white mb-4'>
                        <div className='flex flex-col gap-4 p-4 w-full'>
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
                                        <div className='flex justify-evenly items-center gap-1 md:gap-2 lg:gap-3  '>
                                            <img
                                                className='w-4 h-4'
                                                src={cartItem?.isVeg ? vegIcon : nonVegIcon}
                                            />
                                            <h2 className='font-display text-xs xl:text-sm text-gray-700 text-wrap w-16 lg:w-28 xl:w-40 '>{cartItem?.foodItemName}</h2>
                                            <div className='w-14 lg:w-16 border-2 border-wid border-gray-200 '>
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
                                                {cartItem?.unitPrice * cartItem?.quantity}
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

                            <div className='font-display flex flex-col gap-2 mt-2 '>             {/* Bill Details  */}
                                <p className='  font-semibold '>Bill Details</p>
                                <div className=''>
                                    <div className='flex justify-between text-gray-500 text-sm'>
                                        <p>Item Total</p>
                                        <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {itemsTotal}</p>
                                    </div>
                                    <div className='flex justify-between text-gray-500 text-sm'>
                                        <p>Delivery Fee</p>
                                        <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {deliveryFee}</p>
                                    </div>

                                    <div className='border-b-2 my-2'></div>

                                    <div className='flex justify-between text-gray-500 text-sm'>
                                        <p>Delivery Tip</p>
                                        <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {deliveryTip}</p>
                                    </div>
                                    {/* <div className='flex justify-between text-gray-500 text-sm'>
                                    <p>GST and Restaurant Charges</p>
                                    <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {gst}</p>
                                </div> */}

                                    <div className='border-b-2 my-2 border-black pt-3'></div>

                                    <div className='flex justify-between text-gray-500 text-sm'>
                                        <p className='text-black font-semibold text-base'>To Pay</p>
                                        <p><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' /> {deliveryFee + deliveryTip + itemsTotal}</p>
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
                                        <div className='flex flex-col gap-6 px-10 py-10 relative'>
                                            <div className='absolute w-9 h-9 bg-[#282C3F] top-8 -left-6 flex justify-center items-center rounded-md'>
                                                <CiLogin className='text-white text-2xl' />
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <p className='font-display font-semibold text-gray-700 text-xl'>Logged In</p>
                                                <MdVerified className={`text-${greenTextColor} text-xl`} />
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
                                                    <p className={`text-xs text-${greenTextColor}`}>Already have an account ?</p>
                                                    <p className={`text-sm text-${greenTextColor} font-semibold`}>LOG IN</p>
                                                </button>
                                                <button
                                                    className={`flex flex-col items-center  px-6 py-2 border-2 border-green-400 bg-${greenTextColor} w-32 md:w-48`}
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
                            isLoggedIn && <UserAddresses
                                setIsAddressSelected={setIsAddressSelected}
                                selectedAddress={selectedAddress}
                                setSelectedAddress={setSelectedAddress}
                            />
                        }
                        {
                            selectedAddress !== null && <AddPhoneNumber phoneNoExists={phoneNoExists} setPhoneNoExists={setPhoneNoExists} />
                        }
                        {
                            isLoggedIn && phoneNoExists ? (
                                <div className={`flex gap-2 bg-white py-10 xl:px-14 lg:px-8 px-4 relative mb-4 ${isAddressSelected ? 'visible' : 'invisible'} `}>
                                    <div className=' flex flex-col gap-4 w-full '>
                                        <div className='absolute w-9 h-9 bg-[#282C3F] top-8 -left-6 flex justify-center items-center rounded-md'>
                                            <IoLocationOutline className='text-white text-2xl' />
                                        </div>
                                        <p className='font-display font-bold text-gray-700 text-lg -mt-2'>Payment</p>

                                        <Link to="/payment" state={selectedAddress}>
                                            <button
                                                className={`w-full bg-${greenTextColor} py-3 mt-3 text-white font-bold font-roboto tracking-wide`}
                                            // onClick={ }
                                            >
                                                PROCEED TO PAY
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )

                                : null
                        }
                    </div>
                </div>


            </div >
        )
}

export default Cart