import React from 'react';
import { Text, View } from 'react-native';
import { useGetAllTickets } from '../hooks/useGetAllTickets';
import { useSelector } from 'react-redux';

const Ticket = () => {
  const { user } = useSelector(state => state.auth);
  useGetAllTickets(user.login);
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
};

export default Ticket;
