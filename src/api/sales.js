import { Api } from './axiosInstance';

// const BASE_URL = 'https://manage.ipaygh.com/apidev/v1/gateway';

export function getOutletCategories(merchant, outlet) {
  return Api.get(
    `/stores/merchant/${merchant}/store/outlet/${outlet}/product/category`,
  );
}

export function getOutletProducts(merchant, outlet) {
  return Api.get(
    `/stores/merchant/${merchant}/store/outlet/${outlet}/products`,
  );
}

export function getCategoryProducts(merchant, outlet, category) {
  return Api.get(
    `/stores/merchant/${merchant}/store/outlet/${outlet}/category/${category}/products`,
  );
}

export function getAllProducts(merchant) {
  return Api.get(`/products/product/${merchant}/mobile/list`);
}

export function getMerchantCustomers(merchant) {
  return Api.get(`/customers/merchant/customer/list/${merchant}`);
}

export function getApplicableTaxes(merchant) {
  return Api.get(`/taxes/applicable/${merchant}/list`);
}

export function getTransactionFee(payChannel, subTotal, merchant) {
  return Api.get(
    `/vendors/service/charge/${payChannel}/${subTotal}/${merchant}`,
  );
}

export function getPaymentStatus(merchant, invoice) {
  return Api.get(`paybills/payment/mobile/status/${merchant}/${invoice}`);
}

export function getStoreOutlets(merchant) {
  return Api.get(`/outlets/merchant/${merchant}`);
}

export function getMerchantOutlets(merchant) {
  return Api.get(`/outlets/merchant/${merchant}`);
}

export function lookupAccount(network, number) {
  return Api.get(
    `/paybills/payment/subscriber/name/lookup/${network}/${number}`,
  );
}

export function getAllOutlets(merchant) {
  return Api.get(`/outlets/merchant/${merchant}`);
}

export function getMerchantDelivery(merchant) {
  return Api.get(`orders/delivery/route/${merchant}/list`);
}

/***************** mutations *****************/

export function getAreaBasedDelivery(payload) {
  return Api.post('/orders/order/process/delivery/route/charge', payload);
}

export function merchantDistDelivery(payload) {
  return Api.post(
    '/orders/order/process/delivery/route/distance/charge',
    payload,
  );
}

// export function addCategoryProduct(payload) {
//   return Api.post('/products/product', payload);
// }

export function raiseOrder(payload) {
  return Api.post('/orders/order/process/customer', payload);
}

export function applyDiscountCode(payload) {
  return Api.post('/discounts/discount/apply', payload);
}

export function sendTransactionNotification(payload) {
  return Api.post('/push/transaction/notification', payload);
}

export function verifySaleOtp(payload) {
  return Api.put('/push/notification/otp/verify', payload);
}
