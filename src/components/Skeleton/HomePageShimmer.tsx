import { FaIceCream } from 'react-icons/fa';

const HomePageShimmer = () => {
    return (
        <div className='w-full -mt-6'>

            {/* Top panel */}
            <div className='h-[300px] bg-slate-800 w-full flex flex-col items-center justify-center  '>
                {/* <div> */}

                <div role="status" className=' text-3xl relative text-white animate-pulse'>
                    <FaIceCream className='absolute top-[76px] left-[26px] w-10 h-10 z-50' />

                    {/* <svg aria-hidden="true" className="w-20 h-20 text-gray-200 animate-spin dark:bg-slate-800 rounded-full fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg> */}
                    <div className='loader'></div>
                </div>
                <h1 className=' sm:text-3xl tracking-wide text-neutral-300 font-light -mt-4 animate-pulse'>
                    Looking for great food near you ...
                </h1>

                {/* </div> */}
            </div>

            {/* 2nd half panel */}
            <div className='w-[90%] lg:w-[80%] mx-auto  flex  gap-4'>

                {/* Left panel */}
                <div className='w-21   border-x-4   border-gray-100  '>

                    <div className='flex flex-col justify-start relative mt-9 animate-pulse'>
                        {
                            Array(8).fill("").map((_, index) => (

                                <div className={`flex justify-center  items-center  gap-4 py-8 pl-11 pr-14 ${index == 0 ? "bg-gray-300" : "bg-white"}`}>
                                    <div className={`rounded-full  w-11 h-11  ${index == 0 ? "bg-white" : "bg-gray-300"}`}></div>
                                    <div className={`font-bold tracking-tight  pl-2 pb-3  w-20  max-h-2 rounded ${index == 0 ? "bg-white" : "bg-gray-300"}`} ></div>
                                </div>
                            ))
                        }
                    </div>

                </div>

                {/* Right panel  */}
                <div className='pl-10 mt-5'>
                    <div className="flex items-center justify-between animate-pulse">
                        <div className="font-bold tracking-tight text-2xl text-gray-900 pl-2 pb-4 bg-gray-300 w-36 h-3 rounded"></div>
                        <div className="flex gap-2">
                            <div className="rounded-full bg-gray-300 w-9 h-9"></div>
                            <div className="rounded-full bg-gray-300 w-9 h-9"></div>
                        </div>
                    </div>
                    <div>
                        <div className="  mt-8">

                            {/* Repetitive boxes */}
                            <div className="grid grid-flow-row grid-cols-3 gap-12  animate-pulse">
                                {
                                    Array(9).fill("").map(_item => (
                                        <div className='flex flex-col gap-4 '>
                                            <div className="w-64  h-40 bg-gray-300 rounded mr-4"></div>
                                            <div className="font-bold tracking-tight  text-gray-900 pl-2 pb-3 bg-gray-300 w-48 max-h-2 rounded"></div>
                                            <div className="font-bold tracking-tight  text-gray-900 pl-2 pb-3 bg-gray-300 w-32 max-h-2 rounded"></div>
                                        </div>
                                    ))
                                }
                                {/* <!-- More restaurants... --> */}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomePageShimmer