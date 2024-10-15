/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';
import { Switch } from 'react-native-ui-lib';

import { useGetOutletCategories } from '../../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import { useAddCategoryProduct } from '../../hooks/useAddCategoryProduct';
import { useGetSelectedProductDetails } from '../../hooks/useGetSelectedProductDetails';
import Loading from '../Loading';
import _ from 'lodash';
import { useEditProduct } from '../../hooks/useEditProduct';
import { useQueryClient } from 'react-query';
import Picker from '../Picker';

const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
  return (
    <TextInput
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#B7C4CF'}
      activeOutlineColor={showError ? '#EB455F' : '#1942D8'}
      outlineStyle={{
        borderWidth: 0.9,
        borderRadius: 4,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
    />
  );
};

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
    case 'product_SKU':
      return { ...state, SKU: action.payload };
    case 'product_barcode':
      return { ...state, barcode: action.payload };
    case 'product_weight':
      return { ...state, weight: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function EditProductSheet(props) {
  const { user } = useSelector(state => state.auth);
  const { data } = useGetOutletCategories(user.merchant, user.outlet);
  const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
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
  });

  const queryClient = useQueryClient();

  const { data: productDetails, isLoading } = useGetSelectedProductDetails(
    props.payload.id,
  );

  const editProduct = useEditProduct(i => {
    if (i.status == 0) {
      setSaved('Success');
      queryClient.invalidateQueries('outlet-products');
      return;
    }
    setSaved('Failed');
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
      const cat =
        data &&
        data.data &&
        _.find(data.data.data, {
          category_name:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_category,
        });
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
            label: cat.category_name,
            value: cat,
            key: cat.category_name,
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
          weight:
            productDetails &&
            productDetails.data &&
            productDetails.data.data &&
            productDetails.data.data.product_weight &&
            productDetails.data.data.product_weight.length > 0
              ? productDetails.data.data.product_weight
              : 0,
          tag: 'NORMAL',
          taxable: 'YES',
          is_price_global: 'YES',
          mod_by: user.user_name,
          outlet_list: [],
        },
      });
    }
  }, [user.user_name, productDetails, data]);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      snapPoints={['98']}
      defaultOverlayOpacity={0.3}>
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
          }}>
          <Pressable
            onPress={() => SheetManager.hide('editProduct')}
            style={{ marginRight: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: 'rgba(25, 66, 216, 0.9)',
                fontFamily: 'Inter-Medium',
              }}>
              Done
            </Text>
          </Pressable>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'Inter-Medium',
              paddingTop: 18,
              fontSize: 15,
            }}>
            Edit product
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('editProduct')}
            style={{ marginLeft: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: '#EB455F',
                fontFamily: 'Inter-Medium',
              }}>
              Cancel
            </Text>
          </Pressable>
        </View>
        {isLoading && <Loading />}
        {!isLoading && (
          <ScrollView style={styles.main}>
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
                  return (
                    <RNPicker.Item
                      key={item.category_name}
                      label={item.category_name}
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
            <View style={styles.toggle}>
              <Switch
                value={toggleMoreInput}
                onValueChange={() => setToggleMoreInput(!toggleMoreInput)}
                onColor="#2192FF"
                offColor="#EEF1F2"
              />
              <Text style={styles.label}>Add more details</Text>
            </View>
            {toggleMoreInput && (
              <View>
                <Input
                  val={state.quantity}
                  placeholder="Enter Quantity"
                  setVal={text =>
                    handleTextChange({
                      type: 'product_quantity',
                      payload: text,
                    })
                  }
                  keyboardType="number-pad"
                />
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
              </View>
            )}
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
              setShowError(true);
              return;
            }
            editProduct.mutate({
              ...state,
              id: props.payload.id,
              merchant: user.merchant,
              category:
                typeof state.category.value === 'string'
                  ? JSON.parse(state.category.value).category_id
                  : state.category.value.category_id,
            });
          }}>
          {editProduct.isLoading
            ? 'Loading'
            : saved.length > 0
            ? saved
            : 'Save product'}
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}
PrimaryButton;

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

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 14,
    height: '100%',
    zIndex: 100,
  },
  main: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#B7D9F8',
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#F5FAFF',
  },
});

export default EditProductSheet;
