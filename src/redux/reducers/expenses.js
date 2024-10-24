/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

export const expensesReducer = (
  state = {
    supplier: null,
    activeTab: 0,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_EXPENSES_TAB:
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};

