import ActionTypes from '../actionTypes';
import uniqBy from 'lodash/uniqBy';
import _, { some } from 'lodash';

/**
 *
 * @param {customer: Object, cart: Array} state
 * @param {type: string, payload: any} action
 * @returns
 */
export const saleReducer = (
  state = {
    customer: null,
    cart: [],
    subTotal: 0,
    discountQuantity: 0,
    discountPayload: null,
    taxes: [],
    totalAmount: 0,
    delivery: { label: 'Walk-in', value: 'WALK-IN', price: 0 },
    invoice: null,
    customerPayment: null,
    phone: '',
    totalItems: 0,
    addTaxes: true,
    orderNotes: '',
    orderDate: new Date(),
    deliveryDueDate: new Date(),
    paymentChannel: null,
    orderCheckoutTaxes: {},
    deliveryNote: '',
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SELECT_CUSTOMER:
      return { ...state, customer: action.payload };
    case ActionTypes.ADD_TO_CART:
      // debugger;
      const item_ = _.find(state.cart, { id: action.payload.id });
      if (item_) {
        action.payload.quantity = item_.quantity + 1;
        _.remove(state.cart, { id: action.payload.id });
      }
      const cart = uniqBy([...state.cart, action.payload], 'id');

      return {
        ...state,
        cart,
        subTotal: Number((state.subTotal + action.payload.amount).toFixed(2)),
        totalItems: state.totalItems + 1,
      };
    case ActionTypes.DELETE_ITEM_FROM_CART:
      const filteredCart = state.cart.filter(
        item => item.id !== action.payload,
      );
      const item = state.cart.find(o => o.id === action.payload);
      const ti = state.totalItems > 0 ? state.totalItems - item.quantity : 0;
      return {
        ...state,
        cart: filteredCart,
        subTotal: Number(
          (state.subTotal - item.amount * item.quantity).toFixed(2),
        ),
        totalItems: ti,
      };
    case ActionTypes.RESET_CART:
      return {
        ...state,
        cart: [],
        subTotal: 0,
        discountPayload: null,
        totalItems: 0,
        delivery: { label: 'Walk-in', value: 'WALK-IN', price: 0 },
      };
    case ActionTypes.UPDATE_SUBTOTAL:
      if (some(state.cart, action.payload)) {
        return state;
      }
      let subTotal =
        state.subTotal +
        (typeof action.payload.amount === 'string'
          ? Number(action.payload.amount)
          : action.payload.amount);
      subTotal = Number(subTotal.toFixed(2));

      return {
        ...state,
        subTotal,
      };
    case ActionTypes.SET_TOTAL_AMOUNT:
      return {
        ...state,
        totalAmount: action.payload,
      };
    case ActionTypes.UPDATE_SUBTOTAL_BY_NUMBER:
      console.log(action.payload);
      return { ...state, subTotal: Number(action.payload.toFixed(2)) };
    case ActionTypes.UPDATE_SUBTOTAL_FROM_CART:
      return { ...state, subTotal: Number(action.payload.toFixed(2)) };
    case ActionTypes.SET_ORDER_TAXES:
      return { ...state, orderCheckoutTaxes: action.payload };
    case ActionTypes.UPDATE_CART_ITEM_QUANTITY:
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
        totalItems: state.totalItems + action.payload.by,
      };

    case ActionTypes.SET_DELIVERY_NOTE:
      return { ...state, deliveryNote: action.payload };

    case ActionTypes.APPLY_DISCOUNT:
      const { discountType, quantity } = action.payload;
      // if (quantity > subTotal) {
      //   return state;
      // }
      if (discountType === '%') {
        const discountedAmount = 0.01 * quantity * state.subTotal;
        // if (discountedAmount > state.subTotal) {
        //   return state;
        // }
        const newAmount = state.subTotal - discountedAmount;
        return {
          ...state,
          subTotal:
            Number(newAmount.toFixed(2)) < 0 ? 0 : Number(newAmount.toFixed(2)),
          discountQuantity: quantity,
          discountPayload: {
            oldAmount: state.subTotal,
            newAmount,
            discount:
              discountedAmount +
              (state.discountPayload && state.discountPayload.discount),
            discountCode: action.payload.discountCode,
          },
        };
      }
      // if (Number(quantity) > state.subTotal) {
      //   return state;
      // }
      const newAmount_ = state.subTotal - quantity;
      const newSub = Number(newAmount_) < 0 ? 0 : Number(newAmount_.toFixed(2));
      return {
        ...state,
        subTotal: newSub,
        discountQuantity: quantity,
        discountPayload: {
          oldAmount: state.subTotal,
          newAmount: Number(newAmount_.toFixed(2)),
          discount:
            (quantity > state.subTotal ? state.subTotal : quantity) +
            (state.discountPayload && state.discountPayload.discount),
          discountCode: action.payload.discountCode,
        },
      };
    case ActionTypes.CLEAR_DISCOUNT:
      return {
        ...state,
        subTotal: action.payload,
        discountPayload: null,
      };
    case ActionTypes.SET_TAXES:
      return { ...state, taxes: action.payload };
    case ActionTypes.SET_DELIVERY:
      return { ...state, delivery: action.payload };
    case ActionTypes.SET_INVOICE:
      return { ...state, invoice: action.payload };
    case ActionTypes.SET_CUSTOMER_PAYMENT:
      return { ...state, customerPayment: action.payload };
    case ActionTypes.SET_PHONE:
      return { ...state, phone: action.payload };
    case ActionTypes.ADD_TAXES:
      return { ...state, addTaxes: action.payload };
    case ActionTypes.SET_ORDER_NOTE:
      return { ...state, orderNotes: action.payload };
    case ActionTypes.SET_PAYMENT_CHANNEL:
      return { ...state, paymentChannel: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        customer: null,
        cart: [],
        subTotal: 0,
        discountQuantity: 0,
        discountPayload: null,
        taxes: [],
        totalAmount: 0,
        delivery: { label: 'Walk-in', value: 'WALK-IN', price: 0 },
        invoice: null,
        customerPayment: null,
        phone: '',
        totalItems: 0,
        addTaxes: true,
        orderNotes: '',
        paymentChannel: null,
      };
    case ActionTypes.ORDER_DATE:
      return { ...state, orderDate: action.payload };
    case ActionTypes.SET_DELIVERY_DUE_DATE:
      return { ...state, deliveryDueDate: action.payload };
    default:
      return state;
  }
};
