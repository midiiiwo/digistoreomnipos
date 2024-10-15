import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {
  paypointReducer,
  quickSaleReducer,
  transactionsReducer,
} from './reducers';
import { authReducer } from './reducers/auth';
import { saleReducer } from './reducers/sale';
import { productsReducer } from './reducers/products';
import { ordersReducer } from './reducers/orders';
import { merchantReducer } from './reducers/merchant';

const reducer = combineReducers({
  quickSale: quickSaleReducer,
  sale: saleReducer,
  auth: authReducer,
  paypoint: paypointReducer,
  products: productsReducer,
  orders: ordersReducer,
  merchant: merchantReducer,
  transactions: transactionsReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export { store };
