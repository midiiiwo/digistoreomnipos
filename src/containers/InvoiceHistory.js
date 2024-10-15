/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import Search from '../../assets/icons/search.svg';
import React from 'react';
import { useGetInvoiceHistory } from '../hooks/useGetInvoiceHistory';
import { useSelector } from 'react-redux';
import Filter from '../../assets/icons/filter';
import { SheetManager } from 'react-native-actions-sheet';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import moment from 'moment';
import InvoiceItem from '../components/InvoiceItem';

const InvoiceHistory = () => {
  const { user } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { IVStartDate, IVEndDate } = useSelector(state => state.transactions);
  const { data, isLoading, refetch, isFetching } = useGetInvoiceHistory(
    user.merchant,
    moment(IVStartDate).format('DD-MM-YYYY'),
    moment(IVEndDate).format('DD-MM-YYYY'),
  );
  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IVStartDate, IVEndDate]);
  if (isLoading) {
    return <Loading />;
  }

  const totalAmount =
    data &&
    data.data &&
    data.data.data &&
    data.data.data.reduce((acc, curr) => {
      if (!curr) {
        return acc;
      }
      return acc + Number(curr.CURRENCY_AMOUNT);
    }, 0);
  console.log('data====>>>>>', data.data);
  return (
    <View style={{ backgroundColor: '#fff', paddingBottom: 12, flex: 1 }}>
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
            placeholder="Search transaction"
            placeholderTextColor="#929AAB"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Pressable
            onPress={() => {
              SheetManager.show('InvoiceFilter');
            }}>
            <Filter stroke="#30475e" height={32} width={32} />
          </Pressable>
        </View>
      </View>
      <FlatList
        estimatedItemSize={160}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch();
            }}
            refreshing={isLoading || isFetching}
          />
        }
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                // marginBottom: 6,
                alignItems: 'flex-end',
                paddingRight: 12,
                backgroundColor: '#fff',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#748DA6',
                  fontSize: 16.5,
                }}>
                Total Transactions:{' '}
                {data &&
                  data.data &&
                  data.data.data.filter(i => i !== null).length}
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#748DA6',
                  fontSize: 16.5,
                  marginTop: 4,
                }}>
                Total Amount: GHS{' '}
                {new Intl.NumberFormat().format(totalAmount.toFixed(2))}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5 }} />
        )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 24 }}
        data={handleSearch(searchTerm, data && data.data && data.data.data)}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return <InvoiceItem item={item} />;
        }}
      />
    </View>
  );
};

export default InvoiceHistory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Semibold',
    color: '#30475e',
    fontSize: 16,
  },
  img: {
    height: 32,
    width: 32,
    borderRadius: 24,
    // borderWidth: 0.7,
    // borderColor: '#ddd',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    // marginTop: 6,
  },
  height: 38,
  width: 38,
  borderRadius: 24,
  // borderWidth: 0.7,
  // borderColor: '#ddd',
  topIcons: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 18,
  },
  searchBox: {
    flex: 1,
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
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 100,
    marginRight: 4,
    backgroundColor: '#87C4C9',
  },

  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    // paddingHorizontal: 8,
    // paddingRight: 12,
    // paddingVertical: 5,
    // backgroundColor: '#f9f9f9',
    // marginRight: 8,
  },
  dateMain: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  dateSeparator: {
    marginHorizontal: 8,
  },
  dateWrapper: {
    flex: 1,
    paddingBottom: 0,
    height: 85,
  },
});
