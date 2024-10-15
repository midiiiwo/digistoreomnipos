/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useGetAllOrders } from '../hooks/useGetAllOrders';
import Loading from '../components/Loading';
// import SegmentedControl from '@react-native-segmented-control/segmented-control';
import OrderItem from '../components/OrderItem';
import moment from 'moment';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import { isArray } from 'lodash';
import CaretDown from '../../assets/icons/caret-down.svg';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const Orders = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const { startDate, endDate, orderOutlet } = useSelector(
    state => state.orders,
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [orders, setOrders] = React.useState();
  const ordersHistory = useGetAllOrders(setOrders);
  const tabValues = ['Paid', 'Outstanding Payments', 'Pending', 'Completed'];
  const { data, isLoading } = useGetMerchantOutlets(user.merchant);
  const [orderStatus, setOrderStatus] = React.useState('Paid');

  const [openMenu, setOpenMenu] = React.useState(false);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     refetch();
  //   });
  //   return unsubscribe;
  // }, [navigation, refetch]);

  React.useEffect(() => {
    let outlets = data?.data?.data || [];
    outlets = outlets.filter(i => {
      if (i) {
        return (
          (user.user_assigned_outlets &&
            user.user_assigned_outlets.includes(i.outlet_id)) ||
          user.user_merchant_group === 'Administrators'
        );
      }
      return false;
    });

    let outlet = orderOutlet && orderOutlet.value;
    if (!outlet || outlet === 'ALL') {
      outlet = outlets.map(i => {
        if (!i) {
          return;
        }
        return i.outlet_id;
      });
    }

    if (typeof outlet === 'object' && isArray(outlet)) {
      try {
        outlet = outlet.toString();
      } catch (error) {}
    }

    ordersHistory.mutate({
      merchant: user.merchant,
      outlet: outlet,
      user: user.login,
      start_date: moment(startDate).format('DD-MM-YYYY'),
      end_date: moment(endDate).format('DD-MM-YYYY'),
      isAdmin: user.user_merchant_group === 'Administrators',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, orderOutlet]);

  if (
    orders &&
    orders.data &&
    orders.data.filter(i => i != null).length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingTop: Dimensions.get('window').height * 0.1,
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-bold',
            fontSize: 18,
            color: '#30475e',
          }}>
          You have no orders recorded
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first order
        </Text>
        <Pressable
          style={[
            styles.btn,
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
    <View style={styles.main}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <TextInput
          style={{
            height: 50,
            flex: 1,
            borderBottomColor: '#3572EF',
            borderBottomWidth: 1.8,
            fontFamily: 'ReadexPro-Regular',
            paddingHorizontal: 14,
            color: '#30475e',
          }}
          placeholder="Search item, customer, salesperson etc"
          placeholderTextColor="#bbb"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={{ marginRight: 16, marginLeft: 20 }}>
          <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
            <MenuTrigger
              onPress={() => setOpenMenu(!openMenu)}
              children={
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#fff',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: 0,
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'ReadexPro-Medium',
                      fontSize: 16.5,
                    }}>
                    {orderStatus}
                  </Text>
                  <CaretDown fill="#000" />
                </View>
              }
            />
            <MenuOptions
              optionsContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                paddingBottom: 10,
                borderRadius: 6,
                // elevation: 0,
              }}>
              {tabValues.map(i => (
                <MenuOption
                  key={i.label}
                  style={{ marginVertical: 10 }}
                  onSelect={async () => {
                    setOpenMenu(false);
                    setOrderStatus(i);
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'ReadexPro-Regular',
                      fontSize: 15,
                    }}>
                    {i}
                  </Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={styles.segmentedControlWrapper}>
        {/* <SegmentedControl
          values={tabValues}
          selectedIndex={segment}
          onChange={event => {
            setSegment(event.nativeEvent.selectedSegmentIndex);
          }}
          backgroundColor="rgba(225, 225, 225, 0.0)"
          tintColor="#1942D8"
          activeFontStyle={styles.activeText}
          fontStyle={styles.inactiveText}
          style={styles.arbitrary}
          appearance="light"
        /> */}
        {/* <Pressable
          style={styles.filterWrapper}
          onPress={() => SheetManager.show('dateFilter')}>
          <Filter stroke="#30475e" height={29} width={29} />
        </Pressable>
        <Pressable style={styles.scannerWrapper}>
          <Qr stroke="#30475e" height={25} width={25} />
        </Pressable> */}
      </View>
      {(ordersHistory.isLoading || isLoading) && <Loading />}
      {!ordersHistory.isLoading && !isLoading && (
        <View style={styles.listWrapper}>
          <FlatList
            estimatedItemSize={130}
            style={{ flex: 1 }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    paddingTop: Dimensions.get('window').height * 0.2,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-bold',
                      fontSize: 18,
                      color: '#30475e',
                    }}>
                    You have no orders recorded
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Medium',
                      fontSize: 15,
                      color: '#748DA6',
                      marginTop: 10,
                    }}>
                    Create your first order
                  </Text>
                  <Pressable
                    style={[
                      styles.btn,
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
            }}
            refreshControl={
              <RefreshControl
                refreshing={ordersHistory.isLoading}
                onRefresh={() => {
                  ordersHistory.mutate({
                    merchant: user.merchant,
                    outlet: user.outlet,
                    user: user.login,
                    start_date: moment(startDate).format('DD-MM-YYYY'),
                    end_date: moment(endDate).format('DD-MM-YYYY'),
                    isAdmin: user.user_merchant_group === 'Administrators',
                  });
                }}
              />
            }
            contentContainerStyle={styles.list}
            data={orders && orders.data}
            keyExtractor={(item, index) => {
              if (!item) {
                return index;
              }
              return item.order_no;
            }}
            renderItem={({ item, index }) => {
              if (!item) {
                return <></>;
              }
              // if (item.payment_channel === 'PAYLATER') {
              //   item = {
              //     ...item,
              //     order_status: 'TO BE PAID LATER',
              //   };
              // }

              if (
                orderStatus === 'Paid' &&
                item.order_status !== 'PAID' &&
                item.order_status !== 'COMPLETED' &&
                item.order_status !== 'PICKUP_READY' &&
                item.order_status !== 'BACKOFF_PROCCESSING' &&
                item.order_status !== 'CANCELLED' &&
                item.order_status !== 'DISPATCHED'
              ) {
                return <></>;
              }
              if (
                orderStatus === 'Pending' &&
                (item.order_status === 'PAID' ||
                  item.order_status === 'COMPLETED' ||
                  item.order_status === 'DELIVERED' ||
                  item.order_status === 'BACKOFF_PROCCESSING' ||
                  item.order_status === 'PICKUP_READY' ||
                  item.order_status === 'DISPATCHED')
              ) {
                return <></>;
              }
              if (
                orderStatus === 'Completed' &&
                item.order_status !== 'COMPLETED'
              ) {
                return <></>;
              }
              if (
                orderStatus === 'Outstanding Payments' &&
                item.order_status !== 'PAYMENT_DEFERRED'
              ) {
                return <></>;
              }
              return (
                <OrderItem
                  item={item}
                  navigation={navigation}
                  key={item.order_no}
                />
              );
            }}
            scrollEnabled
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 4,
    backgroundColor: '#fff',
    marginBottom: 2,
    paddingHorizontal: 18,
    borderRadius: 6,
    // alignItems: 'center',
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 5,
    width: '40%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
  },
  listWrapper: {
    flex: 1,
    marginTop: 6,
  },
  details: {
    // backgroundColor: 'orange',
    maxWidth: '50%',
  },
  status: {
    marginLeft: 'auto',
  },
  orderStatus: {
    fontFamily: 'Inter-Medium',
    color: '#30475e',
  },
  statusIndicator: {
    height: 8,
    width: 8,
    borderRadius: 100,
    marginRight: 4,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingRight: 14,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    // position: 'absolute',
    // right: 18,
  },
  name: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    marginBottom: 2,
    fontSize: 16,
  },
  viewSpace: {
    width: 16,
  },
  filterWrapper: {
    padding: 8,
    marginLeft: 4,
  },
  scannerWrapper: {
    // marginRight: 'auto',
    // marginLeft: 8,
    marginRight: 6,
    padding: 8,
  },
  segmentedControlWrapper: {
    // marginRight: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    // paddingLeft: 8,
    paddingHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#fff',

    marginTop: 12,
    width: '100%',
  },
  arbitrary: {
    height: 60,
    flex: 1,
  },
  activeText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 20,
    color: '#30475e',
    fontFamily: 'ReadexPro-Medium',
    fontWeight: '100',
  },
  dateWrapper: {
    marginHorizontal: 12,
    marginTop: 14,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchBox: {
    flexDirection: 'row',
    width: '85%',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 5,
    backgroundColor: '#F5F7F9',
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 18,
    fontSize: 14,
    flex: 1,
    color: '#30475e',
    fontFamily: 'Inter-Regular',
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  count: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 15,
    // marginTop: 8,
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
});

export default Orders;
