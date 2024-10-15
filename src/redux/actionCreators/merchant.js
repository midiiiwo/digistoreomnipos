import ActionTypes from '../actionTypes';

export const setSummaryStartDate = date => {
  return {
    type: ActionTypes.SET_SUMMARY_START_DATE,
    payload: date,
  };
};

export const setSummaryEndDate = date => {
  return {
    type: ActionTypes.SET_SUMMARY_END_DATE,
    payload: date,
  };
};

export const setPrevSummaryStartDate = date => {
  return {
    type: ActionTypes.SET_PREV_SUMMARY_START_DATE,
    payload: date,
  };
};

export const setPrevSummaryEndDate = date => {
  return {
    type: ActionTypes.SET_PREV_SUMMARY_END_DATE,
    payload: date,
  };
};

export const setDateRange = range => {
  return {
    type: ActionTypes.SET_DATE_RANGE,
    payload: range,
  };
};

export const setSubscribable = subscribable => {
  return {
    type: ActionTypes.SET_SUBSCRIBABLES,
    payload: subscribable,
  };
};

export const clearSubscribables = () => {
  return {
    type: ActionTypes.CLEAR_SUBSCRIBABLES,
  };
};

export const setNotification = notification => {
  return {
    type: ActionTypes.NOTIF,
    payload: notification,
  };
};

export const setNotificationSound = status => {
  return {
    type: ActionTypes.SET_NOTIFICATION_SOUND,
    payload: status,
  };
};

export const setNotificationPriority = status => {
  return {
    type: ActionTypes.SET_NOTIFICATION_PRIORITY,
    payload: status,
  };
};

export const setOverlayLoading = status => {
  return { type: ActionTypes.OVERLAY_LOADING, payload: status };
};

export const setLoggininOverlay = status => {
  return { type: ActionTypes.OVERLAY_LOGGING_IN, payload: status };
};
