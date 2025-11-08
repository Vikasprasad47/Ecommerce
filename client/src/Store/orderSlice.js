import {createSlice} from '@reduxjs/toolkit';

const initialValue = {
    order: []
}

const orderSlice = createSlice({
    name: 'order',
    initialState: initialValue,
    reducers: {
        setOrder: (state, action) => {
            state.order = [...action.payload]
        },
        updateOrderStatus(state, action) {
            const { orderId, status } = action.payload;
            const existingOrder = state.order.find(o => o._id === orderId);
            if (existingOrder) {
                existingOrder.items = existingOrder.items.map(item => ({
                    ...item,
                    status
                }));
            }
        }
    }
})

export const {setOrder, updateOrderStatus} = orderSlice.actions
export default orderSlice.reducer
