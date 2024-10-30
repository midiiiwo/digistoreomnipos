/* eslint-disable react-native/no-inline-styles */
import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PaymentReviewItem } from './CustomerDetails';
import { useSelector } from 'react-redux';
import ModalCancel from '../ModalCancel';
import { useNavigation } from '@react-navigation/native';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import { useQueryClient } from 'react-query';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useReceiveQuickPayment } from '../../hooks/useReceiveQuickPayment';
import { useGetApplicableTaxes } from '../../hooks/useGetApplicableTaxes';
import moment from 'moment';
import _ from 'lodash';
import { useToast } from 'react-native-toast-notifications';

const PayLater = ({
  payLaterVisible,
  togglePayLater,
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
  // const creditCanApply =
  //   Number((customer && customer.customer_credit_limit) || 0) - Number(amount) >
  //   0;

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
  let pay_date = moment().format('YYYY-MM-DD H:mm:ss');

  console.log('ordddddd', orderDate);

  const order_outlet = user.outlet;
  const mutation = useRaiseOrder(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    client.invalidateQueries('merchant-customers');
    setInvoice(i);
  });
  const receiveQuickPaymentMutation = useReceiveQuickPayment(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    setInvoice(i);
  });

  const { data: taxData } = useGetApplicableTaxes(user.merchant);

  const toast = useToast();

  const orderItems = {};
  const orderTaxes = {};
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

  taxData?.data?.data?.map((item, idx) => {
    orderTaxes[idx] = {
      tax_no: item.tax_id,
      tax_value: Number(
        (
          item.tax_value *
          (orderAmount - (discountPayload?.discount || 0))
        ).toFixed(2),
      ),
    };
  });

  return (
    <Modal
      modalState={payLaterVisible}
      changeModalState={togglePayLater}
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
          handlePress={() => togglePayLater(false)}
        />
        <View style={styles.nameWrapper}>
          <Text style={[styles.name, { textAlign: 'center' }]}>
            {(customer?.customer_name || '').toUpperCase()}
          </Text>
          <Text
            style={[
              styles.name,
              { textAlign: 'center', fontSize: 14.5, marginTop: 4 },
            ]}>
            {customer?.customer_phone || ''}
          </Text>
        </View>
        <View style={styles.details}>
          <PaymentReviewItem
            name="Customer Balance"
            amount={new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(customer?.customer_credit_limit || 0).toFixed(2))}
          />
          <PaymentReviewItem
            name="Purchase Total"
            amount={new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(amount).toFixed(2))}
          />
          <PaymentReviewItem
            name="New Customer Balance."
            amount={new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(
              (
                Number(customer?.customer_credit_limit) - Number(amount)
              ).toFixed(2),
            )}
          />
        </View>

        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            if (Number(customer?.customer_credit_limit) >= Number(amount)) {
              toast.show(
                'Customer has credits in the account. Try using their credits to pay.',
                { placement: 'top', duration: 5000 },
              );
              return;
            }
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
                  channel: 'UNKNOWN',
                  notify_source: 'Digistore Business',
                  notify_device: 'Digistore Business',
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
                  order_amount: orderAmount,
                  // total + (data && data.data && data.data.charge && data.data.charge),
                  total_amount: amount,

                  // total + (data && data.data && data.data.charge && data.data.charge),
                  payment_type: 'PAYLATER',
                  payment_network: 'DEBITBAL',
                  merchant: user.merchant,
                  source: channel,
                  notify_source: 'Digistore Business',
                  mod_by: user.login,
                  payment_number: (customer && customer.customer_phone) || '',
                  order_notes: orderNotes,
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
                  // order_taxes: (addTaxes && JSON.stringify(orderTaxes)) || '',
                  customer: (customer && customer.customer_id) || '',
                  order_date:
                    orderDate?.toString()?.length > 0
                      ? moment(orderDate?.setTime(Date.now())).format(
                          'YYYY-MM-DD H:mm:ss',
                        )
                      : pay_date,
                  mod_date:
                    orderDate?.toString()?.length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                };
            if (!quickSaleInAction && !_.isEmpty(orderTaxes) && addTaxes) {
              // eslint-disable-next-line dot-notation
              payload['order_taxes'] = JSON.stringify(orderTaxes);
            }

            togglePayLater(false);
            if (quickSaleInAction) {
              receiveQuickPaymentMutation.mutate(payload);
            } else {
              mutation.mutate(payload);
            }
            next.current = true;
          }}>
          Confirm Purchase
        </PrimaryButton>
      </View>
    </Modal>
  );
};

export default PayLater;

const styles = StyleSheet.create({
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
  },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontFamily: 'ReadexPro-Regular',
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
