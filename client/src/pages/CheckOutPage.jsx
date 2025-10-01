import React, { useState, useEffect } from 'react';
import { MdOutlineAddBusiness } from "react-icons/md";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/globalProvider';
import { useSelector } from 'react-redux';
import { BiSolidOffer } from "react-icons/bi";
import AddAddress from '../components/AddAddress';
import AxiosToastError from '../utils/AxiosToastErroe';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckOutPage = () => {
  const { notDiscountTotalPrice, totalPrice, fetchCartItems, fetchOrderList } = useGlobalContext();
  const cartItems = useSelector(state => state.cartItem.cart);
  const addressList = useSelector(state => state.addresses.addressList);

  // Default select first address with status true
  const firstActiveAddressIndex = addressList.findIndex(address => address.status === true);
  const [selectAddress, setSelectAddress] = useState(firstActiveAddressIndex >= 0 ? firstActiveAddressIndex : 0);

  const [openAddress, setOpenAddress] = useState(false);
  const [isLoadingCOD, setIsLoadingCOD] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');

  const navigate = useNavigate();

  // Delivery date range calculation
  const now = new Date();
  const startDelivery = new Date(now);
  startDelivery.setDate(now.getDate() + 2);
  const endDelivery = new Date(now);
  endDelivery.setDate(now.getDate() + 6);

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  const deliveryRange = `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;

  // Pricing
  const savedAmount = Math.max(notDiscountTotalPrice - totalPrice, 0);
  const deliveryCharge = totalPrice > 500 ? 0 : 0; //delivery charge
  const subtotal = totalPrice;
  const finalTotal = subtotal + deliveryCharge;

  // When address list changes (e.g. add new), reset selectAddress if needed
  useEffect(() => {
    if (addressList.length === 0) {
      setSelectAddress(-1);
    } else if (selectAddress < 0 || !addressList[selectAddress] || !addressList[selectAddress].status) {
      // Select first active address again
      const firstActiveIndex = addressList.findIndex(addr => addr.status === true);
      setSelectAddress(firstActiveIndex >= 0 ? firstActiveIndex : 0);
    }
  }, [addressList, selectAddress]);

  const handleCashOnDelivery = async () => {
    if (selectAddress === -1 || !addressList[selectAddress]) {
      toast.error("Please select a valid delivery address.");
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

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: transformedItems,
          addressId: addressList[selectAddress]._id,
          subtotalAmt: totalPrice,
          totalAmt: finalTotal,
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItems?.();
        navigate('/order-success', { state: { text: 'Order' } });
      }
      if (fetchOrderList) {
        fetchOrderList();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoadingCOD(false);
    }
  };


  const handleOnlinePayment = async () => {
    if (selectAddress === -1 || !addressList[selectAddress]) {
      toast.error("Please select a valid delivery address.");
      return;
    }

    try {
      toast.dismiss();
      toast.loading("Redirecting to payment...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHED_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItems,
          addressId: addressList[selectAddress]._id,
          subtotalAmt: totalPrice,
          totalAmt: finalTotal,
        }
      });

      const { data: responseData } = response;

      if (responseData && responseData.id) {
        setSelectedPayment('online');
        stripePromise.redirectToCheckout({ sessionId: responseData.id });
      }
      if(fetchOrderList){
        fetchOrderList()
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4">

        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Address Card */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-5 text-gray-800">Choose Delivery Address</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {addressList.length === 0 && (
                <p className="text-gray-500">No saved addresses. Please add one.</p>
              )}
              {addressList.map((address, index) => {
                if (!address.status) return null;
                const isSelected = selectAddress === index;

                return (
                  <label
                    htmlFor={"address" + index}
                    key={address._id || index}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md group ${
                      isSelected ? 'border-amber-600 ring-2 ring-amber-200 bg-amber-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        value={index}
                        checked={isSelected}
                        onChange={() => setSelectAddress(index)}
                        name="address"
                        id={"address" + index}
                        className="mt-1 accent-amber-600"
                      />

                      <div className="flex-1 text-sm text-gray-700 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-800">
                            {address.address_line}, {address.city}, {address.pincode}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            address.address_type === "Home"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {address.address_type}
                          </span>
                        </div>
                        <p>{address.state}, {address.country}</p>
                        {address.landMark && <p className="text-gray-500">Landmark: {address.landMark}</p>}
                        <p className="font-medium">Mobile: {address.mobile}</p>
                      </div>
                    </div>
                  </label>
                );
              })}

              <div
                onClick={() => setOpenAddress(true)}
                className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition rounded-xl flex items-center justify-center gap-3 text-gray-600 cursor-pointer py-6"
              >
                <div className="bg-white p-2 rounded-full border border-gray-300">
                  <MdOutlineAddBusiness className="text-2xl text-gray-500" />
                </div>
                <span className="text-base font-medium">Add New Address</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary + Payment */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">- {DisplayPriceInRupees(savedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{DisplayPriceInRupees(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? "FREE" : DisplayPriceInRupees(deliveryCharge)}</span>
              </div>

              <div className="bg-green-50 text-green-700 text-sm font-medium flex items-center gap-2 justify-center py-3 rounded-xl shadow-inner mt-3">
                <BiSolidOffer className="text-2xl text-green-600" />
                <span>
                  You saved <strong>{DisplayPriceInRupees(savedAmount)}</strong> on this order
                </span>
              </div>

              <div className="border-t border-dashed pt-4 mt-4 flex justify-between text-base font-semibold text-gray-800">
                <span>Total Amount</span>
                <span>{DisplayPriceInRupees(finalTotal)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled
                onClick={handleOnlinePayment}
                // disabled={selectedPayment === 'online'} // disable button when selected to prevent double click
                className={`w-full cursor-pointer py-3 rounded-lg text-white font-medium transition
                  ${selectedPayment === 'online' ? 'bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {selectedPayment === 'online' ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : (
                  // 'Pay Online'
                  'Pay Online: Comming Soon!'
                )}
              </button>

              <button
                onClick={handleCashOnDelivery}
                disabled={isLoadingCOD}
                className={`w-full py-3 rounded-lg font-medium transition
                  ${selectedPayment === 'cod' ? 'bg-amber-400 text-white' : 'bg-amber-200 text-amber-800 hover:bg-amber-300'}
                  ${isLoadingCOD ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {isLoadingCOD ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-amber-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Placing Order...
                  </div>
                ) : selectedPayment === 'cod' ? (
                  'Selected: Cash on Delivery'
                ) : (
                  'Cash on Delivery'
                )}
              </button>
            </div>

          </div>

          {/* Estimated Delivery */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            Estimated delivery by <span className="font-medium text-gray-700">{deliveryRange}</span>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckOutPage;
