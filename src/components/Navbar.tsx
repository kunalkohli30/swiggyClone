import { IoIosArrowDown, IoMdHelpCircleOutline } from "react-icons/io";
import { IoBagOutline, IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { CiDiscount1 } from 'react-icons/ci';
import { Link, Outlet } from "react-router-dom";


const Navbar = () => {

    const navItems = [
        {
            name: 'Swiggy Corporate',
            icon: < IoBagOutline />
        }, {
            name: 'Search',
            icon: <IoIosSearch />
        }, {
            name: 'Offers',
            icon: <CiDiscount1 />
        }, {
            name: 'Help',
            icon: <IoMdHelpCircleOutline />
        }, {
            name: 'Signin',
            icon: <IoPersonOutline />
        }, {
            name: 'Cart',
            icon: <IoCartOutline />
        }
    ];

    return (
        <>
            <div className='w-full h-24 shadow-md flex items-center justify-center'>
                <div className=' w-[70%] flex justify-between items-center'>
                    <div className='flex items-center'>
                        <Link to="/">
                            <img
                                src='https://i.pinimg.com/originals/b3/8a/a1/b38aa1b21050b0e769a97eb751d12829.png'
                                className='h-20 w-20'
                            />
                        </Link>
                        <div className="flex items-center justify-between gap-3">
                            <p className='font-bold border-b-2  border-black'>Other</p>
                            <IoIosArrowDown cursor={"pointer"} color='orange' className='mt-1 text-lg' />
                        </div>
                    </div>
                    <div className='flex gap-7'>
                        {navItems.map(navItem => (
                            <div className="flex items-center gap-1 cursor-pointer" key={navItem.name}>
                                {navItem.icon}
                                <p className='text-base text-gray-600'>{navItem.name}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Navbar