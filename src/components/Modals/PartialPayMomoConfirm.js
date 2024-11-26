/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import { useReceiveQuickPayment } from '../../hooks/useReceiveQuickPayment';
import ModalCancel from '../ModalCancel';
import Modal from '../Modal';

import PrimaryButton from '../PrimaryButton';
import moment from 'moment';
import { useQueryClient } from 'react-query';
import _ from 'lodash';

// const mapPaymentToChannel = {
//   vodafone: 'VODAC',
//   mtn: 'MTNMM',
//   airtelTigo: 'TIGOC',
//   card: 'VISAG',
//   cash: 'CASH',
// };

export const PaymentReviewItem = ({ name, amount }) => {
  return (
    <View style={styles.paymentReviewItem}>
      <Text style={styles.paymentReviewItemName}>{name}</Text>
      <Text style={styles.paymentReviewItemAmount}>GHS {amount}</Text>
    </View>
  );
};

const PartialPayMomoConfirm = ({
  cashConfirmed,
  toggleCashConfirmed,
  amount,
  navigation,
  payment,
  receiptNumber,
  paymentType,
  patPaymentNumber,
  togglePaymentDone,
  otp,
}) => {
  const { user } = useSelector(state => state.auth);
  const { setInvoice } = useActionCreator();
  const next = React.useRef(false);

  const {
    subTotal: orderSubTotal,
    cart,
    delivery,
    // customerPayment,
    totalAmount,
    discountPayload,
    orderDate,
    addTaxes,
    orderCheckoutTaxes,
    deliveryNote,
    deliveryDueDate,
    orderNotes,
    customer,
  } = useSelector(state => state.sale);
  const { quickSaleInAction, description, channel } = useSelector(
    state => state.quickSale,
  );
  const client = useQueryClient();
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

  // let payment_type;

  const orderAmount = (cart || []).reduce((prev, curr) => {
    if (curr) {
      return prev + curr.quantity * curr.amount;
    }
    return prev;
  }, 0);

  // const grandTotal =
  //   orderAmount +
  //   ((delivery && delivery.price) || 0) -
  //   ((discountPayload && discountPayload.discount) || 0);

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
      order_item_removables: [],
      order_item_extras: [],
    };
  });
  const orderTaxes_ = {};
  (orderCheckoutTaxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  return (
    <Modal
      modalState={cashConfirmed}
      changeModalState={toggleCashConfirmed}
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
          handlePress={() => toggleCashConfirmed(false)}
        />
        <Text
          style={{
            fontFamily: 'ReadexPro-Regular',
            fontSize: 15,
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 8,
          }}>
          PAYMENT SUMMARY
        </Text>
        <PaymentReviewItem
          name="Amount due"
          amount={
            quickSaleInAction
              ? Number(orderSubTotal).toFixed(2)
              : Number(totalAmount).toFixed(2)
          }
        />
        <PaymentReviewItem
          name="Amount received"
          amount={Number(amount).toFixed(2)}
        />
        <PaymentReviewItem
          name="Payment due"
          amount={(
            Number(quickSaleInAction ? orderSubTotal : totalAmount) -
            Number(amount)
          ).toFixed(2)}
        />
        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            let pay_date = moment().format('YYYY-MM-DD H:mm:ss');
            const orderDate_ = new Date(
              ((orderDate && orderDate.toString()) || '').slice(0, 10),
            );
            orderDate_.setTime(Date.now());
            const payload = quickSaleInAction
              ? {
                  vendor: user.user_merchant_receivable,
                  email: (customer && customer.customer_email) || '',
                  phone: (customer && customer.customer_phone) || '',
                  mobilenumber: (customer && customer.customer_phone) || '',
                  description,
                  amount,
                  quantity: 1,
                  channel: payment,
                  notify_source: 'Digistore Business',
                  notify_device: 'Digistore Business',
                  name: (customer && customer.customer_name) || '',
                  mod_by: user.login,
                  pay_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('YYYY-mm-dd HH:mm:ss')
                      : pay_date,
                  mod_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                }
              : {
                  customer: customer?.customer_id,
                  order_items: JSON.stringify(orderItems),
                  order_outlet,
                  // order_taxes: JSON.stringify(orderTaxes),
                  delivery_id:
                    delivery &&
                    (delivery.delivery_config === 'MERCHANT' ||
                      delivery.delivery_config === 'MERCHANT-DIST')
                      ? delivery.delivery_id
                      : user.outlet,
                  delivery_type: (delivery && delivery.value) || '',
                  delivery_charge_ref: (delivery && delivery.chargeType) || '',
                  delivery_location:
                    (delivery && delivery.delivery_location) || '',
                  delivery_gps:
                    (delivery &&
                      delivery.delivery &&
                      delivery.delivery.location &&
                      delivery.delivery.location.lng +
                        ',' +
                        delivery.delivery.location.lat) ||
                    '',
                  delivery_name: (customer && customer.customer_name) || '',
                  delivery_contact: (customer && customer.customer_phone) || '',
                  delivery_email: (customer && customer.customer_email) || '',
                  delivery_charge: (delivery && delivery.price) || 0,
                  delivery_notes:
                    user &&
                    user.user_permissions &&
                    user.user_permissions.includes('ADDORDERDLVRDATE')
                      ? deliveryDueDate?.toString()?.length > 0
                        ? moment(deliveryDueDate).format('YYYY-MM-DD')
                        : ''
                      : deliveryNote,
                  service_charge: 0,
                  order_coupon:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount_code:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount:
                    (discountPayload && discountPayload.discount) || 0,
                  order_amount: orderAmount,
                  order_notes: orderNotes,
                  total_amount: totalAmount,
                  payment_type: 'PARTIALPAY',
                  payment_network: paymentType?.value,
                  partial_amount: amount,
                  merchant: user.merchant,
                  source: channel,
                  notify_source: 'Digistore Business',
                  mod_by: user.login,
                  payment_number: patPaymentNumber,
                  order_date:
                    orderDate?.toString()?.length > 0
                      ? moment(orderDate?.setTime(Date.now())).format(
                          'YYYY-MM-DD H:mm:ss',
                        )
                      : pay_date,
                  mod_date:
                    orderDate_ && orderDate_.toString().length > 0
                      ? moment(orderDate_).format('DD-MM-YYYY')
                      : pay_date,
                  payment_receipt: receiptNumber,
                  otp,
                };

            if (!quickSaleInAction && !_.isEmpty(orderTaxes_) && addTaxes) {
              // eslint-disable-next-line dot-notation
              payload['order_taxes'] = JSON.stringify(orderTaxes_);
            }
            toggleCashConfirmed(false);
            next.current = true;
            if (quickSaleInAction) {
              receiveQuickPaymentMutation.mutate(payload);
            } else {
              mutation.mutate(payload);
            }
          }}>
          Confirm Payment
        </PrimaryButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    width: '100%',
    alignItems: 'center',
    marginTop: 42,
  },
  choose: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#30475E',
  },
  amount: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 38,
    marginVertical: 12,
    color: '#30475E',
  },
  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },
  group1: {
    flexDirection: 'row',
  },
  group2: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  textInput: {
    borderColor: 'rgba(96, 126, 170, 0.4)',
    borderWidth: 0.4,
    width: '100%',
    paddingHorizontal: 12,
    borderRadius: 2,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#30475E',
  },
  textInputWrapper: {
    width: '100%',
    paddingRight: 38,
  },
  option1Text: {
    color: 'rgba(48, 71, 94, 0.9)',
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
  },
  customerName: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  customerNumber: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
  },
  paymentReviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginHorizontal: 14,
    marginTop: 10,
  },
  paymentReviewItemName: {
    fontFamily: 'ReadexPro-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 16,
  },
  paymentReviewItemAmount: {
    fontFamily: 'ReadexPro-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 16,
    marginLeft: 'auto',
  },
  margin: {
    marginTop: 18,
    borderTopColor: 'solid rgba(146, 169, 189, 0.4)',
    borderTopWidth: 0.4,
    marginBottom: 6,
  },
  primary: { marginTop: 28 },
  container: {
    justifyContent: 'space-between',
  },
  paymentLabel: { width: '100%', alignItems: 'center' },
  paymentReceivedLabel: { width: '100%', alignItems: 'center', paddingTop: 40 },
  paymentReceivedText: {
    color: '#30475E',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    marginTop: 18,
  },
  goToReceipt: {
    flexDirection: 'row',
    marginTop: 70,
    alignItems: 'center',
  },
  goToReceiptText: {
    color: '#1942D8',
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'JetBrainsMono-Regular',
    letterSpacing: -0.2,
  },
  totalAmount: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 22,
    marginTop: 14,
    color: '#30475E',
  },
  invoice: {
    color: '#30475E',
    textAlign: 'center',
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});

export default PartialPayMomoConfirm;
