/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  FlatList,
  LayoutAnimation,
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
import moment from 'moment';

const Cart = ({ navigation }) => {
  const {
    setAddTaxes,
    setTotalAmount,
    setQuickSaleInAction,
    clearDiscount,
    setOrderTaxes,
  } = useActionCreator();
  const {
    cart,
    subTotal,
    discountPayload,
    delivery,
    totalItems,
    addTaxes,
    deliveryDueDate,
    orderDate,
  } = useSelector(state => state.sale);

  const { applyDiscount } = useActionCreator();



  const calculateDiscount = () => {
    return cart.reduce((acc, item) => {
      const originalAmount = item.amount * item.quantity;
      let discountedAmount = originalAmount;

      if (item.discount) {
        if (item.discount.type === "PERCENTAGE") {
          discountedAmount -= originalAmount * parseFloat(item.discount.disc);
        } else {
          discountedAmount -= parseFloat(item.discount.disc) * item.quantity;
        }
        discountedAmount = Math.max(discountedAmount, 0);
      }

      return acc + (originalAmount - discountedAmount);
    }, 0);
  };

  const discountAmount = calculateDiscount();
  const totalAmount = subTotal - discountAmount;



  const [hasAppliedDiscount, setHasAppliedDiscount] = React.useState(false);

  React.useEffect(() => {
    if (!hasAppliedDiscount) {
      // Calculate the total discount amount using the discount values from the cart items
      const totalDiscount = cart.reduce((acc, item) => {
        if (item.discount) {
          return acc + parseFloat(item.discount.disc) * item.quantity; // Use item.discount.disc as quantity
        }
        return acc;
      }, 0);

      if (totalDiscount > 0) {
        // Update discountPayload using applyDiscount if discount amount is greater than 0
        applyDiscount({
          discountType: 'GHS', // or '%', depending on your logic
          quantity: discountAmount, // Set the total discount amount here
          discountCode: undefined, // Replace with your actual discount code logic
        });
        setHasAppliedDiscount(true); // Mark as applied
      } else {
        // If total discount amount is 0, you can also clear the discount if needed
        applyDiscount({
          discountType: 'GHS', // or '%', depending on your logic
          quantity: 0, // Set quantity to 0 to clear discount
          discountCode: undefined,
        });
        setHasAppliedDiscount(true); // Mark as applied
      }
    }
  }, [cart, applyDiscount, hasAppliedDiscount]);








  const { user } = useSelector(state => state.auth);

  const { data, isLoading } = useGetApplicableTaxes(user.merchant);
  const toast = useToast();

  if (isLoading) {
    return <Loading />;
  }

  const orderAmount = (cart || []).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    return acc + Number(curr.amount) * Number(curr.quantity);
  }, 0);

  const taxes_ =
    (data?.data?.data || []).map(tax => {
      if (tax) {
        return {
          taxName: tax.tax_name,
          amount: Number(
            (
              tax.tax_value *
              (orderAmount - (discountPayload?.discount || 0))
            ).toFixed(2),
          ),
          appliedAs: tax.tax_applied_as,
          taxId: tax.tax_id,
          taxValue: tax.tax_value,
        };
      }
    }) || [];

  const totalTaxesApplied =
    (addTaxes &&
      taxes_ &&
      taxes_
        .filter(i => i && i.appliedAs === 'EXCLUSIVE')
        .reduce((acc, curr) => {
          return acc + curr.amount;
        }, 0)) ||
    0;

  const totalOtherAmount =
    totalTaxesApplied +
    Number((delivery && delivery.price && delivery.price.toFixed(2)) || 0);

  console.log("hi", cart);



  console.log(discountPayload, " discountpayloader")

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
            style={{
              fontFamily: 'ReadexPro-bold',
              fontSize: 18,
              color: '#30475e',
            }}>
            You have no items in your cart
          </Text>
          <Text
            style={{
              fontFamily: 'ReadexPro-Medium',
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

                          onValueChange={() => {
                            setAddTaxes(!addTaxes);
                            LayoutAnimation.configureNext(
                              LayoutAnimation.Presets.easeInEaseOut,
                            );
                          }}
                        />
                      )}
                    </View>
                    <View style={[styles.taxMain, { marginBottom: 3 }]}>
                      <Text style={[styles.taxLabel]}>Subtotal</Text>
                      <View style={styles.amountWrapper}>
                        <Text style={styles.taxAmount}>
                          GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }).format(orderAmount)}
                        </Text>
                      </View>
                    </View>
                    {/* {discountAmount > 0 && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.discountText}>Discount:</Text>
                        <Text> - GHS {discountAmount.toFixed(2)}</Text>
                      </View>
                    )} */}
                    {discountPayload && discountPayload.discount > 0 && (
                      <View style={[styles.taxMain, { marginTop: 0 }]}>
                        <Text style={styles.taxLabel}>
                          Discount{' '}
                          {discountPayload && discountPayload.discountCode && (
                            <Text
                              style={{
                                fontFamily: 'ReadexPro-Regular',
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
                          }).format(discountPayload?.discount)}
                        </Text>
                      </View>
                    )}

                    {addTaxes && (
                      <FlatList
                        data={taxes_}
                        renderItem={({ item }) => {
                          if (item?.appliedAs === 'INCLUSIVE') {
                            return <></>;
                          }
                          return (
                            <View
                              style={[
                                styles.taxMain,
                                {
                                  marginBottom: 0,
                                  marginTop: 3,
                                },
                              ]}>
                              <Text style={styles.taxLabel}>
                                {item?.taxName} - {Number(item?.taxValue) * 100}
                                %{' '}
                                <Text
                                  style={{
                                    textTransform: 'capitalize',
                                    fontSize: 13,
                                    color: '#9DB2BF',
                                    fontFamily: 'ReadexPro-Medium',
                                  }}>
                                  (
                                  {item?.appliedAs === 'INCLUSIVE'
                                    ? 'Incl.'
                                    : 'Excl.'}
                                  )
                                </Text>
                              </Text>
                              <Text style={styles.taxAmount}>
                                GHS{' '}
                                {new Intl.NumberFormat('en-US', {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                }).format(Number(item?.amount))}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    )}
                    {delivery && Number(delivery.price) > 0 && (
                      <View
                        style={[
                          styles.taxMain,
                          { marginTop: 0, marginBottom: 3 },
                        ]}>
                        <Text style={styles.taxLabel}>Delivery</Text>
                        <Text style={styles.taxAmount}>
                          GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }).format(delivery ? delivery?.price : 0)}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.taxMain,
                        {
                          borderTopColor: '#DDDDDD',
                          borderTopWidth: 0.4,
                          paddingTop: 10,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.taxLabel,
                          {
                            fontSize: 14.5,
                            fontFamily: 'ReadexPro-bold',
                          },
                        ]}>
                        Total
                      </Text>
                      <View style={[styles.amountWrapper]}>
                        {/* {discountAmount > 0 && (
                          <Text style={[styles.oldText]}>
                            GHS{' '}
                            {(
                              subTotal + totalOtherAmount
                            ).toFixed(2)}
                          </Text>

                        )} */}
                        {/* {discountAmount > 0 && (
                          <Text
                            style={[
                              styles.taxAmount,
                              {
                                fontSize: 14.5,
                                fontFamily: 'ReadexPro-bold',
                              },
                            ]}>
                            GHS{' '}
                            {new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(totalAmount + totalOtherAmount)}
                          </Text>
                        )} */}
                        {discountPayload && discountPayload.newAmount > 0 && discountAmount > 0 && (
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
                            {
                              fontSize: 14.5,
                              fontFamily: 'ReadexPro-bold',
                            },
                          ]}>
                          GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(subTotal + totalOtherAmount)}
                        </Text>

                      </View>
                    </View>
                    {addTaxes && (
                      <FlatList
                        data={taxes_}
                        renderItem={({ item }) => {
                          if (item?.appliedAs === 'EXCLUSIVE') {
                            return <></>;
                          }
                          return (
                            <View
                              style={[
                                styles.taxMain,
                                {
                                  marginBottom: 0,
                                  marginTop: 3,
                                },
                              ]}>
                              <Text style={styles.taxLabel}>
                                {item?.taxName} - {Number(item?.taxValue) * 100}
                                %{' '}
                                <Text
                                  style={{
                                    textTransform: 'capitalize',
                                    fontSize: 13,
                                    color: '#9DB2BF',
                                    fontFamily: 'ReadexPro-Medium',
                                  }}>
                                  (
                                  {item?.appliedAs === 'INCLUSIVE'
                                    ? 'Incl.'
                                    : 'Excl.'}
                                  )
                                </Text>
                              </Text>
                              <Text style={styles.taxAmount}>
                                GHS{' '}
                                {new Intl.NumberFormat('en-US', {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                }).format(Number(item?.amount))}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    )}
                    <View>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('Add Discount', {
                            type: 'inventory',
                          });
                        }}
                        disabled={discountAmount > 0}
                        style={{
                          padding: 12,
                          paddingHorizontal: 1,
                          marginLeft: 'auto',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 16,
                            color: discountAmount > 0 ? 'gray' : '#59C1BD',
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
                          Select Delivery Option ({delivery && delivery.label})
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => SheetManager.show('Order Date')}
                        style={{
                          paddingHorizontal: 1,
                          marginLeft: 'auto',
                          marginTop: 13,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 16,
                            color: '#59C1BD',
                          }}>
                          Select Order Date
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Regular',
                            fontSize: 14,
                            color: '#808080',
                            textAlign: 'right',
                          }}>
                          {orderDate && moment(orderDate).format('DD-MMM-YYYY')}
                        </Text>
                      </Pressable>
                      {user &&
                        user.user_permissions &&
                        user.user_permissions.includes('ADDORDERDLVRDATE') && (
                          <Pressable
                            onPress={() => SheetManager.show('deliveryDueDate')}
                            style={{
                              paddingHorizontal: 1,
                              marginLeft: 'auto',
                              marginTop: 13,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontSize: 16,
                                color: '#59C1BD',
                              }}>
                              Select Delivery Due Date
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontSize: 14,
                                color: '#808080',
                                textAlign: 'right',
                              }}>
                              {deliveryDueDate &&
                                moment(deliveryDueDate).format('DD-MMM-YYYY')}
                            </Text>
                          </Pressable>
                        )}

                      {user &&
                        user.user_permissions &&
                        !user.user_permissions.includes('ADDORDERDLVRDATE') && (
                          <Pressable
                            onPress={() => SheetManager.show('deliveryNote')}
                            style={{
                              paddingHorizontal: 1,
                              marginLeft: 'auto',
                              marginTop: 13,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontSize: 16,
                                color: '#59C1BD',
                              }}>
                              Add Delivery Notes
                            </Text>
                          </Pressable>
                        )}

                      {discountPayload && (
                        <Pressable
                          disabled={discountAmount > 0}
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
                              color: discountAmount > 0 ? 'gray' : '#E0144C',
                              // color: '#E0144C',
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

            // if (discountAmount > 0) {
            //   setTotalAmount(Number((totalAmount + totalOtherAmount).toFixed(2)));
            // } else {
            //   setTotalAmount(Number((subTotal + totalOtherAmount).toFixed(2)));
            // }
            setTotalAmount(Number((subTotal + totalOtherAmount).toFixed(2)));
            // setTotalAmount(Number((orderAmount + totalOtherAmount).toFixed(2)));
            if (addTaxes) {
              setOrderTaxes(taxes_);
            }
            navigation.navigate('Payments');
          }}
          disabled={cart.length === 0}>
          {totalItems} items - GHS{' '}
          {/* {discountAmount > 0
            ? Number(totalAmount + totalOtherAmount).toFixed(2)
            : Number(subTotal + totalOtherAmount).toFixed(2)} */}
          {Number(subTotal + totalOtherAmount).toFixed(2)}
          {/* {Number(orderAmount + totalOtherAmount).toFixed(2)} */}
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
    borderRadius: 4,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
  },
  label: {
    fontFamily: 'ReadexPro-Regular',
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
    fontFamily: 'ReadexPro-Regular',
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
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    color: '#5C6E91',
    letterSpacing: 0.2,
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 14,
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
