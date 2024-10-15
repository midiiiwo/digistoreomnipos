import { Api, productApi } from './axiosInstance';

export function getAllProductsCategories(merchant) {
  return Api.get(`/products/category/${merchant}/list`);
}

export function getSelectedProductDetails(merchant, outlet, product) {
  return Api.get(
    `products/inventory/${merchant}/outlet/${outlet}/product/${product}`,
  );
}

export function getSelectedCategoryDetails(category) {
  return Api.get(`/products/category/${category}`);
}

export function getGlobalProducts(merchant, outlet) {
  return Api.get(
    `/products/inventory/${merchant}/outlet/${outlet}/product/list`,
  );
}

export function getProductMappedOutlets(merchant, product) {
  return Api.get(`/products/product/${merchant}/${product}/outlets/ids/list`);
}

/***************** mutations ******************/

export function addCategoryProduct(payload) {
  return productApi.post('/products/inventory/product', payload);
}

export function editProduct(payload) {
  return productApi.post('/products/inventory/product/update', payload);
}

export function editProduct_(payload) {
  return productApi.post('/products/inventory/product/update', payload);
}

export function addCategory(payload) {
  return Api.post('/products/category', payload);
}

export function editCategory(payload) {
  return Api.put('/products/category', payload);
}

export function deleteCategory(category) {
  return Api.delete(`products/category/${category}`);
}

export function updateProductInventoryLowStock(payload) {
  return Api.put('/products/inventory/outlet/product/stock', payload);
}

export function updateInventoryStockQuantity(payload) {
  return Api.put('/products/product/stock/quantity', payload);
}

export function deleteProduct(merchant, product_id, user_name) {
  return Api.delete(
    `/products/inventory/${merchant}/product/${product_id}/${user_name}`,
  );
}

export function deleteProductFromOutlet(
  outlet,
  merchant,
  product_id,
  user_name,
) {
  return Api.delete(
    `/products/inventory/${merchant}/outlet/${outlet}/product/${product_id}/${user_name}`,
  );
}

export function toggleProductOfflineOnlineEntirely(payload) {
  return Api.put('/products/product/availability/status', payload);
}

export function addProductToOutlet(payload) {
  return Api.put(
    '/products/inventory/outlet/product/availability/status',
    payload,
  );
}

export function removeProductFromOutlet(payload) {
  return Api.put(
    '/products/inventory/outlet/product/availability/status',
    payload,
  );
}
