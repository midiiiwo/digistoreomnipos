/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';

import { useGetMerchantCustomers } from '../hooks/useGetMerchantCustomers';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { handleSearch } from '../utils/shared';
import Search from '../../assets/icons/search.svg';

// import SearchIcon from '../../assets/icons/search';
import AddCircle from '../../assets/icons/add-circle-dark';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import CustomStatusBar from '../components/StatusBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomerItem({ name, telephone, handlePress, credit }) {
  const splitName = name.split(' ');
  const first =
    (splitName[0] || '').slice(0, 1).toUpperCase() +
    (splitName[0] || '').slice(1).toLowerCase();
  const second =
    (splitName[1] || '').slice(0, 1).toUpperCase() +
    (splitName[1] || '').slice(1).toLowerCase();

  return (
    <Pressable style={styles.customerItem} onPress={handlePress}>
      <View style={styles.circle}>
        <Text style={styles.initial}>{first.slice(0, 1)}</Text>
      </View>
      <View>
        <Text style={styles.name} numberOfLines={1}>
          {first} {second}
        </Text>
        <Text style={styles.telephone}>{telephone}</Text>
      </View>

      <View style={{ marginLeft: 'auto', marginRight: 12 }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 14,
            color: Number(credit) >= 0 ? '#22A699' : '#D14D72',
            textAlign: 'right',
          }}>
          {Number(credit) >= 0 ? '+' : ''}
          {credit}
        </Text>
      </View>
    </Pressable>
  );
}

