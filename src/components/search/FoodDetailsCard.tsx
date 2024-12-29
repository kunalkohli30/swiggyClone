import React, { KeyboardEvent, useEffect } from 'react'
import { FoodDto } from '../../interfaces/apiModels/RestaurantList'
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { RxCross2 } from 'react-icons/rx';
import { setShowFoodDetailsCard } from '../../utils/toggleSlice';
import PlusMinusQuantityBtn from '../PlusMinusQuantityBtn';

const FoodDetailsCard = ({ foodItem, handleAddtoCart }: { foodItem: FoodDto | null, handleAddtoCart: (foodItem: FoodDto) => void }) => {
    console.log('show details rendered for', foodItem?.name);

    const dispatch = useAppDispatch();
    const showFoodDetailsCard = useAppSelector(state => state.toggleSlice.foodDetailsCardPopUp);
    const cartData = useAppSelector(state => state.cartSlice.cartItems);


    const showAddButton = (foodItem: FoodDto) => {
        if (!cartData || cartData.filter((cartItem: cartItemType) => cartItem.foodId === foodItem?.id).length === 0)
            return true;
    }

    const handleAddClick = () => {
        console.log("fooditem", foodItem);
        if (foodItem !== null) {
            handleAddtoCart(foodItem);
            dispatch(setShowFoodDetailsCard(false));
        }
    }


    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                dispatch(setShowFoodDetailsCard(false));
            }
        }
        window.addEventListener("keydown", handleEsc);

        // Cleanup the event listener on unmount
        return () => {
            console.log('unmounted')
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    if (!foodItem)
        return null;

    return (
        <div className={`${showFoodDetailsCard ? 'visible' : 'invisible'}`}>
            <div className={`fixed  top-0 left-0 w-full h-screen z-30 bg-black opacity-70  `} ></div>
            <div className='flex justify-center items-center fixed top-0 left-0 h-screen w-screen z-40'>
                <div className=' relative w-[500px] h-[580px] bg-white rounded-3xl z-40'>
                    <div
                        className='absolute right-4 top-4 rounded-full p-1 cursor-pointer'
                        onClick={() => dispatch(setShowFoodDetailsCard(false))}
                    >
                        <RxCross2 className='text-xl text-gray-600' />
                    </div>
                    <img className='w-full h-[400px] object-fill rounded-t-3xl ' src={foodItem?.imageId} />
                    <div className='flex flex-col p-4'>         {/* div enclosing entire component below image - name, price, ....  and description*/}
                        <div className='flex flex-row justify-between items-center'>    {/* div for partition between name, price and add button  */}
                            <div className='flex flex-col'>     {/* div for veg/non-veg icon, name and price  */}
                                <img src={foodItem?.vegetarian ? vegIcon : nonVegIcon} className='w-5 h-5' />
                                <p className='font-roboto text-lg tracking-tight font-bold text-gray-700'>{foodItem?.name}</p>
                                <p className='font-roboto text-lg tracking-tight font-bold '>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='pr-[2px] text-base' />
                                    {foodItem?.price ? foodItem.price / 100 : null}
                                </p>
                            </div>
                            <div>
                                <button
                                    className='border-2 border-slate-200 py-1 px-8 mt-2 rounded-xl font-extrabold text-green-600 text-lg font-display'
                                    onClick={handleAddClick}
                                >
                                    {foodItem && showAddButton(foodItem) ? (
                                        <p>ADD</p>
                                    ) : (
                                        <PlusMinusQuantityBtn
                                            foodId={foodItem?.id}
                                            image={foodItem?.imageId}
                                            name={foodItem?.name}
                                            totalPrice={foodItem?.price / 100}
                                            isVeg={foodItem?.vegetarian}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        <p className='leading-5 font-cabin text-slate-600'>{foodItem?.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodDetailsCard