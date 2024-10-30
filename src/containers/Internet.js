/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, FlatList, View, Text } from 'react-native';
import React from 'react';
import PaypointVendorCard from '../components/PaypointVendorCard';
import { useSelector } from 'react-redux';

const Internet = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const internet = route?.params?.internet?.filter(item =>
    user.user_permissions.includes(item.biller_id),
  );
  return (
    <View style={styles.main}>
      <FlatList
        style={styles.flatgrid}
        contentContainerStyle={styles.container}
        data={internet}
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
              Buy Internet
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <PaypointVendorCard
              handlePress={() => {
                navigation.navigate('Bill Details', {
                  bill: item.biller_name,
                  billCode: item.biller_id,
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

export default Internet;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F1F6F9',
  },
  flatgrid: {
    marginVertical: 32,
    marginTop: 10,
    backgroundColor: '#F1F6F9',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#F1F6F9',
  },
});
