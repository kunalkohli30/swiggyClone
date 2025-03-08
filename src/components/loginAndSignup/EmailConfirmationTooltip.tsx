import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../config/AxiosInstance";
import { FormikValues } from "formik";
import UserType from "../../interfaces/User";
import { OTP_VALIDATED } from "../../StandardConstants";
import { useAppDispatch } from "../../utils/hooks";
import { setUserData } from "../../utils/userLoginSlice";

type iProps = {
    isOpen: boolean,
    onClose: (emailVerified: boolean) => void,
    values: FormikValues | undefined,
    emailVerificationActions: () => void
}
export default function EmailConfirmationTooltip({ isOpen, onClose, values }: iProps) {
    const [otp, setOtp] = useState("");
    const dispatch = useAppDispatch();

    const validateOtp = (otp: string) => {
        if (values) {
            axiosInstance.post("/api/public/otp/validate", {
                "email": values.email,
                "otp": otp
            }).then(response => {
                if (response.data === OTP_VALIDATED) {
                    signup(values);
                } else {
                    alert("OTP INVALID");
                }
            })
        }
    }

    const signup = (values: FormikValues) => {
        axiosInstance.post("/auth/signup/v2", {
            "email": values.email,
            "fullName": values.fullName,
            "password": values.password
        }).then(response => {
            const userData = {
                "fullName": response.data?.fullName,
                "email": response.data?.email,
                "role": response.data?.user_role,
                "uid": response.data?.uid,
                "imageUrl": response.data?.imageUrl,
                "phoneNumber": response.data?.phoneNumber
            } as UserType

            dispatch(setUserData({ userData: userData }));
            onClose(true);
        }, errorResponse => {
            console.log('errorResponse', errorResponse);
            onClose(false);
        })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    {/* Dialog Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-semibold text-gray-800">Enter OTP to Confirm Email</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            We’ve sent a 6-digit OTP to your email. Please enter it below.
                        </p>

                        {/* OTP Input */}
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="______"
                        />

                        {/* Buttons */}
                        <div className="mt-6 flex justify-between">
                            <button
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                onClick={() => alert("Resending OTP...")}
                            >
                                Resend OTP
                            </button>

                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                                onClick={() => validateOtp(otp)}
                            >
                                Confirm OTP
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
