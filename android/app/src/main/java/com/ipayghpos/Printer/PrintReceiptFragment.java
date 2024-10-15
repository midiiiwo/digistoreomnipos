//package com.ipayghpostablet.Printer;
//
//import android.graphics.Bitmap;
//import android.os.AsyncTask;
//import android.os.Bundle;
//import androidx.fragment.app.Fragment;
//import android.util.Log;
//import android.view.LayoutInflater;
//import android.view.View;
//import android.view.ViewGroup;
//import android.widget.ImageView;
//import android.widget.Toast;
//
//import com.ipayghpostablet.R;
//
//import javax.annotation.Nullable;
//
//
//public class PrintReceiptFragment extends Fragment {
//    Bitmap bitmap1;
//    ImageView imageView;
//    final PrintingTask printingTask = new PrintingTask();
//    String amountStr, phoneNoStr, lastDigitStr, dateTimeStr, transStatusStr, transErrorCodeStr, transCurrencyStr, transProviderStr, transExternalId, transChargeCurrency,
//            transOrderId, receipt_copy;
//    Float  commissionStr;
//    int payment_identifier;
//    String merchant_name, merchant_desc, merchant_id, terminal_id;
//
//
//    @Override
//    public void onCreate(@Nullable Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//
//        //Bundle
//        Bundle bundle_printPreview = getArguments();
//        amountStr = bundle_printPreview.getString("transaction_amount");
//        commissionStr = bundle_printPreview.getFloat("transaction_commission");
//
//        phoneNoStr = bundle_printPreview.getString("client_phone_number");
//
//
//        phoneNoStr = bundle_printPreview.getString("client_phone_number");
//
//
//        lastDigitStr = bundle_printPreview.getString("client_last_4_digit");
//        lastDigitStr = "******"+ lastDigitStr;
//        dateTimeStr = bundle_printPreview.getString("transaction_currentDate");
//        transStatusStr = bundle_printPreview.getString("transaction_status");
//        //transErrorCodeStr = bundle_printPreview.getString("transaction_errCode");
//        transCurrencyStr = bundle_printPreview.getString("transaction_currency");
//        transProviderStr = bundle_printPreview.getString("transaction_provider");
//
//        transExternalId = bundle_printPreview.getString("transaction_external_id");
//        transOrderId = bundle_printPreview.getString("transaction_order_id");
//        transChargeCurrency = bundle_printPreview.getString("transaction_charge_currency");
//        payment_identifier = bundle_printPreview.getInt("transaction_payment_identifier");
//        merchant_name = bundle_printPreview.getString("transaction_merchant_name");
//        merchant_desc = bundle_printPreview.getString("transaction_merchant_desc");
//        merchant_id = bundle_printPreview.getString("transaction_merchant_id");
//        terminal_id = bundle_printPreview.getString("transaction_terminal_id");
//
//        receipt_copy = bundle_printPreview.getString("receipt_copy");
//
//
//    }
//
//    @Override
//    public View onCreateView(LayoutInflater inflater, ViewGroup container,
//                             Bundle savedInstanceState) {
//        // Inflate the layout for this fragment
//        View view = inflater.inflate(R.layout.fragment_print_receipt, container, false);
////        initView(view);
//        return view;
//    }
//
////    private void initView(View view) {
////        imageView = view.findViewById(R.id.fragImg_print_preview);
////
////        ReceiptGeneratorTrans receiptGeneratorTrans = new ReceiptGeneratorTrans(getContext().getApplicationContext(), merchant_name, merchant_desc, merchant_id, terminal_id, transStatusStr, dateTimeStr, commissionStr, transProviderStr, transOrderId, transExternalId, phoneNoStr, amountStr, receipt_copy, payment_identifier);
////        receiptGeneratorTrans.run();
////        bitmap1 = receiptGeneratorTrans.getBitmap();
////        if (bitmap1 == null) {
////            Toast.makeText(getContext().getApplicationContext(), "Bitmap is null", Toast.LENGTH_LONG).show();
////            return;
////        }
////        imageView.setImageBitmap(bitmap1);
////        printingTask.execute(bitmap1);
////    }
//
//
//    private class PrintingTask extends AsyncTask<Bitmap, Void, Void> {
//
//        String status;
//
//        @Override
//        protected Void doInBackground(Bitmap... bitmaps) {
//            PrinterTester.getInstance().init();
//            PrinterTester.getInstance().printBitmap(bitmap1);
//            status = PrinterTester.getInstance().start();
//            return null;
//        }
//
//        @Override
//        protected void onPostExecute(Void aVoid) {
//            Log.i("Printer Status: ", status);
//            super.onPostExecute(aVoid);
//        }
//    }
//}