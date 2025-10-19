// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { MdOutlineAddBusiness } from "react-icons/md";
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
// import { useGlobalContext } from '../provider/globalProvider';
// import { useSelector } from 'react-redux';
// import { BiSolidOffer } from "react-icons/bi";
// import { FaMapMarkerAlt, FaShoppingBag, FaTruck } from "react-icons/fa";
// import AddAddress from '../components/AddAddress';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import Axios from '../utils/axios';
// import SummaryApi from '../comman/summaryApi';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { FaPhoneAlt } from "react-icons/fa";


// const CheckOutPage = () => {
//   const { notDiscountTotalPrice, totalPrice, fetchCartItems, fetchOrderList } = useGlobalContext();
//   const cartItems = useSelector(state => state.cartItem.cart);
//   const addressList = useSelector(state => state.addresses.addressList);

//   const [selectAddress, setSelectAddress] = useState(-1);
//   const [openAddress, setOpenAddress] = useState(false);
//   const [isLoadingCOD, setIsLoadingCOD] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState('');
//   const [couponCode, setCouponCode] = useState('');
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

//   const navigate = useNavigate();

//   // Find first active address on mount
//   useEffect(() => {
//     const firstActiveIndex = addressList.findIndex(address => address.status === true);
//     if (firstActiveIndex >= 0) {
//       setSelectAddress(firstActiveIndex);
//     }
//   }, [addressList]);

//   // Delivery date calculation
//   const deliveryRange = useMemo(() => {
//     const now = new Date();
//     const startDelivery = new Date(now);
//     startDelivery.setDate(now.getDate() + 2);
//     const endDelivery = new Date(now);
//     endDelivery.setDate(now.getDate() + 6);
    
//     const formatDate = (date) => date.toLocaleDateString(undefined, {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//     });
    
//     return `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;
//   }, []);

//   // Pricing calculations
//   // const { savedAmount, deliveryCharge, finalTotal } = useMemo(() => {
//   //   const saved = Math.max(notDiscountTotalPrice - totalPrice, 0);
//   //   const delivery = totalPrice > 500 ? 0 : 0;
//   //   const final = totalPrice + delivery;
    
//   //   return { savedAmount: saved, deliveryCharge: delivery, finalTotal: final };
//   // }, [notDiscountTotalPrice, totalPrice]);
//   const { savedAmount, deliveryCharge, finalTotal } = useMemo(() => {
//   const saved = Math.max(notDiscountTotalPrice - totalPrice, 0);
//   const delivery = totalPrice > 500 ? 0 : 0;
//   let final = totalPrice + delivery;

//   if (appliedCoupon) {
//     if (appliedCoupon.discountType === "percent") {
//       const discount = Math.min(
//         Math.ceil((final * appliedCoupon.discountValue) / 100),
//         appliedCoupon.maxDiscount || final
//       );
//       setCouponDiscount(discount);
//       final = final - discount;
//     } else if (appliedCoupon.discountType === "flat") {
//       const discount = appliedCoupon.discountValue;
//       setCouponDiscount(discount);
//       final = final - discount;
//     }
//   } else {
//     setCouponDiscount(0);
//   }

//   return { savedAmount: saved, deliveryCharge: delivery, finalTotal: final };
//   }, [notDiscountTotalPrice, totalPrice, appliedCoupon]);

//   const handleApplyCoupon = async () => {
//   if (!couponCode) {
//     toast.error("Please enter a coupon code");
//     return;
//   }

//   try {
//     setIsApplyingCoupon(true);

//     // Send cart total and optionally userId
//     const response = await Axios.post("/api/coupon/validate", {
//       code: couponCode,
//       cartTotal: totalPrice, // <-- important
//     });

//     if (response.data.success) {
//       setAppliedCoupon({
//         code: response.data.data.couponCode,
//         discountValue: response.data.data.discount,
//         discountType: "flat" // backend already calculates the actual discount
//       });
//       toast.success(`Coupon "${couponCode}" applied!`);
//     } else {
//       setAppliedCoupon(null);
//       toast.error(response.data.message || "Invalid coupon");
//     }
//   } catch (error) {
//     setAppliedCoupon(null);
//     toast.error(error?.response?.data?.message || "Failed to apply coupon");
//   } finally {
//     setIsApplyingCoupon(false);
//   }
//   };



