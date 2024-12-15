import { createContext, useContext, useReducer } from 'react';
import { reducer } from './reducers';

const StoreContext = createContext();

const initialState = {
  products: [],
  categories: [],
  cart: [],
  cartOpen: false,
  currentCategory: ''
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
