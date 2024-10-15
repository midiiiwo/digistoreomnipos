/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React from 'react';
// import { useGetOutletCategories } from '../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';

import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Scanner from '../../assets/icons/barscanner';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Loading from '../components/Loading';

import PrimaryButton from '../components/PrimaryButton';
import { useAddCategoryProduct } from '../hooks/useAddCategoryProduct';
import Picker from '../components/Picker';
import AddImage from '../../assets/icons/add-image.svg';
import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { Switch } from '@rneui/themed';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import Input from '../components/Input';
import { PERMISSIONS, request } from 'react-native-permissions';

const reducer = (state, action) => {
  switch (action.type) {
    case 'product_name':
      return { ...state, name: action.payload };
    case 'product_price':
      return { ...state, price: action.payload };
    case 'product_description':
      return { ...state, description: action.payload };
    case 'product_category':
      return { ...state, category: action.payload };
    case 'product_quantity':
      return { ...state, quantity: action.payload };
    case 'product_cost':
      return { ...state, cost: action.payload };
    case 'product_sku':
      return { ...state, sku: action.payload };
    case 'product_barcode':
      return { ...state, barcode: action.payload };
    case 'product_weight':
      return { ...state, weight: action.payload };
    case 'image':
      return { ...state, image: action.payload };
    case 'outlet':
      return { ...state, outlet_list: action.payload };
    case 'variants':
      return { ...state, variants: action.payload };
    default:
      return state;
  }
};

