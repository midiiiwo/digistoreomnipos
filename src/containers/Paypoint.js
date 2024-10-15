/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';

import { SheetManager } from 'react-native-actions-sheet';

import SendMoney from '../../assets/icons/send-2.svg';
import ReceiveMoney from '../../assets/icons/wallet-3.svg';
import PaypointServiceButton from '../components/PaypointServiceButton';

import InternetIcon from '../../assets/icons/internet.svg';
import UtilityIcon from '../../assets/icons/utility.svg';
import TvIcon from '../../assets/icons/tv.svg';
import AirtimeIcon from '../../assets/icons/airtime.svg';
import BillIcon from '../../assets/icons/bill.svg';
import TicketIcon from '../../assets/icons/ticket.svg';
import Fees from '../../assets/icons/Fees.svg';
import Voucher from '../../assets/icons/voucher.svg';
import { useSelector } from 'react-redux';
import { Sheet } from 'react-native-share';
import { useGetAccountBalance } from '../hooks/useGetAccountBalance';
import { useGetAllActiveVendors } from '../hooks/useGetAllActiveVendors';
import { useGetRecentPaypointTransactions } from '../hooks/useGetRecentPaypointTransactions';
import moment from 'moment';
import Loading from '../components/Loading';
import RecentCard from '../components/RecentCard';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { Skeleton } from '@rneui/themed';
import RecentCardSkeleton from '../components/RecentSkeleton';
import Announcement from '../../assets/icons/announcement.svg';
import CustomStatusBar from '../components/StatusBar';
import { Shadow } from 'react-native-shadow-2';

