import { IoIosArrowDown } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import {  CiLocationOn } from 'react-icons/ci';
import { Link, Outlet, useNavigate } from "react-router-dom";
import {  useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toggleSearchBar, toggleLogin, openLoginInSlider } from "../utils/toggleSlice";
import LoginSlider from "./LoginSlider";
import {  setLoggedout } from "../utils/userLoginSlice";
import UserType from "../interfaces/User";
import axiosInstance from "../config/AxiosInstance";
import { useAppSelector } from "../utils/hooks";
import { motion} from 'framer-motion'


const Navbar = () => {

    const navItems = [
        {
            name: 'Search',
            icon: <IoIosSearch className="text-xl" />,
            path: '/search'
        }, {
            name: 'Signin',
            icon: <IoPersonOutline className="text-xl" />,
            path: '/signin'
        }, {
            name: 'Cart',
            icon: <IoCartOutline className="text-xl" />,
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


    // const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // const { visible, setVisible } = useContext(Visibility);
    const visible = useAppSelector(state => state.toggleSlice.searchToggle);
    const cartData = useAppSelector(state => state.cartSlice.cartItems);
    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);
    const userData: UserType | null = useAppSelector(state => state.loginSlice.userData);
    const showLoginSlider = useAppSelector(state => state.toggleSlice.loginToggle);
    const [isHovered, setIsHovered] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const toggleVisible = () => {
        // setVisible(!visible);
        dispatch(toggleSearchBar());
    }

    // @ts-ignore
    const logout = async () => {

        console.log('logging out');
        // @ts-ignore
        const logoutResponse = await axiosInstance.post("/auth/logout");        // to delete the cookies
        dispatch(setLoggedout());
        console.log('auth token removed');
        navigate('/');
        navigate(0);        //for refreshing page
    }

    const openLoginPopup = () => {
        dispatch(openLoginInSlider());
        dispatch(toggleLogin());
    }


    // On page load, we check if authToken is present in localstorage, if not present or invalid token is present, we delete the token from
    // localstorage and set userLoginSlice as false(logged out).
    // useEffect(() => {
    //     console.log('authToken check running on page loading');
    //     const authToken = cookies.auth_token;
    //     if (!authToken) {
    //         console.log('auth token not present');
    //         dispatch(setLoggedout());
    //     }
    //     else {
    //         axios.get(process.env.BACKEND_URL + 'api/user/userData', {
    //             headers: {
    //                 'Authorization': `Bearer ${authToken}`
    //             }
    //         })
    //             .then(response => {
    //                 // console.log('Data:', response.data);
    //                 dispatch(setLoggedIn());
    //                 const userData = {
    //                     "fullName": response.data?.fullName,
    //                     "email": response.data?.email,
    //                     "role": response.data?.user_role,
    //                     "uid": response.data?.uid,
    //                     "imageUrl": response.data?.imageUrl,
    //                     "phoneNumber": response.data?.phoneNumber
    //                 } as UserType

    //                 dispatch(setUserData({ userData: userData }));
    //             })
    //             .catch(error => {
    //                 console.error('auth token removed', error);
    //                 if (error.response.status === 401) {
    //                     setCookie('auth_token', '');
    //                     setCookie('refresh_token', '');
    //                     dispatch(setLoggedout());
    //                 }
    //             })
    //     };
    // }, [])


    const navItemForSignIn = (navItem: { name: string, icon: JSX.Element, path: string }) => {

        return isLoggedIn ?
            (
                <div key={navItem.name}>



                    <div className="group relative py-2"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >

                        <div className="flex items-center gap-3 md:gap-7 justify-between  bg-white px-4 cursor-pointer">
                            <div>{navItem.icon}</div>
                            <div className="menu-hover my-2 py-2 font-medium text-black text-sm md:text-base" >
                                {userData?.fullName}
                            </div>
                        </div>

                        {/* :before properties generate the arrow on top */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}   // Start hidden & slightly above
                            animate={isHovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}  // Smooth transition
                            className="absolute invisible group-hover:visible  mt-1 bg-white shadow-lg rounded-md w-52 px-6 py-3  text-black 
                                border-t-2 border-orange-500
                                before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-full       
                                before:border-[10px] before:border-transparent before:border-b-orange-500 
                                transition-all duration-300 ">

                            <ul className="pl-3">
                                <Link to='/profile'>
                                    <li className="hover:text-orange-500 cursor-pointer mt-4 text-gray-800 font-bold font-cabin">Profile</li>
                                </Link>
                                <Link to='/profile'>
                                    <li className="hover:text-orange-500 cursor-pointer mt-4 text-gray-800 font-bold font-cabin">Orders</li>
                                </Link>
                                {/* <li className="hover:text-orange-500 cursor-pointer">Swiggy One</li> */}
                                <Link to='/profile'>
                                    <li className="hover:text-orange-500 cursor-pointer mt-4 text-gray-800 font-bold font-cabin">Favourites</li>
                                </Link>
                                <Link to='/'>
                                    <li className="hover:text-orange-500 cursor-pointer mt-4 pb-4 text-gray-800 font-bold font-cabin" onClick={logout}>Logout</li>
                                </Link>
                            </ul>
                        </motion.div>


                    </div >
                </div>

            ) :
            (
                <div className="flex items-center gap-1 cursor-pointer" onClick={openLoginPopup}>
                    {navItem.icon}
                    <p className='hidden xs:block text-sm md:text-base text-gray-600 font-semibold'>{navItem.name}</p>
                </div>
            )
    }

    return (
        <div className="relative ">
            {showLoginSlider && <LoginSlider />}

            {/* <SaveDeliveryAddress /> */}
            {
                // for slider on left side
                <div className="w-full">
                    <div className={`w-full bg-black/50 h-full absolute ${visible ? 'visible' : 'invisible'}`} onClick={toggleVisible} ></div>
                    <div className={`bg-white h-full   z-50 absolute  transition-all ease-in duration-300 flex justify-end ${!visible ? 'w-0 ' : 'w-[600px]'} `}>
                        <div className={visible ? 'visible flex mr-12 flex-col' : 'invisible'}>
                            <div>
                                <p className=" w-fit my-7 cursor-pointer text-xl text-gray-600" onClick={toggleVisible} >
                                    <RxCross1 />
                                </p>
                            </div>
                            <input type='text' className="border-2 p-5 focus:outline-none focus:shadow-md mt-2 w-96 h-12" placeholder={'Search for area, city.....'} />

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






            <div className='w-full h-20 shadow-xl flex items-center justify-center sticky top-0 bg-white z-30'>
                <div className=' w-full sm:w-[70%] flex justify-between items-center p-3 '>
                    <div className='flex items-center'>
                        <div className='h-[80px] w-[80px]'>
                            <Link to="/">
                                <img
                                    src='./src/assets/urban_eats_logo.png'      //swiggy icon

                                />
                            </Link>
                        </div>
                        <div className="flex items-center justify-between gap-3 hover:cursor-pointer"
                            onClick={toggleVisible}
                        >
                            <p className='font-bold border-b-2  border-black'>Other</p>
                            <IoIosArrowDown cursor={"pointer"} color='orange' className='mt-1 text-lg' />
                        </div>
                    </div>
                    <div className="flex gap-7 items-center">
                        {                                                                                               //navbar items
                            navItems.map(navItem => (
                                <div key={navItem.name}>
                                    {
                                        navItem.name === 'Signin' ?
                                            navItemForSignIn(navItem) :

                                            <Link to={navItem.path} key={navItem.name} >
                                                <div className="flex items-center gap-1 cursor-pointer" >
                                                    {navItem.icon}
                                                    <p className='hidden xs:block text-sm md:text-base font-semibold text-gray-600'>{navItem.name}</p>
                                                    {navItem.name === 'Cart' && cartData?.length > 0 ?
                                                        <p className="mb-3 text-xs">{cartData.reduce((total, val) => total + (val?.quantity ?? 0), 0)}</p> :
                                                        null
                                                    }
                                                </div>
                                            </Link>
                                    }

                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar