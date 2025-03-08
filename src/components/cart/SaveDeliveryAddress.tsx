import React, { useRef, useState } from 'react'
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx'
import GoogleMaps from '../GoogleMaps'
import {  Form, Formik, FormikHelpers, FormikProps} from 'formik'
import FormikModifiedField from '../FormikModifiedField'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { MdErrorOutline, MdWork, MdWorkOutline } from 'react-icons/md'
import { IoLocationOutline, IoLocationSharp } from 'react-icons/io5'
import axios, { AxiosError } from 'axios';
import { useDispatch} from 'react-redux';
import { hideAddressSlider } from '../../utils/toggleSlice';
import axiosInstance from '../../config/AxiosInstance';
import { AnimatePresence, motion } from "framer-motion";


export type address = {
    userAddressId?: number,
    formattedGoogleAddress: string | undefined,
    lat: number,
    lng: number,
    flatNo: string,
    street: string,
    city: string,
    pinCode: string,
    addressName: string
}

type formValues = {
    flatNo: string,
    street: string,
    city: string,
    pinCode: string
}
const SaveDeliveryAddress = () => {

    const saveAddressSchema = Yup.object().shape({

        flatNo: Yup.string()
            .required('Required'),
        street: Yup.string()
            .required('Required'),
        city: Yup.string()
            .required('Required'),
        pinCode: Yup.number()
            .test(
                "maxDigits",
                "Pin code must have exactly 6 digits",
                (number) => String(number).length === 6
            )
            .required('Required')
    });

    const saveAddressButtonStyle = 'border-y-2  flex-1 flex gap-1 items-center justify-center py-2 text-sm font-roboto hover:bg-black hover:text-white cursor-pointer';
    const [showOther, setShowOther] = useState(false);
    const [addressName, setAddressName] = useState('');
    const [showAddressNameNotPresentError, setShowAddressNameNotPresentError] = useState(false);
    const [locationInValid, setLocationInValid] = useState(undefined as boolean | undefined);
    // @ts-ignore
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    // @ts-ignore
    const [addressNameAlreadyUsed, setAddressNameAlreadyUsed] = useState(false);
    const [showStaticButtons, setShowStaticButtons] = useState(true); // Controls visibility of Home & Work

    const center = { lat: 28.649835, lng: 77.124298 };
    const [selectedPosition, setSelectedPosition] = useState(center);
    const [userAdrString, setUserAdrString] = useState("");

    const formikRef = useRef<FormikProps<formValues> | null>(null);

    const dispatch = useDispatch();

    const staticAddressName = [
        {
            adrName: 'Home',
            iconForSelected: <GoHomeFill />,
            iconForUnSelected: <GoHome />
        },
        {
            adrName: 'Work',
            iconForSelected: <MdWork />,
            iconForUnSelected: <MdWorkOutline />
        }
    ];

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e?.currentTarget;
        // console.log('target', target.scrollHeight - target.scrollTop);
        // console.log('target', target.scrollTop);
        // console.log('target', target.clientHeight);
        // console.log('target.scrollHeight', target.scrollTop, target.scrollHeight - target.clientHeight);
        if (target.scrollHeight - (target.clientHeight + target.scrollTop) < 1)
            setShowShadowOnSubmitDiv(false)
        else setShowShadowOnSubmitDiv(true);
    }

    const saveAddressInDb = (address: address) => {
        console.log('address', address)
        return axiosInstance.post('api/user/address',
            {
                ...address
            }
        )
    }

    const closeForm = () => {
        dispatch(hideAddressSlider());
        formikRef.current?.resetForm();
        setSelectedPlace(null);
        setAddressName('')
        setLocationInValid(false);
        setShowOther(false);
        setAddressNameAlreadyUsed(false);
    }

    const [showShadowOnSubmitDiv, setShowShadowOnSubmitDiv] = useState(true);

    const sliderVariants = {
        hidden: { opacity: 0 }, // Start slightly scaled down with no opacity
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" } // Smooth fade-in effect
        },
        exit: {
            opacity: 0,
            // scale: 0.95, 
            transition: { duration: 0.4, ease: "easeIn" } // Smooth fade-out effect
        }
    };

    const handleCancel = () => {
        setShowOther(false);
        // Delay showing Home & Work buttons until input disappears
        setTimeout(() => {
            setShowStaticButtons(true);
        }, 500); // Matches exit animation duration
    };

    return (
        // <AnimatePresence >
        <motion.div
            variants={sliderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-[80px] w-screen h-screen bg-black/50 z-50"
        >
            <div className={`fixed left-0 top-0 w-full bg-black/50 h-full z-50`}>
                <div
                    className={`fixed w-[500px] bg-white top-0 bottom-0 left-0 z-50 overflow-y-scroll`}
                    onScroll={e => handleScroll(e)}
                >
                    <div className='relative  w-full h-full bg-white z-50 flex flex-col items-end gap-5 '>
                        <div className='relative pr-10 pb-24' >
                            <div className='  w-[70%] mt-5 flex flex-col gap-1'>

                                <div className='flex gap-5  justify-start items-center w-full'>
                                    <p
                                        className=" w-fit my-7 cursor-pointer text-xl text-gray-600"
                                        onClick={closeForm}>
                                        <RxCross1 />
                                    </p>
                                    <p className='font-bold font-display tracking-wide text-gray-700 text-nowrap'>Save delivery address</p>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <div className="relative w-full">
                                        <GoogleMaps
                                            selectedPosition={selectedPosition}
                                            setSelectedPosition={setSelectedPosition}
                                            userAdrString={userAdrString}
                                            setUserAdrString={setUserAdrString}
                                            locationInValid={locationInValid}
                                            setLocationInValid={setLocationInValid}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <Formik
                                            innerRef={formikRef}
                                            initialValues={{
                                                flatNo: '',
                                                street: '',
                                                city: '',
                                                pinCode: ''
                                            }}
                                            onSubmit={(values: formValues, actions: FormikHelpers<formValues>) => {
                                                if (!addressName) {
                                                    setShowAddressNameNotPresentError(true);
                                                    return;
                                                }
                                                else
                                                    setShowAddressNameNotPresentError(false);
                                                if (locationInValid)
                                                    return;
                                                console.log('selected', userAdrString, selectedPosition)
                                                saveAddressInDb({
                                                    ...values,
                                                    formattedGoogleAddress: userAdrString,
                                                    addressName: addressName,
                                                    ...selectedPosition
                                                }).then(_resp => { dispatch(hideAddressSlider()); alert('Address saved'); actions.resetForm() })
                                                    .catch((error: Error | AxiosError) => {
                                                        if (axios.isAxiosError(error) && error.status === 412) {
                                                            setAddressNameAlreadyUsed(true);
                                                            alert(`An address with title ${addressName} already exists`);
                                                            // actions.setSubmitting(false);
                                                            setShowAddressNameNotPresentError(true);
                                                        }
                                                    })

                                            }}
                                            validationSchema={saveAddressSchema}
                                        >
                                            {({ errors }) => (                                             // form for address details
                                                <Form>
                                                    {
                                                        Object.keys(errors).length > 0 &&
                                                        <p className='font-semibold text-rose-600 text-sm pb-1'> *Fill the required fields</p>
                                                    }
                                                    <FormikModifiedField fieldName='flatNo' fieldLabel="Flat/House no" />
                                                    <FormikModifiedField fieldName='street' fieldLabel="Street / locality" />
                                                    <FormikModifiedField fieldName='city' fieldLabel="City" />
                                                    <FormikModifiedField fieldName='pinCode' fieldLabel="Pin code" />
                                                    <div className={`w-[300px] flex text-gray-500 h-12 relative 
                                                                 ${showAddressNameNotPresentError ? 'border-red-400 ring-2 ring-red-400' : ''}`}>

                                                        <AnimatePresence>
                                                            {
                                                                showStaticButtons && !showOther && staticAddressName.map(staticAdrType => (                    //Home and work buttons

                                                                    <motion.div
                                                                        initial={{ x: 0, opacity: 1 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        exit={{ x: -100, opacity: 0 }}
                                                                        transition={{ duration: 0.1 }}
                                                                        key={staticAdrType.adrName}
                                                                        className={`hover:scale-110 border-x-2 
                                                                            ${saveAddressButtonStyle} ${addressName === staticAdrType.adrName ? 'border-black' : 'border-gray-300'}`}
                                                                        onClick={() => { setAddressName(staticAdrType.adrName); setShowAddressNameNotPresentError(false) }}
                                                                    >
                                                                        {
                                                                            addressName === staticAdrType.adrName ? staticAdrType.iconForSelected : staticAdrType.iconForUnSelected
                                                                        }

                                                                        <p className=''>{staticAdrType.adrName}</p>
                                                                    </motion.div>
                                                                ))
                                                            }
                                                        </AnimatePresence>
                                                        {/* //  Other Button */}
                                                        <motion.div
                                                            initial={{ x: 0 }}
                                                            animate={showOther ? { x: 0 } : { x: 0 }}
                                                            transition={{ duration: 0.9 }}
                                                            className={`${saveAddressButtonStyle} border-r-2 transition-all hover:scale-110 ${showOther ? 'px-4 border-x-2  border-black' : ''}`}
                                                            onClick={() => {
                                                                setShowOther(prevValue => !prevValue);
                                                                setShowStaticButtons(prevValue => !prevValue);
                                                            }}
                                                        >
                                                            {showOther ? <IoLocationSharp className='text-lg' /> : <IoLocationOutline className='text-lg' />}
                                                            <p className={`${showOther ? 'text-black' : ''}`}>other</p>
                                                        </motion.div>
                                                        <AnimatePresence>
                                                            {                                                               //input textbox for other address type
                                                                showOther && <motion.div
                                                                    initial={{ x: 50, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    exit={{ x: 50, opacity: 0 }}
                                                                    transition={{ duration: 0.5 }}
                                                                    className={`w-[300px] flex text-gray-500 h-12`}
                                                                >

                                                                    <div className='w-full flex relative'>
                                                                        <input
                                                                            placeholder="Dad's home, turf, my cave..."
                                                                            className='flex-1 border-2 border-gray-300 text-xs font-cabin p-2 h-full w-full outline-none '
                                                                            onChange={(e) => {
                                                                                setAddressName(e.target.value);
                                                                                if (e.target?.value) setShowAddressNameNotPresentError(false);
                                                                            }}
                                                                        />
                                                                        <div
                                                                            className='text-xs text-orange-400 absolute right-2 top-4 font-semibold cursor-pointer'
                                                                            onClick={() => {
                                                                                handleCancel();
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            }
                                                        </AnimatePresence>
                                                    </div>
                                                    <div className='w-[300px]'>
                                                        {showAddressNameNotPresentError ?
                                                            <div className='flex mt-2 gap-3 w-full'>
                                                                <MdErrorOutline className='text-red-400 text-xl' />
                                                                <p className='text-xs text-red-400 '>
                                                                    Select/enter an address name which has not been used before
                                                                </p>
                                                            </div> : null}
                                                    </div>
                                                    <div
                                                        className='fixed bottom-0 left-0 h-20 bg-white   w-[500px]'
                                                        style={showShadowOnSubmitDiv ? { boxShadow: '0 -2px 5px  #787875' } : {}}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className={`ml-[160px] mt-5 w-[300px] mx-auto py-2 bg-orange-500
                                                                                    text-white font-semibold font-display my-2 
                                                                                    ${Object.keys(errors).length ? 'cursor-not-allowed' : ''}`}
                                                            disabled={Object.keys(errors).length || locationInValid ? true : false}
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
        // </AnimatePresence>
    )
}

export default SaveDeliveryAddress