//   // Validate selected address
//   const isValidAddress = useMemo(() => {
//     if (selectAddress === -1 || !addressList[selectAddress]) return false;
    
//     const address = addressList[selectAddress];
//     return (
//       address.status &&
//       address.mobile &&
//       address.address_line &&
//       address.city &&
//       address.country &&
//       address.pincode
//     );
//   }, [selectAddress, addressList]);

//   // Handle Cash on Delivery
//   const handleCashOnDelivery = useCallback(async () => {
//     if (!isValidAddress) {
//       toast.error("Please select a valid delivery address with complete details.");
//       return;
//     }

//     try {
//       setIsLoadingCOD(true);
//       setSelectedPayment('cod');

//       const transformedItems = cartItems.map(item => ({
//         quantity: item.quantity,
//         productId: {
//           _id: item.productId._id,
//           name: item.productId.name,
//           image: item.productId.image,
//           price: item.productId.price,
//           discount: item.productId.discount || 0,
//           tax: item.productId.tax || 0,
//         }
//       }));

//       const response = await Axios({
//         ...SummaryApi.CashOnDeliveryOrder,
//         data: {
//           list_items: transformedItems,
//           addressId: addressList[selectAddress]._id,
//           subtotalAmt: totalPrice,
//           totalAmt: finalTotal,
//         }
//       });

//       if (response.data.success) {
//         toast.success(response.data.message);
//         fetchCartItems?.();
//         navigate('/order-success', { state: { text: 'Order' } });
//       }
      
//       fetchOrderList?.();
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setIsLoadingCOD(false);
//     }
//   }, [isValidAddress, cartItems, addressList, selectAddress, totalPrice, finalTotal, fetchCartItems, navigate, fetchOrderList]);

//   // Handle Online Payment
//   const handleOnlinePayment = useCallback(async () => {
//     if (!isValidAddress) {
//       toast.error("Please select a valid delivery address with complete details.");
//       return;
//     }

//     try {
//       toast.dismiss();
//       toast.loading("Redirecting to payment...");
//       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHED_KEY;
//       const stripePromise = await loadStripe(stripePublicKey);

//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: {
//           list_items: cartItems,
//           addressId: addressList[selectAddress]._id,
//           subtotalAmt: totalPrice,
//           totalAmt: finalTotal,
//         }
//       });

//       if (response.data?.id) {
//         setSelectedPayment('online');
//         stripePromise.redirectToCheckout({ sessionId: response.data.id });
//       }
      
//       fetchOrderList?.();
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   }, [isValidAddress, cartItems, addressList, selectAddress, totalPrice, finalTotal, fetchOrderList]);

//   // Product List Component
//   const ProductList = useMemo(() => (
//     <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//         <FaShoppingBag className="text-amber-600" />
//         Order Items ({cartItems.length})
//       </h3>
      
//       <div className="space-y-4">
//         {cartItems.map((item, index) => (
//           <div key={item?.productId?._id || index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
//             <img
//               src={item?.productId?.image?.[0]}
//               alt={item?.productId?.name}
//               className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//             />
//             <div className="flex-1 min-w-0">
//               <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
//                 {item?.productId?.name}
//               </h4>
//               <p className="text-xs text-gray-500 mt-1">{item?.productId?.unit}</p>
//               <div className="flex items-center justify-between mt-2">
//                 <span className="text-sm font-semibold text-amber-600">
//                   {DisplayPriceInRupees(item?.productId?.price)}
//                 </span>
//                 <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   ), [cartItems]);

//   // Address Selection Component
//   const AddressSelection = useMemo(() => (
//     <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//         <FaMapMarkerAlt className="text-amber-600" />
//         Delivery Address
//       </h3>

//       <div className="space-y-4">
//         {addressList.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No saved addresses found.</p>
//         ) : (
//           addressList.map((address, index) => {
//             if (!address.status) return null;
            
