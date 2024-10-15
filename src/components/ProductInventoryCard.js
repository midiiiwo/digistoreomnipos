/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';

import ImageIcon from '../../assets/icons/ImageIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

const ProductInventoryCard = ({ item, setHeight, setWidth }) => {
  // const { addToCart, deleteItemFromCart } = useActionCreator();
  console.log('ittttt', item?.product_price);
  let {
    product_id: id,
    product_name: itemName,
    product_price: amount,
    product_image,
    product_status,
    product_outlets,
    product_quantity,
    product_stock_level,
  } = item;
  amount = Number(amount);
  const navigation = useNavigation();
  const { inventoryOutlet } = useSelector(state => state.products);
  const toast = useToast();

  const cacheBust = new Date().toString();
  const isProductStockLow =
    Number(product_quantity) <= Number(product_stock_level);

  const outOfStock = Number(product_quantity) === 0;

  return (
    <Pressable
      onPress={() => {
        if (inventoryOutlet && inventoryOutlet.outlet_id === 'ALL') {
          toast.show('Please select outlet to edit product', {
            placement: 'top',
          });
          SheetManager.show('inventoryOutlet');
          return;
        }
        navigation.navigate('Product Options', {
          id,
          navigation,
          product_status,
          itemName,
          product_outlets,
          product_quantity,
          inventoryOutlet,
          product_stock_level,
          product_price: amount,
        });
      }}
      style={[styles.main]}
      onLayout={e => {
        setHeight && setHeight(e.nativeEvent.layout.height);
        setHeight && setWidth(e.nativeEvent.layout.width);
      }}>
      {isProductStockLow &&
        !outOfStock &&
        product_stock_level !== '-99' &&
        product_quantity !== '-99' && (
          <View style={[styles.checkWrapper, { backgroundColor: '#EE9322' }]}>
            <Text style={{ fontFamily: 'ReadexPro-Medium', color: '#fff' }}>
              Low Stock
            </Text>
          </View>
        )}
      {outOfStock && (
        <View style={styles.checkWrapper}>
          <Text style={{ fontFamily: 'ReadexPro-Medium', color: '#fff' }}>
            Out of Stock
          </Text>
        </View>
      )}
      <View style={styles.imageWrapper}>
        {product_image && product_image.length > 0 ? (
          <Image
            source={{
              uri:
                'https://payments.ipaygh.com/app/webroot/img/products/' +
                product_image +
                '?' +
                cacheBust,
            }}
            style={styles.image}
          />
        ) : (
          <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
        )}
      </View>

      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.itemName}>
          {itemName}
        </Text>
        <View style={styles.metrics}>
          <Text style={styles.amount}>GHS {amount}</Text>
          <Text
            style={[
              styles.amount,
              {
                fontFamily: 'ReadexPro-Regular',
                fontSize: 11,
                marginLeft: 'auto',
                marginRight: 6,
                color: '#888',
              },
            ]}>
            {product_quantity == '-99' || product_quantity == 'Unlimited'
              ? 'UNLT'
              : product_quantity}
          </Text>
          {/* <Text style={[styles.amount, { fontSize: 12 }]}>
            Qty: {product_quantity}
          </Text> */}
        </View>
      </View>
      {/* <View style={styles.addToCartWrapper}>
        <Text style={styles.addToCart}>Add to Cart</Text>
      </View> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    borderWidth: 0.9,
    borderColor: '#F2F2F2',
    marginBottom: 10,
    margin: Dimensions.get('window').width * 0.005,
    width: Dimensions.get('screen').width * 0.15,
    borderRadius: 6,
  },
  text: {
    fontSize: 18,
    fontFamily: 'ReadexPro-bold',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    // paddingTop: 6,
    // margin: 2.6,
  },
  check: { zIndex: 100 },
  textWrapper: { paddingLeft: 12, marginTop: 12, paddingBottom: 8 },
  itemName: {
    fontFamily: 'ReadexPro-Regular',
    color: '#3C4959',
    width: '85%',
    fontSize: 14.8,
    flex: 1,
    letterSpacing: 0.2,
  },
  amount: {
    fontFamily: 'SQ Market Medium Medium',
    color: '#0069FF',
    fontSize: 17,
    marginTop: 2,
  },
  image: {
    height: 150,
    width: '100%',
    // borderRadius: 4,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  addToCartWrapper: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(25, 66, 216, 0.9)',
    marginTop: 4,
  },
  addToCart: {
    color: '#fff',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  checkWrapper: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#EF4444',
    zIndex: 100,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderTopRightRadius: 6,
  },
});

export default React.memo(ProductInventoryCard);
