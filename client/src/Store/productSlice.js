import {createSlice} from '@reduxjs/toolkit';

const initialValue = {
    allCategory: [],
    loadingCategory: false,
    allSubCategory: [],
    product: [],
    // Add these for caching category products
    categoryProducts: {}, // {categoryId: [products]}
    loadingCategoryProducts: {}, // {categoryId: true/false}
    categoryProductsTimestamp: {} // {categoryId: timestamp}
}

const productSlice = createSlice({
    name: 'product',
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action) => {            
            state.allCategory = [...action.payload]
        },
        setLoadingCategory: (state,action) => {
            state.loadingCategory = action.payload
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = [...action.payload]
        },
        // Add these new reducers for caching
        setCategoryProducts: (state, action) => {
            const { categoryId, products } = action.payload;
            state.categoryProducts[categoryId] = products;
            state.categoryProductsTimestamp[categoryId] = Date.now();
        },
        setLoadingCategoryProducts: (state, action) => {
            const { categoryId, loading } = action.payload;
            state.loadingCategoryProducts[categoryId] = loading;
        },
        clearCategoryProductsCache: (state) => {
            state.categoryProducts = {};
            state.loadingCategoryProducts = {};
            state.categoryProductsTimestamp = {};
        }
    } 
})

export const {
    setAllCategory, 
    setAllSubCategory, 
    setLoadingCategory,
    setCategoryProducts,
    setLoadingCategoryProducts,
    clearCategoryProductsCache
} = productSlice.actions;
export default productSlice.reducer;