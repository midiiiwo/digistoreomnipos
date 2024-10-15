import ActionTypes from '../actionTypes';

export const selectCustomer = customer => {
  return {
    type: ActionTypes.SELECT_CUSTOMER,
    payload: customer,
  };
};

export const addToCart = product => {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: product,
  };
};

export const deleteItemFromCart = id => {
  return {
    type: ActionTypes.DELETE_ITEM_FROM_CART,
    payload: id,
  };
};

export const resetCart = () => {
  return {
    type: ActionTypes.RESET_CART,
  };
};

export const updateSubTotal = product => {
  return {
    type: ActionTypes.UPDATE_SUBTOTAL,
    payload: product,
  };
};

export const updateSubTotalFromNumber = value => {
  return {
    type: ActionTypes.UPDATE_SUBTOTAL_BY_NUMBER,
    payload: value,
  };
};

export const updateSubTotalFromCart = amount => {
  return {
    type: ActionTypes.UPDATE_SUBTOTAL_FROM_CART,
    payload: amount,
  };
};

export const setTotalAmount = amount => {
  return {
    type: ActionTypes.SET_TOTAL_AMOUNT,
    payload: amount,
  };
};

export const updateCartItemQuantity = info => {
  return {
    type: ActionTypes.UPDATE_CART_ITEM_QUANTITY,
    payload: info,
  };
};

export const applyDiscount = discount => {
  return {
    type: ActionTypes.APPLY_DISCOUNT,
    payload: discount,
  };
};

export const clearDiscount = subTotal => {
  return {
    type: ActionTypes.CLEAR_DISCOUNT,
    payload: subTotal,
  };
};

export const setTaxes = taxes => {
  return {
    type: ActionTypes.SET_TAXES,
    payload: taxes,
  };
};

export const setDelivery = delivery => {
  return {
    type: ActionTypes.SET_DELIVERY,
    payload: delivery,
  };
};

export const setInvoice = invoice => {
  return {
    type: ActionTypes.SET_INVOICE,
    payload: invoice,
  };
};

export const setCustomerPayment = customer => {
  return {
    type: ActionTypes.SET_CUSTOMER_PAYMENT,
    payload: customer,
  };
};

export const setPhone = phone => {
  return {
    type: ActionTypes.SET_PHONE,
    payload: phone,
  };
};

export const setAddTaxes = status => {
  return {
    type: ActionTypes.ADD_TAXES,
    payload: status,
  };
};

export const setOrderNote = note => {
  return {
    type: ActionTypes.SET_ORDER_NOTE,
    payload: note,
  };
};

export const setPaymentChannel = channel => {
  return {
    type: ActionTypes.SET_PAYMENT_CHANNEL,
    payload: channel,
  };
};

export const setOrderDate = date => {
  return {
    type: ActionTypes.ORDER_DATE,
    payload: date,
  };
};

export const setOrderTaxes = taxes => {
  return {
    type: ActionTypes.SET_ORDER_TAXES,
    payload: taxes,
  };
};

export const setDeliveryNote = note => {
  return {
    type: ActionTypes.SET_DELIVERY_NOTE,
    payload: note,
  };
};

export const setDeliveryDueDate = date => {
  return {
    type: ActionTypes.SET_DELIVERY_DUE_DATE,
    payload: date,
  };
};
