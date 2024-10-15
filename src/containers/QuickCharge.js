/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  // TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import Input from '../components/Input';

import CaretRight from '../../assets/icons/check-outline.svg';

import ButtonLargeBottom from '../components/ButtonLargeBottom';
import Keypad from '../components/Keypad';
import { useActionCreator } from '../hooks/useActionCreator';
import { uniqueId } from 'lodash';
import { useToast } from 'react-native-toast-notifications';
import { useGetSaleChannelList } from '../hooks/useGetSaleChannelList';
import { useApplyDiscountCode } from '../hooks/useApplyDiscountCode';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuickCharge = ({ navigation, route }) => {
  const {
    addToCart,
    addDescription,
    setQuickSaleInAction,
    resetCart,
    applyQuickSaleDiscount,
    setQuickSaleSubTotal,
    // updateSubTotalFromNumber,
    clearAmount,

    // updateSubTotalFromNumber,
  } = useActionCreator();
  const { description, channel, amount, tempProduct, subTotal } = useSelector(
    state => state.quickSale,
  );

  const [pendingDiscount, setPendingDiscount] = React.useState();
  const { selectChannel } = useActionCreator();
  function handleSelect(channel_) {
    selectChannel(channel_);
  }
  const { user } = useSelector(state => state.auth);
  const { data } = useGetSaleChannelList(user.merchant);

  const [discountCode, setDiscountCode] = React.useState('');
  const { discountPayload, cart } = useSelector(state => state.sale);
  const [discountCodeStatus, setDiscountCodeStatus] = React.useState();
  const applyDiscountCode = useApplyDiscountCode(setDiscountCodeStatus);
  const test = React.useRef(0);

  const toast = useToast();
  test.current += 1;
  const { bottom } = useSafeAreaInsets();

  // const toast = useToast();
  // const { cart } = useSelector(state => state.sale);

  const resetCharge = React.useCallback(() => {
    addDescription('');
    // selectChannel('Inshop');
    clearAmount();
    setQuickSaleSubTotal(0);
  }, [addDescription, clearAmount, setQuickSaleSubTotal]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (
        (route &&
          route.params &&
          route.params.prev_screen &&
          route.params.prev_screen !== 'Cart' &&
          route.params.prev_screen !== 'Inventory') ||
        (route && !route.params)
      ) {
        resetCart();
      }
      resetCharge();
    });
    return () => unsubscribe();
  }, [resetCart, resetCharge, navigation, route]);

  React.useEffect(() => {
    if (discountCodeStatus) {
      if (discountCodeStatus.status == 0) {
        setPendingDiscount({
          discount: discountCodeStatus.discount,
          code: discountCode,
        });
        toast.show(discountCodeStatus.message, {
          placement: 'top',
          duration: 5000,
        });
      } else {
        toast.show(discountCodeStatus.message, {
          type: 'danger',
          placement: 'top',
        });
      }
    }
    setDiscountCodeStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountCodeStatus, toast, discountPayload]);

  return (
    <View style={[styles.main, { paddingBottom: bottom }]}>
      {/* <View style={styles.details}>
        <TextInput
          placeholder="Enter product details"
          style={styles.detailsText}
        />
      </View> */}
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 3 }}>
          <View style={styles.resultWrapper}>
            <View style={styles.result}>
              <Text
                style={[
                  styles.currentSymbol,
                  { color: amount.length === 0 ? '#7B8FA1' : '#30475e' },
                ]}>
                GHS{' '}
              </Text>
              <Text
                style={[
                  styles.amount,
                  { color: amount.length === 0 ? '#7B8FA1' : '#30475e' },
                ]}>
                {new Intl.NumberFormat().format(
                  amount.length === 0 ? '0.00' : Number(amount).toFixed(2),
                )}
              </Text>
            </View>
          </View>
          {pendingDiscount && (
            <View
              style={{
                paddingLeft: 12,
                paddingVertical: 12,
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Regular',
                    fontSize: 18,
                    color: '#30475e',
                  }}>
                  Discount: GHS
                  {new Intl.NumberFormat().format(
                    pendingDiscount.discount,
                  )}{' '}
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      fontSize: 17,
                      color: '#777',
                    }}>
                    ({pendingDiscount.code})
                  </Text>
                </Text>
                <Pressable
                  onPress={() => {
                    setPendingDiscount(null);
                    toast.show('Discount cleared', { placement: 'top' });
                  }}
                  style={{
                    // paddingVertical: 7,
                    marginLeft: 12,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      fontSize: 18,
                      color: '#E0144C',
                    }}>
                    Clear Discount
                  </Text>
                </Pressable>
              </View>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 18,
                  color: '#30475e',
                  marginTop: 6,
                }}>
                New Amount: GHS{' '}
                {new Intl.NumberFormat().format(
                  Number(amount) - Number(pendingDiscount.discount),
                )}
              </Text>
            </View>
          )}

          <Keypad />
          <View style={styles.bottomWrapper}>
            <ButtonLargeBottom
              disabled={subTotal === 0}
              disabledColor="rgba(25, 66, 216, 0.5)"
              width="100%"
              backgroundColor="rgba(25, 66, 216, 0.9)"
              extraStyle={{ width: '100%' }}
              handlePress={() => {
                const intAmount = Number(amount);
                if (tempProduct) {
                  addToCart({
                    itemName: description,
                    amount: intAmount,
                    quantity: 1,
                    id: tempProduct.id,
                  });
                  // resetCharge();
                  navigation.navigate('Cart');
                } else {
                  if (
                    route &&
                    route.params &&
                    route.params.prev_screen &&
                    route.params.prev_screen === 'Cart'
                  ) {
                    const id = uniqueId();
                    addToCart({
                      id,
                      itemName: description,
                      amount: intAmount,
                      quantity: 1,
                      type: 'non-inventory-item',
                    });
                    navigation.navigate('Cart');
                    return;
                  }
                  if (
                    route &&
                    route.params &&
                    route.params.prev_screen &&
                    route.params.prev_screen === 'Inventory'
                  ) {
                    const id = uniqueId();
                    addToCart({
                      id,
                      itemName: description,
                      amount: intAmount,
                      quantity: 1,
                      type: 'non-inventory-item',
                    });
                    navigation.navigate('Inventory');
                    return;
                  }
                  addToCart({
                    id: uniqueId(),
                    itemName: description,
                    amount: intAmount,
                    quantity: 1,
                  });
                  setQuickSaleInAction(true);
                  setQuickSaleSubTotal(intAmount);
                  // setTotalAmount(intAmount);

                  if (pendingDiscount) {
                    applyQuickSaleDiscount(Number(pendingDiscount.discount));
                  }
                  navigation.navigate('Payments');
                  // resetCharge();
                }
              }}>
              GHS {subTotal}
            </ButtonLargeBottom>
          </View>
        </View>
        <View style={{ flex: 2.5 }}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                {
                  // borderTopColor: save ? '#ddd' : '',
                  // borderTopWidth: save ? 0.5 : 0,
                  // marginTop: save ? 12 : 0,
                },
              ]}
              multiline
              textAlignVertical="top"
              // autoFocus
              value={description}
              onChangeText={text => addDescription(text)}
              placeholder="Enter item description here..."
              placeholderTextColor="#9DB2BF"
            />
            <View style={styles.header}>
              <Text style={styles.mainText}>Sale Source</Text>
            </View>
            <ScrollView>
              {data &&
                data.data &&
                data.data.data.map(channel_ => {
                  return (
                    <Pressable
                      key={channel_}
                      style={styles.channelType}
                      onPress={() => handleSelect(channel_)}>
                      {channel_ === 'Inshop' && (
                        <Image
                          source={require('../../assets/images/online-store.png')}
                          style={styles.img}
                        />
                      )}

                      {channel_ === 'Snapchat' && (
                        <Image
                          source={require('../../assets/images/snapchat_.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Instagram' && (
                        <Image
                          source={require('../../assets/images/instagram.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Twitter' && (
                        <Image
                          source={require('../../assets/images/twitter.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Whatsapp' && (
                        <Image
                          source={require('../../assets/images/whatsapp.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Tiktok' && (
                        <Image
                          source={require('../../assets/images/tik-tok.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Facebook' && (
                        <Image
                          source={require('../../assets/images/facebook.png')}
                          style={styles.img}
                        />
                      )}
                      {channel_ === 'Others' && (
                        <Image
                          source={require('../../assets/images/sale.png')}
                          style={styles.img}
                        />
                      )}
                      {/* {channel === 'UNKNOWN' && (
                    <Image
                      source={require('../../../assets/images/payment.png')}
                      style={styles.img}
                    />
                  )} */}
                      <Text style={styles.channelText}>{channel_}</Text>
                      {channel === channel_ && (
                        <CaretRight
                          style={styles.caret}
                          height={24}
                          width={24}
                          stroke="#3C79F5"
                        />
                      )}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.2,
              marginTop: 'auto',
            }}>
            {/* <Text
              style={{
                fontSize: 16,
                fontFamily: 'SFProDisplay-Medium',
                color: '#30475e',
                paddingVertical: 0,
                textAlign: 'center',
                marginTop: 'auto',
              }}>
              ENTER VOUCHER
            </Text> */}
            <View style={[{ paddingHorizontal: 14, marginTop: 'auto' }]}>
              <Input
                placeholder="Enter Discount Code or Gift Voucher"
                // showError={showError && state.name.length === 0}
                val={discountCode}
                setVal={text => setDiscountCode(text)}
                style={{ height: 55, backgroundColor: '#fff' }}
              />
            </View>

            <View style={[styles.bottomWrapper, { marginTop: 14 }]}>
              <ButtonLargeBottom
                disabled={discountCode === 0}
                disabledColor="rgba(48, 71, 94, 0.5)"
                width="100%"
                backgroundColor={
                  discountCode.length > 0 ? '#30475e' : 'rgba(48, 71, 94, 0.5)'
                }
                extraStyle={{ width: '100%' }}
                handlePress={() => {
                  if (discountCode.length === 0) {
                    toast.show('Enter discount/voucher code', {
                      placement: 'top',
                      type: 'danger',
                    });
                  }
                  if (discountCode.length > 0) {
                    applyDiscountCode.mutate({
                      code: discountCode,
                      type: 'ORDER',
                      outlet: user.outlet,
                      merchant: user.merchant,
                      amount: Number(amount),
                      order_item: cart,
                      mod_by: user.login,
                      source: 'INSHOP',
                    });
                    // SheetManager.hideAll();
                    // SheetManager.hide(props.sheetId, {
                    //   payload
                    // })
                  }
                }}>
                {applyDiscountCode.isLoading ? 'Processing' : 'Apply Discount'}
              </ButtonLargeBottom>
            </View>

            {/* <View style={{ marginTop: 'auto', marginBottom: 8 }}>
              <PrimaryButton
                disabled={
                  applyDiscountCode.isLoading || discountCode.length === 0
                }
                textStyle={styles.textStyle}
                style={styles.btnExtra}
                backgroundColor="rgba(25, 66, 216, 0.9)"
                disabledColor="rgba(25, 66, 216, 0.3)"
                handlePress={() => {
                  if (discountCode.length === 0) {
                    toast.show('Enter discount/voucher code', {
                      placement: 'top',
                      type: 'danger',
                    });
                  }
                  if (discountCode.length > 0) {
                    applyDiscountCode.mutate({
                      code: discountCode,
                      type: 'ORDER',
                      outlet: user.outlet,
                      merchant: user.merchant,
                      amount: Number(amount),
                      order_item: cart,
                      mod_by: user.login,
                      source: 'INSHOP',
                    });
                    // SheetManager.hideAll();
                    // SheetManager.hide(props.sheetId, {
                    //   payload
                    // })
                  }
                }}>
                {applyDiscountCode.isLoading ? 'Processing' : 'Apply Discount'}
              </PrimaryButton>
            </View> */}
          </View>
        </View>
      </View>
      {/* <View style={{ flexDirection: 'row', paddingHorizontal: 6 }}>
        <Pressable
          style={[styles.channelWrapper, { width: '80%' }]}
          onPress={() => SheetManager.show('channels')}>
          <Text style={styles.channel}>
            {channel && channel.length > 0 ? channel : 'Select Sale Channel'}
          </Text>
        </Pressable>
        {!(
          route &&
          route.params &&
          route.params.prev_screen &&
          route.params.prev_screen === 'Cart'
        ) && (
          <Pressable
            style={[styles.channelWrapper, { width: '18%' }]}
            onPress={async () => {
              const discountPayload = await SheetManager.show(
                'quickSaleDiscount',
              );
              if (discountPayload) {
                setPendingDiscount(discountPayload);
              }

              // console.log('ddddddd', discount);
            }}>
            <ArrowUp height={30} width={30} />
          </Pressable>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
  },
  channel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1942D8',
  },
  img: {
    height: 24,
    width: 24,
    borderRadius: 4,
    marginRight: 8,
    // marginVertical: 6,
    // marginTop: 6,
    // marginRight: 10,
    // alignSelf: 'flex-start',
    // backgroundColor: 'green',
  },
  // input: {
  //   borderTopColor: '#92A9BD',
  //   borderTopWidth: 0.4,
  //   borderBottomColor: '#92A9BD',
  //   borderBottomWidth: 0.3,
  //   paddingVertical: 8,
  //   paddingLeft: 18,
  //   color: '#30475E',
  // },
  inputWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30475E',
    letterSpacing: 0.1,
  },
  channelType: {
    // alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  channelText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16.4,
    color: '#30475E',
  },
  caret: {
    marginLeft: 'auto',
  },
  btnExtra: { margin: 14, borderRadius: 4 },

  input: {
    height: '25%',
    padding: 18,
    color: '#000',

    marginTop: 0,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 20,
    // backgroundColor: 'rgba(159, 201, 243, 0.08)',
    borderColor: '#ddd',
    borderWidth: 0.8,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.5,
    letterSpacing: 0.3,
  },
  descriptionWrapper: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  descriptionText: {
    color: '#30475E',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Medium',
    // marginLeft: 'auto',
    // marginLeft: 8,
  },
  clearWrapper: {
    position: 'absolute',
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(235, 69, 95, 0.2)',
    borderRadius: 3,
  },
  clear: {
    fontFamily: 'Inter-Medium',
    color: '#EB455F',
  },
  channelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    // borderBottomColor: '#92A9BD',
    // borderBottomWidth: 0.4,
    // borderTopColor: '#92A9BD',
    // borderTopWidth: 0.4,
    backgroundColor: 'rgba(234, 234, 234, 0.5)',
    width: '94%',
    paddingVertical: 12,
    borderRadius: 3,
    marginBottom: 6,
  },

  // detailsText: {
  //   backgroundColor: 'rgba(228, 251, 255, 0.3)',
  //   paddingLeft: 16,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
  details: {
    paddingHorizontal: 16,
    // paddingVertical: 2,
    // borderBottomColor: '#92A9BD',
    // borderBottomWidth: 0.4,
    // borderTopColor: '#92A9BD',
    // borderTopWidth: 0.4,
  },
  result: {
    // marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // paddingBottom: 8,
    paddingVertical: 5,
    paddingRight: 6,
  },
  resultWrapper: {
    flexDirection: 'row',
    // borderBottomColor: '#DDDDDD',
    // borderBottomWidth: 0.4,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    borderRightColor: '#ddd',
    borderWidth: 0.5,
    borderBottomColor: '#ddd',
    // alignItems: 'center',
    paddingLeft: 16,
    // flex: 1,
    height: Dimensions.get('window').height * 0.1,
    justifyContent: 'center',
  },
  currentSymbol: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 18,
    color: '#30475E',
  },
  amount: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 38,
    color: '#30475E',
    marginRight: 12,
    maxWidth: '90%',
  },
  bottomWrapper: {
    flexDirection: 'row',
    left: 0,
    bottom: 0,
    right: 0,
  },
  penWrapper: {
    justifyContent: 'center',
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    // paddingVertical: 12,
    // paddingHorizontal: 6,
    // marginRight: 'auto',
    // marginLeft: 22,
  },
});

export default QuickCharge;
