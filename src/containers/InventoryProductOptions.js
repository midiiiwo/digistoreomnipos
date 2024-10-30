/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import CaretRight from '../../assets/icons/cart-right.svg';
import Input from '../components/Input';
import { Switch } from '@rneui/base';
import { useUpdateProductInventoryLowStock } from '../hooks/useUpdateProductInventoryLowStock';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useAddProductToOutlet } from '../hooks/useAddProductToOutlet';
import { useRemoveProductFromOutlet } from '../hooks/useRemoveProductFromOutlet';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { Checkbox } from 'react-native-ui-lib';
import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useNavigation } from '@react-navigation/native';
import { DeleteDialog } from '../components/DeleteDialog';
import { useQueryClient } from 'react-query';
import { useActionCreator } from '../hooks/useActionCreator';
import { useDeleteProductFromOutlet } from '../hooks/useDeleteProductFromOutlet';
import { useGetSelectedProductDetails } from '../hooks/useGetSelectedProductDetails';
import Loading from '../components/Loading';

function InventoryProductOptions(props) {
  function handlePress(cb) {
    SheetManager.hide('inventoryOutlets');
    cb();
  }
  const { inventoryOutlet } = useSelector(state => state.products);
  const { setInventoryOutlet } = useActionCreator();
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [stockQtyStatus, setStockQtyStatus] = React.useState();
  const [lowStockStatus, setLowStockStatus] = React.useState();
  const [quantityUnlimited, setQuantityUnlimited] = React.useState(false);
  const [lowStockUnlimited, setLowStockUnlimited] = React.useState(false);
  const [deleteStatus, setDeleteStatus] = React.useState();
  const [deleteStatusFromOutlet, setDeleteStatusFromOutlet] = React.useState();
  const [addProductStatus, setAddProductStatus] = React.useState();
  const [removeProductStatus, setRemoveProductStatus] = React.useState();
  const [toggleForStoreStatus, setToggleForStoreStatus] = React.useState();
  // const [toggleForOutletStatus, setToggleForOutletStatus] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const [visible_, setVisible_] = React.useState(false);
  const [stockQty, setStockQty] = React.useState('');
  const [lowStock, setLowStock] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [toggleForStore, setToggleForStore] = React.useState(
    props.route.params.product_status == '0',
  );
  // const [toggleForOutlet, setToggleForOutlet] = React.useState(false);
  const deleteProduct = useDeleteProduct(setDeleteStatus);
  const deleteProductFromOutlet = useDeleteProductFromOutlet(
    setDeleteStatusFromOutlet,
  );
  const UpdateLowStock = useUpdateProductInventoryLowStock(setLowStockStatus);

  const {
    data: productDetails,
    isLoading,
    refetch,
    isRefetching,
  } = useGetSelectedProductDetails(
    user.merchant,
    (inventoryOutlet && inventoryOutlet.outlet_id) || '',
    props.route.params.id,
  );
  const addProduct = useAddProductToOutlet(setAddProductStatus);
  const removeProduct = useRemoveProductFromOutlet(setRemoveProductStatus);
  const { data: outlets } = useGetStoreOutlets(user.merchant);
  const client = useQueryClient();

  // const productOutlets = props.route.params.product_outlets.map(i => {
  //   if (i) {
  //     return i.outlet_id;
  //   }
  // });

  const toast = useToast();

  // React.useEffect(() => {
  //   setStockQty(
  //     props.route &&
  //       props.route.params &&
  //       props.route.params.product_quantity === '-99'
  //       ? 'Unlimited'
  //       : props.route.params.product_quantity,
  //   );
  // }, [setStockQty, props.route]);

  React.useEffect(() => {
    if (stockQtyStatus) {
      toast.show(stockQtyStatus.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      setStockQtyStatus(null);
      navigation.goBack();
    }
  }, [stockQtyStatus, toast, navigation, client]);

  React.useEffect(() => {
    if (lowStockStatus) {
      toast.show(lowStockStatus.message, { placement: 'top' });
      setLowStockStatus(null);
      client.invalidateQueries('global-products');
      client.invalidateQueries([
        'selected-product-details',
        user.merchant,
        inventoryOutlet && inventoryOutlet.outlet_id,
        props.route.params.id,
      ]);
      // navigation.goBack();
    }
  }, [
    lowStockStatus,
    toast,
    navigation,
    client,
    user.merchant,
    inventoryOutlet,
    props.route.params.id,
  ]);

  React.useEffect(() => {
    if (deleteStatus) {
      toast.show(deleteStatus.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      navigation.goBack();
      setDeleteStatus(null);
    }
  }, [deleteStatus, toast, navigation, client]);

  React.useEffect(() => {
    if (deleteStatusFromOutlet) {
      toast.show(deleteStatusFromOutlet.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      navigation.goBack();
      setDeleteStatusFromOutlet(null);
    }
  }, [deleteStatusFromOutlet, toast, navigation, client]);

  React.useEffect(() => {
    if (removeProductStatus) {
      toast.show(removeProductStatus.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      client.invalidateQueries([
        'selected-product-details',
        user.merchant,
        inventoryOutlet && inventoryOutlet.outlet_id,
        props.route.params.id,
      ]);
      setRemoveProductStatus(null);
    }
  }, [
    removeProductStatus,
    toast,
    client,
    user.merchant,
    inventoryOutlet,
    props.route.params.id,
  ]);

  React.useEffect(() => {
    if (addProductStatus) {
      toast.show(addProductStatus.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      setAddProductStatus(null);
      client.invalidateQueries([
        'selected-product-details',
        user.merchant,
        inventoryOutlet && inventoryOutlet.outlet_id,
        props.route.params.id,
      ]);
    }
  }, [
    addProductStatus,
    toast,
    client,
    user.merchant,
    inventoryOutlet,
    props.route.params.id,
  ]);

  React.useEffect(() => {
    if (toggleForStoreStatus) {
      toast.show(toggleForStoreStatus.message, { placement: 'top' });
      client.invalidateQueries('global-products');
      setToggleForStoreStatus(null);
    }
  }, [toggleForStoreStatus, toast, client]);

  React.useEffect(() => {
    if (productDetails && productDetails.data.status == 0) {
      const productItem =
        productDetails && productDetails.data && productDetails.data.data;
      if (productItem && productItem.product_stock_level == '-99') {
        setLowStockUnlimited(true);
      } else {
        setLowStock((productItem && productItem.product_stock_level) || '');
      }
      if (productItem && productItem.product_quantity == '-99') {
        setQuantityUnlimited(true);
      } else {
        setStockQty((productItem && productItem.product_quantity) || '');
      }
      setPrice((productItem && productItem.product_price) || '');
    }
  }, [productDetails]);

  const outletsData = (outlets && outlets.data && outlets.data.data) || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.main}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }>
        <View style={styles.header}>
          <Text style={styles.mainText}>{props.route.params.itemName}</Text>
          <Text
            style={[
              styles.mainText,
              {
                fontSize: 14,
                fontFamily: 'ReadexPro-Medium',
                marginTop: 6,
                color: '#219C90',
                textTransform: 'capitalize',
              },
            ]}>
            {inventoryOutlet && inventoryOutlet.outlet_name}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            marginVertical: 6,
            marginHorizontal: 8,
            borderRadius: 8,
          }}>
          <Pressable
            style={[styles.channelType, { paddingHorizontal: 12 }]}
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
                navigation.navigate('Product Details', {
                  id: props.route.params.id,
                  outlet: inventoryOutlet,
                });
                SheetManager.hideAll();
              })
            }>
            <Text style={styles.channelText}>View Details</Text>
            <CaretRight style={styles.caret} height={14} width={14} />
          </Pressable>
          <Pressable
            style={[styles.channelType, { paddingHorizontal: 12 }]}
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
                if (inventoryOutlet && inventoryOutlet.outlet_id === 'ALL') {
                  toast.show('Please select outlet to edit product', {
                    placement: 'top',
                  });
                  SheetManager.show('inventoryOutlet', {
                    payload: { inventoryOutlet, setInventoryOutlet },
                  });
                  return;
                }
                navigation.navigate('Edit Product', {
                  id: props.route.params.id,
                  outlet: inventoryOutlet,
                });
                SheetManager.hideAll();
              })
            }>
            <Text style={styles.channelText}>Edit Product</Text>
            <CaretRight style={styles.caret} height={14} width={14} />
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 8,
            borderRadius: 8,
            paddingHorizontal: 8,
          }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={[styles.channelType, { flex: 1 }]}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Input
                  placeholder="Price"
                  val={price}
                  setVal={text => setPrice(text)}
                  style={{ backgroundColor: '#fff' }}
                  showError={price.length === 0 && showError}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.channelType, { flex: 1 }]}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                  <Input
                    placeholder="Quantity"
                    val={stockQty}
                    setVal={text => setStockQty(text)}
                    style={{ backgroundColor: '#fff' }}
                    showError={
                      !quantityUnlimited && stockQty.length === 0 && showError
                    }
                    editable={!quantityUnlimited}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      marginLeft: 2,
                    }}>
                    <Checkbox
                      value={quantityUnlimited}
                      onValueChange={() =>
                        setQuantityUnlimited(!quantityUnlimited)
                      }
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#30475e',
                        fontFamily: 'ReadexPro-Regular',
                        marginLeft: 5,
                      }}>
                      Unlimited
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.channelType, { flex: 1 }]}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Input
                    placeholder="Low level Stock"
                    val={lowStock}
                    setVal={text => setLowStock(text)}
                    style={{ backgroundColor: '#fff' }}
                    showError={
                      !lowStockUnlimited && lowStock.length === 0 && showError
                    }
                    editable={!lowStockUnlimited}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      marginLeft: 4,
                    }}>
                    <Checkbox
                      value={lowStockUnlimited}
                      onValueChange={() =>
                        setLowStockUnlimited(!lowStockUnlimited)
                      }
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#30475e',
                        fontFamily: 'ReadexPro-Regular',
                        marginLeft: 5,
                      }}>
                      Unlimited
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            style={[
              styles.btn,
              {
                marginVertical: 12,
                marginHorizontal: 4,
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
              if (!lowStockUnlimited && lowStock.length === 0) {
                setShowError(true);
                return;
              }
              if (!quantityUnlimited && stockQty.length === 0) {
                setShowError(true);
                return;
              }
              // toast.show(`Updating low level stock quantity to ${lowStock}`, {
              //   placement: 'top',
              // });
              UpdateLowStock.mutate({
                merchant: user.merchant,
                outlet: inventoryOutlet.outlet_id,
                product: props.route.params.id,
                price,
                cost: 0,
                quantity: quantityUnlimited ? '-99' : stockQty,
                stock_level: lowStockUnlimited ? '-99' : lowStock,
                mod_by: user.login,
              });
            }}
            disabled={UpdateLowStock.isLoading}>
            <Text style={styles.signin}>
              {UpdateLowStock.isLoading ? 'Processing' : 'Save'}
            </Text>
          </Pressable>
        </View>

        {/* <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            marginHorizontal: 8,
            borderRadius: 8,
            marginTop: 8,
            paddingVertical: 16,
          }}>
          <Picker
            showError={outletList && outletList.length === 0 && showError}
            placeholder="Select outlets to take offline/online"
            value={outletList}
            mode="MULTI"
            title="Select outlets to take offline/online"
            setValue={item => {
              setOutletList(item);
            }}>
            {((outlets && outlets.data && outlets.data.data) || [])
              .filter(i => {
                if (!i) {
                  return;
                }
                return user.user_merchant_group !== 'Administrators'
                  ? user.user_assigned_outlets.includes(i.outlet_id)
                  : true;
              })
              // .filter(i => productOutlets.includes(i.outlet_id))
              .map(item => {
                if (!item) {
                  return;
                }
                return (
                  <RNPicker.Item
                    key={item.outlet_name}
                    label={item.outlet_name}
                    value={{ label: item.outlet_name, value: item.outlet_id }}
                  />
                );
              })}
          </Picker>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={[
                styles.btn,
                {
                  marginTop: 12,
                  flex: 1,
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
                const outletList_ = (outletList || []).map(i => {
                  return i.value;
                });
                addProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: outletList_.toString(),
                  status: 0,
                });
              }}
              disabled={addProduct.isLoading}>
              <Text style={styles.signin}>
                {addProduct.isLoading ? 'Processing' : 'Enable Product'}
              </Text>
            </Pressable>
            <View style={{ marginHorizontal: 4 }} />
            <Pressable
              style={[
                styles.btn,
                {
                  marginTop: 12,
                  backgroundColor: '#cf222e',
                  flex: 1,
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
                const outletList_ = (outletList || []).map(i => {
                  return i.value;
                });
                removeProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: outletList_.toString(),
                  status: 1,
                });
              }}
              disabled={removeProduct.isLoading}>
              <Text style={styles.signin}>
                {removeProduct.isLoading ? 'Processing' : 'Disable product'}
              </Text>
            </Pressable>
          </View>
        </View> */}
        <View
          style={[
            styles.channelType,
            {
              backgroundColor: '#fff',
              marginHorizontal: 8,
              borderRadius: 8,
              marginTop: 8,
            },
          ]}>
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
                addProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: inventoryOutlet && inventoryOutlet.outlet_id,
                  status: 0,
                });
              } else {
                removeProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: inventoryOutlet && inventoryOutlet.outlet_id,
                  status: 1,
                });
              }
              setToggleForStore(!toggleForStore);
            }}
          />
          <Text style={styles.channelText}>
            {toggleForStore
              ? 'Disable product from outlet'
              : 'Enable product from outlet'}
          </Text>
        </View>
        <View
          style={[
            styles.channelType,
            {
              backgroundColor: '#fff',
              marginHorizontal: 8,
              borderRadius: 8,
              marginTop: 8,
            },
          ]}>
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
              const outletData_ = outletsData
                .filter(i => {
                  if (!i) {
                    return;
                  }
                  return user.user_merchant_group !== 'Administrators'
                    ? user.user_assigned_outlets.includes(i.outlet_id)
                    : true;
                })
                .map(outlet => outlet.outlet_id);
              if (!toggleForStore) {
                addProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: outletData_.toString(),
                  status: 0,
                });
              } else {
                removeProduct.mutate({
                  product: props.route.params.id,
                  merchant: user.merchant,
                  mod_by: user.login,
                  outlet: outletData_.toString(),
                  status: 1,
                });
              }
              setToggleForStore(!toggleForStore);
            }}
          />
          <Text style={styles.channelText}>
            {toggleForStore
              ? 'Disable product from all outlets'
              : 'Enable product from all outlets'}
          </Text>
        </View>

        <Pressable
          style={[styles.channelType, { paddingHorizontal: 14 }]}
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
            setVisible_(true);

            // toast.show(`Deleting product with id ${props.route.params.id}`, {
            //   placement: 'top',
            // });
          }}>
          <Text style={[styles.channelText, { color: '#E0144C' }]}>
            Delete Product From Outlet
          </Text>
        </Pressable>

        <Pressable
          style={[styles.channelType, { paddingHorizontal: 14 }]}
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
            setVisible(true);

            // toast.show(`Deleting product with id ${props.route.params.id}`, {
            //   placement: 'top',
            // });
          }}>
          <Text style={[styles.channelText, { color: '#E0144C' }]}>
            Delete Product from all outlets
          </Text>
        </Pressable>

        <DeleteDialog
          visible={visible_}
          handleCancel={() => setVisible_(false)}
          handleSuccess={() =>
            deleteProductFromOutlet.mutate({
              id: props.route.params.id,
              userName: user.login,
              merchant: user.merchant,
              outlet: (inventoryOutlet && inventoryOutlet.outlet_id) || '',
            })
          }
          title={`Do you want to delete ${props.route.params.itemName} from ${
            inventoryOutlet && inventoryOutlet.outlet_name
          }`}
          prompt="This process is irreversible"
        />

        <DeleteDialog
          visible={visible}
          handleCancel={() => setVisible(false)}
          handleSuccess={() =>
            deleteProduct.mutate({
              id: props.route.params.id,
              userName: user.login,
              merchant: user.merchant,
            })
          }
          title={`Do you want to delete ${props.route.params.itemName} from all outlets`}
          prompt="This process is irreversible"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  btn: {
    backgroundColor: 'rgba(25, 66, 216, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 4,
  },
  signin: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    letterSpacing: 0.4,
  },
  header: {
    justifyContent: 'center',
    paddingBottom: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    backgroundColor: '#fff',
    alignItems: 'center',
    // marginBottom: 12
  },
  mainText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15.5,
    color: '#30475E',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
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
  main: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  channelType: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    paddingHorizontal: 6,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15.5,
    color: '#272829',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default InventoryProductOptions;
