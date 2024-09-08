import React, { useEffect, useState } from 'react'
import restaurant from '../interfaces/restaurant';
import RestaurantCard from './RestaurantCard';

const DeliveringRestaurants = ({ data }: { data: any | undefined }) => {

    const [restaurantList, setRestaurantList] = useState<restaurant[]>([]);

    useEffect(() => {
        setRestaurantList(data?.data?.data?.cards[1].card.card?.gridElements?.infoWithStyle?.restaurants);
    }, [data]);

    return (
        <div>
            <div className='mt-16'>
                <div >
                    <h1 className='font-bold font-display tracking-tight text-2xl text-gray-900 pl-2 pb-4'>
                        Top restaurant chains in Delhi
                    </h1>
                </div>
                <div>
                    <div  >
                        <div className={`grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-5`}>
                            {
                                restaurantList?.map(item => (
                                    <div className='' key={item?.info?.id}>
                                        <RestaurantCard restaurantData={item} key={item?.info?.id} usedFrom={2} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveringRestaurants