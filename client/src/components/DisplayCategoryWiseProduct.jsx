import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import CartProduct from './CartProduct';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { validURLConvert } from '../utils/validURLConvert';
import { setCategoryProducts, setLoadingCategoryProducts } from '../Store/productSlice';
import CardLoading from './CardLoading'

let lastToast = null;
const CACHE_DURATION = 5 * 60 * 1000;

const DisplayCategoryWiseProduct = ({ id, name }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const containerRef = useRef();

    const subCategoryData = useSelector(state => state.product.allSubCategory);
    const categoryProducts = useSelector(state => state.product.categoryProducts);
    const loadingCategoryProducts = useSelector(state => state.product.loadingCategoryProducts);
    const categoryProductsTimestamp = useSelector(state => state.product.categoryProductsTimestamp);

    const data = categoryProducts[id] || [];
    const loading = loadingCategoryProducts[id] || false;
    const [showButtons, setShowButtons] = useState(false);

    const loadingCardNumber = new Array(6).fill(null);

    const AxiosToastError = (error) => {
        const message =
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong!";
        if (lastToast !== message) {
            toast.dismiss();
            toast.error(message, {
                icon: "⚠️",
                style: {
                    background: '#fff5f5',
                    color: '#d32f2f',
                    border: '1px solid #ffcdd2',
                    padding: '12px',
                    fontWeight: '500',
                    fontSize: '14px'
                }
            });
            lastToast = message;
            setTimeout(() => { lastToast = null; }, 3000);
        }
    };

    const fetchCategoryWiseProduct = async () => {
        const cachedData = categoryProducts[id];
        const cachedTimestamp = categoryProductsTimestamp[id];
        if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp) < CACHE_DURATION) return;

        dispatch(setLoadingCategoryProducts({ categoryId: id, loading: true }));

        try {
            const response = await Axios({ ...SummaryApi.getProductByCategory, data: { id } });
            const { data: responseData } = response;
            if (responseData.success) {
                dispatch(setCategoryProducts({ categoryId: id, products: responseData.data }));
            } else {
                throw new Error(responseData.message || 'No products found.');
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            dispatch(setLoadingCategoryProducts({ categoryId: id, loading: false }));
        }
    };

    useEffect(() => {
        fetchCategoryWiseProduct();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                setShowButtons(container.scrollWidth > container.clientWidth);
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll();
        }
        return () => { container?.removeEventListener('scroll', handleScroll); };
    }, [data]);

    const scrollRight = () => containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    const scrollLeft = () => containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });

    if (!loading && data.length === 0) return null;

    const rediredUrl = (() => {
        const subcategory = subCategoryData.find(sub => sub.category?.some(c => c._id === id));
        if (!subcategory) return '/';
        return `/products/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
    })();

    return (
        <div className="pb-4 bg-white mt-3 rounded-xl shadow-sm">
            {/* Header */}
            <div className="mb-2 px-0 md:px-4">
                <div className="flex items-center justify-between p-4 pb-0">
                    <div className="flex items-center gap-2">
                        <h1 className="font-semibold md:text-xl text-gray-800">{name}</h1>
                        <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            Hot Picks
                        </span>
                    </div>
                    <Link to={rediredUrl} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                        View All
                        <FaChevronRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Cards */}
            <div className="relative" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                <div ref={containerRef} className="flex items-center gap-3 md:gap-6 lg:gap-7 overflow-x-scroll lg:overflow-hidden scroll-smooth p-3 md:px-4 scrollbar-hide">
                    {loading && loadingCardNumber.map((_, idx) => <CardLoading key={idx} />)}
                    {data.map((p, index) => <CartProduct key={p._id + index} data={p} />)}
                </div>

                {showButtons && (
                    <div className="absolute top-1/2 hidden -translate-y-1/2 w-full px-2 md:px-4 lg:flex justify-between pointer-events-auto z-10">
                        <button onClick={scrollLeft} className="relative bg-white rounded-full p-2 shadow-md hover:bg-gray-200"><FaChevronLeft /></button>
                        <button onClick={scrollRight} className="relative bg-white rounded-full p-2 shadow-md hover:bg-gray-200"><FaChevronRight /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayCategoryWiseProduct;
