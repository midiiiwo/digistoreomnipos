import _, { uniqBy } from 'lodash';
import ActionTypes from '../actionTypes';

export const invoicingReducer = (
  state = {
    customer: null,
    cart: [],
    delivery: null,
    discountPayload: null,
    invoicingTab: 0,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_INVOICE_CUSTOMER:
      return { ...state, customer: action.payload };
    case ActionTypes.ADD_TO_CART_INVOICE_BATCH:
      return { ...state, cart: action.payload };
    case ActionTypes.SET_INVOICING_TAB:
      return { ...state, invoicingTab: action.payload };
    case ActionTypes.ADD_TO_CART_INVOICE:
      const item_ = _.find(state.cart, { id: action.payload.id });
      if (item_) {
        action.payload.quantity = item_.quantity + 1;
        _.remove(state.cart, { id: action.payload.id });
      }
      const cart = uniqBy([...state.cart, action.payload], 'id');
      return {
        ...state,
        cart,
      };
    case ActionTypes.DELETE_ITEM_FROM_CART_INVOICE:
      const filteredCart = state.cart.filter(
        item => item.id !== action.payload,
      );

      return {
        ...state,
        cart: filteredCart,
      };
    case ActionTypes.RESET_CART_INVOICE:
      return {
        ...state,
        cart: [],
        customer: null,
        delivery: null,
        discountPayload: null,
      };

    case ActionTypes.UPDATE_CART_ITEM_QUANTITY_INVOICE:
      const cartItems = state.cart.map(c => {
        if (c.id === action.payload.id) {
          c.quantity += action.payload.by;
          return c;
        }
        return c;
      });
      return {
        ...state,
        cart: cartItems,
      };

    case ActionTypes.SET_ORDER_NOTE_INVOICE:
      return { ...state, terms: action.payload };
    case ActionTypes.SET_INVOICE_DELIVERY:
      return { ...state, delivery: action.payload };
    case ActionTypes.CLEAR_INVOICE_DELIVERY:
      return { ...state, delivery: null };
    case ActionTypes.CLEAR_INVOICE_DISCOUNT:
      return { ...state, discountPayload: null };
    case ActionTypes.SET_INVOICE_DISCOUNT:
      const { discountType, quantity } = action.payload;
      if (discountType === '%') {
        const discountedAmount = 0.01 * quantity * state.subTotal;
        return {
          ...state,
          discountPayload: {
            discount: discountedAmount,
            discountCode: action.payload.discountCode,
            discountQuantity: quantity,
          },
        };
      }
      return {
        ...state,
        discountPayload: {
          discount: quantity > state.subTotal ? state.subTotal : quantity,
          discountCode: action.payload.discountCode,
          discountQuantity: quantity,
        },
      };
    case ActionTypes.RESET_INVOICE_CART:
      return {
        ...state,
        cart: [],
        customer: null,
        delivery: null,
        discountPayload: null,
      };
    default:
      return state;
  }
};
