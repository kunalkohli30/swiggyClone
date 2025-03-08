import { useEffect, useState } from 'react'
import axiosInstance from '../../config/AxiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../utils/hooks';
import { cartItemType } from '../../context/contextApi';
import { resInfoType } from '../../utils/cartSlice';
import { address } from '../cart/SaveDeliveryAddress';
import { MdArrowBackIos } from 'react-icons/md';
import { RiDiscountPercentFill } from "react-icons/ri";
import { OfferDto } from '../../interfaces/apiModels/RestaurantList';
import CouponAppliedTooltip from './CouponAppliedTooltip';
import { OrderRequestDto, OrderResponseDto } from '../../interfaces/apiModels/OrderDto';
// import OrderRequestDto from '../../interfaces/apiModels/OrderDto/OrderOrderRequestDto';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
}

const Payment = () => {

    // const { component } = useParams(); // Fetches the "userId" parameter from the URL
    // console.log('component', component);
    const navigate = useNavigate();

    const availableCouponsBgColor = '[#DDFBEF]';

    const location = useLocation();
    const selectedAddress: address = location.state || {}; // Ensure it has a default value

    const cartData: cartItemType[] = useAppSelector(state => state.cartSlice.cartItems);
    const resInfo: resInfoType | null = useAppSelector(state => state.cartSlice.resInfo);
    const checkoutFees = useAppSelector(state => state.cartSlice.checkoutFees);

    const [discountData, setDiscountData] = useState<OfferDto[]>([]);
    const [appliedOffer, setAppliedOffer] = useState<OfferDto | null>(null);
    const [showCouponTooltip, setShowCouponTooltip] = useState(false);
    const [tncAgreement, setTncAgreement] = useState(false);

    // const getOrderData = () => {
    //     const orderItems = cartData.map(cartItem => {
    //         return {
    //             foodId: cartItem.foodId,
    //             quantity: cartItem.quantity
    //         }
    //     });

    //     return {
    //         orderItems: orderItems,
    //         restaurantId: cartData[0].restaurantId,
    //         createdAt: new Date(),
    //         address: selectedAddress
    //     }
    // }

    // console.log('order details', orderDetails);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => console.log("Razorpay script loaded");
        document.body.appendChild(script);

        fetchOffers();
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {

        if (!window.Razorpay) {
            console.error("Razorpay SDK is not loaded yet.");
            return;
        }

        try {
            // Call backend to create an order
            // const response = await axiosInstance("http://localhost:8080/api/razorpay/create-order?amount=500", {
            const response = await axiosInstance.post("/api/order", {
                restaurantId: resInfo?.restaurantId,
                createdAt: new Date().toISOString(),
                addressId: selectedAddress.userAddressId,
                deliveryFee: checkoutFees.deliveryFee,
                deliveryTip: checkoutFees.deliveryTip,
                gstAndCharges: gstAndCharges,
                couponCode: appliedOffer?.couponCode,
                discountAmount: getDiscountAmount(),
                orderItems: cartData.map(item => {
                    return {
                        foodId: item.foodId,
                        quantity: item.quantity
                    }
                })
            } as OrderRequestDto);

            const order: OrderResponseDto = await response.data;
            console.log('order', order);

            // Load Razorpay checkout
            const options = {
                key: process.env.RAZORPAY_KEY,
                amount: order.amount,
                currency: "INR",
                name: "Urban Eats",
                description: "Payment to Urban Eats",
                order_id: order.razorPayOrderId,
                method: {
                    netbanking: "0", // Disable Net Banking
                    card: "1", // Enable Cards
                    upi: "1", // Disable UPI
                    wallet: "0", // Disable Wallets
                },
                handler: function (response: RazorpayPaymentResponse) {
                    // console.log("Payment Successful! Payment ID: " + response.razorpay_payment_id + "," + response.razorpay_order_id + ", " + response.razorpay_signature);
                    paymentVerification(response);

                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "8368759436",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error in payment:", error);
        }
    };

    const paymentVerification = (response: RazorpayPaymentResponse) => {
        axiosInstance.post("/api/razorpay/payment-confirmation", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            paymentSignature: response.razorpay_signature,
        }).then(
            (response) => {
                console.log("Payment Verified", response.data);
                navigate("/profile");
                // alert("Payment Successful! Payment ID: " + response.data);
            },
            (error) => {
                console.error("Payment Verification Failed", error);
            }
        )
    }

    const getTotalItems = () => cartData
        .map(item => item?.quantity ?? 0)
        .reduce((total, item) => total + item);
        
    const getTotalAmount = () => cartData.reduce((total, item) => total + (item.unitPrice ? (item.quantity ?? 0) * item?.unitPrice : 0), 0) + checkoutFees.deliveryFee + checkoutFees.deliveryTip;
    const getDiscountAmount = () => {
        if (appliedOffer) {
            const total = getTotalAmount();
            if (appliedOffer?.offerType === 'amount') {
                return appliedOffer?.discountAmount;
            } else {
                const percentageDiscount = appliedOffer.discountPercentage ? total * appliedOffer?.discountPercentage / 100 : 0;
                return Math.min(percentageDiscount, appliedOffer.maxDiscountAmount);
            }
        } else return 0;
    }
    const totalAmount = getTotalAmount();
    const gstAndCharges = Math.round(totalAmount * 18 / 100);

    const fetchOffers = async () => {
        const offers = await axiosInstance.get("api/public/restaurant/offers");
        setDiscountData(offers.data);   //to show in slider in "deals for you"
    }

    return (
        // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
        //     <h2 style={{ marginBottom: '20px' }}>Payment</h2>
        //     <button
        //         onClick={handlePayment}
        //         style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        //     >
        //         Pay Now
        //     </button>
        // </div>

        <div className='w-[75%] md:w-[65%] lg:w-[55%] flex flex-col mx-auto mt-10'>
            <div className="flex items-center justify-start gap-4 border-b-2 border-gray-200 pb-4">
                <MdArrowBackIos className='text-xl font-extralight' />
                <div className="flex flex-col">
                    <p className='font-semibold font-cabin'>Payment Options</p>
                    <div className='font-display text-gray-600 text-xs'>{`${getTotalItems()} items • Total: ₹${getTotalAmount()}`}</div>
                </div>
            </div>
            <div className='flex gap-4 py-5' >
                <div className='flex flex-col items-center '>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="4.5" fill="white" stroke="#6541E4" stroke-width="3"></circle></svg>
                    <svg width="4" height="15" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 0V27" stroke="#6541E4" stroke-width="5"></path></svg>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="4.5" fill="white" stroke="#6541E4" stroke-width="3"></circle></svg>
                </div>
                <div className='flex flex-col items-start -mt-1'>
                    <p className='font-semibold font-display text-sm'>{`${resInfo?.restaurantName}`}</p>
                    <p>
                        <span className='font-semibold font-roboto text-sm'>{`${selectedAddress.addressName}`}</span>
                        <span> | </span>
                        <span className='font-display text-xs tracking-wide text-gray-400'>{`${selectedAddress.flatNo} ${selectedAddress.street} ${selectedAddress.city}-${selectedAddress.pinCode}`}</span>
                    </p>
                </div>
            </div>
            <div>
                {appliedOffer === null &&
                    <div className={`bg-[#DDFBEF] text-[#1BA672] font-semibold font-cabin px-5 py-3 inline-flex justify-center items-center w-full gap-4 rounded-lg `}>
                        <RiDiscountPercentFill className='text-2xl' />
                        Available coupons
                    </div>
                }
                <div className='flex flex-col gap-2 mt-4'>                  {/* offers */}
                    {appliedOffer === null &&
                        discountData.length && discountData.map((offer) => (

                            <div className='flex gap-4 items-center justify-between px-6 py-2 border-2 border-gray-200 rounded-lg'>
                                <img src={offer.offerLogo} className='w-10 h-10' />
                                <div className='flex flex-col gap-1 flex-1'>
                                    <div className='font-roboto flex   flex-col'>       {/*  offer details   */}
                                        <p className='font-semibold text-orange-600'>{offer.header}</p>
                                        <p className=' text-gray-400 text-xs'>
                                            {offer.discountAmount !== 0 ?
                                                `   Up to ₹${offer.maxDiscountAmount} on orders above ${offer.minimumOrderValue}` :
                                                `Flat discount on orders above ${offer.minimumOrderValue}`
                                            }
                                        </p>
                                    </div>
                                </div>
                                {/* <button className='bg-[#1BA672] text-white font-semibold font-cabin px-4 py-2 rounded-lg'>Apply</button> */}
                                <div className='flex flex-col'>                 {/*   coupon code button  */}
                                    <div className='font-semibold font-cabin text-sm '>
                                        <button
                                            className={`${getTotalAmount() > offer.minimumOrderValue ? 'bg-yellow-200 border-yellow-400 ' : 'bg-yellow-100 border-gray-300'} border-2  w-44 flex justify-center py-[2px]`}
                                            disabled={getTotalAmount() < offer.minimumOrderValue}
                                            onClick={() => { setAppliedOffer(offer); setShowCouponTooltip(true); }}
                                        >
                                            {getTotalAmount() > offer.minimumOrderValue ? offer.couponCode : offer.couponCode.split(' ')[1]}
                                        </button>
                                    </div>
                                    {getTotalAmount() < offer.minimumOrderValue
                                        ? <p className='text-xs text-red-600 font-cabin mt-1'>{`Add ₹${offer.minimumOrderValue - getTotalAmount()} more to avail this offer`}</p> : null
                                    }
                                </div>
                            </div>

                        ))
                    }
                    {appliedOffer !== null && (
                        <div className={`flex justify-between gap-8 items-center px-6 py-2 border-2 border-[#1BA672] border-dashed rounded-lg bg-${availableCouponsBgColor}`}>
                            <img src={appliedOffer.offerLogo} className='w-10 h-10' />
                            <div className='flex flex-col flex-1'>
                                <div className='  text-[#1BA672] font-bold text-lg'>
                                    {appliedOffer.couponCode}
                                </div>
                                <p className='text-xs text-[#1BA672] font-cabin'>Applied on the bill</p>
                            </div>
                            <p className='font-bold font-display cursor-pointer' onClick={() => setAppliedOffer(null)}>REMOVE</p>

                        </div>
                    )
                    }
                </div>
            </div>

            <div className='flex flex-col gap-4 mt-6 p-4 bg-gray-50 rounded-lg shadow-md'>
                <div className='flex justify-between items-center'>
                    <p className='font-semibold font-cabin text-sm'>Net Payable</p>
                    <p className='font-semibold font-cabin text-sm'>₹{totalAmount}</p>
                </div>
                <div className='flex justify-between items-center'>
                    <p className='font-semibold font-cabin text-sm'>GST and Restaurant Charges (18%)</p>
                    <p className='font-semibold font-cabin text-sm'>₹{Math.round(totalAmount * 18 / 100)}</p>
                </div>
                {
                    appliedOffer !== null && (
                        <div className='flex justify-between items-center text-[#1BA672]'>
                            <p className='font-semibold font-cabin text-sm'>Coupon Discount</p>
                            <p className='font-semibold font-cabin text-sm'>-₹{getDiscountAmount()}</p>
                        </div>
                    )
                }
                <div className='flex justify-between items-center border-t-2 border-gray-200 pt-4 '>
                    <p className='font-semibold font-cabin text-lg'>Total Amount</p>
                    <p className='font-semibold font-cabin text-lg'>₹{totalAmount + Math.round(totalAmount * 18 / 100) - getDiscountAmount()}</p>
                </div>
            </div>
            <div className='flex flex-col gap-4 mt-6'>
                <button
                    className={`${tncAgreement ? 'bg-[#1BA672]' : 'bg-gray-400'} text-white font-semibold font-cabin px-4 py-2 rounded-lg`}
                    onClick={handlePayment}
                    disabled={!tncAgreement}
                >
                    Pay Now
                </button>
                <div className='flex items-center gap-2 -mt-2 pb-4'>
                    <input type="checkbox" onChange={(e) => setTncAgreement(e.target.checked)} />
                    <p className='font-roboto text-xs text-gray-400'>I agree to the Terms & Conditions</p>
                </div>
            </div>
            <div>
                {appliedOffer !== null && showCouponTooltip && <CouponAppliedTooltip
                    appliedOffer={appliedOffer}
                    getDiscountAmount={getDiscountAmount}
                    setShowCouponTooltip={setShowCouponTooltip}
                />
                }
            </div>
        </div >
    );
}
export default Payment;