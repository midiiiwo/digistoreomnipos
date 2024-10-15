import { Api } from './axiosInstance';

export function getSaleChannelList(merchant) {
  return Api.get(`/stores/merchant/${merchant}/store/sales/channels`);
}

export function getQuickPaymentStatus(merchant, invoice) {
  return Api.get(`/paybills/payment/mobile/status/${merchant}/${invoice}`);
}

/***********mutations***************/

export function receiveQuickPayment(payload) {
  return Api.post('/paybills/payment/mobile/process', payload);
}
