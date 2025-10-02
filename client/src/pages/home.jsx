import React, { useRef, useState, useMemo, useCallback, memo, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { TbCategoryMinus, TbCategoryPlus } from "react-icons/tb";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

import banner1 from "../assets/linkImg/banner1.png";
import banner2 from "../assets/linkImg/banner2.png";
import banner3 from "../assets/linkImg/banner3.png";
import banner_mobile1 from "../assets/banner-mobile.jpg";
import banner_mobile2 from "../assets/banner-mobile.jpg";
import banner_mobile3 from "../assets/banner-mobile.jpg";

import { validURLConvert } from "../utils/validURLConvert";
import Footer from "../components/footer";
import HeaderCategory from "../components/HeaderCategory";
import TopDisplayHeaderProduct from "../components/TopDisplayHeaderProduct";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { setCategoryProducts, setLoadingCategoryProducts } from "../Store/productSlice";
import CartProduct from "../components/CartProduct"; // keep this separate

const banners = [banner1, banner2, banner3];
const mobileBanners = [banner_mobile1, banner_mobile2, banner_mobile3];
const SLIDE_DURATION = 3000;
const CACHE_DURATION = 5 * 60 * 1000;
let lastToast = null;

/* ================== Category Cards ================== */
const CategoryCard = memo(({ cat, onClick }) => (
  <div
    onClick={() => onClick(cat._id, cat.name)}
    className="bg-white rounded-lg border border-gray-200 p-2 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md"
    aria-label={`Browse ${cat.name}`}
  >
    <div className="w-full aspect-square overflow-hidden rounded-lg bg-white">
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  </div>
));

const ViewAllCard = ({ expanded, onClick }) => (
  <div
    onClick={onClick}
    className="bg-amber-50 border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition hover:bg-amber-100 hover:shadow-md"
  >
    <div className="flex flex-col items-center">
      {expanded ? (
        <>
          <TbCategoryMinus size={25} className="text-amber-600" />
          <p className="text-[10px] md:text-md lg:text-lg font-semibold text-amber-600 mt-1">Show less</p>
        </>
      ) : (
        <>
          <TbCategoryPlus size={25} className="text-amber-600" />
          <p className="text-[10px] md:text-md lg:text-lg font-semibold text-amber-600 mt-1">View All</p>
        </>
      )}
    </div>
  </div>
);

/* ================== Skeletons ================== */
const CategoryLoadingSkeleton = () => (
  <div className="bg-gray-100 rounded-lg animate-pulse w-full aspect-square flex flex-col items-center justify-center p-2">
    <div className="w-3/4 h-3 bg-gray-300 rounded mb-2"></div>
    <div className="w-full aspect-square bg-gray-300 rounded-lg"></div>
  </div>
);

const CategorySectionSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm mt-3">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 auto-rows-fr">
      {Array.from({ length: 15 }).map((_, idx) => (
        <CategoryLoadingSkeleton key={idx} />
      ))}
    </div>
  </div>
);

const CardLoading = () => (
  <div className="flex-shrink-0 w-[11.5rem] lg:w-[13rem] h-[18rem] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="relative h-36 bg-gray-100 p-3 border-b-2 border-slate-300">
      <div className="w-full h-full bg-gray-200 rounded-lg" />
    </div>
    <div className="flex flex-col flex-1 px-3 py-3 bg-gray-50 rounded-b-xl space-y-3">
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="flex-1" />
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col space-y-2">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
        <div className="w-[50%] h-8 bg-gray-300 rounded-md" />
      </div>
    </div>
  </div>
);

