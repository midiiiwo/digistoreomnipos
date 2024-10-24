/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';

import Search from '../../assets/icons/search.svg';
import CancelIcon from '../../assets/icons/cancel1.svg';
import { useActionCreator } from '../hooks/useActionCreator';
// import { customerData } from '../../test.data';
import { useSelector } from 'react-redux';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import Check from '../../assets/icons/check-outline.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'react-query';
import { Api } from '../api/axiosInstance';

const useGetSuppliers = merchant => {
  return useQuery(['suppliers', merchant], () => {
    return Api.get(`/inventory/suppliers/${merchant}/list`);
  });
};

function SupplierItem({ name, telephone, handlePress, active }) {
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

      {/* <View style={{ marginLeft: 'auto' }}>
        {active && (
          <Check style={styles.caret} height={24} width={24} stroke="#3C79F5" />
        )}
      </View> */}
    </Pressable>
  );
}

function Suppliers(props) {
  const { selectCustomer, setCustomerPayment, setSupplier } =
    useActionCreator();
  const { navigate, goBack } = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { supplier } = useSelector(state => state.expenses);

  const { data, isLoading } = useGetSuppliers(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { top, bottom } = useSafeAreaInsets();

  if (isLoading) {
    return <Loading />;
  }

  console.log('ddddd', data?.data?.data);

  const splitName = (supplier?.supplier_name || 'N/A').split(' ');
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
            navigate('Add Supplier');
          }}>
          <Text style={styles.text}>New Supplier</Text>
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
            placeholder="Search Supplier"
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
          {supplier && (
            <View style={styles.selectedCustomerWrapper}>
              <View>
                <Text style={styles.selectedCustomerName}>
                  {first + ' ' + second}
                </Text>
                <Text style={styles.selectedCustomerMobile}>
                  {supplier.supplier_contact}
                </Text>
              </View>
              <Pressable
                style={styles.cancelIconWrapper}
                onPress={() => {
                  setSupplier(null);
                }}>
                <CancelIcon style={styles.cancelIcon} />
              </Pressable>
            </View>
          )}
          <FlashList
            estimatedItemSize={52}
            contentContainerStyle={styles.list}
            data={handleSearch(searchTerm, data?.data?.data)}
            renderItem={({ item }) => {
              if (!item) {
                return;
              }
              const $splitName = (item.supplier_name || 'N/A').split(' ');
              const $first =
                ($splitName[0] || '').slice(0, 1).toUpperCase() +
                ($splitName[0] || '').slice(1).toLowerCase();
              const $second =
                ($splitName[1] || '').slice(0, 1).toUpperCase() +
                ($splitName[1] || '').slice(1).toLowerCase();
              return (
                <SupplierItem
                  name={$first + ' ' + $second || 'N/A'}
                  telephone={item.supplier_contact || 'N/A'}
                  handlePress={() => {
                    setSupplier(item);
                  }}
                  active={supplier?.supplier_id === item?.supplier_id}
                />
              );
            }}
            keyExtractor={(item, idx) => {
              if (!item) {
                return idx;
              }
              return item.supplier_id;
            }}
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
  text: { fontFamily: 'Inter-Medium', color: '#1942D8', fontSize: 15 },
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

  cancelIconWrapper: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  cancelIcon: { marginTop: 10 },
  selectedCustomerName: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  selectedCustomerMobile: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13,
    color: '#738598',
    marginTop: 2,
  },
  searchBox: {
    // flex: 1,
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
    // height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'IBMPlexSans-Medium',
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
    paddingHorizontal: 4,
    paddingLeft: 18,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 2,
    borderRadius: 4,
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
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 16,
    color: '#30475E',
    maxWidth: '85%',
    minWidth: '80%',
    letterSpacing: 0.4,
    // backgroundColor: 'red',
  },
  telephone: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 13.4,
    color: '#738598',
    marginTop: 4,
  },
  contactList: {
    paddingVertical: 10,
    height: '90%',
  },
});

export default Suppliers;
