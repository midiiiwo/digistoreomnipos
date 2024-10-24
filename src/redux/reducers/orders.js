/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

const date = new Date();

export const ordersReducer = (
  state = {
    startDate: new Date(),
    endDate: new Date(),
    range: { label: 'Today', value: 'today' },
    orderOutlet: { label: 'ALL', value: 'ALL' },
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_START_DATE:
      return { ...state, startDate: action.payload };
    case ActionTypes.SET_END_DATE:
      return { ...state, endDate: action.payload };
    case ActionTypes.ORDER_DATE_RANGE:
      return { ...state, range: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(),
        range: null,
      };
    case ActionTypes.SET_ORDER_OUTLET:
      return { ...state, orderOutlet: action.payload };
    default:
      return state;
  }
};