/* ================== DisplayCategoryWiseProduct ================== */
const DisplayCategoryWiseProduct = ({ id, name }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef();

  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const categoryProducts = useSelector((state) => state.product.categoryProducts);
  const loadingCategoryProducts = useSelector((state) => state.product.loadingCategoryProducts);
  const categoryProductsTimestamp = useSelector((state) => state.product.categoryProductsTimestamp);

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
      toast.error(message);
      lastToast = message;
      setTimeout(() => {
        lastToast = null;
      }, 3000);
    }
  };

  const fetchCategoryWiseProduct = async () => {
    const cachedData = categoryProducts[id];
    const cachedTimestamp = categoryProductsTimestamp[id];
    if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_DURATION) return;

    dispatch(setLoadingCategoryProducts({ categoryId: id, loading: true }));
    try {
      const response = await Axios({ ...SummaryApi.getProductByCategory, data: { id } });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setCategoryProducts({ categoryId: id, products: responseData.data }));
      } else {
        throw new Error(responseData.message || "No products found.");
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
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  if (!loading && data.length === 0) return null;

  const rediredUrl = (() => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category?.some((c) => c._id === id)
    );
    if (!subcategory) return "/";
    return `/products/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
  })();

  return (
    <div className="pb-4 bg-white mt-3 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold md:text-xl text-gray-800">{name}</h1>
          <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            Hot Picks
          </span>
        </div>
        <Link
          to={rediredUrl}
          className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
        >
          View All <FaChevronRight size={12} />
        </Link>
      </div>

      {/* Cards */}
      <div
        className="relative"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div
          ref={containerRef}
          className="flex items-center gap-3 md:gap-6 lg:gap-7 overflow-x-scroll lg:overflow-hidden scroll-smooth p-3 md:px-4 scrollbar-hide"
        >
          {loading && loadingCardNumber.map((_, idx) => <CardLoading key={idx} />)}
          {!loading && data.map((p, index) => <CartProduct key={p._id + index} data={p} />)}
        </div>

        {showButtons && (
          <div className="absolute top-1/2 hidden -translate-y-1/2 w-full px-2 md:px-4 lg:flex justify-between pointer-events-auto z-10">
            <button
              onClick={() => containerRef.current.scrollBy({ left: -300, behavior: "smooth" })}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => containerRef.current.scrollBy({ left: 300, behavior: "smooth" })}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================== Home ================== */
const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const loadingCategory = useSelector((state) => state.product.LoadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const categories = useMemo(() => categoryData || [], [categoryData]);

  const handleRedirectProductListpage = useCallback(
    (id, catName) => {
      const subcategory = subCategoryData.find((sub) =>
        sub.category?.some((c) => c._id === id)
      );
      if (!subcategory) return;
      const url = `/products/${validURLConvert(catName)}-${id}/${validURLConvert(
        subcategory.name
      )}-${subcategory._id}`;
      navigate(url);
    },
    [subCategoryData, navigate]
  );

  const displayedCategories = useMemo(() => {
    const limit = 15;
    const initial = categories.slice(
      0,
      showAllCategories ? categories.length : limit - 1
    );
    return [
      ...initial,
      { _id: "view-all-card", name: "View All", isViewAll: true },
    ];
  }, [categories, showAllCategories]);

  return (
    <>
      <div>
        <section className="pl-3 pr-3 pb-3">
          <HeaderCategory />

          {/* Desktop Banner */}
          <div className="mt-3 rounded relative hidden sm:block">
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false }}
              speed={1200}
              loop
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {banners.map((banner, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={banner}
                    alt={`Banner ${idx + 1}`}
                    className="w-full h-80 object-cover rounded-lg"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile Banner */}
          <div className="block sm:hidden p-1 bg-white rounded-xl mt-2">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false }}
              speed={900}
              loop
              pagination={{ clickable: true }}
            >
              {mobileBanners.map((banner, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={banner}
                    alt={`Mobile Banner ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <TopDisplayHeaderProduct />

          {/* Category Grid */}
          {loadingCategory || categories.length === 0 ? (
            <CategorySectionSkeleton />
          ) : (
            <div className="bg-white rounded-md p-6 shadow-sm mt-3">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
                Best of Grocery & More
              </h2>
              <p className="text-sm text-gray-600 mb-4">Fresh picks, every day.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4 auto-rows-fr">
                {displayedCategories.map((cat) =>
                  cat.isViewAll ? (
                    <ViewAllCard
                      key="view-all-card"
                      expanded={showAllCategories}
                      onClick={() => setShowAllCategories((prev) => !prev)}
                    />
                  ) : (
                    <CategoryCard
                      key={cat._id}
                      cat={cat}
                      onClick={handleRedirectProductListpage}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* Category-wise Products */}
          {categories.map((c) => (
            <DisplayCategoryWiseProduct key={c._id} id={c._id} name={c.name} />
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
