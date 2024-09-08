import axios from 'axios'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";


import React, { useEffect, useRef, useState } from 'react'
import FoodItemsSlider from './FoodItemsSlider';
import TopRestaurants from './TopRestaurants';
import DeliveringRestaurants from './DeliveringRestaurants';

const Body = () => {

    const [homePageData, setHomePageData] = useState<{data: any | undefined}>();

    const fetchData = async () => {
        const result = await axios.get("https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.65200&lng=77.16630&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
        // const listOfFoodTypes = result?.data?.data?.cards[0]?.card?.card?.imageGridCards?.info;
        setHomePageData(result);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='w-full mt-6 '>
            <div className='w-[90%] lg:w-[80%] mx-auto overflow-x-hidden'>
                <FoodItemsSlider data = {homePageData}/>
                <hr className='mt-10'/>
                <TopRestaurants data = {homePageData}/>
                <hr className='mt-10'/>
                <DeliveringRestaurants data={homePageData} />
            </div>
        </div>
    )
}

export default Body