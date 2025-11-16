// import React, { useEffect, useState } from 'react';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/AxiosToastErroe';
// import Axios from '../utils/axios';
// import Loading from '../components/Loading';
// import ProductCardAdmin from '../components/ProductCardAdmin';
// import { IoIosSearch } from "react-icons/io";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ProductAdmin = () => {
//   const [productData, setProductData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalPage, setTotalPageCount] = useState(1);
//   const [search, setSearch] = useState("");

//   // 🚀 Moved outside useEffect
//   const fetchProductData = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getProduct,
//         data: { page, limit: 15, search }
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         setProductData(responseData.data);
//         setTotalPageCount(Math.ceil(responseData.totalCount / 15)); 
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Debounce effect to reduce API calls
//     const delaySearch = setTimeout(() => {
//       fetchProductData();
//     }, 500);

//     return () => clearTimeout(delaySearch);
//   }, [page, search]);

//   const handleNext = () => {
//     if (page < totalPage) setPage(prev => prev + 1);
//   };

//   const handlePrev = () => {
//     if (page > 1) setPage(prev => prev - 1);
//   };

//   const handleOnChange = (e) => {
//     setSearch(e.target.value);
//     setPage(1); // Reset page on search change
//   };

//   return (
//     <section>
//       <div className="shadow-md px-2 sm:px-6 py-3 flex items-center justify-between mb-4">
//         <h2 className="font-semibold sm:text-lg md:text-xl lg:text-2xl text-neutral-800">
//           Product
//         </h2>

//         <div className="relative w-9/12 sm:w-60 md:w-72 lg:w-80 max-w-lg">
//           <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input 
//             type="text" 
//             placeholder="Search Product..."
//             className="w-full px-4 py-2 pl-3 pr-10 text-sm sm:text-base border rounded-md 
//                        outline-none shadow-sm bg-white focus:ring-2 focus:ring-amber-400 
//                        focus:border-amber-500 transition-all duration-200"
//             value={search}
//             onChange={handleOnChange}
//           />
//         </div>
//       </div>

//       <div>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {productData.length > 0 ? (
//             productData.map((p, index) => (
//               <ProductCardAdmin 
//                 key={p._id || index} // 👈 Prefer _id if available
//                 data={p} 
//                 search={search} 
//                 fetchProductData={fetchProductData} 
//               />
//             ))
//           ) : (
//             <p className="text-center col-span-full text-gray-500">No products found.</p>
//           )}
//         </div>

//         {loading && <Loading />}

//         <div className="flex items-center justify-center mt-6 space-x-2 sm:space-x-4">
//           <button
//             onClick={handlePrev}
//             disabled={page <= 1}
//             className="px-5 py-2 text-xs sm:text-sm lg:text-base 
//                       rounded-full font-medium transition-all duration-200 
//                       bg-gradient-to-r from-yellow-300 to-amber-400 
//                       text-gray-800 hover:scale-105 hover:shadow-sm 
//                       focus:outline-none focus:ring-1 focus:ring-yellow-200 
//                       disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
//           >
//             <FaChevronLeft/> Prev
//           </button>

//           <span className="px-5 py-2 text-xs sm:text-sm lg:text-base 
//                           font-semibold text-gray-600 bg-gray-100 rounded-md shadow-sm">
//             {page} / {totalPage}
//           </span>

//           <button
//             onClick={handleNext}
//             disabled={page >= totalPage}
//             className="px-5 py-2 text-xs sm:text-sm lg:text-base cursor-pointer
//                       rounded-full font-medium transition-all duration-200 
//                       bg-gradient-to-r from-yellow-300 to-amber-400 
//                       text-gray-800 hover:scale-105 hover:shadow-sm 
//                       focus:outline-none focus:ring-1 focus:ring-yellow-200 
//                       disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             Next <FaChevronRight/>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductAdmin;


// import React, { useEffect, useState, useCallback } from 'react';
// import SummaryApi from '../comman/summaryApi';
// import AxiosToastError from '../utils/network/AxiosToastError';
// import Axios from '../utils/network/axios';
// import Loading from '../components/Loading';
// import ProductCardAdmin from '../components/ProductCardAdmin';
// import { IoIosSearch } from "react-icons/io";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ProductAdmin = () => {
//   const [productData, setProductData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalPage, setTotalPageCount] = useState(1);
//   const [search, setSearch] = useState("");
//   const [totalCount, setTotalCount] = useState(0);

