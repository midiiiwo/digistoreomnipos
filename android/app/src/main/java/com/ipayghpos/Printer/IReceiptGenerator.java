package com.ipayghpostablet.Printer;

public interface IReceiptGenerator {

    String TAG = "ReceiptGenerator";

    int FONT_BIGGEST = 40;
    int FONT_BIG = 30;
    int FONT_NORMAL = 24;
    int FONT_SMALL = 19;

    void run();

    //void run_report();
}
