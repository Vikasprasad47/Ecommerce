// import React, { useEffect, useState } from 'react';
// import { IoSearch } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { TypeAnimation } from 'react-type-animation';
// import { FaArrowLeft } from "react-icons/fa";
// import useMobile from '../Hooks/useMobile';

// const Search = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSearchPage, setIsSearchPage] = useState(false);
//   const [isMobile] = useMobile();
//   const [inputValue, setInputValue] = useState('');
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   useEffect(() => {
//     setIsSearchPage(location.pathname === "/search");
//   }, [location.pathname]);

//   useEffect(() => {
//     const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
//     setSearchHistory(history);
//   }, []);

//   const updateSearchHistory = (term) => {
//     if (!term.trim()) return;
//     let updated = [...searchHistory.filter(t => t.toLowerCase() !== term.toLowerCase())];
//     updated.unshift(term);
//     if (updated.length > 10) updated.pop();
//     setSearchHistory(updated);
//     localStorage.setItem('searchHistory', JSON.stringify(updated));
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);
//     setShowSuggestions(true);
//     navigate(`/search?q=${encodeURIComponent(value)}`);
//   };

//   const handleHistoryClick = (term) => {
//     setInputValue(term);
//     setShowSuggestions(false);
//     navigate(`/search?q=${encodeURIComponent(term)}`);
//   };

//   const handleDeleteHistory = (term) => {
//     const updated = searchHistory.filter((t) => t !== term);
//     setSearchHistory(updated);
//     localStorage.setItem('searchHistory', JSON.stringify(updated));
//   };

//   const highlightMatch = (text) => {
//     const index = text.toLowerCase().indexOf(inputValue.toLowerCase());
//     if (index === -1 || !inputValue) return text;
//     return (
//       <>
//         {text.substring(0, index)}
//         <span className="text-amber-500 font-semibold">
//           {text.substring(index, index + inputValue.length)}
//         </span>
//         {text.substring(index + inputValue.length)}
//       </>
//     );
//   };

//   const filteredSuggestions = inputValue
//     ? searchHistory.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
//     : searchHistory;

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       updateSearchHistory(inputValue);
//       setShowSuggestions(false);
//     }
//   };

//   const redirectToSearchPage = () => {
//     navigate("/search");
//   };

//   return (
//     <div className="relative w-full min-w-[190px] lg:min-w-[420px] h-11 lg:h-10 rounded-full border border-neutral-300 overflow-hidden flex items-center text-neutral-500 bg-gray-50 group focus-within:border-amber-400 z-50">
//       <div>
//         {isMobile && isSearchPage ? (
//           <Link to={"/"} className="cursor-pointer flex justify-center items-center h-full p-1 m-1 ml-3 group-focus-within:text-amber-400 bg-transparent rounded-full">
//             <FaArrowLeft size={16} />
//           </Link>
//         ) : (
//           <button type="submit" className="cursor-pointer flex justify-center items-center h-full p-4 group-focus-within:text-amber-400">
//             <IoSearch size={18} />
//           </button>
//         )}
//       </div>

//       <div className="SearchBar w-full h-full relative">
//         {!isSearchPage ? (
//           <div onClick={redirectToSearchPage} className="cursor-pointer h-full w-full flex items-center">
//             <TypeAnimation
//               sequence={[
//                 'Search for "iPhone 16"', 2000,
//                 'Search for "Electronics"', 2000,
//                 'Search for "Grocery"', 2000,
//                 'Search for "Fashion"', 2000,
//                 'Search for "Brand"', 2000,
//                 'Explore More', 2000,
//               ]}
//               wrapper="span"
//               speed={50}
//               repeat={Infinity}
//             />
//           </div>
//         ) : (
//           <div className="relative w-full h-full">
//             <input
//               type="text"
//               value={inputValue}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               className="bg-transparent w-full h-full outline-none pl-2 text-black text-sm leading-tight caret-neutral-500"
//               onFocus={() => setShowSuggestions(true)}
//               onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
//               autoFocus
//             />
//             {inputValue === '' && (
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                 <TypeAnimation
//                   sequence={[
//                     'Search for "iPhone 16"', 2000,
//                     'Search for "Electronics"', 2000,
//                     'Search for "Grocery"', 2000,
//                     'Search for "Fashion"', 2000,
//                     'Search for "Brand"', 2000,
//                     'Explore More', 2000,
//                   ]}
//                   wrapper="span"
//                   speed={50}
//                   repeat={Infinity}
//                 />
//               </span>
//             )}

//             {showSuggestions && (
//               <div className="absolute left-0 top-full mt-1 w-full bg-white shadow-lg rounded-lg z-50 max-h-60 overflow-auto border border-gray-200">
//                 {filteredSuggestions.length > 0 ? (
//                   filteredSuggestions.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-100 group"
//                     >
//                       <span
//                         className="cursor-pointer w-full"
//                         onMouseDown={() => handleHistoryClick(item)}
//                       >
//                         {highlightMatch(item)}
//                       </span>
//                       <button
//                         className="ml-2 text-gray-400 hover:text-red-500 invisible group-hover:visible"
//                         onMouseDown={(e) => {
//                           e.stopPropagation();
//                           handleDeleteHistory(item);
//                         }}
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-4 py-2 text-sm text-gray-500">
//                     No products found for "<span className="font-semibold text-black">{inputValue}</span>"
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Search;


import React, { useEffect, useState, useMemo } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../Hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const [inputValue, setInputValue] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => setIsSearchPage(location.pathname === "/search"), [location.pathname]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  const updateSearchHistory = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleHistoryClick = (term) => {
    setInputValue(term);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleDeleteHistory = (term) => {
    const updated = searchHistory.filter((t) => t !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const filteredSuggestions = useMemo(
    () =>
      inputValue
        ? searchHistory.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
        : searchHistory,
    [inputValue, searchHistory]
  );

  const redirectToSearchPage = () => navigate("/search");

  const highlightMatch = (text) => {
    const index = text.toLowerCase().indexOf(inputValue.toLowerCase());
    if (index === -1 || !inputValue) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="text-amber-600 font-semibold">{text.substring(index, index + inputValue.length)}</span>
        {text.substring(index + inputValue.length)}
      </>
    );
  };

  return (
    <div className="relative w-full min-w-[200px] lg:min-w-[420px] h-11 lg:h-10 flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition focus-within:ring-2 focus-within:ring-amber-400">
      
      {/* Left Icon */}
      <div className="flex justify-center items-center h-full px-3 text-gray-500">
        {isMobile && isSearchPage ? (
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition">
            <FaArrowLeft size={16} />
          </Link>
        ) : (
          <IoSearch size={18} />
        )}
      </div>

      {/* Input / Placeholder */}
      <div className="relative flex-1 h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="cursor-pointer flex items-center h-full w-full text-gray-400 select-none px-2"
          >
            <TypeAnimation
              sequence={[
                'Search for "iPhone 16"', 2000,
                'Search for "Electronics"', 2000,
                'Search for "Grocery"', 2000,
                'Search for "Fashion"', 2000,
                'Search for "Brand"', 2000,
                'Explore More', 2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && (updateSearchHistory(inputValue), setShowSuggestions(false))}
              className="w-full h-full outline-none px-2 text-sm text-gray-800 caret-amber-600 bg-transparent rounded-r-full"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              autoFocus
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-50 max-h-60 overflow-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition cursor-pointer"
                      onMouseDown={() => handleHistoryClick(item)}
                    >
                      <span>{highlightMatch(item)}</span>
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleDeleteHistory(item);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results for "<span className="font-semibold text-gray-800">{inputValue}</span>"
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
