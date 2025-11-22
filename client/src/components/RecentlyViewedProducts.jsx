import React, { useEffect, useState } from "react";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import CartProduct from "./CartProduct";
import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import CardLoading from "./CardLoading"

const RecentlyViewedProducts = ({ title = "Recently Viewed", currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingCardNumber = new Array(6).fill(null);


  const fetchRecentProducts = async () => {
    try {
      setLoading(true);

      const res = await Axios({
        method: SummaryApi.GetRecentProducts.method,
        url: SummaryApi.GetRecentProducts.url,
      });

      let list = res.data?.data || [];

      // ❗🔥 Remove current product from the list
      list = list.filter((p) => p._id !== currentProductId);

      setProducts(list);
    } catch (err) {
      console.error("Failed to load recently viewed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentProducts();
  }, [currentProductId]);

  // If empty after filtering, show nothing
  if (!loading && products.length === 0) return null;

  return (
    <section className="my-3 mx-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FaHistory size={20} strokeWidth={2} className="text-amber-700"/>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      {/* Shimmer Loading */}
      {
        loading ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {loadingCardNumber.map((_, idx) => (
              <CardLoading key={idx} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="flex gap-4 overflow-x-auto no-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {products.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <CartProduct data={item} />
              </motion.div>
            ))}
          </motion.div>
        )
      }
    </section>
  );
};

export default RecentlyViewedProducts;
