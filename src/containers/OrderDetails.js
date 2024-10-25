/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { captureRef } from 'react-native-view-shot';

import { useSelector } from 'react-redux';
import { useGetSelectedOrderDetails } from '../hooks/useGetSelectedOrderDetails';
import Loading from '../components/Loading';
import { useGetOrderItemList } from '../hooks/useGetOrderItemList';
import { useGetKitchStaffOrderItems } from '../hooks/useGetKitchenStaffOrderItems';
import PrimaryButton from '../components/PrimaryButton';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import { useVoidOrder } from '../hooks/useVoidOrder';
import { useQueryClient } from 'react-query';
import { useGetOrdersNonAdmin } from '../hooks/useGetOrdersNonAdmin';
import moment from 'moment';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import AddBalanceInstructions from '../components/Modals/AddBalanceInstructions';
import AddBalanceStatus from '../components/Modals/AddBalanceStatus';

const mapChannelToPayment = {
  MTNMM: 'MTN Mobile Money',
  VODAC: 'Vodafone Cash',
  AIRTELM: 'AirtelTigo Money',
  CASH: 'Cash',
  TIGOC: 'AirtelTigo Money',
  DISC: 'Discount',
  UNKNOWN: 'Unknown',
  VISAG: 'Card',
  LPTS: 'Loyalty Points',
  OFFMOMO: 'Offline MoMo',
  OFFCARD: 'Offline Card',
  BANK: 'Bank',
  QRPAY: 'GHQR',
  CREDITBAL: 'Store Credit',
  DEBITBAL: 'Pay Later',
  OFFLINE: 'Ussd Offline',
};

const mapSalesChannelToName = {
  INSHOP: 'In-shop',
  INSHP: 'In-shop',
  ONLINE: 'Online Store',
  SNAPCHAT: 'Snapchat',
  INSTAGRAM: 'Instagram',
  TWITTER: 'Twitter',
  WHATSAPP: 'Whatsapp',
  TIKTOK: 'Tiktok',
  FACEBOOK: 'Facebook',
  'WEB POS': 'Web POS',
  MOBILE: 'Mobile',
  OTHERS: 'Others',
};

const OrderDetails = props => {
  const { user } = useSelector(state => state.auth);
  const [$invoice, $setInvoice] = React.useState();
  const [balanceInstructions, setBalanceInstructions] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  const { data, isLoading, isRefetching, refetch } = useGetSelectedOrderDetails(
    user.merchant,
    props.route.params.id,
  );

  const { data: merchantDetails_, isLoading: merchantLoading } =
    useGetMerchantDetails(user.merchant);

  const [kitchenStaffItems, setKitchenStaffItems] = React.useState();
  const ordersNonAdmin_ = useGetOrdersNonAdmin(() => { });

  const navigation = useNavigation();

  const ref = React.useRef();
  const toast = useToast();
  const client = useQueryClient();

  const isKitchenStaff = user.user_permissions.includes('BCKRMORDER');
  const { startDate, endDate } = useSelector(state => state.orders);

  // console.log('iddddd', props.route.params.id);

  const { mutate, isLoading: isKitchenStaffLoading } =
    useGetKitchStaffOrderItems(setKitchenStaffItems);

  const { data: itemList, isLoading: isListLoading } = useGetOrderItemList(
    user.merchant,
    props.route.params.id,
    !isKitchenStaff,
  );
  const voidOrder = useVoidOrder(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      client.invalidateQueries('selected-order');
      if (user.user_merchant_group === 'Administrators') {
        ordersNonAdmin_.mutate({
          merchant: user.merchant,
          outlet: user.outlet,
          end_date: moment(endDate).format('DD-MM-YYYY'),
          start_date: moment(startDate).format('DD-MM-YYYY'),
        });
      } else {
        client.invalidateQueries('all-orders');
      }
    }
  });

  React.useEffect(() => {
    if (isKitchenStaff) {
      mutate({
        merchant: user.merchant,
        outlet: Number(user.outlet),
        user_group: Number(user.user_merchant_group_id),
      });
    }
  }, [isKitchenStaff, mutate, user]);

  const { data: config_, isLoading: isConfigLoading } =
    useGetStoreDeliveryConfig(user.merchant);

  if (
    isLoading ||
    isListLoading ||
    isConfigLoading ||
    isKitchenStaffLoading ||
    merchantLoading
  ) {
    return <Loading />;
  }

  let item = data?.data?.data || {};
  // if (item.payment_type === 'PAYLATER' && item.payment_status !== 'Cancelled') {
  //   item.order_status = 'TO BE PAID LATER';
  // }
  const config = config_?.data?.data || {};
  const orderItems = itemList?.data?.data || [];
  const orderNotSuccessful =
    item?.order_status === 'NEW' ||
    item?.order_status === 'UNPAID' ||
    item?.order_status === 'PAYMENT_FAILED' ||
    item?.order_status === 'PENDING' ||
    item?.order_status === 'PAYMENT_CANCELLED';

  const merchantDetails = merchantDetails_?.data?.data || {};

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 18,
            color: '#30475e',
          }}>
          Order does not exist
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your new order
        </Text>
        <Pressable
          style={[
            styles.btn1,
            {
              marginTop: 14,
              backgroundColor: '#rgba(25, 66, 216, 0.9)',
            },
          ]}
          onPress={async () => {
            navigation.navigate('Inventory');
          }}>
          <Text style={styles.signin}>Create Order</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      {/* <FAB label="create" size="small" mode="elevated" /> */}
      {/* <FloatingButton
        visible={true}
        hideBackgroundOverlay
        bottomMargin={Dimensions.get('window').width * 0.2}
        button={{
          label: 'Share',
          onPress: () => {
          },
        }}
      /> */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }>
        {!(isLoading || isListLoading || isConfigLoading) && (
          <View ref={ref} collapsable={false} style={styles.main}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.orderNo, { fontFamily: 'ReadexPro-Medium' }]}>
                Order #{(item && item.order_no) || ''}
              </Text>
              {!isKitchenStaff && (
                <Text
                  style={[
                    styles.orderNo,
                    {
                      marginLeft: 'auto',
                      fontFamily: 'ReadexPro-Medium',
                    },
                    // {
                    //   fontFamily: 'SFProDisplay-Semibold',
                    //   fontSize: 16,
                    //   color: '#30475e',
                    //   marginVertical: 'auto',
                    // },
                  ]}>
                  GHS{' '}
                  {new Intl.NumberFormat().format(
                    Number((item && item.total_amount) || 0),
                  )}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.amount,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14,
                  marginBottom: 10,
                  color: '#9BA4B5',
                },
              ]}>
              {item && item.order_date && item.order_date.slice(0, 16)}
            </Text>
            {/* <Text
              style={[
                styles.amount,
                {
                  fontFamily: 'Inter-Regular',
                  fontSize: 15,
                  color: '#30475e',
                  marginTop: 0,
                },
              ]}>
              {mapChannelToPayment[item.payment_channel]}
            </Text> */}
            {!isKitchenStaff && (
              <View style={styles.status}>
                <View style={[styles.statusWrapper]}>
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor:
                          item &&
                            item.order_status &&
                            item.order_status !== 'NEW' &&
                            item.order_status !== 'PENDING' &&
                            item.order_status !== 'FAILED' &&
                            item.order_status !== 'PAYMENT_CANCELLED' &&
                            item.order_status !== 'DECLINED' &&
                            item.order_status !== 'PAYMENT_FAILED' &&
                            item.order_status !== 'VOID' &&
                            item.order_status !== 'PAYMENT_DEFERRED'
                            ? '#87C4C9'
                            : '#FD8A8A',
                      },
                    ]}
                  />
                  <Text style={styles.orderStatus}>
                    {/* {item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED'
                    ? 'Paid'
                    : 'Unpaid'} */}
                    {((item && item.order_status) || '').replace('_', ' ')}
                  </Text>
                </View>
                <View style={[styles.statusWrapper]}>
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor:
                          item &&
                            item.delivery_status &&
                            item.delivery_status === 'DELIVERED'
                            ? '#87C4C9'
                            : item && item.delivery_status === 'PENDING'
                              ? '#FD8A8A'
                              : '#FD8A8A',
                      },
                    ]}
                  />
                  <Text style={styles.orderStatus}>
                    {/* {item.delivery_status === 'DELIVERED'
                    ? 'Delivered'
                    : item.delivery_status === 'PENDING'
                    ? 'Undelivered'
                    : 'Undelivered'} */}
                    {item &&
                      item.delivery_status &&
                      (item.delivery_status === 'PENDING' ||
                        item.delivery_status === 'CANCELLED')
                      ? 'UNDELIVERED'
                      : 'DELIVERED'}
                  </Text>
                </View>
              </View>
            )}
            {/* <Pressable
              style={styles.changeWrapper}
              onPress={() =>
                SheetManager.show('orderStatus', { payload: item })
              }>
              <Text style={styles.change}>Update status</Text>
            </Pressable> */}
            <View>
              {item?.order_status !== 'COMPLETED' &&
                item?.delivery_type !== 'WALK-IN' &&
                item?.order_status !== 'VOID' && (
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      style={styles.channelWrapper}
                      onPress={() =>
                        SheetManager.show('orderStatus', {
                          payload: { item, config },
                        })
                      }>
                      <Text style={styles.channel}>Update Order Status</Text>
                    </Pressable>
                  </View>
                )}
            </View>
            <View>
              {item?.delivery_status !== 'DELIVERED' &&
                (item?.payment_channel === 'CASH' ||
                  item?.payment_channel === 'CREDITBAL' ||
                  item?.payment_channel === 'DEBITBAL' ||
                  item?.payment_channel === 'OFFMOMO' ||
                  item?.payment_channel === 'OFFCARD' ||
                  item?.payment_type === 'PAYLATER' ||
                  item?.payment_type === 'INVOICE') &&
                item?.order_status !== 'VOID' &&
                item?.order_status !== 'PAYMENT_CANCELLED' &&
                item?.order_status !== 'PAYMENT_FAILED' && (
                  <View style={{ alignItems: 'center' }}>
                    {user?.user_permissions?.includes('VOID_ORDER') && (
                      <Pressable
                        style={[
                          styles.channelWrapper,
                          { borderColor: '#F31559' },
                        ]}
                        onPress={() =>
                          Alert.alert(
                            'Cancel Order',
                            'Are you sure you want to cancel order?',
                            [
                              {
                                text: 'NO',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                              },
                              {
                                text: 'CANCEL ORDER',
                                onPress: () => {
                                  voidOrder.mutate({
                                    merchant: user.merchant,
                                    no: item.order_no,
                                    mod_by: user.login,
                                  });
                                },
                              },
                            ],
                          )
                        }>
                        <Text style={[styles.channel, { color: '#F31559' }]}>
                          {voidOrder.isLoading ? 'Processing' : 'Cancel Order'}
                        </Text>
                      </Pressable>
                    )}
                    {/* <PrimaryButton
                    style={[styles.btn, { width: '100%', marginTop: 12 }]}
                    handlePress={() =>
                      SheetManager.show('orderStatus', { payload: item })
                    }>
                    Update order status
                  </PrimaryButton> */}
                  </View>
                )}
            </View>
            {item?.payment_type === 'PAYLATER' &&
              item?.payment_status === 'Deferred' && (
                <View style={{ alignItems: 'center' }}>
                  <Pressable
                    style={[styles.channelWrapper, { borderColor: '#615EFC' }]}
                    onPress={() => {
                      SheetManager.show('Receive PayLater', {
                        payload: {
                          item,
                          setInvoice: $setInvoice,
                          setBalanceInstructions,
                        },
                      });
                    }}>
                    <Text style={[styles.channel, { color: '#615EFC' }]}>
                      Receive Payment
                    </Text>
                  </Pressable>
                </View>
              )}

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>ORDER SUMMARY</Text>
              {!isKitchenStaff && (
                <View style={styles.taxMain}>
                  <Text style={[styles.taxLabel]}>Transaction ID</Text>
                  <Text
                    style={[
                      styles.taxAmount,
                      {
                        maxWidth: '50%',
                      },
                    ]}>
                    {item?.payment_invoice}
                  </Text>
                </View>
              )}
              {!isKitchenStaff && (
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Payment Channel</Text>
                  <Text style={styles.taxAmount}>
                    {item?.payment_type === 'INVOICE' ? 'Invoice - ' : ''}
                    {mapChannelToPayment[item?.payment_channel]}
                  </Text>
                </View>
              )}
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Payment Number</Text>
                <Text style={styles.taxAmount}>{item?.payment_number}</Text>
              </View>
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Order Outlet</Text>
                <Text style={[styles.taxAmount, { maxWidth: '50%' }]}>
                  {item?.delivery_outlet}
                </Text>
              </View>
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Order Source</Text>
                <Text style={styles.taxAmount}>
                  {mapSalesChannelToName[item?.order_source]}
                </Text>
              </View>
              <View style={styles.taxMain}>
                <Text style={[styles.taxLabel, { color: '#6528F7' }]}>
                  Order Notes
                </Text>
                <Text
                  style={[
                    styles.taxAmount,
                    { maxWidth: '50%', color: '#6528F7' },
                  ]}>
                  {item?.customer_notes === 'null' ? '' : item?.customer_notes}
                </Text>
              </View>

              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Served by</Text>
                <Text style={[styles.taxAmount, { maxWidth: '50%' }]}>
                  {item?.created_by_name}
                </Text>
              </View>
            </View>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>ITEM SUMMARY</Text>
              {!isKitchenStaff &&
                ((itemList && itemList.data && itemList.data.data) || []).map(
                  i => {
                    if (!i) {
                      return;
                    }
                    let extras = i?.order_item_xtras;
                    let removables = i?.order_item_removables;

                    try {
                      extras = JSON.parse(extras);
                      removables = JSON.parse(removables);
                    } catch (error) { }

                    console.log('extras', extras);
                    return (
                      <View style={styles.taxMain} key={i?.order_item}>
                        <View style={{ width: '40%' }}>
                          <Text
                            style={[
                              styles.taxLabel,
                              {
                                overflow: 'hidden',
                                paddingHorizontal: 0,
                              },
                            ]}>
                            {i?.order_item}
                            {i?.order_item_properties &&
                              i?.order_item_properties.length > 0
                              ? ` (${i.order_item_properties
                                .split(',')
                                .map(prop => prop.trim().split(':')[1])
                                .toString()})`
                              : ''}
                          </Text>
                          {Object.values(extras).length > 0 && (
                            <View>
                              <Text
                                style={[
                                  styles.taxLabel,
                                  {
                                    overflow: 'hidden',
                                    // backgroundColor: 'red',
                                    paddingHorizontal: 0,
                                    textDecorationStyle: 'solid',
                                    textDecorationLine: 'underline',
                                    fontWeight: '800',
                                    marginVertical: 4,
                                  },
                                ]}>
                                Extras
                              </Text>
                              <Text
                                style={[
                                  styles.taxLabel,
                                  {
                                    overflow: 'hidden',
                                    // backgroundColor: 'red',
                                    paddingHorizontal: 0,
                                  },
                                ]}>
                                {Object.values(extras)
                                  .map(extra => {
                                    if (extra) {
                                      return extra?.order_extra;
                                    }
                                  })
                                  .toString()}
                              </Text>
                            </View>
                          )}
                          {Object.values(removables).length > 0 && (
                            <View>
                              <Text
                                style={[
                                  styles.taxLabel,
                                  {
                                    overflow: 'hidden',
                                    // backgroundColor: 'red',
                                    paddingHorizontal: 0,
                                    textDecorationStyle: 'solid',
                                    textDecorationLine: 'underline',
                                    fontWeight: '800',
                                    marginVertical: 4,
                                  },
                                ]}>
                                Removables
                              </Text>
                              <Text
                                style={[
                                  styles.taxLabel,
                                  {
                                    overflow: 'hidden',
                                    // backgroundColor: 'red',
                                    paddingHorizontal: 0,
                                  },
                                ]}>
                                {Object.values(removables)
                                  .map(removable => {
                                    if (removable) {
                                      return removable?.order_removable;
                                    }
                                  })
                                  .toString()}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.taxAmount}>
                          Qty: {i && i.order_item_qty}
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
                  },
                )}
              {isKitchenStaff &&
                ((kitchenStaffItems && kitchenStaffItems.data) || []).map(i => {
                  if (!i) {
                    return;
                  }
                  return (
                    <View style={styles.taxMain} key={i && i.order_item}>
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
                        {i && i.order_item}
                      </Text>
                      <Text style={styles.taxAmount}>
                        Qty: {i && i.order_item_qty}
                      </Text>
                      {/* {!isKitchenStaff && (
                        <Text style={styles.taxAmount}>
                          GHS {Number(i.order_item_amount).toFixed(2)}
                        </Text>
                      )} */}
                    </View>
                  );
                })}
              {/* <FlatList
                data={}
                renderItem={({ item: i }) => {
                  if (!i) {
                    return;
                  }
                  return (
                    <View style={styles.taxMain}>
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
                        {i.order_item}
                      </Text>
                      <Text style={styles.taxAmount}>
                        Qty: {i.order_item_qty}
                      </Text>
                      {!isKitchenStaff && (
                        <Text style={styles.taxAmount}>
                          GHS {Number(i.order_item_amount).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  );
                }}
              /> */}
            </View>
            {!isKitchenStaff && (
              <View style={styles.summary}>
                <Text style={styles.summaryLabel}>PAYMENT SUMMARY</Text>
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Subtotal</Text>
                  <Text style={styles.taxAmount}>
                    GHS{' '}
                    {new Intl.NumberFormat().format(
                      Number((item && item.order_amount) || 0),
                    )}
                  </Text>
                </View>
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Discount</Text>
                  <Text style={styles.taxAmount}>
                    GHS{' '}
                    {new Intl.NumberFormat().format(
                      Number((item && item.order_discount) || 0),
                    )}
                  </Text>
                </View>
                {item?.tax_charges?.map(tax => {
                  if (tax?.tax_type === 'EXCLUSIVE') {
                    return (
                      <View style={styles.taxMain}>
                        <Text style={[styles.taxLabel, { color: '#6528F7' }]}>
                          {tax?.tax_name} (Excl.)
                        </Text>
                        <Text style={[styles.taxAmount, { color: '#6528F7' }]}>
                          GHS{' '}
                          {new Intl.NumberFormat().format(
                            Number(tax?.tax_charged || 0),
                          )}
                        </Text>
                      </View>
                    );
                  }
                })}
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Processing fee</Text>
                  <Text style={styles.taxAmount}>
                    GHS{' '}
                    {new Intl.NumberFormat().format(
                      Number((item && item.fee_charge) || 0),
                    )}
                  </Text>
                </View>
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Delivery fee</Text>
                  <Text style={styles.taxAmount}>
                    GHS{' '}
                    {new Intl.NumberFormat().format(
                      Number((item && item.delivery_charge) || 0),
                    )}
                  </Text>
                </View>

                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Total</Text>
                  <Text style={styles.taxAmount}>
                    GHS{' '}
                    {new Intl.NumberFormat().format(
                      Number((item && item.total_amount) || 0),
                    )}
                  </Text>
                </View>
                {item?.tax_charges?.map(tax => {
                  if (tax?.tax_type === 'INCLUSIVE') {
                    return (
                      <View style={styles.taxMain}>
                        <Text style={[styles.taxLabel, { color: '#6528F7' }]}>
                          {tax?.tax_name} (Incl.)
                        </Text>
                        <Text style={[styles.taxAmount, { color: '#6528F7' }]}>
                          GHS{' '}
                          {new Intl.NumberFormat().format(
                            Number(tax?.tax_charged || 0),
                          )}
                        </Text>
                      </View>
                    );
                  }
                })}
              </View>
            )}
            {!isKitchenStaff && (
              <View style={styles.summary}>
                <Text style={styles.summaryLabel}>DELIVERY SUMMARY</Text>
                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Delivery Type</Text>
                  <Text style={styles.taxAmount}>
                    {item && item.delivery_type}
                  </Text>
                </View>

                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Delivery Location</Text>
                  <Text
                    style={[
                      styles.taxAmount,
                      { width: '40%', textAlign: 'right' },
                    ]}>
                    {item && item.delivery_location}
                  </Text>
                </View>
                <View style={styles.taxMain}>
                  <Text style={[styles.taxLabel, { color: '#6528F7' }]}>
                    Delivery Notes
                  </Text>
                  <Text
                    style={[
                      styles.taxAmount,
                      { maxWidth: '50%', color: '#6528F7' },
                    ]}>
                    {item && item.delivery_notes}
                  </Text>
                </View>
              </View>
            )}
            {!isKitchenStaff && (
              <View style={styles.summary}>
                <Text style={styles.summaryLabel}>CUSTOMER DETAILS</Text>
                <View
                  style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                  <Text style={styles.taxLabel}>
                    {item && item.customer_name && item.customer_name.length > 0
                      ? item.customer_name
                      : 'No name'}
                  </Text>
                  {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
                </View>

                <View
                  style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                  <Text style={styles.taxLabel}>
                    {item &&
                      item.customer_contact &&
                      item.customer_contact.length > 0
                      ? item.customer_contact
                      : 'No contact'}
                  </Text>
                  {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
                </View>
                <View
                  style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                  <Text style={styles.taxLabel}>
                    {item &&
                      item.customer_email &&
                      item.customer_email.length > 0
                      ? item.customer_email
                      : 'No email'}
                  </Text>
                  {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      {(item?.payment_type === 'INVOICE' ||
        (item?.payment_type !== 'INVOICE' && !orderNotSuccessful)) && (
          <View style={styles.btnWrapper}>
            <PrimaryButton
              style={[styles.btn, { flex: 1 }]}
              handlePress={() => {
                if (
                  item?.payment_type === 'INVOICE' &&
                  item?.order_status !== 'PAID' &&
                  item?.order_status !== 'COMPLETED'
                ) {
                  props.navigation.navigate('Invoice Order', {
                    data: item,
                    cart: orderItems || [],
                    merchantDetails,
                    invoiceId: item?.external_invoice,
                  });
                } else {
                  props.navigation.navigate('Order Receipt', {
                    item,
                    itemList: orderItems || [],
                  });
                }
              }}>
              {item?.payment_type === 'INVOICE' &&
                item?.order_status !== 'PAID' &&
                item?.order_status !== 'COMPLETED'
                ? 'Send Invoice'
                : 'Send Receipt'}
            </PrimaryButton>
            <View style={{ marginHorizontal: 3 }} />
            <PrimaryButton
              style={[styles.btn, { flex: 1, backgroundColor: '#30475e' }]}
              handlePress={() => {
                captureRef(ref, {
                  format: 'png',
                  result: 'base64',
                }).then(async uri => {
                  try {
                    const res = await Share.open(
                      {
                        title: 'Share receipt',
                        url: 'data:image/png;base64,' + uri,
                      },
                      {},
                    );
                    if (res.success) {
                      toast.show('Share success');
                    }
                  } catch (error) {
                    // toast.show('Share unsuccessfu');
                  }
                });
              }}>
              Share Order
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
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 22,
    paddingVertical: 14,
    flex: 1,
  },
  scroll: {
    paddingBottom: Dimensions.get('window').height * 0.1,
    backgroundColor: '#fff',
  },
  done: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
    marginLeft: 'auto',
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 7,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  channel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#1942D8',
    letterSpacing: 0.2,
  },
  channelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    // borderBottomColor: '#92A9BD',
    // borderBottomWidth: 0.4,
    // borderTopColor: '#92A9BD',
    // borderTopWidth: 0.4,
    // backgroundColor: 'rgba(234, 234, 234, 0.65)',
    borderWidth: 1,
    borderColor: '#1942D8',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 6,
    marginTop: 4,
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
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  orderNo: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: '#30475E',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 14.5,
    textTransform: 'capitalize',
    letterSpacing: 0.2,
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: '#87C4C9',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingRight: 13,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  changeWrapper: {
    paddingBottom: 16,
    paddingTop: 2,
  },
  change: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
  },
  status: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    // borderBottomColor: '#ddd',
    // borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  amount: {
    fontFamily: 'ReadexPro-Medium',
    color: '#5C6E91',
    fontSize: 14,
    marginTop: 5,
  },
  summary: {},
  summaryLabel: {
    fontFamily: 'ReadexPro-bold',
    marginTop: 14,
    marginBottom: 5,
    color: '#30475e',
    fontSize: 14.5,
    letterSpacing: 0.4,
  },
  taxMain: {
    flexDirection: 'row',
    // marginVertical: 6,
    // marginTop: 10,
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 0.5,
    justifyContent: 'center',
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14.6,
    color: '#5C6E91',
    letterSpacing: 0.15,
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14.6,
    color: '#5C6E91',
  },
});
