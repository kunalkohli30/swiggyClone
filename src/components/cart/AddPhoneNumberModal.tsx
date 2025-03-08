import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { linkWithCredential, PhoneAuthProvider, updatePhoneNumber } from "firebase/auth";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../config/firebaseAuth";
import { FirebaseError } from "firebase/app";
import { FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";


type iProps = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    setPhoneNo: React.Dispatch<React.SetStateAction<string>>
    operation: 'ADD' | 'UPDATE'
}

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

const AddPhoneNumberModal = ({ setShowModal, setPhoneNo, operation }: iProps) => {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState<string>("");
    const [verificationId, setVerificationId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPhoneNoFieldFocused, setIsPhoneNoFieldFocused] = useState(false);
    const [phoneNoInvalid, setPhoneNoInvalid] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    // @ts-ignore
    const [errorMessage, setErrorMessage] = useState("");
    // @ts-ignore
    const [showOtpInvalidMessage, setShowOtpInvalidMessage] = useState(false);
    const [showError, setShowError] = useState(false);

    // Initialize reCAPTCHA (Invisible)
    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) {
            console.log("Resetting reCAPTCHA...");
            window.recaptchaVerifier.clear(); // Clear previous reCAPTCHA instance
        }

        // if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible", // Invisible mode
            callback: (response: string) => {
                console.log("reCAPTCHA Verified! Response:", response);
            },
            "expired-callback": () => {
                console.warn("reCAPTCHA expired. Resetting...");
                window.recaptchaVerifier.clear(); // Reset reCAPTCHA
                console.log('reinitialize');
                setupRecaptcha(); // Reinitialize
            },
        });
        // }
    };

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }
    }, [showMessage]);
    // Send OTP
    const sendOTP = async () => {
        const appVerifier = (window as any).recaptchaVerifier;

        if (!appVerifier) {
            console.error("reCAPTCHA verifier is not initialized.");
            return;
        }
        setLoading(true);
        try {
            console.log(phoneNumber)
            await signInWithPhoneNumber(auth, "+91" + phoneNumber, appVerifier).then(r => {
                console.log('signedIn', r);
                setVerificationId(r.verificationId);
                setOtpSent(true);

            }).catch((e: FirebaseError) => {
                console.log('error inn signin', e);
                if (e.code === 'auth/invalid-phone-number')
                    setPhoneNoInvalid(true)
            });
            setLoading(false);
            setMessage("OTP sent successfully!");
            setShowMessage(true);
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage("Failed to send OTP.");
        }
    };

    // Verify OTP
    const verifyOTP = async () => {
        try {
            const credential = PhoneAuthProvider.credential(verificationId, otp);
            if (auth.currentUser) {
                // Link phone number to existing user
                console.log('otp', otp)
                if (operation === 'ADD') {
                    linkWithCredential(auth.currentUser, credential)
                        .then(response => {
                            console.log("Phone number linked successfully", response);
                            setPhoneNo(phoneNumber);
                            setIsOtpVerified(true);
                            setMessage("OTP verification successful!!!");
                            setShowMessage(true);
                            setPhoneNo(phoneNumber);
                            setShowModal(false);
                        })
                        .catch((error: FirebaseError) => {
                            if (error.code === 'auth/invalid-verification-code') {
                                setShowOtpInvalidMessage(true);
                                setErrorMessage("OTP is invalid");
                                setShowError(true);
                                console.log('invalid otp')
                                handleOtpError();
                            }
                        })
                } else {
                    updatePhoneNumber(auth.currentUser, credential)
                        .then(response => {
                            console.log("Phone number linked successfully", response);
                            setPhoneNo(phoneNumber);
                            setIsOtpVerified(true);
                            setMessage("OTP verification successful!!!");
                            setShowMessage(true);
                            setPhoneNo(phoneNumber);
                            setShowModal(false);
                        })
                        .catch((error: FirebaseError) => {
                            if (error.code === 'auth/invalid-verification-code') {
                                setShowOtpInvalidMessage(true);
                                setErrorMessage("OTP is invalid");
                                setShowError(true);
                                console.log('invalid otp')
                                handleOtpError();
                            }
                        })
                }
            } else {
                console.error("User not signed in. Cannot link phone number.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage("Invalid OTP.");
        }
    };

    useEffect(() => {
        setPhoneNoInvalid(false);
    }, [phoneNumber])

    useEffect(() => setupRecaptcha(), []);

    const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleResendOTP = () => {
        if (!canResend) return;
        sendOTP();
        setTimer(120); // Reset timer
        setCanResend(false);
    };

    const handleOtpError = () => {
        console.log('error toast');
        toast.error("❌ OTP is invalid. Please try again.", {
            position: "top-center",
            hideProgressBar: true,
            icon: false, // Removes the default error icon
        });
    };

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {showMessage && <div className="absolute top-20 -translate-x-1 bg-white z-50 min-w-96 py-2 px-4 rounded-2xl flex-1 text-sm font-cabin font-semibold text-green-600 flex gap-3 justify-center border-2 border-green-600">
                <FaCheck className="text-lg text-green-600" />
                {message}
            </div>
            }
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
            >
                {!otpSent ? (
                    <>
                        <h2 className="text-lg font-semibold mb-2">Enter Your Phone Number</h2>
                        <div className={`flex items-center border p-2 rounded-lg ${isPhoneNoFieldFocused ? 'outline-none ring-2 ring-orange-500' : ''}`}>
                            <span className="text-gray-500 font-display">+91</span>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                className="ml-2 flex-1 outline-none font-semibold font-display "
                                onFocus={() => setIsPhoneNoFieldFocused(true)}
                                onBlur={() => setIsPhoneNoFieldFocused(false)}
                                value={phoneNumber}
                                onChange={(e) => { e.target.value.length <= 10 && setPhoneNumber(e.target.value); }}
                            />
                        </div>
                        {phoneNoInvalid && <p className="font-cabin text-sm font-semibold text-red-600">Phone number invalid</p>}

                        <button
                            className={`w-full  py-2 mt-4  rounded-lg ${phoneNumber.length !== 10 ? 'bg-gray-500' : 'bg-orange-500'}
                                        ${loading ? 'shimmer text-white' : 'text-white'}`}
                            onClick={() => sendOTP()}
                            disabled={phoneNumber.length !== 10}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center font-semibold">       {/* 5 dot animation*/}
                                    Sending OTP
                                    {Array(5).fill("").map(() => (
                                        <motion.span
                                            className="text-3xl -mt-2"
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, times: [0, 0.5, 1] }}
                                        >.</motion.span>
                                    ))}

                                </span>
                            ) : "Send OTP"}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-2">Verify OTP</h2>
                        <motion.input
                            initial={{ x: 0 }}
                            animate={showError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                            className={`mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-lg 
                                        tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500
                                        ${showError ? "ring-red-600 ring-2 text-red-600" : ""}`}
                            placeholder="______"
                            value={otp}
                            onChange={(e) => {
                                e.target.value.length <= 6 ? setOtp(e.target.value) : null
                                setShowError(false);
                                setErrorMessage("");
                            }}
                        />
                        {!isOtpVerified && <button
                            className="w-full bg-green-500 text-white font-semibold font-display  py-2 rounded-lg mb-1 mt-3 hover:bg-emerald-600 transition duration-200"
                            onClick={() => verifyOTP()}
                        >
                            Confirm
                        </button>
                        }
                        {!isOtpVerified && <button
                            className={`w-full text-orange-500 underline ${!canResend ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleResendOTP}
                            disabled={!canResend}
                        >
                            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
                        </button>
                        }
                        {/* {showMessage && <p className="text-sm font-cabin font-semibold text-green-600">{message}</p>} */}
                    </>
                )}

                <button className="absolute top-2 right-3 text-gray-500" onClick={() => setShowModal(false)}>
                    ✖
                </button>
                <div id="recaptcha-container"></div>
                <ToastContainer />  {/* Important! This must be included */}
            </motion.div>
        </motion.div>
    );
};

export default AddPhoneNumberModal;
