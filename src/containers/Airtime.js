/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  InteractionManager,
} from 'react-native';
import React from 'react';
import PaypointVendorCard from '../components/PaypointVendorCard';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export const mapAirtimeNameToCode = {
  'Mtn Top-up': 'MTN',
  'Vodafone Top-up': 'VODAFONE',
  'Glo Top-up': 'GLO',
  'AirtelTigo Top-up': 'AIRTEL',
};

const Airtime = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const airtime =
    route.params &&
    route.params.airtime &&
    route.params.airtime.filter(item =>
      user.user_permissions.includes(item.biller_id),
    );

  const [rerender, forceUpdate] = React.useReducer(x => x + 1, 0);

  const airtimePreviousData = route.params.airtimePreviousData;

  React.useEffect(() => {
    setTimeout(() => {
      forceUpdate();
    }, 300);
  }, []);

  React.useEffect(() => {
    if (airtimePreviousData) {
      console.log(airtimePreviousData);
      InteractionManager.runAfterInteractions(() => {
        SheetManager.show('buyAirtime', {
          payload: {
            airtime: airtimePreviousData.channel,
            airtimeCode: airtimePreviousData.channel,
            navigation,
            number: airtimePreviousData.recipientNumber,
            amount: airtimePreviousData.amount,
          },
        });
      });
    }
  }, [airtimePreviousData, navigation, rerender]);

  // console.log(item);

  return (
    <View style={styles.main}>
      <FlatList
        style={styles.flatgrid}
        contentContainerStyle={styles.container}
        data={airtime}
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
              Buy Airtime
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <PaypointVendorCard
              handlePress={() => {
                SheetManager.show('buyAirtime', {
                  payload: {
                    airtime: item.path,
                    airtimeCode: item.biller_id,
                    navigation,
                  },
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

export default Airtime;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F1F6F9',
  },
  flatgrid: {
    marginVertical: 12,
    marginTop: 10,
    backgroundColor: '#F1F6F9',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#F1F6F9',
  },
});
