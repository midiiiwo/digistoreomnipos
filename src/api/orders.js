import { Api } from './axiosInstance';

export function getAllOrders(startDate, endDate, merchant) {
  return Api.get(
    `/orders/order/process/${merchant}/list/${startDate}/${endDate}/ALL`,
  );
}

export function getSelectedOrderDetails(merchant, orderNumber) {
  return Api.get(`/orders/order/process/${merchant}/${orderNumber}`);
}

export function getOrderItemList(merchant, orderNumber) {
  return Api.get(`/orders/order/process/${merchant}/${orderNumber}/item/list`);
}

export function getOutletsLov(merchant) {
  return Api.get(`outlets/merchant/${merchant}/lov`);
}

/*************mutations****************/

export function getKitchStaffOrderItems(payload) {
  return Api.post('/orders/order/process/outlet/backoffice/list', payload);
}

export function updateKitchenStaffOrder(payload) {
  return Api.put('/orders/order/process/backoffice/status', payload);
}

export function getAllOrderNonAdmin(payload) {
  return Api.post('orders/order/process/outlet/list', payload);
}

export function getAllOrders_(payload) {
  return Api.post('/orders/order/process/user/list', payload);
}

export function updateOrderStatus(payload) {
  return Api.put('/orders/order/process/status', payload);
}

export function updateDeliveryStatus(payload) {
  return Api.put('orders/order/process/delivery/status', payload);
}

export function assignRider(payload) {
  return Api.put('orders/order/process/assign/rider', payload);
}

export function reassignToShop(payload) {
  return Api.put('orders/order/process/assign/shop', payload);
}

export function voidOrder(payload) {
  return Api.put('/orders/order/process/void', payload);
}

export function receivePayLater(payload) {
  return Api.post('/orders/payment/process', payload);
}
