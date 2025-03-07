import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../utils/hooks';
import UserType from '../../interfaces/User';
import { FaBagShopping } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import OrderComponent from './OrderComponent';
import { ExistingOrdersDto } from '../../interfaces/apiModels/OrderDto';
import axiosInstance from '../../config/AxiosInstance';
import Favourites from './Favourites';
import { motion, AnimatePresence } from 'framer-motion'

const OrdersPage = () => {

    // const bgColor = '[#37718E]'
    const bgColor = '[#ab7171]'
    const leftMenuBgColor = '[#EDF1F7]';
    const textColor = '[#282C3F]';

    const userData: UserType | null = useAppSelector(state => state.loginSlice.userData);
    const [orders, setOrders] = useState<ExistingOrdersDto[] | null>(null);

    const tabs: [{ name: 'Orders' | 'Favourites' | 'Addresses', icon: any }] = [
        { name: 'Orders', icon: <FaBagShopping className=' text-white ' /> },
        { name: 'Favourites', icon: <FaHeart className=' text-white ' /> },
        { name: 'Addresses', icon: <MdLocationPin className=' text-white ' /> }
    ];

    const [selectedTab, setSelectedTab] = useState<'Orders' | 'Favourites' | 'Addresses'>('Orders');

    const capitalizeInitials = (name: string | undefined): string => {
        return name ? name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
    };

    const fetchOrders = () => {
        axiosInstance.get('api/order')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.log('error fetching orders', error);
                alert('error fetching orders');
            })
    }

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const [scrolledBelow, setScrolledBelow] = useState(false);
    useEffect(() => {
        const checkScroll = () => {
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                setScrolledBelow(rect.top < -65);     //rect.top is used to identify relative scroll  position
            }
        };

        window.addEventListener("scroll", checkScroll);
        return () => window.removeEventListener("scroll", checkScroll);
    }, []);

    return (
        <AnimatePresence>
            <div className={`pt-6 transition-colors duration-200 ${scrolledBelow ? '' : 'bg-[#ab7171]'}   pb-[10%] `} ref={divRef}>
                <div className={`w-[80%] mx-auto  `}>
                    <div className='py-5' >
                        <div className={`flex flex-col gap-1 justify-start ${scrolledBelow ? 'fixed  transition-colors  ease-linear -translate-y-full opacity-0 animate-slideIn bg-[#ab7171] h-24 py-4 px-40 top-0 left-0 w-full z-50 ' : ''}`}>     {/* user name, email and number*/}
                            <p className='text-4xl text-bold font-roboto text-white font-bold'>{capitalizeInitials(userData?.fullName)}</p>
                            <div className='text-white font-roboto  flex gap-12'>
                                <p>{userData?.email}</p>
                                <p>{userData?.phoneNumber ? userData?.phoneNumber : '9999999999'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white p-10 flex '>
                        <div className={`md:visible w-[300px] lg:[450px] bg-[#EDF1F7]  flex flex-col py-4 pl-4 `}>

                            {tabs.map(tab => (

                                <div
                                    // initial={{ opacity: 0, scale: 0.9 }}
                                    // animate={{ opacity: 1, scale: 1 }}
                                    // exit={{ opacity: 0, scale: 0.9 }}
                                    // transition={{ duration: 0.3 }}
                                    key={tab.name}
                                    className={`flex justify-start items-center gap-5 pl-4 pr-0 py-7 hover:scale-105 cursor-pointer ${selectedTab === tab.name ? 'bg-white' : ''} `}
                                    onClick={() => setSelectedTab(tab.name)}
                                >
                                    <div className={`flex justify-center items-center rounded-full bg-[#282C3F] w-8 h-8 ${selectedTab !== tab.name ? 'opacity-85' : ''}`}>
                                        {tab.icon}
                                    </div>
                                    <p className={`font-semibold text-${textColor} lg:text-lg font-display ${selectedTab !== tab.name ? 'opacity-85' : ''} `}>{tab.name}</p>
                                </div>

                            ))}

                        </div>
                        <div className='hidden flex flex-col gap-6 py-4'>
                            {tabs.map(tab => (
                                <div className='' key={tab.name}>
                                    <div className={`flex justify-center items-center rounded-full bg-[#282C3F] w-8 h-8 ${selectedTab !== tab.name ? 'opacity-85' : ''}`}>
                                        {tab.icon}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedTab === 'Orders' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className='p-9 h-full flex flex-col gap-6 w-full '
                            >
                                <p className={`text-2xl font-bold font-cabin text-${textColor}`}>Past Orders</p>
                                {
                                    orders?.length ?
                                        orders.map(order => (
                                            <OrderComponent key={order.orderId} order={order} />
                                        )) :
                                        <p className='text-lg font-roboto text-gray-500'>No orders placed yet</p>
                                }
                            </motion.div>
                        )}
                        {selectedTab === 'Favourites' && <Favourites />}
                    </div>
                </div>
            </div>
        </AnimatePresence>
    )
}

export default OrdersPage