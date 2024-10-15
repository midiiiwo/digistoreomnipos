/* eslint-disable prettier/prettier */
import ActionTypes from '../actionTypes';

const date = new Date();

export const transactionsReducer = (
  state = {
    smStartDate: new Date(),
    smEndDate: new Date(),
    smRange: { label: 'Today', value: 'today' },
    aStartDate: new Date(),
    aEndDate: new Date(),
    aRange: { label: 'Today', value: 'today' },
    bStartDate: new Date(),
    bEndDate: new Date(),
    bRange: { label: 'Today', value: 'today' },
    iStartDate: new Date(),
    iEndDate: new Date(),
    iRange: { label: 'Today', value: 'today' },
    tStartDate: new Date(),
    tEndDate: new Date(),
    tRange: { label: 'Today', value: 'today' },
    sStartDate: new Date(),
    sEndDate: new Date(),
    sRange: { label: 'Today', value: 'today' },
    IVStartDate: new Date(),
    IVEndDate: new Date(),
    IVRange: { label: 'Today', value: 'today' },
    // ANStartDate: new Date(),
    // ANEndDate: new Date(),
    // ANRange: { label: 'Today', value: 'today' },
    // startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    // endDate: new Date(),
    // range: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SET_SMSTART_DATE:
      return { ...state, smStartDate: action.payload };
    case ActionTypes.SET_SMEND_DATE:
      return { ...state, smEndDate: action.payload };
    case ActionTypes.SET_SMDATE_RANGE:
      return { ...state, smRange: action.payload };

    case ActionTypes.SET_ASTART_DATE:
      return { ...state, aStartDate: action.payload };
    case ActionTypes.SET_ASEND_DATE:
      return { ...state, aEndDate: action.payload };
    case ActionTypes.SET_ASDATE_RANGE:
      return { ...state, aRange: action.payload };

    case ActionTypes.SET_BSTART_DATE:
      return { ...state, bStartDate: action.payload };
    case ActionTypes.SET_BSEND_DATE:
      return { ...state, bEndDate: action.payload };
    case ActionTypes.SET_BSDATE_RANGE:
      return { ...state, bRange: action.payload };

    case ActionTypes.SET_ISTART_DATE:
      return { ...state, iStartDate: action.payload };
    case ActionTypes.SET_ISEND_DATE:
      return { ...state, iEndDate: action.payload };
    case ActionTypes.SET_ISDATE_RANGE:
      return { ...state, iRange: action.payload };

    case ActionTypes.SET_TSTART_DATE:
      return { ...state, tStartDate: action.payload };
    case ActionTypes.SET_TSEND_DATE:
      return { ...state, tEndDate: action.payload };
    case ActionTypes.SET_TSDATE_RANGE:
      return { ...state, tRange: action.payload };

    case ActionTypes.SET_SSTART_DATE:
      return { ...state, sStartDate: action.payload };
    case ActionTypes.SET_SEND_DATE:
      return { ...state, sEndDate: action.payload };
    case ActionTypes.SET_SDATE_RANGE:
      return { ...state, sRange: action.payload };

    case ActionTypes.SET_IVSTART_DATE:
      return { ...state, IVStartDate: action.payload };
    case ActionTypes.SET_IVSEND_DATE:
      return { ...state, IVEndDate: action.payload };
    case ActionTypes.SET_IVSDATE_RANGE:
      return { ...state, IVRange: action.payload };
    case ActionTypes.RESET_STATE:
      return {
        smStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        smEndDate: new Date(),
        smRange: null,
        aStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        aEndDate: new Date(),
        aRange: null,
        bStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        bEndDate: new Date(),
        bRange: null,
        iStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        iEndDate: new Date(),
        iRange: null,
        tStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        tEndDate: new Date(),
        tRange: null,
        sStartDate: new Date(date.getFullYear(), date.getMonth(), 1),
        sEndDate: new Date(),
        sRange: null,
        // startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        // endDate: new Date(),
        // range: null,
      };
    default:
      return state;
  }
};
