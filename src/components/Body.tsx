import axios from 'axios'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";


import React, { useEffect, useRef, useState } from 'react'
import FoodItemsSlider from './FoodItemsSlider';
import TopRestaurants from './TopRestaurants';
import DeliveringRestaurants from './DeliveringRestaurants';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { RestaurantDto } from '../interfaces/apiModels/RestaurantList';
import HomePageShimmer from './Skeleton/HomePageShimmer';
import axiosInstance from '../config/AxiosInstance';

const Body = () => {

    const selectedFilters = useSelector(state => state.filterSlice.selectedFilters);        //searrch or filter data based on the filters selected by user on home screen 

    const [homePageData, setHomePageData] = useState<{ data: any | undefined }>();
    const [restaurantList, setRestaurantList] = useState([] as RestaurantDto[]);
    const [cookies, setCookie] = useCookies(['auth_token', 'refresh_token']);

    const authToken = cookies.auth_token;

    const fetchData = async () => {
        const result = await axios.get("https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.65200&lng=77.16630&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
        // const listOfFoodTypes = result?.data?.data?.cards[0]?.card?.card?.imageGridCards?.info;
        const data = await axiosInstance.get("/api/public/restaurant/getAll")
        setRestaurantList(data.data);
        setHomePageData(result);
    }

    // useEffect(() => console.log('restaurant get all api response', restaurantList), [restaurantList]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='w-full mt-6 min-h-screen '>
            {restaurantList.length ? (
                <div className='w-[90%] lg:w-[80%] mx-auto overflow-x-hidden'>
                    <FoodItemsSlider />
                    <hr className='mt-10' />
                    <TopRestaurants data={homePageData} restaurantLis={restaurantList} />
                    <hr className='mt-10' />
                    <DeliveringRestaurants data={homePageData} restaurantLis={restaurantList} />
                </div>
            ) : (
                <HomePageShimmer />
            )}
        </div>
    )
}

export default Body