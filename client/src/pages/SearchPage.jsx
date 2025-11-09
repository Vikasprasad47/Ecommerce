// import React, { useEffect, useState } from 'react';
// import CardLoading from '../components/CardLoading';
// import SummaryApi from '../comman/summaryApi';
// import Axios from '../utils/network/axios';
// import AxiosToastError from '../utils/network/AxiosToastError';
// import CardProduct from '../components/CartProduct';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { useLocation } from 'react-router-dom';
// import nothing from '../assets/nothing here yet.webp'

// function SearchPage() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const loadingArrayCard = new Array(10).fill(null);
//   const [page, setPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(1);
//   const params = useLocation();
//   const searchText = decodeURIComponent(params?.search?.slice(3) || '');

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.searchProducts,
//         data: {
//           search: searchText,
//           page: page,
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         if (responseData.page === 1) {
//           setData(responseData.data);
//         } else {
//           setData((prev) => [...prev, ...responseData.data]);
//         }
//         setTotalPage(responseData.totalPage);
//       }
//     } catch (error) {
//       toast.dismiss();
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page, searchText]);

//   const handleFetchMore = () => {
//     if (totalPage > page) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <section className="bg-white min-h-screen">
//       <div className="container mx-auto p-4">
//         <p className="font-semibold">Search Results: {data.length}</p>

//         {!loading && data.length === 0 && (
//           <div className="text-center mt-10 text-gray-600 text-lg font-medium">
//             <div className='flex items-center flex-col justify-center'>
//               <img width={170} src={nothing} alt="" className=''/>
//               <p>No product found for "<span className="text-black font-semibold">{searchText}</span>"</p>
//               </div>
//           </div>
//         )}

//         <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>
//           <div className="flex justify-center">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-8 gap-3 lg:gap-y-6">
//               {data.map((p, index) => (
//                 <CardProduct data={p} key={p?._id + 'searchPage' + index} searchText={searchText} />
//               ))}

//               {loading &&
//                 loadingArrayCard.map((_, index) => (
//                   <CardLoading key={'loadingSearchpage' + index} />
//                 ))}
//             </div>
//           </div>
//         </InfiniteScroll>
//       </div>
//     </section>
//   );
// }

// export default SearchPage;

// src/pages/SearchPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import debounce from "lodash.debounce"; // small helper - install if not present or replace with own debounce
import CardLoading from "../components/CardLoading";
import CardProduct from "../components/CartProduct";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/network/axios";
import AxiosToastError from "../utils/network/AxiosToastError";
import nothing from "../assets/nothing here yet.webp";

/**
 * Modern enterprise-grade Search Page with:
 * - Desktop left filter rail (sticky)
 * - Mobile filter drawer
 * - URL-synced filters
 * - Static store array (replace later with DB)
 * - Robust error handling & loading states
 *
 * Assumptions:
 * - CardProduct and CardLoading exist in your project (keeps original UI)
 * - SummaryApi.searchProducts points to POST /api/product/search-product
 * - If category/brand endpoints differ, change fetch URLs below
 *
 * NOTE:
 * - If you don't want lodash.debounce add a small local debounce or remove debouncing.
 */

// ---------- Static store list (replace with DB or seller pickupAddress later) ----------
const STATIC_STORES = [
  { _id: "store-delhi", name: "Delhi Central Store" },
  { _id: "store-patna", name: "Patna Main Store" },
  { _id: "store-bengaluru", name: "Bengaluru Express Hub" },
];

