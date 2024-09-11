import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import vegIcon from '../../assets/icons8-veg-48.png';
import nonVegIcon from '../../assets/icons8-non-veg-50.png';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const MenuItemsList = ({ itemCards }) => {

    const fetchSwiggyImagesDomainPath = "https://media-assets.swiggy.com/swiggy/image/upload/";

    return (
        <div className='pt-2'>
            {itemCards && itemCards?.length &&
                itemCards?.map((item, index) => (
                    <div key={index} >
                        <div className='flex justify-between'>
                            <div className='flex flex-col w-3/4' >
                                <img
                                    className='w-4 h-4'
                                    src={item?.card?.info?.itemAttribute?.vegClassifier === "NONVEG" ? nonVegIcon : vegIcon}
                                />
                                <p className='font-bold text-[#414448] '>{item?.card?.info?.name}</p>
                                <div className='flex font-semibold font-roboto tracking-tighter'>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='text-xs mt-[5px] pr-[2px]' />{
                                        <p className='text-gray-900 text-sm'>{item?.card?.info?.price | item?.card?.info?.defaultPrice / 100}</p>
                                    }
                                </div>
                                <div className='pt-2'>
                                    <p className='text-gray-500 text-xs font-cabin'>{item?.card?.info?.description}</p>
                                </div>
                            </div>
                            <div className=' mb-6 relative'>
                                <img                                                        //food items image 
                                    src={fetchSwiggyImagesDomainPath + item?.card?.info?.imageId}
                                    className='w-32 h-32 rounded-2xl  z-10 relative'
                                />
                                <button className='border-2 border-slate-200 mx-auto w-[70%]  py-1
                                                   flex items-center justify-center -mt-5
                                                 bg-white z-50 relative rounded-xl font-extrabold text-green-600 text-sm tracking-tighter font-display'>
                                    ADD
                                </button>
                            </div>
                        </div>
                        {index !== itemCards.length-1 && <hr className='py-2'></hr>}
                    </div>
                ))
            }
        </div>
    )
}

export default MenuItemsList