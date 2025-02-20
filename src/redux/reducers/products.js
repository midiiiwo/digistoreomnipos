/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

export const productsReducer = (
  state = {
    activeProductsTab: 0,
    inventoryOutlet: { outlet_name: 'All Outlets', outlet_id: 'ALL' },
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_PRODUCTS_TAB:
      return { ...state, activeProductsTab: action.payload };
    case ActionTypes.RESET_STATE:
      return { ...state, activeProductsTab: 0 };
    case ActionTypes.SET_INVENTORY_OUTLET:
      return { ...state, inventoryOutlet: action.payload };
    default:
      return state;
  }
};

