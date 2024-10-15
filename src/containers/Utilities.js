/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, FlatList, View, Text } from 'react-native';
import React from 'react';
import PaypointVendorCard from '../components/PaypointVendorCard';
import { useSelector } from 'react-redux';

const Utilities = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);

  const utilities = route.params.utilities.filter(item =>
    user.user_permissions.includes(item.biller_id),
  );
  console.log('----,,,,', utilities);
  return (
    <View style={styles.main}>
      <FlatList
        style={styles.flatgrid}
        contentContainerStyle={styles.container}
        data={utilities}
        scrollEnabled={true}
        numColumns={3}
        ListHeaderComponent={() => (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 32,
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                fontSize: 22,
                color: '#30475e',
              }}>
              Pay Utilities
            </Text>
          </View>
        )}
        itemDimension={100}
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

export default Utilities;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F1F6F9',
  },
  flatgrid: {
    marginVertical: 10,
    marginTop: 10,
    backgroundColor: '#F1F6F9',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#F1F6F9',
  },
});
