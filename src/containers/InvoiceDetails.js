/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
// import { captureRef } from 'react-native-view-shot';
// import Share from 'react-native-share';
// import { useToast } from 'react-native-toast-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetSelectedOrderDetails } from '../hooks/useGetSelectedOrderDetails';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useGetOrderItemList } from '../hooks/useGetOrderItemList';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AddBalanceInstructions from '../components/Modals/AddBalanceInstructions';
import AddBalanceStatus from '../components/Modals/AddBalanceStatus';
import { SheetManager } from 'react-native-actions-sheet';

import { useMutation, useQueryClient } from 'react-query';
import { updateEstimate } from '../api/invoices';
import { useToast } from 'react-native-toast-notifications';
import { useRaiseOrder } from '../hooks/useRaiseOrder';
import InvoicePaymentStatus from '../components/Modals/InvoicePaymentStatus';
import _ from 'lodash';
import { useVoidOrder } from '../hooks/useVoidOrder';

function useUpdateEstimate(handleSuccess) {
  const queryResult = useMutation(
    ['update-estimate'],
    payload => {
      try {
        return updateEstimate(payload);
      } catch (error) { }
    },
    {
      onSuccess(data) {
        handleSuccess(data?.data);
      },
    },
  );
  return queryResult;
}

function InvoiceDetails(props) {
  const { item, isEstimate, estimateData, recordNumber } = props.route?.params;

  const ref = React.useRef();

  const {
    BILL_AMOUNT,
    CUSTOMER_EMAIL,
    CUSTOMER_NAME,
    CUSTOMER_CONTACTNO,
    PAYMENT_DUE_DATE,
    // PAYMENT_INVOICE,
    // TRANSACTION_ID,
    // MOD_BY,
    TRANSACTION_DATE,
    // PAYMENT_DESCRIPTION,
    PAYMENT_STATUS,
    external_invoice,
    order_no,
    estimateOrderItemList,
  } = item || {};

  console.log('lllll', recordNumber);

  const currentDate = moment(new Date());
  const dueDate = moment(item.PAYMENT_DUE_DATE);

  const [$invoice, $setInvoice] = React.useState();
  const [balanceInstructions, setBalanceInstructions] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const toast = useToast();
  const [status, setStatus] = React.useState();

  const client = useQueryClient();
  const [invoiceModal, setInvoiceModal] = React.useState(false);

  const raiseOrder = useRaiseOrder(i => {
    client.invalidateQueries('summary-filter');
    client.invalidateQueries('all-orders');
    client.invalidateQueries('invoice-history');
    setStatus(i);
  });

  const orderTaxes_ = {};
  (estimateData?.taxes || []).forEach((taxItem, idx) => {
    if (taxItem) {
      orderTaxes_[idx] = {
        tax_no: taxItem.taxId,
        tax_value: taxItem.amount,
      };
    }
  });

  const $approveEstimate = useUpdateEstimate(res => {
    if (res) {
      toast.show(res?.message, { placement: 'top' });
      if (res?.status == 0) {
        navigation.navigate('Invoices');
      }
    }
  });

  const $cancelEstimate = useUpdateEstimate(res => {
    if (res) {
      toast.show(res?.message, { placement: 'top' });
      if (res?.status == 0) {
        navigation.navigate('Invoices');
      }
    }
  });

  const voidOrder = useVoidOrder(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      client.invalidateQueries('selected-order');
    }
  });

  React.useEffect(() => {
    if (status) {
      setInvoiceModal(true);
    }
  }, [status, setStatus]);

  const { user } = useSelector(state => state.auth);
  const isKitchenStaff = user.user_permissions.includes('BCKRMORDER');

  const { data, isLoading, isRefetching, refetch } = useGetSelectedOrderDetails(
    user.merchant,
    order_no,
  );

  const navigation = useNavigation();

  const { data: itemList, isLoading: isListLoading } = useGetOrderItemList(
    user.merchant,
    order_no,
    !isKitchenStaff,
  );

  const { data: merchantDetails_, isLoading: merchantLoading } =
    useGetMerchantDetails(user.merchant);

  if (isLoading || isListLoading || merchantLoading) {
    <Loading />;
  }

  const $estimateOrderItemList = estimateOrderItemList?.map(i => ({
    order_item: i?.itemName,
    order_item_amount: i?.amount,
    order_item_qty: i?.quantity,
  }));

  const merchantDetails = merchantDetails_?.data?.data || {};

  const orderItems = itemList?.data?.data || $estimateOrderItemList || [];

  const orderDetails = data?.data?.data || {};

  const isInvoicePaid =
    orderDetails.order_status === 'PAID' ||
    orderDetails.order_status === 'COMPLETED';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: top }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        style={styles.main}
        contentContainerStyle={{ paddingBottom: 14 + bottom }}>
        <View style={[styles.summary]} ref={ref}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor:
                isEstimate && PAYMENT_STATUS === 'DRAFT'
                  ? '#ddd'
                  : isEstimate &&
                    PAYMENT_STATUS === 'COMPLETED' &&
                    !isInvoicePaid
                    ? '#eee'
                    : isInvoicePaid
                      ? 'rgba(135, 196, 201, 0.2)'
                      : dueDate.diff(currentDate, 'days') < 0
                        ? 'rgba(238, 211, 217, 0.2)'
                        : item.PAYMENT_STATUS === 'Pending'
                          ? '#rgba(255, 219, 137, 0.2)'
                          : 'rgba(238, 211, 217, 0.2)',
              paddingVertical: 14,
              paddingHorizontal: 16,
              paddingBottom: 6,
            }}>
            <View style={styles.status}>
              <View style={[styles.statusWrapper]}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        isEstimate && PAYMENT_STATUS === 'DRAFT'
                          ? '#B5C0D0'
                          : isEstimate &&
                            PAYMENT_STATUS === 'COMPLETED' &&
                            !isInvoicePaid
                            ? '#87C4C9'
                            : isInvoicePaid
                              ? '#87C4C9'
                              : dueDate.diff(currentDate, 'days') < 0
                                ? '#D24545'
                                : item.PAYMENT_STATUS === 'Pending'
                                  ? '#FFDB89'
                                  : '#FD8A8A',
                    },
                  ]}
                />
                <Text style={styles.orderStatus}>
                  {isInvoicePaid
                    ? 'Paid'
                    : dueDate.diff(currentDate, 'days') < 0
                      ? 'Overdue'
                      : item.PAYMENT_STATUS}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.summaryLabel,
                { marginTop: 6, marginBottom: 8, fontSize: 14 },
              ]}>
              {isEstimate ? 'ESTIMATE' : 'INVOICE'} {external_invoice} to{' '}
              {CUSTOMER_NAME}
            </Text>
            <Text
              style={[
                styles.summaryLabel,
                {
                  fontSize: 13.5,
                  marginTop: 8,
                  marginBottom: -4,
                  opacity: 0.9,
                  fontFamily: 'ReadexPro-Regular',
                  color:
                    isEstimate && PAYMENT_STATUS === 'DRAFT'
                      ? '#B5C0D0'
                      : isEstimate &&
                        PAYMENT_STATUS === 'COMPLETED' &&
                        !isInvoicePaid
                        ? '#ddd'
                        : isInvoicePaid
                          ? '#408E91'
                          : dueDate.diff(currentDate, 'days') < 0
                            ? '#D24545'
                            : item.PAYMENT_STATUS === 'Pending'
                              ? '#F5A25D'
                              : '#FD8A8A',
                },
              ]}>
              {!isEstimate &&
                ` Due ${moment(PAYMENT_DUE_DATE).format('MMMM DD, YYYY')}`}
            </Text>
            <Text
              style={[
                styles.summaryLabel,
                {
                  fontFamily: 'IBMPlexSans-Bold',
                  fontSize: 22,
                  marginBottom: 10,
                },
              ]}>
              GHS {BILL_AMOUNT}
            </Text>
            <View style={{ alignItems: 'center' }}>
              <Pressable
                style={styles.channelWrapper}
                onPress={() => {
                  if (
                    (dueDate.diff(currentDate, 'days') < 0 &&
                      PAYMENT_STATUS !== 'Successful') ||
                    PAYMENT_STATUS === 'Pending' ||
                    isEstimate
                  ) {
                    navigation.navigate('Invoice Order', {
                      cart: orderItems,
                      data: orderDetails,
                      merchantDetails: merchantDetails,
                      invoiceId: external_invoice,
                      isEstimate,
                      estimateData: {
                        ...estimateData,
                        invoiceId: recordNumber,
                      },
                    });
                  } else {
                    navigation.navigate('Order Receipt', {
                      itemList: orderItems,
                      item: orderDetails,
                    });
                  }
                }}>
                <Text style={styles.channel}>
                  {(dueDate.diff(currentDate, 'days') < 0 &&
                    PAYMENT_STATUS !== 'Successful') ||
                    PAYMENT_STATUS === 'Pending' ||
                    isEstimate
                    ? 'Send Reminder'
                    : 'Send Receipt'}
                </Text>
              </Pressable>
            </View>
            {isEstimate && (
              <View style={{ alignItems: 'center' }}>
                <Pressable
                  style={styles.channelWrapper}
                  onPress={() => {
                    navigation.navigate('Create Invoice', {
                      estimateData,
                      isEstimate,
                      estimateAction: 'update',
                      recordNumber,
                    });
                  }}>
                  <Text style={styles.channel}>Edit Estimate</Text>
                </Pressable>
              </View>
            )}
            {!isEstimate &&
              item.PAYMENT_STATUS === 'Pending' &&
              user?.user_permissions?.includes('VOID_ORDER') && (
                <Pressable
                  style={[styles.channelWrapper, { borderColor: '#F31559' }]}
                  onPress={() =>
                    Alert.alert(
                      'Cancel Invoice',
                      'Are you sure you want to cancel invoice?',
                      [
                        {
                          text: 'NO',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'CANCEL Invoice',
                          onPress: () => {
                            voidOrder.mutate({
                              merchant: user.merchant,
                              no: orderDetails.order_no,
                              mod_by: user.login,
                            });
                          },
                        },
                      ],
                    )
                  }>
                  <Text style={[styles.channel, { color: '#F31559' }]}>
                    {voidOrder.isLoading ? 'Processing' : 'Cancel Invoice'}
                  </Text>
                </Pressable>
              )}
          </View>
          <View style={{ marginVertical: 12 }} />
          <Text
            style={[
              styles.summaryLabel,
              {
                fontFamily: 'IBMPlexSans-Regular',
                marginLeft: 8,
                marginBottom: 10,
                fontSize: 14.5,
              },
            ]}>
            {isEstimate ? 'Estimate' : 'Invoice'} Date:{' '}
            {moment(TRANSACTION_DATE).format('DD MMM, YYYY h:MM A')}
          </Text>
          <View style={styles.summary}>
            <Text
              style={[styles.summaryLabel, { fontFamily: 'ReadexPro-bold' }]}>
              {isEstimate ? 'Estimate' : 'Invoice'} Items
            </Text>
            {!isKitchenStaff &&
              (itemList?.data?.data || $estimateOrderItemList || []).map(i => {
                if (!i) {
                  return;
                }
                return (
                  <View
                    style={[
                      styles.taxMain,
                      { marginHorizontal: 0, paddingHorizontal: 0 },
                    ]}
                    key={i && i.order_item}>
                    <Text
                      style={[
                        styles.taxLabel,
                        {
                          width: '30%',
                          overflow: 'hidden',
                          // backgroundColor: 'red',
                          paddingHorizontal: 0,
                        },
                      ]}>
                      {i?.order_item}
                      {i?.order_item_properties?.length > 0
                        ? ` (${i.order_item_properties
                          .split(',')
                          .map(prop => prop.trim().split(':')[1])
                          .toString()})`
                        : ''}
                    </Text>
                    <Text style={styles.taxAmount}>
                      Qty: {i?.order_item_qty}
                    </Text>
                    {!isKitchenStaff && (
                      <Text style={styles.taxAmount}>
                        GHS{' '}
                        {new Intl.NumberFormat().format(
                          Number(i && i.order_item_amount),
                        )}
                      </Text>
                    )}
                  </View>
                );
              })}
          </View>
          <View style={[styles.summary, { marginTop: 6 }]}>
            <Text
              style={[styles.summaryLabel, { fontFamily: 'ReadexPro-bold' }]}>
              Customer Details
            </Text>
            <View style={styles.taxMain}>
              <Text style={styles.taxLabel}>Customer</Text>
              <Text style={styles.taxAmount}>{CUSTOMER_NAME}</Text>
            </View>

            <View style={styles.taxMain}>
              <Text style={styles.taxLabel}>Email</Text>
              <Text style={styles.taxAmount}>{CUSTOMER_EMAIL}</Text>
            </View>
            <View style={styles.taxMain}>
              <Text style={styles.taxLabel}>Phone</Text>
              <Text style={styles.taxAmount}>{CUSTOMER_CONTACTNO}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {!isInvoicePaid && !isEstimate && (
        <View style={styles.btnWrapper}>
          <PrimaryButton
            style={[styles.btn, { flex: 1, backgroundColor: '#30475e' }]}
            handlePress={() => {
              SheetManager.show('Receive PayLater', {
                payload: {
                  item: {
                    total_amount: item?.BILL_AMOUNT,
                    order_no: item?.order_no,
                    payment_invoice: item?.PAYMENT_INVOICE,
                  },
                  setInvoice: $setInvoice,
                  setBalanceInstructions,
                },
              });
            }}>
            Receive Payment
          </PrimaryButton>
        </View>
      )}
      {isEstimate && PAYMENT_STATUS === 'DRAFT' && (
        <View style={[styles.btnWrapper, { flexDirection: 'row' }]}>
          <PrimaryButton
            style={[styles.btn, { flex: 1, backgroundColor: '#C63C51' }]}
            handlePress={() => {
              $cancelEstimate.mutate({
                draft: recordNumber,
                merchant: user?.merchant,
                status: 'CANCELLED',
                mod_by: user?.login,
              });
            }}>
            {$cancelEstimate.isLoading ? 'Processsing' : 'Cancel'}
          </PrimaryButton>
          <View style={{ marginHorizontal: 4 }} />
          <PrimaryButton
            style={[styles.btn, { flex: 1, backgroundColor: '#219C90' }]}
            handlePress={() => {
              $approveEstimate.mutate({
                draft: recordNumber,
                merchant: user?.merchant,
                status: 'COMPLETED',
                mod_by: user?.login,
              });
            }}>
            {$approveEstimate.isLoading || raiseOrder?.isLoading
              ? 'Processsing'
              : 'Approve'}
          </PrimaryButton>
        </View>
      )}
      {isEstimate && PAYMENT_STATUS === 'COMPLETED' && (
        <View style={[styles.btnWrapper, { flexDirection: 'row' }]}>
          <PrimaryButton
            style={[styles.btn, { flex: 1, backgroundColor: '#219C90' }]}
            handlePress={() => {
              navigation.navigate('Create Invoice', {
                estimateData,
                isEstimate: false,
                estimateAction: 'convert',
                recordNumber,
              });
              // const cartItems = {};
              // estimateData?.cart?.forEach((item, idx) => {
              //   cartItems[idx] = {
              //     order_item_no:
              //       item.type && item.type === 'non-inventory-item'
              //         ? ''
              //         : item.id,
              //     order_item_qty: item && item.quantity,
              //     order_item: item && item.itemName,
              //     order_item_amt: item && item.amount,
              //     order_item_prop: (item && item.order_item_props) || {},
              //     order_item_prop_id: item && item.order_item_prop_id,
              //   };
              // });
              // const payload = {
              //   external_invoice: estimateData?.invoiceNumber,
              //   order_items: JSON.stringify(cartItems),
              //   order_outlet: user.outlet,
              //   delivery_id: estimateData?.delivery?.delivery_id || user.outlet,
              //   delivery_type: estimateData?.delivery?.value || 'WALK-IN',
              //   delivery_location:
              //     estimateData?.delivery?.delivery_location || '',
              //   delivery_gps: estimateData?.delivery?.delivery_gps || '',
              //   delivery_name: estimateData?.customer?.name || '',
              //   delivery_contact: estimateData?.customer?.phone || '',
              //   delivery_email: estimateData?.customer?.email || '',
              //   customer: estimateData?.customer?.id || '',
              //   delivery_charge: estimateData?.delivery?.price || 0,
              //   delivery_charge_ref: '',
              //   delivery_charge_type: '',
              //   service_charge: 0,
              //   order_discount_code: estimateData?.discount?.discountCode || '',
              //   order_discount: estimateData?.discount?.discount || 0,
              //   order_amount: orderAmount,
              //   total_amount: estimateData?.grandTotal,
              //   payment_type: 'INVOICE',
              //   payment_network: 'UNKNOWN',
              //   merchant: user.merchant,
              //   order_notes: estimateData?.notes,
              //   delivery_notes: moment(estimateData?.dueDate).format(
              //     'YYYY-MM-DD HH:mm:ss',
              //   ),
              //   source: 'INSHP',
              //   notify_source: 'Digistore Business',
              //   mod_by: user.login,
              //   payment_number: estimateData?.customer.phone || '',
              //   invoiceDueDate: moment(estimateData?.dueDate).format(
              //     'YYYY-MM-DD HH:mm:ss',
              //   ),
              //   payment_receipt: '',
              //   order_date: moment(estimateData?.invoiceDate).format(
              //     'YYYY-MM-DD HH:mm:ss',
              //   ),
              // };
              // if (!_.isEmpty(orderTaxes_)) {
              //   // eslint-disable-next-line dot-notation
              //   payload['order_taxes'] = JSON.stringify(orderTaxes_);
              // }
              // raiseOrder.mutate(payload);
            }}>
            {'Convert to Invoice'}
          </PrimaryButton>
        </View>
      )}
      <AddBalanceInstructions
        invoice={$invoice}
        paymentInstructions={balanceInstructions}
        togglePaymentInstructions={setBalanceInstructions}
        togglePaymentConfirmed={setConfirmed}
        setInvoice={$setInvoice}
      />
      <AddBalanceStatus
        paymentConfirmed={confirmed}
        togglePaymentConfirmed={setConfirmed}
        invoice={$invoice}
      />
      {invoiceModal && (
        <InvoicePaymentStatus
          modalState={invoiceModal}
          toggle={setInvoiceModal}
          data={status}
          setStatus={setStatus}
          orderDetails={{ ...estimateData, merchantDetails, user }}
          isEstimate={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 28,
    height: '100%',
  },
  indicatorStyle: {
    display: 'none',
  },
  done: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
    marginLeft: 'auto',
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 7,
  },
  orderNo: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 14,
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: '#87C4C9',
  },
  channelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: '#1942D8',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 44,
    marginBottom: 6,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  channel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#1942D8',
    letterSpacing: 0.2,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingRight: 18,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  changeWrapper: {
    marginLeft: 'auto',
    marginRight: 14,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    color: '#5C6E91',
    fontSize: 14,
    marginTop: 5,
  },
  summary: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontFamily: 'ReadexPro-Regular',
    color: '#30475e',
    fontSize: 15.5,
  },
  taxMain: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopColor: '#eee',
    borderTopWidth: 0.6,
    justifyContent: 'center',
    // paddingHorizontal: 12,
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    letterSpacing: 0.1,
    color: '#30475e',
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    letterSpacing: 0.3,
    color: '#30475e',
    maxWidth: '55%',
    textAlign: 'right',
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
});

export default InvoiceDetails;