//             const isSelected = selectAddress === index;
//             const isComplete = address.mobile && address.address_line && address.city && address.country && address.pincode;

//             return (
//               <label
//                 key={address._id || index}
//                 className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
//                   isSelected 
//                     ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 } ${!isComplete ? 'opacity-60' : ''}`}
//               >
//                 <div className="flex items-start gap-4">
//                   <input
//                     type="radio"
//                     value={index}
//                     checked={isSelected}
//                     onChange={() => setSelectAddress(index)}
//                     name="address"
//                     className="mt-1 accent-amber-600"
//                   />
                  
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-800 text-sm">
//                           {address.address_line}, {address.city} - {address.pincode}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {address.state}, {address.country}
//                         </p>
//                         {address.landMark && (
//                           <p className="text-gray-500 text-xs mt-1">Landmark: {address.landMark}</p>
//                         )}
//                         <p className="flex items-center justify-start gap-2 font-medium text-gray-700 text-sm mt-2">
//                           <FaPhoneAlt /> {address.mobile}
//                         </p>
//                       </div>
                      
//                       <span className={`text-xs px-3 py-1 rounded-full font-medium ${
//                         address.address_type === "Home" 
//                           ? "bg-green-100 text-green-700" 
//                           : "bg-blue-100 text-blue-700"
//                       }`}>
//                         {address.address_type}
//                       </span>
//                     </div>
                    
//                     {!isComplete && (
//                       <p className="text-red-500 text-xs mt-2 font-medium">
//                         ⚠️ Incomplete address - Please edit to add missing details
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </label>
//             );
//           })
//         )}

//         {/* Add New Address Card */}
//         <div
//           onClick={() => setOpenAddress(true)}
//           className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-gray-600 cursor-pointer py-6 hover:bg-gray-100 transition-colors"
//         >
//           <div className="p-2 bg-white rounded-xl border border-gray-200">
//             <MdOutlineAddBusiness className="text-2xl" />
//           </div>
//           <span className="font-medium">Add New Address</span>
//         </div>
//       </div>
//     </div>
//   ), [addressList, selectAddress]);

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto p-4 ">
//         {/* Header - Consistent with other pages */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
//           <div className="flex items-center gap-3 mb-3 sm:mb-0">
//             <div className="p-2 bg-amber-50 rounded-xl">
//               <FaTruck className="text-amber-600 text-xl" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-xl text-gray-800">Checkout</h2>
//               <p className="text-sm text-gray-600">Complete your order</p>
//             </div>
//           </div>
          
//           <div className="text-sm text-gray-500 bg-amber-50 px-3 py-2 rounded-xl">
//             Estimated delivery: <span className="font-medium text-amber-700">{deliveryRange}</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Address & Products */}
//           <div className="lg:col-span-2 space-y-6">
//             {AddressSelection}
//             {ProductList}
//           </div>

//           {/* Right Column - Order Summary & Payment */}
//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2 items-center">
//               <div className='flex items-center w-full gap-2'>
//                 <input
//                   type="text"
//                   placeholder="Enter coupon code"
//                   className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                 />
//                 <button
//                   onClick={handleApplyCoupon}
//                   disabled={isApplyingCoupon}
//                   className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
//                 >
//                   {isApplyingCoupon ? "Applying..." : "Apply"}
//                 </button>
//               </div>

//               {appliedCoupon && (
//               <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 mt-2 text-green-800">
//                 <BiSolidOffer className="text-green-600 text-lg" />
//                 <span>
//                   Coupon "{appliedCoupon.code}" applied - You saved {DisplayPriceInRupees(couponDiscount)}
//                 </span>
//                 <button
//                   onClick={() => setAppliedCoupon(null)}
//                   className="ml-auto text-red-600 font-bold"
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}
//             </div>


//             {/* Order Summary */}
//             <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

