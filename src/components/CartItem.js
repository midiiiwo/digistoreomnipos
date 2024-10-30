/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import AddIcon from '../../assets/icons/add.svg';
import Subtract from '../../assets/icons/subtract.svg';
import ImageIcon from '../../assets/icons/ImageIcon.svg';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import Bin from '../../assets/icons/bin.svg';
import _ from 'lodash';

const CartItem = ({ item }) => {
  const { itemName, amount, quantity, id, product_image } = item;
  const { subTotal } = useSelector(state => state.sale);
  const { updateSubTotalFromCart, updateCartItemQuantity, deleteItemFromCart } =
    useActionCreator();
  return (
    <View style={[styles.main]}>
      {product_image && product_image.length > 0 ? (
        <Image source={{ uri: product_image }} style={styles.image} />
      ) : (
        <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
      )}

      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.itemName} numberOfLines={1}>
            {itemName.length === 0
              ? item.type && item.type === 'non-inventory-item'
                ? 'No description'
                : itemName
              : itemName}
          </Text>
        </View>
        {item && item.order_item_props && !_.isEmpty(item.order_item_props) && (
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
        <Text style={styles.amount}>GHS {amount}</Text>
      </View>
      <View style={styles.mainWrapper}>
        <View style={styles.quantChangeWrapper}>
          {quantity === 0 && (
            <Pressable
              onPress={() => {
                if (quantity === 0) {
                  deleteItemFromCart(item.id);
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
              <Subtract height={16} width={16} stroke="#fff" />
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
            <AddIcon height={18} width={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 12,
    alignItems: 'center',
  },
  outer: {
    marginLeft: 6,
    width: '45%',
  },
  inner: {
    flexDirection: 'row',
    width: '100%',
  },
  itemName: {
    color: '#30475E',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    width: '90%',
    // backgroundColor: 'red',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 6,
    marginRight: 5,
  },
  amount: {
    color: '#1942D8',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    marginTop: 0,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#607EAA',
    marginLeft: 10,
    borderRadius: 100,
  },
  quant: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 16,
    color: '#607EAA',
  },
  mainWrapper: { flex: 1 },
  quantChangeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 'auto',
    // marginBottom: 18,
    marginRight: 18,
  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    marginRight: 10,
    borderColor: 'rgba(96, 126, 170, 0.8)',
    borderWidth: 1,
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-Bold',
  },
});

export default CartItem;
