import {useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import RestaurantCard from './RestaurantCard';
import { RestaurantDto } from '../interfaces/apiModels/RestaurantList';


const TopRestaurants = ({ restaurantLis }: {  restaurantLis: RestaurantDto[] }) => {

    // const [restaurantList, setRestaurantList] = useState<restaurant[]>([]);
    // const [restaurantLis, setRestaurantLis] = useState<Res[]>([]);
    const [_sliderPosition, setSliderPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     setRestaurantList(data?.data?.data?.cards[1].card.card?.gridElements?.infoWithStyle?.restaurants);
    // }, [data]);

    // useEffect(() => {
    //     // console.log('restaurantList', restaurantList);
    // }, [restaurantList]);

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
                            restaurantLis?.map(item => (
                                <RestaurantCard restaurantData={item} key={item?.id} usedFrom={1}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopRestaurants