import React from 'react'
import { OfferDto } from '../../interfaces/apiModels/RestaurantList'
import { RiDiscountPercentFill } from 'react-icons/ri'

type iProps = {
    appliedOffer: OfferDto;
    // setAppliedOffer: React.Dispatch<React.SetStateAction<OfferDto | null>>;
    getDiscountAmount: () => number | undefined;
    setShowCouponTooltip: React.Dispatch<React.SetStateAction<boolean>>;
}

const CouponAppliedTooltip = ({ appliedOffer, getDiscountAmount, setShowCouponTooltip }: iProps) => {
    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
            <div className='bg-slate-50 flex flex-col w-[350px] h-[300px] relative rounded-lg'>
                <div className='absolute -top-9 flex justify-center w-full '>
                    <RiDiscountPercentFill className='text-7xl text-orange-600 ' />
                </div>
                <div className=' flex flex-col items-center p-4 pt-10 rounded-lg'>
                    <p className='font-extrabold mb-4 text-zinc-600 font-roboto text-sm '>
                        <span className='text-xl font-cabin '>‘</span>
                        <span>{` ${appliedOffer.couponCode?.split(' ')[1]}`}</span>
                        <span className='text-xl font-cabin pl-[2px]'>’</span>
                        <span className='pl-2'>APPLIED</span>
                    </p>
                    <p className='text-5xl text-black font-bold font-display'>₹{getDiscountAmount()}</p>
                    <p className='font-bold text-sm -mt-1 font-cabin tracking-wide'>savings with this coupon</p>
                    <div className='w-5 h-[2px] mt-4 bg-gray-700 '></div>
                    <p className='text-zinc-500 font-semibold text-sm text-center px-6 mt-4'>PARTY on with big savings every time you order</p>
                </div>

                <div className='mt-auto w-full pb-0 h-14 border-t-2 border-gray-300'>
                    <button
                        className='w-full h-full text-orange-500 text-lg  font-bold font-display` px-4 py-2 rounded-lg mx-auto'
                        onClick={() => setShowCouponTooltip(false)}
                    >
                        YAY!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CouponAppliedTooltip