/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  // TextInput,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
// import uuid from 'react-native-uuid';

import ButtonLargeBottom from '../components/ButtonLargeBottom';
import Keypad from '../components/Keypad';
import { useActionCreator } from '../hooks/useActionCreator';
import { uniqueId } from 'lodash';

const QuickCharge = ({ navigation, route }) => {
  const {
    addToCart,
    addDescription,
    setQuickSaleInAction,
    resetCart,
    setQuickSaleSubTotal,
    updateSubTotalFromNumber,
    clearAmount,

    // updateSubTotalFromNumber,
  } = useActionCreator();
  const { description, amount, tempProduct, subTotal } = useSelector(
    state => state.quickSale,
  );

  const test = React.useRef(0);

  test.current += 1;

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
      console.log('heeeeeeeeeeeerererererere', route.params);
      if (
        (route &&
          route.params &&
          route.params.prev_screen &&
          route.params.prev_screen !== 'Cart' &&
          route.params.prev_screen !== 'Inventory') ||
        (route && !route.params)
      ) {
        console.log('heeeeeeeeeeeerererererere');
        resetCart();
      }
      resetCharge();
    });
    return () => unsubscribe();
  }, [resetCart, resetCharge, navigation, route]);

  return (
    <View style={styles.main}>
      {/* <View style={styles.details}>
        <TextInput
          placeholder="Enter product details"
          style={styles.detailsText}
        />
      </View> */}
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
            {amount.length === 0 ? '0.00' : Number(amount).toFixed(2)}
          </Text>
        </View>
      </View>
      <Pressable
        style={styles.penWrapper}
        onPress={() => SheetManager.show('description')}>
        <Text style={styles.descriptionText}>
          {description.length === 0 ? 'Add description' : description}
        </Text>
      </Pressable>

      {/* {pendingDiscount && (
        <View style={{ paddingLeft: 12 }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 15,
              color: '#30475e',
            }}>
            Discount: GHS {pendingDiscount.discount}{' '}
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
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
              paddingVertical: 7,
            }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#E0144C',
              }}>
              Clear Discount
            </Text>
          </Pressable>
        </View>
      )} */}

      <Keypad />
      {/* <Pressable
        style={styles.penWrapper}
        onPress={() => SheetManager.show('description')}>
        <Text style={styles.descriptionText}>
          {description.length === 0 ? 'Add description' : description}
        </Text>
      </Pressable> */}
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

      <View style={styles.bottomWrapper}>
        <ButtonLargeBottom
          disabled={subTotal === 0}
          disabledColor="rgba(25, 66, 216, 0.5)"
          width="100%"
          backgroundColor="rgba(25, 66, 216, 0.9)"
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
              updateSubTotalFromNumber(intAmount);
              // setTotalAmount(intAmount);
              setQuickSaleInAction(true);

              navigation.navigate('Payments');
              // resetCharge();
            }
          }}>
          GHS {subTotal}
        </ButtonLargeBottom>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // alignItems: 'center',
  },
  channel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1942D8',
  },
  input: {
    borderTopColor: '#92A9BD',
    borderTopWidth: 0.4,
    borderBottomColor: '#92A9BD',
    borderBottomWidth: 0.3,
    paddingVertical: 8,
    paddingLeft: 18,
    color: '#30475E',
  },
  descriptionWrapper: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  descriptionText: {
    color: '#1942D8',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
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
    // borderTopColor: '#ddd',
    // borderTopWidth: 0.5,
    // alignItems: 'center',
    paddingLeft: 16,
    // flex: 1,
    height: Dimensions.get('window').height * 0.2,
    justifyContent: 'center',
  },
  currentSymbol: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30475E',
    fontWeight: '600',
  },
  amount: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 36,
    color: '#30475E',
    marginRight: 12,
    maxWidth: '80%',
  },
  bottomWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
  penWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
});

export default QuickCharge;
