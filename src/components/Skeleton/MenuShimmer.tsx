
const MenuShimmer = () => {
    return (
        <div>
            <div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-5"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div >
                    <div className='p-4 rounded-[28px] bg-gray-100 w-[95%] h-[92%] mx-auto animate-pulse mt-7'>

                        {/* <!-- Ratings and cost for two --> */}
                        <div className='flex items-center gap-2'>
                            <div className='-mt-1 font-bold tracking-tighter w-28 h-3 bg-gray-200'></div>
                            <div className='-mt-1 font-bold h-3 bg-gray-200 w-30'></div>
                        </div>

                        {/* <!-- Cuisines --> */}
                        <div className='pt-1 '>
                            <div className='font-bold underline text-orange-600 w-32 h-3 bg-gray-200'></div>
                        </div>

                        {/* <!-- outlet and delivery time --> */}
                        <div className='flex pt-4 pl-1 gap-3'>
                            <div className='w-2 flex flex-col items-center'>
                                <div className='w-[7px] h-[7px] bg-gray-200 rounded-full'></div>
                                <div className='w-[1.5px] h-[24px] bg-gray-200 rounded-full'></div>
                                <div className='w-[7px] h-[7px] bg-gray-200 rounded-full'></div>
                            </div>
                            <div>
                                <div className='flex flex-col gap-1 justify-between'>
                                    <div className='flex gap-2 -mt-1'>
                                        <div className='text-sm  font-bold w-16 h-3 bg-gray-200'></div>
                                        <div className='text-sm  font-roboto w-16 h-3 bg-gray-200'></div>
                                    </div>
                                    <div>
                                        <div className='text-sm font-bold w-16 h-3 bg-gray-200'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='my-3 -mx-4'></hr>

                        {/* <!-- delivery fee --> */}
                        <div className='flex gap-4 items-center'>
                            <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                            <div className='text-gray-500 font-semibold text-sm -mt-1 h-4 bg-gray-200 w-44'></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-5'>
                    <div className='text-gray-500 h-6 bg-gray-200 w-44 mt-6 rounded-xl animate-pulse'></div>
                    <div className='flex flex-row gap-5'>
                        {Array(3).fill("").map(() => (
                            <div className='h-14 w-56 rounded-xl bg-gray-200 animate-pulse flex flex-row items-center gap-5 pl-4'>

                                <div className='bg-white h-7 w-7 rounded-full '></div>
                                <div className="flex flex-col  justify-start gap-2">
                                    <div className="bg-white rounded-xl w-24 h-3"></div>
                                    <div className="bg-white rounded-xl w-20 h-3"></div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuShimmer