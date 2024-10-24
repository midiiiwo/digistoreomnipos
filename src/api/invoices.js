import { Api } from './axiosInstance';

export function createEstimate(payload) {
  return Api.post('/orders/order/draft/invoice', payload);
}

export function UpdateEstimateDetails(payload) {
  return Api.put('/orders/order/draft/invoice', payload);
}

export function getEstimates(payload) {
  return Api.post('/orders/order/draft/invoice/list', payload);
}

export function updateEstimate(payload) {
  return Api.put('/orders/order/draft/invoice/status', payload);
}
