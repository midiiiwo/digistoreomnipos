/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import moment from 'moment';
import { useRaiseOrder } from '../hooks/useRaiseOrder';
import { useReceiveQuickPayment } from '../hooks/useReceiveQuickPayment';
import InvoiceStatus from '../components/Modals/InvoiceStatus';
import _ from 'lodash';
import Input from '../components/Input';
import { useGetTransactionFee } from '../hooks/useGetTransactionFee';
import Loading from '../components/Loading';
import UssdStatus from '../components/Modals/UssdStatus';

function UssdOffline({ route }) {
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  // const step = React.useRef(0);
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
    deliveryDueDate,
  } = useSelector(state_ => state_.sale);
  const { quickSaleInAction, channel } = useSelector(
    state_ => state_.quickSale,
  );
  const client = useQueryClient();

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetTransactionFee(
    'OFFUSSD',
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
  (orderCheckoutTaxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  const transactionFee = data && data.data;

  console.log('trrrrr', transactionFee);

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
                fontFamily: 'ReadexPro-Regular',
                color: '#30475e',
              }}>
              Subtotal
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'ReadexPro-Regular',
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
                fontFamily: 'ReadexPro-Regular',
                color: '#30475e',
              }}>
              Fee
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'ReadexPro-Regular',
                color: '#30475e',
              }}>
              {transactionFee?.charge}
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
                fontFamily: 'ReadexPro-Regular',
                color: '#30475e',
              }}>
              Total
            </Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: 16,
                fontFamily: 'ReadexPro-Regular',
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
        </ScrollView>
        {invoiceModal && (
          <UssdStatus
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

            const payload = {
              order_items: JSON.stringify(orderItems),
              order_outlet: user?.outlet,
              delivery_type: (delivery && delivery.value) || '',
              delivery_charge_ref: (delivery && delivery.chargeType) || '',
              delivery_location: (delivery && delivery.delivery_location) || '',
              delivery_gps:
                (delivery &&
                  delivery.delivery_gps &&
                  delivery.delivery_gps.location &&
                  delivery.delivery_gps.location.lat +
                    ',' +
                    delivery.delivery_gps.location.lng) ||
                '',
              delivery_id:
                delivery &&
                (delivery.delivery_config === 'MERCHANT' ||
                  delivery.delivery_config === 'MERCHANT-DIST')
                  ? delivery.delivery_id
                  : user.outlet,
              delivery_name: (customerPayment && customerPayment.name) || '',
              delivery_contact: account,
              delivery_email: (customerPayment && customerPayment.email) || '',
              delivery_notes:
                user &&
                user.user_permissions &&
                user.user_permissions.includes('ADDORDERDLVRDATE')
                  ? deliveryDueDate &&
                    deliveryDueDate.toString() &&
                    deliveryDueDate.toString().length > 0
                    ? moment(deliveryDueDate).format('YYYY-MM-DD')
                    : ''
                  : deliveryNote,
              delivery_charge: delivery.price,
              service_charge: data && data.data && data.data.charge,
              order_coupon:
                (discountPayload && discountPayload.discountCode) || '',
              order_discount_code:
                (discountPayload && discountPayload.discountCode) || '',
              order_discount:
                (discountPayload && discountPayload.discount) || 0,
              order_amount: orderAmount,
              // total + (data && data.data && data.data.charge && data.data.charge),
              total_amount: data && data.data && data.data.total,
              // +
              // ((delivery && delivery.price) || 0),

              // total + (data && data.data && data.data.charge && data.data.charge),
              payment_type: 'OFFUSSD',
              payment_network: 'OFFUSSD',
              merchant: user.merchant,
              source: channel,
              notify_source: 'Digistore Business',
              mod_by: user.login,
              payment_number: (customerPayment && customerPayment.phone) || '',
              order_notes: orderNotes,
              // order_taxes: (addTaxes && JSON.stringify(orderTaxes)) || '',
              order_date:
                orderDate?.toString()?.length > 0
                  ? moment(orderDate?.setTime(Date.now())).format(
                      'YYYY-MM-DD H:mm:ss',
                    )
                  : pay_date,
              mod_date:
                orderDate && orderDate.toString().length > 0
                  ? moment(orderDate).format('DD-MM-YYYY')
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
            : 'Confirm Payment'}
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
export default UssdOffline;
