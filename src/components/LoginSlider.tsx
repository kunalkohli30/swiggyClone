import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginInSlider, openSignupInSlider, toggleLogin, toggleSearchBar } from '../utils/toggleSlice';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { useAppSelector } from '../utils/hooks';

const LoginSlider = () => {

    const showLoginSlider = useAppSelector(state => state.toggleSlice.loginToggle);
    const showLoginInSlider = useAppSelector(state => state.toggleSlice.showLoginInSlider);
    const dispatch = useDispatch();

    const toggleLoginSlider = () => {
        // setVisible(!visible);
        dispatch(toggleLogin());
    }

    return (
        <div className="w-full h-full ">
            <div className={`w-full bg-black/50 h-full absolute z-50 ${showLoginSlider ? 'visible' : 'invisible'}`} onClick={toggleLoginSlider} ></div>
            <div className={`bg-white h-full   z-50 absolute  transition-all ease-in duration-300 flex justify-start right-0 ${!showLoginSlider ? 'w-0 ' : 'w-[300px] md:w-[450px] lg-[550px]'} `}>
                <div className={showLoginSlider ? 'visible flex ml-12 flex-col w-full' : 'invisible'}>
                    <div>
                        <p className=" w-fit my-7 cursor-pointer text-xl text-gray-600" onClick={toggleLoginSlider} >
                            <RxCross1 />
                        </p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-xl md:text-4xl font-cabin font-semibold'>{showLoginInSlider ? 'Login' : 'Sign up'}</h1>
                        <p className='text-xs md:text-sm'>or <span> </span>
                            <span className='text-orange-500 font-semibold cursor-pointer' onClick={() => showLoginInSlider ? dispatch(openSignupInSlider()) : dispatch(openLoginInSlider())}>
                                {
                                    showLoginInSlider ?
                                        <span className=''>create an account</span> :
                                        <span className=''>login into your account</span>
                                }
                            </span>
                        </p>
                        <div className='w-[35px] h-[2px] bg-black mt-3'></div>
                    </div>

                    {
                        showLoginInSlider ? <LoginForm /> : <SignupForm />
                    }




                </div>
            </div>
            {/* <div className="w-full" onClick={toggleVisible}></div> */}

        </div>
    )
}

export default LoginSlider