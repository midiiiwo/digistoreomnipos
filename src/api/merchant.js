import { Api, deliveryApi, loginApi, productApi } from './axiosInstance';

export function getAccountBalance(user_merchant_account) {
  return Api.get(`accounts/${user_merchant_account}/balance`);
}

export function getLookupCustomer(search_value) {
  return Api.get(`/customers/verify/${search_value}`);
}

export function getReportSummary(
  merchant,
  userLogin,
  start_date,
  end_date,
  isAdmin = true,
) {
  return Api.get(
    `/reports/analytics/merchant/summary/dashboard/${merchant}/${userLogin}/${start_date}/${end_date}/${isAdmin}`,
  );
}

export function getAccountList(user_merchant_account) {
  return Api.get(`accounts/balance/topup/property/${user_merchant_account}`);
}

export function getTransferFundsAccount(user_merchant_account) {
  return Api.get(`accounts/${user_merchant_account}/transfer/balance`);
}

export function getAccountStatementHistory(merchant, startDate, endDate) {
  return Api.get(
    `accounts/merchant/${merchant}/statement/${startDate}/${endDate}`,
  );
}

export function getFundsTransferHistory(merchant, startDate, endDate) {
  return Api.get(
    `merchants/${merchant}/funds/transferred/${startDate}/${endDate}`,
  );
}

export function getAirtimeHistory(merchant, userId, admin, startDate, endDate) {
  if (admin) {
    return Api.get(`/topups/merchant/${merchant}/${startDate}/${endDate}`);
  } else {
    return Api.get(`/topups/merchant/user/${userId}/${startDate}/${endDate}`);
  }
}

export function BillPaymentHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  if (admin) {
    return Api.get(
      `/paybills/bills/merchant/${merchant}/${startDate}/${endDate}`,
    );
  } else {
    return Api.get(
      `/paybills/bills/merchant/user/${userId}/${startDate}/${endDate}`,
    );
  }
}

export function getInvoiceHistory(merchant, startDate, endDate) {
  return Api.get(`/merchants/${merchant}/invoice/${startDate}/${endDate}`);
}

export function InternetHistory(merchant, userId, admin, startDate, endDate) {
  if (admin) {
    return Api.get(
      `/paybills/internet/merchant/${merchant}/${startDate}/${endDate}`,
    );
  } else {
    return Api.get(
      `/paybills/internet/merchant/user/${userId}/${startDate}/${endDate}`,
    );
  }
}

export function SendMoneyHistory(merchant, userId, admin, startDate, endDate) {
  if (admin) {
    return Api.get(
      `/merchants/${merchant}/send/payment/${startDate}/${endDate}`,
    );
  } else {
    return Api.get(
      `/merchants/${merchant}/user/${userId}/send/payment/${startDate}/${endDate}`,
    );
  }
}

export function Smshistory(merchant, userId, admin, start, end) {
  if (admin) {
    return Api.get(`/smssend/bulk/merchant/${merchant}/${start}/${end}`);
  } else {
    return Api.get(`/smssend/bulk/user/${userId}/${start}/${end}`);
  }
}

export function PaymentHistory(merchant, userId, admin, startDate, endDate) {
  if (admin) {
    return Api.get(`/merchants/${merchant}/payment/${startDate}/${endDate}`);
  } else {
    return Api.get(
      `/merchants/${merchant}/user/${userId}/payment/${startDate}/${endDate}`,
    );
  }
}

export function getTransactionDetails(user_merchant_receivable, id) {
  return Api.get(
    `paybills/payment/transaction/${user_merchant_receivable}/${id}`,
  );
}

// api/merchant.js
export function getStoreDeliveryConfig(merchant) {
  return Api.get(`orders/merchant/options/${merchant}`);
}

export function getRiderDeliveryConfig(merchant) {
  return deliveryApi.get(`/admin/company/${merchant}/settings`);
}


export function changeStoreDeliveryConfig(merchant, payload) {
  return deliveryApi.post(`/admin/company/${merchant}/deliveryType`, payload);
}

export function changeStoreDeliveryWindowConfig(merchant, payload) {
  return deliveryApi.post(`/admin/company/${merchant}/useWindows`, payload);
}



export function getCustomerDetails(merchant, customerId) {
  return Api.get(`customers/merchant/${merchant}/customer/${customerId}`);
}

export function getPushNotifications() {
  return Api.get('/merchants/payment/push/notification/records');
}

export function getMerchantCustomerOrders(
  merchant,
  customerPhone,
  startDate,
  endDate,
) {
  return Api.get(
    `/orders/order/process/${merchant}/customer/${customerPhone}/list/${startDate}/${endDate}`,
  );
}

export function getTodoList(merchant) {
  return Api.get(`/merchants/onboard/${merchant}/todo/list`);
}

export function addMoneyStatus(invoiceId) {
  return Api.get(`accounts/adjust/balance/status/${invoiceId}`);
}

export function getGrossSalesStats(merchant, userLogin, startDate, endDate) {
  return Api.get(
    `/reports/analytics/merchant/gross/sales/${merchant}${userLogin !== undefined ? `/${userLogin}` : ''
    }/${startDate}/${endDate}`,
  );
}

export function getOrderStats(merchant, startDate, endDate) {
  return Api.get(
    `/reports/analytics/merchant/product/sales/${merchant}/${startDate}/${endDate}`,
  );
}

export function getPreactiveState(merchant) {
  return Api.get(`/merchants/onboard/${merchant}/preactive`);
}

export function getActivavtionStep(merchant) {
  return Api.get(`/merchants/${merchant}/setup/activation/step`);
}

export function getCurrentActivationStep(merchant) {
  return Api.get(`/merchants/${merchant}/setup/activation/step`);
}

export function getMerchantDiscountDetails(merchant) {
  return Api.get(`/discounts/discount/${merchant}/list`);
}

export function getMerchantSelectedDiscountDetails(discount_id) {
  return Api.get(`/discounts/discount/${discount_id}`);
}

export function getMerchantSelectedDiscountOutletDetails(merchant, discount_id) {

  return Api.get(`/discounts/discount/${merchant}/${discount_id}/outlets/ids/list`);
}

export function getMerchantSelectedDiscountProductApply(merchant, discount_id) {

  return Api.get(`/discounts/discount/${merchant}/${discount_id}/product/ids/list`);
}


export function getMerchantSelectedDiscountProductDetails(merchant) {

  return Api.get(`/products/product/${merchant}/list`);
}

export function getReceiptDetails(merchant) {
  return Api.get(`/merchants/receipt/${merchant}`);
}

export function getOnboardingRequirements() {
  return loginApi.get('/merchants/onboard/requirements');
}

export function getMerchantUserDetails(merchant) {
  return Api.get(`/users/merchant/${merchant}`);
}

export function getMerchantUserRoles(merchant) {
  return Api.get(`/groups/merchant/${merchant}`);
}

export function verifyMerchantUserUsername(username) {
  return Api.get(`/users/merchant/verify/user/${username}`);
}

export function getMerchantUserOutlets(merchant, userId) {
  return Api.get(`/outlets/merchant/${merchant}/user/${userId}/outlets/list`);
}

export function getMerchantTaxes(merchant) {
  return Api.get(`taxes/tax/${merchant}/list`);
}

export function getTaxById(id) {
  return Api.get(`/taxes/tax/${id}`);
}

export function getOutletDetails(id) {
  return Api.get(`/outlets/${id}`);
}

export function getMerchantRoute(merchant) {
  return Api.get(`/orders/delivery/route/${merchant}/list`);
}

export function getMerchantRiders(merchant, outlet) {
  return deliveryApi.get(
    `admin/company/${merchant}/ridersAvailableForDelivery/${outlet}`,
  );
}

export function getMerchantRidersAll(merchant, outlet) {
  return deliveryApi.get(
    `admin/company/${merchant}/riders/${outlet}`,
  );
}

export function getMerchantDeliveryWindow(merchant, outlet) {
  return deliveryApi.get(
    `admin/deliveryWindows/${merchant}/${outlet}`,
  );
}


export function getOnlineStoreDetails(merchant) {
  return Api.get(`stores/merchant/${merchant}/store/online`);
}

export function getShortcodeDetails(merchant) {
  return Api.get(`stores/merchant/${merchant}/store/ussd`);
}

export function verifyStoreAlias(storeAlias) {
  return Api.get(`stores/merchant/store/verify/alias/${storeAlias}`);
}

export function getMerchantDetails(merchant) {
  return Api.get(`/merchants/${merchant}`);
}

/********************* Mutations ***********************/

export function AddTax(payload) {
  return Api.post('/taxes/tax', payload);
}

export function updateTax(payload) {
  return Api.put('/taxes/tax', payload);
}

export function deleteTax(id, user) {
  return Api.put(`/taxes/tax/${id}/${user}`);
}

export function changeTaxStatus(payload) {
  return Api.put('/taxes/tax/availability/status', payload);
}

export function mapMerchantOutletsToUser(payload) {
  return Api.post('/outlets/merchant/user/outlets/mapping', payload);
}


export function addMerchantDiscount(payload) {
  return Api.post('/discounts/discount', payload);
}

export function editMerchantDiscount(payload) {
  return Api.put('/discounts/discount', payload);
}

export function deleteMerchantDiscount(discount_id, mod_by) {
  return Api.delete(`/discounts/discount/${discount_id}/${mod_by}`);
}

export function createMerchantUser(payload) {
  return Api.post('/users', payload);
}

export function updateMerchantUser(payload) {
  return Api.put('/users', payload);
}

export function addWallet(payload) {
  return Api.post('accounts/balance/topup/property', payload);
}

export function deleteWalletAccount(user_merchant_account, mobileNumber) {
  return Api.delete(
    `accounts/balance/topup/property/${user_merchant_account}/${mobileNumber}`,
  );
}

export function requestTransferFunds(payload) {
  return Api.post('accounts/transfer/balance/mobile', payload);
}

export function getCustomerAnalytics(payload) {
  return Api.post('/reports/analytics/merchant/summary/customers', payload);
}

export function addMoneyToWallet(payload) {
  return Api.post('accounts/adjust/balance/mobile', payload);
}

