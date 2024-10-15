/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import ReceiptItem from '../components/ReceiptItem';
import ShareReceiptButton from '../components/ShareReceiptButton';
import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import { useGetApplicableTaxes } from '../hooks/useGetApplicableTaxes';
import Loading from '../components/Loading';
import { useQueryClient } from 'react-query';
import SendNotification from '../components/Modals/SendNotification';
import moment from 'moment';
// import { useGetTransactionFee } from '../hooks/useGetTransactionFee';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useGetSelectedOrderDetails } from '../hooks/useGetSelectedOrderDetails';
import CornerRibbon from '../components/CornerRibbon';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import { useGetOnlineStoreDetails } from '../hooks/useGetOnlineStoreDetails';

const mapPaymentChannelToName = {
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
};

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

export function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

const Receipt = ({ route, navigation }) => {
  const {
    cart,
    delivery,
    addTaxes,
    paymentChannel,
    discountPayload,
    customerPayment,
    customer,
  } = useSelector(state => state.sale);
  const { user } = useSelector(state => state.auth);

  const viewRef = React.useRef();

  const { invoice, transactionId, orderData } =
    route && route.params && route.params;

  const cacheBust = new Date().toString();

  console.log('invoice in receipt******', orderData);

  const { data: orderDetails, isLoading: ordersLoading } =
    useGetSelectedOrderDetails(user.merchant, orderData.order_no);

  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();

  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const { data, isLoading } = useGetApplicableTaxes(user.merchant);

  const { data: receiptDetailsData, isLoading: isReceiptDetailsLoading } =
    useGetReceiptDetails(user.merchant);

  // const { data: transactionFee, isLoading:isTransactionFeeLoading, isFetching } = useGetTransactionFee(
  //   paymentChannel,
  //   quickSaleInAction ? subTotal : total,
  //   user.merchant,
  //   customerDetails,
  // );

  const { data: details, isLoading: isDetailsLoading } = useGetMerchantDetails(
    user.merchant,
  );

  const merchantDetails = details && details.data && details.data.data;

  const transaction_fee =
    useQueryClient().getQueryData('transaction-fee')?.data.charge;

  const { data: onlineStore, isLoading: isStoreLoading } =
    useGetOnlineStoreDetails(user?.merchant);

  if (
    isLoading ||
    isReceiptDetailsLoading ||
    ordersLoading ||
    isDetailsLoading ||
    isStoreLoading
  ) {
    return <Loading />;
  }

  const imgUrl =
    ((merchantDetails &&
      merchantDetails.merchant_brand_logo.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
        merchantDetails.merchant_brand_logo) ||
      user.user_merchant_logo) +
    '?' +
    cacheBust;

  const receiptItem =
    receiptDetailsData &&
    receiptDetailsData.data &&
    receiptDetailsData.data.data;

  const storeDetails = onlineStore?.data?.data;

  const renderItems = i => {
    return i.map(item => {
      if (!item) {
        return;
      }
      if (item?.taxName && item?.appliedAs === 'INCLUSIVE') {
        return <></>;
      }
      if (item.taxName) {
        return (
          <ReceiptTaxItem
            taxName={item.taxName}
            amount={item.amount}
            key={item.taxName}
            taxType={item.appliedAs}
          />
        );
      }
      return (
        <ReceiptItem
          itemName={
            item && item.itemName && item.itemName.length > 0
              ? item.itemName
              : 'No description'
          }
          quantity={item.quantity}
          amount={Number(item.amount).toFixed(2)}
          key={item.itemName}
        />
      );
    });
  };
  const item =
    (orderDetails && orderDetails.data && orderDetails.data.data) || {};

  const orderAmount = (cart || []).reduce((prev, curr) => {
    if (curr) {
      return prev + curr.quantity * curr.amount;
    }
    return prev;
  }, 0);

  const taxes =
    !quickSaleInAction && addTaxes
      ? ((data && data.data && data.data.data) || []).map(tax => {
          return {
            taxName: tax.tax_name,
            amount: Number(
              (
                tax.tax_value *
                (Number(orderAmount) - Number(discountPayload?.discount || 0))
              ).toFixed(2),
            ),
            appliedAs: tax.tax_applied_as,
            taxValue: tax.tax_value,
          };
        }) || []
      : [];

  let cashEntered = route.params && route.params.cashEntered;
  try {
    cashEntered = JSON.parse(cashEntered || '1');
  } catch (error) {}
  let cashDetails = [];
  if (cashEntered && cashEntered.length > 0) {
    cashDetails.push({
      taxName: 'Amount due',
      amount: Number((item && item.total_amount) || '0').toFixed(2),
    });
    cashDetails.push({
      taxName: 'Cash received',
      amount: Number(cashEntered).toFixed(2),
    });
    cashDetails.push({
      taxName: 'Change due',
      amount: (
        cashEntered - Number((item && item.total_amount) || '0')
      ).toFixed(2),
    });
  }
  const itemsToView = [
    ...cart,

    {
      taxName: 'Subtotal',
      amount: orderAmount,
    },
    discountPayload && {
      taxName: 'Discount',
      amount: -discountPayload.discount.toFixed(2),
    },
    ...taxes,
    delivery.price !== 0 && {
      taxName: 'Delivery',
      amount: delivery.price.toFixed(2),
    },
    item &&
      item.fee_charge && {
        taxName: 'Processing fee',
        amount: item && item.fee_charge,
      },

    ...cashDetails,
  ];

  let pDescription = '';
  cart &&
    cart.forEach(i => {
      if (!i) {
        return;
      }
      pDescription += i.itemName;
      pDescription += ' * ';
      pDescription += i.quantity;
      pDescription += ', ';
    });

  return (
    <>
      <View
        style={{
          backgroundColor: '#EEEEEE',
          paddingHorizontal: Dimensions.get('window').width * 0.3,
          flex: 1,
        }}>
        <ShadowedView
          style={[
            shadowStyle({
              opacity: 0.5,
              radius: 1,
              offset: [0, 0],
            }),
            {
              flex: 1,
              backgroundColor: '#fff',
              marginVertical: 10,
            },
          ]}>
          <SafeAreaView style={styles.main}>
            <ScrollView style={styles.wrapper}>
              <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
                <View style={{ position: 'absolute', top: -10, right: -10 }}>
                  <CornerRibbon color={'red'} status={item.payment_status} />
                </View>
                <Text style={[styles.receipt, { textAlign: 'center' }]}>
                  {receiptItem && receiptItem.receipt_header}
                </Text>
                <View style={styles.upper}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 12,
                    }}>
                    <View style={{ width: '69%' }}>
                      {receiptItem &&
                        receiptItem.receipt_show_business === 'YES' && (
                          <Text style={styles.receipt}>
                            {merchantDetails && merchantDetails.merchant_name}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_tin === 'YES' && (
                          <Text style={styles.merchantDetail}>
                            Tin:{' '}
                            {merchantDetails &&
                              merchantDetails.merchant_reg_number}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_address === 'YES' && (
                          <Text style={styles.merchantDetail}>
                            {merchantDetails &&
                              merchantDetails.merchant_address}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_phone === 'YES' && (
                          <Text style={styles.merchantDetail}>
                            Tel:{' '}
                            {merchantDetails && merchantDetails.merchant_phone}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_email === 'YES' && (
                          <Text style={styles.merchantDetail}>
                            Email:{' '}
                            {merchantDetails && merchantDetails.merchant_email}
                          </Text>
                        )}
                    </View>
                    {receiptItem && receiptItem.receipt_show_logo === 'YES' && (
                      <View
                        style={{
                          marginLeft: 'auto',
                          marginRight: 12,
                          // alignSelf: 'flex-start',
                        }}>
                        <Image
                          style={{ height: 90, width: 90 }}
                          source={{
                            uri: imgUrl,
                          }}
                        />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // paddingHorizontal: 12,
                      marginTop: 14,
                      alignItems: 'center',
                    }}>
                    <View style={{ marginLeft: 12 }}>
                      <Text
                        style={[
                          styles.customerDetails,
                          { fontFamily: 'SFProDisplay-Semibold', fontSize: 15 },
                        ]}>
                        ORDER #: {item?.order_no}
                      </Text>
                      <Text
                        style={[
                          styles.customerDetails,
                          { fontFamily: 'SFProDisplay-Regular', fontSize: 15 },
                        ]}>
                        Receipt #: {invoice}
                      </Text>

                      <Text style={styles.customerDetails}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 15,
                            color: '#30475e',
                          }}>
                          Date & Time:
                        </Text>{' '}
                        {item && item.order_date}
                      </Text>
                      <Text style={styles.customerDetails}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 15,
                            color: '#30475e',
                          }}>
                          Delivery Due:
                        </Text>{' '}
                        {isDateValid(item.delivery_notes)
                          ? moment(item.delivery_notes).format('DD-MM-YYYY')
                          : ''}
                      </Text>
                      {receiptItem &&
                        receiptItem.receipt_show_attendant === 'YES' && (
                          <Text style={styles.customerDetails}>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontSize: 15,
                                color: '#30475e',
                              }}>
                              Served By:
                            </Text>{' '}
                            {item?.created_by_name}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_customer === 'YES' && (
                          <Text style={styles.customerDetails}>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontSize: 15,
                                color: '#30475e',
                              }}>
                              Customer: {item && item.customer_name}{' '}
                            </Text>
                            {item && item.customer_contact}
                          </Text>
                        )}
                    </View>
                  </View>

                  <View style={styles.scanWrapper}>
                    <Text style={styles.scan}>Transaction Summary</Text>
                  </View>
                </View>
                {renderItems(itemsToView)}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 7,
                    }}>
                    <Text style={styles.totalAmount}>
                      Total: GHS{' '}
                      {paymentChannel === 'PATPAY'
                        ? item?.total_amount
                        : paymentChannel === 'DEBITBAL'
                        ? Number(item?.total_amount)
                        : item?.total_amount}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.totalAmount,
                      {
                        marginTop: 0,
                        fontFamily: 'SFProDisplay-Medium',
                        fontSize: 15,
                      },
                    ]}>
                    {mapPaymentChannelToName[paymentChannel]}: GHS{' '}
                    {paymentChannel === 'PATPAY'
                      ? cashEntered
                      : paymentChannel === 'DEBITBAL'
                      ? Number(item?.total_amount)
                      : item?.total_amount}
                  </Text>
                  {paymentChannel === 'PATPAY' && (
                    <Text
                      style={[
                        styles.totalAmount,
                        {
                          marginTop: 0,
                          fontFamily: 'SFProDisplay-Medium',
                          fontSize: 15,
                        },
                      ]}>
                      Amount Due: GHS{' '}
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        Number(item?.total_amount) - Number(cashEntered),
                      )}
                    </Text>
                  )}
                  {taxes?.map(tax => {
                    if (tax?.appliedAs === 'INCLUSIVE') {
                      return (
                        <Text
                          style={[
                            styles.totalAmount,
                            {
                              marginTop: 0,
                              fontFamily: 'SFProDisplay-Regular',
                              fontSize: 14.5,
                            },
                          ]}>
                          {tax?.taxName} - {Number(tax?.taxValue) * 100}%
                          (Incl.): GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(tax?.amount))}
                        </Text>
                      );
                    }
                    return <></>;
                  })}
                  {storeDetails?.store_domain?.length > 0 && (
                    <View style={styles.qr}>
                      <View style={{ alignItems: 'center' }}>
                        <QRCode value={storeDetails?.store_domain} size={84} />
                        <Text
                          style={[
                            {
                              fontFamily: 'SFProDisplay-Regular',
                              fontSize: 15,
                              color: '#30475e',
                              marginTop: 10,
                            },
                          ]}>
                          SCAN TO ORDER NEXT TIME
                        </Text>
                        <Text
                          style={[
                            {
                              fontFamily: 'SFProDisplay-Regular',
                              fontSize: 15,
                              color: '#30475e',
                              marginTop: 5,
                            },
                          ]}>
                          OR VISIT
                        </Text>
                        <Text
                          onPress={() =>
                            Linking.openURL(storeDetails?.store_domain)
                          }
                          style={[
                            {
                              fontFamily: 'SFProDisplay-Regular',
                              fontSize: 15,
                              color: '#30475e',
                              marginTop: 5,
                              textDecorationLine: 'underline',
                            },
                          ]}>
                          {storeDetails?.store_domain}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      marginTop: 8,
                      borderTopColor: '#ddd',
                      borderTopWidth: 0.6,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Regular',
                        color: '#5C6E91',
                        textAlign: 'center',
                        marginBottom: 12,
                        fontSize: 15,
                        marginTop: 6,
                      }}>
                      {receiptItem && receiptItem.receipt_footer}
                    </Text>
                    {receiptItem &&
                      receiptItem.receipt_website_url &&
                      receiptItem.receipt_website_url.length > 0 && (
                        <Text
                          onPress={() =>
                            Linking.openURL(
                              receiptItem && receiptItem.receipt_website_url,
                            )
                          }
                          style={{
                            fontFamily: 'SFProDisplay-Medium',
                            color: '#1942D8',
                            textAlign: 'center',
                            marginTop: 5,
                            fontSize: 15,
                            marginBottom: 12,
                          }}>
                          {receiptItem && receiptItem.receipt_website_url}
                        </Text>
                      )}

                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Semibold',
                        color: '#5C6E91',
                        textAlign: 'center',
                        marginVertical: 12,
                      }}>
                      Powered by Digistore
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ShadowedView>
      </View>
      <ShareReceiptButton
        viewRef={viewRef}
        orderNumber={invoice}
        paymentId={transactionId || invoice}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
        amount={item && item.total_amount}
        customerName={customer && customer.customer_name}
        customerPhone={customerPayment && customerPayment.phone}
        charge={transaction_fee || (0.0).toFixed(2)}
        tType={mapPaymentChannelToName[paymentChannel]}
        date={orderDate}
        description={pDescription}
      />
      {notification && (
        <SendNotification
          notification={notification}
          toggleNotification={toggleNotification}
          navigation={navigation}
          notificationType={notificationType}
          tran_id={transactionId || invoice}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'scroll',
  },
  wrapper: {
    marginHorizontal: 16,
    flex: 1,
  },
  upper: {
    // alignItems: 'center',
    // marginTop: 10,
    marginBottom: 20,
  },
  customerDetails: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
    color: '#30475e',
  },
  orderStatus: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475e',
    fontSize: 16,
  },
  merchantDetail: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#5C6E91',
    fontSize: 14,
    width: '64%',
    marginTop: 3,
  },
  receipt: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30475E',
    marginBottom: 6,
  },
  scanWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingBottom: 4,
  },
  scan: {
    color: '#30475E',
    marginRight: 2,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 15,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingRight: 14,
    paddingVertical: 3,
    paddingLeft: 8,
    backgroundColor: '#f9f9f9',
    alignSelf: 'center',
  },
  statusIndicator: {
    height: 8,
    width: 8,
    borderRadius: 100,
    marginRight: 4,
  },
  qr: {
    marginVertical: 12,
    // alignItems: 'center',
    // flexDirection: 'row',
  },
  itemList: {
    marginTop: 20,
  },
  flatList: {
    marginTop: 22,
    // backgroundColor: 'red',
    flex: 1,
  },
  totalAmount: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#30475E',
    marginLeft: 'auto',
    marginRight: 10,
  },
});

export default Receipt;
