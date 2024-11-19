import React, { useContext } from 'react'
import { cartContext } from '../context/contextApi';
import { fetchSwiggyImagesDomainPath } from '../StandardConstants';
import vegIcon from '../assets/icons8-veg-48.png';
import nonVegIcon from '../assets/icons8-non-veg-50.png';
import PlusMinusQuantityBtn from './PlusMinusQuantityBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../utils/cartSlice';


// We can store the image url in cartData context or directly fetch it from api using foodId.
// Implementing the first approach as not having any api from swiggy for fetching food  name, image using foodId
const Cart = () => {

    // const { cartData, setCartData } = useContext(cartContext);
    const cartData = useSelector(state => state.cartSlice.cartItems);
    const resInfo = useSelector(state => state.cartSlice.resInfo);
    const dispatch = useDispatch();

    const cssPropertiesToRemoveOverflowingText = {
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitLineClamp': '1',
        'WebkitBoxOrient': 'vertical'
    }

    return (
        <div className="bg-gray-200 w-full h-screen">
            <div className='w-[70%] mx-auto pt-10 flex gap-7'>
                <div className='w-[40%] bg-white'>
                    <div className='flex flex-col gap-4 p-4'>
                        <div className='flex gap-2  items-center ' >       {/*  restaurant image and name   */}
                            <img src={fetchSwiggyImagesDomainPath + "f8phnr3jembfcgbqyhls"} className='w-12 h-12 min-w-12' />
                            <div className='flex-col font-semibold'>
                                <p style={{ ...cssPropertiesToRemoveOverflowingText }}>Burger Singh (Big Punjabi Burgers at your doorstep)</p>     {/* //use api to fetch restaurant details    */}
                                <p className='text-sm text-gray-500 font-cabin font-light tracking-wide'>Rajouri Garden</p>
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
                                        <h2 className='font-display text-xs lg:text-sm text-gray-700 text-wrap min-w-20 lg:min-w-32 xl:min-w-40 '>{cartItem?.name}</h2>
                                        <div className='w-20 border-2 border-wid border-gray-200'>
                                            <PlusMinusQuantityBtn
                                                foodId={cartItem?.foodId}
                                                imageId={cartItem?.image}
                                                name={cartItem?.name}
                                                price={cartItem?.totalPrice}
                                                isVeg={cartItem?.isVeg}
                                            />
                                        </div>
                                        <h2 className='text-gray-500 text-xs tracking-wider text-nowrap'><FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] lg:pr-[2px]' /> {cartItem?.totalPrice * cartItem?.quantity}</h2>
                                        {/* <img                                                        //food items image 
                                        src={fetchSwiggyImagesDomainPath + cartItem?.image}
                                        className='w-32 h-32 rounded-2xl  z-10 relative'
                                    /> */}

                                    </div>
                                ))
                            }
                        </div>

                        <div className='w-full border-dotted border-b-gray-600 border-b-2 mt-12'></div>

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
                <div className='bg-white w-full min-h-screen'>
                    <div className='pt-4'>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default Cart