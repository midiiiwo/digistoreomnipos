package com.ipayghpostablet.Printer;

import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.util.Log;

public class PrintingTask extends AsyncTask<Bitmap, Void, Void> {

    String status;
    Bitmap bitmap1;

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