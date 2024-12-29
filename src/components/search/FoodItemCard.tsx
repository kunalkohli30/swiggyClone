import React, { useState } from 'react'
import { FoodDto, RestaurantDto } from '../../interfaces/apiModels/RestaurantList'
import { FaArrowRight } from 'react-icons/fa6'
import { IoIosStar } from 'react-icons/io'
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdKeyboardArrowRight } from 'react-icons/md';
import PlusMinusQuantityBtn from '../PlusMinusQuantityBtn';
import FoodDetailsCard from './FoodDetailsCard';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { setShowFoodDetailsCard } from '../../utils/toggleSlice';
import { Link } from 'react-router-dom';

interface iProps {
    foodItem: FoodDto;
    restaurantData: RestaurantDto | undefined;
    quantity: number;
    handleAddToCart: (foodItem: FoodDto) => void;
    setFoodItemForDetailsPopup: React.Dispatch<React.SetStateAction<FoodDto | null>>;
}

const FoodItemCard = ({ foodItem, restaurantData, quantity, handleAddToCart, setFoodItemForDetailsPopup }: iProps) => {


    // console.log(foodItem.imageId ? 'food image:' + foodItem.imageId : null);
    // const [showDetails, setShowDetails] = useState<null | FoodDto>(null);

    const restaurantMenuPath = `${restaurantData?.name}-${restaurantData?.locality}-${restaurantData?.locality}-${restaurantData?.id}`;

    const dispatch = useAppDispatch();
    const showFoodDetailsCard = useAppSelector(state => state.toggleSlice.foodDetailsCardPopUp);

    return (
        <div className='w-full rounded-2xl bg-white flex flex-col p-5'>

            {/* upper part of card - restaurant details */}
            <Link to={`/restaurantMenu/${restaurantMenuPath}`}>
                <div className='flex flex-row justify-between items-center border-b-2 border-dotted pb-4 text-sm font-cabin  text-gray-500 cursor-pointer'>
                    <div className='flex flex-col gap-1'>
                        <p className='font-semibold'>{restaurantData?.name}</p>
                        <div className='flex flex-row items-center gap-1'>
                            <span className=''><IoIosStar /></span>
                            <p className='text-xs'>{restaurantData?.avgRatingString} 30-35 MINS</p>
                        </div>
                    </div>
                    <div>
                        <FaArrowRight className='text-2xl font-normal' />
                    </div>
                </div>
            </Link>
            {/* lower part of card - food item details*/}
            <div className='flex justify-between mt-5'>
                <div className='w-2/5 flex flex-col gap-1'>
                    <img src={foodItem.vegetarian ? vegIcon : nonVegIcon} className='w-5 h-5 rounded-lg' />
                    <p className='font-semibold font-roboto text-sm lg:text-lg text-gray-700 leading-4 lg:leading-6'>{foodItem.name}</p>
                    <p className='-mt-1 font-semibold text-gray-700'><FontAwesomeIcon icon={faIndianRupeeSign} className='text-sm  pr-[2px]' />{foodItem.price / 100}</p>
                    <div
                        onClick={() => {
                            // setShowDetails(foodItem);
                            setFoodItemForDetailsPopup(foodItem);
                            dispatch(setShowFoodDetailsCard(true));
                        }}
                        className='rounded-2xl mt-8 px-2 py-1 flex flex-row gap-1 border-2 border-gray-300 w-fit cursor-pointer bg-gray-50'
                    >
                        <p className='text-xs text-nowrap font-semibold text-gray-600'>More details</p>
                        <MdKeyboardArrowRight />
                    </div>
                </div>
                <div>
                    <img
                        src={foodItem.imageId}
                        className='w-28 h-28  lg:w-40 lg:h-44 rounded-xl '
                    />
                    <div className='border-2 border-slate-200 mx-auto w-[70%]  py-1
                                                   flex items-center justify-center -mt-5
                                                 bg-white z-10 relative rounded-xl font-extrabold text-green-600 text-sm tracking-tighter font-display'
                    >
                        {
                            quantity === 0 ?
                                <p onClick={() => handleAddToCart(foodItem)}>ADD</p> :
                                <PlusMinusQuantityBtn
                                    foodId={foodItem?.id}
                                    image={foodItem?.imageId}
                                    name={foodItem?.name}
                                    totalPrice={foodItem?.price / 100}
                                    isVeg={foodItem?.vegetarian}
                                />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FoodItemCard