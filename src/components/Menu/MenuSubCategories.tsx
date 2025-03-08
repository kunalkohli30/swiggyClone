// import { useState } from 'react'

// import MenuItemsList from './MenuItemsList';
// import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// type Iprops = {
//     subCategory: any,
//     restaurantId: number
// }

// const MenuSubCategories = ({ subCategory, restaurantId }: Iprops) => {

//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div className=''>
//             <div >
//                 <div className='flex justify-between py-2 flex-col pl-2'>
//                     <div className='flex items-center justify-between'>
//                         <h3 className='text-gray-900 font-bold text-xs font-roboto'>{subCategory?.title}</h3>
//                         <div className='w-8 h-8 cursor-pointer' onClick={() => setIsOpen(prevValue => !prevValue)}>
//                             {isOpen ?
//                                 <IoIosArrowUp className=' text-lg ' /> :
//                                 <IoIosArrowDown className=' text-lg ' />
//                             }
//                         </div>
//                     </div>
//                     <hr className={isOpen ? 'w-[20%]' : 'w-full'}></hr>
//                     {
//                         isOpen && <MenuItemsList itemCards={subCategory?.itemCards} />
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MenuSubCategories;