// src/components/Search.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../Hooks/useMobile";
import SearchSuggestions from "./SearchSuggestions";

// Mock API call
const fetchProducts = async (query) => {
  if (!query) return [];
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const products = [
    { id: 1, name: "Biscuits", image: "/images/biscuits.png", category: "Food", price: "$4.99" },
    { id: 2, name: "Biscotti", image: "/images/biscotti.png", category: "Food", price: "$5.99" },
    { id: 3, name: "iPhone 16", image: "/images/iphone16.png", category: "Electronics", price: "$999" },
    { id: 4, name: "Fashion Shoes", image: "/images/shoes.png", category: "Fashion", price: "$79.99" },
  ];
  
  return products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobile = useMobile();
  const inputRef = useRef(null);
  const isClosingRef = useRef(false);

  const [inputValue, setInputValue] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [activated, setActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detect if on search page
  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");

    if (location.pathname === "/") {
      // Reset input on home
      setInputValue("");
      setActivated(false);
      setShowSuggestions(false);
    }
  }, [location.pathname]);

  // Sync input with query param on search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (isSearchPage) {
      setInputValue(q);
      setActivated(true);
      setShowSuggestions(false);
    }
  }, [location.search, isSearchPage]);

  // Load history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  // Fetch product suggestions with debouncing
  useEffect(() => {
    let active = true;
    
    const loadSuggestions = async () => {
      if (inputValue.trim()) {
        setIsLoading(true);
        try {
          const results = await fetchProducts(inputValue);
          if (active) {
            setProductSuggestions(results);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          if (active) setProductSuggestions([]);
        } finally {
          if (active) setIsLoading(false);
        }
      } else {
        setProductSuggestions([]);
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadSuggestions, 300);
    
    return () => {
      active = false;
      clearTimeout(debounceTimer);
    };
  }, [inputValue]);

  // Update search history
  const updateSearchHistory = (term) => {
    if (!term.trim()) return;
    const updated = [
      term,
      ...searchHistory.filter((t) => t.toLowerCase() !== term.toLowerCase()),
    ].slice(0, 10); // Keep only last 10 searches
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // Handle search submission
  const handleSearchSubmit = (term) => {
    const searchTerm = term || inputValue;
    if (!searchTerm.trim()) return;
    
    updateSearchHistory(searchTerm);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setShowSuggestions(false);
    setActivated(true);
  };

  // Handle history deletion
  const handleDeleteHistory = (term) => {
    const updated = searchHistory.filter((t) => t !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Only open dropdown if it's not currently closing and there's content
    if ((e.target.value.trim() || searchHistory.length > 0) && !isClosingRef.current) {
      setShowSuggestions(true);
    }
  };

// Handle closing suggestions
  const handleCloseSuggestions = () => {
    isClosingRef.current = true;
    setShowSuggestions(false);
    // Reset after animation completes
    setTimeout(() => {
      isClosingRef.current = false;
    }, 400);
    // Refocus input after closing
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!isClosingRef.current && (inputValue.trim() || searchHistory.length > 0)) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur with delay to allow for clicks on suggestions
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isClosingRef.current) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(inputValue);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Merge suggestions for the old logic (keeping for compatibility)
  const mergedSuggestions = useMemo(() => {
    const historyMatches = searchHistory.filter((h) =>
      h.toLowerCase().includes(inputValue.toLowerCase())
    );
    return [...productSuggestions, ...historyMatches.map((h) => ({ name: h }))];
  }, [productSuggestions, searchHistory, inputValue]);

  return (
    <>
      <div className="relative w-full min-w-[200px] lg:min-w-[420px] h-11 lg:h-10 flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition focus-within:ring-2 focus-within:ring-amber-400">
        {/* Left Icon */}
        <div className="flex justify-center items-center h-full px-3 text-gray-500">
          {isMobile && isSearchPage ? (
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FaArrowLeft size={16} />
            </Link>
          ) : (
            <IoSearch size={18} />
          )}
        </div>

        {/* Input / Placeholder */}
        <div className="relative flex-1 h-full">
          {!activated ? (
            <div
              onClick={() => {
                setActivated(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="cursor-text flex items-center h-full w-full text-gray-400 select-none px-2"
            >
              <TypeAnimation
                sequence={[
                  'Search for "iPhone 16"', 2000,
                  'Search for "Electronics"', 2000,
                  'Search for "Grocery"', 2000,
                  'Search for "Fashion"', 2000,
                  'Search for "Brand"', 2000,
                  "Explore More", 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          ) : (
            <>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full h-full outline-none px-2 text-sm text-gray-800 caret-amber-600 bg-transparent rounded-r-full placeholder-gray-400"
                autoFocus
                placeholder="Search for products..."
              />

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      <SearchSuggestions
        isOpen={showSuggestions && (productSuggestions.length > 0 || searchHistory.length > 0)}
        productSuggestions={productSuggestions}
        searchHistory={searchHistory}
        inputValue={inputValue}
        onSearchSubmit={handleSearchSubmit}
        onDeleteHistory={handleDeleteHistory}
        onClose={handleCloseSuggestions}
      />
    </>
  );
};

export default Search;