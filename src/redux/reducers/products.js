/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

export const productsReducer = (
  state = {
    activeProductsTab: 0,
    inventoryOutlet: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_PRODUCTS_TAB:
      return { ...state, activeProductsTab: action.payload };
    case ActionTypes.RESET_STATE:
      return { activeProductsTab: 0 };
    case ActionTypes.SET_INVENTORY_OUTLET:
      return { ...state, inventoryOutlet: action.payload };
    default:
      return state;
  }
};

