import { NativeModules } from 'react-native';

const { PrinterModule } = NativeModules;

// export function printTransactionSummary(
//   totalTransactions,
//   cashAmount,
//   nonCashAmount,
//   totalAmount,
//   dateRange,
// ) {
//   PrinterModule.print(
//     totalTransactions,
//     cashAmount,
//     nonCashAmount,
//     totalAmount,
//     dateRange,
//   );
// }

export function printEcobank(
  merchantName,
  merchantId,
  merchantContact,
  invoiceNos,
  receiptType,
  reference,
  timestamp,
  transType,
  customerName,
  customerPhone,
  description,
  transCharge,
  transTotal,
  transAmount,
  till,
) {
  PrinterModule.print(
    merchantName,
    merchantId,
    merchantContact,
    invoiceNos,
    receiptType,
    reference,
    timestamp,
    transType,
    customerName,
    customerPhone,
    description,
    transCharge,
    transTotal,
    transAmount,
    till,
  );
}
