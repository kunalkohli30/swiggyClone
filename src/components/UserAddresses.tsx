import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showAddressSlider } from '../utils/toggleSlice';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { address } from './SaveDeliveryAddress';
import { GoHome } from 'react-icons/go';
import { MdAddLocationAlt, MdWorkOutline } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import { auth } from '../config/firebaseAuth';

const UserAddresses = () => {

    const greenTextColor = '[#60b246]';

    const [cookies, setCookie] = useCookies(['auth_token', 'refresh_token']);
    const isLoggedIn = useSelector(state => state.loginSlice.isLoggedIn);
    const isAddressSliderVisible = useSelector(state => state.toggleSlice.showAddressSlider);
    const authToken = cookies.auth_token;
    const dispatch = useDispatch();

    const [userAddresses, setUserAddresses] = useState(null as address[] | null);

    useEffect(() => {
        if (isLoggedIn && cookies.auth_token && !isAddressSliderVisible) {
            axios.get(process.env.BACKEND_URL + 'api/user/address', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
                .then((resp) => {
                    // console.log('user adrs', resp.data)
                    setUserAddresses(resp.data);
                });
        }
    }, [cookies.auth_token, isLoggedIn, isAddressSliderVisible]);

    return (
        <div className='flex gap-2 bg-white p-6 '>
            <div className=' flex flex-col gap-4 w-full'>
                <p className='font-display font-semibold text-gray-700 text-base'>Choose a delivery address</p>
                <p className='font-display  text-gray-400 text-sm'>Multiple addresses in this location</p>

                <div className='  w-full grid md:grid-cols-2 gap-4 h-full'>
                    
                    {
                        userAddresses?.map(adr => (
                            <div className=' flex flex-col gap-1 p-3 pl-9 lg:pl-16 flex-1 items-start relative
                                             border border-gray-200 border-dotted  hover:shadow-2xl hover:scale-105  '>
                                {
                                    adr.addressName === 'Home' ? <GoHome className='absolute left-3 lg:left-7 lg:top-5 top-4 text-lg' /> :
                                        adr.addressName === 'Work' ? <MdWorkOutline className='absolute left-3 lg:left-7 lg:top-5 top-4 text-lg' /> :
                                            <IoLocationSharp className='absolute left-3 top-4 text-lg lg:left-7 lg:top-5' />
                                }
                                <p className='font-cabin font-semibold text-gray-900 text-lg'>{adr.addressName}</p>
                                <p className='font-roboto text-gray-400 text-xs tracking-tighter '>
                                    {`${adr.flatNo}, ${adr.street}`}
                                </p>
                                <p className='font-roboto text-gray-400 text-xs tracking-tighter -mt-1'>
                                    {`${adr.city}, ${adr.pinCode}`}
                                </p>
                                <div className='flex gap-3 mt-4 -ml-4 md:ml-0 pb-4'>
                                    <button className={`bg-${greenTextColor} p-2  text-white hover:scale-95 text-nowrap`}>Deliver Here</button>
                                    <button
                                        className={`text-lg border-2 border-${greenTextColor} p-2 text-${greenTextColor}
                                                    hover:bg-[#6eb246] hover:text-white hover:scale-90`}
                                    >
                                        <FaRegEdit />
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    <div className=' border-dotted border-2 border-gray-200 flex flex-col gap-7  p-4 hover:shadow-2xl hover:scale-105 relative pl-9 lg:pl-16'>
                        <MdAddLocationAlt className='absolute left-3 lg:left-7 lg:top-5 top-4' />
                        <p className='font-display font-semibold text-gray-600 tracking-wide'>Add New Address</p>
                        <button
                            className={`px-5 py-2 text-${greenTextColor} border-[1px] border-${greenTextColor} w-32 font-semibold text-sm `}
                            onClick={() => dispatch(showAddressSlider())}
                        >
                            ADD NEW
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserAddresses