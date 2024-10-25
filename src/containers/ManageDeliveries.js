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
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { useGetMerchantDelivery } from '../hooks/useGetMerchantDelivery';
import Bin from '../../assets/icons/delcross';
import DeleteDialog from '../components/DeleteDialog';
import { useDeleteMerchantRoute } from '../hooks/useDeleteMerchantRoute';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { TabBar, TabView } from 'react-native-tab-view';
import { useGetMerchantRiders } from '../hooks/useGetMerchantRiders';
import { useDeleteRider } from '../hooks/useDeleteRider';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';
import { useSetupMerchantDeliveryConfigOption } from '../hooks/useSetupMerchantDeliveryConfigOption';
import Loading from '../components/Loading';
import { useCreateMerchantDeliveryConfigOption } from '../hooks/useCreateMerchantDeliveryConfigOptions';

function Deliveries(props) {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantDelivery(
    user.user_merchant_id,
  );
  const [visible, setVisible] = React.useState(false);
  const [deleteStatus, setDeleteStatus] = React.useState();
  const navigation = useNavigation();
  const { mutate } = useDeleteMerchantRoute(setDeleteStatus);
  const toast = useToast();
  const client = useQueryClient();
  const idToDelete = React.useRef();

  React.useEffect(() => {
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
                <Text style={styles.channelText}>
                  {item && item.delivery_location}
                </Text>
                <Text style={styles.address}>
                  GHS {item && item.delivery_price}
                </Text>
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
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Add Delivery');
          }}>
          Add Delivery Route
        </PrimaryButton>
      </View>
      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleSuccess={() => {
          mutate({ id: idToDelete.current });
        }}
        title={'Do you want to delete this route?'}
        prompt="This process is irreversible"
      />
    </View>
  );
}

function Riders() {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantRiders(
    user.user_merchant_id,
  );
  const [visible, setVisible] = React.useState(false);
  const [deleteStatus, setDeleteStatus] = React.useState();
  const navigation = useNavigation();
  const { mutate } = useDeleteRider(setDeleteStatus);
  const toast = useToast();
  const client = useQueryClient();
  const idToDelete = React.useRef();

  React.useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.status == 0) {
        toast.show(deleteStatus.message, { placement: 'top', type: 'success' });
        client.invalidateQueries('merchant-riders');
      } else {
        toast.show(deleteStatus.message, { placement: 'top', type: 'danger' });
      }
      setDeleteStatus(null);
      idToDelete.current = null;
    }
  }, [toast, deleteStatus, client]);

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
                <Text style={styles.channelText}>
                  {item && item.rider_name}
                </Text>
                <Text style={styles.address}>{item && item.rider_phone}</Text>
              </View>
              <Pressable
                style={{ marginLeft: 'auto', marginRight: 8 }}
                onPress={() => {
                  setVisible(true);
                  idToDelete.current = item.rider_id;
                }}>
                <Bin height={20} width={20} />
              </Pressable>
            </View>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Add Rider');
          }}>
          Add Rider
        </PrimaryButton>
      </View>

      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleSuccess={() => {
          mutate({
            rider: idToDelete.current,
            merchant: user.merchant,
            mod_by: user.login,
          });
        }}
        // eslint-disable-next-line quotes
        title={`Do you want to delete this rider?`}
        prompt="This process is irreversible"
      />
    </View>
  );
}

const ManageDeliveries = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [configType, setConfigType] = React.useState(false);
  const [optionId, setOptionId] = React.useState();
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetStoreDeliveryConfig(user.merchant);
  const toast = useToast();
  const [routes] = React.useState([
    { key: 'first', title: 'Deliveries' },
    { key: 'second', title: 'Riders' },
  ]);
  const setupDelivery = useSetupMerchantDeliveryConfigOption(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });
  const createDelivery = useCreateMerchantDeliveryConfigOption(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });
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

  React.useEffect(() => {
    const config = data && data.data && data.data.data;
    if (config) {
      setConfigType(config.option_delivery);
      setOptionId(config.option_id);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  // const deliveryConfig = data && data.data && data.data.data;

  console.log('typppppp', data && data.data && data.data.status);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          marginBottom: 14,
        }}>
        <RadioGroup initialValue={configType} onValueChange={setConfigType}>
          <RadioButton
            value={'IPAY'}
            label={'Subscribe to Digistore Delivery'}
            labelStyle={{
              fontFamily: 'ReadexPro-Regular',
              fontSize: 14,
              color: '#002',
            }}
            color="rgba(25, 66, 216, 0.87)"
          />
          <View style={{ marginVertical: 6 }} />
          <RadioButton
            value={'MERCHANT'}
            label={'Use your own Delivery Service'}
            labelStyle={{
              fontFamily: 'ReadexPro-Regular',
              fontSize: 14,
              color: '#002',
            }}
            color="rgba(25, 66, 216, 0.87)"
          />
        </RadioGroup>
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <PrimaryButton
            disabled={setupDelivery.isLoading}
            style={[styles.btn, { width: '100%', backgroundColor: '#30475e' }]}
            handlePress={() => {
              if (data && data.data && data.data.status == 0) {
                setupDelivery.mutate({
                  merchant: user.merchant,
                  delivery: configType,
                  id: optionId,
                  mod_by: user.login,
                  delivery_source: user.user_merchant_type,
                });
              } else {
                createDelivery.mutate({
                  merchant: user.merchant,
                  delivery: configType,
                  delivery_source: user.user_merchant_type,
                  mod_by: user.login,
                });
              }
            }}>
            {createDelivery.isLoading || setupDelivery.isLoading
              ? 'Processing'
              : 'Save'}
          </PrimaryButton>
        </View>
      </View>
      {configType === 'MERCHANT' && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy
          swipeEnabled={false}
          renderTabBar={props => (
            <>
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
            </>
          )}
        />
      )}
    </View>
  );
};

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
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#002',
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: '#7B8FA1',
    fontFamily: 'ReadexPro-Regular',
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

export default ManageDeliveries;
