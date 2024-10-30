/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
  TextInput,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import { useGetRecentPaypointTransactions } from '../hooks/useGetRecentPaypointTransactions';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import RecentCard from '../components/RecentCard';
import Search from '../../assets/icons/search.svg';

import Filter from '../../assets/icons/filter.svg';
import { handleSearch } from '../utils/shared';
import { SheetManager } from 'react-native-actions-sheet';

const PaypointTransactionHistory = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const options = route.params.options;
  // const endDate = moment(new Date()).format('DD-MM-YYYY');
  // const startDate = moment(
  //   new Date().setDate(new Date().getDate() - 30),
  // ).format('DD-MM-YYYY');

  const [searchTerm, setSearchTerm] = React.useState('');

  // const [startDate, setStartDate] = React.useState(
  //   new Date(new Date().setDate(d.getDate() - 30)),
  // );
  // const [endDate, setEndDate] = React.useState(new Date());
  const { startDate, endDate } = useSelector(state => state.paypoint);

  console.log(startDate);

  const {
    data: recentTransactions,
    isLoading,
    refetch,
    isFetching,
  } = useGetRecentPaypointTransactions(
    user.merchant,
    user.login,
    moment(startDate).format('DD-MM-YYYY'),
    moment(endDate).format('DD-MM-YYYY'),
    user.user_merchant_group === 'Administrators',
  );

  React.useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  if (isLoading) {
    return <Loading />;
  }

  const totalAmount =
    recentTransactions &&
    recentTransactions.data &&
    recentTransactions.data.data.reduce((acc, curr) => {
      return acc + Number(curr.AMOUNT);
    }, 0);

  return (
    <View style={styles.main}>
      {/* <View style={styles.headerWrapper}>
        <Text style={styles.header}>Transaction History</Text>
      </View> */}
      <View style={styles.topIcons}>
        <View style={styles.searchBox}>
          <Search
            stroke="#131517"
            height={20}
            width={20}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            style={styles.search}
            placeholder="Search Transaction"
            placeholderTextColor="#929AAB"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Pressable
            onPress={() => {
              SheetManager.show('paypointHistorySheet');
            }}>
            <Filter stroke="#30475e" height={32} width={32} />
          </Pressable>
        </View>
        {/* <View style={styles.viewSpace} /> */}
        {/* <Pressable
          onPress={() => {
            SheetManager.show('paypointHistorySheet');
          }}>
          <Filter stroke="#30475e" height={33} width={33} />
        </Pressable> */}
      </View>
      {/* <View style={styles.dateMain}>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={'From'}
            placeholder={'Start date'}
            mode={'date'}
            migrate
            value={startDate}
            onChange={val => {
              setStartDate(val);
            }}
          />
        </View>
        <View style={styles.dateSeparator} />
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={'To'}
            placeholder={'End date'}
            mode={'date'}
            onChange={val => {
              setEndDate(val);
            }}
            migrate
            value={endDate}
          />
        </View>
      </View> */}

      <FlatList
        contentContainerStyle={{ paddingBottom: 12 }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
        }
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                marginBottom: 10,
                alignItems: 'flex-end',
                paddingRight: 12,
                marginTop: 16,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#748DA6',
                  fontSize: 15,
                }}>
                Total Transactions:{' '}
                {recentTransactions &&
                  recentTransactions.data &&
                  recentTransactions.data.data.length}
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#748DA6',
                  fontSize: 15,
                  marginTop: 4,
                }}>
                Total Amount: GHS {totalAmount.toFixed(2)}
              </Text>
            </View>
          );
        }}
        data={[
          ...handleSearch(
            searchTerm,
            recentTransactions &&
              recentTransactions.data &&
              recentTransactions.data.data,
          ),
        ]}
        renderItem={({ item }) => (
          <RecentCard item={item} navigation={navigation} options={options} />
        )}
      />
    </View>
  );
};

export default PaypointTransactionHistory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
  },
  dateWrapper: {
    flex: 1,
  },
  headerWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingTop: 6,
  },
  header: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#30475e',
  },
  dateMain: {
    flexDirection: 'row',
  },
  dateSeparator: {
    marginHorizontal: 8,
  },
  viewSpace: {
    width: 16,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingLeft: 8,
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
    fontSize: 15,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.1,
    marginTop: 2,
  },
});
