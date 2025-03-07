import { useRef, useState } from 'react'
import { Formik, Form, Field, FormikValues, FormikProps } from 'formik';
import * as Yup from 'yup';
import { MdOutlineEmail, MdOutlinePassword, MdOutlinePerson } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUserData } from '../utils/userLoginSlice';
import { toggleLogin } from '../utils/toggleSlice';
import axiosInstance from '../config/AxiosInstance';
import EmailConfirmationTooltip from './loginAndSignup/EmailConfirmationTooltip';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseAuth';
import UserType from '../interfaces/User';
import { fetchCart } from '../utils/cartSlice';
import { useAppDispatch } from '../utils/hooks';


// When user fills the email, name, password and clicks submit, an OTP is sent on email id and the otp verification dialog comes up, when user enters the otp, signup method runs and user is registered
// After registeration, login method is called and user is logged in to the application

type signUpFormType = {
    email: string;
    fullName: string;
    password: string;
};

const SignupForm = () => {

    const dispatch = useAppDispatch();
    const [isemailVerified, setIsEmailVerified] = useState<boolean | null>(null);
    const [showEmailConfirmationDialog, setShowEmailConfirmationDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const formikRef = useRef<FormikProps<FormikValues>>(null);

    // console.log('ref', formikRef.current?.values);
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

    const sendOtpEmail = (values: FormikValues) => {
        setShowEmailConfirmationDialog(true);
        axiosInstance.post("/api/public/otp/generate", { email: values.email })
            .then(response => {})
            .catch(error => { alert('failed to send otp'); console.log('error occurred while sending otp', error) });
    }

    const closeSliderAfterEmailConfirmation = () => {
        dispatch(toggleLogin());
        dispatch(setLoggedIn());
    }
    const emailConfirmationDialogClose = (emailVerified: boolean) => {
        if (emailVerified) {
            setIsEmailVerified(true);
            login(formikRef.current?.values.email, formikRef.current?.values.password);
        }
        setShowEmailConfirmationDialog(false);
    }

    const doesUserExistWithEmail = async (email: string) => {
        const response = await axiosInstance.get('/auth/validateEmail', { params: { email: email } });
        console.log('email registered', response.data.isEmailRegistered);
        return response.data.isEmailRegistered;
    }

    const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
        .then(async response => {
            console.log(response.user.getIdToken);

            const authToken = await response.user.getIdToken();
            const refreshToken = response.user.refreshToken;

            // Verifies the access token and sets the cookie values for access token and refresh token in cookies
            const refresh = await axiosInstance.post("/auth/verify-token", {
                authToken: authToken,
                refreshToken: refreshToken
            });

            if (refresh.status === 401) {
                // show error on frontend
                setErrorMessage("Failed to login. Kindly retry");
                return;
            }

            dispatch(setLoggedIn());        // to set login redux state
            dispatch(toggleLogin());        //to close login slider

            const userData = {
                "fullName": response.user?.displayName,
                "email": response.user?.email,
                // "role": response.,
                "uid": response.user?.uid,
                "imageUrl": response.user?.photoURL,
                "phoneNumber": response.user?.phoneNumber
            } as UserType

            console.log('refreshed response', refresh);

            dispatch(setUserData({ userData: userData }));
            dispatch(fetchCart());
        })
        .catch(async error => {
            // User account created, failed to login
            console.log(error);
            setErrorMessage("User account created, kindly login");
        })

    return (
        <div>
            <Formik
                initialValues={{
                    email: '',
                    fullName: '',
                    password: '',
                }}
                innerRef={formikRef}
                validationSchema={SignupSchema}
                onSubmit={async values => {
                    const userExists = await doesUserExistWithEmail(values.email);
                    if (!userExists) {
                        console.log('send email')
                        sendOtpEmail(values);
                    }
                    else
                        formikRef.current?.setFieldError("email", "Email already registered");
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
                                {/* {emailAlreadyRegisteredMessage} */}
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
            {
                <EmailConfirmationTooltip
                    isOpen={showEmailConfirmationDialog}
                    onClose={emailConfirmationDialogClose}
                    values={formikRef.current?.values}
                    emailVerificationActions={closeSliderAfterEmailConfirmation}
                />
            }
            <div>
                <p>{errorMessage ? errorMessage : null}</p>
            </div>
        </div>
    )
}

export default SignupForm