import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showAddressSlider, showAdrSlider } from '../../utils/toggleSlice';
import { useCookies } from 'react-cookie';
import SaveDeliveryAddress, { address } from './SaveDeliveryAddress';
import { GoHome } from 'react-icons/go';
import { MdAddLocationAlt, MdWorkOutline } from 'react-icons/md';
import { IoLocationOutline, IoLocationSharp } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import axiosInstance from '../../config/AxiosInstance';
import { useAppSelector } from '../../utils/hooks';
import { FaCircleCheck } from 'react-icons/fa6';
import { AnimatePresence } from 'framer-motion';

type iProps = {
    setIsAddressSelected: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAddress: address | null;
    setSelectedAddress: React.Dispatch<React.SetStateAction<address | null>>;
}

const UserAddresses = ({ setIsAddressSelected, selectedAddress, setSelectedAddress }: iProps) => {

    const greenTextColor = '[#60b246]';

    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);
    const isAddressSliderVisible = useAppSelector(state => state.toggleSlice.showAddressSlider);
    const showAddressSlider = useAppSelector(state => state.toggleSlice.showAddressSlider);
    const dispatch = useDispatch();

    const [userAddresses, setUserAddresses] = useState(null as address[] | null);


    const getAddresses = () => {
        if (isLoggedIn) {
            axiosInstance.get("api/user/address")
                .then((resp) => {
                    setUserAddresses(resp.data);
                });
        }
    }
    useEffect(() => {
        getAddresses();
    }, [showAddressSlider]);

    const handleDelete = (adrId: number) => {
        axiosInstance.delete("/api/user/address/" + adrId)
            .then(res => getAddresses())
            .catch(error => { alert('validation failed while deleting user address'); console.log('validation failed while deleting user address', error) })
    }

    const displayUserAddresses = () => {
        return (

            <div className='flex gap-2 bg-white py-10 xl:px-14 lg:px-8 px-4 relative'>
                <AnimatePresence>
                    {showAddressSlider && <SaveDeliveryAddress />}
                </AnimatePresence>
                <div className=' flex flex-col gap-4 w-full '>
                    <div className='absolute w-9 h-9 bg-[#282C3F] top-8 -left-6 flex justify-center items-center rounded-md'>
                        <IoLocationOutline className='text-white text-2xl' />
                    </div>
                    <p className='font-display font-semibold text-gray-700 text-base'>Choose a delivery address</p>
                    <p className='font-display  text-gray-400 text-sm'>Multiple addresses in this location</p>

                    <div className=' '>
                        <div className=' w-full grid lg:grid-cols-2 gap-4 h-full'>
                            {
                                userAddresses?.map(adr => (
                                    <div className=' flex flex-col gap-1 p-3 pl-12 lg:pl-14 flex-1 items-start relative 
                                             border border-gray-200 border-dotted  hover:shadow-2xl hover:scale-105  '

                                    >
                                        {
                                            adr.addressName === 'Home' ? <GoHome className='absolute left-3  lg:top-4 top-4 text-2xl' /> :
                                                adr.addressName === 'Work' ? <MdWorkOutline className='absolute left-3 lg:top-4 top-4 text-2xl' /> :
                                                    <IoLocationSharp className='absolute left-3 top-4 text-2xl  lg:top-4' />
                                        }
                                        <p className='font-bold text-gray-800 text-xl font-cabin  tracking-wide'>{adr.addressName}</p>
                                        <p className='font-cabin text-gray-600 text-sm '>
                                            {`${adr.formattedGoogleAddress}`}
                                        </p>
                                        {/* <p className='font-roboto text-gray-400 text-xs  -mt-1'>
                                            {`${adr.city}, ${adr.pinCode}`}
                                        </p> */}
                                        {/* <div className='flex gap-3 mt-8 -ml-4 lg:-ml-8 xl:-ml-8 pb-4'> */}
                                        {/* <button className={`bg-[#60b246] p-2  text-white hover:scale-95 text-nowrap lg:text-base`}
                                                onClick={() => {
                                                    setSelectedAddress(adr);
                                                    setIsAddressSelected(true);
                                                }}
                                            >
                                                Deliver Here
                                            </button>
                                            <button
                                                className={`text-lg border-2 border-[#60b246] p-2 text-[#60b246]
                                                    hover:bg-[#6eb246] hover:text-white hover:scale-90`}
                                            >
                                                <FaRegEdit />
                                            </button> */}
                                        <div className='flex gap-8 mt-6 '>
                                            <button className='font-bold font-cabin font-xs text-orange-600 hover:text-black'
                                                onClick={() => {
                                                    setSelectedAddress(adr);
                                                    setIsAddressSelected(true);
                                                }}
                                            >
                                                Deliver Here
                                            </button>
                                            <button className='font-bold font-cabin font-xs text-orange-600 hover:text-gray-800 z-4 0'
                                                onClick={() => adr.userAddressId && handleDelete(adr.userAddressId)}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                        {/* </div> */}
                                    </div>
                                ))
                            }
                            <div className=' border-dotted border-2 border-gray-200 flex flex-col gap-7  p-4 hover:shadow-2xl hover:scale-105 relative pl-9 xl:pl-16'>
                                <MdAddLocationAlt className='absolute left-3 xl:left-7 xl:top-5 top-4' />
                                <p className='font-display font-semibold text-gray-600 tracking-wide'>Add New Address</p>
                                <button
                                    className={`px-5 py-2 text-${greenTextColor} border-[1px] border-${greenTextColor} w-32 font-semibold text-sm `}
                                    onClick={() => dispatch(showAdrSlider())}
                                >
                                    ADD NEW
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    const displaySelectedAddress = () => {
        return (
            <div
                className='flex flex-col justify-start bg-white px-10 py-4 pb-10 relative cursor-pointer'
                onClick={() => {
                    setSelectedAddress(null);
                    setIsAddressSelected(false);
                }}
            >
                <div className='absolute w-9 h-9 bg-[#282C3F] top-8 -left-6 flex justify-center items-center rounded-md'>
                    <IoLocationOutline className='text-white text-2xl' />
                </div>
                <div className='flex justify-between items-center mt-6 '>
                    <div className='flex sm:gap-2 items-center'>
                        <p className='text-gray-800 font-semibold text-xl font-display text-wrap w-24 md:w-full '>Delivery Address</p>
                        <FaCircleCheck className={`text-${greenTextColor} text-lg`} />
                    </div>
                    <p className='font-roboto text-orange-500 font-semibold'>CHANGE</p>
                </div>
                <div className='mt-8'>
                    <p className='font-cabin font-bold text-lg text-gray-800'>{selectedAddress?.addressName}</p>
                </div>

                <p className='font-roboto text-gray-600 text-xs w-[400px]'>{`${selectedAddress?.formattedGoogleAddress} `}</p>
                {/* <p className='font-display text-gray-500 text-xs'>{`${selectedAddress?.city}, ${selectedAddress?.pinCode}`}</p> */}

            </div>
        )
    }

    return (
        <div className=''>
            {selectedAddress == null ? displayUserAddresses() : displaySelectedAddress()}
        </div>
    )
}

export default UserAddresses