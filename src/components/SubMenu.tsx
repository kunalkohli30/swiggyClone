import React, { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import MenuCategories from './MenuCategories';
import MenuItemsList from './MenuItemsList';

const SubMenu = ({ subMenuData }) => {

    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className='flex flex-col'>
            <div className='flex justify-between items-center py-2'>
                <h1
                    className='text-gray-900 font-extrabold text-sm font-roboto'>
                    {subMenuData?.title} {subMenuData?.itemCards ? `(${subMenuData?.itemCards?.length})` : ''}
                </h1>
                <div className='w-8 h-8 cursor-pointer' onClick={() => setIsOpen((prevVal) => !prevVal)}>
                    {isOpen ?
                        <IoIosArrowUp className=' text-lg ' /> :
                        <IoIosArrowDown className=' text-lg ' />
                    }
                </div>
            </div>
            {
                // isOpen ?
                //     <MenuCategories
                //         itemCards={subMenuData?.itemCards}
                //         categories={subMenuData?.categories}
                //         index={0}
                //     /> : null

                isOpen &&
                    subMenuData?.categories && subMenuData?.categories?.length ?
                    subMenuData?.categories?.map((subCategory, subCategoryIndex) =>
                        <MenuCategories subCategory={subCategory} key={subCategoryIndex} />
                    )
                    :
                    <MenuItemsList itemCards={subMenuData?.itemCards} />
            }
            <div className='w-[110%] -ml-4 h-4 bg-[#F2F2F3] '></div>         {/* thick hr between categories  */}
        </div>
    )
}

export default SubMenu