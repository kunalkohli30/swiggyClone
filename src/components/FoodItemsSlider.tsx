import axios from 'axios'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";


import React, { useEffect, useRef, useState } from 'react'
const FoodItemsSlider = ({data}: {data: any | undefined}) => {

    const [foodTypesList, setFoodTypesList] = useState<{ imageId: string | undefined, id: string }[]>([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('foods item slider ue ');
        setFoodTypesList(data?.data?.data?.cards[0]?.card?.card?.imageGridCards?.info);
    }, [data]);

    const handlePrev = () => {
        const left = sliderRef.current?.scrollLeft;
        if (left && left >= 320) {
            sliderRef.current?.scrollTo({
                left: left - 320,
                behavior: 'smooth'
            });
        }
    }
    const handleNext = () => {
        const left = sliderRef.current?.scrollLeft;
        if (left != undefined) {
            sliderRef.current?.scrollTo({
                left: left + 320,
                behavior: 'smooth'
            });
        }
        console.log('scrollWidth: ', sliderRef.current?.scrollWidth, 'current', sliderRef.current?.scrollLeft);
    }
    const saveScrollPosition = () => {
        const scrollLeft = sliderRef?.current?.scrollLeft;
        if (scrollLeft)
            setSliderPosition(scrollLeft);
    }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-2xl text-gray-900 pl-4'>What's on your mind?</h1>
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
                    <div className={`flex  duration-300`}>
                        {
                            foodTypesList?.map(item => (
                                <img
                                  key={item?.id}
                                    src={`https://media-assets.swiggy.com/swiggy/image/upload/${item?.imageId}`}
                                    className='w-40'
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodItemsSlider