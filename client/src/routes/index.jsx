import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import Categorypage from "../pages/Categorypage";
import Subcategorypage from "../pages/Subcategorypage";
import Uploadproductpage from "../pages/Uploadproductpage";
import Productpage from "../pages/Productpage";
import AdminPermission from "../layout/AdminPermission";
import ProductAdmin from "../pages/ProductAdmin";
import Productlistpage from "../pages/Productlistpage";
import AllUser from "../pages/AllUser";
import SingleProductDisplayPage from "../pages/SingleProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckOutPage from "../pages/CheckOutPage";
import Cancel from "../pages/Cancel";
import Success from "../pages/Success";
import ManageOrder from "../pages/ManageOrder";
import CommingSoon from "../pages/CommingSoon";
import UserAccount from "../components/UserAccount";
import UserWishList from "../pages/UserWishList";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import RefundPolicy from "../pages/RefundPolicy";
import Contact from "../pages/Contact";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const router = createBrowserRouter([
    {
        path: "/", // Home page
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage /> 
            },
            {
                path: "login",
                element: <Login/> 
            },
            {
                path: "register",
                element: <Register /> 
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "Otp-Verification",
                element: <OtpVerification/>
            },
            {
                path:"reset-password",
                element: <ResetPassword/>
            },
            {
                path:"user",
                // element: <UserMenuMobile/>
                element:<UserAccount/>
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "terms",
                element: <TermsAndConditions />
            },
            {
                path: "refund-policy",
                element: <RefundPolicy />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
                children: [
                    {
                        path: "profile",
                        element: <Profile/>
                    },
                    {
                        path: "myorder",
                        element: <MyOrder/>
                    },
                    {
                        path: "address",
                        element: <Address/>
                    },
                    {
                        path: 'wishlist',
                        element: <UserWishList/>
                    },
                    {
                        path: "category",
                        element: <AdminPermission><Categorypage/></AdminPermission>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermission><Subcategorypage/></AdminPermission>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermission><Uploadproductpage/></AdminPermission>
                    },
                    {
                        path: "product",
                        element: <AdminPermission><ProductAdmin/></AdminPermission>
                    },
                    {
                        path: "alluser",
                        element: <AdminPermission><AllUser/></AdminPermission>
                    },
                    {
                        path: "manage-order",
                        element: <AdminPermission><ManageOrder/></AdminPermission>
                    },
                    {
                        path: "analytics",
                        element: <AdminPermission><AnalyticsDashboard/></AdminPermission>
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <Productlistpage/>
                    }
                ]
            },
            {
                path: "product/:product",
                element: <SingleProductDisplayPage/>
            },
            {
                path: 'cart',
                element: <CartMobile/>
            },
            {
                path: 'checkout',
                element: <CheckOutPage/>
            },
            {
                path: 'order-success',
                element: <Success/>
            },
            {
                path: 'cancel',
                element: <Cancel/>
            },
            {
                path: 'wishlist',
                element: <UserWishList/>
            },
            {
                path: '/comming-soon',
                element: <CommingSoon/>
            }
        ]
    }
]);

export default router;