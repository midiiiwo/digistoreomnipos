/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import ActionButton from 'react-native-action-button';
import { useNavigation } from '@react-navigation/native';
import { useGetEventTickets } from '../hooks/useGetEventTickets';
import Loading from '../components/Loading';
import EventTicketItem from '../components/EventTicketItem';

const EventTickets = ({ route }) => {
  const navigation = useNavigation();
  const { event_code, event_id } = route.params;
  const { data, isLoading, refetch, isRefetching } =
    useGetEventTickets(event_code);
  if (isLoading) {
    return <Loading />;
  }

  const tickets = ((data && data.data && data.data.data) || []).filter(i => i);

  return (
    <View style={styles.main}>
      <FlatList
        data={tickets}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return <EventTicketItem item={item} />;
        }}
      />
      <ActionButton
        buttonColor="#7091F5"
        onPress={() => {
          navigation.navigate('Add Event Ticket', { event_id, event_code });
        }}
      />
    </View>
  );
};

export default EventTickets;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
  },
});
