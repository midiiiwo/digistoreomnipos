/* eslint-disable react-native/no-inline-styles */
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import { useGetUserTicketHistory } from '../hooks/useGetUserTicketHistory';
import { useSelector } from 'react-redux';
import TicketHistoryItem from '../components/TicketHistoryItem';
import Loading from '../components/Loading';

const TicketHistory = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, refetch, isRefetching } = useGetUserTicketHistory(
    user.login,
  );
  if (isLoading) {
    return <Loading />;
  }

  const ticketHistory = (data && data.data && data.data.data) || [];
  return (
    <View style={styles.main}>
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return <TicketHistoryItem item={item} />;
        }}
        style={{ flex: 1 }}
        data={ticketHistory}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          // backgroundColor: '#fff',
        }}
      />
    </View>
  );
};

export default TicketHistory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
