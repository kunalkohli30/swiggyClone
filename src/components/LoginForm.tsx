import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { MdOutlineEmail, MdOutlinePassword } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../config/firebaseAuth';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUserData } from '../utils/userLoginSlice';
import UserType from '../interfaces/User';
import axios from 'axios';
import { toggleLogin } from '../utils/toggleSlice';
import { useCookies } from 'react-cookie';
import { fetchCart } from '../utils/cartSlice';
import { useAppDispatch } from '../utils/hooks';
import axiosInstance from '../config/AxiosInstance';
import { useState } from 'react';

const LoginForm = () => {


    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        // fullName: Yup.string()
        //     .min(2, 'Too Short!')
        //     .max(50, 'Too Long!')
        //     .required('Required'),
        password: Yup.string()
            .min(8, 'Too Short!')
            // .max(50, 'Too Long!')
            .required('Required')

    });

    const doesUserExistWithEmail = async (email: string) => {
        const response = await axios.get(process.env.BACKEND_URL + 'auth/validateEmail', { params: { email: email } });
        return response.data.isEmailRegistered;
    }

    const loginWithEmailAndPassword = (
        email: string,
        password: string,
        actions: FormikHelpers<{
            email: string;
            password: string;
        }>
    ) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async response => {
                console.log(response.user.getIdToken);

                const authToken = await response.user.getIdToken();
                const refreshToken = response.user.refreshToken;

                const refresh = await axiosInstance.post("/auth/verify-token", {
                    authToken: authToken,
                    refreshToken: refreshToken
                });

                if(refresh.status === 401) {
                    // show error on frontend
                    setErrorMessage("Failed to login. Kindly retry");
                    return;
                }

                dispatch(setLoggedIn());        // to set login redux state
                dispatch(toggleLogin());        //to close login slider

                // const userDataResponse = await axios.get("/api/user/userData");

                const userData = {
                    "fullName": response.user?.displayName,
                    "email": response.user?.email,
                    // "role": response.,
                    "uid": response.user?.uid,
                    "imageUrl": response.user?.photoURL,
                    "phoneNumber": response.user?.phoneNumber
                } as UserType

                
                // const refresh = await axiosInstance.post("/auth/verify-token", {
                //     authToken: authToken,
                //     refreshToken: refreshToken
                // });

                console.log('refreshed response', refresh);
                
                dispatch(setUserData({ userData: userData }));
                dispatch(fetchCart());
            })
            .catch(async error => {
                console.log(error);
                if (await doesUserExistWithEmail(email)) {
                    actions.setFieldError('passwoFVrd', 'Invalid credentials');
                    actions.setSubmitting(false);
                } else {
                    actions.setFieldError('email', 'No user found with matching email');
                    actions.setSubmitting(false);
                }
            })
    }

    const googleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async response => {
                console.log('googleLogin response', response);
                const userData = {
                    "fullName": response.user?.displayName,
                    "email": response.user?.email,
                    // "role": response.,
                    "uid": response.user?.uid,
                    "imageUrl": response.user?.photoURL,
                    "phoneNumber": response.user?.phoneNumber
                } as UserType

                dispatch(setUserData({ userData: userData }));
                dispatch(setLoggedIn());        // to set login redux state
                dispatch(toggleLogin());        //to close login slider
                setCookie('auth_token', await response.user.getIdToken(), { path: '/' });
                setCookie('refresh_token', response.user.refreshToken, { path: '/' });
            })
            .catch(error => {
                console.log('googlelogin error', error);
                console.log(error);
            })
    }
    const [cookies, setCookie] = useCookies(['auth_token', 'refresh_token']);

    return (
        <div>
            <div>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={async (values, actions) => {
                        loginWithEmailAndPassword(values.email, values.password, actions);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className='flex flex-col gap-2 py-8'>
                                <div>
                                    <Field name="email" type="email"
                                        render={({ field /* { name, value, onChange, onBlur } */ }) => (
                                            <div className='flex items-end gap-4 border-b-2 border-gray-300 w-48 md:w-80 py-2'>
                                                <i><MdOutlineEmail className='text-lg md:text-2xl hover:text-purple-400 ' /></i>
                                                <input {...field} type="text" placeholder="Email" className='  text-base md:text-xl outline-none ' />
                                            </div>
                                        )}
                                    />
                                    {errors.email && touched.email ? (
                                        <div className='text-sm text-red-400'>{errors.email}</div>
                                    ) : null}
                                </div>

                                <div>
                                    <Field name="password" type="password"
                                        render={({ field }) => (
                                            <div className='flex items-end gap-4 border-b-2 border-gray-300 w-48 md:w-80 py-2'>
                                                <i><MdOutlinePassword className='text-lg md:text-2xl hover:text-purple-400' /></i>
                                                <input {...field} type="password" placeholder="Password" className='  text-base md:text-xl outline-none' />
                                            </div>
                                        )}
                                    />
                                    {errors.password && touched.password ? <div className='text-sm text-red-400'>{errors.password}</div> : null}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-48 md:w-80 bg-orange-500 text-white py-1 md:py-3 font-roboto text-xl rounded-2xl 
                                ${errors.email || errors.password ? 'cursor-not-allowed' : ''}`}
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className='flex flex-col items-center w-48 md:w-80 '>
                    <p className=' text-gray-400 font-display mt-3 cursor-pointer text-xs'>Forgot Username / Password</p>
                    <p className='mt-5 text-sm md:text-base'>Or login with</p>
                    <div className='flex gap-4 md:gap-10 bg-red-500 p-4 text-white items-center rounded-xl w-full mt-5 cursor-pointer'>
                        <FaGoogle color='white' className='text-2xl' />
                        <div className='text-sm md:text-xl text-nowrap' onClick={googleLogin}>Login with Google</div>

                    </div>
                </div>

                <div>       //error message
                    <p>{errorMessage ? errorMessage : null}</p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm