/* eslint-disable react-native/no-inline-styles */
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { invoiceHtml } from '../utils/invoiceHtml';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';

import { useRaiseOrder } from '../hooks/useRaiseOrder';
import { useQueryClient } from 'react-query';
import _ from 'lodash';
import moment from 'moment';
import InvoicePaymentStatus from '../components/Modals/InvoicePaymentStatus';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useSelector } from 'react-redux';

import { useMutation } from 'react-query';
import { createEstimate, UpdateEstimateDetails } from '../api/invoices';

export function useCreateEstimate(handleSuccess) {
  const queryResult = useMutation(
    ['create-estimate'],
    payload => {
      try {
        return createEstimate(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

export function useUpdateEstimateDetails(handleSuccess) {
  const queryResult = useMutation(
    ['update-estimate-details'],
    payload => {
      try {
        return UpdateEstimateDetails(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

const InvoicePreview = props => {
  const [pdfPath, setPdfPath] = React.useState();
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  // const toast = useToast();
  const client = useQueryClient();
  const [status, setStatus] = React.useState();
  const { user: user_ } = useSelector(state => state.auth);

  const { data, isLoading } = useGetReceiptDetails(user_.merchant);

  const mutation = useRaiseOrder(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    client.invalidateQueries('invoice-history');
    setStatus(i);
  });

  const $createEstimate = useCreateEstimate(i => {
    client.invalidateQueries('estimate-history');
    setStatus(i);
  });

  const $updateEstimate = useUpdateEstimateDetails(i => {
    client.invalidateQueries('estimate-history');
    setStatus(i);
  });

  const [invoiceModal, setInvoiceModal] = React.useState(false);

  const {
    cart,
    customer,
    invoiceNumber,
    invoiceDate,
    dueDate,
    notes,
    user,
    grandTotal,
    taxes,
    isEstimate,
    estimateAction,
    recordNumber,
  } = props?.route?.params;

  const { outlet } = useSelector(state => state.auth);

  const orderItems = {};
  cart.forEach((item, idx) => {
    orderItems[idx] = {
      order_item_no:
        item.type && item.type === 'non-inventory-item' ? '' : item.id,
      order_item_qty: item && item.quantity,
      order_item: item && item.itemName,
      order_item_amt: item && item.amount,
      order_item_prop: (item && item.order_item_props) || {},
      order_item_prop_id: item && item.order_item_prop_id,
    };
  });

  const orderAmount = (cart || []).reduce((prev, curr) => {
    if (curr) {
      return prev + curr.quantity * curr.amount;
    }
    return prev;
  }, 0);

  const orderTaxes_ = {};
  (taxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  React.useEffect(() => {
    if (status) {
      setInvoiceModal(true);
    }
  }, [status, setStatus]);

  const receiptItem = data?.data?.data;

  React.useEffect(() => {
    (async () => {
      const options = {
        html: invoiceHtml(props?.route?.params, receiptItem, isEstimate),
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
  }, [props.route.params, invoiceNumber, receiptItem, isEstimate]);

  if (loading || !pdfPath || isLoading) {
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
        <Text
          style={{
            fontFamily: 'ReadexPro-bold',
            color: '#7743DB',
            fontSize: 18,
          }}>
          {isEstimate ? 'ESTIMATE' : 'INVOICE'} GHS{' '}
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(grandTotal)}
        </Text>
      </View>
      {pdfPath?.filePath && (
        <Pdf
          source={{ uri: pdfPath.filePath }}
          onLoadComplete={numberOfPages => {
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
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={[styles.btn, { flex: 1 }]}
          handlePress={() => {
            navigation.goBack();
          }}>
          {'Edit'}
        </PrimaryButton>
        <View style={{ marginHorizontal: 3 }} />
        <PrimaryButton
          style={[styles.btn, { flex: 1, backgroundColor: '#30475e' }]}
          disabled={mutation.isLoading}
          handlePress={() => {
            dueDate.setUTCHours(0, 0, 0, 0);

            if (isEstimate && estimateAction === 'update') {
              $updateEstimate.mutate({
                merchant: user.merchant,
                mod_by: user.login,
                outlet: outlet?.outlet_id,
                invoice_data: JSON.stringify({
                  ...props?.route?.params,
                  user: null,
                  merchantDetails: null,
                }),
                customer: customer?.id || '',
                draft: recordNumber,
              });
              return;
            }

            if (isEstimate) {
              $createEstimate.mutate({
                merchant: user.merchant,
                mod_by: user.login,
                outlet: outlet?.outlet_id,
                invoice_data: JSON.stringify({
                  ...props?.route?.params,
                  user: null,
                  merchantDetails: null,
                }),
                customer: customer?.id || '',
              });
              return;
            }

            const payload = {
              external_invoice: invoiceNumber,
              order_items: JSON.stringify(orderItems),
              order_outlet: user.outlet,
              delivery_id:
                props?.route?.params?.delivery?.delivery_id || user.outlet,
              delivery_type: props?.route?.params?.delivery?.value || 'WALK-IN',
              delivery_location:
                props?.route?.params?.delivery?.delivery_location || '',
              delivery_gps: props?.route?.params?.delivery?.delivery_gps || '',
              delivery_name: customer?.name || '',
              delivery_contact: customer?.phone || '',
              delivery_email: customer?.email || '',
              customer: customer?.id || '',
              delivery_charge: props?.route?.params?.delivery?.price || 0,
              delivery_charge_ref: '',
              delivery_charge_type: '',
              service_charge: 0,
              order_discount_code:
                props?.route?.params?.discount?.discountCode || '',
              order_discount: props?.route?.params?.discount?.discount || 0,
              order_amount: orderAmount,
              total_amount: grandTotal,
              payment_type: 'INVOICE',
              payment_network: 'UNKNOWN',
              merchant: user.merchant,
              order_notes: notes,
              delivery_notes: moment(dueDate).format('YYYY-MM-DD HH:mm:ss'),
              source: 'INSHP',
              notify_source: 'Digistore Business',
              mod_by: user.login,
              payment_number: (customer && customer.phone) || '',
              invoiceDueDate: moment(dueDate).format('YYYY-MM-DD HH:mm:ss'),
              payment_receipt: '',
              order_date: moment(invoiceDate?.setTime(Date.now())).format(
                'YYYY-MM-DD HH:mm:ss',
              ),
            };
            if (!_.isEmpty(orderTaxes_)) {
              // eslint-disable-next-line dot-notation
              payload['order_taxes'] = JSON.stringify(orderTaxes_);
            }
            mutation.mutate(payload);
          }}>
          {mutation.isLoading || $createEstimate.isLoading
            ? 'Processing'
            : isEstimate
            ? 'Save'
            : 'Approve'}
        </PrimaryButton>
        {invoiceModal && (
          <InvoicePaymentStatus
            modalState={invoiceModal}
            toggle={setInvoiceModal}
            data={status}
            setStatus={setStatus}
            orderDetails={props.route.params}
            isEstimate={isEstimate}
          />
        )}
      </View>
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
    </View>
  );
};

export default InvoicePreview;

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
    paddingHorizontal: 22,
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
