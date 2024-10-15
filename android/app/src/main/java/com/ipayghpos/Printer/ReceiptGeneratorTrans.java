package com.ipayghpostablet.Printer;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.pax.gl.page.IPage;
import com.pax.gl.page.PaxGLPage;

import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;


public class ReceiptGeneratorTrans implements com.ipayghpostablet.Printer.IReceiptGenerator {
    Context context;

    public PaxGLPage iPaxGLPage;
    Bitmap bitmap;

    private String totalTransactions;
    private String cashAmount;
    private String nonCashAmount;
    private String nTransactions;
    private String dateRange;



    private String merchantName;
    private String merchantId;
    private String terminalId;
    private String transAmount;
    //private Float transAmount;
//    private Float transCommission;
    private String merchantContact;
    private String invoiceNos;
    private String receiptType;
    private String reference;
    private String timestamp;
    private String till;
    private String transType,customerName,customerPhone,description,transCharge,transTotal;

    final NumberFormat formatter = new DecimalFormat("0.00");


    public Bitmap getBitmap() {
        return bitmap;
    }

    public void setBitmap(Bitmap bitmap) {
        this.bitmap = bitmap;
    }


//    public ReceiptGeneratorTrans(Context context, String transStatus, String dateTime, Float transCommission, String issuerType, String transOrderId, String transExternalId, String phoneNumber, String transAmount, String receipt_copy, int payment_identifier) {
//        this.context = context;
//        this.merchantName = merchantName;
//        this.merchantDesc = merchantDesc;
//        this.merchantId = merchantId;
//        this.terminalId = terminalId;
//        this.merchantContact=merchantContact;
//        this.invoiceNos=invoiceNos;
//        this.receiptType=receiptType;
//        this.reference=reference;
//        this.timestamp=timestamp;
//        this.transType=transType;
//        this.customerName=customerName;
//        this.customerPhone=customerPhone;
//        this.description=description;
//        this.transCharge=transCharge;
//        this.transTotal=transTotal;
//    }



//    public ReceiptGeneratorTrans(Context context, String merchantName, String merchantDesc, String merchantId, String terminalId,  String transStatus, String dateTime, Float transCommission, String issuerType, String transOrderId, String transExternalId, String phoneNumber, String transAmount, String receipt_copy, int payment_identifier) {
//        this.context = context;
//        this.merchantName = merchantName;
//        this.merchantDesc = merchantDesc;
//        this.merchantId = merchantId;
//        this.terminalId = terminalId;
//        this.transStatus = transStatus;
//        this.dateTime = dateTime;
//        this.transCommission = transCommission;
//        this.issuerType = issuerType;
//        this.transOrderId = transOrderId;
//        this.transExternalId = transExternalId;
//        this.phoneNumber = phoneNumber;
//        this.transAmount = transAmount;
//        this.receipt_copy = receipt_copy;
//        this.payment_identifier = payment_identifier;
//    }
    public ReceiptGeneratorTrans(Context context,
                                 String totalTransactions,
                                 String cashAmount,
                                 String nonCashAmount,
                                 String transAmount,
                                 String dateRange) {
        this.context = context;
        this.cashAmount = cashAmount;
        this.nonCashAmount = nonCashAmount;
        this.transAmount = transAmount;
        this.dateRange = dateRange;
        this.nTransactions = totalTransactions;
    }

    public ReceiptGeneratorTrans(Context context,
                                 String merchantName,
                                 String merchantId,
                                 String merchantContact,
                                 String invoiceNos,
                                 String receiptType,
                                 String reference,
                                 String timestamp,
                                 String transType,
                                 String customerName,
                                 String customerPhone,
                                 String description,
                                 String transCharge,
                                 String transTotal,
                                 String transAmount,
                                 String till) {
        this.context = context;
        this.merchantName = merchantName;
        this.merchantId = merchantId;
        this.merchantContact=merchantContact;
        this.invoiceNos=invoiceNos;
        this.receiptType=receiptType;
        this.reference=reference;
        this.timestamp=timestamp;
        this.transType=transType;
        this.customerName=customerName;
        this.customerPhone=customerPhone;
        this.description=description;
        this.transCharge=transCharge;
        this.transTotal=transTotal;
        this.transAmount=transAmount;
        this.till=till;
    }


    /*public ReceiptGeneratorTrans(Context context, List<Record> transaction_records, String merchantName, String merchantDesc) {
        this.context = context;
        this.transaction_records = transaction_records;
        this.merchantName = merchantName;
        this.merchantDesc = merchantDesc;

    }*/


