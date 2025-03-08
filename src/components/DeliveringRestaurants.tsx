import RestaurantCard from './RestaurantCard';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch } from 'react-redux';
import { updateFilter } from '../utils/filterSlice';
import { RestaurantDto } from '../interfaces/apiModels/RestaurantList';
import { useAppSelector } from '../utils/hooks';

const DeliveringRestaurants = ({  restaurantLis }: {  restaurantLis: RestaurantDto[] }) => {

    // const [restaurantList, setRestaurantList] = useState<restaurant[]>([]);

    // const [selectedFilters, setSelectedFilters] = useState([] as string[]);

    const selectedFilters = useAppSelector(state => state.filterSlice.selectedFilters);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     setRestaurantList(data?.data?.data?.cards[1].card.card?.gridElements?.infoWithStyle?.restaurants);
    // }, [data]);


    const filterOptions = [
        {
            'filterId': 'ratingAbove4',
            'name': 'Ratings 4.0+'
        },
        {
            'filterId': 'pureVeg',
            'name': 'PureVeg'
        },
        {
            'filterId': 'under300',
            'name': 'Less than Rs.300'
        },
        {
            'filterId': '300to600',
            'name': 'Rs.300 - Rs.600'
        },
        {
            'filterId': 'fastDelivery',
            'name': 'Fast Delivery'
        },
    ]

    const toggleFilterSelection = (filterId: string) => {
        dispatch(updateFilter(filterId));
        // if (selectedFilters.includes(filterId))
        //     setSelectedFilters(selectedFilters.filter(id => id != filterId));
        // else
        //     setSelectedFilters([...selectedFilters, filterId]);
    }

    return (
        <div>
            <div className='mt-16'>
                <div >
                    <h1 className='font-bold font-display tracking-tight text-2xl text-gray-900 pl-2 pb-4'>
                        Top restaurant chains in Delhi
                    </h1>
                </div>
                <div className='flex gap-3 mb-6'>
                    {
                        filterOptions.map(filter => (
                            <button key={filter.filterId}
                                className={`px-3 py-1 w-fit rounded-3xl font-cabin font-semibold text-sm shadow-md flex items-center gap-2
                                    ${selectedFilters?.includes(filter.filterId) ? 'border-gray-800 border-[1px] bg-gray-300' : 'border-2 border-gray-200'}`}
                                onClick={() => toggleFilterSelection(filter.filterId)}
                            >
                                {filter.name}
                                {selectedFilters?.includes(filter.filterId) ? <RxCross2 className='text-lg' /> : null}
                            </button>
                        ))
                    }
                </div>
                <div>
                    <div  >
                        <div className={`grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-5`}>
                            {
                                restaurantLis?.map(item => (
                                    <div className='' key={item?.id}>
                                        <RestaurantCard restaurantData={item} key={item?.id} usedFrom={2} />
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