const DEFAULT_LIMIT = 16;
const LOADING_PLACEHOLDERS = new Array(8).fill(null);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const q = useQuery();

  // Read initial filters from URL
  const initialSearch = decodeURIComponent(q.get("q") || "") || "";
  const initialStore = q.get("store") || ""; // store._id
  const initialBrands = q.getAll("brand") || []; // repeatable
  const initialCategories = q.getAll("category") || [];
  const initialMin = q.get("min") || "";
  const initialMax = q.get("max") || "";
  const initialInStock = q.get("instock") === "1"; // boolean
  const initialSort = q.get("sort") || "relevance";
  const initialPage = Number(q.get("page") || 1);
  const initialLimit = Number(q.get("limit") || DEFAULT_LIMIT);

  // Results & paging
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPage, setTotalPage] = useState(1);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filter UI state
  const [searchText, setSearchText] = useState(initialSearch);
  const [store, setStore] = useState(initialStore);
  const [selectedBrands, setSelectedBrands] = useState(initialBrands);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [priceMin, setPriceMin] = useState(initialMin);
  const [priceMax, setPriceMax] = useState(initialMax);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [sortBy, setSortBy] = useState(initialSort);

  // Meta lists (categories & brands) fetched from API (fallback gracefully)
  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // UI toggles
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    stores: true,
  });

  // Avoid duplicate fetch on mount when page=initialPage; use a ref to control initial fetch behaviour
  const firstMountRef = useRef(true);

  // Helper: toggle multi-select arrays
  const toggleArrayItem = (arr, setArr, value) => {
    setArr((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  // ---------- Fetch categories & brands for filter lists (graceful fallback) ----------
  useEffect(() => {
    let cancelled = false;

    const loadMeta = async () => {
      try {
        const [catResp, brandResp] = await Promise.allSettled([
          Axios({ url: "/api/category/get-categories", method: "GET" }),
          Axios({ url: "/api/brand/get-brands", method: "GET" }),
        ]);

        if (cancelled) return;

        if (catResp.status === "fulfilled" && catResp.value?.data?.success) {
          setCategoriesList(catResp.value.data.data || []);
        } else {
          setCategoriesList([]); // graceful fallback
        }

        if (brandResp.status === "fulfilled" && brandResp.value?.data?.success) {
          setBrandsList(brandResp.value.data.data || []);
        } else {
          setBrandsList([]);
        }
      } catch (err) {
        // do not break the UI; set empty arrays
        setCategoriesList([]);
        setBrandsList([]);
      }
    };

    loadMeta();
    return () => (cancelled = true);
  }, []);

  // ---------- Build filters object sent to server ----------
  const filters = useMemo(() => {
    const f = {};
    if (selectedCategories.length) f.categories = selectedCategories;
    if (selectedBrands.length) f.brands = selectedBrands;
    if (priceMin !== "" || priceMax !== "") {
      f.price = {};
      if (priceMin !== "") f.price.$gte = Number(priceMin);
      if (priceMax !== "") f.price.$lte = Number(priceMax);
    }
    if (inStockOnly) f.inStock = true; // server can use this flag to check stock>0
    if (store) f.store = store; // store id
    return f;
  }, [selectedCategories, selectedBrands, priceMin, priceMax, inStockOnly, store]);

  // ---------- Synchronize filter state to URL (debounced) ----------
  // Keep URL readable & shareable. We'll write q, store, brand (repeatable), category (repeatable), min, max, instock, sort, page, limit
  const updateUrl = useMemo(
    () =>
      debounce((current) => {
        const params = new URLSearchParams();

        if (current.searchText) params.set("q", current.searchText);
        if (current.store) params.set("store", current.store);
        if (current.sortBy) params.set("sort", current.sortBy);
        if (current.limit) params.set("limit", current.limit);
        if (current.page) params.set("page", current.page);

        if (current.selectedBrands && current.selectedBrands.length) {
          current.selectedBrands.forEach((b) => params.append("brand", b));
        }
        if (current.selectedCategories && current.selectedCategories.length) {
          current.selectedCategories.forEach((c) => params.append("category", c));
        }
        if (current.priceMin !== "") params.set("min", current.priceMin);
        if (current.priceMax !== "") params.set("max", current.priceMax);
        if (current.inStockOnly) params.set("instock", "1");

        // Replace current history entry to avoid polluting history while user toggles filters a lot
        navigate(`/search?${params.toString()}`, { replace: true });
      }, 450),
    [navigate]
  );

  // call updateUrl when relevant states change
  useEffect(() => {
    updateUrl.cancel && updateUrl.cancel();
    updateUrl({
      searchText,
      store,
      selectedBrands,
      selectedCategories,
      priceMin,
      priceMax,
      inStockOnly,
      sortBy,
      page,
      limit,
    });
    // cleanup on unmount
    return () => updateUrl.cancel && updateUrl.cancel();
  }, [
    searchText,
    store,
    selectedBrands,
    selectedCategories,
    priceMin,
    priceMax,
    inStockOnly,
    sortBy,
    page,
    limit,
    updateUrl,
  ]);

  // ---------- Fetch products ----------
  const fetchProducts = async (opts = { reset: false }) => {
    try {
      setErrorMsg("");
      setLoading(true);

      const body = {
        search: searchText,
        page,
        limit,
        filters,
        sortBy,
      };

      const resp = await Axios({
        ...SummaryApi.searchProducts,
        data: body,
      });

      const respData = resp?.data;
      if (!respData) {
        setErrorMsg("Unexpected server response");
        return;
      }

      if (!respData.success) {
        setErrorMsg(respData.message || "No results");
        // if reset -> clear products
        if (opts.reset) setProducts([]);
        return;
      }

      const received = respData.data || [];
      const totalPg = respData.totalPage || Math.ceil((respData.totalCount || 0) / limit || 1);
      setTotalPage(totalPg);

      if (page === 1 || opts.reset) {
        setProducts(received);
      } else {
        setProducts((prev) => {
          // avoid duplicate entries if backend returns overlapping / duplicates
          const ids = new Set(prev.map((p) => p._id));
          const appended = received.filter((p) => !ids.has(p._id));
          return [...prev, ...appended];
        });
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to load products");
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  // When searchText, filters, sortBy, limit change -> reset page and fetch from start
  useEffect(() => {
    setPage(1);
    fetchProducts({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, JSON.stringify(filters), sortBy, limit]);

  // When page changes (infinite scroll) -> fetch more (skip first mount double-fetch)
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      // If initialPage > 1 (from URL), we still want to fetch initial page content
      if (initialPage > 1) {
        fetchProducts({ reset: true });
      }
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => {
    if (page < totalPage) setPage((p) => p + 1);
  };

  // Clear filters
  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceMin("");
    setPriceMax("");
    setInStockOnly(false);
    setStore("");
    setSortBy("relevance");
    setLimit(DEFAULT_LIMIT);
  };

  // Toggle sections
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // UI small helper for boolean to 1/0 in url or query
  const formattedCountLabel = () => {
    if (loading) return "Loading...";
    if (!products.length) return "0 items";
    return `${products.length} items`;
  };

  // ---------- Render ----------
  return (
    <section className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto p-4">
        {/* Top header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {/* Search text (non-edit field on this page; the app search box keeps updating this) */}
              <div>
                <p className="text-sm text-gray-600">Results for</p>
                <h1 className="text-2xl font-semibold text-gray-900 truncate max-w-xl">
                  {searchText ? `"${searchText}"` : "All products"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{formattedCountLabel()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="hidden sm:flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="sm:hidden inline-flex items-center gap-2 px-3 py-2 border rounded-lg bg-white"
            >
              <FaFilter />
              <span className="text-sm">Filters</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* ---------- Left filter rail (desktop only) ---------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] bg-white border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Refine</h3>
                <button
                  onClick={clearAll}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("categories")}
                  className="w-full flex items-center justify-between px-1 py-2"
                >
                  <span className="font-medium">Categories</span>
                  {openSections.categories ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openSections.categories && (
                  <div className="mt-2 max-h-44 overflow-auto pr-2">
                    {categoriesList.length ? (
                      categoriesList.map((c) => (
                        <label key={c._id} className="flex items-center gap-2 py-1 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(c._id)}
                            onChange={() => toggleArrayItem(selectedCategories, setSelectedCategories, c._id)}
                          />
                          <span className="truncate">{c.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Categories unavailable</p>
                    )}
                  </div>
                )}
              </div>

              {/* Brands */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("brands")}
                  className="w-full flex items-center justify-between px-1 py-2"
                >
                  <span className="font-medium">Brands</span>
                  {openSections.brands ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openSections.brands && (
                  <div className="mt-2 max-h-44 overflow-auto pr-2">
                    {brandsList.length ? (
                      brandsList.map((b) => (
                        <label key={b._id} className="flex items-center gap-2 py-1 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(b._id)}
                            onChange={() => toggleArrayItem(selectedBrands, setSelectedBrands, b._id)}
                          />
                          <span className="truncate">{b.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Brands unavailable</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("price")}
                  className="w-full flex items-center justify-between px-1 py-2"
                >
                  <span className="font-medium">Price</span>
                  {openSections.price ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {openSections.price && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-1/2 border rounded-lg px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-1/2 border rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Tip: Set both fields and press Enter to apply</p>
                  </div>
                )}
              </div>

              {/* Availability / Store */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("stores")}
                  className="w-full flex items-center justify-between px-1 py-2"
                >
                  <span className="font-medium">Availability</span>
                  {openSections.stores ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {openSections.stores && (
                  <div className="mt-2">
                    <label className="flex items-center gap-2 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={() => setInStockOnly((s) => !s)}
                      />
                      <span>In stock only</span>
                    </label>

                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Order from store</p>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm flex items-center gap-2">
                          <input
                            type="radio"
                            name="store-option"
                            checked={store === ""}
                            onChange={() => setStore("")}
                          />
                          <span>Any store</span>
                        </label>

                        <label className="text-sm flex items-center gap-2">
                          <input
                            type="radio"
                            name="store-option"
                            checked={store === "nearest"}
                            onChange={() => setStore("nearest")}
                          />
                          <span>Nearest store (auto)</span>
                        </label>

                        {STATIC_STORES.map((s) => (
                          <label key={s._id} className="text-sm flex items-center gap-2">
                            <input
                              type="radio"
                              name="store-option"
                              checked={store === s._id}
                              onChange={() => setStore(s._id)}
                            />
                            <span>{s.name}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Tip: choose a store to check product availability at that location. Optional.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer controls */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={clearAll}
                  className="flex-1 py-2 rounded-lg border bg-white text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setPage(1);
                    fetchProducts({ reset: true });
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* ---------- Main results area ---------- */}
          <main>
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 text-sm text-red-700 rounded">
                {errorMsg}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center mt-10 text-gray-600 text-lg font-medium">
                <div className="flex items-center flex-col justify-center">
                  <img width={170} src={nothing} alt="no results" />
                  <p className="mt-4">No product found for <span className="text-black font-semibold">"{searchText}"</span></p>
                </div>
              </div>
            )}

            <InfiniteScroll
              dataLength={products.length}
              next={loadMore}
              hasMore={page < totalPage}
              loader={null}
              style={{ overflow: "visible" }}
            >
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((p, idx) => (
                    <CardProduct key={p._id || idx} data={p} searchText={searchText} />
                  ))}

                  {/* Loading skeletons appended when loading and not first render */}
                  {loading &&
                    LOADING_PLACEHOLDERS.map((_, i) => <CardLoading key={"skeleton" + i} />)}
                </div>
              </div>
            </InfiniteScroll>
          </main>
        </div>
      </div>

      {/* ---------- Mobile filter drawer ---------- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden
          />
          <aside className="ml-auto w-full max-w-md bg-white h-full p-4 overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              {/* categories mobile */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Categories</span>
                </div>
                <div className="max-h-44 overflow-auto pr-2">
                  {categoriesList.length ? (
                    categoriesList.map((c) => (
                      <label key={c._id} className="flex items-center gap-2 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c._id)}
                          onChange={() => toggleArrayItem(selectedCategories, setSelectedCategories, c._id)}
                        />
                        <span>{c.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Categories unavailable</p>
                  )}
                </div>
              </div>

              {/* brands mobile */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Brands</span>
                </div>
                <div className="max-h-44 overflow-auto pr-2">
                  {brandsList.length ? (
                    brandsList.map((b) => (
                      <label key={b._id} className="flex items-center gap-2 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b._id)}
                          onChange={() => toggleArrayItem(selectedBrands, setSelectedBrands, b._id)}
                        />
                        <span>{b.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Brands unavailable</p>
                  )}
                </div>
              </div>

              {/* price mobile */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Price</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-1/2 border rounded-lg px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-1/2 border rounded-lg px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* availability mobile */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Availability</span>
                </div>
                <label className="flex items-center gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly((s) => !s)}
                  />
                  <span>In stock only</span>
                </label>

                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Order from store</p>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="radio"
                        name="store-mobile"
                        checked={store === ""}
                        onChange={() => setStore("")}
                      />
                      <span>Any store</span>
                    </label>
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="radio"
                        name="store-mobile"
                        checked={store === "nearest"}
                        onChange={() => setStore("nearest")}
                      />
                      <span>Nearest store (auto)</span>
                    </label>
                    {STATIC_STORES.map((s) => (
                      <label key={s._id} className="text-sm flex items-center gap-2">
                        <input
                          type="radio"
                          name="store-mobile"
                          checked={store === s._id}
                          onChange={() => setStore(s._id)}
                        />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearAll();
                  }}
                  className="flex-1 py-2 rounded-lg border"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setPage(1);
                    fetchProducts({ reset: true });
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