const AddProduct = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  const { data: outlets, isLoading: isOutletLoading } = useGetStoreOutlets(
    user.merchant,
  );
  const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [trackStock, setTrackStock] = React.useState(false);
  const [applyTaxes, setApplyTaxes] = React.useState(true);
  const [saved, setSaved] = React.useState();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  const client = useQueryClient();
  const [outletInventory, setOutletInventory] = React.useState({});
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    price: '',
    desc: '',
    category: null,
    quantity: -99,
    cost: '',
    sku: '',
    barcode: '',
    weight: '',
    tag: 'NORMAL',
    is_price_global: 'YES',
    mod_by: user.login,
    outlet_list: [],
    image: null,
    variants: null,
  });

  const addProduct = useAddCategoryProduct(i => {
    setSaved(i);
    client.invalidateQueries('global-products');
  });

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  React.useEffect(() => {
    if (route && route.params) {
      if (route.params.prev_screen && route.params.data) {
        dispatch({
          type: 'product_barcode',
          payload: route.params.data,
        });
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, {
          placement: 'top',
          type: 'success',
        });
        navigation.navigate('Products');
      } else {
        toast.show(saved.message, {
          placement: 'top',
          type: 'danger',
        });
      }
      setSaved(null);
    }
  }, [saved, toast, navigation]);

  React.useEffect(() => {
    let outletInventory_ = {};
    for (let outlet of state.outlet_list) {
      if (!outletInventory[outlet.label]) {
        outletInventory_[outlet.label] = {
          ...outletInventory[outlet.label],
          price: state.price,
          outletId: outlet.value,
        };
      }
    }
    setOutletInventory({ ...outletInventory, ...outletInventory_ });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.outlet_list, state.price]);

  if (isLoading || isOutletLoading) {
    return <Loading />;
  }

  return (
    <View>
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <ScrollView
          style={styles.main}
          contentContainerStyle={{
            paddingBottom: Dimensions.get('window').height * 0.3,
          }}>
          <View style={{ alignItems: 'flex-start' }}>
            <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
              <MenuTrigger
                onPress={() => setOpenMenu(!openMenu)}
                children={
                  <View
                  // onPress={}
                  >
                    {!state.image && <AddImage height={100} width={100} />}
                    {state.image && (
                      <Image
                        style={{ height: 100, width: 100, borderRadius: 5 }}
                        source={{ uri: state.image.uri }}
                      />
                    )}
                  </View>
                }
              />
              <MenuOptions
                optionsContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  paddingBottom: 16,
                  borderRadius: 6,
                  // elevation: 0,
                }}>
                <MenuOption
                  style={{ marginVertical: 10 }}
                  onSelect={async () => {
                    setOpenMenu(false);
                    if (Platform.OS === 'android') {
                      try {
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.CAMERA,
                          {
                            title: 'App Camera Permission',
                            message: 'App needs access to your camera',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                          },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                          const result = await launchCamera({
                            includeBase64: false,
                            includeExtra: false,
                            mediaType: 'photo',
                          });
                          if (result) {
                            dispatch({
                              type: 'image',
                              payload: result.assets[0],
                            });
                          }
                        } else {
                          toast.show('Camera permission denied', {
                            placement: 'top',
                          });
                        }
                      } catch (error) {
                        console.log('=>>>>>>>>>>>>>>>>,', error);
                      }
                    } else if (Platform.OS === 'ios') {
                      try {
                        const granted = await request(PERMISSIONS.IOS.CAMERA);

                        if (granted === 'granted') {
                          const result = await launchCamera({
                            includeBase64: false,
                            includeExtra: false,
                            mediaType: 'photo',
                          });
                          console.log('grrrr', result);
                          if (result) {
                            dispatch({
                              type: 'image',
                              payload: result.assets[0],
                            });
                          }
                        } else {
                          // request(PERMISSIONS.IOS.CAMERA);
                        }
                      } catch (error) {
                        console.log('=>>>>>>>>>>>>>>>>,', error);
                      }
                    }
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'Inter-Medium',
                      fontSize: 15,
                    }}>
                    Take Photo
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={async () => {
                    setOpenMenu(false);
                    const result = await launchImageLibrary({
                      mediaType: 'photo',
                    });
                    if (result) {
                      dispatch({
                        type: 'image',
                        payload: result.assets[0],
                      });
                    }
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'Inter-Medium',
                      fontSize: 15,
                    }}>
                    Choose from Gallery
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>

            {state.image && (
              <Pressable
                style={{ padding: 5, marginTop: 12 }}
                onPress={() => {
                  dispatch({ type: 'image', payload: null });
                }}>
                <Text style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
                  Clear Image
                </Text>
              </Pressable>
            )}
          </View>
          <Input
            placeholder="Enter product name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'product_name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter selling price"
            val={state.price}
            showError={showError && state.price.length === 0}
            setVal={text => {
              handleTextChange({
                type: 'product_price',
                payload: text,
              });

              let outletInventory_ = {};
              for (let outlet of state.outlet_list) {
                outletInventory_[outlet.label] = {
                  ...outletInventory[outlet.label],
                  price: text,
                  outletId: outlet.value,
                };
              }
              setOutletInventory(outletInventory_);
            }}
            keyboardType="number-pad"
          />
          {/* <Input
            val={state.quantity}
            placeholder="Enter Quantity"
            setVal={text =>
              handleTextChange({
                type: 'product_quantity',
                payload: text,
              })
            }
            keyboardType="number-pad"
            showError={showError && state.quantity.length === 0}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <Warning height={16} width={16} />
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 13,
                color: '#30475e',
                marginLeft: 6,
                letterSpacing: 0.3,
              }}>
              Item quantity is unlimited if you leave it blank
            </Text>
          </View> */}
          <Input
            placeholder="Enter description (optional)"
            val={state.description}
            nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'product_description',
                payload: text,
              })
            }
          />
          <View style={{ marginVertical: 8 }} />
          <Picker
            showError={!state.category && showError}
            value={state.category}
            setValue={item => {
              if (item.label === 'New Category') {
                SheetManager.show('addCategory');
                return;
              }
              handleTextChange({
                type: 'product_category',
                payload: item,
              });
            }}>
            {data &&
              data.data &&
              data.data.data &&
              [...data.data.data, { product_category: 'New Category' }].map(
                item => {
                  if (!item) {
                    return;
                  }

                  return (
                    <RNPicker.Item
                      key={item.product_category}
                      label={item.product_category}
                      value={JSON.stringify(item)}
                    />
                  );
                },
              )}
          </Picker>
          <View>
            <Pressable
              style={{ marginLeft: 'auto', paddingVertical: 12 }}
              onPress={() => {
                SheetManager.show('addCategory');
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: 14,
                  color: '#2192FF',
                }}>
                Add new category
              </Text>
            </Pressable>
          </View>
          <Picker
            showError={state.outlet_list.length === 0 && showError}
            placeholder="Select outlets to attach product"
            value={state.outlet_list}
            mode="MULTI"
            title="Select outlets to attach product to"
            setValue={item => {
              handleTextChange({
                type: 'outlet',
                payload: item,
              });
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
          {state.outlet_list && state.outlet_list.length > 0 && (
            <View style={{ marginVertical: 10 }}>
              <Pressable
                style={styles.toggle}
                onPress={() => setTrackStock(!trackStock)}>
                <Switch
                  value={trackStock}
                  trackColor={{
                    true: '#0081C9',
                    false: '#CFCFCF',
                  }}
                  onValueChange={() => setTrackStock(!trackStock)}
                />
                <Text style={styles.label}>Track Stock</Text>
              </Pressable>
              {state.outlet_list.map(outlet => {
                if (outlet) {
                  return (
                    <View style={{ marginVertical: 12 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#272829',
                            fontFamily: 'SFProDisplay-Regular',
                            maxWidth: '70%',
                            marginBottom: 4,
                          }}>
                          {outlet.label}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Input
                          placeholder="Price"
                          val={
                            (outletInventory[outlet.label] &&
                              outletInventory[outlet.label].price) ||
                            ''
                          }
                          setVal={text =>
                            setOutletInventory({
                              ...outletInventory,
                              [outlet.label]: {
                                ...(outletInventory[outlet.label] || {}),
                                price: text,
                                outletId: outlet.value,
                              },
                            })
                          }
                          style={{
                            width: !trackStock ? '100%' : '32%',
                            flex: !trackStock ? 1 : 0,
                            backgroundColor: '#fff',
                          }}
                          showError={
                            showError &&
                            (
                              (outletInventory[outlet.label] &&
                                outletInventory[outlet.label].price) ||
                              ''
                            ).length === 0
                          }
                          keyboardType="number-pad"
                        />
                        <View style={{ marginHorizontal: 2 }} />
                        {trackStock && (
                          <>
                            <Input
                              placeholder="In Stock"
                              val={
                                (outletInventory[outlet.label] &&
                                  outletInventory[outlet.label].inStock) ||
                                ''
                              }
                              setVal={text =>
                                setOutletInventory({
                                  ...outletInventory,
                                  [outlet.label]: {
                                    ...(outletInventory[outlet.label] || {}),
                                    inStock: text,
                                  },
                                })
                              }
                              keyboardType="number-pad"
                              showError={
                                showError &&
                                trackStock &&
                                (
                                  (outletInventory[outlet.label] &&
                                    outletInventory[outlet.label].inStock) ||
                                  ''
                                ).length === 0
                              }
                              style={{ width: '32%', backgroundColor: '#fff' }}
                            />
                            <View style={{ marginHorizontal: 2 }} />
                            <Input
                              placeholder="Low Stock"
                              val={
                                (outletInventory[outlet.label] &&
                                  outletInventory[outlet.label].lowStock) ||
                                ''
                              }
                              setVal={text =>
                                setOutletInventory({
                                  ...outletInventory,
                                  [outlet.label]: {
                                    ...(outletInventory[outlet.label] || {}),
                                    lowStock: text,
                                  },
                                })
                              }
                              keyboardType="number-pad"
                              showError={
                                showError &&
                                trackStock &&
                                (
                                  (outletInventory[outlet.label] &&
                                    outletInventory[outlet.label].lowStock) ||
                                  ''
                                ).length === 0
                              }
                              style={{ width: '32%', backgroundColor: '#fff' }}
                            />
                          </>
                        )}
                      </View>
                    </View>
                  );
                }
              })}
            </View>
          )}
          <Pressable
            style={styles.toggle}
            onPress={() => setToggleMoreInput(!toggleMoreInput)}>
            <Switch
              value={toggleMoreInput}
              trackColor={{
                true: '#0081C9',
                false: '#CFCFCF',
              }}
              onValueChange={() => setToggleMoreInput(!toggleMoreInput)}
            />
            <Text style={styles.label}>Add more details</Text>
          </Pressable>
          {toggleMoreInput && (
            <View>
              <Input
                val={state.cost}
                placeholder="Enter cost per item"
                setVal={text =>
                  handleTextChange({
                    type: 'product_cost',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              />

              <Pressable
                style={[styles.toggle, { paddingVertical: 16 }]}
                onPress={() => setApplyTaxes(!applyTaxes)}>
                <Switch
                  value={applyTaxes}
                  trackColor={{
                    true: '#0081C9',
                    false: '#CFCFCF',
                  }}
                  onValueChange={() => setApplyTaxes(!applyTaxes)}
                />
                <Text style={styles.label}>Apply tax on this product</Text>
              </Pressable>
              {/* <Input
                placeholder="Enter Cost"
                val={state.cost}
                setVal={text =>
                  handleTextChange({
                    type: 'product_cost',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              /> */}
              <Input
                placeholder="Enter SKU"
                val={state.sku}
                setVal={text =>
                  handleTextChange({
                    type: 'product_sku',
                    payload: text,
                  })
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Input
                  placeholder="Enter Barcode"
                  val={state.barcode}
                  setVal={text =>
                    handleTextChange({
                      type: 'product_barcode',
                      payload: text,
                    })
                  }
                  style={{ flex: 1, backgroundColor: '#fff' }}
                />
                <Pressable
                  style={{ marginLeft: 6, padding: 10, marginTop: 5 }}
                  onPress={() => {
                    navigation.navigate('Barcode', {
                      prev_screen: 'Add Product',
                    });
                  }}>
                  <Scanner height={30} width={30} />
                </Pressable>
              </View>

              <Input
                placeholder="Enter Weight"
                val={state.weight}
                setVal={text =>
                  handleTextChange({
                    type: 'product_weight',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              />
              {/* <View style={{ marginVertical: 12 }}>
                <PrimaryButton
                  style={[
                    styles.btn,
                    {
                      width: '100%',
                      marginTop: 18,
                      borderRadius: 5,
                      backgroundColor: '#30475e',
                    },
                  ]}
                  handlePress={() => {
                    // SheetManager.show('addProductVariants', {
                    //   payload: {
                    //     addVariants: variants =>
                    //       handleTextChange({
                    //         type: 'variants',
                    //         payload: variants,
                    //       }),
                    //   },
                    // });
                    // if (!state.price || state.price.length === 0) {
                    //   toast.show(
                    //     'Please set Selling price before add variants',
                    //     { placement: 'top', type: 'danger' },
                    //   );
                    //   return;
                    // }
                    navigation.navigate('Add Product Variants', {
                      addVariants: variants =>
                        handleTextChange({
                          type: 'variants',
                          payload: variants,
                        }),
                      price: state.price,
                      variants: state.variants,
                    });
                  }}>
                  Add Product Variants
                </PrimaryButton>
              </View> */}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={addProduct.isLoading}
          handlePress={() => {
            // console.log('ca;leeeeeeeeee');
            if (
              state.name.length === 0 ||
              state.price.length === 0 ||
              !state.category ||
              state.outlet_list.length === 0
            ) {
              setShowError(true);
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            for (let outlet of state.outlet_list) {
              if (
                (
                  (outletInventory[outlet.label] &&
                    outletInventory[outlet.label].price) ||
                  ''
                ).length === 0
              ) {
                setShowError(true);
                toast.show('Please provide all required details', {
                  placement: 'top',
                  type: 'danger',
                });
                return;
              }
              if (
                trackStock &&
                (
                  (outletInventory[outlet.label] &&
                    outletInventory[outlet.label].lowStock) ||
                  ''
                ).length === 0
              ) {
                setShowError(true);
                toast.show('Please provide all required details', {
                  placement: 'top',
                  type: 'danger',
                });
                return;
              }
            }
            const outletInventoryList = {};
            for (let outletInventory_ in outletInventory) {
              const invItem = outletInventory[outletInventory_];
              console.log('invvvvv', invItem);
              if (outletInventory_) {
                outletInventoryList[invItem.outletId] = {
                  outletPrice: invItem.price,
                  outletQuantity: invItem.inStock || '-99',
                  outletStockLevel: invItem.lowStock || '-99',
                  outletUnitCost: 0,
                };
              }
            }

            let outletIds = '[';
            state.outlet_list.forEach(({ value }) => {
              outletIds += '"' + value + '",';
            });
            outletIds = outletIds.substring(0, outletIds.length - 1);
            outletIds += ']';

            const payload = {
              name: state.name,
              desc: state.desc,
              merchant: user.merchant,
              category:
                JSON.parse(state.category.value).product_category_id || '',
              outlet_list: outletIds,
              mod_by: user.login,

              taxable: applyTaxes ? 'YES' : 'NO',
              // property_list: state.variants
              //   ? JSON.stringify(state.variants)
              //   : '',
              price: state.price,
              cost: state.cost,
              tag: 'NORMAL',
              product_sku: state.sku,
              barcode: state.barcode,
              is_price_global: 'YES',
              // variants_options: '',
              has_variants: 'NO',
              // global: 'NO',
              weight: state.weight,
              quantity: state.quantity.length > 0 ? state.quantity : -99,
              outlet_inventory_list: JSON.stringify(outletInventoryList),
              trackStock: trackStock ? 'YES' : 'NO',
            };
            if (state.image) {
              payload['image[]'] = {
                name: state.image.fileName,
                type: state.image.type,
                uri:
                  Platform.OS === 'android'
                    ? state.image.uri
                    : state.image.uri.replace('file://', ''),
              };
            }

            addProduct.mutate(payload);
          }}>
          {addProduct.isLoading ? 'Processing' : 'Save product'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddProduct;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 10,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    backgroundColor: '#fff',
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

  label: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  toggle: {
    paddingVertical: 8,
    // borderBottomColor: '#ddd',
    // borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
