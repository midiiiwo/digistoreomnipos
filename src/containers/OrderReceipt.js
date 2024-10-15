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

import Loading from '../components/Loading';
import SendNotification from '../components/Modals/SendNotification';
import { useActionCreator } from '../hooks/useActionCreator';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import CornerRibbon from '../components/CornerRibbon';
import { isDateValid } from './Receipt';
import moment from 'moment';
import { useGetOnlineStoreDetails } from '../hooks/useGetOnlineStoreDetails';
// import CornerRibbon from '../components/CornerRibbon';

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
const OrderReceipt = ({ route, navigation }) => {
  const { delivery } = useSelector(state => state.sale);
  const { user } = useSelector(state => state.auth);

  const viewRef = React.useRef();

  const { item, itemList } = route && route.params && route.params;
  const { data: details, isLoading: isDetailsLoading } = useGetMerchantDetails(
    user.merchant,
  );
  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();
  const { setCustomerPayment } = useActionCreator();

  const { data, isLoading } = useGetReceiptDetails(user.merchant);

  const { data: onlineStore, isLoading: isStoreLoading } =
    useGetOnlineStoreDetails(user.merchant);

  // const { quickSaleInAction } = useSelector(state => state.quickSale);
  // const { data, isLoading } = useGetApplicableTaxes(user.merchant);

  // const transaction_fee =
  //   useQueryClient().getQueryData('transaction-fee')?.data.charge;

  // if (isLoading) {
  //   return <Loading />;
  // }

  React.useEffect(() => {
    setCustomerPayment({
      phone: item.customer_contact,
      email: item.customer_email,
    });
  }, [setCustomerPayment, item]);

  const inclusveTaxes = item?.tax_charges?.map(tax => {
    if (tax?.tax_type === 'INCLUSIVE') {
      return {
        taxName: tax?.tax_name + ' (Incl.)',
        amount: new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(tax?.tax_charged || 0)),
      };
    }
  });

  const exclusiveTaxes = item?.tax_charges?.map(tax => {
    if (tax?.tax_type === 'EXCLUSIVE') {
      return {
        taxName: tax?.tax_name + ' (Excl.)',
        amount: new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(tax?.tax_charged || 0)),
      };
    }
  });

  // const taxes =
  //   !quickSaleInAction && addTaxes
  //     ? (data &&
  //         data.data &&
  //         data.data.data &&
  //         data.data.data.map(tax => {
  //           return {
  //             taxName: tax.tax_name,
  //             amount: JSON.parse((tax.tax_value * subTotal).toFixed(2)),
  //           };
  //         })) ||
  //       []
  //     : [];

  // const totalOtherAmount =
  //   (!quickSaleInAction && addTaxes
  //     ? taxes && taxes.reduce((acc, curr) => acc + curr.amount, 0)
  //     : 0) +
  //   subTotal +
  //   (transaction_fee || 0) +
  //   (delivery && (JSON.parse(delivery.price.toFixed(2)) || 0));
  // const cashEntered = route.params && route.params.cashEntered;
  // let cashDetails = [];
  // if (cashEntered && cashEntered.length > 0) {
  //   cashDetails.push({
  //     taxName: 'Amount due',
  //     amount: Number(totalOtherAmount).toFixed(2),
  //   });
  //   cashDetails.push({
  //     taxName: 'Cash received',
  //     amount: Number(cashEntered).toFixed(2),
  //   });
  //   cashDetails.push({
  //     taxName: 'Change due',
  //     amount: (JSON.parse(cashEntered) - totalOtherAmount).toFixed(2),
  //   });
  // }
  const cacheBust = new Date().toString();
  const itemsToView = [
    ...itemList,
    {
      taxName: 'Subtotal',
      amount: Number(item?.order_amount).toFixed(2),
    },

    Number(item?.order_discount) !== 0 && {
      taxName: 'Discount',
      amount: Number(item?.order_discount).toFixed(2),
    },
    ...exclusiveTaxes,
    Number(item?.delivery_charge) > 0 && {
      taxName: 'Delivery',
      amount: item?.delivery_charge,
    },

    {
      taxName: 'Processing fee',
      amount: item?.fee_charge,
    },
  ];

  const renderItems = i => {
    return i.map(item => {
      if (!item) {
        return;
      }
      if (item.taxName) {
        return (
          <ReceiptTaxItem
            taxName={item.taxName}
            amount={item.amount}
            key={item.taxName}
          />
        );
      }
      return (
        <ReceiptItem
          itemName={item.order_item}
          quantity={item.order_item_qty}
          amount={Number(item.order_item_amount).toFixed(2)}
          key={item.order_item}
        />
      );
    });
  };

  if (isLoading || isDetailsLoading || isStoreLoading) {
    return <Loading />;
  }

  const receiptItem = data && data.data && data.data.data;

  const storeDetails = onlineStore?.data?.data;

  const merchantDetails = details?.data?.data;
  const imgUrl =
    ((merchantDetails &&
      merchantDetails.merchant_brand_logo.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
        merchantDetails.merchant_brand_logo) ||
      user.user_merchant_logo) +
    '?' +
    cacheBust;

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
                  <CornerRibbon
                    color={'red'}
                    status={
                      item?.payment_status === 'Deferred'
                        ? 'Unpaid'
                        : item?.payment_status
                    }
                  />
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
                    <View style={{ width: '79%' }}>
                      <Text style={styles.merchantDetail}>
                        [Duplicate Receipt]
                      </Text>
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
                          { fontFamily: 'SFProDisplay-Medium', fontSize: 15 },
                        ]}>
                        ORDER #{item.order_no}
                      </Text>
                      <Text
                        style={[
                          styles.customerDetails,
                          { fontFamily: 'SFProDisplay-Regular', fontSize: 15 },
                        ]}>
                        {item.payment_type === 'INVOICE'
                          ? 'Invoice #:'
                          : 'Receipt #:'}{' '}
                        {item.payment_invoice}
                      </Text>
                      <Text style={styles.customerDetails}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#30475e',
                          }}>
                          Date & Time:
                        </Text>{' '}
                        {item.order_date}
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
                        {isDateValid(item?.delivery_notes)
                          ? moment(item?.delivery_notes).format('DD-MM-YYYY')
                          : ''}
                      </Text>
                      {receiptItem &&
                        receiptItem.receipt_show_attendant === 'YES' && (
                          <Text style={styles.customerDetails}>
                            <Text
                              style={{
                                fontSize: 15,
                                color: '#30475e',
                              }}>
                              Served By:
                            </Text>{' '}
                            {item.created_by_name}
                          </Text>
                        )}
                      {receiptItem &&
                        receiptItem.receipt_show_customer === 'YES' && (
                          <Text style={styles.customerDetails}>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 15,
                                color: '#30475e',
                              }}>
                              Customer: {item.customer_name}
                            </Text>{' '}
                            {item.customer_contact}
                          </Text>
                        )}
                    </View>
                  </View>

                  <View style={styles.scanWrapper}>
                    <Text style={styles.scan}>Sale Summary</Text>
                  </View>
                </View>
                {renderItems(itemsToView)}
                <View>
                  <Text style={styles.totalAmount}>
                    Total: GHS {item.total_amount}
                  </Text>
                  <Text
                    style={[
                      styles.totalAmount,
                      {
                        marginTop: 0,
                        fontFamily: 'SFProDisplay-Medium',
                        fontSize: 16,
                      },
                    ]}>
                    {item.payment_type === 'INVOICE' ? 'Invoice - ' : ''}
                    {mapPaymentChannelToName[item.payment_channel]}: GHS{' '}
                    {item.total_amount}
                  </Text>
                  {inclusveTaxes?.map(tax => {
                    if (tax) {
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
                          {tax?.taxName}: GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(tax?.amount))}
                        </Text>
                      );
                    }
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

                    {receiptItem?.receipt_website_url?.length > 0 && (
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
                        marginTop: 12,
                        marginBottom: 14,
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
        orderNumber={item.payment_invoice}
        paymentId={item.payment_invoice}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
      />
      {notification && (
        <SendNotification
          notification={notification}
          toggleNotification={toggleNotification}
          navigation={navigation}
          notificationType={notificationType}
          tran_id={item.payment_invoice}
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
    marginLeft: 'auto',
    marginTop: 5,
  },
  orderStatus: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475e',
    fontSize: 14.5,
    textTransform: 'capitalize',
    letterSpacing: 0.2,
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
    fontSize: 17,
    color: '#30475E',
    marginLeft: 'auto',
    marginBottom: 8,
    marginRight: 10,
    marginTop: 12,
  },
});

export default OrderReceipt;