//   // 🚀 Optimized fetch function with useCallback
//   const fetchProductData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getProduct,
//         data: { page, limit: 12, search }
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         setProductData(responseData.data);
//         setTotalCount(responseData.totalCount);
//         setTotalPageCount(Math.ceil(responseData.totalCount / 12)); 
//       }
//     } catch (error) {
//       toast.dismiss();
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search]);

//   useEffect(() => {
//     // Debounce effect to reduce API calls
//     const delaySearch = setTimeout(() => {
//       fetchProductData();
//     }, 500);

//     return () => clearTimeout(delaySearch);
//   }, [fetchProductData]);

//   const handleNext = () => {
//     if (page < totalPage) setPage(prev => prev + 1);
//   };

//   const handlePrev = () => {
//     if (page > 1) setPage(prev => prev - 1);
//   };

//   const handleOnChange = (e) => {
//     setSearch(e.target.value);
//     setPage(1); // Reset page on search change
//   };

//   // Skeleton loader component
//   const SkeletonCard = () => (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 animate-pulse">
//       <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
//       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//       <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
//       <div className="flex gap-2">
//         <div className="h-8 bg-gray-200 rounded flex-1"></div>
//         <div className="h-8 bg-gray-200 rounded flex-1"></div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="min-h-screen">
//       <div className="max-w-full mx-auto p-4">
        

//         {/* Main Content */}
//         <div className="">
//           {/* Header */}
//           <div className="bg-white border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Product Management</h2>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {totalCount} products found • Page {page} of {totalPage}
//                 </p>
//               </div>

//               <div className="relative w-full sm:w-80">
//                 <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input 
//                   type="text" 
//                   placeholder="Search products by name, category..."
//                   className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-xl 
//                             outline-none bg-white focus:ring-2 focus:ring-amber-200 
//                             focus:border-amber-500 transition-all duration-200 hover:border-gray-400"
//                   value={search}
//                   onChange={handleOnChange}
//                 />
//               </div>
//             </div>
//           </div>
//           {/* Products Grid */}
//           <div className="mb-6">
//             {loading ? (
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {Array.from({ length: 8 }).map((_, index) => (
//                   <SkeletonCard key={index} />
//                 ))}
//               </div>
//             ) : productData.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {productData.map((product, index) => (
//                   <ProductCardAdmin 
//                     key={product._id || index}
//                     data={product} 
//                     search={search} 
//                     fetchProductData={fetchProductData} 
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
//                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <IoIosSearch className="text-3xl text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
//                 <p className="text-gray-500 text-sm max-w-md mx-auto">
//                   {search ? `No products matching "${search}"` : 'Get started by adding your first product'}
//                 </p>
//                 {!search && (
//                   <button className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition shadow-sm">
//                     Add First Product
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {productData.length > 0 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
//               <div className="text-sm text-gray-600">
//                 Showing {productData.length} of {totalCount} products
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={handlePrev}
//                   disabled={page <= 1 || loading}
//                   className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                     page <= 1 || loading
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-md transform hover:scale-[1.02] shadow-sm'
//                   }`}
//                 >
//                   <FaChevronLeft size={14} />
//                   Prev
//                 </button>

//                 <div className="flex items-center gap-2">
//                   {Array.from({ length: Math.min(3, totalPage) }).map((_, index) => {
//                     const pageNumber = index + 1;
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => setPage(pageNumber)}
//                         className={`w-8 h-8 rounded-lg font-medium transition-all ${
//                           page === pageNumber
//                             ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}
//                   {totalPage > 5 && (
//                     <span className="px-2 text-gray-500">...</span>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleNext}
//                   disabled={page >= totalPage || loading}
//                   className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                     page >= totalPage || loading
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-md transform hover:scale-[1.02] shadow-sm'
//                   }`}
//                 >
//                   Next
//                   <FaChevronRight size={14} />
//                 </button>
//               </div>

//               <div className="text-sm font-medium text-gray-700 bg-amber-50 px-3 py-1.5 rounded-lg">
//                 Page {page} of {totalPage}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductAdmin;

// pages/ProductAdmin.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/network/AxiosToastError";
import Axios from "../utils/network/axios";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoIosSearch } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdInventory2 } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import { RiAlertLine } from "react-icons/ri";
import toast from "react-hot-toast";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // 🔹 Skeleton loader card – matches your admin style
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 animate-pulse">
      <div className="w-full h-40 bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="flex gap-2">
        <div className="h-8 bg-slate-200 rounded flex-1" />
        <div className="h-8 bg-slate-200 rounded flex-1" />
      </div>
    </div>
  );

  // 📊 Stats for top strip (consistent with other admin pages)
  const stats = useMemo(() => {
    const total = totalCount || 0;
    const published = productData.filter((p) => p.publish !== false).length;
    const featured = productData.filter((p) => p.featured).length;
    const lowStock = productData.filter(
      (p) => typeof p.stock === "number" && p.stock <= 5
    ).length;

    return {
      total,
      published,
      featured,
      lowStock,
    };
  }, [productData, totalCount]);

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 12, search },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data || []);
        setTotalCount(responseData.totalCount || 0);
        setTotalPageCount(
          Math.ceil((responseData.totalCount || 0) / 12) || 1
        );
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProductData();
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [fetchProductData]);

  const handleNext = () => {
    if (page < totalPage) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 space-y-5">
        {/* 🔶 HEADER CARD (consistent admin pattern) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: icon + title + subtitle */}
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 border border-amber-200">
                <MdInventory2 className="text-amber-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
                  Product Management
                  {stats.featured > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <HiOutlineSparkles className="text-xs" />
                      {stats.featured} Featured
                    </span>
                  )}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage your catalog, update details and keep inventory in
                  sync.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {totalCount} products • Page {page} of {totalPage}
                </p>
              </div>
            </div>

            {/* Right: search + (future) primary action button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-72 lg:w-80">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, category, tag..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white
                             outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
                             transition-all duration-200 hover:border-slate-400"
                  value={search}
                  onChange={handleOnChange}
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                           bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md
                           transition-all duration-150"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>

        {/* 📊 STATS STRIP (like other admin pages) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Total Products
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <PiPackageFill className="text-amber-600 text-xl" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Published
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {stats.published}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <MdInventory2 className="text-emerald-600 text-xl" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Featured
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {stats.featured}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <HiOutlineSparkles className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Low Stock (≤ 5)
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {stats.lowStock}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
              <RiAlertLine className="text-rose-500 text-xl" />
            </div>
          </div>
        </div>

        {/* 🔍 Active filters strip (only if searching) */}
        {search && (
          <div className="bg-white border border-amber-100 rounded-2xl px-4 py-2 flex items-center justify-between text-xs text-slate-600 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                Showing results for{" "}
                <span className="font-medium text-slate-900">"{search}"</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* 🧩 PRODUCTS GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : productData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productData.map((product, index) => (
                <ProductCardAdmin
                  key={product._id || index}
                  data={product}
                  search={search}
                  fetchProductData={fetchProductData}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoIosSearch className="text-2xl text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No products found
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {search
                  ? `No products matching "${search}". Try changing the search term.`
                  : "Get started by adding your first product to the catalog."}
              </p>
              {!search && (
                <button
                  type="button"
                  className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium
                             hover:bg-amber-600 shadow-sm hover:shadow-md transition"
                >
                  + Add First Product
                </button>
              )}
            </div>
          )}
        </div>

        {/* 📄 PAGINATION BAR */}
        {productData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-4 sm:px-5 sm:py-5">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {productData.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {totalCount}
              </span>{" "}
              products
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={page <= 1 || loading}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  page <= 1 || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md shadow-sm"
                }`}
              >
                <FaChevronLeft size={13} />
                Prev
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(3, totalPage) }).map(
                  (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          page === pageNumber
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
                {totalPage > 5 && (
                  <span className="px-2 text-slate-500 text-sm">...</span>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={page >= totalPage || loading}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  page >= totalPage || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md shadow-sm"
                }`}
              >
                Next
                <FaChevronRight size={13} />
              </button>
            </div>

            <div className="text-xs sm:text-sm font-medium text-slate-700 bg-amber-50 px-3 py-1.5 rounded-lg">
              Page {page} of {totalPage}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductAdmin;
