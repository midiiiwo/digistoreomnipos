/* eslint-disable react-native/no-inline-styles */
import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PaymentReviewItem } from './CustomerDetails';
import { useSelector } from 'react-redux';
import ModalCancel from '../ModalCancel';
import { useNavigation } from '@react-navigation/native';
import LoadingModal from '../LoadingModal';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import { useQueryClient } from 'react-query';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useReceiveQuickPayment } from '../../hooks/useReceiveQuickPayment';
import { useGetApplicableTaxes } from '../../hooks/useGetApplicableTaxes';
import moment from 'moment';
import _ from 'lodash';

const StoreCredit = ({
  storeCreditVisible,
  toggleStoreCredit,
  subTotal,
  total,
  togglePaymentDone,
}) => {
  const { customer } = useSelector(state => state.sale);
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const client = useQueryClient();
  const { setInvoice } = useActionCreator();
  const amount = (quickSaleInAction ? subTotal : total) || 0;
  const creditCanApply =
    Number((customer && customer.customer_credit_limit) || 0) - Number(amount) >
    0;

  const next = React.useRef(false);
  const {
    cart,
    delivery,
    orderNotes,
    // subTotal: orderSubTotal,
    discountPayload,
    addTaxes,
    orderDate,
    deliveryNote,
    deliveryDueDate,
  } = useSelector(state => state.sale);

  const {
    quickSaleInAction,
    description,
    channel,
    // subTotal: quickSaleSubTotal,
  } = useSelector(state => state.quickSale);

  const order_outlet = user.outlet;
  const mutation = useRaiseOrder(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    setInvoice(i);
  });
  const receiveQuickPaymentMutation = useReceiveQuickPayment(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    setInvoice(i);
  });
  let pay_date = moment().format('YYYY-MM-DD H:mm:ss');
  // const { data, isLoading, isFetching } = useGetTransactionFee(
  //   payment,
  //   quickSaleInAction ? subTotal : total,
  //   user.merchant,
  //   customerDetails,
  // );
  // const {
  //   data: lookup,
  //   isLookupLoading,
  //   isFetching: isLookupFetching,
  //   // isError,
  //   // error,
  // } = useLookupAccount(
  //   mapChannelToName[payment],
  //   (customerPayment && customerPayment.phone) || '',
  //   customerDetails,
  // );
  // if (isError) {
  //   console.log('hterererereriissss', error.message);
  //   toast.show(error.message);
  // }

  // console.log('islllllllll', payment);

  // React.useEffect(() => {
  //   if (data && data.data && data.data.charge) {
  //     setCharge(data.data.charge);
  //   }
  // }, [data, setCharge]);

  const { data: taxData } = useGetApplicableTaxes(user.merchant);

  const orderItems = {};
  const orderTaxes = {};
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
  taxData &&
    taxData.data &&
    taxData.data.data &&
    taxData.data.data.map((item, idx) => {
      orderTaxes[idx] = {
        tax_no: item.tax_id,
        tax_value: item.tax_value,
      };
    });

  return (
    <Modal
      modalState={storeCreditVisible}
      changeModalState={toggleStoreCredit}
      onModalHide={() => {
        if (next.current) {
          togglePaymentDone(true);
          // setNext(false);
          next.current = false;
        }
      }}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleStoreCredit(false)}
        />
        <View style={styles.nameWrapper}>
          {/* <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 13.2,
              color: '#5C6E91',
              marginBottom: 6,
            }}>
            CUSTOMER NAME
          </Text> */}
          <Text style={[styles.name, { textAlign: 'center' }]}>
            {((customer && customer.customer_name) || '').toUpperCase()}
          </Text>
          <Text
            style={[
              styles.name,
              { textAlign: 'center', fontSize: 14.5, marginTop: 4 },
            ]}>
            {(customer && customer.customer_phone) || ''}
          </Text>
        </View>
        <View style={styles.details}>
          <PaymentReviewItem
            name="Customer Credits"
            amount={new Intl.NumberFormat().format(
              Number((customer && customer.customer_credit_limit) || 0).toFixed(
                2,
              ),
            )}
          />
          <PaymentReviewItem
            name="Purchase Total"
            amount={new Intl.NumberFormat().format(Number(amount).toFixed(2))}
          />
          <PaymentReviewItem
            name="New Customer Credit"
            amount={new Intl.NumberFormat().format(
              (
                Number(customer && customer.customer_credit_limit) -
                Number(amount)
              ).toFixed(2),
            )}
          />
          {/* <PaymentReviewItem
            name="Processing fee"
            amount={new Intl.NumberFormat().format(
              Number((data && data.data && data.data.charge) || 0).toFixed(2),
            )}
          />
          <View style={styles.margin} />
          <PaymentReviewItem
            name="Total"
            amount={new Intl.NumberFormat().format(
              Number((data && data.data && data.data.total) || 0).toFixed(2),
            )}
          /> */}
        </View>
        {/* )}
        {(isLoading || isFetching || isLookupLoading || isLookupFetching) && (
          <LoadingModal />
        )} */}
        {!creditCanApply && (
          <Text
            style={[
              styles.name,
              {
                textAlign: 'center',
                fontSize: 14.5,
                marginTop: 4,
                color: '#DF2E38',
              },
            ]}>
            Inadequate store credit
          </Text>
        )}
        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            const mod_date = moment().format('YYYY-MM-DD H:mm:ss');
            const payload = quickSaleInAction
              ? {
                  vendor: user.user_merchant_receivable,
                  email: (customer && customer.customer_email) || '',
                  phone: (customer && customer.customer_phone) || '',
                  mobilenumber: (customer && customer.customer_phone) || '',
                  description,
                  amount: amount || 0,
                  quantity: 1,
                  channel: 'CREDIT',
                  notify_source:
                    Platform.OS === 'android' ? 'ANDROID POS V2' : 'IOS V2',
                  notify_device:
                    Platform.OS === 'android' ? 'ANDROID POS V2' : 'IOS V2',
                  name: (customer && customer.customer_name) || '',
                  mod_by: user.login,
                  pay_date: moment().format('YYYY-mm-dd HH:MM:SS'),
                  mod_date,
                }
              : {
                  order_items: JSON.stringify(orderItems),
                  order_outlet,
                  delivery_type: (delivery && delivery.value) || '',
                  delivery_location:
                    (delivery && delivery.delivery_location) || '',
                  delivery_gps: (delivery && delivery.delivery_gps) || '',
                  delivery_id: (delivery && delivery.delivery_id) || '',
                  delivery_charge: (delivery && delivery.price) || 0,
                  delivery_name: (customer && customer.customer_name) || '',
                  delivery_contact: (customer && customer.customer_phone) || '',
                  delivery_email: (customer && customer.customer_email) || '',

                  service_charge: 0,
                  order_coupon:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount_code:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount:
                    (discountPayload && discountPayload.discount) || 0,
                  order_amount: amount - ((delivery && delivery.price) || 0),
                  // total + (data && data.data && data.data.charge && data.data.charge),
                  total_amount: amount - (delivery && delivery.price) || 0,

                  // total + (data && data.data && data.data.charge && data.data.charge),
                  payment_type: 'STORECREDIT',
                  payment_network: 'CREDIT',
                  merchant: user.merchant,
                  source: channel,
                  notify_source:
                    Platform.OS === 'android' ? 'ANDROID POS V2' : 'IOS V2',
                  mod_by: (customer && customer.customer_phone) || '',
                  payment_number: (customer && customer.customer_phone) || '',
                  order_notes: orderNotes,
                  // order_taxes: (addTaxes && JSON.stringify(orderTaxes)) || '',
                  customer: (customer && customer.customer_id) || '',
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
                  payment_due_date: moment().format('YYYY-MM-DD'),
                  order_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('YYYY-MM-DD H:mm:ss')
                      : pay_date,
                  mod_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                };
            if (!quickSaleInAction && !_.isEmpty(orderTaxes) && addTaxes) {
              // eslint-disable-next-line dot-notation
              payload['order_taxes'] = JSON.stringify(orderTaxes);
            }
            _;
            toggleStoreCredit(false);
            if (quickSaleInAction) {
              receiveQuickPaymentMutation.mutate(payload);
            } else {
              mutation.mutate(payload);
            }
            next.current = true;
          }}
          disabled={!creditCanApply}>
          Confirm Purchase
        </PrimaryButton>
      </View>
    </Modal>
  );
};

PrimaryButton;

export default StoreCredit;

const styles = StyleSheet.create({
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
  },
  modalView: {
    width: '56%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 18,
    color: '#6096B4',
  },
  nameWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 16,
  },
  details: {
    marginHorizontal: 10,
  },
});
