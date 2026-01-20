export const baseUrl = import.meta.env.VITE_API_URL

const SummaryApi = {
    register: {
        url: "/api/user/register",
        method: 'POST'
    },
    login: {
        url: "/api/user/login",
        method: "POST"
    },
    google_login: {
        url: "/api/user/google-login",
        method: "POST"
    }, 
    forgot_password : {
        url: "/api/user/forgot-password",
        method: "PUT"
    },
    verify_forgot_password_otp: {
        url: "/api/user/verify-forgot-password-otp",
        method: "PUT"
    },
    resetPassword:{
        url: "/api/user/reset-password",
        method:"PUT"
    },
    refreshToken: {
        url: "/api/user/refresh-token",
        method: "POST" 
    },
    userDetails: {
        url: "/api/user/user-Details",
        method: "GET"
    },
    getAllUsers: {
        url: "/api/user/get-all-users",
        method: "GET"
    },
    AddToWishList:{
        url: "/api/user/wishlist/add",
        method: "POST"
    },
    DeleteFromWishList:{
        url: "/api/user/wishlist/remove/:productId",
        method: "DELETE"
    },
    GetAllWishlistProduct: {
        url : "/api/user/wishlist/get-all-wishlist-product",
        method: 'GET'
    },
    logout: {
        url: "/api/user/logout",
        method: "GET"
    },
    uploadAvatar: {
        url: "/api/user/upload-avatar",
        method: "PUT"
    },
    removeUserAvatar: {
        url: "/api/user/remove-avatar",
        method: "DELETE"
    },
    updateUserDetails: {
        url: "/api/user/update-user",
        method: "PUT"
    },
    SeenProduct: {
        method: "POST",
        url: "/api/user/seen-product"
    },
    GetRecentProducts: {
        method: "GET",
        url: "/api/user/recent-products"
    },
    getUserReviews: {
        url: "/api/user/user-reviews",
        method: "GET"
    }, 
    addCategory: {
        url: "/api/category/add-category",
        method: 'POST'
    },
    uploadImage: {
        url: "/api/upload-file/upload-image",
        method:'POST'
    },
    getCategory: {
        url: '/api/category/get',
        method: 'GET'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'PUT'
    },
    deletecategory: {
        url: '/api/category/delete',
        method: 'DELETE'
    },
    createSubCategory: {
        url: '/api/subcategory/create',
        method: 'POST'
    },
    getSubCategory: {
        url: '/api/subcategory/get',
        method: 'POST'
    },
    updateSubCategory: {
        url: '/api/subcategory/update',
        method: 'PUT'
    },
    deleteSubCategory: {
        url: '/api/subcategory/delete',
        method: 'DELETE'
    },
    createProduct: {
        url: '/api/product/create-product',
        method: 'POST'
    },
    getProduct: {
        url: '/api/product/get-products',
        method: 'POST'
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category',
        method: 'POST'
    },
    getProductByCategoryandSubCategory: {
        url: '/api/product/get-product-by-category-and-subcategory',
        method: 'POST'
    },
    getProductDetails: {
        url: '/api/product/get-product-details',
        method: 'POST'
    },
    updateProdctDetails: {
        url: '/api/product/update-product-details',
        method: "PUT"
    },
    deleteProduct: {
        url: '/api/product/delete-product',
        method: "DELETE"
    },
    searchProducts: {
        url: '/api/product/search-product',
        method: 'POST'
    },
    getSearchSuggestions: {
        url: "/api/product/productsearchsuggestions",
        method: "get"
    },
    latestProducts: {
        url: "/api/product/latest-products", // GET endpoint
        method: "GET"
    },
    ShareProduct: {
        method: "GET",
        url: "/api/share/product/"
    },
    addToCart: {
        url: '/api/cart/create',
        method: 'POST'
    },
    getCartItems: {
        url: '/api/cart/get',
        method: 'GET'
    },
    updateCartItem: {
        url: '/api/cart/update-qty',
        method: 'PUT'
    },
    deleteCartItem: {
        url: '/api/cart/delete-cart-items',
        method: 'DELETE'
    },
    createAddress: {
        url: '/api/address/create',
        method: 'POST'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'GET'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'PUT'
    },
    disableAddress: {
        url: '/api/address/disable',
        method: 'DELETE'
    },
    CashOnDeliveryOrder: {
        url: '/api/order/cash-on-delivery',
        method: 'POST'
    },
    payment_url: {
        url: '/api/order/checkout',
        method: 'POST'
    },
    StorePickupOrder: {
        url: '/api/order/store-pickup',
        method: 'POST'
    },
    getOrderItemList:{
        url: '/api/order/get-order-list',
        method: 'GET'
    },
    getAllOrderForAdmin: {
        url: '/api/order/get-all-order-for-admin',
        method: 'GET'
    },
    HideOrderFromAdmin: {
        url: '/api/order/hide-order-from-admin',
        method: 'PATCH'
    },
    updateOrderStatus: {
        url: '/api/order/status',
        method: 'PATCH'
    },
    // Reviews
    createReview: (productId) => ({
        url: `/api/review/product/${productId}`,
        method: "POST"
    }),

    getReviewsByProduct: (productId) => ({
        url: `/api/review/product/${productId}`, // ✅ FIXED
        method: "GET"
    }),

    updateReview: (reviewId) => ({
        url: `/api/review/${reviewId}`, // ✅ FIXED
        method: "PUT"
    }),

    deleteReview: (reviewId) => ({
        url: `/api/review/${reviewId}`, // ✅ FIXED
        method: "DELETE"
    }),

    analytics: {
        overview: {
        url: "/api/analytics/overview",
        method: "GET"
        },
        salesTrend: {
        url: "/api/analytics/sales-trend",
        method: "GET"
        },
        topProducts: {
        url: "/api/analytics/top-products",
        method: "GET"
        },
        categoryPerformance: {
        url: "/api/analytics/category-performance",
        method: "GET"
        },
        userGrowth: {
        url: "/api/analytics/user-growth",
        method: "GET"
        },
        orderStatus: {
        url: "/api/analytics/order-status",
        method: "GET"
        },
        paymentMethod: {
        url: "/api/analytics/payment-method",
        method: "GET"
        },
        geoPerformance: {
        url: "/api/analytics/geo",
        method: "GET"
        },
        todaySnapshot: {
        url: "/api/analytics/today",
        method: "GET"
        }
    },
    updateRole: {
        url: "/api/user/update-role",
        method: "PATCH"
    },
    updateStatus: {
        url: "/api/user/update-status",
        method: "PATCH"
    },
    sendEmailToUser: {
        url: "/api/user/send-email",
        method: "POST"
    },
    getEmailsByRole: { 
        url: "/api/user/get-emails", 
        method: "GET" 
    },
    sendBulkEmail: { 
        url: "/api/user/send-bulk-email", 
        method: "POST" 
    },
    subscribeNewsletter:{
        url:'/api/newsletter/subscribe',
        method:'POST'
    },
    deleteUser: {
        url: "/api/user/delete", // userId will be appended
        method: "DELETE"
    },
    loginWithMobile: {
        url: "/api/user/login-mobile",
        method: "POST"
    },
    submitContactForm: {
        url: "/api/contact/submit-form",
        method: "POST",
    },
    getAllContactsMessage: {
        url: "/api/contact/get-all-contact-msg",
        method: "GET",
    },
    getSingleContactMessage: {
        url: "/api/contact/get-single-contact-msg",
        method: "POST",
    },
    updateContactMessageStatus: {
        url: "/api/contact/update-contact-msg-status",
        method: "PATCH",
    },
    deleteContactMessage: {
        url: "/api/contact/delete-contact-msg",
        method: "DELETE",
    },
    createSubscriptionPlan: {
        url: "/api/seller/subscription/create-subscription-plan",
        method: "POST",
    },
    getOneSubscriptionPlan: {
        url: "/api/seller/subscription/get-one-subscription-plan",
        method: "POST",
    },
    updateSubscriptionPlan: {
        url: "/api/seller/subscription/update-subscription-plan",
        method: "POST",
    },
    deleteSubscriptionPlan: {
        url: "/api/seller/subscription/delete-subscription-plan",
        method: "POST",
    },
    getAllSubscriptionPlans: {
        url: "/api/seller/subscription/get-subscription-plan",
        method: "GET",
    },
    //Seller Application (User Flow)
    registerSeller: {
        url: "/api/seller/register",
        method: "POST",
    },

    uploadSellerKycDocuments: {
        url: "/api/seller/upload-documents",
        method: "POST",
    },

    getMySellerApplication: {
        url: "/api/seller/application/me",
        method: "GET",
    },

    //Admin – Seller Application Management
    adminListSellerApplications: {
        url: "/api/seller/admin/applications",
        method: "GET",
    },
    adminGetSellerApplication: (id) => ({
        url: `/api/seller/admin/application/${id}`,
        method: "GET",
    }),
    adminApproveSellerApplication: {
        url: "/api/seller/admin/application/approve",
        method: "POST",
    },
    adminRejectSellerApplication: {
        url: "/api/seller/admin/application/reject",
        method: "POST",
    },

    //Seller Subscription After Approval
    subscribeToPlan: {
        url: "/api/seller/subscription/subscribe",
        method: "POST",
    },

    //Optional — If you want seller details
    getSellerProfile: {
        url: "/api/seller/profile",
        method: "GET",
    },
}

export default SummaryApi