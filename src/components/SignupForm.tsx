import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MdOutlineEmail, MdOutlinePassword, MdOutlinePerson } from 'react-icons/md';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUserData } from '../utils/userLoginSlice';
import { toggleLogin } from '../utils/toggleSlice';
import UserType from '../interfaces/User';


const SignupForm = () => {

    const dispatch = useDispatch();

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        fullName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Too Short!')
            // .max(50, 'Too Long!')
            .required('Required')

    });

    // const handleSubmit = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    // }
    return (
        <div>
            <Formik
                initialValues={{
                    email: '',
                    fullName: '',
                    password: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={values => {
                    // same shape as initial values
                    axios.post(process.env.BACKEND_URL + "auth/signup/v2", {
                        "email": values.email,
                        "fullName": values.fullName,
                        "password": values.password
                    }).then(response => {
                        console.log('response', response);
                        // dispatch(setAuthToken(response.data.authToken));
                        dispatch(toggleLogin());
                        dispatch(setLoggedIn());

                        const userData = {
                            "fullName": response.data?.fullName,
                            "email": response.data?.email,
                            "role": response.data?.user_role,
                            "uid": response.data?.uid,
                            "imageUrl": response.data?.imageUrl,
                            "phoneNumber": response.data?.phoneNumber
                        } as UserType

                        dispatch(setUserData({ userData: userData }));
                        
                    }, errorResponse => {
                        console.log('errorResponse', errorResponse);
                    })
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className='flex flex-col gap-2 py-12'>
                            <div>
                                <Field name="email" type="email"
                                    render={({ field /* { name, value, onChange, onBlur } */ }) => (
                                        <div className='flex items-end gap-4 border-b-2 border-gray-300 w-48 md:w-80 py-2'>
                                            <i><MdOutlineEmail className='text-lg md:text-2xl hover:text-purple-400 mb-1' /></i>
                                            <input {...field} type="text" placeholder="Email" className='text-base  md:text-xl outline-none' />
                                        </div>
                                    )}
                                />
                                {errors.email && touched.email ? (
                                    <div className='text-sm text-red-400'>{errors.email}</div>
                                ) : null}
                            </div>
                            <div>
                                <Field name="fullName"
                                    render={({ field /* { name, value, onChange, onBlur } */ }) => (
                                        <div className='flex items-end gap-4 border-b-2 border-gray-300 text-lg md:text-2xl w-48 md:w-80 py-2'>
                                            <i><MdOutlinePerson className='text-lg md:text-2xl hover:text-purple-400 mb-1' /></i>
                                            <input {...field} type="text" placeholder="Full Name" className='text-base md:text-xl outline-none' />
                                        </div>
                                    )}
                                />
                                {errors.fullName && touched.fullName ? (
                                    <div className='text-sm text-red-400 mx-auto'>{errors.fullName}</div>
                                ) : null}
                            </div>
                            <div>
                                <Field name="password" type="password"
                                    render={({ field }) => (
                                        <div className='flex items-end gap-4 border-b-2 border-gray-300  w-48 md:w-80 py-2'>
                                            <i><MdOutlinePassword className='text-2xl hover:text-purple-400 mb-1 ' /></i>
                                            <input {...field} type="password" placeholder="Password" className='  text-base md:text-xl  outline-none' />
                                        </div>
                                    )}
                                />
                                {errors.password && touched.password ? <div className='text-sm text-red-400'>{errors.password}</div> : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-48 md:w-80 bg-orange-500 text-white py-1 md:py-3 font-roboto text-xl rounded-2xl 
                                ${errors.email || errors.fullName || errors.password ? 'cursor-not-allowed' : ''}`}
                        // onClick={errors.email || errors.fullName || errors.password ? () => false : (e) => handleSubmit(e)}
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignupForm