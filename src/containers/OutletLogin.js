/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
// import { SheetManager } from 'react-native-actions-sheet';

import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Check from '../../assets/icons/check-outline.svg';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import _, { isArray } from 'lodash';

function OutletLogin(props) {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantOutlets(
    user.user_merchant_id,
  );

  React.useEffect(() => {
    (async () => {
      if (data && data.data && data.data.data) {
        let outlets = data && data.data && data.data.data;
        outlets = outlets.filter(i => {
          return (
            (i && user.user_assigned_outlets.includes(i.outlet_id)) ||
            (i && user.user_merchant_group === 'Administrators')
          );
        });
        if (isArray(outlets) && outlets.length === 1) {
          const item = outlets[0];
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({ ...user, outlet: item.outlet_id || '' }),
          );
          await AsyncStorage.setItem('outlet', JSON.stringify(item));
          setCurrentUser({
            ...user,
            outlet: item.outlet_id || '',
          });
          setCurrentOutlet(item);
          setAuth(true);
          navigation.navigate('Dashboard');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setCurrentOutlet, setCurrentUser]);

  // console.log('uuuuuu', data && data.data && data.data.data);
  const navigation = useNavigation();
  const { outlet } = useSelector(state => state.auth);
  const { setCurrentUser, setCurrentOutlet, setAuth } = useActionCreator();
  return (
    <View style={styles.main}>
      {/* <View style={styles.header}>
        <Text style={styles.mainText}>Select Store</Text>
      </View> */}

      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.1,
        }}
        data={(data && data.data && data.data.data) || []}
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
                await AsyncStorage.setItem(
                  'user',
                  JSON.stringify({ ...user, outlet: item.outlet_id || '' }),
                );
                await AsyncStorage.setItem('outlet', JSON.stringify(item));
                setCurrentUser({
                  ...user,
                  outlet: item.outlet_id || '',
                });
                setCurrentOutlet(item);
                // Toast.show({
                //   type: ALERT_TYPE.SUCCESS,
                //   title: 'Outlet Changed',
                //   textBody: `Outlet change success. Current outlet is ${item.outlet_name}`,
                // });
                // SheetManager.hide('outlets');
              }}
              style={{
                borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                borderBottomWidth: 0.3,
                alignItems: 'center',
                paddingVertical: 18,

                paddingHorizontal: 18,
                flexDirection: 'row',
              }}>
              <View>
                <Text style={styles.channelText}>
                  {item && item.outlet_name}
                </Text>
                <Text style={styles.address}>
                  {item && item.outlet_address}
                </Text>
              </View>
              {item.outlet_id === outlet.outlet_id && (
                <Check
                  style={styles.caret}
                  height={24}
                  width={24}
                  stroke="#3C79F5"
                />
              )}
            </Pressable>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton
          disabled={!outlet || _.isEmpty(outlet)}
          style={styles.btn}
          handlePress={() => {
            setAuth(true);
            navigation.navigate('Dashboard');
          }}>
          Go to Dashboard
        </PrimaryButton>
      </View>
    </View>
  );
}

PrimaryButton;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    paddingBottom: 12,
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 19,
    color: '#002',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#7B8FA1',
  },
  caret: {
    marginLeft: 'auto',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
});

export default OutletLogin;
