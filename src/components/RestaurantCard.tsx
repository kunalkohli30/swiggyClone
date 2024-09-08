import restaurant from '../interfaces/restaurant'
import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { GoDotFill } from 'react-icons/go';
import { Link } from 'react-router-dom';

type iProps = {
    restaurantData: restaurant;
    usedFrom: number;
}
const RestaurantCard = ({ restaurantData, usedFrom }: iProps) => {
    const restaurantMenuPath: string | undefined =
        restaurantData.cta.link     //initially we receive a string like - "https://www.swiggy.com/city/delhi/chinese-wok-patel-nagar-kirti-nagar-metro-rest655882"
            .split('/')             // then we split it on the basis of '/' and take out the last index
            .at(-1)?.split('-')     // then we get something like chinese-wok-patel-nagar-kirti-nagar-metro-rest655882 but we need to remove rest from last index and jsut provide the restaurant id
            .slice(0, -1)           // So we split it again on '-' and remove the last index, we are already having id from restaurantData, we append it at end
            .join('-');

    const cssPropertiesToRemoveOverflowingText = {
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitLineClamp': '1',
        'WebkitBoxOrient': 'vertical'
    }

    const discountHeader = restaurantData?.info?.aggregatedDiscountInfoV3?.header ? restaurantData?.info?.aggregatedDiscountInfoV3?.header : '';
    const discountSubHeader = restaurantData?.info?.aggregatedDiscountInfoV3?.subHeader ? restaurantData?.info?.aggregatedDiscountInfoV3?.subHeader : '';

    return (

        <Link to={`/restaurantMenu/${restaurantMenuPath}-${restaurantData?.info?.id}`}>
            <div className='w-[100%] hover:scale-95 cursor-pointer'>
                <div className='relative w-full '>   {/* div for image and discount */}
                    <img
                        key={restaurantData?.info.id}
                        src={`https://media-assets.swiggy.com/swiggy/image/upload/${restaurantData?.info.cloudinaryImageId}`}
                        className={`max-w-xl ${usedFrom === 1 ? 'w-[150px] md:w-[273px]' : 'w-full'} aspect-4/3 max-h-[180px] object-cover rounded-xl`}
                    />
                    <div className='absolute right-0 left-0 bottom-0 h-[40px] md:h-[82px] rounded-2xl bg-gradient-to-t from-gray-950 from-20% flex items-end px-3 '>
                        <p className='text-slate-200 font-extrabold text-sm  md:text-xl w-full  font-sans tracking-tighter'>
                            {`${discountHeader} ${discountSubHeader}`}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col pl-2 pt-2'>       {/* Div for restaurant name, delivery time and cuisines */}
                    <p className='font-bold text-lg tracking-tight font-display' style={{ ...cssPropertiesToRemoveOverflowingText }}>{restaurantData?.info?.name}</p>
                    <div className='flex gap-1 items-center -mt-1'>
                        <div className='flex items-center gap-1'>
                            <div className='rounded-full bg-green-700'>
                                <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                    <FaStar className=' rounded-full p-1' />
                                </IconContext.Provider>
                            </div>
                            <p className='font-normal text-lg'>4.2</p>
                        </div>
                        <GoDotFill className='text-xs' />
                        <p className='font-semibold text-lg tracking-tight font-display'>
                            {restaurantData?.info?.sla?.slaString}
                        </p>
                    </div>
                    <p
                        className='text-slate-600 font-normal font-serif'
                        style={cssPropertiesToRemoveOverflowingText}>
                        {restaurantData.info.cuisines.map(cuisine => cuisine + ', ')}
                    </p>
                    <p className='text-slate-600 font-serif text-lg'>{restaurantData?.info?.areaName}</p>
                </div>
            </div>
        </Link>
    )
}

export default RestaurantCard