// import './App.css';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import { RiWifiOffLine } from "react-icons/ri";
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from "@vercel/speed-insights/react";


// import fetchUserDetails from './utils/featchUserDetails';
// import { setUserDetails } from './Store/userSlice';
// import { setAllCategory, setAllSubCategory, setLoadingCategory } from './Store/productSlice';
// import Axios from './utils/axios';
// import SummaryApi from './comman/summaryApi';

// import GlobalProvider from './provider/globalProvider';
// import ErrorBoundary from './components/ErrorBoundary';
// import HeaderSkeleton from './components/HeaderSkeleton';
// import PageLoader from './components/PageLoader';

// // Lazy load heavy components
// const Header = lazy(() => import('./components/Header'));
// // const CartMobilelink = lazy(() => import('./components/CartMobilelink'));
// const DevToolsToggle = lazy(() => import('./components/DevToolsToggle'));

// function App() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isInitialMount = useRef(true);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const location = useLocation();

//   // Improved fetch user with authentication check
//   const fetchUser = useCallback(async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const refreshToken = localStorage.getItem("refreshToken");
      
//       // If no tokens, skip user fetch
//       if (!accessToken && !refreshToken) {
//         dispatch(setUserDetails(null));
//         return;
//       }

//       const userdata = await fetchUserDetails();
//       if (userdata?.success) {
//         dispatch(setUserDetails(userdata.data));
//       } else {
//         // If user fetch fails but we have refresh token, try to refresh
//         if (refreshToken && userdata?.message?.includes("token")) {
//           console.log("User fetch failed, tokens might be expired");
//           // The axios interceptor will handle refresh automatically
//         } else {
//           dispatch(setUserDetails(null));
//         }
//       }
//     } catch (err) {
//       console.error("FetchUser error:", err);
//       dispatch(setUserDetails(null));
//     }
//   }, [dispatch]);

//   // Fetch categories
//   const fetchCategory = useCallback(async () => {
//     try {
//       dispatch(setLoadingCategory(true));
//       const { data } = await Axios({ ...SummaryApi.getCategory });
//       if (data.success) dispatch(setAllCategory(data.data));
//     } catch (err) {
//       console.error("fetchCategory error:", err);
//     } finally {
//       dispatch(setLoadingCategory(false));
//     }
//   }, [dispatch]);

//   // Fetch subcategories
//   const fetchSubCategory = useCallback(async () => {
//     try {
//       const { data } = await Axios({ ...SummaryApi.getSubCategory });
//       if (data.success) dispatch(setAllSubCategory(data.data));
//     } catch (err) {
//       console.error("fetchSubCategory error:", err);
//     }
//   }, [dispatch]);

//   // Initialize authentication and data
//   const initializeApp = useCallback(async () => {
//     try {
//       setIsCheckingAuth(true);
      
//       const accessToken = localStorage.getItem("accessToken");
//       const refreshToken = localStorage.getItem("refreshToken");
      
//       // If we have tokens, fetch user data first
//       if (accessToken || refreshToken) {
//         await fetchUser();
//       }
      
//       // Always fetch categories (public data)
//       await Promise.all([fetchCategory(), fetchSubCategory()]);
      
//     } catch (error) {
//       console.error("App initialization error:", error);
//     } finally {
//       setIsCheckingAuth(false);
//     }
//   }, [fetchUser, fetchCategory, fetchSubCategory]);

