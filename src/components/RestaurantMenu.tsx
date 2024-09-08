import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons'
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa'
import { GoDotFill } from 'react-icons/go';
import { MdDeliveryDining } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom'
import DealsCard from './DealsCard';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { IoIosArrowDown, IoIosArrowUp, IoMdArrowBack } from 'react-icons/io';
import { IoArrowForwardSharp, IoSearch, IoSearchOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import MenuItemCard from './MenuCategories';
import MenuCategories from './MenuCategories';
import SubMenu from './SubMenu';

type params = {
    id: number
}

type discountData = {
    info: {
        offerLogo: string,        //offerLogo
        header: string,     //header
        couponCode: string
    }
}

type openMenuType = {
    index: number,
    status: boolean
}

const RestaurantMenu = () => {

    const topDealsSliderRef = useRef<HTMLDivElement>(null);
    const [restaurantInfo, setRestaurantInfo] = useState<any>([]);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [discountData, setDiscountData] = useState<discountData[]>([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [openMenus, setOpenMenus] = useState<openMenuType[]>([]);

    const params = useParams() as { id: string };

    useEffect(() => {
        fetchMenu();
    }, [])

    const fetchMenu = async () => {
        const id = params.id.split('-').at(-1);
        const menu: any = await axios.get(`https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.65200&lng=77.16630&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`);
        console.log('menu', menu?.data?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR.cards);
        setRestaurantInfo(menu?.data?.data?.cards[2]?.card?.card?.info);
        setDiscountData(menu?.data?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers);
        var menuCategories: any[] = menu?.data?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR.cards;
        menuCategories = menuCategories.filter(m => m.title !== null && m.title !== "");
        setMenuData(menuCategories);
        setOpenMenus(Array(menuCategories.length).fill(null).map((x, i) => { return { index: i, status: true } }));
    }

    const handlePrev = () => {
        const left = topDealsSliderRef.current?.scrollLeft;
        if (left && left >= 320) {
            topDealsSliderRef.current?.scrollTo({
                left: left - 320,
                behavior: 'smooth'
            });
        }
    }
    const handleNext = () => {
        const left = topDealsSliderRef.current?.scrollLeft;
        if (left != undefined) {
            topDealsSliderRef.current?.scrollTo({
                left: left + 320,
                behavior: 'smooth'
            });
        }
        // console.log('scrollWidth: ', topDealsSliderRef.current?.scrollWidth, 'current', topDealsSliderRef.current?.scrollLeft);
    }
    const saveScrollPosition = () => {
        const scrollLeft = topDealsSliderRef?.current?.scrollLeft;
        if (scrollLeft)
            setSliderPosition(scrollLeft);
    }

    const handleToggleMenuCategory = (index) => {
        setOpenMenus(openMenus.map((menu, i) => i === index ? { index: i, status: !menu.status } : menu));
    }


    // console.log('del fee: ', restaurantInfo?.expectationNotifiers && restaurantInfo?.expectationNotifiers[0]?.enrichedText.split('|')[1]);
    console.log('restaurant menu rendered')
    return (
        <div className='w-full '>
            <div className="w-[55%]  mx-auto pt-8 ">
                <p className='font-cabin text-[10px] text-slate-500 font-semibold'>
                    <Link to={'/'} className='hover:text-slate-700 cursor-pointer'> Home </Link> /
                    <span className='hover:text-slate-700 cursor-pointer'> {restaurantInfo?.city} </span> /
                    <span className='text-slate-700 font-display'> {restaurantInfo?.name}</span>
                </p>

                <h1 className='text-2xl font-bold pt-5 pl-2'>{restaurantInfo?.name}</h1>

                {/* Restaurant details card */}
                <div className='w-full  h-[208px] rounded-b-[35px] mt-4
                bg-gradient-to-t from-gray-300 from-10%'>
                    <div className='p-4 rounded-[28px] bg-white w-[95%] h-[92%] mx-auto border-slate-200 border-2'>

                        {/* Ratings and cost for two */}
                        <div className='flex items-center gap-2'>
                            <div className='rounded-full w-5 bg-green-700'>
                                <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                    <FaStar className=' rounded-full p-1' />
                                </IconContext.Provider>
                            </div>
                            <p className='-mt-1 font-bold tracking-tighter'>{`${restaurantInfo?.avgRating} (${restaurantInfo?.totalRatingsString})`}</p>
                            <GoDotFill size={'7px'} className='text-gray-400' />
                            <p className='-mt-1 font-bold'>{restaurantInfo?.costForTwoMessage}</p>
                        </div>

                        {/* Cuisines */}
                        <div className='pt-1 pl-1'>
                            <p className='font-bold underline text-orange-600'>{restaurantInfo?.cuisines?.join(', ')}</p>
                        </div>

                        {/* outlet and delivery time */}
                        <div className='flex pt-4 pl-1 gap-3'>
                            <div className='w-2 flex flex-col items-center'>
                                <div className='w-[7px] h-[7px] bg-slate-300 rounded-full'></div>
                                <div className='w-[1.5px] h-[24px] bg-gray-300 rounded-full'></div>
                                <div className='w-[7px] h-[7px] bg-slate-300 rounded-full'></div>
                            </div>
                            <div>
                                <div className='flex flex-col gap-1 justify-between'>
                                    <div className='flex gap-2 -mt-1'>
                                        <p className='text-sm  font-bold'>Outlet</p>
                                        <p className='text-sm  font-roboto'>{restaurantInfo?.areaName}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm font-bold'>{restaurantInfo?.sla?.slaString}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='my-3 -mx-4'></hr>
                        <div className='flex gap-4 items-center'>
                            <MdDeliveryDining size={'30px'} />
                            <p className='text-gray-500 font-semibold text-sm -mt-1'>
                                {restaurantInfo?.expectationNotifiers && restaurantInfo?.expectationNotifiers[0]?.enrichedText.split('|')[1]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* *********************************** Deals n all *************************** */}
                <div>
                    <div className='pt-6'>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-bold text-xl font-display pl-4'>
                                Deals for you
                            </h1>
                            <div className='flex gap-2 '>
                                <div onClick={handlePrev}>
                                    <IoMdArrowBack className='rounded-full bg-gray-200 w-9 h-9 p-2 cursor-pointer font-extralight' />
                                </div>
                                <div onClick={handleNext}>
                                    <IoArrowForwardSharp className='rounded-full  bg-gray-200 w-9 h-9 p-2 cursor-pointer' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4'>
                        <div className={`overflow-x-auto no-scrollbar `} ref={topDealsSliderRef} onScroll={saveScrollPosition}>
                            <div className={`flex  duration-300 gap-4`}>
                                {
                                    discountData?.map((item, index) => (
                                        <DealsCard
                                            key={index}
                                            discountData={
                                                {
                                                    img: item?.info?.offerLogo,
                                                    header: item?.info?.header,
                                                    couponCode: item?.info?.couponCode
                                                }}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* ************************************ M E N U ********************* */}
                <div className='pt-10 flex flex-col items-center leading-5'>
                    <h1 className='tracking-widest text-[#6F7275]'>MENU</h1>
                    {/* <div className='w-full flex '> */}
                    <div className='relative w-full mt-6'>
                        <IoSearchOutline className=' absolute right-7 mt-4' color='#6F7275' size={20} />
                        <div className='min-w-full w-full flex bg-[#F2F2F3] p-4 rounded-2xl justify-center '>
                            <p className=' text-[#6F7275] font-semibold font-cabin'>Search for dishes</p>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
                <hr className='my-8'></hr>
                {/* ****************************MENU CATEGORIES************************ */}
                <div>
                    {
                        menuData && menuData.map((menuCategory, index) => {

                            return menuCategory?.card?.card?.title ? (
                                <SubMenu subMenuData={menuCategory?.card?.card} key={index}/>
                                // <div className='flex flex-col' key={index}>
                                //     <div key={index} className='flex justify-between items-center py-2'>
                                //         <h1
                                //             className='text-gray-900 font-extrabold text-sm font-roboto'>
                                //             {menuCategory?.card?.card?.title} {menuCategory?.card?.card?.itemCards ? `(${menuCategory?.card?.card?.itemCards?.length})` : ''}
                                //         </h1>
                                //         <div className='w-8 h-8 cursor-pointer' onClick={() => handleToggleMenuCategory(index)}>
                                //             {openMenus[index].status ?
                                //                 <IoIosArrowUp className=' text-lg ' /> :
                                //                 <IoIosArrowDown className=' text-lg ' />
                                //             }
                                //         </div>
                                //     </div>
                                //     {
                                //         openMenus[index].status ?
                                //             <MenuCategories
                                //                 itemCards={menuCategory?.card?.card?.itemCards}
                                //                 categories={menuCategory?.card?.card?.categories}
                                //                 index={index}
                                //             /> : null
                                //     }
                                //     <div className='w-[110%] -ml-4 h-4 bg-[#F2F2F3] '></div>         {/* thick hr between categories  */}
                                // </div>
                            ) : null
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default RestaurantMenu