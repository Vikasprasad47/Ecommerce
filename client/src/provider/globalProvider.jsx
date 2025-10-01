import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastErroe";
import { handelAddItemCart } from "../Store/cartProduct";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../Store/addressSlice";
import { setOrder } from '../Store/orderSlice'
import { setUserDetails } from "../Store/userSlice"; // Add this at the top

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartItem.cart);
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
    const user = useSelector(state => state?.user)

    const fetchUserDetails = async () => {
        try {
            const response = await Axios({ ...SummaryApi.userDetails }); // your API for /user/user-details
            const { data: responseData } = response;

            if (responseData.success) {
            dispatch(setUserDetails(responseData.data));
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await Axios({ ...SummaryApi.getCartItems });
            const { data: responseData } = response;

            if (responseData.success) {
                dispatch(handelAddItemCart(responseData.data));
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
        }
    };

    const updateCartItems = async (id, qty, onLoading, onDone) => {
        try {
            if (onLoading) onLoading(true);

            // ⭐ CHANGED: Optimistic update
            dispatch(handelAddItemCart(
                cartItems.map(item =>
                    item._id === id ? { ...item, quantity: qty } : item
                )
            ));

            const response = await Axios({
                ...SummaryApi.updateCartItem,
                data: { _id: id, qty: qty },
            });

            const { data: responseData } = response;

            if (responseData.success) {
                // no need to refetch; local state already updated
                return responseData;
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
            await fetchCartItems(); // rollback on error
            return error;
        } finally {
            if (onLoading) onLoading(false);
            if (onDone) onDone();
        }
    };

    const deleteCartItem = async (cartId, onLoading, onDone) => {
        try {
            if (onLoading) onLoading(true);

            // ⭐ CHANGED: Optimistic removal
            dispatch(handelAddItemCart(
                cartItems.filter(item => item._id !== cartId)
            ));

            const response = await Axios({
                ...SummaryApi.deleteCartItem,
                data: { _id: cartId },
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.dismiss()
                toast.success(responseData.message);
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error);
            await fetchCartItems(); // rollback on error
        } finally {
            if (onLoading) onLoading(false);
            if (onDone) onDone();
        }
    };

    useEffect(() => {
        const qty = cartItems.reduce((prev, current) => {
            return prev + current.quantity;
        }, 0);
        setTotalQty(qty);

        const tPrice = cartItems.reduce((prev, current) => {
            return prev + (priceWithDiscount(current?.productId?.price, current?.productId?.discount) * current.quantity);
        }, 0);

        setTotalPrice(tPrice);

        const NoDiscountPrice = cartItems.reduce((prev, current) => {
            return prev + (current?.productId?.price * current.quantity);
        }, 0);
        setNotDiscountTotalPrice(NoDiscountPrice);
    }, [cartItems]);

    const handleLogOut = () => {
        localStorage.clear();
        dispatch(handelAddItemCart([]))
    }

    const fetchAddress = async () =>{
        try {
            const response = await Axios({
                ...SummaryApi.getAddress,

            })
            const { data: responseData } = response;
            if (responseData.success) {
                dispatch(handleAddAddress(responseData.data))
            }
        } catch (error) {
            toast.dismiss()
            AxiosToastError(error)
        }
    }

    const fetchOrderList = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getOrderItemList,

            })
            const {data: responseData} = response

            if(responseData.success){
                dispatch(setOrder(responseData.data))
            }
        } catch (error) {
            // toast.error(error)    only use to crash the app to see the ErrorBoundary.jsx ui
            toast.dismiss()
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        fetchCartItems()
        // handleLogOut()
        fetchAddress()
        fetchOrderList()
    },[user])

    return (
        <GlobalContext.Provider value={{ fetchCartItems, updateCartItems, deleteCartItem, fetchAddress, fetchOrderList, fetchUserDetails, totalPrice, totalQty, notDiscountTotalPrice, }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
