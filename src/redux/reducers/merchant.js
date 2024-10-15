import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionTypes from '../actionTypes';

var d = new Date();
d.setDate(d.getDate() - 1);
const initState = {
  summaryStartDate: new Date(),
  summaryEndDate: new Date(),
  summaryPrevStartDate: d,
  summaryPrevEndDate: d,
  range: { label: 'Today', value: 'today' },
  notification: '',
  notificationSound: true,
  overlayLoading: false,
  overlayLoggingIn: false,
};
export const merchantReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.SET_SUMMARY_START_DATE:
      return { ...state, summaryStartDate: action.payload };
    case ActionTypes.SET_SUMMARY_END_DATE:
      return { ...state, summaryEndDate: action.payload };
    case ActionTypes.SET_PREV_SUMMARY_START_DATE:
      return { ...state, summaryPrevStartDate: action.payload };
    case ActionTypes.SET_PREV_SUMMARY_END_DATE:
      return { ...state, summaryPrevEndDate: action.payload };
    case ActionTypes.SET_DATE_RANGE:
      return { ...state, range: action.payload };
    case ActionTypes.NOTIF:
      return { ...state, notification: action.payload };
    case ActionTypes.SET_SUBSCRIBABLES:
      return {
        ...state,
        subscribables: [...state.subscribables, action.payload],
      };
    case ActionTypes.CLEAR_SUBSCRIBABLES:
      return {
        ...state,
        subscribables: [],
      };
    case ActionTypes.SET_NOTIFICATION_SOUND:
      return { ...state, notificationSound: action.payload };
    case ActionTypes.SET_NOTIFICATION_PRIORITY:
      return { ...state, notificationPriority: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        summaryStartDate: new Date(),
        summaryEndDate: new Date(),
        summaryPrevStartDate: d,
        summaryPrevEndDate: d,
        range: { label: 'Today', value: 'today' },
        subscribables: [],
        notification: '',
      };
    case ActionTypes.OVERLAY_LOADING:
      return { ...state, overlayLoading: action.payload };
    case ActionTypes.OVERLAY_LOGGING_IN:
      return { ...state, overlayLoggingIn: action.payload };
    default:
      return state;
  }
};
