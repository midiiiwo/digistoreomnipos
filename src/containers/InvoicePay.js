/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { DateTimePicker } from 'react-native-ui-lib/src/components/dateTimePicker';
import { useQueryClient } from 'react-query';
import moment from 'moment';
import { useRaiseOrder } from '../hooks/useRaiseOrder';
import { useReceiveQuickPayment } from '../hooks/useReceiveQuickPayment';
import InvoiceStatus from '../components/Modals/InvoiceStatus';
import _ from 'lodash';
import Input from '../components/Input';
import { useGetTransactionFee } from '../hooks/useGetTransactionFee';
import Loading from '../components/Loading';

function InvoicePay({ route }) {
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  // const step = React.useRef(0);
  const [date, setDate] = React.useState('');
  const { amount } = route.params;
  const [status, setStatus] = React.useState();
  const [invoiceModal, setInvoiceModal] = React.useState(false);

  const [account, setAccount] = React.useState('');

  const mutation = useRaiseOrder(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    client.invalidateQueries('invoice-history');
    setStatus(i);
  });
  const receiveQuickPaymentMutation = useReceiveQuickPayment(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    client.invalidateQueries('invoice-history');
    setStatus(i);
  });

  const {
    cart,
    delivery,
    customerPayment,
    // totalAmount,
    discountPayload,
    orderDate,
    addTaxes,
    orderCheckoutTaxes,
    orderNotes,
    deliveryNote,
  } = useSelector(state_ => state_.sale);
  const { quickSaleInAction, description, channel } = useSelector(
    state_ => state_.quickSale,
  );
  const client = useQueryClient();

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetTransactionFee(
    'INVPAY',
    amount,
    user.merchant,
    true,
  );

  React.useEffect(() => {
    if (status) {
      setInvoiceModal(true);
    }
  }, [status, setStatus]);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  // let payment_type;

  const orderItems = {};
  cart.forEach((item, idx) => {
    orderItems[idx] = {
      order_item_no:
        item.type && item.type === 'non-inventory-item' ? '' : item.id,
      order_item_qty: item.quantity,
      order_item: item.itemName,
      order_item_amt: item.amount,
      order_item_prop: item.order_item_props || {},
    };
  });

  const orderAmount = (cart || []).reduce((prev, curr) => {
    if (curr) {
      return prev + curr.quantity * curr.amount;
    }
    return prev;
  }, 0);
  const orderTaxes_ = {};
  (orderCheckoutTaxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  const transactionFee = data && data.data;

  return (
    <>
      <View
        style={{
          height: '100%',
          borderRadius: 0,
          backgroundColor: '#fff',
          paddingTop: 14,
        }}>
        <ScrollView
          style={styles.main}
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={isLoading || isFetching}
            />
          }>
          {/* <View style={styles.title}>
            <Text style={styles.choose}>Invoice for GHS {amount}</Text>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              borderStyle: 'dashed',
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              Subtotal
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              {amount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              borderStyle: 'dashed',
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              Fee
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              {transactionFee && transactionFee.charge}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              borderStyle: 'dashed',
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              Total
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
              }}>
              {transactionFee && transactionFee.total}
            </Text>
          </View>
          <View style={{ marginVertical: 12 }} />
          <Input
            placeholder="Mobile number"
            showError={showError && account.length === 0}
            val={account}
            setVal={setAccount}
            keyboardType="phone-pad"
          />
          <DateTimePicker
            // title={'Due Date'}
            placeholder={'Set Due Date for Invoice'}
            mode={'date'}
            style={{ marginTop: 24 }}
            migrate
            value={date}
            onChange={val => {
              setDate(val);
            }}
          />
        </ScrollView>
        {invoiceModal && (
          <InvoiceStatus
            modalState={invoiceModal}
            toggle={setInvoiceModal}
            data={status}
            setStatus={setStatus}
          />
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={receiveQuickPaymentMutation.isLoading || mutation.isLoading}
          handlePress={() => {
            if (account.length === 0) {
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            if (date.length === 0) {
              toast.show('Please set due date for Invoice', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            if (!transactionFee) {
              toast.show('Refresh screen to calculate transaction fee', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            let pay_date = moment().format('YYYY-MM-DD H:mm:ss');
            const orderDate_ = new Date(
              ((orderDate && orderDate.toString()) || '').slice(0, 10),
            );
            orderDate_.setTime(Date.now());

            const payload = quickSaleInAction
              ? {
                  vendor: user.user_merchant_receivable,
                  email: (customerPayment && customerPayment.email) || '',
                  phone: (customerPayment && customerPayment.phone) || '',
                  mobilenumber: account,
                  description,
                  amount,
                  quantity: 1,
                  channel: 'INVPAY',
                  notify_source:
                    Platform.OS === 'android' ? 'ANDROID POS V2' : 'IOS V2',
                  notify_device: '',
                  name: (customerPayment && customerPayment.name) || '',
                  mod_by: user.login,
                  pay_due: moment(date).format('YYYY-MM-DD'),
                  pay_date:
                    (orderDate || '').toString().length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                  mod_date:
                    (orderDate || '').toString().length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                }
              : {
                  order_items: JSON.stringify(orderItems),
                  order_outlet: user.outlet,
                  // order_taxes: JSON.stringify(orderTaxes),
                  delivery_type: (delivery && delivery.value) || '',
                  delivery_location: '',
                  delivery_name:
                    (customerPayment && customerPayment.name) || '',
                  delivery_contact:
                    (customerPayment && customerPayment.phone) || '',
                  delivery_email:
                    (customerPayment && customerPayment.email) || '',
                  delivery_charge: 0,
                  service_charge:
                    (transactionFee && transactionFee.charge) || 0,
                  order_coupon:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount_code:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount:
                    (discountPayload && discountPayload.discount) || 0,
                  order_amount: orderAmount,
                  total_amount: transactionFee && transactionFee.total,
                  payment_type: 'INVOICE',
                  payment_network: 'UNKNOWN',
                  merchant: user.merchant,
                  order_notes: orderNotes,
                  delivery_notes: deliveryNote,
                  source: channel,
                  notify_source: 'Digistore Business',
                  mod_by: user.login,
                  payment_number: account,
                  payment_due_date: moment(date).format('YYYY-MM-DD'),
                  pay_date:
                    (orderDate_ || '').toString().length > 0
                      ? moment(orderDate_).format('DD-MM-YYYY H:mm:ss')
                      : pay_date,
                  mod_date:
                    (orderDate_ || '').toString().length > 0
                      ? moment(orderDate_).format('DD-MM-YYYY H:mm:ss')
                      : pay_date,
                };
            if (!quickSaleInAction && !_.isEmpty(orderTaxes_) && addTaxes) {
              // eslint-disable-next-line dot-notation
              payload['order_taxes'] = JSON.stringify(orderTaxes_);
            }
            if (quickSaleInAction) {
              receiveQuickPaymentMutation.mutate(payload);
            } else {
              mutation.mutate(payload);
            }
          }}>
          {receiveQuickPaymentMutation.isLoading || mutation.isLoading
            ? 'Processing'
            : 'Send Invoice'}
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
  },
  indicatorStyle: {
    display: 'none',
  },
  title: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  choose: {
    fontFamily: 'Lato-Semibold',
    fontSize: 20,
    color: '#30475E',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  dWrapper: {
    paddingTop: 12,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 12,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default InvoicePay;
