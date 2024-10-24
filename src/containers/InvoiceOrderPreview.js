/* eslint-disable react-native/no-inline-styles */
import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import Loading from '../components/Loading';
// import FileViewer from 'react-native-file-viewer';
import InvoiceSendButton from '../components/InvoiceSendButton';
import { invoiceOrderHtml } from '../utils/invoiceOrderHtml';
import { useSelector } from 'react-redux';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';

const InvoiceOrderPreview = props => {
  const [pdfPath, setPdfPath] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { user } = useSelector(state => state.auth);

  const { data: data_ } = useGetReceiptDetails(user.merchant);
  // const toast = useToast();

  // const { cart, invoiceNumber, invoiceDate, dueDate, taxes } =
  //   props.route.params.orderDetails;
  const { cart, data, merchantDetails, invoiceId, isEstimate, estimateData } =
    props.route?.params;

  const orderItems = (cart || []).map(item => {
    if (!item) {
      return;
    }
    return {
      id: item?.order_item_id,
      quantity: item?.order_item_qty,
      itemName: item?.order_item,
      amount: item?.order_item_amount,
      order_item_props: item?.order_item_properties,
    };
  });

  // const orderTaxes_ = {};
  // (taxes || []).forEach((taxItem, idx) => {
  //   if (taxItem) {
  //     orderTaxes_[idx] = {
  //       tax_no: taxItem.taxId,
  //       tax_value: taxItem.amount,
  //     };
  //   }
  // });

  const receiptItem = data_?.data?.data;

  React.useEffect(() => {
    (async () => {
      const orderDetails = {
        cart: orderItems,
        customer: {
          email: data?.customer_email || estimateData?.customer?.email || '',
          phone: data?.customer_contact || estimateData?.customer?.phone || '',
          name: data?.customer_name || estimateData?.customer?.name || '',
        },
        merchantDetails,
        invoiceNumber: invoiceId || estimateData?.invoiceNumber,
        invoiceDate: data?.order_date || estimateData?.invoiceDate,
        dueDate: data?.delivery_notes || estimateData?.dueDate,
        notes: data?.customer_notes || estimateData?.notes,
        user,
        subTotal: data?.order_amount || Number(estimateData?.subTotal || 0),
        grandTotal: data?.total_amount || estimateData?.grandTotal,
        taxInclusiveTotal: 0,
        fee_charge: data?.fee_charge || 0,
        discount: data?.order_discount || estimateData?.discount?.price,
        delivery: data?.delivery_charge || estimateData?.delivery?.price,
        taxes:
          data?.tax_charges ||
          estimateData?.taxes?.map(i => ({
            tax_name: i?.taxName,
            tax_type: i?.appliedAs,
            tax_charged: i?.amount,
          })),
      };

      const options = {
        html: invoiceOrderHtml(orderDetails, data, receiptItem, isEstimate),
        fileName: 'INV' + data?.payment_invoice,
        directory: 'Download',
        base64: true,
      };
      try {
        setLoading(true);
        let file = await RNHTMLtoPDF.convert(options);
        setPdfPath(file);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, merchantDetails, user]);

  if (loading || !pdfPath) {
    return <Loading />;
  }

  return (
    <View style={styles.main}>
      <View
        style={{
          position: 'absolute',
          top: 14,
          alignSelf: 'center',
          zIndex: 100,
        }}>
        {/* <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#3C486B',
            fontSize: 18,
          }}>
          INVOICE {item}
        </Text> */}
      </View>
      {pdfPath && pdfPath.filePath && (
        <Pdf
          source={{ uri: pdfPath.filePath }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
          fitPolicy={2}
        />
      )}

      {/* <FloatingButton
        visible={true}
        hideBackgroundOverlay
        // bottomMargin={Dimensions.get('window').width * 0.18}
        button={{
          label: 'Preview',
          onPress: async () => {
            try {
              await FileViewer.open(pdfPath && pdfPath.filePath);
            } catch (error) {
              toast.show('error', { placement: 'top' });
            }
          },
          style: {
            marginLeft: 'auto',
            marginRight: 14,
            marginBottom: Dimensions.get('window').width * 0.23,
          },
        }}
      /> */}
      <InvoiceSendButton
        invoiceLink={data}
        pdfPath={pdfPath}
        isEstimate={isEstimate}
        estimateData={estimateData}
      />
    </View>
  );
};

export default InvoiceOrderPreview;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  pdf: {
    width: Dimensions.get('window').width * 0.95,
    flex: 1,
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: '#f5f5f5',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  btn: {
    borderRadius: 4,
    // width: '90%',
  },
  btn1: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '80%',
  },
});
