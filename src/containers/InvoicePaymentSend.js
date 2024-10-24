import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';

// import FileViewer from 'react-native-file-viewer';
import InvoiceSendButton from '../components/InvoiceSendButton';
import { invoiceShareHtml } from '../utils/invoiceShareHtml';
import Loading from '../components/Loading';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useSelector } from 'react-redux';

const InvoicePaymentSend = props => {
  const [pdfPath, setPdfPath] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { user } = useSelector(state => state.auth);

  const { data: data_ } = useGetReceiptDetails(user.merchant);
  // const toast = useToast();

  const { cart, invoiceNumber, invoiceDate, dueDate, taxes } =
    props.route.params.orderDetails;

  const { data, isEstimate } = props.route?.params;

  const orderItems = {};
  (cart || []).forEach((item, idx) => {
    orderItems[idx] = {
      order_item_no:
        item.type && item.type === 'non-inventory-item' ? '' : item.id,
      order_item_qty: item.quantity,
      order_item: item.itemName,
      order_item_amt: item.amount,
      order_item_prop: item.order_item_props || {},
    };
  });

  const orderTaxes_ = {};
  (taxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  const receiptItem = data_?.data?.data;

  console.log('daatatat', data);

  React.useEffect(() => {
    (async () => {
      const options = {
        html: invoiceShareHtml(
          props?.route?.params?.orderDetails,
          data,
          receiptItem,
          isEstimate,
        ),
        fileName: 'INV' + invoiceNumber,
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
  }, [
    props.route.params,
    dueDate,
    invoiceDate,
    invoiceNumber,
    data,
    receiptItem,
    isEstimate,
  ]);

  if (loading || !pdfPath) {
    return <Loading />;
  }

  return (
    <View style={styles.main}>
      {/* <View
        style={{
          position: 'absolute',
          top: 14,
          alignSelf: 'center',
          zIndex: 100,
        }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#3C486B',
            fontSize: 18,
          }}>
          INVOICE {invoiceNumber}
        </Text>
      </View> */}
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
      />
    </View>
  );
};

export default InvoicePaymentSend;

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
