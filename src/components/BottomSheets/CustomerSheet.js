/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import Search from '../../../assets/icons/search.svg';
import CancelIcon from '../../../assets/icons/cancel1.svg';
import { useActionCreator } from '../../hooks/useActionCreator';
// import { customerData } from '../../test.data';
import { useSelector } from 'react-redux';
import { useGetMerchantCustomers } from '../../hooks/useGetMerchantCustomers';
import { handleSearch } from '../../utils/shared';
import Loading from '../Loading';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';

function CustomerItem({ name, telephone, handlePress }) {
  return (
    <Pressable style={styles.customerItem} onPress={handlePress}>
      <View style={styles.circle}>
        <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.telephone}>{telephone}</Text>
      </View>
    </Pressable>
  );
}

function CustomerSheet(props) {
  const { selectCustomer, setCustomerPayment } = useActionCreator();
  const { navigate } = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { customer } = useSelector(state => state.sale);
  function onCustomerSelect(customerItem) {
    selectCustomer(customerItem);
    setCustomerPayment({
      name: (customerItem && customerItem.customer_name) || '',
      phone: (customerItem && customerItem.customer_phone) || '',
      email: (customerItem && customerItem.customer_email) || '',
    });
  }
  const { data, isLoading } = useGetMerchantCustomers(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={[styles.containerStyle]}
      indicatorStyle={styles.indicatorStyle}
      springOffset={0}
      snapPoints={['97']}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigate('Add Customer');
              SheetManager.hide('customers');
            }}>
            <Text style={styles.text}>New Customer</Text>
          </Pressable>
          <Pressable
            onPress={() => SheetManager.hide('customers')}
            style={styles.cancelWrapper}>
            <Text style={styles.text}>Done</Text>
          </Pressable>
        </View>
        <Pressable style={styles.searchBox}>
          <Search
            stroke="#888"
            height={27}
            width={27}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            style={styles.search}
            placeholder="Search product"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            cursorColor="blue"
          />
        </Pressable>

        {isLoading && <Loading />}
        {!isLoading && (
          <View style={styles.contactList}>
            {customer && (
              <View style={styles.selectedCustomerWrapper}>
                <View>
                  <Text style={styles.selectedCustomerName}>
                    {customer.customer_name}
                  </Text>
                  <Text style={styles.selectedCustomerMobile}>
                    {customer.customer_phone}
                  </Text>
                </View>
                <Pressable
                  style={styles.cancelIconWrapper}
                  onPress={() => selectCustomer(null)}>
                  <CancelIcon style={styles.cancelIcon} />
                </Pressable>
              </View>
            )}
            <FlashList
              estimatedItemSize={52}
              contentContainerStyle={styles.list}
              data={handleSearch(searchTerm, data.data.data)}
              renderItem={({ item }) => {
                if (!item) {
                  return;
                }
                return (
                  <CustomerItem
                    name={item.customer_name || 'N/A'}
                    telephone={item.customer_phone || 'N/A'}
                    handlePress={() => onCustomerSelect(item)}
                  />
                );
              }}
              keyExtractor={(item, idx) => {
                if (!item) {
                  return idx;
                }
                return item.customer_phone;
              }}
            />
          </View>
        )}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {},
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
    // height: '100%',
  },
  header: { flexDirection: 'row', marginBottom: 18 },
  indicatorStyle: {
    display: 'none',
  },
  cancelWrapper: { marginLeft: 'auto', PaddingTop: 12 },
  text: { fontFamily: 'Inter-Medium', color: '#1942D8', fontSize: 15 },
  // searchBox: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingRight: 14,
  //   borderRadius: 4,
  //   backgroundColor: '#F5F7F9',
  // },
  selectedCustomerWrapper: {
    marginTop: 12,
    borderColor: 'rgba(96, 126, 170, 0.5)',
    borderBottomWidth: 0.4,
    paddingLeft: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    // borderRadius: 3,
  },
  list: {
    // height: '90%',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 4,
    backgroundColor: '#F6F7F9',
    height: 50,
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
    fontFamily: 'Lato-Semibold',
    fontSize: 16,
    color: '#30475E',
  },
  selectedCustomerMobile: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#73777B',
  },
  search: {
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#30475e',
    fontFamily: 'Lato-Medium',
    backgroundColor: '#F5F7F9',
    marginHorizontal: 4,
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
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 16,
    height: 52,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A8F8',
    borderRadius: 100,
    height: 50,
    width: 50,
    marginRight: 16,
  },
  initial: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  name: {
    fontFamily: 'Lato-Semibold',
    fontSize: 17,
    color: '#30475E',
  },
  telephone: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#73777B',
    marginTop: 2,
  },
  contactList: {
    paddingVertical: 10,
    height: '90%',
  },
});

export default CustomerSheet;

