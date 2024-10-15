/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import CaretRight from '../../../assets/icons/cart-right.svg';
import { useActionCreator } from '../../hooks/useActionCreator';
import { Input } from './AddProductSheet';
import PrimaryButton from '../PrimaryButton';
import { Switch } from '@rneui/base';
import { useUpdateInventoryStockQuantity } from '../../hooks/useUpdateInventoryStockQuantity';
import { useUpdateProductInventoryLowStock } from '../../hooks/useUpdateProductInventoryLowStock';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import { useToggleProductOfflineOnlineEntirely } from '../../hooks/usetoggleProductOfflineOnlineEntirely';
import { useAddProductToOutlet } from '../../hooks/useAddProductToOutlet';
import { useRemoveProductFromOutlet } from '../../hooks/useRemoveProductFromOutlet';
import { Sheet } from 'react-native-share';
import Lottie from 'lottie-react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Picker from '../Picker';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useGetStoreOutlets } from '../../hooks/useGetStoreOutlets';

function InventoryProductOptions(props) {
  function handlePress(cb) {
    SheetManager.hide('cartOptions');
    cb();
  }
  const { user } = useSelector(state => state.auth);
  const [stockQtyStatus, setStockQtyStatus] = React.useState();
  const [lowStockStatus, setLowStockStatus] = React.useState();
  const [deleteStatus, setDeleteStatus] = React.useState();
  const [addProductStatus, setAddProductStatus] = React.useState();
  const [removeProductStatus, setRemoveProductStatus] = React.useState();
  const [toggleForStoreStatus, setToggleForStoreStatus] = React.useState();
  const [toggleForOutletStatus, setToggleForOutletStatus] = React.useState();
  const [stockQty, setStockQty] = React.useState('');
  const [lowStock, setLowStock] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [toggleForStore, setToggleForStore] = React.useState(
    props.payload.product_status == '0',
  );
  const [toggleForOutlet, setToggleForOutlet] = React.useState(false);
  const deleteProduct = useDeleteProduct(setDeleteStatus);
  const updateStockQty = useUpdateInventoryStockQuantity(setStockQtyStatus);
  const UpdateLowStock = useUpdateProductInventoryLowStock(setLowStockStatus);
  const toggleProductOfflineOnline =
    useToggleProductOfflineOnlineEntirely(toggleForStore);
  const removeProduct = useAddProductToOutlet(removeProductStatus);
  const addProduct = useRemoveProductFromOutlet(addProductStatus);
  const { data: outlets, isLoading: isOutletLoading } = useGetStoreOutlets(
    user.merchant,
  );

  const [outletList, setOutletList] = React.useState();

  const toast = useToast();

  React.useEffect(() => {
    if (stockQtyStatus) {
      toast.show(stockQtyStatus.message, { placement: 'top' });
      setStockQtyStatus(null);
      SheetManager.hideAll();
    }
  }, [stockQtyStatus, toast]);

  React.useEffect(() => {
    if (lowStockStatus) {
      toast.show(lowStockStatus.message, { placement: 'top' });
      setLowStockStatus(null);
      SheetManager.hideAll();
    }
  }, [lowStockStatus, toast]);

  React.useEffect(() => {
    if (deleteStatus) {
      toast.show(deleteStatus.message, { placement: 'top' });
      SheetManager.hideAll();
      setDeleteStatus(null);
    }
  }, [deleteStatus, toast]);

  React.useEffect(() => {
    if (toggleForStoreStatus) {
      toast.show(toggleForStoreStatus.message, { placement: 'top' });
      setToggleForStoreStatus(null);
    }
  }, [toggleForStoreStatus, toast]);

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
          <Text style={styles.mainText}>{props.payload.itemName}</Text>
        </View>
        <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() => {
              if (!user.user_permissions.includes('VIEWPROD')) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              props.payload.navigation.navigate('Product Details', {
                id: props.payload.id,
              });
              SheetManager.hideAll();
            })
          }>
          <Text style={styles.channelText}>View Details</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() => {
              if (!user.user_permissions.includes('EDTPROD')) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              props.payload.navigation.navigate('Edit Product', {
                id: props.payload.id,
              });
              SheetManager.hideAll();
            })
          }>
          <Text style={styles.channelText}>Edit Product</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <View style={styles.channelType}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
            }}>
            <Input
              placeholder="Inventory Stock"
              val={stockQty}
              setVal={text => setStockQty(text)}
              style={{ backgroundColor: '#fff' }}
              showError={stockQty.length === 0 && showError}
              keyboardType="number-pad"
            />
            <Pressable
              style={[
                styles.btn,
                {
                  marginTop: 12,
                  backgroundColor: '#224390',
                },
              ]}
              onPress={async () => {
                if (!user.user_permissions.includes('EDTPROD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                if (stockQty.length === 0) {
                  setShowError(true);
                  return;
                }
                // toast.show(`Updating low level stock quantity to ${stockQty}`, {
                //   placement: 'top',
                //   style: { zIndex: 1000 },
                // });
                updateStockQty.mutate({
                  id: props.payload.id,
                  quantity: stockQty,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              }}
              disabled={updateStockQty.isLoading}>
              <Text style={styles.signin}>
                {updateStockQty.isLoading ? 'Processing' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.channelType}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Input
              placeholder="Low level Stock"
              val={lowStock}
              setVal={text => setLowStock(text)}
              style={{ backgroundColor: '#fff' }}
              showError={lowStock.length === 0 && showError}
              keyboardType="number-pad"
            />
            <Pressable
              style={[
                styles.btn,
                {
                  marginTop: 12,
                  backgroundColor: '#224390',
                },
              ]}
              onPress={async () => {
                if (!user.user_permissions.includes('EDTPROD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                if (lowStock.length === 0) {
                  setShowError(true);
                  return;
                }
                // toast.show(`Updating low level stock quantity to ${lowStock}`, {
                //   placement: 'top',
                // });
                UpdateLowStock.mutate({
                  id: props.payload.id,
                  quantity: lowStock,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              }}
              disabled={UpdateLowStock.isLoading}>
              <Text style={styles.signin}>
                {UpdateLowStock.isLoading ? 'Processing' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
        {/* <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => {})}>
          <Switch
            value={toggleForOutlet}
            trackColor={{
              true: '#0081C9',
              false: '#CFCFCF',
            }}
            onValueChange={() => {
              if (!toggleForOutlet) {
                addProduct.mutate({
                  id: props.payload.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              } else {
                removeProduct.mutate({
                  id: props.payload.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              }
              setToggleForOutlet(!toggleForOutlet);
            }}
          />
          <Text style={styles.channelText}>
            Toggle product online/offline for outlet
          </Text>
        </Pressable> */}
        <View style={{ paddingHorizontal: 18 }}>
          <Picker
            showError={outletList && outletList.length === 0 && showError}
            placeholder="Select outlets to take offline/online"
            value={outletList}
            mode="MULTI"
            title="Select outlets to take offline/online"
            setValue={item => {
              setOutletList(item);
            }}>
            {outlets &&
              outlets.data &&
              outlets.data.data &&
              outlets.data.data.map(item => {
                if (!item) {
                  return;
                }
                console.log(item);
                return (
                  <RNPicker.Item
                    key={item.outlet_name}
                    label={item.outlet_name}
                    value={{ label: item.outlet_name, value: item.outlet_id }}
                  />
                );
              })}
          </Picker>
          <Pressable
            style={[
              styles.btn,
              {
                marginTop: 12,
                backgroundColor: '#224390',
              },
            ]}
            onPress={async () => {
              SheetManager.show('support');
            }}>
            <Text style={styles.signin}>Add product to outlets</Text>
          </Pressable>
          <Pressable
            style={[
              styles.btn,
              {
                marginTop: 12,
                backgroundColor: '#224390',
              },
            ]}
            onPress={async () => {
              SheetManager.show('support');
            }}>
            <Text style={styles.signin}>Disable product from outlets</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => {})}>
          <Switch
            value={toggleForStore}
            trackColor={{
              true: '#0081C9',
              false: '#CFCFCF',
            }}
            onValueChange={v => {
              if (!user.user_permissions.includes('EDTPROD')) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              if (!toggleForStore) {
                toggleProductOfflineOnline.mutate({
                  id: props.payload.id,
                  status: 0,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              } else {
                toggleProductOfflineOnline.mutate({
                  id: props.payload.id,
                  status: 1,
                  merchant: user.merchant,
                  mod_by: user.login,
                });
              }
              setToggleForStore(!toggleForStore);
            }}
          />
          <Text style={styles.channelText}>
            {toggleForStore ? 'Disable product' : 'Enable product'}
          </Text>
          {/* <CaretRight style={styles.caret} /> */}
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => {
            if (!user.user_permissions.includes('DELPROD')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            toast.show(`Deleting product with id ${props.payload.id}`, {
              placement: 'top',
            });
            deleteProduct.mutate({
              id: props.payload.id,
              userName: user.login,
            });
          }}>
          <Text style={[styles.channelText, { color: '#E0144C' }]}>Delete</Text>
        </Pressable>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 3,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Semibold',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    // marginBottom: 12
  },
  mainText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#30475E',
    letterSpacing: -0.4,
  },
  done: {
    fontFamily: 'Inter-SemiBold',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.8,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  channelType: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#687980',
    marginLeft: 4,
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default InventoryProductOptions;
