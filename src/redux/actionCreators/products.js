import ActionTypes from '../actionTypes';

export const setActiveProductsTab = tab => {
  return {
    type: ActionTypes.SET_ACTIVE_PRODUCTS_TAB,
    payload: tab,
  };
};

export const setInventoryOutlet = outlet => {
  return {
    type: ActionTypes.SET_INVENTORY_OUTLET,
    payload: outlet,
  };
};
