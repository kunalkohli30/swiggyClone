import { useEffect, useState } from 'react'
import FoodItemsSlider from './FoodItemsSlider';
import TopRestaurants from './TopRestaurants';
import DeliveringRestaurants from './DeliveringRestaurants';
import { RestaurantDto } from '../interfaces/apiModels/RestaurantList';
import HomePageShimmer from './Skeleton/HomePageShimmer';
import axiosInstance from '../config/AxiosInstance';

const Body = () => {

    // const selectedFilters = useAppSelector(state => state.filterSlice.selectedFilters);        //searrch or filter data based on the filters selected by user on home screen 

    const [restaurantList, setRestaurantList] = useState([] as RestaurantDto[]);

    const fetchData = async () => {
        // const listOfFoodTypes = result?.data?.data?.cards[0]?.card?.card?.imageGridCards?.info;
        const data = await axiosInstance.get("/api/public/restaurant/getAll")
        setRestaurantList(data.data);
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
                    <TopRestaurants restaurantLis={restaurantList} />
                    <hr className='mt-10' />
                    <DeliveringRestaurants restaurantLis={restaurantList} />
                </div>
            ) : (
                <HomePageShimmer />
            )}
        </div>
    )
}

export default Body