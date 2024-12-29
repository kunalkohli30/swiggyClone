import React from 'react'

type discountDataType = {
    img: string,        //offerLogo
    header: string,     //header
    couponCode: string
}
const DealsCard = ({discountData}: {discountData: discountDataType}) => {

    // console.log('deals card', `https://media-assets.swiggy.com/swiggy/image/upload/${discountData?.img}`);
    return (
        <div className='rounded-2xl border-slate-200 border-2 min-w-[300px]'>
            <div className='flex items-center p-4 gap-4'>
                <img
                    className='w-12 h-12' 
                    src={discountData?.img} />
                <div className='flex flex-col justify-between'>
                    <h2 className='font-bold font-display tracking-tight '>{discountData?.header}</h2>
                    <h2 className='font-semibold text-gray-400 font-display text-sm'>{discountData?.couponCode ? discountData?.couponCode : "SWIGGYIT"}</h2>
                </div>
            </div>

        </div>
    )
}

export default DealsCard