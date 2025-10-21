import React, { useEffect, useState, useRef, useCallback } from "react";
import Portal from "./Portal";
import { IoSearch, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdManageSearch } from "react-icons/md";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";

const SearchSuggestions = ({
  isOpen,
  searchHistory,
  inputValue,
  onSearchSubmit,
  onDeleteHistory,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const isClosingRef = useRef(false);
  const navigate = useNavigate();

  // Fetch real-time suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
        setProductSuggestions([]);
        return;
    }    
    setLoading(true);
    try {
        const response = await Axios({
        ...SummaryApi.getSearchSuggestions,
        params: { q: query, limit: 6 }
        });
                
        if (response.data.success) {
        setProductSuggestions(response.data.data);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        setProductSuggestions([]);
    } finally {
        setLoading(false);
    }
    }, []);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen && inputValue) {
        fetchSuggestions(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, isOpen, fetchSuggestions]);

  // Handle animation states
  useEffect(() => {
    if (isOpen && !isClosingRef.current) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        if (!isOpen) {
          setIsMounted(false);
          isClosingRef.current = false;
          setProductSuggestions([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isMounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMounted]);

  // Handle product click - redirect to product page
  const handleProductClick = (product) => {
    if (product.slug) {
      navigate(`/product/${product.slug}`);
      handleClose();
    }
  };

  // Handle search term click
  const handleSearchTermClick = (term) => {
    onSearchSubmit(term);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    if (!isClosingRef.current) {
      isClosingRef.current = true;
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Filter history based on current input
  const filteredHistory = searchHistory.filter((h) =>
    h.toLowerCase().includes(inputValue.toLowerCase())
  );

  const hasRecommendations = productSuggestions.length > 0 || filteredHistory.length > 0;
  
  if (!isMounted) return null;

  return (
    <Portal>
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      >
        <div 
          ref={dropdownRef}
          className={`fixed left-1/2 transform -translate-x-1/2 w-[95vw] max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[70vh] overflow-hidden transition-all duration-300 ${
            isVisible 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-4'
          }`}
          style={{ top: '20%' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <IoSearch className="text-amber-600 text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {loading ? 'Searching...' : 'Search Suggestions'}
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:scale-110 hover:shadow-md"
            >
              <IoClose className="text-gray-500 text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {/* Loading State */}
            {loading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Searching products...</p>
              </div>
            )}

            {/* Real-time Product Suggestions */}
            {!loading && productSuggestions.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Products
                  </span>
                </div>
                <div className="space-y-2 p-2">
                  {productSuggestions.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 cursor-pointer transition-all duration-200 border border-transparent bg-gray-100"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 group-hover:border-amber-400 transition-all duration-200"
                        onError={(e) => {
                          e.target.src = '/default-product.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate group-hover:text-amber-700 transition-colors">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && inputValue && productSuggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2 flex items-center justify-center"><MdManageSearch size={45}/></div>
                <p className="text-gray-500">No Recommendation found for "{inputValue}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
              </div>
            )}

            {/* Recent Searches */}
            {filteredHistory.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Recent Searches
                  </span>
                </div>
                <div className="space-y-1 p-2">
                  {filteredHistory.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                      onClick={() => handleSearchTermClick(term)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <IoSearch className="text-blue-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                            {term}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(term);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all duration-200 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Click any product to view details</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default SearchSuggestions;