import { Api } from './axiosInstance';

export function lookupCustomerFromVendor(vendor, account) {
  return Api.get(`/paybills/bill/lookup/${vendor}/${account}`);
}

export function serviceChargeFee(vendor, amount, merchant, source) {
  return Api.get(
    `/vendors/service/charge/${vendor}/${amount}/${merchant}/${source}`,
  );
}

export function getVendorOptions(vendor, account) {
  return Api.get(`/paybills/bill/lookup/${vendor}/${account}`);
}

export function getAllTickets(userLogin) {
  return Api.get(`tickets/validate/history/${userLogin}`);
}

export function getAllActiveVendors() {
  return Api.get('/vendors/all/active/mobile');
}

export function getRecentPaypointTransactions(
  merchant,
  userLogin,
  startDate,
  endDate,
  admin,
) {
  if (admin) {
    return Api.get(
      `/reports/paypoint/merchant/${merchant}/recent/${startDate}/${endDate}`,
    );
  }
  return Api.get(
    `/reports/paypoint/merchant/user/${userLogin}/recent/${startDate}/${endDate}`,
  );
}

/*********mutations************/

export function paybill(payload) {
  return Api.post('/paybills/process', payload);
}

export function buyAirtime(payload) {
  return Api.post('/topups/process', payload);
}

export function sendMoney(payload) {
  return Api.post('paysend/payment/mobile/process', payload);
}

export function transferCommission(payload) {
  return Api.post('/accounts/commission/transfer', payload);
}
