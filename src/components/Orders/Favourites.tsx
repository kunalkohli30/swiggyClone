import { useEffect, useState } from 'react'
import axiosInstance from '../../config/AxiosInstance'
import { favoriteRestaurantResponse } from '../../interfaces/apiModels/RestaurantList'
import { IconContext } from 'react-icons'
import { FaHeart, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Favourites = () => {

    const [favoriteRestaurants, setFavoriteRestaurants] = useState<favoriteRestaurantResponse[] | null>(null);

    useEffect(() => {
        axiosInstance.get('api/restaurant/favorites')
            .then(response => setFavoriteRestaurants(response.data))
    }, [])

    const removeFromFavorites = (restaurantId: number) => {
        axiosInstance.delete(`api/restaurant/favorites?restaurantId=${restaurantId}`)
            .then(response => setFavoriteRestaurants(response.data))
    }

    const cssPropertiesToRemoveOverflowingText = {
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitLineClamp': '2',
        WebkitBoxOrient: 'vertical' as 'vertical' // Explicitly cast to correct type
    }


    if (favoriteRestaurants?.length === 0)
        return (
            <div className='w-full h-full ml-8 mt-16'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    // className="restaurant-card"
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaHeart className="text-gray-400 text-6xl mb-4" />
                        <p className="text-gray-600 text-xl">You have no favorite restaurants yet.</p>
                        <p className="text-gray-500">Browse and add your favorite restaurants to see them here.</p>
                    </div>
                </motion.div>
            </div>
        )
    else
        return (
            <div className='w-full h-full min-h-screen ml-8 grid grid-flow-row lg:grid-cols-2 gap-16 '>
                <AnimatePresence>
                    {favoriteRestaurants && favoriteRestaurants.map(resData => (

                        <motion.div
                            key={resData.restaurantId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="restaurant-card"
                        >

                            <div className="max-w-sm  rounded-lg shadow-sm bg-gray-800 border-gray-700 relative">
                                <FaHeart className='absolute top-6 right-6 text-red-500 text-2xl cursor-pointer' onClick={() => removeFromFavorites(resData.restaurantId)} />
                                <div className='bg-white border-t-2 border-l-2 border-r-2  border-gray-200 rounded-t-lg px-5 pt-3 pb-1'>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{resData.name}</h5>
                                    <p className="mb-3 font-normal text-gray-700  -mt-3 text-sm">{resData.areaName}</p>
                                </div>

                                <img className=" w-full h-[180px] object-cover" src={resData.imageId} alt="" />

                                <div className="p-5">
                                    <div className='flex justify-between mb-3'>

                                        <p className='text-white font-bold font-cabin'>{resData.costForTwo}</p>
                                        <div className='flex justify-between'>

                                            <div className='flex items-center gap-2 '>
                                                <div className='rounded-full bg-slate-300'>
                                                    <IconContext.Provider value={{ color: 'rgb(55 65 81)', size: '20px' }}>
                                                        <FaStar className='p-[3px]' />
                                                    </IconContext.Provider>
                                                </div>
                                                <p className='font-cabin font-bold text-white  '>{resData.avgRatingString}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"
                                        style={cssPropertiesToRemoveOverflowingText}
                                    >
                                        Cuisines offered - {resData?.cuisines?.join(', ')}
                                    </p>
                                    <Link
                                        to={`/restaurantMenu/${encodeURIComponent(resData.name)}-${encodeURIComponent(resData.locality)}-${encodeURIComponent(resData.locality)}-${encodeURIComponent(resData.restaurantId)}`}
                                        className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center  rounded-lg focus:ring-4 focus:outline-none  bg-emerald-500 hover:bg-green-600 focus:ring-blue-800"
                                    >
                                        Order Now
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>


                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )
}

export default Favourites