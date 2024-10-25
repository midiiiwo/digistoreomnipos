/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetMerchantOutlets } from '../../hooks/useGetMerchantOutlets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

function OutletSheet(props) {
  const { user } = useSelector(state => state.auth);
  const { data } = useGetMerchantOutlets(user.user_merchant_id);

  const { setCurrentUser, setCurrentOutlet } = useActionCreator();
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Select Store</Text>
        </View>

        <FlatList
          data={data && data.data && data.data.data}
          renderItem={({ item }) => {
            if (!item) {
              return;
            }
            if (
              user.user_assigned_outlets &&
              !user.user_assigned_outlets.includes(item.outlet_id) &&
              user.user_merchant_group !== 'Administrators'
            ) {
              return;
            }
            return (
              <Pressable
                onPress={async () => {
                  AsyncStorage;
                  await AsyncStorage.setItem('outlet', JSON.stringify(item));
                  setCurrentUser({
                    ...user,
                    outlet: item.outlet_id || '',
                  });
                  setCurrentOutlet(item);
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Outlet Changed',
                    textBody: `Outlet change success. Current outlet is ${item.outlet_name}`,
                  });
                  SheetManager.hide('outlets');
                }}
                style={{
                  borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                  borderBottomWidth: 0.3,
                  alignItems: 'center',
                  paddingVertical: 18,

                  paddingHorizontal: 18,
                  flexDirection: 'row',
                }}>
                <View style={{ maxWidth: '88%' }}>
                  <Text style={styles.channelText}>
                    {item && item.outlet_name}
                  </Text>
                  <Text style={styles.address}>
                    {item && item.outlet_address}
                  </Text>
                </View>
                {/* <CaretRight style={styles.caret} /> */}
              </Pressable>
            );
          }}
        />
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: '#30475E',
    letterSpacing: -0.2,
  },

  channelText: {
    fontFamily: 'Lato-Semibold',
    fontSize: 17,
    color: '#30465e',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'Lato-Medium',
    fontSize: 14,
    color: '#687980',
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default OutletSheet;
