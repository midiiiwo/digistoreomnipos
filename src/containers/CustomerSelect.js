/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import Lottie from 'lottie-react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import Search from '../../assets/icons/search.svg';
import CancelIcon from '../../assets/icons/cancel1.svg';
import { useActionCreator } from '../hooks/useActionCreator';
// import { customerData } from '../../test.data';
import { useSelector } from 'react-redux';
import { useGetMerchantCustomers } from '../hooks/useGetMerchantCustomers';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import Check from '../../assets/icons/check-outline.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomerItem({ name, telephone, handlePress, active, credit, debit }) {
  return (
    <Pressable style={styles.customerItem} onPress={handlePress}>
      <View
        style={[
          styles.circle,
          { backgroundColor: active ? '#DCD6F6' : '#98A8F8' },
        ]}>
        {!active && (
          <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
        )}
        {active && (
          <Check style={styles.caret} height={24} width={24} stroke="#3C79F5" />
        )}
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.telephone}>{telephone}</Text>
      </View>
      <View style={{ marginLeft: 'auto', marginRight: 12 }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            fontSize: 14,
            color: Number(credit) >= 0 ? '#22A699' : '#D14D72',
            textAlign: 'right',
          }}>
          {Number(credit) >= 0 ? '+' : ''}
          {credit}
        </Text>
      </View>
      {/* <View style={{ marginLeft: 'auto' }}>
        {active && (
          <Check style={styles.caret} height={24} width={24} stroke="#3C79F5" />
        )}
      </View> */}
    </Pressable>
  );
}

function CustomerSelect(props) {
  const { selectCustomer, setCustomerPayment } = useActionCreator();
  const { navigate, goBack } = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { customer } = useSelector(state => state.sale);
  function onCustomerSelect(customerItem) {
    selectCustomer(customerItem);
    setCustomerPayment({
      name: (customerItem && customerItem.customer_name) || '',
      phone: (customerItem && customerItem.customer_phone) || '',
      email: (customerItem && customerItem.customer_email) || '',
      id: (customerItem && customerItem.customer_id) || '',
    });
  }
  const { data, isLoading } = useGetMerchantCustomers(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { top, bottom } = useSafeAreaInsets();

  if (isLoading) {
    return <Loading />;
  }

  const splitName = ((customer && customer.customer_name) || 'N/A').split(' ');
  const first =
    (splitName[0] || '').slice(0, 1).toUpperCase() +
    (splitName[0] || '').slice(1).toLowerCase();
  const second =
    (splitName[1] || '').slice(0, 1).toUpperCase() +
    (splitName[1] || '').slice(1).toLowerCase();

  return (
    <View style={[styles.main, { paddingTop: top, paddingBottom: bottom }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigate('Add Customer');
          }}>
          <Text style={styles.text}>New Customer</Text>
        </Pressable>
        <Pressable onPress={() => goBack()} style={styles.cancelWrapper}>
          <Text style={styles.text}>Done</Text>
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <Pressable style={styles.searchBox}>
          <Search
            stroke="#888"
            height={27}
            width={27}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            style={styles.search}
            placeholder="Search Customer"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            cursorColor="blue"
          />
        </Pressable>
      </View>

      {isLoading && <Loading />}
      {!isLoading && (
        <View style={styles.contactList}>
          {customer && (
            <View style={styles.selectedCustomerWrapper}>
              <View>
                <Text style={styles.selectedCustomerName}>
                  {first + ' ' + second}
                </Text>
                <Text style={styles.selectedCustomerMobile}>
                  {customer.customer_phone}
                </Text>
              </View>
              <Pressable
                style={styles.cancelIconWrapper}
                onPress={() => {
                  setCustomerPayment(null);
                  selectCustomer(null);
                }}>
                <CancelIcon style={styles.cancelIcon} />
              </Pressable>
            </View>
          )}
          <FlatList
            // estimatedItemSize={52}
            contentContainerStyle={styles.list}
            data={handleSearch(searchTerm, data.data.data)}
            renderItem={({ item }) => {
              if (!item) {
                return;
              }
              const splitName = (item.customer_name || 'N/A').split(' ');
              const first =
                (splitName[0] || '').slice(0, 1).toUpperCase() +
                (splitName[0] || '').slice(1).toLowerCase();
              const second =
                (splitName[1] || '').slice(0, 1).toUpperCase() +
                (splitName[1] || '').slice(1).toLowerCase();
              return (
                <CustomerItem
                  name={first + ' ' + second || 'N/A'}
                  telephone={item.customer_phone || 'N/A'}
                  handlePress={() => {
                    onCustomerSelect(item);
                  }}
                  active={
                    (customer && customer.customer_id) ===
                    (item && item.customer_id)
                  }
                  credit={item.customer_credit_limit}
                  debit={item.customer_debit_balance}
                />
              );
            }}
            keyExtractor={(item, idx) => {
              if (!item) {
                return idx;
              }
              return item.customer_phone;
            }}
            // ItemSeparatorComponent={() => (
            //   <View
            //     style={{ borderBottomColor: '#eee', borderBottomWidth: 0.8 }}
            //   />
            // )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {},
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 14,
    // marginBottom: 28,
    // paddingBottom: 28,
    flex: 1,
    // height: '100%',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  indicatorStyle: {
    display: 'none',
  },
  cancelWrapper: { marginLeft: 'auto', PaddingTop: 12 },
  text: { fontFamily: 'SFProDisplay-Medium', color: '#1942D8', fontSize: 18 },
  // searchBox: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingRight: 14,
  //   borderRadius: 4,
  //   backgroundColor: '#F5F7F9',
  // },
  selectedCustomerWrapper: {
    marginTop: 0,
    borderColor: 'rgba(96, 126, 170, 0.5)',
    borderBottomWidth: 0.4,
    paddingLeft: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    // borderRadius: 3,
  },
  list: {
    // height: '90%',
    paddingBottom: 30,
  },

  // search: {
  //   height: '100%',
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   fontSize: 17,
  //   flex: 1,
  //   color: '#30475e',
  //   fontFamily: 'Lato-Semibold',
  // },
  cancelIconWrapper: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  cancelIcon: { marginTop: 10 },
  selectedCustomerName: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#30475E',
  },
  selectedCustomerMobile: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#738598',
    marginTop: 4,
  },
  searchBox: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 55,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    // height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 17.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'SFProDisplay-Regular',
    letterSpacing: 0.3,
    height: 50,
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  topIcons: {
    marginTop: 15,
    backgroundColor: 'red',
  },
  customerItem: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingLeft: 18,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 2,
    borderRadius: 4,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A8F8',
    borderRadius: 100,
    height: 55,
    width: 55,
    marginRight: 16,
  },
  initial: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  name: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 18.8,
    color: '#30475E',
    maxWidth: '85%',
    minWidth: '80%',
    letterSpacing: 0.4,
    // backgroundColor: 'red',
  },
  telephone: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14.4,
    color: '#738598',
    marginTop: 4,
  },
  contactList: {
    paddingVertical: 10,
    height: '90%',
  },
});

export default CustomerSelect;
