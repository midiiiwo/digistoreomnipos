/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Riders from '../components/Riders';
import { useGetMerchantDelivery } from '../hooks/useGetMerchantDelivery';
import Bin from '../../assets/icons/delcross';
import DeleteDialog from '../components/DeleteDialog';
import { useDeleteMerchantRoute } from '../hooks/useDeleteMerchantRoute';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { TabBar, TabView } from 'react-native-tab-view';
import { useGetMerchantRidersAll } from '../hooks/useGetMerchantRidersAll';
import { useDeleteRider } from '../hooks/useDeleteRider';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';
import { useSetupMerchantDeliveryConfigOption } from '../hooks/useSetupMerchantDeliveryConfigOption';
import Loading from '../components/Loading';
import { useCreateMerchantDeliveryConfigOption } from '../hooks/useCreateMerchantDeliveryConfigOptions';

function Deliveries() {
  const { user } = useSelector(state => state.auth);
  const { outlet } = useSelector(state => state.auth); // Access outlet from auth
  const { data, refetch, isFetching } = useGetMerchantDelivery(user.user_merchant_id);
  const [visible, setVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState();
  const navigation = useNavigation();
  const { mutate } = useDeleteMerchantRoute(setDeleteStatus);
  const toast = useToast();
  const client = useQueryClient();
  const idToDelete = useRef();

  useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.status == 0) {
        toast.show(deleteStatus.message, { placement: 'top', type: 'success' });
        client.invalidateQueries('merchant-delivery');
      } else {
        toast.show(deleteStatus.message, { placement: 'top', type: 'danger' });
      }
      setDeleteStatus(null);
      idToDelete.current = null;
    }
  }, [toast, deleteStatus, client]);

  return (
    <View style={styles.main}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.1,
        }}
        data={data && data.data && data.data.data}
        renderItem={({ item }) => {
          if (!item) return null;
          if (user.user_assigned_outlets && !user.user_assigned_outlets.includes(item.outlet_id) && user.user_merchant_group !== 'Administrators') {
            return null;
          }
          return (
            <View
              style={{
                borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                borderBottomWidth: 0.3,
                alignItems: 'center',
                paddingVertical: 14,

                paddingHorizontal: 18,
                flexDirection: 'row',
              }}>
              <View style={{ maxWidth: '88%' }}>
                <Text style={styles.channelText}>{item && item.delivery_location}</Text>
                <Text style={styles.address}>GHS {item && item.delivery_price}</Text>
              </View>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  setVisible(true);
                  idToDelete.current = item.delivery_id;
                }}>
                <Bin height={20} width={20} />
              </Pressable>
            </View>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton style={styles.btn} handlePress={() => navigation.navigate('Add Delivery')}>
          Add Delivery Route
        </PrimaryButton>
      </View>
      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleSuccess={() => mutate({ id: idToDelete.current })}
        title="Do you want to delete this route?"
        prompt="This process is irreversible"
      />
    </View>
  );
}


const ManageDeliveries = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [configType, setConfigType] = useState(false);
  const [optionId, setOptionId] = useState();
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetStoreDeliveryConfig(user.merchant);
  const toast = useToast();
  const [routes] = useState([
    { key: 'first', title: 'Deliveries' },
    { key: 'second', title: 'Riders' },
  ]);
  const setupDelivery = useSetupMerchantDeliveryConfigOption(i => i && toast.show(i.message, { placement: 'top' }));
  const createDelivery = useCreateMerchantDeliveryConfigOption(i => i && toast.show(i.message, { placement: 'top' }));

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <Deliveries />;
      case 'second':
        return <Riders />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const config = data && data.data && data.data.data;
    if (config) {
      setConfigType(config.option_delivery);
      setOptionId(config.option_id);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {!configType && (
        <RadioGroup
          initialValue={0}
          style={{ marginHorizontal: 14 }}
          onValueChange={val =>
            val === 0
              ? createDelivery.mutate({ merchant: user.merchant, created_by: user.login, option_delivery: true })
              : setupDelivery.mutate({ id: optionId, mod_by: user.login })
          }>
          <Text style={styles.prompt}>Set up your delivery configuration options</Text>
          <RadioButton label="Use our delivery configuration" value={0} color="#2F66F6" />
          <RadioButton label="I'll set up later" value={1} color="#2F66F6" />
        </RadioGroup>
      )}

      {configType && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy
          swipeEnabled={false}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={{ backgroundColor: '#fff', elevation: 0 }}
              activeColor="#000"
              labelStyle={{
                fontFamily: 'ReadexPro-Medium',
                fontSize: 15,
                color: '#30475e',
                letterSpacing: 0.2,
                textTransform: 'capitalize',
              }}
              indicatorStyle={{
                backgroundColor: '#2F66F6',
                borderRadius: 22,
                height: 3,
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: 10, paddingTop: 16 },
  channelText: { fontSize: 16, color: '#1b2b34', fontFamily: 'ReadexPro-Medium' },
  address: { color: '#304753', fontSize: 14 },
  btn: { backgroundColor: '#2F66F6' },
  prompt: {
    fontFamily: 'ReadexPro-Medium',
    color: '#000',
    fontSize: 14,
    marginBottom: 20,
  },
  btnWrapper: {
    marginVertical: 24,
    marginHorizontal: 8,
    marginTop: 'auto',
  },
});

export default ManageDeliveries;
