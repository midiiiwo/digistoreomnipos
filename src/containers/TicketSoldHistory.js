/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  RefreshControl,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useGetMerchantTicketsSold } from '../hooks/useGetMerchantTicketsSold';
import moment from 'moment';
import Search from '../../assets/icons/search.svg';
import { SheetManager } from 'react-native-actions-sheet';
import Filter from '../../assets/icons/filter.svg';
import TicketSoldItem from '../components/TicketSoldItem';
import { handleSearch } from '../utils/shared';

const TicketSoldHistory = () => {
  const { user } = useSelector(state => state.auth);
  const { sStartDate, sEndDate } = useSelector(state => state.transactions);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data, isLoading, refetch, isRefetching } = useGetMerchantTicketsSold(
    user.merchant,
    moment(sStartDate).format('DD-MM-YYYY'),
    moment(sEndDate).format('DD-MM-YYYY'),
  );
  if (isLoading) {
    return <Loading />;
  }

  const ticketHistory = (data && data.data && data.data.data) || [];
  return (
    <View style={styles.main}>
      <View style={{ backgroundColor: '#fff', paddingBottom: 12 }}>
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
                SheetManager.show('saleHistory');
              }}>
              <Filter stroke="#30475e" height={32} width={32} />
            </Pressable>
          </View>
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return <TicketSoldItem item={item} />;
        }}
        style={{ flex: 1 }}
        data={handleSearch(searchTerm, ticketHistory)}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
      />
    </View>
  );
};

export default TicketSoldHistory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
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
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
