package com.ipayghpostablet.Printer;

import android.graphics.Bitmap;

import com.pax.dal.IPrinter;
import com.pax.dal.entity.EFontTypeAscii;
import com.pax.dal.entity.EFontTypeExtCode;
import com.pax.dal.exceptions.PrinterDevException;


public class PrinterTester {

    private static PrinterTester printerTester;
    private final IPrinter printer;


    private PrinterTester() {
        printer = com.ipayghpostablet.MainApplication.getDal().getPrinter();
    }

    public static PrinterTester getInstance() {
        if (printerTester == null) {
            printerTester = new PrinterTester();
        }
        return printerTester;
    }

    public void init() {
        try {
            printer.init();
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public String getStatus() {
        try {
            int status = printer.getStatus();
            return statusCode2Str(status);
        } catch (PrinterDevException e) {
            e.printStackTrace();
            return "";
        }
    }

    public void fontSet(EFontTypeAscii asciiFontType, EFontTypeExtCode cFontType) {
        try {
            printer.fontSet(asciiFontType, cFontType);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void spaceSet(byte wordSpace, byte lineSpace) {
        try {
            printer.spaceSet(wordSpace, lineSpace);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void printStr(String str, String charset) {
        try {
            printer.printStr(str, charset);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void step(int b) {
        try {
            printer.step(b);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void printBitmap(Bitmap bitmap) {
        try {
            printer.printBitmap(bitmap);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public String start() {
        try {
            int res = printer.start();
            return statusCode2Str(res);
        } catch (PrinterDevException e) {
            e.printStackTrace();
            return "";
        }
    }

    public void leftIndents(short indent) {
        try {
            printer.leftIndent(indent);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public int getDotLine() {
        try {
            int dotLine = printer.getDotLine();
            return dotLine;
        } catch (PrinterDevException e) {
            e.printStackTrace();
            return -2;
        }
    }

    public void setGray(int level) {
        try {
            printer.setGray(level);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void setDoubleWidth(boolean isAscDouble, boolean isLocalDouble) {
        try {
            printer.doubleWidth(isAscDouble, isLocalDouble);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void setDoubleHeight(boolean isAscDouble, boolean isLocalDouble) {
        try {
            printer.doubleHeight(isAscDouble, isLocalDouble);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public void setInvert(boolean isInvert) {
        try {
            printer.invert(isInvert);
        } catch (PrinterDevException e) {
            e.printStackTrace();
        }
    }

    public String cutPaper(int mode) {
        try {
            printer.cutPaper(mode);
            return "Cut Paper successful";
        } catch (PrinterDevException e) {
            e.printStackTrace();
            return e.toString();
        }
    }

    public String getCutmode() {
        String resultStr = "";
        try {
            int mode = printer.getCutMode();
            switch (mode) {
                case 0:
                    resultStr = "Only support full paper cut ";
                    break;
                case 1:
                    resultStr = "Only support partial paper cutting ";
                    break;
                case 2:
                    resultStr = "support partial paper and full paper cutting ";
                    break;
                case -1:
                    resultStr = "No cutting knife, not Supported. ";
                    break;
                default:
                    break;
            }
            return resultStr;
        } catch (PrinterDevException e) {
            e.printStackTrace();
            return e.toString();
        }
    }

    public String statusCode2Str(int status) {
        String res = "";
        switch (status) {
            case 0:
                res = "Success ";
                break;
            case 1:
                res = "Printer is Busy. ";
                break;
            case 2:
                res = "Out of Paper. ";
                break;
            case 3:
                res = "The format of print data packet error. ";
                break;
            case 4:
                res = "Printer malfunction. ";
                break;
            case 8:
                res = "Printer is Over heated. ";
                break;
            case 9:
                res = "Printer voltage too Low. ";
                break;
            case 240:
                res = "Printing is unfinished. ";
                break;
            case 252:
                res = "The printer has not installed font library. ";
                break;
            case 254:
                res = "Data package is too long. ";
                break;
            default:
                break;
        }
        return res;
    }
}
