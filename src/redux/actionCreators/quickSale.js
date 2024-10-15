import ActionTypes from '../actionTypes';

export const selectChannel = channel => {
  return {
    type: ActionTypes.SELECT_CHANNEL,
    payload: channel,
  };
};

export const quickSaleAmount = amount => {
  return {
    type: ActionTypes.QUICK_SALE_AMOUNT,
    payload: amount,
  };
};

export const setQuickSaleSubTotal = amount => {
  return {
    type: ActionTypes.SET_QUICK_SALE_SUBTOTAL,
    payload: amount,
  };
};

export const addDescription = description => {
  return {
    type: ActionTypes.ADD_DESCRIPTION,
    payload: description,
  };
};

export const setQuickSaleAmount = amount => {
  return {
    type: ActionTypes.SET_QUICK_SALE_AMOUNT,
    payload: amount,
  };
};

export const clearAmount = () => {
  return {
    type: ActionTypes.CLEAR_AMOUNT,
  };
};

export const applyQuickSaleDiscount = amount => {
  return {
    type: ActionTypes.APPLY_QUICK_SALE_DISCOUNT,
    payload: amount,
  };
};

export const setTempProduct = product => {
  return {
    type: ActionTypes.SET_TEMP_PRODUCT,
    payload: product,
  };
};

export const setQuickSaleInAction = status => {
  console.log('quuuuuuu', status);
  return {
    type: ActionTypes.SET_QUICK_SALE_IN_ACTION,
    payload: status,
  };
};
