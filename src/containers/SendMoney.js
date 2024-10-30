/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, FlatList, View, Text } from 'react-native';
import React from 'react';
import PaypointVendorCard from '../components/PaypointVendorCard';
import { useSelector } from 'react-redux';

const SendMoney = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const sendMoney = route.params.sendMoneyOptions.filter(item =>
    user.user_permissions.includes(item.biller_id),
  );
  return (
    <View style={styles.main}>
      <FlatList
        style={styles.flatgrid}
        contentContainerStyle={styles.container}
        data={sendMoney}
        scrollEnabled={true}
        numColumns={3}
        itemDimension={100}
        ListHeaderComponent={() => (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 32,
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Regular',
                fontSize: 20,
                color: '#30475e',
              }}>
              Send Money
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <PaypointVendorCard
              handlePress={() => {
                if (item?.biller_id === 'SBANK') {
                  navigation.navigate('Send Money Bank', {
                    bill: item.biller_name,
                    billCode: item.biller_id,
                    lookup: item.biller_id,
                  });
                  return;
                }
                navigation.navigate('Send Money', {
                  bill: item.biller_name,
                  billCode: item.biller_id,
                  lookup: item.biller_id,
                });
              }}
              bill={item.biller_id}
              path={item.biller_name}
            />
          );
        }}
        keyExtractor={item => {
          return item.name;
        }}
      />
    </View>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f1f6f9',
  },
  flatgrid: {
    marginVertical: 22,
    marginTop: 10,
    backgroundColor: '#f1f6f9',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#f1f6f9',
  },
});
