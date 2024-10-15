/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
  Linking,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
// import Pen from '../../assets/icons/pen.svg';
import Call from '../../assets/icons/phone';
import Whatsapp from '../../assets/icons/whatsapp';
import { useGetCustomerDetails } from '../hooks/useGetCustomerDetails';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useGetMerchantCustomerOrders } from '../hooks/useGetMerchantCustomerOrders';
import moment from 'moment';
// import { FlashList } from '@shopify/flash-list';
import { FlatList } from 'react-native-gesture-handler';
import PrimaryButton from '../components/PrimaryButton';
import AddBalance from '../../assets/icons/addbalance.svg';
import PayBalance from '../../assets/icons/paybalance.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { useState } from 'react';
import AddBalanceInstructions from '../components/Modals/AddBalanceInstructions';
import AddBalanceStatus from '../components/Modals/AddBalanceStatus';
import { useNavigation } from '@react-navigation/native';

const FirstRoute = ({ item }) => {
  console.log('oooooooooooo', item);
  // console.log(item);
  return (
    <View style={styles.detailsMain}>
      <ScrollView>
        <View
          style={[
            styles.detailItem,
            { flexDirection: 'row', alignItems: 'center' },
          ]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailsItemName}>Phone Number</Text>
            <Text style={styles.detailsItemValue}>
              {item && item.customer_phone}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 'auto',
              paddingRight: 8,
            }}>
            <Pressable
              onPress={() => {
                Linking.openURL(`tel:${item.customer_phone}`);
              }}>
              <Call height={35} width={35} />
            </Pressable>
            <Pressable
              style={{ marginLeft: 7 }}
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?phone=+233${item.customer_phone}`,
                );
              }}>
              <Whatsapp height={40} width={40} />
            </Pressable>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailsItemName}>Alt Phone</Text>
          <Text style={styles.detailsItemValue}>
            {item &&
            item.customer_alt_phone &&
            item.customer_alt_phone.length > 0 &&
            item.customer_alt_phone !== 'null'
              ? item.customer_alt_phone
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailsItemName}>Email Address</Text>
          <Text style={styles.detailsItemValue}>
            {item &&
            item.customer_email &&
            item.customer_email.length > 0 &&
            item.customer_email !== 'null'
              ? item.customer_email
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailsItemName}>Date of Birth</Text>
          <Text style={styles.detailsItemValue}>
            {item &&
            item.customer_dob &&
            item.customer_dob.length > 0 &&
            item.customer_dob !== 'null'
              ? item.customer_dob.slice(0, 5)
              : 'N/A'}
          </Text>
        </View>

        {/* {item.customer_addresses.map((i, idx) => {
          return (
            <View style={styles.detailItem}>
              <Text style={styles.detailsItemName}>
                Address {idx + 1} - {i.Tag}
              </Text>
              <Text style={styles.detailsItemValue}>{i.Address}</Text>
            </View>
          );
        })} */}
      </ScrollView>
    </View>
  );
};

const SecondRoute = ({ merchant, customerPhone, filterPaylater }) => {
  const { user } = useSelector(state => state.auth);
  const endDate = moment().format('DD-MM-YYYY');
  const navigation = useNavigation();

  const { data, isLoading, refetch, isRefetching } =
    useGetMerchantCustomerOrders(
      merchant,
      customerPhone,
      moment(new Date(user?.regist)).format('DD-MM-YYYY'),
      endDate,
    );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 14 }}>
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        data={data?.data?.data || []}
        keyExtractor={(item, idx) => {
          if (!item) {
            return idx;
          }
          return item.order_no;
        }}
        renderItem={({ item, index }) => {
          if (!item) {
            return;
          }
          if (filterPaylater && item?.order_status !== 'PAYMENT_DEFERRED') {
            return;
          }
          return (
            <Pressable
              onPress={() =>
                navigation.navigate('Order Details', { id: item?.order_no })
              }
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#eee',
                borderBottomWidth: 0.8,
              }}>
              <View style={{ maxWidth: '60%' }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#30475e',
                    fontSize: 15,
                    marginBottom: 0,
                  }}>
                  Order #{item.order_no}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Regular',
                    color: '#9DB2BF',
                    marginTop: 2,
                  }}>
                  {item.order_date}
                </Text>
                <Text
                  style={{
                    fontFamily: 'IBMPlexSans-Medium',
                    color:
                      item?.order_status === 'PAYMENT_DEFERRED'
                        ? '#D14D72'
                        : '#6D8299',
                    fontSize: 15,
                  }}>
                  GHS {item?.order_status === 'PAYMENT_DEFERRED' ? '-' : ''}
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(item.total_amount))}
                </Text>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',

                    color:
                      item.order_status !== 'NEW' &&
                      item.order_status !== 'PENDING' &&
                      item.order_status !== 'FAILED' &&
                      item.order_status !== 'PAYMENT_CANCELLED' &&
                      item.order_status !== 'DECLINED' &&
                      item.order_status !== 'PAYMENT_FAILED' &&
                      item.order_status !== 'VOID' &&
                      item.order_status !== 'PAYMENT_DEFERRED'
                        ? '#219C90'
                        : '#D14D72',
                  }}>
                  {item &&
                  item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED' &&
                  item.order_status !== 'PAYMENT_CANCELLED' &&
                  item.order_status !== 'DECLINED' &&
                  item.order_status !== 'PAYMENT_FAILED' &&
                  item.order_status !== 'CANCELLED' &&
                  item.order_status !== 'PAYMENT_DEFERRED'
                    ? item.order_status === 'VOID'
                      ? 'Void'
                      : 'Paid'
                    : 'Unpaid'}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const Account = ({
  storeCredit,
  setIndex,
  setFilterPaylater,
  item,
  setInvoice,
  setBalanceInstructions,
}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={[styles.detailItem, { alignItems: 'center' }]}>
        <Text
          style={[
            styles.detailsItemName,
            { fontFamily: 'IBMPlexSans-Regular', fontSize: 16 },
          ]}>
          Wallet Balance
        </Text>
        <Text
          style={[
            styles.detailsItemValue,
            {
              color: Number(storeCredit) >= 0 ? '#00ABB3' : '#D14D72',
              fontFamily: 'IBMPlexSans-Medium',
              fontSize: 28,
            },
          ]}>
          GHS{' '}
          {new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(storeCredit))}
        </Text>
        {Number(storeCredit) < 0 && (
          <PrimaryButton
            handlePress={() => {
              setFilterPaylater(true);
              setIndex(2);
            }}
            style={[
              styles.btn,
              {
                backgroundColor: '#D14D72',
                marginTop: 18,
                width: '60%',
              },
            ]}>
            Pay Balance
          </PrimaryButton>
        )}
        {Number(storeCredit) >= 0 && (
          <PrimaryButton
            handlePress={() => {
              SheetManager.show('Add Balance', {
                payload: {
                  name: item?.customer_name,
                  email: item?.customer_email,
                  phone: item?.customer_phone,
                  setInvoice,
                  setBalanceInstructions,
                  type: 'CREDIT',
                },
              });
            }}
            style={[
              styles.btn,
              {
                backgroundColor: '#00ABB3',
                marginTop: 18,
                width: '60%',
              },
            ]}>
            Add Balance
          </PrimaryButton>
        )}
      </View>
    </View>
  );
};

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

const CustomerDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useSelector(state => state.auth);
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Details' },
    { key: 'second', title: 'Account' },
    { key: 'third', title: 'History' },
  ]);
  const [invoice, setInvoice] = useState();
  const [balanceInstructions, setBalanceInstructions] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const { data, isLoading } = useGetCustomerDetails(user.merchant, id);
  const [filterPaylater, setFilterPaylater] = React.useState(false);

  React.useEffect(() => {
    if (index === 0 || index === 1) {
      setFilterPaylater(false);
    }
  }, [filterPaylater, index]);

  if (isLoading) {
    return <Loading />;
  }

  const item = data?.data?.data;

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute item={item} />;
      case 'second':
        return (
          <Account
            storeCredit={item?.customer_credit_limit}
            storeDebit={item?.customer_debit_balance}
            setIndex={setIndex}
            setFilterPaylater={setFilterPaylater}
            item={item}
            setBalanceInstructions={setBalanceInstructions}
            setInvoice={setInvoice}
          />
        );
      case 'third':
        return (
          <SecondRoute
            merchant={user.merchant}
            customerPhone={item && item.customer_phone}
            filterPaylater={filterPaylater}
          />
        );
      default:
        return null;
    }
  };

  const splitName = item && item.customer_name.split(' ');
  const first =
    (splitName[0] || '').slice(0, 1).toUpperCase() +
    (splitName[0] || '').slice(1).toLowerCase();
  const second =
    (splitName[1] || '').slice(0, 1).toUpperCase() +
    (splitName[1] || '').slice(1).toLowerCase();

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}>
          {/* <Text style={styles.mainText}>Profile</Text> */}
        </View>
        <View>
          <View style={styles.circle}>
            <Text style={styles.initial}>
              {item &&
                item.customer_name &&
                item.customer_name.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>
            {first} {second}
          </Text>
        </View>
        <View
          style={[styles.stats, { paddingVertical: index === 1 ? 16 : 25 }]}>
          <View style={[styles.statsItem]}>
            <Text style={styles.statsName}>{item.total_spends}</Text>
            <Text style={styles.statsMetric}>Total Spend</Text>
          </View>
          <View style={styles.sep} />
          <View style={[styles.statsItem]}>
            <Text style={styles.statsName}>{item.total_counts}</Text>
            <Text style={styles.statsMetric}>Total Orders</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.statsItem}>
            <Text style={styles.statsName}>{item.total_loyalty_points}</Text>
            <Text style={styles.statsMetric}>Loyalty Points</Text>
          </View>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#fff', elevation: 1 }}
            activeColor="#000"
            labelStyle={{
              fontFamily: 'ReadexPro-Regular',
              fontSize: 16,
              color: '#002',
              textTransform: 'capitalize',
              letterSpacing: 0.3,
            }}
            indicatorStyle={{
              backgroundColor: '#2F66F6',
              borderRadius: 22,
              height: 3,
            }}
          />
        )}
      />
      {index === 0 && (
        <View style={styles.btnWrapper}>
          <PrimaryButton
            style={styles.btn}
            handlePress={() => {
              navigation.navigate('Edit Customer', {
                id: item && item.customer_id,
              });
            }}>
            Edit Details
          </PrimaryButton>
        </View>
      )}
      <AddBalanceInstructions
        invoice={invoice}
        paymentInstructions={balanceInstructions}
        togglePaymentInstructions={setBalanceInstructions}
        togglePaymentConfirmed={setConfirmed}
        setInvoice={setInvoice}
      />
      <AddBalanceStatus
        paymentConfirmed={confirmed}
        togglePaymentConfirmed={setConfirmed}
        invoice={invoice}
      />
    </View>
  );
};

export default CustomerDetails;

const ss = StyleSheet.create({
  main: {
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 34,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'ReadexPro-Medium',
    letterSpacing: 0.3,
    marginLeft: 5,
  },
});

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },

  main: {
    height: '100%',
    backgroundColor: '#fff',
  },
  detailsMain: { flex: 1, backgroundColor: '#fff', paddingVertical: 14 },
  detailItem: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  detailsItemName: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 16.6,
    color: '#738598',
    maxWidth: '90%',
    letterSpacing: 0.3,
  },
  detailsItemValue: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 17.5,
    marginTop: 2,
    color: '#30475e',
    maxWidth: '90%',
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
    borderRadius: 100,
    width: '90%',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A8F8',
    borderRadius: 100,
    height: 100,
    width: 100,
    // marginTop: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sep: {
    borderLeftColor: '#ddd',
    borderLeftWidth: 0.9,
    height: '55%',
    alignSelf: 'center',
  },
  initial: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 38,
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 0,
    justifyContent: 'center',
  },
  mainText: {
    fontFamily: 'Lato-Semibold',
    fontSize: 17,
    color: '#30475E',
    letterSpacing: -0.4,
  },
  name: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 21,
    marginTop: 16,
    textAlign: 'center',
  },
  addressWrapper: {
    width: '60%',
  },
  address: {
    fontFamily: 'Lato-Semibold',
    color: '#738598',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    width: '60%',
    // backgroundColor: 'rgba(185, 224, 255, 0.1)',
    marginTop: 0,
    paddingVertical: 15,
    borderRadius: 8,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsName: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 20,
    color: '#30475e',
  },
  statsMetric: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 16.5,
    color: '#738598',
    marginTop: 2,
    letterSpacing: 0.3,
  },
});
