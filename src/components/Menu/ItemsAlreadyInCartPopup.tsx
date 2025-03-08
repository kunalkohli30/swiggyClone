import React from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../utils/cartSlice';

const ItemsAlreadyInCartPopup = ({ showPopup, setShowPopup, addItemToCart }:
    { showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>>, addItemToCart: () => void }) => {

    // const cartData = useAppSelector(state => state.cartSlice.cartItems);
    const dispatch = useDispatch();

    const resetCartAndClosePopup = () => {
        // setCartData([]);
        dispatch(clearCart());
        setShowPopup(false);
        addItemToCart();
    }

    return (
        <div className={`${!showPopup ? 'hidden' : ''} fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-end pb-20 z-40 `}>
            <div className="bg-white  w-[400px] lg:w-[500px] h-48 p-4 border-4 border-gray-300 flex flex-col rounded-xl shadow-lg"
            // style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}
            >
                <p className='text-lg font-semibold font-display'>Items already in cart</p>
                <p className='text-gray-500 leading-5 text-xs font-display my-1'>Your cart contains items from other restaurant. Would you like to reset your cart for adding items from this restaurant?</p>
                <div className='flex justify-between gap-4 mt-6'>
                    <button
                        className='w-1/2 border-2 border-green-600 text-green-600 py-2 rounded-md font-cabin font-bold text-lg'
                        onClick={() => setShowPopup(false)}
                    >
                        No
                    </button>
                    <button
                        className='w-1/2 bg-green-600 text-white py-2 rounded-md font-cabin font-bold text-lg'
                        onClick={() => resetCartAndClosePopup()}
                    >
                        Yes, Start Afresh
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ItemsAlreadyInCartPopup