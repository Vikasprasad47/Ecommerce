import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft, FaMicrophone, FaTimes } from "react-icons/fa";
import useMobile from "../Hooks/useMobile";
import SearchSuggestions from "./SearchSuggestions";
import toast from "react-hot-toast";
import { LuScanSearch } from "react-icons/lu";

/**
 * Placeholder - replace with your real API call if needed.
 */
const fetchProducts = async (query, { requestId } = {}) => {
  if (!query) return [];
  await new Promise((resolve) => setTimeout(resolve, 250));
  const products = [
    { id: 1, name: "Biscuits", image: "/images/biscuits.png", category: "Food", price: "$4.99" },
    { id: 2, name: "Biscotti", image: "/images/biscotti.png", category: "Food", price: "$5.99" },
    { id: 3, name: "iPhone 16", image: "/images/iphone16.png", category: "Electronics", price: "$999" },
    { id: 4, name: "Fashion Shoes", image: "/images/shoes.png", category: "Fashion", price: "$79.99" },
  ];
  return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
};

const SAFE_HISTORY_KEY = "searchHistory_v1";
const MAX_HISTORY = 10;

const safeParseJSON = (v, fallback) => {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile(); // using your provided hook (breakpoint default 768)
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const lastRequestIdRef = useRef(0);
  const mountedRef = useRef(true);

  const [inputValue, setInputValue] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [activated, setActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showLiveCamera, setShowLiveCamera] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      try {
        speechRecognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
    if (location.pathname === "/") {
      setInputValue("");
      setActivated(false);
      setShowSuggestions(false);
      setProductSuggestions([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get("q") || "";
      if (isSearchPage) {
        setInputValue(q);
        setActivated(true);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error("Search params parse error:", err);
    }
  }, [location.search, isSearchPage]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAFE_HISTORY_KEY);
      const parsed = safeParseJSON(raw, []);
      if (Array.isArray(parsed)) {
        setSearchHistory(parsed.slice(0, MAX_HISTORY));
      } else {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error("load history error", err);
      setSearchHistory([]);
    }
  }, []);

  // Suggestions fetch with debounce + stale protection
  useEffect(() => {
    if (!inputValue.trim()) {
      setProductSuggestions([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    const thisRequestId = ++lastRequestIdRef.current;
    setIsLoading(true);

    const t = setTimeout(async () => {
      try {
        const res = await fetchProducts(inputValue, { requestId: thisRequestId });
        if (!mountedRef.current || !active || lastRequestIdRef.current !== thisRequestId) return;
        setProductSuggestions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("fetchProducts error:", err);
        if (mountedRef.current && active) setErrorMessage("Failed to load suggestions");
      } finally {
        if (mountedRef.current && active && lastRequestIdRef.current === thisRequestId) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [inputValue]);

  const persistHistory = useCallback((arr) => {
    try {
      localStorage.setItem(SAFE_HISTORY_KEY, JSON.stringify(arr.slice(0, MAX_HISTORY)));
    } catch (err) {
      console.error("persistHistory error:", err);
    }
  }, []);

  const updateHistory = useCallback(
    (term) => {
      try {
        if (!term || !term.trim()) return;
        const normalized = term.trim();
        const updated = [normalized, ...searchHistory.filter((t) => t.toLowerCase() !== normalized.toLowerCase())].slice(0, MAX_HISTORY);
        setSearchHistory(updated);
        persistHistory(updated);
      } catch (err) {
        console.error("updateHistory error:", err);
      }
    },
    [searchHistory, persistHistory]
  );

  const handleSearchSubmit = useCallback(
    (term) => {
      try {
        const searchTerm = (term || inputValue || "").trim();
        if (!searchTerm) return;
        updateHistory(searchTerm);
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        setShowSuggestions(false);
      } catch (err) {
        console.error("handleSearchSubmit error:", err);
        setErrorMessage("Unable to perform search");
      }
    },
    [inputValue, navigate, updateHistory]
  );

  const handleAIImageSearch = async (base64) => {
    const result = await analyzeImageWithAI(base64);

    toast.dismiss();

    if (!result) {
      toast.error("Could not detect product");
      return;
    }

    updateHistory(result);
    navigate(`/search?q=${encodeURIComponent(result)}`);
  };


  // -----------------------
  // Navigation resolver
  // -----------------------
  // Canonical base: "my orders" style (you requested "my orders" canonical)
  // Aliases normalized to canonical route names below.
  const navigationResolver = useCallback(
    (text) => {
      try {
        if (!text || !text.trim()) return null;
        const raw = text.trim().toLowerCase();

        // Trigger keywords - must start with one of these for nav intent
        const triggerPattern = /^(?:go to|open)\b\s*(.*)$/i;
        const m = raw.match(triggerPattern);
        if (!m) return null; // not a navigation attempt

        // remainder after keyword
        const remainder = (m[1] || "").trim();

        // If no remainder, treat as unknown nav
        if (!remainder) return "INVALID_NAV";

        // Now check canonical/alias mappings.
        // We'll treat these groups as equivalent (all matching -> route)
        //home
        const homePattern = /\b(home|go\s*home|homepage|main\s+page|start|start\s+page)\b/i;
        // Orders
        const orderPattern = /\b(my\s+orders|my\s+order|orders|order)\b/i;
        // Profile
        const profilePattern = /\b(profile|my\s+profile|account|my\s+account)\b/i;
        // Address
        const addressPattern = /\b(address|addresses|my\s+address|my\s+addresses|shipping\s+address)\b/i;
        // Wishlist
        const wishlistPattern = /\b(wish[\s-]?list|wishlist|my\s+wishlist)\b/i;
        // Reviews (also support rating/ratings)
        const reviewsPattern = /\b(review|reviews|my\s+reviews|rating|ratings)\b/i;
        // Cart
        const cartPattern = /\b(cart|my\s+cart)\b/i;
        // Admin (rare)
        const adminPattern = /\b(admin|admin\s+dashboard|dashboard)\b/i;
        // Search explicit
        const searchPattern = /\b(search|product\s+search)\b/i;

        //HOME
        if (homePattern.test(remainder)) {
          return "/";
        }

        // PROFILE
        if (profilePattern.test(remainder)) {
          return isMobile ? "/user" : "/dashboard/profile";
        }

        // ORDERS
        if (orderPattern.test(remainder)) {
          return "/dashboard/myorder";
        }

        // ADDRESS
        if (addressPattern.test(remainder)) {
          return "/dashboard/address";
        }

        // WISHLIST
        if (wishlistPattern.test(remainder)) {
          return "/dashboard/wishlist";
        }

        // REVIEWS
        if (reviewsPattern.test(remainder)) {
          return "/dashboard/reviews";
        }

        // CART (support)
        if (cartPattern.test(remainder)) {
          return "/cart";
        }

        // ADMIN
        if (adminPattern.test(remainder)) {
          return "/admin";
        }

        // If remainder explicitly asks "search" we consider this ambiguous navigation — per our rule treat as INVALID_NAV
        if (searchPattern.test(remainder)) {
          return "INVALID_NAV";
        }

        // If none matched -> INVALID_NAV (per your locked rule B)
        return "INVALID_NAV";
      } catch (err) {
        console.error("navigationResolver error:", err);
        return "ERROR";
      }
    },
    [isMobile]
  );

  // Handle nav or search based on voice transcript
  const handleVoiceTranscript = useCallback(
    (transcript) => {
      try {
        if (!transcript || !transcript.trim()) return;
        const navResult = navigationResolver(transcript);

        if (navResult === "ERROR") {
          toast.error("Oops! Can't go there.");
          setIsListening(false);
          return;
        }

        if (navResult === "INVALID_NAV") {
          // Per your instruction: show toast error, do NOT search, do NOT navigate.
          toast.error("Oops! Can't go there.");
          setIsListening(false);
          return;
        }

        if (typeof navResult === "string" && navResult.startsWith("/")) {
          // valid navigation route
          try {
            navigate(navResult);
            setShowSuggestions(false);
            setIsListening(false);
          } catch (err) {
            console.error("voice navigate error:", err);
            toast.error("Unable to navigate");
            setIsListening(false);
          }
          return;
        }

        // If navigationResolver returned null => not a nav attempt -> treat as voice search
        // Per rule: for voice-as-search we DO NOT write into the input visible state (keeps UX clean)
        if (navResult === null) {
          // voice search fallback
          setActivated(true);
          // optionally show transcript in input for feedback: we keep it hidden per requirement.
          updateHistory(transcript);
          navigate(`/search?q=${encodeURIComponent(transcript)}`);
          setShowSuggestions(false);
          setIsListening(false);
          return;
        }
      } catch (err) {
        console.error("handleVoiceTranscript error:", err);
        toast.error("Voice processing failed");
        setIsListening(false);
      }
    },
    [navigationResolver, navigate, updateHistory]
  );

  // Start voice recognition
  const startListening = useCallback(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Your browser does not support voice search");
        return;
      }

      if (!speechRecognitionRef.current) {
        speechRecognitionRef.current = new SpeechRecognition();
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.interimResults = false;
        speechRecognitionRef.current.lang = "en-US";

        speechRecognitionRef.current.onstart = () => setIsListening(true);
        speechRecognitionRef.current.onend = () => setIsListening(false);
        speechRecognitionRef.current.onerror = (ev) => {
          console.error("Speech recognition error", ev);
          setIsListening(false);
          toast.dismiss()
          toast.error("Voice recognition error");
        };

        speechRecognitionRef.current.onresult = (e) => {
          try {
            const transcript = e.results?.[0]?.[0]?.transcript?.trim() || "";
            if (!transcript) {
              toast.error("No speech detected");
              return;
            }
            handleVoiceTranscript(transcript);
          } catch (err) {
            console.error("speech onresult error:", err);
            toast.error("Voice processing failed");
            setIsListening(false);
          }
        };
      }

      try {
        speechRecognitionRef.current.start();
      } catch (err) {
        try {
          speechRecognitionRef.current.abort();
          speechRecognitionRef.current.start();
        } catch (e) {
          console.error("startListening start error", e);
          toast.error("Unable to start voice recognition");
        }
      }
    } catch (err) {
      console.error("startListening error:", err);
      toast.error("Voice search initialization failed");
    }
  }, [handleVoiceTranscript]);

  // Accessibility keyboard handlers
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
      return;
    }

    if (showSuggestions && (productSuggestions.length || searchHistory.length)) {
      const list = productSuggestions.length ? productSuggestions : searchHistory;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, list.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        if (highlightIndex >= 0) {
          const picked = list[highlightIndex];
          const term = picked?.name ? picked.name : picked;
          handleSearchSubmit(term);
          setHighlightIndex(-1);
          return;
        }
        handleSearchSubmit();
      }
    }
  };

  const clearInput = () => {
    setInputValue("");
    setProductSuggestions([]);
    setShowSuggestions(false);
    setActivated(false);
    setHighlightIndex(-1);
    try {
      inputRef.current?.focus();
    } catch {}
  };

  const onDeleteHistory = (t) => {
    try {
      const updated = searchHistory.filter((h) => h !== t);
      setSearchHistory(updated);
      persistHistory(updated);
    } catch (err) {
      console.error("onDeleteHistory error:", err);
    }
  };

  useEffect(() => {
    if (!errorMessage) return;
    const id = setTimeout(() => setErrorMessage(null), 3500);
    return () => clearTimeout(id);
  }, [errorMessage]);

  return (
    <>
      <div
        className="relative w-full min-w-[220px] lg:min-w-[440px] h-11 flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition focus-within:ring-2 focus-within:ring-amber-400 px-2"
        role="search"
        aria-label="Site search"
        onKeyDown={onKeyDown}
      >
        {/* LEFT ICON */}
        <div className="flex items-center px-2 text-gray-500" aria-hidden>
          {isMobile && isSearchPage ? (
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100" aria-label="Go back">
              <FaArrowLeft size={16} />
            </Link>
          ) : (
            <IoSearch size={18} />
          )}
        </div>

        {/* INPUT AREA */}
        <div className="flex-1 relative">
          {!activated ? (
            <div
              onClick={() => {
                setActivated(true);
                setTimeout(() => inputRef.current?.focus(), 80);
              }}
              className="text-gray-400 text-sm cursor-text px-2"
              role="button"
              tabIndex={0}
              aria-label="Activate search input"
            >
              <TypeAnimation
                sequence={["Search iPhone 16", 1500, "Search Shoes", 1500, "Search Grocery", 1500]}
                wrapper="span"
                speed={55}
                repeat={Infinity}
              />
            </div>
          ) : (
            <>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                  setHighlightIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent outline-none text-sm px-2"
                placeholder="Search products..."
                aria-label="Search products"
                autoFocus
              />
            </>
          )}

          {isLoading && (
            <div className="absolute right-1 top-1/2 translate-y-[-50%]" aria-hidden>
              <div className="h-4 w-4 border-2 border-amber-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
          )}
        </div>

        {/* CLEAR BUTTON */}
        {activated && inputValue && (
          <button
            onClick={clearInput}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="Clear search"
            title="Clear"
          >
            <FaTimes size={13} />
          </button>
        )}

        <button
          onClick={() => setShowLiveCamera((prev) => !prev)}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          title="Live Image Search"
        >
          <LuScanSearch size={20} strokeWidth={2.5}/>
        </button>


        {/* MIC BUTTON */}
        <button
          onClick={() => {
            if (isListening) {
              // STOP not start again
              speechRecognitionRef.current?.stop();
              setIsListening(false);
            } else {
              startListening();
          }}}
          className={`p-2 rounded-full transition ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-gray-500 hover:bg-gray-100"}`}
          title="Search by voice"
          aria-pressed={isListening}
          aria-label="Search by voice"
        >
          <FaMicrophone size={18} />
        </button>
      </div>

      {/* Suggestions dropdown */}
      <SearchSuggestions
        isOpen={showSuggestions && (productSuggestions.length || searchHistory.length)}
        productSuggestions={productSuggestions}
        searchHistory={searchHistory}
        inputValue={inputValue}
        highlightIndex={highlightIndex}
        onSearchSubmit={(t) => {
          handleSearchSubmit(t);
        }}
        onDeleteHistory={(t) => onDeleteHistory(t)}
        onClose={() => {
          setShowSuggestions(false);
          setHighlightIndex(-1);
        }}
        onHighlight={(index) => setHighlightIndex(index ?? -1)}
      />

      <div aria-live="polite" className="sr-only">
        {isListening ? "Listening..." : ""}
      </div>

      {errorMessage && (
        <div role="status" aria-live="assertive" className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Search;
