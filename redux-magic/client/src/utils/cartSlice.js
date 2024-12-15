import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    cartOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload);
      if (index >= 0) {
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
