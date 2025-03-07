import { useEffect, useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import axiosInstance from '../../config/AxiosInstance';
import { TbAlertOctagonFilled } from "react-icons/tb";
import { MdAddIcCall, MdOutlineVerified } from 'react-icons/md';
import AddPhoneNumberModal from './AddPhoneNumberModal';
import { AnimatePresence } from 'framer-motion';
import { auth } from '../../config/firebaseAuth';

type iProps = {
    phoneNoExists: boolean;
    setPhoneNoExists: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddPhoneNumber = ({phoneNoExists, setPhoneNoExists}: iProps) => {
    const greenTextColor = '[#60b246]';

    // const [phoneNoExists, setPhoneNoExists] = useState(false);
    const [showPhoneNoModal, setShowPhoneNoModal] = useState(false);
    const [phoneNo, setPhoneNo] = useState("");

    const checkPhoneNo = () => {
        axiosInstance.get("/api/user/phone")
            .then(response => {
                setPhoneNoExists(response.data.phone_number_exists);
                setPhoneNo(response.data.phone_number);
            })
            .catch(error => { alert("error occurred while validating phone number"); console.log("error occurred while validating phone number", error) })
    }

    useEffect(() => checkPhoneNo(), [showPhoneNoModal]);

    const user = auth.currentUser;
    const removePhoneNo = async () => {
        if (user) {
            try {
                await user.unlink("phone");
                console.log("Phone number removed successfully.");
            } catch (error) {
                console.error("Error removing phone number:", error);
            }
        } else {
            console.log("No user is signed in.");
        }
    }
    removePhoneNo();

    return (
        <div
            className='flex flex-col justify-start bg-white px-10 py-4 pb-10 relative '
        >
            <div className='absolute w-9 h-9 bg-[#282C3F] top-8 -left-6 flex justify-center items-center rounded-md'>
                <FaPhoneAlt className='text-white text-xl' />
            </div>
            <div className='flex justify-between items-center mt-6 '>
                <div className='flex sm:gap-2 items-center'>
                    <p className='text-gray-800 font-semibold text-xl font-display text-wrap w-24 md:w-full '>Phone Number</p>
                    {/* <FaCircleCheck className={`text-${greenTextColor} text-lg`} /> */}
                </div>
                <p className='font-roboto text-orange-500 font-semibold cursor-pointer' onClick={() => setShowPhoneNoModal(true)}>CHANGE</p>
            </div>
            {phoneNoExists ? (
                <div className='flex items-center gap-1 font-display font-xl font-semibold text-gray-800 mt-4'>
                    <p>{phoneNo} </p>
                    {/* <div className='flex gap-3'> */}
                    <MdOutlineVerified className={`text-${greenTextColor} text-2xl ml-8`} />
                    <p className='font-semibold text-sm'>Verified</p>
                    {/* </div> */}
                </div>
            ) : (
                <div>
                    <div className='mt-4 gap-3 flex items-center bg-yellow-100 px-4 py-2'>
                        <TbAlertOctagonFilled className='text-3xl text-red-600' />
                        <div className='flex flex-col   justify-start '>
                            <p className='font-cabin font-bold text-lg text-gray-800'>No phone number linked to your account.</p>
                            <p className='font-cabin font-bold text-xs text-gray-600 text-wrap '>Your phone number is required to receive order updates and ensure smooth delivery</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            className={`w-full py-2  text-${greenTextColor} border-2 border-${greenTextColor} rounded-lg hover:bg-${greenTextColor} hover:text-white transition flex items-center justify-center gap-2`}
                            onClick={() => setShowPhoneNoModal(true)}
                        >
                            <MdAddIcCall />
                            <p className='font-bold font-cabin'>Enter Phone Number to Continue</p>
                        </button>
                    </div>
                </div>
            )
            }
            <AnimatePresence>
                {showPhoneNoModal && <AddPhoneNumberModal showModal={showPhoneNoModal} setShowModal={setShowPhoneNoModal} setPhoneNo={setPhoneNo} />}
            </AnimatePresence>
        </div>
    )
}

export default AddPhoneNumber