const Customers = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data, isLoading, isRefetching, refetch } = useGetMerchantCustomers(
    user.merchant,
  );

  const [isPending, startTransition] = React.useTransition();

  const [storeCreditActive, setStoreCreditActive] = React.useState(false);
  const [storeDebitActive, setDebitActive] = React.useState(false);
  const [storeCreditActive_, setStoreCreditActive_] = React.useState(false);
  const [storeDebitActive_, setDebitActive_] = React.useState(false);
  const { top } = useSafeAreaInsets();

  if (isLoading || isPending) {
    return <Loading />;
  }

  const customersData = ((data && data.data && data.data.data) || []).filter(
    item => {
      if (!item) {
        return false;
      }
      if (storeCreditActive && !storeDebitActive) {
        return Number(item.customer_credit_limit) > 0;
      }
      if (storeDebitActive && !storeCreditActive) {
        return Number(item.customer_credit_limit) < 0;
      }
      return true;
    },
  );

  const totalStoreCredit = customersData.reduce((a, c) => {
    if (Number(c?.customer_credit_limit) > 0) {
      return a + Number(c.customer_credit_limit);
    }
    return a;
  }, 0);

  const totalStoreDebit = customersData.reduce((a, c) => {
    if (Number(c?.customer_credit_limit) < 0) {
      return a + Number(c.customer_credit_limit);
    }
    return a;
  }, 0);

  if (
    data?.data?.data?.filter(i => i !== null)?.length === 0 ||
    !data?.data?.data
  ) {
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
            fontFamily: 'ReadexPro-bold',
            fontSize: 18,
            color: '#30475e',
          }}>
          You have no customers recorded
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first customer
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
            navigation.navigate('Add Customer');
          }}>
          <Text style={styles.signin}>Create New Customer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.main, { paddingTop: top }]}>
      {Platform.OS === 'android' && (
        <CustomStatusBar backgroundColor="#98A8F8" />
      )}
      <View style={styles.listWrapper}>
        <View style={styles.topIcons}>
          <Pressable style={styles.searchBox}>
            <Search
              stroke="#131517"
              height={20}
              width={20}
              style={{ marginLeft: 12 }}
            />
            <TextInput
              style={styles.search}
              placeholder="Search customer"
              placeholderTextColor="#929AAB"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </Pressable>
          <View style={styles.viewSpace} />
          <Pressable
            onPress={() => {
              if (!user.user_permissions.includes('ADDCUST')) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              navigation.navigate('Add Customer');
            }}>
            <AddCircle fill="#98A8F8" />
          </Pressable>
        </View>
        <View style={{ height: Dimensions.get('window').height - 200 }}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isLoading || isRefetching}
                onRefresh={() => {
                  refetch();
                }}
              />
            }
            estimatedListSize={Dimensions.get('window').height - 200}
            contentContainerStyle={{
              borderRadius: 14,
              paddingBottom: Dimensions.get('window').height * 0.2,
            }}
            data={handleSearch(searchTerm, customersData, 'customer_name')}
            style={{ backgroundColor: '#fff' }}
            showsVerticalScrollIndicator
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => {
              if (!item) {
                return;
              }

              return (
                <CustomerItem
                  name={item.customer_name || 'N/A'}
                  telephone={item.customer_phone || 'N/A'}
                  credit={item.customer_credit_limit}
                  debit={item.customer_debit_balance}
                  creditActive={storeCreditActive}
                  debitActive={storeDebitActive}
                  handlePress={() => {
                    if (!user.user_permissions.includes('VIEWCUST')) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Upgrade Needed',
                        textBody:
                          "You don't have access to this feature. Please upgrade your account",
                      });
                      return;
                    }
                    navigation.navigate('Customer Details', {
                      id: item.customer_id,
                    });
                  }}
                />
              );
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          borderTopWidth: 0.5,
        }}>
        <Pressable
          onPress={() => {
            setStoreCreditActive_(!storeCreditActive_);
            startTransition(() => {
              setStoreCreditActive(!storeCreditActive);
            });
          }}
          style={{
            width: '50%',
            paddingVertical: 12,
            alignItems: 'center',
            backgroundColor: storeCreditActive_ ? '#22A699' : '#fff',
          }}>
          <Text
            style={{
              marginTop: 2,
              fontFamily: 'ReadexPro-Regular',
              fontSize: 14,
              color: storeCreditActive_ ? '#fff' : '#30475e',
            }}>
            Store Credit
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontFamily: 'ReadexPro-Medium',
              fontSize: 14,
              color: storeCreditActive ? '#fff' : '#22A699',
            }}>
            GHS {new Intl.NumberFormat().format(totalStoreCredit)}
          </Text>
        </Pressable>
        <View style={{ borderLeftWidth: 0.7, borderLeftColor: '#ddd' }} />
        <Pressable
          onPress={() => {
            setDebitActive_(!storeDebitActive_);
            startTransition(() => {
              setDebitActive(!storeDebitActive);
            });
          }}
          style={{
            width: '50%',
            paddingVertical: 12,
            alignItems: 'center',
            backgroundColor: storeDebitActive_ ? '#D14D72' : '#fff',
          }}>
          <Text
            style={{
              marginTop: 2,
              fontFamily: 'ReadexPro-Regular',
              fontSize: 14,
              color: storeDebitActive_ ? '#fff' : '#30475e',
            }}>
            Debtors
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontFamily: 'ReadexPro-Medium',
              fontSize: 14,
              color: storeDebitActive ? '#fff' : '#D14D72',
            }}>
            GHS {new Intl.NumberFormat().format(totalStoreDebit)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listWrapper: {
    paddingHorizontal: 10,
  },
  customerItem: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingLeft: 18,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    // marginBottom: 2,
  },
  btn: {
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
    fontFamily: 'ReadexPro-bold',
    fontSize: 16,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 6,
    marginTop: 22,
    height: 52,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.1,
    marginTop: 2,
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  viewSpace: {
    width: 10,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A8F8',
    borderRadius: 100,
    height: 48,
    width: 48,
    marginRight: 16,
  },
  initial: {
    fontFamily: 'ReadexPro-bold',
    fontSize: 20,
    color: '#fff',
    marginTop: 2,
  },
  name: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15.5,
    color: '#3B3E3D',
    maxWidth: '85%',
    minWidth: '80%',
    letterSpacing: -0.2,
    // backgroundColor: 'red',
  },
  telephone: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 12,
    color: '#7B8FA1',
    marginTop: -2,
    letterSpacing: 0.3,
  },
  separator: {
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
  },
});

export default Customers;
