import  { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import MenuItemsList from './MenuItemsList';

import { MenuDto, RestaurantDto } from '../../interfaces/apiModels/RestaurantList';

type iProps = {
    subMenuData: MenuDto,
    restaurantData: RestaurantDto
}

const MenuCategories = ({ subMenuData, restaurantData }: iProps) => {

    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className='flex flex-col'>
            <div className='flex justify-between items-center py-2 cursor-pointer' onClick={() => setIsOpen(prevVal => !prevVal)}>
                <h1
                    className='text-gray-900 font-extrabold text-sm font-roboto'>
                    {subMenuData?.category} {subMenuData?.foodItems ? `(${subMenuData?.foodItems?.length})` : ''}
                </h1>
                <div className='w-8 h-8 cursor-pointer' >
                    {isOpen ?
                        <IoIosArrowUp className=' text-lg ' /> :
                        <IoIosArrowDown className=' text-lg ' />
                    }
                </div>
            </div>
            {
                isOpen &&
                (
                    <div className='duration-500'>
                        {
                            subMenuData?.foodItems && subMenuData?.foodItems?.length ?
                                <MenuItemsList itemCards={subMenuData?.foodItems} restaurantData={restaurantData}
                                /> :
                                null
                            // else display menu items
                            // subMenuData?.categories && subMenuData?.categories?.length ?
                            //     subMenuData?.categories?.map((subCategory, subCategoryIndex) =>
                            //         <MenuSubCategories subCategory={subCategory} key={subCategoryIndex} restaurantId={restaurantId}/>     //display subcategories if present
                            //     )
                            //     :
                            //     <MenuItemsList itemCards={subMenuData?.itemCards} restaurantId={restaurantId}/>                        // else display menu items
                        }
                    </div>
                )
            }
            <div className='w-[110%] -ml-4 h-4 bg-[#F2F2F3] '></div>         {/* thick hr between categories  */}
        </div>
    )
}

export default MenuCategories