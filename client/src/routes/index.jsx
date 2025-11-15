import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageLoader from "../components/PageLoader"; // Use your loader component
import SellerOnboarding from "../pages/SellerOnboarding";
import AdminSellerApplicationsPage from "../pages/AdminSellerApplicationsPage";


// Lazy imports
const App = lazy(() => import("../App"));
const Home = lazy(() => import("../pages/home"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const Login = lazy(() => import("../pages/login"));
const Register = lazy(() => import("../pages/register"));
const ForgotPassword = lazy(() => import("../pages/forgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const UserMenuMobile = lazy(() => import("../pages/UserMenuMobile"));
const Dashboard = lazy(() => import("../layout/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const MyOrder = lazy(() => import("../pages/MyOrder"));
const Address = lazy(() => import("../pages/Address"));
const Categorypage = lazy(() => import("../pages/Categorypage"));
const Subcategorypage = lazy(() => import("../pages/Subcategorypage"));
const Uploadproductpage = lazy(() => import("../pages/Uploadproductpage"));
const Productpage = lazy(() => import("../pages/Productpage"));
const AdminPermission = lazy(() => import("../layout/AdminPermission"));
const ProductAdmin = lazy(() => import("../pages/ProductAdmin"));
const Productlistpage = lazy(() => import("../pages/Productlistpage"));
const AllUser = lazy(() => import("../pages/AllUser"));
const SingleProductDisplayPage = lazy(() => import("../pages/SingleProductDisplayPage"));
const CartMobile = lazy(() => import("../pages/CartMobile"));
const CheckOutPage = lazy(() => import("../pages/CheckOutPage"));
const Cancel = lazy(() => import("../pages/Cancel"));
const Success = lazy(() => import("../pages/Success"));
const ManageOrder = lazy(() => import("../pages/ManageOrder"));
const CommingSoon = lazy(() => import("../pages/CommingSoon"));
const UserAccount = lazy(() => import("../components/UserAccount"));
const UserWishList = lazy(() => import("../pages/UserWishList"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));
const Contact = lazy(() => import("../pages/Contact"));
const AnalyticsDashboard = lazy(() => import("../components/AnalyticsDashboard"));
const UserReview = lazy(() => import("../pages/UserReview"));
const Couponpage = lazy(() => import("../pages/Couponpage"));
const NotFound = lazy(() => import("../components/NotFound"));
const About = lazy(() => import("../pages/About"))
const OnlinePaymentList = lazy(() => import("../pages/OnlinePaymentList"));
const StorePickupPage = lazy(() => import("../pages/StorePickupPage"))
const PhoneLogin = lazy(() => import("../components/PhoneLogin"));
const CustomerSupportMessages = lazy(() => import("../pages/CustomerSupportMessages"))
const AdminSellerSubscriptionPage = lazy(() => import("../pages/AdminSellerSubscriptionPage"));


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
                path: "login/phone",
                element: <PhoneLogin />
            },
            {
                path: "register",
                element: <Register /> 
            },
            {
                path: "register/phone",
                element: <PhoneLogin /> 
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
                path: "contact-us",
                element: <Contact />
            },
            {
                path: "about-us",
                element: <About />
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
                        path: "reviews",
                        element: <UserReview/>
                    },
                ]
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
            },
            {
                path: "coupons",
                element: <AdminPermission><Couponpage/></AdminPermission>
            },
            {
                path: "list-online-payments",
                element: <AdminPermission><OnlinePaymentList/></AdminPermission>
            },
            {
                path: "customer-support-messages",
                element: <AdminPermission><CustomerSupportMessages/></AdminPermission>
            },
            {
                path: "seller-subscription-plan-management",
                element: <AdminPermission><AdminSellerSubscriptionPage/></AdminPermission>
            },
            {
                path: "manage-seller-application",
                element: <AdminPermission><AdminSellerApplicationsPage/></AdminPermission>
            },
            {
                path: "apply-for-seller",
                element: <SellerOnboarding/>
            },
            {
                path: "products",
                children: [
                    {
                        path: ":category/:subCategory",
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
                path: 'comming-soon',
                element: <CommingSoon/>
            },
            {
                path: 'store-pickup/:productId',
                element: <StorePickupPage/>
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
]);

export default router;