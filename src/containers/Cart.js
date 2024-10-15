/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SheetManager } from 'react-native-actions-sheet';
// import ToggleSwitch from 'toggle-switch-react-native';

import ButtonCancelBottom from '../components/ButtonCancelBottom';
import ButtonLargeBottom from '../components/ButtonLargeBottom';
import CartItem from '../components/CartItem';
import { useActionCreator } from '../hooks/useActionCreator';

import ArrowUp from '../../assets/icons/caret-top.svg';
import { useGetApplicableTaxes } from '../hooks/useGetApplicableTaxes';
import { useToast } from 'react-native-toast-notifications';
import Loading from '../components/Loading';
import _ from 'lodash';
// import { Switch } from 'react-native-ui-lib';
import { FlashList } from '@shopify/flash-list';
import { Switch } from '@rneui/themed';
import { DateTimePicker } from 'react-native-ui-lib';

const Cart = ({ navigation }) => {
  const {
    setAddTaxes,
    setTotalAmount,
    setQuickSaleInAction,
    setOrderDate,
    clearDiscount,
  } = useActionCreator();
  const {
    cart,
    subTotal,
    discountPayload,
    delivery,
    totalItems,
    addTaxes,
    orderDate,
  } = useSelector(state => state.sale);
  const { user } = useSelector(state => state.auth);

  console.log('ldlslkslgkjsgsgd', orderDate);

  // const { oldAmount, discount, newAmount } = discountPayload;

  const { data, isLoading } = useGetApplicableTaxes(user.merchant);
  const toast = useToast();

  // React.useEffect(() => {
  //   if (cart.length === 0) {
  //     resetCart();
  //   }
  // }, [cart, resetCart]);

  if (isLoading) {
    return <Loading />;
  }

  const taxes_ =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.map(tax => {
        return {
          taxName: tax.tax_name,
          amount: Number((tax.tax_value * subTotal).toFixed(2)),
        };
      })) ||
    [];

  const totalOtherAmount =
    ((addTaxes &&
      taxes_ &&
      taxes_.reduce((acc, curr) => acc + curr.amount, 0)) ||
      0) + Number(delivery.price.toFixed(2));

  return (
    <View style={styles.main}>
      {cart.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{ fontFamily: 'Lato-Bold', fontSize: 18, color: '#30475e' }}>
            You have no items in your cart
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Medium',
              fontSize: 15,
              color: '#748DA6',
              marginTop: 10,
            }}>
            Add first item
          </Text>
          <Pressable
            style={[
              styles.btn,
              {
                marginTop: 14,
                backgroundColor: '#rgba(25, 66, 216, 0.9)',
              },
            ]}
            onPress={async () => {
              navigation.navigate('Inventory');
            }}>
            <Text style={styles.signin}>Add Items</Text>
          </Pressable>
        </View>
      )}
      {cart.length > 0 && (
        <View style={styles.cartWrapper}>
          <FlashList
            estimatedItemSize={100}
            keyExtractor={item => item.id}
            data={_.uniqBy(cart, 'id')}
            renderItem={({ item }) => {
              return <CartItem item={item} />;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            scrollEnabled
            ListFooterComponent={() => {
              return (
                cart.length > 0 && (
                  <View style={styles.allTaxMain}>
                    <View style={styles.toggle}>
                      <Text style={styles.label}>Apply taxes</Text>
                      {taxes_.length > 0 && (
                        <Switch
                          value={addTaxes}
                          trackColor={{
                            true: '#0081C9',
                            false: '#CFCFCF',
                          }}
                          // onColor="#2192FF"
                          // offColor="#EEF1F2"
                          // label="Apply taxes"
                          // labelStyle={styles.label}
                          // size="medium"
                          // animationSpeed={200}

                          onValueChange={() => setAddTaxes(!addTaxes)}
                        />
                      )}
                    </View>
                    <View style={styles.taxMain}>
                      <Text style={styles.taxLabel}>Subtotal</Text>
                      <View style={styles.amountWrapper}>
                        <Text style={styles.taxAmount}>
                          GHS{' '}
                          {subTotal +
                            (discountPayload && discountPayload.discount) || 0}
                        </Text>
                      </View>
                    </View>
                    {discountPayload?.discount > 0 && (
                      <View style={styles.taxMain}>
                        <Text style={styles.taxLabel}>
                          Discount{' '}
                          {discountPayload && discountPayload.discountCode && (
                            <Text
                              style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 15,
                                color: '#73777B',
                              }}>
                              {`(${discountPayload?.discountCode})`.trimEnd()}
                            </Text>
                          )}
                        </Text>
                        <Text style={styles.taxAmount}>
                          GHS -
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(discountPayload.discount)}
                        </Text>
                      </View>
                    )}
                    {addTaxes && (
                      <FlatList
                        data={taxes_}
                        renderItem={({ item }) => {
                          console.log('taxxxxxx', item);
                          return (
                            <View style={styles.taxMain}>
                              <Text style={styles.taxLabel}>
                                {item.taxName}
                              </Text>
                              <Text style={styles.taxAmount}>
                                GHS {item.amount}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    )}
                    {Number(delivery?.price) > 0 && (
                      <View style={styles.taxMain}>
                        <Text style={styles.taxLabel}>Delivery</Text>
                        <Text style={styles.taxAmount}>
                          GHS {delivery ? delivery.price : 0}
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.taxMain,
                        {
                          borderTopColor: '#DDDDDD',
                          borderTopWidth: 0.4,
                          paddingTop: 16,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.taxLabel,
                          {
                            fontSize: 17,
                            fontFamily: 'SFProDisplay-Medium',
                          },
                        ]}>
                        Total
                      </Text>
                      <View style={[styles.amountWrapper]}>
                        {discountPayload && discountPayload.newAmount > 0 && (
                          <Text style={[styles.oldText]}>
                            GHS{' '}
                            {(
                              discountPayload.oldAmount + totalOtherAmount
                            ).toFixed(2)}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.taxAmount,
                            { fontSize: 17, fontFamily: 'SFProDisplay-Medium' },
                          ]}>
                          GHS {(subTotal + totalOtherAmount).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Pressable
                        onPress={
                          () => {
                            navigation.navigate('Add Discount', {
                              type: 'inventory',
                            });
                          }
                          // SheetManager.show('discount', {
                          //   payload: { type: 'inventory', navigation },
                          // })
                        }
                        style={{
                          padding: 12,
                          paddingHorizontal: 1,
                          marginLeft: 'auto',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 16,
                            color: '#59C1BD',
                          }}>
                          Add discount
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          SheetManager.show('delivery', {
                            payload: { type: 'inventory' },
                          })
                        }
                        style={{
                          paddingHorizontal: 1,
                          marginLeft: 'auto',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 16,
                            color: '#59C1BD',
                          }}>
                          Add delivery rate
                        </Text>
                      </Pressable>
                      <DateTimePicker
                        title={''}
                        placeholder={'Order Date'}
                        mode={'date'}
                        migrate
                        value={orderDate}
                        onChange={val => {
                          setOrderDate(val);
                        }}
                        // dateFormat="ddd, Do MMMM, YYYY"
                      />
                      {discountPayload && (
                        <Pressable
                          onPress={() =>
                            clearDiscount(
                              subTotal +
                                (discountPayload && discountPayload.discount) ||
                                0,
                            )
                          }
                          style={{
                            paddingHorizontal: 1,
                            marginLeft: 'auto',
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'SFProDisplay-Regular',
                              fontSize: 16,
                              color: '#E0144C',
                            }}>
                            Clear discount
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                )
              );
            }}
          />
        </View>
      )}

      <View style={styles.btnWrapper}>
        <ButtonLargeBottom
          backgroundColor="#59C1BD"
          width="80%"
          disabledColor="rgba(89, 193, 189, 1)"
          handlePress={() => {
            if (!delivery) {
              toast.show('Please select delivery option', {
                type: 'danger',
                placement: 'top',
              });
              return;
            }

            setQuickSaleInAction(false);

            setTotalAmount(Number((subTotal + totalOtherAmount).toFixed(2)));
            navigation.navigate('Payments');
          }}
          disabled={cart.length === 0}>
          {totalItems} items - GHS {(subTotal + totalOtherAmount).toFixed(2)}
        </ButtonLargeBottom>
        <ButtonCancelBottom
          Icon={ArrowUp}
          handlePress={() =>
            SheetManager.show('cartOptions', { payload: { navigation } })
          }
          extraStyle={styles.extraStyleBtnCancel}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  cartWrapper: {
    marginTop: 22,
    flex: 1,
  },
  oldText: {
    textDecorationLine: 'line-through',
    fontFamily: 'JetBrainsMono-Regular',
    marginRight: 10,
    color: '#73777B',
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 15,
  },
  label: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475E',
    fontSize: 16,
    marginRight: 5,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountWrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  deleteMain: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 'auto',
    backgroundColor: '#FF6464',
    width: '100%',
    marginVertical: -1,
  },
  separator: {
    height: 22,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  extraStyleBtnCancel: { backgroundColor: '#F1EEE9' },
  deleteText: {
    color: '#fff',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    marginRight: 20,
  },
  allTaxMain: {
    marginTop: 14,
    // borderTopColor: '#ddd',
    // borderTopWidth: 0.4,
    marginHorizontal: 20,
  },
  taxMain: {
    flexDirection: 'row',
    marginVertical: 6,
    marginTop: 10,
  },
  taxLabel: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#5C6E91',
    letterSpacing: 0.2,
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#5C6E91',
  },
  btnWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Cart;
