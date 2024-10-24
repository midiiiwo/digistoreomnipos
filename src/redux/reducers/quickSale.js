/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

export const quickSaleReducer = (
  state = {
    channel: 'Inshop',
    amount: '',
    description: '',
    tempProduct: null,
    quickSaleInAction: false,
    subTotal: 0,
    discount: 0,
    discountCode: '',
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SELECT_CHANNEL:
      return { ...state, channel: action.payload };
    case ActionTypes.ADD_DESCRIPTION:
      return { ...state, description: action.payload };
    case ActionTypes.QUICK_SALE_AMOUNT:
      if (action.payload === 'backspace') {
        return {
          ...state,
          amount: state.amount.slice(0, state.amount.length - 1),
        };
      }
      return { ...state, amount: state.amount + action.payload };
    // case ActionTypes.SET_QUICK_SALE_AMOUNT:
    //   return { ...state, amount: action.payload };
    case ActionTypes.CLEAR_AMOUNT:
      return { ...state, amount: '' };
    case ActionTypes.SET_QUICK_SALE_SUBTOTAL:
      return { ...state, subTotal: action.payload };
    case ActionTypes.SET_TEMP_PRODUCT:
      return { ...state, tempProduct: action.payload };
    case ActionTypes.SET_QUICK_SALE_IN_ACTION: {
      return { ...state, quickSaleInAction: action.payload };
    }
    case ActionTypes.APPLY_QUICK_SALE_DISCOUNT:
      console.log('actioooooooo', action);
      console.log('stattatatatata', state.subTotal);
      const newAmount = Number(
        (state.subTotal - Number(action.payload)).toFixed(2),
      );
      console.log('newewrerwrwerwr', newAmount);
      return {
        ...state,
        subTotal: newAmount < 0 ? 0 : newAmount,
        amount: JSON.stringify(newAmount < 0 ? 0 : newAmount),
      };
    case ActionTypes.RESET_STATE:
      return {
        channel: 'Inshop',
        amount: '',
        description: '',
        tempProduct: null,
        quickSaleInAction: false,
        subTotal: 0,
      };
    default:
      return state;
  }
};

