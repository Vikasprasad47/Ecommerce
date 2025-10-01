import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import Loading from '../components/Loading';
import Footer from '../components/footer';
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { validURLConvert } from '../utils/validURLConvert';
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";
import { useGlobalContext } from "../provider/globalProvider";
import toast from "react-hot-toast";

const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="w-3 h-3" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="w-3 h-3" />);
    } else {
      stars.push(<FaRegStar key={i} className="w-3 h-3" />);
    }
  }
  return stars;
};

const Productlistpage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [displaySubcategory, setDisplaySubcategory] = useState([]);

  const param = useParams();
  const categoryId = param.category.split('-').pop();
  const subCategoryId = param.subCategory.split('-').pop();
  const subCategoryName = param.subCategory.split('-').slice(0, -1).join(' ');

  const allSubCategory = useSelector(state => state.product.allSubCategory);
  const user = useSelector(state => state.user);
  const { fetchUserDetails } = useGlobalContext();

  useEffect(() => {
    const sub = allSubCategory.filter(s =>
      s.category.some(el => el._id === categoryId)
    );
    setDisplaySubcategory(sub);
  }, [param, allSubCategory]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryandSubCategory,
        data: { categoryId, subCategoryId, page, limit: 8 }
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.page === 1 ? responseData.data : [...data, ...responseData.data]);
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [param]);

  const ProductCard = ({ item }) => {
    const [isWishlisted, setIsWishlisted] = useState(user?.wishlist?.includes(item._id));
    const [imageLoaded, setImageLoaded] = useState(false);

    const toggleWishlist = async (e) => {
      e.preventDefault();
      if (!user || !user._id) {
        toast.dismiss();
        toast.error("Please login to use wishlist.");
        return;
      }

      const newStatus = !isWishlisted;
      setIsWishlisted(newStatus);

      try {
        const apiCall = newStatus ? SummaryApi.AddToWishList : SummaryApi.DeleteFromWishList;
        await Axios({ ...apiCall, data: { productId: item._id }, withCredentials: true });
        toast.dismiss();
        toast.success(newStatus ? "Added to wishlist" : "Removed from wishlist");
        await fetchUserDetails();
      } catch (err) {
        setIsWishlisted(!newStatus);
        toast.dismiss();
        toast.error("Something went wrong");
      }
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    return (
      <Link
        to={`/product/${validURLConvert(item.name)}-${item._id}`}
        className="group relative flex flex-col bg-white hover:shadow-sm transition h-full"
      >
        {/* Discount Badge */}
        {item.discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-medium px-2 py-[2px] rounded">
            {item.discount}% OFF
          </span>
        )}

        {/* Image Container with Fixed Height */}
        <div className="relative h-40 bg-white flex items-center justify-center p-3">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
          )}
          
          <img
            src={item.image[0]}
            alt={item.name}
            className={`h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${item.stock <= 0 ? "opacity-60 grayscale" : ""}`}
            loading="lazy"
            onLoad={handleImageLoad}
          />
          
          {item.stock <= 0 && (
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white bg-black/50">
              SOLD OUT
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white shadow hover:text-red-500 z-10"
          >
            {isWishlisted ? (
              <FaHeart size={14} className="text-red-500" />
            ) : (
              <FaRegHeart size={14} />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col p-2 space-y-1 bg-slate-300/40 flex-grow">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-amber-600 transition">
            {item.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            {renderRatingStars(item.ratings?.average || 0)}
            {item.ratings?.average > 0 ? (
              <span className="ml-1 text-gray-500 text-[11px]">
                {item.ratings.average.toFixed(1)}
              </span>
            ) : (
              <span className="ml-1 text-gray-400 text-[11px]">No rating</span>
            )}
          </div>

          {/* Price / Cart / Notify */}
          <div className="flex items-center justify-between mt-1">
            {item.stock > 0 ? (
              <>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-amber-600">
                    {DisplayPriceInRupees(priceWithDiscount(item.price, item.discount))}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      {DisplayPriceInRupees(item.price)}
                    </span>
                  )}
                </div>
                <div className="w-[50%]">
                  <AddToCartButton data={item} />
                </div>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toast.dismiss();
                  toast.success("We'll alert you when it's back");
                }}
                className="w-full px-3 py-2 text-xs rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium transition cursor-pointer"
              >
                Notify Me
              </button>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="relative">
      {/* Mobile Sticky Header */}
      <div className="md:hidden p-4 bg-white shadow flex items-center sticky z-50 top-[130px]">
        <button onClick={() => setShowSidebar(true)} className="text-2xl text-gray-700">
          <RiMenuUnfold2Fill />
        </button>
        <h2 className="ml-4 font-semibold text-base text-gray-700">{subCategoryName}</h2>
      </div>

      <div className="max-w-8xl mx-auto p-3 sm:px-4 md:px-5">
        <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr] gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block bg-white p-4 rounded-lg shadow sticky top-[110px] h-[calc(100vh-110px)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">All Subcategory</h2>
            <hr className="border-gray-200" />
            <div className="grid gap-2 pt-3">
              {displaySubcategory.map((s) => {
                const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`;
                const isActive = subCategoryId === s._id;
                return (
                  <Link
                    to={link}
                    key={s._id}
                    className={`p-2 rounded-lg flex items-center space-x-3 transition ${isActive ? 'bg-amber-100 border border-amber-300' : 'border border-gray-200 hover:border-amber-300'}`}
                  >
                    <img src={s.image} alt={s.name} className="w-10 h-10 rounded bg-gray-100 object-contain" />
                    <p className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-amber-700' : 'text-gray-600'}`}>{s.name}</p>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Sidebar Overlay for Mobile */}
          {showSidebar && (
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Sidebar Drawer for Mobile */}
          <div
            className={`fixed z-50 bg-white p-4 left-0 w-72 transition-transform duration-300 md:hidden
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              top-[186px] h-[calc(100vh-186px)] overflow-y-auto shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">All Subcategory</h2>
              <button onClick={() => setShowSidebar(false)}>
                <RxCross2 size={20} className="text-gray-600" />
              </button>
            </div>
            <hr className="mb-2 border-gray-200" />
            <div className="grid gap-2">
              {displaySubcategory.map((s) => {
                const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`;
                const isActive = subCategoryId === s._id;

                return (
                  <Link
                    to={link}
                    key={s._id}
                    onClick={() => setShowSidebar(false)}
                    className={`p-2 rounded-lg flex items-center space-x-3 transition
                      ${isActive ? 'bg-amber-100 border border-amber-300' : 'border border-gray-200 hover:border-amber-300'}`}
                  >
                    <img src={s.image} alt={s.name} className="w-10 h-10 bg-gray-100 object-contain rounded" />
                    <p className={`text-sm font-medium ${isActive ? 'text-amber-700' : 'text-gray-600'}`}>
                      {s.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <main>
            <div className="hidden md:block bg-white shadow-sm p-4 mb-4 rounded-lg w-full">
              <h3 className="font-semibold text-lg text-gray-700">{subCategoryName?.toUpperCase()}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-3 mb-3">
              {data.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
            {loading && <Loading />}
          </main>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Productlistpage;