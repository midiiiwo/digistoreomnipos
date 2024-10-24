import ActionTypes from '../actionTypes';

export const setInvoiceCustomer = customer => {
  return {
    type: ActionTypes.SET_INVOICE_CUSTOMER,
    payload: customer,
  };
};

export const addToInvoiceCart = product => {
  return {
    type: ActionTypes.ADD_TO_CART_INVOICE,
    payload: product,
  };
};

export const addToInvoiceCartBatch = cart => {
  return {
    type: ActionTypes.ADD_TO_CART_INVOICE_BATCH,
    payload: cart,
  };
};

export const deleteItemFromInvoiceCart = id => {
  return {
    type: ActionTypes.DELETE_ITEM_FROM_CART_INVOICE,
    payload: id,
  };
};

export const resetInvoiceCart = () => {
  return {
    type: ActionTypes.RESET_CART_INVOICE,
  };
};

export const updateInvoiceCartItemQuantity = info => {
  return {
    type: ActionTypes.UPDATE_CART_ITEM_QUANTITY_INVOICE,
    payload: info,
  };
};

export const setInvoiceDelivery = delivery => {
  return {
    type: ActionTypes.SET_INVOICE_DELIVERY,
    payload: delivery,
  };
};

export const setInvoiceDiscount = discount => {
  return {
    type: ActionTypes.SET_INVOICE_DISCOUNT,
    payload: discount,
  };
};

export const clearInvoiceDiscount = () => {
  return {
    type: ActionTypes.CLEAR_INVOICE_DISCOUNT,
  };
};

export const clearInvoiceDelivery = () => {
  return {
    type: ActionTypes.CLEAR_INVOICE_DELIVERY,
  };
};

export const resetInvoice = () => {
  return {
    type: ActionTypes.RESET_INVOICE_CART,
  };
};
export const setActiveInvoiceTab = tab => {
  return {
    type: ActionTypes.SET_INVOICING_TAB,
    payload: tab,
  };
};
