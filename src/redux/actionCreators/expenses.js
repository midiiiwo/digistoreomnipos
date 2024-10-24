import ActionTypes from '../actionTypes';

export const setSupplier = supplier => {
  return {
    type: ActionTypes.SET_SUPPLIER,
    payload: supplier,
  };
};

export const setActiveExpensesTab = tab => {
  return {
    type: ActionTypes.SET_EXPENSES_TAB,
    payload: tab,
  };
};
