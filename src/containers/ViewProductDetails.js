/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { Switch } from '@rneui/themed';

import { useSelector } from 'react-redux';
import { useGetSelectedProductDetails } from '../hooks/useGetSelectedProductDetails';
import Loading from '../components/Loading';
import { useEditProduct } from '../hooks/useEditProduct';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import Input from '../components/Input';

import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useToast } from 'react-native-toast-notifications';
import { capitalize } from 'lodash';

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
      return { ...state, image: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    case 'outlet':
      return { ...state, outlet_list: action.payload };
    case 'low_stock':
      return { ...state, lowStock: action.payload };
    case 'variants':
      return { ...state, variants: action.payload };
    default:
      return state;
  }
};

function ViewProductDetails(props) {
  const { user } = useSelector(state => state.auth);

  // const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [applyTaxes, setApplyTaxes] = React.useState(true);
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
    mod_by: user.login,
    outlet_list: [],
    old_outlet_list: [],
    has_variants: 'NO',
    variants: null,
    lowStock: 0,
  });

  const { outlet } = props.route.params;
  const { inventoryOutlet } = useSelector(state_ => state_.products);

  // const toast = useToast();

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
    if (productDetails && productDetails.data.status == 0) {
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

      const productItemDetails =
        productDetails && productDetails.data && productDetails.data.data;
      const variants_ = productItemDetails.product_properties;
      const props_ = {};
      // const vars = [];
      let count = 0;
      for (let key in variants_) {
        const prop = variants_[key];
        for (let property of prop) {
          if (property) {
            const tProp = {
              propertyPrice: property.property_price,
              propertyPriceSet: property.property_price_set,
              propertyValue: property.property_value,
              propertyId: key,
              id: capitalize(key),
            };
            props_[count] = tProp;
            count++;
            // if (!props_[toUpper(key)]) {
            //   vars.push(toUpper(key));
            //   props_[key] = [tProp];
            // } else {
            //   props_[toUpper(key)].push(tProp);
            // }
          }
        }
      }

      console.log('properperoper', props_);

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
          image:
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
          productHasProperty:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_has_property,
          variants: props_,
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
          <ScrollView style={styles.main}>
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 5,
                borderColor: '#eee',
                borderWidth: 1,
                marginBottom: 10,
              }}
              source={{
                uri:
                  'https://payments.ipaygh.com/app/webroot/img/products/' +
                  state.image,
              }}
            />
            <Input
              placeholder="Enter product name"
              val={state.name}
              setVal={text =>
                handleTextChange({
                  type: 'product_name',
                  payload: text,
                })
              }
              disabled
            />
            <Input
              placeholder="Enter price"
              val={state.price}
              setVal={text =>
                handleTextChange({
                  type: 'product_price',
                  payload: text,
                })
              }
              keyboardType="number-pad"
              disabled
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
              disabled
            />
            <Picker
              value={state.category}
              editable={false}
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
                    disabled
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
                      disabled
                      style={{
                        width: !trackStock ? '100%' : '32%',
                        flex: !trackStock ? 1 : 0,
                        backgroundColor: '#fff',
                      }}
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
                          disabled
                          keyboardType="number-pad"
                          style={{
                            width: '32%',
                            backgroundColor: '#fff',
                          }}
                        />
                        <View style={{ marginHorizontal: 2 }} />
                        <Input
                          placeholder="Low Stock"
                          disabled
                          val={state.lowStock}
                          setVal={text =>
                            handleTextChange({
                              type: 'low_stock',
                              payload: text,
                            })
                          }
                          keyboardType="number-pad"
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
                  disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 10,
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

export default ViewProductDetails;