//   // Network status handling
//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       toast.dismiss('network-status');
//       if (!isInitialMount.current) {
//         toast.success("You are back online 🎉");
//         initializeApp(); // Re-initialize when coming back online
//       }
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       toast.error("You are offline", {
//         id: 'network-status',
//         duration: Infinity,
//         icon: <RiWifiOffLine className="text-xl text-red-600" />,
//         position: "top-center",
//         style: {
//           marginTop: '35px',
//         },  
//       });
//     };

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     // Initialize app on mount
//     if (isInitialMount.current) {
//       initializeApp();
//       isInitialMount.current = false;
//     }

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, [initializeApp]);

//   // Show loading state while checking authentication
//   if (isCheckingAuth && isInitialMount.current) {
//     return (
//       <PageLoader />
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <GlobalProvider>
//         <div className="min-h-screen flex flex-col">
//           {/* Offline banner */}
//           {!isOnline && (
//             <div className="bg-red-600 text-white text-center py-2 text-sm">
//               You are offline. Some features may not be available.
//             </div>
//           )}

//           <Suspense fallback={<HeaderSkeleton />}>
//             <Header />
//           </Suspense>

//           <main className="flex-1">
//             <Outlet />
//           </main>

//           <Toaster/>

//           <DevToolsToggle />
//           {/* Analytics */}
//           <Analytics />
//           <SpeedInsights />
//         </div>
//       </GlobalProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;


import './App.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { RiWifiOffLine } from "react-icons/ri";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { throttle } from 'lodash';

import fetchUserDetails from './utils/featchUserDetails';
import { setUserDetails } from './Store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './Store/productSlice';
import Axios from './utils/axios';
import SummaryApi from './comman/summaryApi';

import GlobalProvider from './provider/globalProvider';
import ErrorBoundary from './components/ErrorBoundary';
import HeaderSkeleton from './components/HeaderSkeleton';
import PageLoader from './components/PageLoader';

// Lazy load heavy components
const Header = lazy(() => import('./components/Header'));
const DevToolsToggle = lazy(() => import('./components/DevToolsToggle'));

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ===========================
  // Fetch User with token check
  // ===========================
  const fetchUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        dispatch(setUserDetails(null));
        return;
      }

      const userdata = await fetchUserDetails();
      if (userdata?.success) {
        dispatch(setUserDetails(userdata.data));
      } else if (refreshToken && userdata?.message?.includes("token")) {
        console.log("User fetch failed, tokens might be expired");
      } else {
        dispatch(setUserDetails(null));
      }
    } catch (err) {
      console.error("FetchUser error:", err);
      dispatch(setUserDetails(null));
    }
  }, [dispatch]);

  // ===========================
  // Fetch Categories & Subcategories
  // ===========================
  const fetchCategory = useCallback(async () => {
    try {
      dispatch(setLoadingCategory(true));
      const { data } = await Axios({ ...SummaryApi.getCategory });
      if (data.success) dispatch(setAllCategory(data.data));
    } catch (err) {
      console.error("fetchCategory error:", err);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  }, [dispatch]);

  const fetchSubCategory = useCallback(async () => {
    try {
      const { data } = await Axios({ ...SummaryApi.getSubCategory });
      if (data.success) dispatch(setAllSubCategory(data.data));
    } catch (err) {
      console.error("fetchSubCategory error:", err);
    }
  }, [dispatch]);

  // ===========================
  // App Initialization
  // ===========================
  const initializeApp = useCallback(async () => {
    try {
      setIsCheckingAuth(true);

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken || refreshToken) await fetchUser();

      await Promise.all([fetchCategory(), fetchSubCategory()]);
    } catch (error) {
      console.error("App initialization error:", error);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [fetchUser, fetchCategory, fetchSubCategory]);

  // ===========================
  // Network Status Handling
  // ===========================
  useEffect(() => {
    const handleOnline = () => {
      // use requestIdleCallback to avoid blocking main thread
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setIsOnline(true);
          toast.dismiss('network-status');
          if (!isInitialMount.current) {
            toast.success("You are back online 🎉");
            initializeApp();
          }
        });
      } else {
        setIsOnline(true);
        toast.dismiss('network-status');
        if (!isInitialMount.current) {
          toast.success("You are back online 🎉");
          initializeApp();
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline", {
        id: 'network-status',
        duration: Infinity,
        icon: <RiWifiOffLine className="text-xl text-red-600" />,
        position: "top-center",
        style: { marginTop: '35px' },
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initialize app once on mount
    if (isInitialMount.current) {
      // small delay to let main thread breathe
      setTimeout(() => {
        initializeApp();
        isInitialMount.current = false;
      }, 100);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [initializeApp]);

  // ===========================
  // Show loader while checking auth
  // ===========================
  if (isCheckingAuth && isInitialMount.current) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <GlobalProvider>
        <div className="min-h-screen flex flex-col">
          {/* Offline banner */}
          {!isOnline && (
            <div className="bg-red-600 text-white text-center py-2 text-sm">
              You are offline. Some features may not be available.
            </div>
          )}

          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>

          <main className="flex-1">
            <Outlet />
          </main>

          <Toaster toastOptions={{
            className: '',
            style: {
              fontWeight: '100', // make text semi-bold
              fontFamily: 'Arial, sans-serif', // optional: change font
            },
          }}/>

          <DevToolsToggle />
          {/* Analytics */}
          <Analytics />
          <SpeedInsights />
        </div>
      </GlobalProvider>
    </ErrorBoundary>
  );
}

export default App;
