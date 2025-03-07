import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/AxiosInstance';
import { cartItemResponse, UpdateCartModel } from '../../interfaces/apiModels/CartDtos';
import { FoodDto, RestaurantDto } from '../../interfaces/apiModels/RestaurantList';
import { IoIosArrowBack } from 'react-icons/io';
import FoodItemCard from './FoodItemCard';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { clearCart, resInfo, setCartItemData, setRestaurantInfo, updateQuantityInState } from '../../utils/cartSlice';
import { AxiosError } from 'axios';
import ItemsAlreadyInCartPopup from '../Menu/ItemsAlreadyInCartPopup';
import FoodDetailsCard from './FoodDetailsCard';
import { IoSearch } from 'react-icons/io5';

const Search = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchItems, setSearchItems] = useState<FoodDto[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [restaurantMap, setRestaurantMap] = useState<Map<number, RestaurantDto> | null>(null);
    const [itemToAddToCartAfterPopupIsClosed, setItemToAddToCartAfterPopupIsClosed] = useState<FoodDto | null>(null);
    const [foodItemForDetailsPopup, setFoodItemForDetailsPopup] = useState<FoodDto | null>(null);


    const dispatch = useAppDispatch();

    const { cartItems, resInfo } = useAppSelector(state => state.cartSlice);
    const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);

    const fetchDishes = async (query: string) => {
        const searchResponse = await axiosInstance.get('/api/public/food/search?keyword=' + query);
        if (searchResponse.status === 200) {
            setSearchItems(searchResponse.data);

        }
    }

    useEffect(() => {
        axiosInstance.get("/api/public/restaurant/getAll")
            .then(response => {
                const restaurantData: RestaurantDto[] = response.data;
                let map = new Map<number, RestaurantDto>();
                restaurantData.forEach(res => map.set(res.id, res));
                setRestaurantMap(map);
            })
    }, []);

    const getQuantity = (foodItem: FoodDto) => {
        const filteredItems = cartItems.filter(cartitem => cartitem.foodId === foodItem.id);
        return filteredItems.length === 0 ? 0 : filteredItems[0].quantity;
    }

    const handleAddtoCart = (foodItem: FoodDto) => {

        // console.log('test', resInfo?.restaurantId, restaurantData.id)
        if (resInfo !== null && resInfo?.restaurantId !== foodItem.restaurantId) {       //If an item from different restaurant, open popup 
            setShowPopup(true);
            setItemToAddToCartAfterPopupIsClosed(foodItem);                                     // Sets the item to be added to cart when popup is closed with yes 
        } else {
            addItemToCart(foodItem);        // if another item is ordered from same restaurant, just add it to cart
        }
    }

    const addItemToCart = async (foodItem: FoodDto | null) => {
        console.log('addtocart', foodItem, resInfo);

        if (resInfo === null) {          // if resInfo.restaurantId is blank then set it to current restaurant's id
            // console.log('inside if', restaurantData, resInfo);
            const restaurantData = await axiosInstance.get(`/api/public/restaurant/${foodItem?.restaurantId}`);
            dispatch(setRestaurantInfo(
                {
                    restaurantId: restaurantData?.data.id,
                    restaurantName: restaurantData?.data.name,
                    areaName: restaurantData?.data.areaName,
                    image: restaurantData?.data.imageId
                } as resInfo
            ))
        }

        if (isLoggedIn) {

            if (resInfo?.restaurantId !== foodItem?.restaurantId) {
                // clear the cart
                dispatch(clearCart());
            }

            axiosInstance.post("/api/cart/cartItem", {
                foodId: foodItem?.id,
                quantity: 1,
                operation: "ADD"
            } as UpdateCartModel
            ).then(response => {
                const data = response.data;
                dispatch(setCartItemData(data));
            }).catch((error: AxiosError) => {
                console.log('add item to cart api failed', error);
                if (error.status === 409) {

                }
            })
        } else {

            if (foodItem) {
                dispatch(updateQuantityInState({
                    foodId: foodItem?.id,
                    restaurantId: foodItem.restaurantId,     //couldnt find in swiggy api
                    quantity: 1,
                    totalPrice: foodItem?.price ? foodItem.price / 100 : 0,
                    foodItemName: foodItem?.name,
                    image: foodItem?.imageId,
                    isVeg: foodItem?.vegetarian,
                    operation: 'ADD'
                }))
            }
        }
    }

    const popularFoodItems = [
        'Burger',
        'Momos',
        'Pizza',
        'Rolls'
    ];

    const searchForPopularFoodItems = () => {
        return (
            <div className='mt-7 pl-3'>
                <p className='font-bold font-roboto '>Order from popular Items</p>
                <div className='-mt-1'>
                    {popularFoodItems.map(item => (
                        <div className='flex gap-4 items-center cursor-pointer' onClick={e => {setSearchQuery(item), fetchDishes(item)}}>
                            <IoSearch className='text-xl text-gray-700 font-semibold' />
                            <p className='text-gray-700 font-cabin text-lg  border-b-2 border-gray-100 py-3 w-full'>
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='w-[90%] md:w-[75%] xl:w-[65%] mx-auto mt-16'>
            <FoodDetailsCard foodItem={foodItemForDetailsPopup} handleAddtoCart={handleAddtoCart} />
            <div className='w-full  mx-auto  h-screen '>
                <div className='border-[2px] px-2 border-gray-200 outline-none w-full h-12 
                    flex flex-row justify-start items-center gap-4 rounded-md '
                >      {/* search bar */}
                    <button onClick={() => setSearchQuery("")}><IoIosArrowBack className='text-xl text-gray-800 font-semibold' /></button>
                    <input
                        type='text'
                        className='w-full h-full outline-none  font-display  font-semibold text-gray-800 
                            placeholder:font-medium placeholder:font-cabin placeholder:text-gray-500 placeholder:text-lg '
                        placeholder='Search for restaurants and food'
                        onChange={e => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        onBlur={e => fetchDishes(e.target.value)}
                    />
                </div>
                <div>           {/*  search results  */}
                    {
                        searchQuery.trim() === "" ? searchForPopularFoodItems() :
                            searchQuery !== "" && searchItems.length === 0 ? (
                                <div className=' mt-10 ml-4 text-sm font-display font-semibold text-gray-800'>
                                    No match found for "{searchQuery}"
                                </div>
                            ) : (
                                <div className='w-full bg-gray-100 h-full mt-6 border-t-2 border-gray-200 grid grid-cols-2 gap-5 px-4 py-4'>
                                    {
                                        searchItems.map(foodItem => (
                                            <div>
                                                <FoodItemCard
                                                    foodItem={foodItem}
                                                    restaurantData={restaurantMap?.get(foodItem.restaurantId)}
                                                    quantity={getQuantity(foodItem)}
                                                    handleAddToCart={handleAddtoCart}
                                                    key={foodItem.id}
                                                    setFoodItemForDetailsPopup={setFoodItemForDetailsPopup}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                    }
                </div>
            </div>

            <ItemsAlreadyInCartPopup showPopup={showPopup} setShowPopup={setShowPopup} addItemToCart={() => addItemToCart(itemToAddToCartAfterPopupIsClosed)} />
        </div>
    )
}

export default Search