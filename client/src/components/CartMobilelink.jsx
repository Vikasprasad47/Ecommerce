import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../provider/globalProvider';
import { FaCartShopping, FaArrowRight } from 'react-icons/fa6';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartMobilelink = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const [isVisible, setIsVisible] = useState(false);
  const [lastQty, setLastQty] = useState(0);

  useEffect(() => {
    if (totalQty === 0) {
      setIsVisible(false);
      return;
    }
    if (totalQty > lastQty) {
      setIsVisible(true);
    }
    setLastQty(totalQty);
  }, [totalQty, lastQty]);

  if (totalQty === 0 || !isVisible) return null;

  return (
    <div className='lg:hidden'>
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 w-full bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-t-3xl shadow-2xl z-[99]"
        >
          {/* Swipe handle (only handle is draggable) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 60 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 30) {
                setIsVisible(false);
              }
            }}
            className="w-full flex justify-center pt-2"
          >
            <div
              className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsVisible(false)}
            />
          </motion.div>

          <div className="w-full px-5 pb-5 pt-2">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-400 rounded-full shadow-lg">
                  <FaCartShopping className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{totalQty} Items</p>
                  <p className="text-gray-600 text-sm">{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>

              {/* Right side */}
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition text-sm"
              >
                <span className="font-medium">View Cart</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CartMobilelink;