    @Override
    public void run() {
        IPage page = generatePage();

        //title
        //page.addLine().addUnit(getImageFromAssetsFile("logo.bmp"));
        page.addLine().addUnit(getImageFromAssetsFile("logo.bmp"), IPage.EAlign.CENTER);

        //page.addLine().addUnit(page.createUnit().setText(" "));
//        page.addLine().addUnit("----------------------------------", FONT_NORMAL);

        //Merchant Name
        page.addLine()
                .addUnit(page.createUnit()
                        .setText("Merchant : "+merchantName)
                        .setFontSize(FONT_NORMAL)
                        .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                        .setAlign(IPage.EAlign.CENTER)
                        .setWeight(1.4f));


        if(till != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Till : "+till)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setAlign(IPage.EAlign.CENTER)
                            .setWeight(1.4f));
        }

        if(merchantId != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("ID : "+merchantId)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setAlign(IPage.EAlign.CENTER)
                            .setWeight(1.4f));
        }

        if(merchantContact != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Tel : "+merchantContact)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setAlign(IPage.EAlign.CENTER)
                            .setWeight(1.4f));
        }
        if(invoiceNos != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Trans Invoice : "+invoiceNos)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setAlign(IPage.EAlign.CENTER)
                            .setWeight(1.4f));
        }

        // for printing transaction summary
        page.addLine().addUnit("----------------------------------", FONT_NORMAL);

        if(totalTransactions != null) {
            page.addLine().addUnit(page.createUnit()
                    .setText("TOTAL TRANSACTIONS: " +totalTransactions)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setAlign(IPage.EAlign.CENTER)
                    .setWeight(1.0f));
        }
        if(cashAmount != null) {
            page.addLine().addUnit(page.createUnit()
                    .setText("CASH AMOUNT: " +cashAmount)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setAlign(IPage.EAlign.CENTER)
                    .setWeight(1.0f));
        }
        if(nonCashAmount != null) {
            page.addLine().addUnit(page.createUnit()
                    .setText("NON-CASH AMOUNT: " +nonCashAmount)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setAlign(IPage.EAlign.CENTER)
                    .setWeight(1.0f));
        }
        if(transAmount != null) {
            page.addLine().addUnit(page.createUnit()
                    .setText("TOTAL AMOUNT: " +transAmount)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setAlign(IPage.EAlign.CENTER)
                    .setWeight(1.0f));
        }

        if(dateRange != null) {
            page.addLine().addUnit(page.createUnit()
                    .setText("DATE: " +dateRange)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setAlign(IPage.EAlign.CENTER)
                    .setWeight(1.0f));
        }




        //Line
        page.addLine().addUnit("----------------------------------", FONT_NORMAL);

        if(receiptType != null) {
            //Merchant Description
            page.addLine().addUnit(page.createUnit()
                    .setText(receiptType)
                    .setFontSize(FONT_NORMAL)
                    .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                    .setWeight(1.4f));
        }
        page.addLine().addUnit("----------------------------------", FONT_NORMAL);

        if(reference != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Trans Reference : "+reference)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(timestamp != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Timestamp : "+timestamp)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(transType != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Transaction Type : "+transType)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(customerName != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Customer Name : "+customerName)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(customerPhone != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Customer Phone No : "+customerPhone)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(description != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Description : "+description)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(transAmount != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Transaction Amount : "+transAmount)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }
        if(transCharge != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Charge : "+transCharge)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        if(transTotal != null) {
            //Merchant ID
            page.addLine()
                    .addUnit(page.createUnit()
                            .setText("Total Amount : "+transTotal)
                            .setFontSize(FONT_NORMAL)
                            .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                            .setWeight(1.4f));
        }

        //Line
        page.addLine().addUnit("----------------------------------", FONT_NORMAL);

        //Merchant or customer copy
        page.addLine().addUnit(page.createUnit()
                .setText("TRANSACTION SUCCESSFUL")
                .setFontSize(FONT_NORMAL)
                .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                .setAlign(IPage.EAlign.CENTER)
                .setWeight(1.0f));


        //end of receipt message
        page.addLine().addUnit(page.createUnit()
                .setText("Thank you.")
                .setFontSize(FONT_NORMAL)
                .setTextStyle(IPage.ILine.IUnit.TEXT_STYLE_BOLD)
                .setAlign(IPage.EAlign.CENTER)
                .setWeight(1.0f));



        page.addLine().addUnit(page.createUnit().setText("\n\n\n\n"));

        //Receipt Width
        int width = 384;

        Bitmap bitmap1 = iPaxGLPage.pageToBitmap(page, width);
        setBitmap(bitmap1);

    }





    public IPage generatePage() {
        iPaxGLPage = PaxGLPage.getInstance(context);
        IPage page = iPaxGLPage.createPage();
//        page.setTypefaceObj(Typeface.createFromAsset(context.getAssets(), "verdana.ttf"));
        return page;
    }

    public Bitmap getImageFromAssetsFile(String fileName) {
        Bitmap image = null;
        AssetManager am = context.getResources().getAssets();
        try {
            InputStream is = am.open(fileName);
            image = BitmapFactory.decodeStream(is);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return image;
    }
}
