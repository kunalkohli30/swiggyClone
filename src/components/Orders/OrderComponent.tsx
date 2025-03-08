import React, { useState } from 'react'
import { ExistingOrdersDto } from '../../interfaces/apiModels/OrderDto';
import OrderDetails from './OrderDetails';

export interface orderItemsType {
    foodItemName: string,
    quantity: number
}

interface OrderComponentProps {
    order: ExistingOrdersDto;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ order }: OrderComponentProps) => {

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

    const [showOrderDetails, setShowOrderDetails] = useState(false);

    return (
        <div className='border-2 border-gray-200 p-8 w-full'>
            <OrderDetails showOrderDetails={showOrderDetails} setShowOrderDetails={setShowOrderDetails} order={order}/>
            <div className='w-full border-b-2 border-dotted border-gray-300 pb-5 flex flex-col md:flex-row justify-between'>
                <div className="flex gap-5 justify-start h-full ">  {/*  image, location and timestamps */}
                    <div>   {/*  image */}
                        <img src={order.restaurantImageUrl}
                            className='w-36 h-24 object-cover'
                        />
                    </div>
                    <div className="flex flex-col items-start ">
                        <p className='text-xl text-gray-800 font-roboto'>{order.restaurantName} </p>
                        <p className='text-xs text-gray-600 font-display'>{order.restaurantLocality}</p>
                        <p className='text-xs text-gray-500 font-display mt-1'>ORDER #{order.orderId} | {createdAt}</p>
                        <p
                            className='text-orange-500 hover:text-black font-bold font-display  mt-2 cursor-pointer' onClick={() => setShowOrderDetails(true)}
                        >
                            VIEW DETAILS
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-6 flex justify-between flex-col lg:flex-row gap-5 lg:gap-0'>
                <div className='group'>
                    <div className=''>
                        {order.orderItems.map(orderItem => (
                            <span key={orderItem.foodId} className='text-sm font-cabin font-semibold pr-2'> {orderItem.foodItemName} x {orderItem.quantity} | </span>
                        ))}
                    </div>
                    {/* Tooltip */}
                    {/* <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2  group-hover:block bg-gray-800 text-white text-sm rounded-lg p-3 w-80 shadow-lg">
                        <p className="font-bold">{'order.restaurant'}</p>
                        <p className="text-gray-300 text-xs">{'order.date'}</p>
                        <hr className="my-2 border-gray-600" />
                        <ul className="text-xs">
                            {order.orderItems.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                    <span className='w-40'>{item.foodItemName}</span> <span>x{item.quantity}</span> <span>₹250</span>
                                </li>
                            ))}
                        </ul>
                        <hr className="my-2 border-gray-600" />
                        <p className="text-right font-bold">Total: ₹{order.totalAmount}</p>
                    </div> */}
                </div>

                <p className='text-xl text-orange-700 font-semibold font-cabin'>Total Paid: ₹{order.totalAmount}</p>
            </div>
        </div>
    )
}

export default OrderComponent