import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../config/firebaseAuth";
import { ConfirmationResult, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

export const PhoneAuth: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [message, setMessage] = useState<string>("");
    const [verificationId, setVerificationId] = useState("");
    // Initialize reCAPTCHA (Invisible)
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible", // Invisible mode
                callback: (response) => {
                    console.log("reCAPTCHA Verified! Response:", response);
                },
                "expired-callback": () => {
                    console.warn("reCAPTCHA expired. Resetting...");
                    window.recaptchaVerifier.clear(); // Reset reCAPTCHA
                    console.log('reinitialize');
                    setupRecaptcha(); // Reinitialize
                },
            });
        }
    };

    // Send OTP
    const sendOTP = async () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        if (!appVerifier) {
            console.error("reCAPTCHA verifier is not initialized.");
            return;
        }

        try {
            console.log(phoneNumber);
            await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier).then(r => {
                console.log('signedIn', r);
                setVerificationId(r.verificationId);
                setConfirmationResult(r);
            }).catch(e => console.log('error inn signin', e));

            setMessage("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage("Failed to send OTP.");
        }
    };

    // Verify OTP
    const verifyOTP = async () => {
        try {
            console.log('otp', otp)
            const credential = PhoneAuthProvider.credential(verificationId, otp);
            const confResponse = confirmationResult?.confirm(otp).then((userCredential) => {
                console.log("Successfully signed in with OTP", userCredential);
            }).catch(e => console.log('error verification', e));

            // await signInWithCredential(auth, credential);
            alert("Successfully signed in with OTP");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage("Invalid OTP.");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto" >
            {/* <div id="recaptcha-container">

            </div> */}
            <h2 className="text-xl font-bold mb-4">Phone Authentication</h2>

            <input
                type="text"
                placeholder="+1 234 567 8901"
                className="w-full p-2 border rounded mb-2"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
                onClick={sendOTP}
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                Send OTP
            </button>

            <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-2 border rounded mt-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button
                onClick={verifyOTP}
                className="w-full bg-green-500 text-white p-2 rounded mt-2"
            >
                Verify OTP
            </button>

            <p className="text-sm text-red-500 mt-2">{message}</p>

            {/* Invisible reCAPTCHA */}
            <div id="recaptcha-container"></div>
        </div>
    );
};

// export  PhoneAuth;
