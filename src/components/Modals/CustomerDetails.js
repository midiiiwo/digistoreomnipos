/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useGetTransactionFee } from '../../hooks/useGetTransactionFee';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import { useReceiveQuickPayment } from '../../hooks/useReceiveQuickPayment';
import Modal from '../Modal';

import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import LoadingModal from '../LoadingModal';
import moment from 'moment';
import { useLookupAccount } from '../../hooks/useLookupAccount';
import { useQueryClient } from 'react-query';
import _ from 'lodash';

const mapChannelToName = {
  VODAC: 'vodafone',
  MTNMM: 'mtn',
  TIGOC: 'airtelTigo',
  VISAG: 'card',
  CASH: 'cash',
};

export const PaymentReviewItem = ({ name, amount, showCurrency = true }) => {
  return (
    <View style={styles.paymentReviewItem}>
      <Text style={styles.paymentReviewItemName}>{name}</Text>
      <Text style={styles.paymentReviewItemAmount}>
        {showCurrency ? 'GHS' : ''} {amount}
      </Text>
    </View>
  );
};

const CustomerDetailsModal = ({
  paymentPreview,
  subTotal,
  total,
  payment,
  togglePaymentPreview,
  togglePaymentDone,
  navigation,
  customerDetails,
  otp,
}) => {
  const { user } = useSelector(state => state.auth);
  const {
    quickSaleInAction,
    description,
    channel,
    // subTotal: quickSaleSubTotal,
  } = useSelector(state => state.quickSale);
  // const [transactionFee, setTransactionFee] = React.useState(0);

  const { setInvoice, setPaymentChannel } = useActionCreator();
  const client = useQueryClient();
  const next = React.useRef(false);

  // React.useEffect(() => {
  //   if (data) {
  //     setTransactionFee(totdata && data.data && data.data.charge))
  //   }
  // }, [data, setTransactionFee, total]);

  React.useEffect(() => {
    setPaymentChannel(payment);
  }, [payment, setPaymentChannel]);

  // const { data, isLoading, isFetching } = useGetTransactionFee(
  //   mapPaymentToChannel[payment],
  //   amount,
  //   user.merchant,
  // );

  // console.log('datatatatatata', data && data.data);
  const {
    cart,
    delivery,
    customerPayment,
    orderNotes,
    discountPayload,
    addTaxes,
    orderDate,
    orderCheckoutTaxes,
    deliveryNote,
    deliveryDueDate,
  } = useSelector(state => state.sale);

  console.log('apppp', addTaxes);

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
  const { data, isLoading, isFetching } = useGetTransactionFee(
    payment,
    total,
    user.merchant,
    customerDetails,
  );
  const orderAmount = (cart || []).reduce((prev, curr) => {
    if (curr) {
      return prev + curr.quantity * curr.amount;
    }
    return prev;
  }, 0);
  console.log('cccc', orderAmount);
  const {
    data: lookup,
    isLookupLoading,
    isFetching: isLookupFetching,
    // isError,
    // error,
  } = useLookupAccount(
    mapChannelToName[payment],
    (customerPayment && customerPayment.phone) || '',
    customerDetails,
  );
  // if (isError) {
  //   console.log('hterererereriissss', error.message);
  //   toast.show(error.message);
  // }

  // React.useEffect(() => {
  //   if (data && data.data && data.data.charge) {
  //     setCharge(data.data.charge);
  //   }
  // }, [data, setCharge]);

  let payment_type;
  switch (payment) {
    case 'cash':
      payment_type = 'CASH';
      break;
    case 'VISAG':
      payment_type = 'CARD';
      break;
    default:
      payment_type = 'MOMO';
  }

  const mod_date = moment().format('YYYY-MM-DD H:mm:ss');
  let pay_date = moment().format('YYYY-MM-DD H:mm:ss');

  const orderItems = {};
  // const orderTaxes = {};
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

  const orderTaxes_ = {};
  (orderCheckoutTaxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });
  // taxData &&
  //   taxData.data &&
  //   taxData.data.data &&
  //   taxData.data.data.map((item, idx) => {
  //     orderTaxes[idx] = {
  //       tax_no: item.tax_id,
  //       tax_value:
  //         item.tax_value * (orderAmount + ((delivery && delivery.price) || 0)),
  //     };
  //   });

  console.log('llili', payment);

  return (
    <Modal
      modalState={paymentPreview}
      changeModalState={togglePaymentPreview}
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
          // newSale={payment === 'VISAG'}
          handlePress={() => togglePaymentPreview(false)}
        />
        {!isLoading && !isFetching && !isLookupFetching && !isLookupLoading && (
          <View style={styles.details}>
            <View style={styles.nameWrapper}>
              {lookup &&
                lookup.data &&
                (lookup.data.name || lookup.data.message) && (
                  <>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Regular',
                        fontSize: 13.2,
                        color: '#5C6E91',
                        marginBottom: 6,
                      }}>
                      MOMO ACCOUNT NAME
                    </Text>
                    <Text style={[styles.name, { textAlign: 'center' }]}>
                      {lookup &&
                        lookup.data &&
                        ((lookup.data.name && lookup.data.name.toUpperCase()) ||
                          (lookup.data.message &&
                            lookup.data.message.toUpperCase()))}
                    </Text>
                  </>
                )}
            </View>
            <PaymentReviewItem
              name="Purchase Total"
              amount={new Intl.NumberFormat().format(
                Number((data && data.data && data.data.amount) || 0).toFixed(2),
              )}
            />
            <PaymentReviewItem
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
            />
          </View>
        )}

        {(isLoading || isFetching || isLookupLoading || isLookupFetching) && (
          <LoadingModal />
        )}

        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            togglePaymentPreview(false);
            const payload = quickSaleInAction
              ? {
                  vendor: user.user_merchant_receivable,
                  email: (customerPayment && customerPayment.email) || '',
                  phone: (customerPayment && customerPayment.phone) || '',
                  mobilenumber:
                    (customerPayment && customerPayment.phone) || '',
                  description,
                  amount: (data && data.data && data.data.total) || 0,
                  quantity: 1,
                  channel: payment,
                  notify_source: 'Digistore Business',
                  notify_device: 'Digistore Business',
                  name: customerPayment && customerPayment.name,
                  mod_by: user.login,
                  pay_date: moment().format('YYYY-mm-dd HH:MM:SS'),
                  mod_date,
                  otp,
                }
              : {
                  order_items: JSON.stringify(orderItems),
                  order_outlet,
                  delivery_type: (delivery && delivery.value) || '',
                  delivery_charge_ref: (delivery && delivery.chargeType) || '',
                  delivery_location:
                    (delivery && delivery.delivery_location) || '',
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
                  delivery_name:
                    (customerPayment && customerPayment.name) || '',
                  delivery_contact:
                    (customerPayment && customerPayment.phone) || '',
                  delivery_email:
                    (customerPayment && customerPayment.email) || '',
                  delivery_charge: delivery.price,
                  service_charge: data && data.data && data.data.charge,
                  order_coupon:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount_code:
                    (discountPayload && discountPayload.discountCode) || '',
                  order_discount:
                    (discountPayload && discountPayload.discount) || 0,
                  order_amount: orderAmount,
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
                  // total + (data && data.data && data.data.charge && data.data.charge),
                  total_amount: data && data.data && data.data.total,
                  // +
                  // ((delivery && delivery.price) || 0),

                  // total + (data && data.data && data.data.charge && data.data.charge),
                  payment_type,
                  payment_network: payment,
                  merchant: user.merchant,
                  source: channel,
                  notify_source: 'Digistore Business',
                  mod_by: user.login,
                  payment_number:
                    (customerPayment && customerPayment.phone) || '',
                  order_notes: orderNotes,
                  // order_taxes: (addTaxes && JSON.stringify(orderTaxes)) || '',
                  order_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('YYYY-MM-DD H:mm:ss')
                      : pay_date,
                  mod_date:
                    orderDate && orderDate.toString().length > 0
                      ? moment(orderDate).format('DD-MM-YYYY')
                      : pay_date,
                  otp,
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
            next.current = true;
            // setNext(true);
          }}>
          Confirm Purchase
        </PrimaryButton>
      </View>
    </Modal>
  );
};

export default CustomerDetailsModal;

const styles = StyleSheet.create({
  modalView: {
    width: '50%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
  },
  details: {
    marginHorizontal: 14,
  },
  margin: {
    marginTop: 18,
    // borderTopColor: 'solid rgba(146, 169, 189, 0.4)',
    // borderTopWidth: 0.4,
    marginBottom: 6,
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
  paymentReviewItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingHorizontal: 10,
  },
  paymentReviewItemName: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15,
  },
  paymentReviewItemAmount: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15,
    marginLeft: 'auto',
  },
});
