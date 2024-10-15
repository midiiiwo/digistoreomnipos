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
import { useSelector } from 'react-redux';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

function ManageOutlets(props) {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantOutlets(
    user.user_merchant_id,
  );
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      {/* <View style={styles.header}>
        <Text style={styles.mainText}>Select Store</Text>
      </View> */}
      <View style={{ paddingHorizontal: 22, marginBottom: 13 }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            fontSize: 26,
            color: '#002',
          }}>
          Outlets
        </Text>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.1,
        }}
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
                navigation.navigate('Edit Outlet', { id: item.outlet_id });
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
            </Pressable>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Add Outlet');
          }}>
          Add Outlet
        </PrimaryButton>
      </View>
    </View>
  );
}

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

export default ManageOutlets;
