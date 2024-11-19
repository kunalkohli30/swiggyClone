import React, { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import MenuItemsList from './MenuItemsList';
import MenuSubCategories from './MenuSubCategories';

const MenuCategories = ({ subMenuData, restaurantId }) => {

    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className='flex flex-col'>
            <div className='flex justify-between items-center py-2'>
                <h1
                    className='text-gray-900 font-extrabold text-sm font-roboto'>
                    {subMenuData?.title} {subMenuData?.itemCards ? `(${subMenuData?.itemCards?.length})` : ''}
                </h1>
                <div className='w-8 h-8 cursor-pointer' onClick={() => setIsOpen(prevVal => !prevVal)}>
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
                            subMenuData?.categories && subMenuData?.categories?.length ?
                                subMenuData?.categories?.map((subCategory, subCategoryIndex) =>
                                    <MenuSubCategories subCategory={subCategory} key={subCategoryIndex} restaurantId={restaurantId}/>     //display subcategories if present
                                )
                                :
                                <MenuItemsList itemCards={subMenuData?.itemCards} restaurantId={restaurantId}/>                        // else display menu items
                        }
                    </div>
                )
            }
            <div className='w-[110%] -ml-4 h-4 bg-[#F2F2F3] '></div>         {/* thick hr between categories  */}
        </div>
    )
}

export default MenuCategories