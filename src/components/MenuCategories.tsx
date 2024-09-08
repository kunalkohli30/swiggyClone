import React, { useState } from 'react'

import MenuItemsList from './MenuItemsList';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type Iprops = {
    itemCards: any,
    // categories: {
    //     title: string,
    //     itemCards: any[]
    // }[],
    categories: any
    index: number
}

type openCategoriesType = {
    index: number,
    status: boolean
}

const MenuCategories = (props: Iprops) => {

    const [openCategories, setOpenCategories] = useState<openCategoriesType[]>(
        Array(props.categories?.length)
            .fill(null)
            .map((x, i) => {
                return { index: i, status: false }
            })
    );

    // console.log('openCategories', openCategories);

    const handleToggleMenuCategory = (subCategoryIndex) => {
        // console.log('subCategoryIndex', subCategoryIndex);
        setOpenCategories(openCategories.map((openCategory, i) => i === subCategoryIndex ? { index: i, status: !openCategory.status } : openCategory));
    }

    // if (props.itemCards)
    // console.log('index', props.index, 'itemCards', props.itemCards[0]?.card?.info?.name, 'categories', props.categories);

    // const itemCards = menuItemData?.itemsCards;
    console.log('menu categories rendered. props', props);
    return (
        <div className=''>
            {/* <img src={vegIcon} className='w-4 h-4' /> */}

            {
                props.categories && props.categories.length ?
                    props.categories.map((subCategory, subCategoryIndex) => (
                        <div key={subCategoryIndex}>
                            <div className='flex justify-between py-2 flex-col pl-2'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-gray-900 font-bold text-xs font-roboto'>{subCategory?.title}</h3>
                                    <div className='w-8 h-8 cursor-pointer' onClick={() => handleToggleMenuCategory(subCategoryIndex)}>
                                        {!openCategories[subCategoryIndex].status ?
                                            <IoIosArrowDown className=' text-lg ' /> :
                                            <IoIosArrowUp className=' text-lg ' />
                                        }
                                    </div>
                                </div>
                                <hr className={openCategories[subCategoryIndex].status ? 'w-[20%]' : 'w-full'}></hr>
                                {
                                    openCategories[subCategoryIndex].status && <MenuItemsList itemCards={subCategory?.itemCards} />
                                }
                            </div>
                            {/* {
                                <h3>{category?.title}</h3> */}
                        </div>
                    ))
                    :
                    <MenuItemsList itemCards={props.itemCards} />
            }
        </div>
    )
}

export default MenuCategories