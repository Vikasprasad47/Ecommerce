import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { IoClose, IoInformationCircleOutline } from 'react-icons/io5';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BiSolidOffer } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/globalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { priceWithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';
import NothingInCart from '../assets/empty_cart.webp';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiShoppingCartFill } from "react-icons/ri";


const CartItem = memo(({ item, onNameClick }) => {
  const discountedPrice = useMemo(() => 
    priceWithDiscount(item?.productId?.price, item?.productId?.discount), 
    [item?.productId?.price, item?.productId?.discount]
  );

  const handleNameClick = useCallback(() => {
    onNameClick(item);
  }, [item, onNameClick]);

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
        <img
          src={item?.productId?.image[0]}
          alt={item?.productId?.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {item?.productId?.discount > 0 && (
          <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{item?.productId?.discount}%
          </div>
        )}
      </div>
      
      <div className="flex-1 ml-4 min-w-0">
        <p
          onClick={handleNameClick}
          className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-amber-600 transition-colors"
          title={item?.productId?.name}
        >
          {item?.productId?.name}
        </p>
        <div className="text-xs text-gray-500 mt-1">{item?.productId?.unit}</div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm font-semibold text-amber-600">
            {DisplayPriceInRupees(discountedPrice)}
          </p>
          {item?.productId?.discount > 0 && (
            <p className="text-xs text-gray-400 line-through">
              {DisplayPriceInRupees(item?.productId?.price)}
            </p>
          )}
        </div>
      </div>
      
      <div className="ml-2">
        <AddToCartButton data={item?.productId} variant="icon" />
      </div>
    </div>
  );
});

const DisplayCartItems = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice } = useGlobalContext();
  const cartItems = useSelector(state => state.cartItem.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const [isPriceDetailsOpen, setIsPriceDetailsOpen] = useState(false);

  const savedAmount = useMemo(() => notDiscountTotalPrice - totalPrice, [notDiscountTotalPrice, totalPrice]);
  const deliveryCharge = useMemo(() => 
    cartItems.length === 0 ? 0 : totalPrice > 500 ? 0 : 0, 
    [cartItems.length, totalPrice]
  );
  const finalTotal = useMemo(() => totalPrice + deliveryCharge, [totalPrice, deliveryCharge]);

  const handleClickWithHaptic = useCallback((callback) => {
    if (navigator.vibrate) navigator.vibrate(15);
    callback();
  }, []);

  const redirectToCheckout = useCallback(() => {
    if (user?._id) {
      navigate('/checkout');
      close?.();
    } else {
      toast.dismiss()
      toast.error('Please login to continue');
    }
  }, [user?._id, navigate, close]);

  const handleNameClick = useCallback((item) => {
    // This could open a product quick view modal
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const EmptyCartState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <img 
        src={NothingInCart} 
        width={190} 
        alt="Empty cart" 
        className="opacity-80 mb-6"
      />
      <p className="text-center text-gray-500 text-lg font-medium mb-2">
        Your cart is empty
      </p>
      <p className="text-center text-gray-400 text-sm mb-6">
        Add some items to get started
      </p>
      <Link 
        to="/products" 
        onClick={close}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-colors shadow-md"
      >
        Start Shopping
      </Link>
    </div>
  ), [close]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-black/40 flex justify-end" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={close} 
      />
      
      <motion.div
        ref={cartRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header - Consistent with other pages */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl">
              <RiShoppingCartFill size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
              <p className="text-sm text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => handleClickWithHaptic(close)} 
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Savings Banner */}
        {savedAmount > 0 && (
          <div className="mx-4 mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <BiSolidOffer className="text-xl text-green-600" />
            <span className="text-sm font-medium text-green-800">
              You saved <span className="font-bold">{DisplayPriceInRupees(savedAmount)}</span>
            </span>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartItem 
                key={item?.productId?._id || `${item?.productId?.name}-${index}`} 
                item={item} 
                onNameClick={handleNameClick} 
              />
            ))
          ) : (
            EmptyCartState
          )}
        </div>

        {/* Price Details */}
        {cartItems.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsPriceDetailsOpen(prev => !prev)}
              >
                <span className="font-medium text-gray-800">Price Details</span>
                {isPriceDetailsOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
              </div>

              <AnimatePresence>
                {isPriceDetailsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 text-sm text-gray-700 space-y-2 pt-3 border-t border-gray-100">
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
                        <span>{DisplayPriceInRupees(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span>Delivery</span>
                        <span>{deliveryCharge === 0 ? 'FREE' : DisplayPriceInRupees(deliveryCharge)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between font-semibold text-lg text-gray-900">
                <span>Total Amount</span>
                <span>{DisplayPriceInRupees(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Section */}
            <div className="mt-4 flex justify-between items-center flex-col">
              <div className='flex items-center justify-between w-full gap-4'>
                <div className="text-right">
                  {savedAmount > 0 && (
                    <div className="flex items-center gap-1 mb-1 justify-end">
                      <IoInformationCircleOutline className="text-gray-400" size={16} />
                      <span className="text-gray-500 text-sm line-through">
                        {DisplayPriceInRupees(notDiscountTotalPrice + deliveryCharge)}
                      </span>
                    </div>
                  )}
                  <p className="text-xl font-bold text-gray-900">{DisplayPriceInRupees(finalTotal)}</p>
                </div>
                

                <button 
                  onClick={redirectToCheckout}
                  className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
                >
                  Checkout
                </button>
              </div>

              <button
                onClick={redirectToCheckout}
                className="text-amber-600 underline text-sm mt-2 cursor-pointer"
              >
                Have a coupon? Apply it.
              </button>

            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(DisplayCartItems);