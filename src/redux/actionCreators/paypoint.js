import ActionTypes from '../actionTypes';

export const setBalanceToShow = type => {
  return {
    type: ActionTypes.SET_BALANCE_TO_SHOW,
    payload: type,
  };
};

export const setBillType = type => {
  return {
    type: ActionTypes.SET_BILL_TYPE,
    payload: type,
  };
};

export const setPPStartDate = date => {
  return {
    type: ActionTypes.SET_PP_START_DATE,
    payload: date,
  };
};

export const setPPEndDate = date => {
  return {
    type: ActionTypes.SET_PP_END_DATE,
    payload: date,
  };
};

export const PPDateRange = range => {
  return {
    type: ActionTypes.PP_DATE_RANGE,
    payload: range,
  };
};
