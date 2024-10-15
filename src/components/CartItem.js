/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import AddIcon from '../../assets/icons/add.svg';
import Subtract from '../../assets/icons/subtract.svg';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import Bin from '../../assets/icons/bin.svg';
import _ from 'lodash';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CartItem = ({ item }) => {
  const { itemName, amount, quantity, id } = item;
  const ref = React.useRef();
  const { subTotal } = useSelector(state => state.sale);
  const { updateSubTotalFromCart, updateCartItemQuantity, deleteItemFromCart } =
    useActionCreator();

  React.useEffect(() => {
    ref.current.fadeInRight();
    const exitRef = ref.current;
    return () => exitRef.fadeOutLeft();
  }, []);
  return (
    <Animatable.View style={[styles.main]} ref={ref} duration={300}>
      {/* {product_image && product_image.length > 0 ? (
        <Image source={{ uri: product_image }} style={styles.image} />
      ) : (
        <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
      )} */}

      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.itemName} numberOfLines={1}>
            {/* <Text
              style={{
                color: '#92A9BD',
                fontSize: 15,
                fontFamily: 'SFProDisplay-Medium',
                marginRight: 5,
              }}>
              x{quantity}
              {'  '}
            </Text> */}
            {itemName.length === 0
              ? item.type && item.type === 'non-inventory-item'
                ? 'No description'
                : itemName
              : itemName}
          </Text>
          {item?.order_item_props && !_.isEmpty(item?.order_item_props) && (
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                color: '#9DB2BF',
                fontSize: 13,
                marginBottom: 10,
                marginTop: -2.5,
              }}>
              {Object.values((item && item.order_item_props) || {})
                .toString()
                .replaceAll(',', ', ')}
            </Text>
          )}

          <Text style={styles.amount}>
            <Text style={{ fontSize: 11 }}>GHS </Text>
            {Number(amount).toFixed(2)}
          </Text>
        </View>

        <View style={styles.quantChangeWrapper}>
          {quantity === 0 && (
            <Pressable
              onPress={() => {
                if (quantity === 0) {
                  deleteItemFromCart(item.id);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  return;
                }
              }}
              style={[
                styles.btn1,
                {
                  borderColor: '#FD8A8A',
                },
              ]}>
              <Bin height={17} width={17} />
            </Pressable>
          )}
          {quantity > 0 && (
            <Pressable
              onPress={() => {
                if (quantity === 0) {
                  return;
                }
                updateCartItemQuantity({ id, by: -1 });
                const updatedSubTotal =
                  subTotal - (quantity + 1) * amount + quantity * amount;
                updateSubTotalFromCart(updatedSubTotal);
              }}
              style={styles.btn1}>
              <Subtract height={14} width={14} stroke="#fff" />
            </Pressable>
          )}
          <Text style={styles.quant}>{quantity}</Text>
          <Pressable
            onPress={() => {
              updateCartItemQuantity({ id, by: 1 });
              const updatedSubTotal =
                subTotal - (quantity - 1) * amount + quantity * amount;
              updateSubTotalFromCart(updatedSubTotal);
            }}
            style={styles.btn}>
            <AddIcon height={16} width={16} />
          </Pressable>
        </View>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  outer: {
    marginLeft: 6,
    flexDirection: 'row',
  },
  inner: {
    // flexDirection: 'row',
    width: '100%',
    // alignItems: 'center',
  },
  itemName: {
    color: '#0069FF',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14,
    width: '90%',
    letterSpacing: 0.3,
    // backgroundColor: 'red',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 6,
    marginRight: 5,
  },
  amount: {
    color: '#3C4959',
    fontFamily: 'SQ Market Medium Medium',
    fontSize: 14,
    marginTop: 0,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4.5,
    backgroundColor: '#E9F2FD',
    marginRight: 10,
    borderColor: '#0069FF',
    // borderWidth: 1.2,
    borderRadius: 114,
    marginLeft: 10,
  },
  quant: {
    fontFamily: 'SQ Market Regular Regular',
    fontSize: 13,
    color: '#3C4959',
  },
  mainWrapper: { flex: 1 },
  quantChangeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',

    marginRight: 18,
  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4.5,
    backgroundColor: '#E9F2FD',
    marginRight: 10,
    borderColor: '#0069FF',
    // borderWidth: 1.2,
    borderRadius: 114,
  },
  text: {
    fontSize: 20,
    fontFamily: 'SourceSansPro-Bold',
  },
});

export default CartItem;
