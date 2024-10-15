/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

const date = new Date();

export const paypointReducer = (
  state = {
    balanceToShow: 0,
    billType: '',
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(),
    range: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_BALANCE_TO_SHOW:
      return { ...state, balanceToShow: action.payload };
    case ActionTypes.SET_BILL_TYPE:
      return { ...state, billType: action.payload };
    case ActionTypes.SET_PP_START_DATE:
      return { ...state, startDate: action.payload };
    case ActionTypes.SET_PP_END_DATE:
      return { ...state, endDate: action.payload };
    case ActionTypes.PP_DATE_RANGE:
      return { ...state, range: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        balanceToShow: 0,
        billType: '',
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(),
        range: null,
      };
    default:
      return state;
  }
};
