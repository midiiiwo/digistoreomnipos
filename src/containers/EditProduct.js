/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { Switch } from '@rneui/themed';
import Image from 'react-native-fast-image';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useGetSelectedProductDetails } from '../hooks/useGetSelectedProductDetails';
import Loading from '../components/Loading';
import { useEditProduct } from '../hooks/useEditProduct';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AddImage from '../../assets/icons/add-image.svg';
import Input from '../components/Input';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useToast } from 'react-native-toast-notifications';
import { PERMISSIONS, request } from 'react-native-permissions';
import FastImage from 'react-native-fast-image';

const reducer = (state, action) => {
  switch (action.type) {
    case 'product_name':
      return { ...state, name: action.payload };
    case 'product_price':
      return { ...state, price: action.payload };
    case 'product_description':
      return { ...state, desc: action.payload };
    case 'product_category':
      return { ...state, category: action.payload };
    case 'product_quantity':
      return { ...state, quantity: action.payload };
    case 'product_cost':
      return { ...state, cost: action.payload };
    case 'product_SKU':
      return { ...state, sku: action.payload };
    case 'product_barcode':
      return { ...state, barcode: action.payload };
    case 'product_weight':
      return { ...state, weight: action.payload };
    case 'image':
      return { ...state, 'image[]': action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    case 'outlet':
      return { ...state, outlet_list: action.payload };
    case 'low_stock':
      return { ...state, lowStock: action.payload };

    default:
      return state;
  }
};

function EditProduct(props) {
  const { user } = useSelector(state => state.auth);

  // const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [applyTaxes, setApplyTaxes] = React.useState(true);
  const [openMenu, setOpenMenu] = React.useState(false);
  // const navigation = useNavigation();
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    price: 0,
    desc: '',
    category: null,
    quantity: 0,
    cost: 0,
    sku: '',
    barcode: '',
    weight: 0,
    tag: 'NORMAL',
    taxable: 'YES',
    is_price_global: 'YES',
    mod_by: user.user_name,
    outlet_list: [],
    has_variants: 'NO',
    lowStock: 0,
  });

  const { outlet } = props.route.params;
  const { inventoryOutlet } = useSelector(state_ => state_.products);

  const toast = useToast();

  const queryClient = useQueryClient();
  const [trackStock, setTrackStock] = React.useState(false);

  const { data, isLoading: isCatLoading } = useGetAllProductsCategories(
    user.merchant,
  );

  const { data: productDetails, isLoading } = useGetSelectedProductDetails(
    user.merchant,
    (outlet && outlet.outlet_id) || '',
    props.route.params.id,
  );

  const { data: outlets, isLoading: isOutletsLoading } = useGetStoreOutlets(
    user.merchant,
  );

  const editProduct = useEditProduct(i => {
    console.log('iiiiiii', i);
    if (i) {
      if (i.status == 0) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: i.message,
        });
        queryClient.invalidateQueries('global-products');
        props.navigation.navigate('Products');
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed',
          textBody: i && i.message,
        });
      }
    }
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
    if (productDetails && productDetails && productDetails.data.status == 0) {
      const pCat =
        productDetails &&
        productDetails.data &&
        productDetails.data.data &&
        productDetails.data.data.product_category;

      const cat =
        data &&
        data.data &&
        data.data.data.find(i => {
          if (!i) {
            return;
          }
          return i.product_category === pCat;
        });

      // const pOutlets =
      //   productDetails &&
      //   productDetails.data &&
      //   productDetails.data.data &&
      //   productDetails.data.data.product_outlets.map(i => i.outlet_id);

      // const productOutlets =
      //   outlets &&
      //   outlets.data &&
      //   outlets.data.data
      //     .filter(i => {
      //       if (!i) {
      //         return false;
      //       }
      //       return pOutlets.includes(i.outlet_id);
      //     })
      //     .map(i => ({ label: i.outlet_name, value: i.outlet_id }));

      dispatch({
        type: 'update_all',
        payload: {
          name:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_name,
          price:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_price,
          desc:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_description,
          category: {
            label: cat && cat.product_category,
            value: cat && JSON.stringify(cat),
            key: cat && cat.product_category,
          },
          quantity:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_quantity,
          cost:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_unit_cost &&
            productDetails.data.data.product_unit_cost.length > 0
              ? productDetails.data.data.product_unit_cost
              : 0,
          sku:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_sku,
          barcode:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_barcode,
          'image[]':
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_image,
          weight:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_weight &&
            productDetails.data.data.product_weight.length > 0
              ? productDetails.data.data.product_weight
              : 0,
          tag: 'NORMAL',
          taxable:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_taxed,
          is_price_global: 'YES',
          mod_by: user.login,
          // outlet_list: productOutlets,
          // old_outlet_list: productOutlets,

          // variants: props_,
          outlet_list: [inventoryOutlet],
          lowStock:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_stock_level,
        },
      });
    }
    setApplyTaxes(
      productDetails &&
        productDetails.data &&
        productDetails.data.data &&
        productDetails.data.data.product_taxed === 'YES',
    );

    setTrackStock(
      productDetails &&
        productDetails.data &&
        productDetails.data.data &&
        productDetails.data.data.product_track_stock === 'YES',
    );
  }, [user.login, productDetails, data, outlets, inventoryOutlet]);

  if (isLoading || isCatLoading || isOutletsLoading) {
    return <Loading />;
  }

  return (
    <>
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        {!(isLoading && isCatLoading && isOutletsLoading) && (
          <ScrollView
            style={styles.main}
            contentContainerStyle={{
              paddingBottom: Dimensions.get('window').height * 0.3,
            }}>
            <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
              <Menu
                opened={openMenu}
                onBackdropPress={() => setOpenMenu(false)}>
                <MenuTrigger
                  onPress={() => setOpenMenu(!openMenu)}
                  children={
                    <View
                    // onPress={}
                    >
                      {!state['image[]'] && (
                        <AddImage height={100} width={100} />
                      )}
                      {state['image[]'] &&
                        typeof state['image[]'] === 'string' && (
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: '#eee',
                            }}
                            source={{
                              uri:
                                'https://payments.ipaygh.com/app/webroot/img/products/' +
                                state['image[]'],
                              cache: FastImage.cacheControl.web,
                              priority: FastImage.priority.low,
                            }}
                          />
                        )}
                      {state['image[]'] &&
                        typeof state['image[]'] === 'object' && (
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: '#eee',
                            }}
                            source={{
                              uri: state['image[]'].uri,
                              cache: FastImage.cacheControl.web,
                              priority: FastImage.priority.low,
                            }}
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
                              quality: 0.65,
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
                  <Text
                    style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
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
              placeholder="Enter price"
              val={state.price}
              showError={showError && state.price === 0}
              setVal={text =>
                handleTextChange({
                  type: 'product_price',
                  payload: text,
                })
              }
              keyboardType="number-pad"
            />
            <Input
              placeholder="Enter description (optional)"
              val={state.desc}
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
                handleTextChange({
                  type: 'product_category',
                  payload: item,
                });
              }}>
              {data &&
                data.data &&
                data.data.data &&
                data.data.data.map(item => {
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
                })}
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
                      {(inventoryOutlet && inventoryOutlet.outlet_name) || ''}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Input
                      placeholder="Price"
                      val={state.price}
                      setVal={text =>
                        handleTextChange({
                          type: 'product_price',
                          payload: text,
                        })
                      }
                      style={{
                        width: !trackStock ? '100%' : '32%',
                        flex: !trackStock ? 1 : 0,
                        backgroundColor: '#fff',
                      }}
                      showError={showError && state.price.length === 0}
                      keyboardType="number-pad"
                    />
                    <View style={{ marginHorizontal: 2 }} />
                    {trackStock && (
                      <>
                        <Input
                          placeholder="In Stock"
                          val={state.quantity}
                          setVal={text =>
                            handleTextChange({
                              type: 'product_quantity',
                              payload: text,
                            })
                          }
                          keyboardType="number-pad"
                          showError={
                            showError &&
                            trackStock &&
                            state.quantity.length === 0
                          }
                          style={{
                            width: '32%',
                            backgroundColor: '#fff',
                          }}
                        />
                        <View style={{ marginHorizontal: 2 }} />
                        <Input
                          placeholder="Low Stock"
                          val={state.lowStock}
                          setVal={text =>
                            handleTextChange({
                              type: 'low_stock',
                              payload: text,
                            })
                          }
                          keyboardType="number-pad"
                          showError={
                            showError &&
                            trackStock &&
                            state.lowStock.length === 0
                          }
                          style={{
                            width: '32%',
                            backgroundColor: '#fff',
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>
              </View>
            )}
            {/* <Pressable
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
            </Pressable> */}
            {/* {toggleMoreInput && ( */}
            <View>
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
              /> */}
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
              <Input
                placeholder="Enter Cost"
                val={state.cost}
                setVal={text =>
                  handleTextChange({
                    type: 'product_cost',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              />
              <Input
                placeholder="Enter SKU"
                val={state.sku}
                setVal={text =>
                  handleTextChange({
                    type: 'product_SKU',
                    payload: text,
                  })
                }
              />
              <Input
                placeholder="Enter Barcode"
                val={state.barcode}
                setVal={text =>
                  handleTextChange({
                    type: 'product_barcode',
                    payload: text,
                  })
                }
              />
              <Input
                placeholder="Enter Weight"
                val={state.weight}
                setVal={text =>
                  handleTextChange({
                    type: 'product_weight',
                    payload: text,
                  })
                }
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
                    navigation.navigate('Edit Product Variants', {
                      addVariants: variants =>
                        handleTextChange({
                          type: 'variants',
                          payload: variants,
                        }),
                      price: state.price,
                      variants: state.variants,
                    });
                  }}>
                  Edit Product Variants
                </PrimaryButton>
              </View> */}
            </View>
            {/* )} */}
          </ScrollView>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={editProduct.isLoading}
          handlePress={() => {
            if (
              state.name.length === 0 ||
              state.price === 0 ||
              !state.category
            ) {
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            if (
              trackStock &&
              (state.lowStock.length === 0 || state.quantity === 0)
            ) {
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            // let outletIds = '[';
            // let oldOutletIds = '[';
            // state.outlet_list.forEach(({ value }) => {
            //   outletIds += '"' + value + '",';
            // });
            // outletIds = outletIds.substring(0, outletIds.length - 1);
            // outletIds += ']';

            // state.old_outlet_list.forEach(({ value }) => {
            //   oldOutletIds += '"' + value + '",';
            // });
            // oldOutletIds = oldOutletIds.substring(0, oldOutletIds.length - 1);
            // oldOutletIds += ']';

            const outletIds = state.outlet_list.map(i => {
              if (i) {
                return i.outlet_id;
              }
            });
            const outletId = outletIds[0];
            const outletInventory_ = {
              [outletId]: {
                outletPrice: state.price,
                outletQuantity: state.quantity,
                outletStockLevel: state.lowStock,
                outletUnitCost: 0,
              },
            };
            if (trackStock) {
              outletInventory_[outletId] = {
                ...outletInventory_[outletId],
                outletQuantity: state.quantity,
                outletStockLevel: state.lowStock,
              };
            }

            editProduct.mutate({
              ...state,
              id: props.route.params.id,
              outlet_list: JSON.stringify(outletIds),
              merchant: user.merchant,
              category: JSON.parse(state.category.value).product_category_id,
              outlet_inventory_list: JSON.stringify(outletInventory_),
              'image[]':
                state['image[]'] && typeof state['image[]'] === 'object'
                  ? {
                      name: state['image[]'].fileName,
                      type: state['image[]'].type,
                      uri:
                        Platform.OS === 'android'
                          ? state['image[]'].uri
                          : state['image[]'].uri.replace('file://', ''),
                    }
                  : typeof state['image[]'] === 'string'
                  ? state['image[]']
                  : '',
              trackStock: trackStock ? 'YES' : 'NO',
            });
          }}>
          {editProduct.isLoading ? 'Processing' : 'Save product'}
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
    backgroundColor: '#fff',
    borderRadius: 0,
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
    bottom: 14,
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
  dWrapper: {
    paddingTop: 12,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 12,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditProduct;
