import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import restaurant from '../interfaces/restaurant';
import RestaurantCard from './RestaurantCard';


const TopRestaurants = ({ data }: { data: any | undefined }) => {

    const [restaurantList, setRestaurantList] = useState<restaurant[]>([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setRestaurantList(data?.data?.data?.cards[1].card.card?.gridElements?.infoWithStyle?.restaurants);
    }, [data]);

    useEffect(() => {
        console.log('restaurantList', restaurantList);
    }, [restaurantList]);

    const saveScrollPosition = () => {
        const scrollLeft = sliderRef?.current?.scrollLeft;
        if (scrollLeft)
            setSliderPosition(scrollLeft);
    }

    const handlePrev = () => {

    }

    const handleNext = () => {

    }

    return (
        <div className='mt-16'>
            <div className='flex items-center justify-between '>
                <h1 className='font-bold font-display tracking-tight text-2xl text-gray-900 pl-2 pb-4'>Top restaurant chains in Delhi</h1>
                <div className='flex gap-2 '>
                    <div onClick={handlePrev}>
                        <FaArrowLeft className='rounded-full bg-gray-200 w-9 h-9 p-2 cursor-pointer' />
                    </div>
                    <div onClick={handleNext}>
                        <FaArrowRight className='rounded-full  bg-gray-200 w-9 h-9 p-2 cursor-pointer' />
                    </div>
                </div>
            </div>
            <div>
                <div className={`overflow-x-auto no-scrollbar `} ref={sliderRef} onScroll={saveScrollPosition}>
                    <div className={`flex  duration-300 gap-5 `}>
                        {
                            restaurantList?.map(item => (
                                <RestaurantCard restaurantData={item} key={item?.info?.id} usedFrom={1}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopRestaurants