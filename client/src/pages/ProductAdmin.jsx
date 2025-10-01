import React, { useEffect, useState } from 'react';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import Axios from '../utils/axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoIosSearch } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  // 🚀 Moved outside useEffect
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 15, search }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
        setTotalPageCount(Math.ceil(responseData.totalCount / 15)); 
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce effect to reduce API calls
    const delaySearch = setTimeout(() => {
      fetchProductData();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [page, search]);

  const handleNext = () => {
    if (page < totalPage) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search change
  };

  return (
    <section>
      <div className="shadow-md px-2 sm:px-6 py-3 flex items-center justify-between mb-4">
        <h2 className="font-semibold sm:text-lg md:text-xl lg:text-2xl text-neutral-800">
          Product
        </h2>

        <div className="relative w-9/12 sm:w-60 md:w-72 lg:w-80 max-w-lg">
          <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search Product..."
            className="w-full px-4 py-2 pl-3 pr-10 text-sm sm:text-base border rounded-md 
                       outline-none shadow-sm bg-white focus:ring-2 focus:ring-amber-400 
                       focus:border-amber-500 transition-all duration-200"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productData.length > 0 ? (
            productData.map((p, index) => (
              <ProductCardAdmin 
                key={p._id || index} // 👈 Prefer _id if available
                data={p} 
                search={search} 
                fetchProductData={fetchProductData} 
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          )}
        </div>

        {loading && <Loading />}

        <div className="flex items-center justify-center mt-6 space-x-2 sm:space-x-4">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="px-5 py-2 text-xs sm:text-sm lg:text-base 
                      rounded-full font-medium transition-all duration-200 
                      bg-gradient-to-r from-yellow-300 to-amber-400 
                      text-gray-800 hover:scale-105 hover:shadow-sm 
                      focus:outline-none focus:ring-1 focus:ring-yellow-200 
                      disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <FaChevronLeft/> Prev
          </button>

          <span className="px-5 py-2 text-xs sm:text-sm lg:text-base 
                          font-semibold text-gray-600 bg-gray-100 rounded-md shadow-sm">
            {page} / {totalPage}
          </span>

          <button
            onClick={handleNext}
            disabled={page >= totalPage}
            className="px-5 py-2 text-xs sm:text-sm lg:text-base cursor-pointer
                      rounded-full font-medium transition-all duration-200 
                      bg-gradient-to-r from-yellow-300 to-amber-400 
                      text-gray-800 hover:scale-105 hover:shadow-sm 
                      focus:outline-none focus:ring-1 focus:ring-yellow-200 
                      disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Next <FaChevronRight/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