//               <div className="space-y-3 text-sm text-gray-700">
//                 <div className="flex justify-between">
//                   <span>Price ({cartItems.length} items)</span>
//                   <span>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Discount</span>
//                   <span className="text-green-600">- {DisplayPriceInRupees(savedAmount)}</span>
//                 </div>
//                 {
//                   appliedCoupon && (
//                     <div className="flex justify-between">
//                       <span>Coupon(s)</span>
//                       <span className="text-green-600">- {DisplayPriceInRupees(couponDiscount)}</span>
//                     </div>
//                   )
//                 }
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>{DisplayPriceInRupees(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Delivery Charges</span>
//                   <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
//                     {deliveryCharge === 0 ? "FREE" : DisplayPriceInRupees(deliveryCharge)}
//                   </span>
//                 </div>

//                 {savedAmount > 0 && (
//                   <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 mt-4">
//                     <BiSolidOffer className="text-green-600 text-lg" />
//                     <span className="text-green-800 text-sm font-medium">
//                       You saved <strong>{DisplayPriceInRupees(savedAmount)}</strong>
//                     </span>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-200 pt-4 mt-3 flex justify-between text-base font-semibold text-gray-900">
//                   <span>Total Amount</span>
//                   <span>{DisplayPriceInRupees(finalTotal)}</span>
//                 </div>
//               </div>

//               {/* Payment Buttons */}
//               <div className="mt-6 space-y-3">
//                 <button
//                   onClick={handleOnlinePayment}
//                   // disabled={!isValidAddress}
//                   disabled={true}
//                   className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
//                     !isValidAddress
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : selectedPayment === 'online'
//                       ? 'bg-amber-700 text-white'
//                       : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
//                   }`}
//                 >
//                   {selectedPayment === 'online' ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Processing Payment...
//                     </div>
//                   ) : (
//                     'Pay Online: Coming Soon!'
//                   )}
//                 </button>

//                 <button
//                   onClick={handleCashOnDelivery}
//                   disabled={!isValidAddress || isLoadingCOD}
//                   className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
//                     !isValidAddress
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : selectedPayment === 'cod'
//                       ? 'bg-amber-600 text-white'
//                       : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
//                   }`}
//                 >
//                   {isLoadingCOD ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
//                       Placing Order...
//                     </div>
//                   ) : selectedPayment === 'cod' ? (
//                     'Cash on Delivery'
//                   ) : (
//                     'Cash on Delivery'
//                   )}
//                 </button>
//               </div>

//               {!isValidAddress && selectAddress !== -1 && (
//                 <p className="text-red-500 text-sm text-center mt-3 font-medium">
//                   Please complete the address details to proceed
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </div>
//   );
// };

// export default React.memo(CheckOutPage);



import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MdOutlineAddBusiness } from "react-icons/md";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import { useGlobalContext } from '../provider/globalProvider';
import { useSelector } from 'react-redux';
import { BiSolidOffer } from "react-icons/bi";
import { FaMapMarkerAlt, FaShoppingBag, FaTruck } from "react-icons/fa";
import AddAddress from '../components/AddAddress';
import AxiosToastError from '../utils/AxiosToastErroe';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { FaPhoneAlt } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import Divider from '../components/Divider'


const CheckOutPage = () => {
  const { notDiscountTotalPrice, totalPrice, fetchCartItems, fetchOrderList } = useGlobalContext();
  const cartItems = useSelector(state => state.cartItem.cart);
  const addressList = useSelector(state => state.addresses.addressList);
  const user = useSelector(state => state.user);
  console.log("cartItems:", cartItems)

  const [selectAddress, setSelectAddress] = useState(-1);
  const [openAddress, setOpenAddress] = useState(false);
  const [isLoadingCOD, setIsLoadingCOD] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();


  // Find first active address on mount
  useEffect(() => {
    const firstActiveIndex = addressList.findIndex(address => address.status === true);
    if (firstActiveIndex >= 0) {
      setSelectAddress(firstActiveIndex);
    }
  }, [addressList]);

  // Delivery date calculation
  const deliveryRange = useMemo(() => {
    const now = new Date();
    const startDelivery = new Date(now);
    startDelivery.setDate(now.getDate() + 2);
    const endDelivery = new Date(now);
    endDelivery.setDate(now.getDate() + 6);
    
    const formatDate = (date) => date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    
    return `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;
  }, []);

  // Enhanced Coupon Application Function
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setIsApplyingCoupon(true);

      // Step 1: Validate coupon
      const validationResponse = await Axios.post("/api/coupon/validate", {
        code: couponCode.trim().toUpperCase(),
        cartTotal: totalPrice,
        userId: user._id
      });

      if (validationResponse.data.success) {
        // Step 2: Get full coupon details
        const detailsResponse = await Axios.get(`/api/coupon/details?code=${couponCode.trim().toUpperCase()}`);
        
        if (detailsResponse.data.success) {
          const fullCouponData = detailsResponse.data.data;
          
          setAppliedCoupon({
            code: fullCouponData.code,
            discountValue: fullCouponData.discountValue,
            discountType: fullCouponData.discountType,
            minAmount: fullCouponData.minAmount,
            maxDiscount: fullCouponData.maxDiscount,
            couponId: fullCouponData._id,
            calculatedDiscount: validationResponse.data.data.discount,
            finalPrice: validationResponse.data.data.finalPrice
          });
          
          setCouponDiscount(validationResponse.data.data.discount);
          toast.success(`Coupon "${couponCode}" applied! 🎉`);
        } else {
          throw new Error("Failed to get coupon details");
        }
      } else {
        resetCoupon();
        toast.error(validationResponse.data.message || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Coupon application error:", error);
      resetCoupon();
      
      const errorMessage = error?.response?.data?.message || 
                          error.message || 
                          "Failed to apply coupon. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Helper function to reset coupon state
  const resetCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    resetCoupon();
    toast.success("Coupon removed");
  };

  // Pricing calculations
  const { savedAmount, deliveryCharge, finalTotal } = useMemo(() => {
    const saved = Math.max(notDiscountTotalPrice - totalPrice, 0);
    const delivery = totalPrice > 500 ? 0 : 0;
    let final = totalPrice + delivery;

    // Apply coupon discount if available
    if (appliedCoupon && appliedCoupon.calculatedDiscount) {
      final = Math.max(final - appliedCoupon.calculatedDiscount, 0);
    }

    return { 
      savedAmount: saved, 
      deliveryCharge: delivery, 
      finalTotal: final 
    };
  }, [notDiscountTotalPrice, totalPrice, appliedCoupon]);

  // Validate selected address
  const isValidAddress = useMemo(() => {
    if (selectAddress === -1 || !addressList[selectAddress]) return false;
    
    const address = addressList[selectAddress];
    return (
      address.status &&
      address.mobile &&
      address.address_line &&
      address.city &&
      address.country &&
      address.pincode
    );
  }, [selectAddress, addressList]);

  // Enhanced Cash on Delivery Function
  const handleCashOnDelivery = useCallback(async () => {
    if (!isValidAddress) {
      toast.error("Please select a valid delivery address with complete details.");
      return;
    }

    try {
      setIsLoadingCOD(true);
      setSelectedPayment('cod');

      const transformedItems = cartItems.map(item => ({
        quantity: item.quantity,
        productId: {
          _id: item.productId._id,
          name: item.productId.name,
          image: item.productId.image,
          price: item.productId.price,
          discount: item.productId.discount || 0,
          tax: item.productId.tax || 0,
        }
      }));

      // Enhanced order data with comprehensive coupon information
      const orderData = {
        list_items: transformedItems,
        addressId: addressList[selectAddress]._id,
        subtotalAmt: totalPrice,
        totalAmt: finalTotal,
        originalTotal: totalPrice, // Store original total before coupon
      };

      // Include comprehensive coupon information if applied
      if (appliedCoupon) {
        orderData.couponInfo = {
          code: appliedCoupon.code,
          couponId: appliedCoupon.couponId,
          discount: appliedCoupon.calculatedDiscount,
          discountType: appliedCoupon.discountType,
          discountValue: appliedCoupon.discountValue,
          maxDiscount: appliedCoupon.maxDiscount,
          minAmount: appliedCoupon.minAmount
        };
        orderData.finalAmount = appliedCoupon.finalPrice;
        orderData.couponDiscount = appliedCoupon.calculatedDiscount;
      }

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: orderData
      });

      if (response.data.success) {
        // Clear coupon after successful order
        resetCoupon();
        
        toast.success(response.data.message);
        fetchCartItems?.();
        navigate('/order-success', { 
          state: { 
            text: 'Order',
            couponApplied: !!appliedCoupon,
            couponDiscount: appliedCoupon?.calculatedDiscount || 0,
            orderId: response.data.data?.orderId
          } 
        });
      }
      
      fetchOrderList?.();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoadingCOD(false);
    }
  }, [isValidAddress, cartItems, addressList, selectAddress, totalPrice, finalTotal, appliedCoupon, fetchCartItems, navigate, fetchOrderList, user]);

  // Enhanced Online Payment Function
  const handleOnlinePayment = useCallback(async () => {
    if (!isValidAddress) {
      toast.error("Please select a valid delivery address with complete details.");
      return;
    }

    try {
      toast.dismiss();
      toast.loading("Redirecting to payment...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHED_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      // Enhanced payment data with coupon information
      const paymentData = {
        list_items: cartItems,
        addressId: addressList[selectAddress]._id,
        subtotalAmt: totalPrice,
        totalAmt: finalTotal,
        originalTotal: totalPrice,
      };

      // Include comprehensive coupon information if applied
      if (appliedCoupon) {
        paymentData.couponInfo = {
          code: appliedCoupon.code,
          couponId: appliedCoupon.couponId,
          discount: appliedCoupon.calculatedDiscount,
          discountType: appliedCoupon.discountType,
          discountValue: appliedCoupon.discountValue,
          maxDiscount: appliedCoupon.maxDiscount,
          minAmount: appliedCoupon.minAmount
        };
        paymentData.finalAmount = appliedCoupon.finalPrice;
        paymentData.couponDiscount = appliedCoupon.calculatedDiscount;
      }

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: paymentData
      });

      if (response.data?.id) {
        setSelectedPayment('online');
        // Clear coupon before redirecting
        resetCoupon();
        stripePromise.redirectToCheckout({ sessionId: response.data.id });
      }
      
      fetchOrderList?.();
    } catch (error) {
      AxiosToastError(error);
    }
  }, [isValidAddress, cartItems, addressList, selectAddress, totalPrice, finalTotal, appliedCoupon, fetchOrderList, user]);

  // Product List Component
  const ProductList = useMemo(() => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaShoppingBag className="text-amber-600" />
        Order Items ({cartItems.length})
      </h3>
      <Divider/>
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div key={item?.productId?._id || index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <img
              src={item?.productId?.image?.[0]}
              alt={item?.productId?.name}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {item?.productId?.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{item?.productId?.unit}</p>
              <div className="flex items-center justify-between mt-2">
                <div className=''>
                  <span className="text-sm font-semibold text-amber-600">
                    {DisplayPriceInRupees(priceWithDiscount(item?.productId?.price, item?.productId?.discount))}
                  </span>
                  {
                    item?.productId?.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {DisplayPriceInRupees(item?.productId?.price)}
                      </span>
                    )
                  }
                  
                </div>
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [cartItems]);

  // Address Selection Component
  const AddressSelection = useMemo(() => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-amber-600" />
        Delivery Address
      </h3>

      <div className="space-y-4">
        {addressList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No saved addresses found.</p>
        ) : (
          addressList.map((address, index) => {
            if (!address.status) return null;
            
            const isSelected = selectAddress === index;
            const isComplete = address.mobile && address.address_line && address.city && address.country && address.pincode;

            return (
              <label
                key={address._id || index}
                className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isComplete ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    value={index}
                    checked={isSelected}
                    onChange={() => setSelectAddress(index)}
                    name="address"
                    className="mt-1 accent-amber-600"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {address.address_line}, {address.city} - {address.pincode}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {address.state}, {address.country}
                        </p>
                        {address.landMark && (
                          <p className="text-gray-500 text-xs mt-1">Landmark: {address.landMark}</p>
                        )}
                        <p className="flex items-center justify-start gap-2 font-medium text-gray-700 text-sm mt-2">
                          <FaPhoneAlt /> {address.mobile}
                        </p>
                      </div>
                      
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        address.address_type === "Home" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {address.address_type}
                      </span>
                    </div>
                    
                    {!isComplete && (
                      <p className="text-red-500 text-xs mt-2 font-medium">
                        ⚠️ Incomplete address - Please edit to add missing details
                      </p>
                    )}
                  </div>
                </div>
              </label>
            );
          })
        )}

        {/* Add New Address Card */}
        <div
          onClick={() => setOpenAddress(true)}
          className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-gray-600 cursor-pointer py-6 hover:bg-gray-100 transition-colors"
        >
          <div className="p-2 bg-white rounded-xl border border-gray-200">
            <MdOutlineAddBusiness className="text-2xl" />
          </div>
          <span className="font-medium">Add New Address</span>
        </div>
      </div>
    </div>
  ), [addressList, selectAddress]);

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto p-4 ">
        {/* Header - Consistent with other pages */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="p-2 bg-amber-50 rounded-xl">
              <FaTruck className="text-amber-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-gray-800">Checkout</h2>
              <p className="text-sm text-gray-600">Complete your order</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 bg-amber-50 px-3 py-2 rounded-xl">
            Estimated delivery: <span className="font-medium text-amber-700">{deliveryRange}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Address & Products */}
          <div className="lg:col-span-2 space-y-6">
            {AddressSelection}
            {ProductList}
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4">
              <div className='flex items-center w-full gap-2 mb-0'>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={isApplyingCoupon || !!appliedCoupon}
                />
                <button
                  onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                    appliedCoupon 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isApplyingCoupon ? "Applying..." : appliedCoupon ? "Remove" : "Apply"}
                </button>
              </div>

              {appliedCoupon && (
                <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-800 mt-3">
                  <BiSolidOffer className="text-green-600 text-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Coupon "{appliedCoupon.code}" applied</p>
                    <p className="text-xs">You saved {DisplayPriceInRupees(appliedCoupon.calculatedDiscount)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className='flex items-center gap-2 mb-4'>
                <IoReceiptOutline size={20}/>
                <h3 className="flex items-center text-lg font-semibold text-gray-800">Order Summary</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} items)</span>
                  <span>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">- {DisplayPriceInRupees(savedAmount)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span>Coupon Discount</span>
                    <span className="text-green-600">- {DisplayPriceInRupees(appliedCoupon.calculatedDiscount)}</span>
                  </div>
                )}

                {
                  appliedCoupon ? (
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{DisplayPriceInRupees(appliedCoupon.finalPrice)}</span>
                    </div>
                  ):(
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{DisplayPriceInRupees(totalPrice)}</span>
                    </div>
                  )
                }
                
                
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryCharge === 0 ? "FREE" : DisplayPriceInRupees(deliveryCharge)}
                  </span>
                </div>

                {savedAmount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 mt-4">
                    <BiSolidOffer className="text-green-600 text-lg" />
                    <span className="text-green-800 text-sm font-medium">
                      You saved <strong>{DisplayPriceInRupees(savedAmount)}</strong>
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-3 flex justify-between text-base font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span>{DisplayPriceInRupees(finalTotal)}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleOnlinePayment}
                  disabled={!isValidAddress}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                    !isValidAddress
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : selectedPayment === 'online'
                      ? 'bg-amber-700 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {selectedPayment === 'online' ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    'Pay Online'
                  )}
                </button>

                <button
                  onClick={handleCashOnDelivery}
                  disabled={!isValidAddress || isLoadingCOD}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                    !isValidAddress
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : selectedPayment === 'cod'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                  }`}
                >
                  {isLoadingCOD ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </div>
                  ) : (
                    'Cash on Delivery'
                  )}
                </button>
              </div>

              {!isValidAddress && selectAddress !== -1 && (
                <p className="text-red-500 text-sm text-center mt-3 font-medium">
                  Please complete the address details to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </div>
  );
};

export default React.memo(CheckOutPage);