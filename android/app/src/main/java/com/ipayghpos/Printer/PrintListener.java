package com.ipayghpostablet.Printer;

public interface PrintListener {
    enum Status {
        OK,
        CONTINUE,
        CANCEL,
    }

    /**
     * print prompt
     *
     * @param title
     * @param message
     */
    void onShowMessage(String title, String message);

    /**
     * printer abnormal
     */
    Status onConfirm(String title, String message);

    void onEnd();
}
