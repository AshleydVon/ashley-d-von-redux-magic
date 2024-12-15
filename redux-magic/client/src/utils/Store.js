import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; 
import categoryReducer from './categorySlice'; 

const store = configureStore({
  reducer: {
    cart: cartReducer,
    categories: categoryReducer,
    
  },
});

export default store;
