import { IoIosArrowDown, IoMdHelpCircleOutline } from "react-icons/io";
import { IoBagOutline, IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { CiDiscount1, CiLocationOn } from 'react-icons/ci';
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { cardContext, cartContext, Visibility } from "../context/contextApi";
import { RxCross1 } from "react-icons/rx";
import { cartItemType } from '../context/contextApi'
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar } from "../utils/toggleSlice";



const Navbar = () => {

    const navItems = [
        {
            name: 'Swiggy Corporate',
            icon: < IoBagOutline />,
            path: '/corporate'
        }, {
            name: 'Search',
            icon: <IoIosSearch />,
            path: '/search'
        }, {
            name: 'Offers',
            icon: <CiDiscount1 />,
            path: '/offers'
        }, {
            name: 'Help',
            icon: <IoMdHelpCircleOutline />,
            path: '/help'
        }, {
            name: 'Signin',
            icon: <IoPersonOutline />,
            path: '/signin'
        }, {
            name: 'Cart',
            icon: <IoCartOutline />,
            path: '/cart'
        }
    ];

    const locations = [{
        name: 'Rajouri Garden',
        locality: 'West Delhi, Delhi'
    }, {
        name: 'Connaught Place',
        locality: 'Central Delhi, Delhi'
    }, {
        name: 'IGI Airport',
        locality: 'Delhi'
    }, {
        name: 'Dwarka',
        locality: 'West Delhi, Delhi'
    }, {
        name: 'Saket',
        locality: 'South Delhi, Delhi'
    }, {
        name: 'Shahdara',
        locality: 'East Delhi, Delhi'
    }]

    // const { visible, setVisible } = useContext(Visibility);
    const visible = useSelector(state => state.toggleSlice.searchToggle);
    const cartData = useSelector(state => state.cartSlice.cartItems);
    const dispatch = useDispatch();

    const toggleVisible = () => {
        // setVisible(!visible);
        dispatch(toggleSearchBar());
    }

    // const { cartData, setCartData } = useContext(cartContext);
    useEffect( () => console.log(cartData), [cartData]);
    return (
        <div className="relative">

            {
                // visible &&
                <div className="w-full">
                    <div className={`w-full bg-black/50 h-full absolute ${visible ? 'visible' : 'invisible'}`} onClick={toggleVisible} ></div>
                    <div className={`bg-white h-full   z-50 absolute  transition-all ease-in duration-300 flex justify-end ${!visible ? 'w-0 ' : 'w-[600px]'} `}>
                        <div className={visible ? 'visible flex mr-12 flex-col' : 'invisible'}>
                            <div>
                                <p className=" w-fit my-7 cursor-pointer text-xl text-gray-600" onClick={toggleVisible} >
                                    <RxCross1 />
                                </p>
                            </div>
                            <input type='text' className="border-2 p-5 focus:outline-none focus:shadow-2xl mt-2 w-96 h-12" placeholder={'Search for area, city.....'} />

                            <div className="flex flex-col ">
                                {locations && locations.map(location =>
                                    <div className="pl-4 flex gap-4 mt-6 w-full hover:text-orange-600" key={location.name}>
                                        <CiLocationOn className="text-2xl" />
                                        <div className="flex flex-col border-dotted border-b-2 pb-5 border-gray-300 w-full mr-2 ">
                                            <p className="font-semibold text-gray-800 hover:text-orange-600">{location.name}</p>
                                            <p className="text-sm text-gray-500">{location.locality}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    {/* <div className="w-full" onClick={toggleVisible}></div> */}

                </div>
            }
            <div className='w-full h-24 shadow-md flex items-center justify-center'>
                <div className=' w-[70%] flex justify-between items-center'>
                    <div className='flex items-center'>
                        <Link to="/">
                            <img
                                src='https://i.pinimg.com/originals/b3/8a/a1/b38aa1b21050b0e769a97eb751d12829.png'
                                className='h-20 w-20'
                            />
                        </Link>
                        <div className="flex items-center justify-between gap-3 hover:cursor-pointer"
                            onClick={toggleVisible}
                        >
                            <p className='font-bold border-b-2  border-black'>Other</p>
                            <IoIosArrowDown cursor={"pointer"} color='orange' className='mt-1 text-lg' />
                        </div>
                    </div>
                    <div className='flex gap-7'>
                        {navItems.map(navItem => (
                            <Link to={navItem.path} key={navItem.name}>
                                <div className="flex items-center gap-1 cursor-pointer" >
                                    {navItem.icon}
                                    <p className='text-base text-gray-600'>{navItem.name}</p>
                                    {navItem.name === 'Cart' && cartData?.length > 0 ?
                                        <p className="mb-3 text-xs">{cartData.reduce((total, val) => total + val.quantity, 0)}</p> :
                                        null
                                    }
                                </div>
                            </Link>
                        ))}

                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar