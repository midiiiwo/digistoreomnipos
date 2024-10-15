/* eslint-disable prettier/prettier */
export const statsData = [
  { title: 'Gross Sales', metric: '5600.00', stat: '12', direction: 'up' },
  { title: 'Total Orders', metric: '122', stat: '12', direction: 'down' },
  { title: 'Gross Profit', metric: '300.00', stat: '12', direction: 'down' },
  { title: 'Expenses', metric: '200.00', stat: '12', direction: 'up' },
  { title: 'Net Profit', metric: '20.00', stat: '12', direction: 'down' },
];

export const productData = [
  { id: 1, itemName: 'Mango', amount: 10 },
  { id: 2, itemName: 'Orange', amount: 20 },
  { id: 3, itemName: 'Apple', amount: 30 },
  { id: 4, itemName: 'Cocoa', amount: 40 },
  { id: 5, itemName: 'Strawberry', amount: 50 },
  { id: 6, itemName: 'Pawpaw', amount: 60 },
  { id: 7, itemName: 'Rice', amount: 70 },
  { id: 8, itemName: 'Tuna', amount: 80 },
  { id: 9, itemName: 'Chicken', amount: 90 },
  { id: 10, itemName: 'Waakye', amount: 10 },
  { id: 11, itemName: 'Watermelon', amount: 20 },
  { id: 12, type: 'Add' },
];

export const cartData = [
  { id: 1, itemName: 'Mango', variant: '19', amount: 19.99 },
  { id: 2, itemName: 'Mango', variant: '19', amount: 19.99 },
  { id: 3, itemName: 'Mango', variant: '19', amount: 19.99 },
  { id: 4, taxName: 'VAT', amount: 19.99 },
  { id: 5, taxName: 'NHIL', amount: 9.99 },
  // { id: 6, taxName: 'Delivery Fee', amount: 5.99 },
  // {},
];

export const receiptData = [
  { itemName: 'Mango', variant: '19', amount: 19.99 },
  { itemName: 'Mango', variant: '19', amount: 19.99 },
  { itemName: 'Mango', variant: '19', amount: 19.99 },
  { taxName: 'VAT', amount: 19.99 },
  { taxName: 'NHIL', amount: 19.99 },
];

export const taxData = [
  { id: 'taxid1', taxName: 'VAT', amount: 15 },
  { id: 'taxid2', taxName: 'NHIL', amount: 10 },
  // { id: 6, taxName: 'Delivery Fee', amount: 5.99 },
];

export const customerData = [
  { id: 1, name: 'Inaki Williams', telephone: '+233558661575' },
  { id: 2, name: 'Pedri Gonzalez', telephone: '+233558661575' },
  { id: 3, name: 'Frenkie Dejong', telephone: '+233558661575' },
  { id: 4, name: 'Alex Balde', telephone: '+233558661575' },
  { id: 5, name: 'Thomas Partey', telephone: '+233558661575' },
];

export const previewData = [
  { name: 'Item Total', amount: '10.99' },
  { name: 'VAT', amount: '2.99' },
  { name: 'NHIL', amount: '3.99' },
];
