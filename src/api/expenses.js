import { Api } from './axiosInstance';

export function getExpensesHistory(merchant, start_date, end_date) {
  return Api.get(
    `/expenses/expense/${merchant}/list/${start_date}/${end_date}`,
  );
}

export function getExpenseDetails(id) {
  return Api.get(`expenses/category/${id}`);
}

export function getSelectedExpenseDetails(id) {
  return Api.get(`expenses/expense/${id}`);
}

export function addExpenseCategory(payload) {
  return Api.post('/expenses/category', payload);
}

export function editExpenseCategory(payload) {
  return Api.put('/expenses/category', payload);
}

export function getExpenseCategoriesLov(merchant) {
  return Api.get(`/expenses/category/${merchant}/lov`);
}

export function getExpenseCategories(merchant) {
  return Api.get(`/expenses/category/${merchant}/list
`);
}
export function deleteExpenseCategory(id) {
  return Api.delete(`expenses/category/${id}`);
}

export function addExpense(payload) {
  return Api.post('/expenses/expense', payload);
}

export function editExpense(payload) {
  return Api.put('/expenses/expense', payload);
}

export function deleteExpense(id) {
  return Api.delete(`expenses/expense/${id}`);
}
