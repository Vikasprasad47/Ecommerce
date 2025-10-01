import { configureStore } from '@reduxjs/toolkit'
import useReducer from './userSlice'
import productReducer from '../Store/productSlice'
import cartReducer from './cartProduct'
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    user: useReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ⬅️ disable the warning in dev
    }),
})
