import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Check from '../../assets/icons/check-outline.svg';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import _, { isArray } from 'lodash';

function OutletLogin() {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantOutlets(user.user_merchant_id);
  const { setCurrentUser, setCurrentOutlet, setAuth } = useActionCreator();
  const navigation = useNavigation();

  // Check for an existing outlet on component mount
  useEffect(() => {
    const checkSelectedOutlet = async () => {
      const selectedOutlet = await AsyncStorage.getItem('outlet');
      if (selectedOutlet) {
        // Outlet already selected, redirect to Dashboard
        navigation.navigate('Inventory');
      }
    };
    checkSelectedOutlet();
  }, [navigation]);

  // Handle outlet selection and save to AsyncStorage
  useEffect(() => {
    (async () => {
      if (data && data.data && data.data.data) {
        let outlets = data.data.data;
        outlets = outlets.filter(i => {
          return (
            (i && user.user_assigned_outlets.includes(i.outlet_id)) ||
            (i && user.user_merchant_group === 'Administrators')
          );
        });
        if (isArray(outlets) && outlets.length === 1) {
          const item = outlets[0];
          await AsyncStorage.setItem('user', JSON.stringify({ ...user, outlet: item.outlet_id || '' }));
          await AsyncStorage.setItem('outlet', JSON.stringify(item));
          setCurrentUser({ ...user, outlet: item.outlet_id || '' });
          setCurrentOutlet(item);
          setAuth(true);
          navigation.navigate('Inventory'); // Navigate after setting outlet
        }
      }
    })();
  }, [data, setCurrentOutlet, setCurrentUser]);

  const { outlet } = useSelector(state => state.auth);

  return (
    <View style={styles.main}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{ paddingBottom: Dimensions.get('window').height * 0.1 }}
        data={(data && data.data && data.data.data) || []}
        renderItem={({ item }) => {
          if (!item) return null;
          if (user.user_assigned_outlets && !user.user_assigned_outlets.includes(item.outlet_id) && user.user_merchant_group !== 'Administrators') {
            return null;
          }
          return (
            <Pressable
              onPress={async () => {
                await AsyncStorage.setItem('user', JSON.stringify({ ...user, outlet: item.outlet_id || '' }));
                await AsyncStorage.setItem('outlet', JSON.stringify(item));
                setCurrentUser({ ...user, outlet: item.outlet_id || '' });
                setCurrentOutlet(item);
              }}
              style={styles.outletItem}>
              <View>
                <Text style={styles.channelText}>{item.outlet_name}</Text>
                <Text style={styles.address}>{item.outlet_address}</Text>
              </View>
              {item.outlet_id === outlet.outlet_id && (
                <Check style={styles.caret} height={24} width={24} stroke="#3C79F5" />
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
            navigation.navigate('Inventory'); // Go to dashboard on button press
          }}>
          Go to Dashboard
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
    paddingBottom: 12,
    flex: 1,
    backgroundColor: '#fff',
  },
  outletItem: {
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
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
