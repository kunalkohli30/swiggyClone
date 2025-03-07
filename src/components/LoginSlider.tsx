import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginInSlider, openSignupInSlider, toggleLogin, toggleSearchBar } from '../utils/toggleSlice';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { useAppSelector } from '../utils/hooks';
import { AnimatePresence, motion } from "framer-motion";

const LoginSlider = () => {

    const showLoginSlider = useAppSelector(state => state.toggleSlice.loginToggle);
    const showLoginInSlider = useAppSelector(state => state.toggleSlice.showLoginInSlider);
    const dispatch = useDispatch();

    const toggleLoginSlider = () => {
        // setVisible(!visible);
        dispatch(toggleLogin());
    }

    const sliderVariants = {
        hidden: { x: "100%", opacity: 0 }, // Start off-screen (right)
        visible: { x: "0%", opacity: 1, transition: { type: "tween", duration: 0.5 } }, // Slide in
        exit: { x: "100%", opacity: 0, transition: { type: "tween", duration: 0.4 } }, // Slide out
    };

    return (
        <AnimatePresence>
            <motion.div
                variants={sliderVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed right-0 top-[80px] w-screen h-screen bg-black/50 z-50"
            >
                <div className={`w-full bg-black/50 h-full absolute z-50`} onClick={toggleLoginSlider} ></div>
                <div className={`bg-white h-full   z-50 absolute  transition-all ease-in duration-300 flex justify-start right-0 w-[300px] md:w-[450px] lg-[550px]`}>
                    <div className='visible flex ml-12 flex-col w-full' >
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

                        {showLoginInSlider ? <LoginForm /> : <SignupForm />}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default LoginSlider