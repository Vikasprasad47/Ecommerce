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
        url: '/api/orders/status',
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
  }

}

export default SummaryApi