const Services = ({ navigation, options }) => {
  const { bills, airtime, tv, utilities, internet } = options;
  const { user } = useSelector(state => state.auth);
  return (
    <View style={styles.servicesWrapper}>
      <View style={styles.serviceButtons}>
        <View style={[styles.serviceRow, styles.firstRow]}>
          <PaypointServiceButton
            backgroundColor="rgba(254, 190, 140, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Airtime"
            Icon={AirtimeIcon}
            handlePress={() => {
              const airtime_ = airtime.filter(item =>
                user.user_permissions.includes(item.biller_id),
              );
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('TOPUPMGT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('TOPUPMGT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              // if (airtime_.length === 0) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              navigation.navigate('Airtime', { airtime: airtime_ });
            }}
          />
          <PaypointServiceButton
            color="#21438F"
            service="Internet"
            Icon={InternetIcon}
            backgroundColor="rgba(177, 175, 255, 0.1)"
            extraStyles={styles.service}
            // handlePress={() => navigation.navigate('Internet', { internet })}
            handlePress={() => {
              const internet_ = internet.filter(item =>
                user.user_permissions.includes(item.biller_id),
              );
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('INTMGT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('INTMGT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              // if (internet_.length === 0) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              navigation.navigate('Internet', { internet: internet_ });
            }}
          />
          <PaypointServiceButton
            backgroundColor="rgba(127, 188, 210, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Utilities"
            Icon={UtilityIcon}
            // handlePress={() => navigation.navigate('Utilities', { utilities })}
            handlePress={() => {
              const utilities_ = utilities.filter(item =>
                user.user_permissions.includes(item.biller_id),
              );
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('BILLMGT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('BILLMGT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              // if (utilities_.length === 0) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              navigation.navigate('Utilities', { utilities: utilities_ });
            }}
          />

          <PaypointServiceButton
            backgroundColor="rgba(151, 210, 236, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Bills"
            Icon={BillIcon}
            // handlePress={() => navigation.navigate('Bills', { bills })}
            handlePress={() => {
              const bills_ = bills.filter(item =>
                user.user_permissions.includes(item.biller_id),
              );
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('BILLMGT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('BILLMGT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              // if (bills_.length === 0) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              navigation.navigate('Bills', { bills: bills_ });
            }}
          />
        </View>
        <View style={styles.serviceRow}>
          <PaypointServiceButton
            backgroundColor="rgba(224, 217, 140, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Tv"
            Icon={TvIcon}
            // handlePress={() => navigation.navigate('Tv', { tv })}
            handlePress={() => {
              return;
              // const tv_ = tv.filter(item =>
              //   user.user_permissions.includes(item.biller_id),
              // );
              // if (
              //   user &&
              //   user.user_merchant_agent == '6' &&
              //   (!user.user_permissions.includes('TRANMGT') ||
              //     !user.user_permissions.includes('MKPAYMT') ||
              //     !user.user_permissions.includes('BILLMGT'))
              // ) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'No Access',
              //     textBody:
              //       'Service not available on your account. Please contact Ecobank support',
              //   });
              //   return;
              // }
              // if (
              //   !user.user_permissions.includes('TRANMGT') ||
              //   !user.user_permissions.includes('MKPAYMT') ||
              //   !user.user_permissions.includes('BILLMGT')
              // ) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade Needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              // // if (tv_.length === 0) {
              // //   Toast.show({
              // //     type: ALERT_TYPE.WARNING,
              // //     title: 'Upgrade needed',
              // //     textBody:
              // //       "You don't have access to this feature. Please upgrade your account",
              // //   });
              // //   return;
              // // }
              // navigation.navigate('Tv', { tv: tv_ });
            }}
          />
          <PaypointServiceButton
            backgroundColor="rgba(253, 138, 138, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Tickets"
            Icon={TicketIcon}
            handlePress={() => {
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('SELTKTS'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('SELTKTS')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
            }}
            // handlePress={() => navigation.navigate('Tickets')}
            // handlePress={() => {
            //   const tv_ = tv.filter(item =>
            //     user.user_permissions.includes(item.biller_id),
            //   );
            //   if (tv_.length === 0) {
            //     Toast.show({
            //       type: ALERT_TYPE.WARNING,
            //       title: 'Upgrade needed',
            //       textBody:
            //         "You don't have access to this feature. Please upgrade your account",
            //     });
            //     return;
            //   }
            //   navigation.navigate('Tv', { tv: tv_ });
            // }}
          />
          <PaypointServiceButton
            backgroundColor="rgba(98, 205, 255, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Suppliers"
            Icon={Fees}
          />
          <PaypointServiceButton
            backgroundColor="rgba(134, 200, 188, 0.1)"
            extraStyles={styles.service}
            color="#21438F"
            service="Vouchers"
            Icon={Voucher}
          />
        </View>
      </View>
    </View>
  );
};

const TransactMoneyButton = ({
  Icon,
  label,
  backgroundColor,
  color,
  handlePress,
}) => {
  return (
    <Pressable style={[ss.main, { backgroundColor }]} onPress={handlePress}>
      <Icon height={32} width={32} />
      <Text style={[ss.txt, { color }]}>{label}</Text>
    </Pressable>
  );
};

const ss = StyleSheet.create({
  main: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 34,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: 0.3,
    marginLeft: 5,
    fontSize: 18,
  },
});

const Paypoint = ({ navigation }) => {
  const billOptions = [];
  const airtimeOptions = [];
  const internetOptions = [];
  const tvOptions = [];
  const utilitiesOptions = [];
  const sendMoneyOptions = [];
  const { balanceToShow } = useSelector(state => state.paypoint);
  const { user } = useSelector(state => state.auth);
  // useGetMerchantOutlets()
  const { data, refetch, isFetching } = useGetAccountBalance(
    user.user_merchant_account,
  );
  const { data: activeVendors } = useGetAllActiveVendors();

  const endDate = moment(new Date()).format('DD-MM-YYYY');
  const startDate = moment(
    new Date().setDate(new Date().getDate() - 30),
  ).format('DD-MM-YYYY');

  const {
    data: recentTransactions,
    isLoading,
    refetch: refetchRecent,
    isFetching: isRecentFetching,
  } = useGetRecentPaypointTransactions(
    user.merchant,
    user.login,
    startDate,
    endDate,
    user.user_merchant_group === 'Administrators',
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
      refetchRecent();
    });
    return unsubscribe;
  }, [navigation, refetch, refetchRecent]);

  activeVendors &&
    activeVendors.data &&
    activeVendors.data.data &&
    activeVendors.data.data.map(option => {
      if (!option) {
        return;
      }
      // if (!user.user_permissions.includes(option.biller_id)) {
      //   return;
      // }
      switch (option.biller_tag) {
        case 'Buy Airtime':
          airtimeOptions.push(option);
          break;
        case 'Buy Internet':
          internetOptions.push(option);
          break;
        case 'Send Money':
          sendMoneyOptions.push(option);
          break;
        case 'Pay Bill':
          billOptions.push(option);
          break;
        default:
          break;
      }
    });
  const tvOptionsAll = ['GOTV', 'DSTV', 'STARTIMES', 'KWESETV', 'BO'];
  const utilitiesOptionsAll = ['ECG', 'ECGP', 'GWCL'];
  const billOptions_ = [];
  billOptions.forEach((i, j) => {
    if (tvOptionsAll.includes(i.biller_id)) {
      tvOptions.push(i);
    } else if (utilitiesOptionsAll.includes(i.biller_id)) {
      utilitiesOptions.push(i);
    } else {
      billOptions_.push(i);
    }
  });

  const options = {};
  options.bills = billOptions_;
  options.internet = internetOptions;
  options.utilities = utilitiesOptions;
  options.sendMoney = sendMoneyOptions;
  options.airtime = airtimeOptions;
  options.tv = tvOptions;

  // console.log('airtime', airtimeOptions);
  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <View style={styles.topMain}>
      {Platform.OS === 'android' && (
        <CustomStatusBar backgroundColor="#21438F" />
      )}
      <ScrollView
        contentContainerStyle={styles.main}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch();
              refetchRecent();
            }}
            refreshing={isFetching || isRecentFetching}
          />
        }>
        <View style={styles.InfoBanner}>
          <View style={styles.infoWrapper}>
            <Text style={styles.amountLabel}>
              Account {balanceToShow === 0 ? 'Balance' : 'Commission'}
            </Text>
            <Text style={styles.amount}>
              <Text style={{ fontSize: 18 }}>GHS</Text>{' '}
              {balanceToShow === 0
                ? data &&
                  data.data &&
                  data.data.data &&
                  data.data.status == 0 &&
                  new Intl.NumberFormat().format(data.data.data.current_balance)
                : data &&
                  data.data &&
                  data.data.data &&
                  data.data.status == 0 &&
                  new Intl.NumberFormat().format(
                    data.data.data.commission_balance,
                  )}
            </Text>
          </View>
          {balanceToShow === 1 && (
            <Pressable
              style={styles.transferBtn}
              onPress={() => {
                if (
                  user &&
                  user.user_merchant_agent == '6' &&
                  (!user.user_permissions.includes('MACCTMGT') ||
                    !user.user_permissions.includes('MKPAYMT'))
                ) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'No Access',
                    textBody:
                      'Service not available on your account. Please contact Ecobank support',
                  });
                  return;
                }
                if (
                  !user.user_permissions.includes('MACCTMGT') ||
                  !user.user_permissions.includes('MKPAYMT')
                ) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                SheetManager.show('transferCommission');
              }}>
              <Text style={styles.transferText}>Transfer Commission</Text>
            </Pressable>
          )}
          {balanceToShow === 0 && (
            <Pressable
              style={styles.transferBtn}
              onPress={() => {
                if (
                  user &&
                  user.user_merchant_agent == '6' &&
                  (!user.user_permissions.includes('MACCTMGT') ||
                    !user.user_permissions.includes('MKDEPOSIT'))
                ) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'No Access',
                    textBody:
                      'Service not available on your account. Please contact Ecobank support',
                  });
                  return;
                }
                if (
                  !user.user_permissions.includes('MACCTMGT') ||
                  !user.user_permissions.includes('MKDEPOSIT')
                ) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  // SheetManager.hideAll();
                  return;
                }
                navigation.navigate('Add Money');
              }}>
              <Text style={styles.transferText}>Add Funds</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.moneyTransact}>
          <TransactMoneyButton
            label="Send Money"
            Icon={SendMoney}
            backgroundColor="rgba(108, 74, 182, 0.1)"
            color="#6C4AB6"
            // handlePress={() =>
            //   navigation.navigate('Send', { sendMoneyOptions })
            // }
            handlePress={() => {
              const sendMoneyOptions_ = sendMoneyOptions.filter(item =>
                user.user_permissions.includes(item.biller_id),
              );
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('MMMGT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('MMMGT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              // if (sendMoneyOptions_.length === 0) {
              //   Toast.show({
              //     type: ALERT_TYPE.WARNING,
              //     title: 'Upgrade Needed',
              //     textBody:
              //       "You don't have access to this feature. Please upgrade your account",
              //   });
              //   return;
              // }
              navigation.navigate('Send', {
                sendMoneyOptions: sendMoneyOptions_,
              });
            }}
          />
          <TransactMoneyButton
            label="Receive Payment"
            Icon={ReceiveMoney}
            backgroundColor="rgba(0, 171, 179, 0.1)"
            color="#00ABB3"
            handlePress={() => {
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('TRANMGT') ||
                  !user.user_permissions.includes('MKPAYMT') ||
                  !user.user_permissions.includes('RCPAYMT'))
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'No Access',
                  textBody:
                    'Service not available on your account. Please contact Ecobank support',
                });
                return;
              }
              if (
                !user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('MKPAYMT') ||
                !user.user_permissions.includes('RCPAYMT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              navigation.navigate('Quick Sale');
            }}
          />
        </View>
        <Services navigation={navigation} options={options} />
        <View style={styles.recentLabelWrapper}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 17,
              color: '#30475e',
            }}>
            Recent Transactions
          </Text>
          <Pressable
            style={styles.moreWrapper}
            onPress={() => navigation.navigate('Transaction History')}>
            <Text style={styles.more}>More</Text>
            {/* <ArrowRight stroke="#21438F" height={18} width={18} /> */}
          </Pressable>
        </View>
        <View style={styles.recentsWrapper}>
          {(isLoading || isFetching) && (
            <>
              <RecentCardSkeleton />
              <RecentCardSkeleton />
              <RecentCardSkeleton />
            </>
          )}
          {!(isLoading || isFetching) &&
            recentTransactions &&
            recentTransactions.data &&
            recentTransactions.data.data &&
            recentTransactions.data.data.slice(0, 3).map(item => {
              return (
                <RecentCard
                  item={item}
                  key={item.TRANSACTION_ID}
                  navigation={navigation}
                />
              );
            })}
        </View>
        <View style={styles.adWrapper}>
          <Image
            source={require('../../assets/images/1024x500.jpg')}
            style={styles.ad}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  transferBtn: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 3,
  },
  transferText: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#21438F',
    fontSize: 18,
  },
  topMain: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    backgroundColor: '#fff',
  },
  InfoBanner: {
    height: 100,
    backgroundColor: '#21438F',
    flexDirection: 'row',
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  infoWrapper: {
    marginTop: 'auto',
    marginBottom: 16,
    marginLeft: 20,
  },
  amountLabel: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 17,
    color: '#fff',
    marginBottom: 4,
  },
  service: {
    // borderWidth: 0.5,
    // borderColor: '#ddd',
  },
  amount: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 24,
    color: '#fff',
  },
  moneyTransact: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    backgroundColor: '#fff',
  },
  serviceRow: {
    flexDirection: 'row',
    // marginLeft: 10,
  },
  firstRow: {
    marginBottom: 4,
  },
  servicesWrapper: {
    marginTop: 14,
    alignItems: 'center',
    // backgroundColor: 'orange',
  },
  recentLabelWrapper: {
    flexDirection: 'row',
    paddingHorizontal: Dimensions.get('window').width * 0.14,
    marginTop: 16,
  },
  moreWrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  more: {
    color: '#1942D8',
    marginRight: 3,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17.5,
    opacity: 0.9,
  },
  recents: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475E',
  },
  recentsWrapper: {
    paddingHorizontal: Dimensions.get('window').width * 0.14,
  },
  ad: {
    height: 200,
    width: '95%',
    borderRadius: 6,
  },
  adWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
});

export default Paypoint;
