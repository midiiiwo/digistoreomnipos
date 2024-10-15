import ActionTypes from '../actionTypes';

export const setCurrentUser = user => {
  return {
    type: ActionTypes.SET_USER,
    payload: user,
  };
};

export const setAuth = auth => {
  return {
    type: ActionTypes.SET_AUTH,
    payload: auth,
  };
};

export const setCurrentOutlet = outlet => {
  return {
    type: ActionTypes.SET_CURRENT_OUTLET,
    payload: outlet,
  };
};

export const setFcmToken = token => {
  return {
    type: ActionTypes.SET_FCM_TOKEN,
    payload: token,
  };
};

export const setPinState = state => {
  return {
    type: ActionTypes.SET_PIN_STATE,
    payload: state,
  };
};

export const resetStore = () => {
  return {
    type: ActionTypes.RESET_STATE,
  };
};

export const setFirstLaunch = status => {
  return {
    type: ActionTypes.SET_FIRST_LAUNCH,
    payload: status,
  };
};