export function getOnboardingOtp(payload) {
  return loginApi.post('merchants/onboard/otp', payload);
}

export function verifyOnboardingOtp(payload) {
  return loginApi.put('merchants/onboard/otp', payload);
}

export function onBoardMerchant(payload) {
  return loginApi.post('/merchants/onboard/merchant', payload);
}

export function activeWalletAccount(payload) {
  return Api.put('accounts/balance/topup/property/validate', payload);
}

export function cancelFundsTransfer(payload) {
  return Api.put('/paybills/payment/disbursement/unsettle', payload);
}

export function addCustomer(payload) {
  return Api.post('/customers/merchant/customer', payload);
}

export function addPersonalDetails(payload) {
  return productApi.post('/merchants/onboard/activate/contact', payload);
}

export function addBusinessDetails(payload) {
  return productApi.post('/merchants/onboard/activate/business', payload);
}

export function addSettlementDetails(payload) {
  return Api.post('/merchants/onboard/activate/settlement', payload);
}

export function editCustomer(payload) {
  return Api.put('/customers/merchant/customer', payload);
}

export function editCustomerLocation(payload) {
  return Api.put('/customers/customer/location', payload);
}

export function sendResetCode(payload) {
  return Api.put('/customers/customer', payload);
}

export function requestActivation(payload) {
  return Api.post('/merchants/onboard/activate/request', payload);
}

export function salesInsights(payload) {
  return Api.post('/reports/analytics/merchant/summary/sales', payload);
}

export function productAnalytics(payload) {
  return Api.post('/reports/analytics/merchant/summary/products', payload);
}

export function addReceipt(payload) {
  return Api.post('/merchants/receipt', payload);
}

export function editReceipt(payload) {
  return Api.put('/merchants/receipt', payload);
}

export function deleteReceipt(receiptId, mod_by) {
  return Api.delete(`/merchants/receipt/${receiptId}/${mod_by}`);
}

export function addOutlet(payload) {
  return productApi.post('/outlets', payload);
}

export function updateOutlet(payload) {
  return productApi.post('/outlets/update/mobile', payload);
}

export function addMerchantDeliveryRoute(payload) {
  return Api.post('/orders/delivery/route', payload);
}

export function setupMerchantDeliveryConfigOption(payload) {
  return Api.put('/orders/merchant/options/delivery', payload);
}

export function createMerchantDeliveryConfigOption(payload) {
  return Api.post('/orders/merchant/options', payload);
}

export function addMerchantRider(payload) {
  return deliveryApi.post('admin/rider/fromPOS', payload);
}

export function addMerchantRouteLocation(payload) {
  return deliveryApi.post('/admin/locationRoute/fromPOS', payload);
}

export function addMerchantRouteDistance(payload) {
  return deliveryApi.post('/admin/distanceRoute/fromPOS', payload);
}



// export function deleteMerchantDeliveryRoute({ id }) {
//   return deliveryApi.delete(`/admin/deliveryRoute/${id}`, { id });
// }

// export function deleteMerchantDeliveryRouteNew(id) {
//   return deliveryApi.delete(`admin/deliveryRoute/${id}`);
// }

export function deleteRider({ user_id }) {
  return deliveryApi.delete(`/admin/rider/${user_id}`, { user_id });
}

export function deleteRoute({ id }) {
  return deliveryApi.delete(`admin/distanceRoute/${id}`);
}

export function deleteRouteLocation({ id }) {
  return deliveryApi.delete(`admin/locationRoute/${id}`);
}

export function setupStoreOrShortcode(payload) {
  return productApi.post('/stores/merchant/store', payload);
}

export function addMerchantCompany(payload) {
  return deliveryApi.post('/admin/company', payload);
}

export function updateStoreOrShortcode(payload) {
  return Api.put('/stores/merchant/store', payload);
}

export function removeStoreOrLandingBanner(payload) {
  return Api.put('/stores/merchant/store/image/remove', payload);
}

export function changeStoreStatus(payload) {
  return Api.put('/stores/merchant/store/status', payload);
}

export function deleteMerchantStore(payload) {
  return Api.delete(`/stores/merchant/store/${payload.id}`);
}

export function deleteMerchantUser(payload) {
  return Api.delete(`/user/${payload.id}`);
}

export function updateProfile(payload) {
  return productApi.post('merchants/merchant/profile/update', payload);
}

export function replaceStoreBanner(payload) {
  return productApi.post('/stores/merchant/store/image/replace', payload);
}

export function deleteMerchantAccount(payload) {
  return Api.delete(
    `/merchants/close/account/${payload.merchant}/${payload.user}`,
  );
}

export function deleteOutlet(payload) {
  return Api.delete(`outlets/${payload.outlet_id}/${payload.mod_by}`);
}

export function requestGenericOtp(payload) {
  return Api.post('/push/notification/otp', payload);
}

export function requestPinOtp(payload) {
  return loginApi.post('/push/notification/otp', payload);
}

export function checkInvoiceStatus(payload) {
  return Api.post('/paybills/gateway/payment/management/invoice', payload);
}

export function logout(payload) {
  return Api.put('/logout', payload);
}
