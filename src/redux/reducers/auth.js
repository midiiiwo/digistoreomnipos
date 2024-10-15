/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

export const authReducer = (
  state = {
    user: {},
    auth: null,
    outlet: {},
    fcmToken: null,
    pinState: {
      showPin: true,
      pinStatus: 'choose',
    },
    firstLaunch: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_AUTH:
      return { ...state, auth: action.payload };
    case ActionTypes.SET_CURRENT_OUTLET:
      return { ...state, outlet: action.payload };
    case ActionTypes.SET_FCM_TOKEN: {
      return { ...state, fcmToken: action.payload };
    }
    case ActionTypes.SET_PIN_STATE:
      return { ...state, pinState: action.payload };

    case ActionTypes.SET_FIRST_LAUNCH:
      return { ...state, firstLaunch: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        ...state,
        auth: null,
        outlet: {},
        fcmToken: null,
        pinState: {
          showPin: true,
          pinStatus: 'choose',
        },
      };
    default:
      return state;
  }
};

