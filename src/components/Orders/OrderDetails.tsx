import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { RxCross1 } from 'react-icons/rx';
import { ExistingOrdersDto } from '../../interfaces/apiModels/OrderDto';
import { GoHome, GoLocation } from 'react-icons/go';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { IoMdCheckmark } from 'react-icons/io';
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';

type iProps = {
    showOrderDetails: boolean;
    setShowOrderDetails: React.Dispatch<React.SetStateAction<boolean>>;
    order: ExistingOrdersDto
}

const OrderDetails = ({ showOrderDetails, setShowOrderDetails, order }: iProps) => {

    const createdAtDate = new Date(order.createdAt);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const createdAt = createdAtDate.toLocaleDateString('en-US', options);

    // console.log((order.orderItems.map(item => item.totalPrice)).reduce((total, itemTotal) => total + itemTotal, 0))
    return (
        <AnimatePresence>
            {showOrderDetails && <motion.div

                initial={{ x: "0%" }}
                animate={{ x: showOrderDetails ? "0%" : "100%" }}
                transition={{ type: "tween", stiffness: 100 }}
                className='fixed right-0 top-[80px] w-screen h-screen bg-black/50 '

            // className='fixed right-0 top-0 w-screen h-screen bg-black/50 '
            >
                <div className='w-[450px] h-screen bg-white absolute top-0 right-0 rounded-l-lg ' >
                    <div className='flex flex-col gap-4 px-8 py-5 overflow-hidden'>
                        <div className='flex gap-6 items-center'>
                            <RxCross1 className='font-extrabold text-2xl cursor-pointer' onClick={() => setShowOrderDetails(false)} />
                            <div className=''>
                                <p className=' font-bold  text-lg'>Order #{order.orderId}</p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className="flex gap-4 items-center">
                                <GoLocation className='text-3xl' />
                                <div className="flex flex-col ">
                                    <p className="font-cabin font-semibold text-lg">{order.restaurantName}</p>
                                    <p className="text-xs font-roboto text-gray-400 -mt-1">{order.restaurantLocality}</p>
                                </div>
                            </div>
                            <div className='pl-[14px] w-1 h-7 border-r-2 border-dashed border-gray-300'></div>
                            <div className="flex gap-4 items-center -mt-2">
                                {
                                    order.addressName === 'Home' ?
                                        <GoHome className='text-3xl' /> :
                                        order.addressName === 'Work' ? <IoBriefcaseOutline className='text-3xl' /> :
                                            <GoLocation className='text-3xl' />
                                }
                                <div className="flex flex-col justify-start ">
                                    <p className="font-cabin font-semibold text-lg ">{order.addressName}</p>
                                    <p className="text-xs font-roboto text-gray-400 -mt-1">{order.deliveryAddress}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-[90%] h-1 border-t-2  border-gray-200  left-[10%] relative '></div>
                        <div className='flex gap-4 items-center '>
                            <IoMdCheckmark className='text-lg text-green-600' />
                            <p className='font-display text-gray-600 text-xs'>{`Delivered on ${createdAt}`}</p>
                        </div>
                        <div className='h-1 border-t-[1px]  border-gray-700 -mt-2'></div>
                        <div className='flex flex-col -mt-2 pb-5 border-b-[1px] border-dashed border-gray-300 mt-3'>
                            <p className='font-bold text-lg font-cabin '>Order Summary</p>
                            <p className='text-sm text-gray-600 font-cabin mt-3 mb-1'>{order.totalItem} ITEMS</p>
                            {
                                order.orderItems.map(orderItem => (
                                    <div className="flex justify-between relative mt-1">
                                        <img src={orderItem.foodItemVeg ? vegIcon : nonVegIcon} className='absolute w-3 h-3 top-1 -left-5' />
                                        <p className='text-sm font-bold font-cabin'>{orderItem.foodItemName} x {orderItem.quantity}</p>
                                        <p className='text-sm font-semibold text-gray-600'>₹ {orderItem.totalPrice}</p>
                                    </div>
                                ))
                            }

                        </div>
                        <div className='-mt-3 flex flex-col gap-1 pb-4 border-b-[1px]  border-black'>
                            <div className="flex  justify-between mb-2">
                                <p className='font-display font-semibold text-sm'>Item Total</p>
                                <p className='font-cabin text-sm text-gray-600'>₹ {(order.orderItems.map(item => item.totalPrice)).reduce((total, itemTotal) => total + itemTotal, 0)}</p>
                            </div>
                            <div className='flex  justify-between'>
                                <p className='font-cabin font-semibold text-gray-600 text-sm'>Delivery Charges</p>
                                <p className='font-cabin text-sm text-gray-600'>₹ {order.deliveryFee}</p>
                            </div>
                            <div className='flex  justify-between'>
                                <p className='font-cabin font-semibold text-gray-600 text-sm'>Delivery Tip</p>
                                <p className='font-cabin text-sm text-gray-600'>₹ {order.deliveryTip}</p>
                            </div>
                            <div className='flex  justify-between'>
                                <p className='font-cabin font-semibold text-gray-600 text-sm'>Discount</p>
                                <p className='font-cabin text-sm text-gray-600'>- ₹ {order.discountAmount}</p>
                            </div>
                            <div className='flex  justify-between'>
                                <p className='font-cabin font-semibold text-gray-600 text-sm'>Taxes </p>
                                <p className='font-cabin text-sm text-gray-600'>₹ {order.gstAndFees}</p>
                            </div>
                        </div>
                        <div className='flex  justify-between -mt-4'>
                            <p className='font-roboto font-semibold text-gray-700 text-sm'>Paid Via {order.paymentMethod === 'UPI' ? 'UPI' : 'Credit/Debit card'} </p>
                            <p className='font-display text-sm font-bold text-gray-800'>BILL TOTAL</p>
                            <p className='font-cabin text-sm text-gray-600'>₹ {order.totalAmount}</p>
                        </div>
                        {/* <div className='flex justify-center mt-4'>
                        <div className='bg-green-500 text-white font-semibold font-display text-lg px-4 py-2 rounded-lg'>
                            REORDER
                        </div>
                    </div> */}
                    </div>
                </div >
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default OrderDetails