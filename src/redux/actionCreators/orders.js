import ActionTypes from '../actionTypes';

export const setStartDate = date => {
  return {
    type: ActionTypes.SET_START_DATE,
    payload: date,
  };
};

export const setEndDate = date => {
  return {
    type: ActionTypes.SET_END_DATE,
    payload: date,
  };
};

export const orderDateRange = range => {
  return {
    type: ActionTypes.ORDER_DATE_RANGE,
    payload: range,
  };
};

export const setOrderOutlet = outlet => {
  return {
    type: ActionTypes.ORDER_OUTLET,
    payload: outlet,
  };
};
