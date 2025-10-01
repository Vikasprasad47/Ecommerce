import React, { useEffect, useState } from 'react';
import SummaryApi from '../comman/summaryApi';
import { useGlobalContext } from '../provider/globalProvider';
import AxiosToastError from '../utils/AxiosToastErroe';
import Axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";

const AddToCartButton = ({ data }) => {
  const { fetchCartItems, updateCartItems, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItems = useSelector(state => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemsDetails, setCartItemsDetails] = useState()

  useEffect(() => {
    const checkingCartItem = cartItems.find(item => item.productId._id === data._id);

    setIsAvailableCart(checkingCartItem);

    const product  = cartItems.find(item => item.productId._id === data._id)
    setQuantity(product?.quantity)
    setCartItemsDetails(product)

  }, [data, cartItems]);

    const handleAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.addToCart,
          data: { productId: data._id }
        });
        const { data: responseData } = response;
        if (responseData.success) {
          toast.dismiss()
          toast.success(responseData.message);
          if (fetchCartItems) fetchCartItems();
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    const incrementQty = async (e) => {
      e.preventDefault()
      e.stopPropagation()
      const response = await updateCartItems(cartItemsDetails?._id, quantity+1)
      if(response.success){
        toast.dismiss()
        toast.success('Item(s) Added Successfully!')
      }
    };

    const decrementQty = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (quantity === 1) {
        deleteCartItem(cartItemsDetails?._id);
      } else {
          const response = await updateCartItems(cartItemsDetails?._id, quantity - 1);
          if(response.success){
            toast.dismiss()
            toast.success('Item(s) removed Successfully!')
          }
      }
    };
    

    return (
      <>
        {isAvailableCart ? (
          <div className="h-10 w-full bg-amber-200 rounded-lg flex items-center justify-between px-2 text-xs font-semibold">
            <button
              onClick={decrementQty}
              className="text-amber-700 hover:text-amber-800 p-1 cursor-pointer"
            >
              <FiMinus size={14} />
            </button>
            <span className="text-gray-800">{quantity}</span>
            <button
              onClick={incrementQty}
              className="text-amber-700 hover:text-amber-800 p-1 cursor-pointer"
            >
              <IoIosAdd size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`h-10 cursor-pointer w-full rounded-lg flex items-center justify-center text-xs font-semibold px-3 ${
              loading
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } transition`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding
                </div>
            ) : (
              <p className=''>Add</p>
            )}
          </button>
        )}
      </>
    );
};

export default AddToCartButton;