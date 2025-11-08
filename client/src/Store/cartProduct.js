import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers:{
        handelAddItemCart : (state, action) => {
            state.cart = [...action.payload]
        }
    }
})

export const {handelAddItemCart} = cartSlice.actions


export default cartSlice.reducer