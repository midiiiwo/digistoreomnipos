package com.ipayghpostablet; // replace your-apps-package-name with your app’s package name
import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ipayghpostablet.Printer.PrinterTester;
import com.ipayghpostablet.Printer.ReceiptGeneratorTrans;
import com.pax.dal.IDAL;
import com.pax.neptunelite.api.NeptuneLiteUser;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import java.util.Map;
import java.util.HashMap;

public class PrinterModule extends ReactContextBaseJavaModule {
    PrinterModule(ReactApplicationContext context) {
        super(context);
    }

    final mDemoAppDAL mDemoAppDAL = new mDemoAppDAL();
    Bitmap bitmap1;

    @NonNull
    @Override
    public String getName() {
        return "PrinterModule";
    }

    @ReactMethod
    public void print(String  merchantName, String merchantId, String merchantContact,String invoiceNos, String receiptType,
                      String reference, String timestamp, String transType, String customerName,
                      String customerPhone, String description, String transCharge, String transTotal,
                      String transAmount, String till) {
        Log.d("CalendarModule", "Create event called with name: ");
        printAction(merchantName,
                merchantId, merchantContact,
                invoiceNos, receiptType,
                reference, timestamp,
                transType, customerName,
                customerPhone,
                description,
                transCharge,
                transTotal,
                transAmount,
                till);
    }

    @ReactMethod
    public void printTransactions(String totalTransactions,
                                  String cashAmount, String nonCashAmount, String totalAmount, String dateRange) {
        Log.d("CalendarModule", "Create event called with name: ");
        printTransactionAction(totalTransactions,cashAmount, nonCashAmount, totalAmount, dateRange);
    }

    public class mDemoAppDAL {
        private IDAL idal;

        public IDAL getIdal(){
            if (idal == null){
                try {
                    ReactContext c = getReactApplicationContext();
                    idal = NeptuneLiteUser.getInstance().getDal(c);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return idal;
        }

        public void beepOK() {
            getIdal().getDeviceInfo();
        }
    }

    public void printTransactionAction(String totalTransactions,
                            String cashAmount, String nonCashAmount, String totalAmount, String dateRange) {
        try {
//            Log.v(Constants.MAINPREF, "Print 2");
            ReceiptGeneratorTrans receiptGeneratorTrans = new ReceiptGeneratorTrans(getReactApplicationContext(),
                    totalTransactions,
                    cashAmount,
                    nonCashAmount,
                    totalAmount,
                    dateRange);
            final PrintingTask printingTask = new PrintingTask();
            receiptGeneratorTrans.run();
            bitmap1 = receiptGeneratorTrans.getBitmap();
            if (bitmap1 == null) {
                Toast.makeText(getReactApplicationContext(), "Bitmap is null", Toast.LENGTH_LONG).show();
                return;
            }
            printingTask.execute(bitmap1);
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public void printAction(String merchantName,
                            String merchantId, String merchantContact,
                            String invoiceNos, String receiptType,
                            String reference, String timestamp,
                            String transType, String customerName,
                            String customerPhone,String description,
                            String transCharge,String transTotal,
                            String transAmount,
                            String till) {
        try {
//            Log.v(Constants.MAINPREF, "Print 2");
            ReceiptGeneratorTrans receiptGeneratorTrans = new ReceiptGeneratorTrans(getReactApplicationContext(),
                    merchantName,
                    merchantId, merchantContact,
                    invoiceNos, receiptType,
                    reference, timestamp,
                    transType, customerName,
                    customerPhone,
                    description,
                    transCharge,
                    transTotal,
                    transAmount,
                    till);
            final PrintingTask printingTask = new PrintingTask();
            receiptGeneratorTrans.run();
            bitmap1 = receiptGeneratorTrans.getBitmap();
            if (bitmap1 == null) {
                Toast.makeText(getReactApplicationContext(), "Bitmap is null", Toast.LENGTH_LONG).show();
                return;
            }
            printingTask.execute(bitmap1);
        }catch(Exception e){
            e.printStackTrace();
        }
    }


    private class PrintingTask extends AsyncTask<Bitmap, Void, Void> {

        String status;
        @Override
        protected Void doInBackground(Bitmap... bitmaps) {
            PrinterTester.getInstance().init();
            PrinterTester.getInstance().printBitmap(bitmap1);
            status = PrinterTester.getInstance().start();
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            Log.i("Printer Status: ", status);
            super.onPostExecute(aVoid);
        }
    }

}