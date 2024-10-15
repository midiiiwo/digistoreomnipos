/* eslint-disable react-native/no-inline-styles */
import _ from 'lodash';
import React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import Image from 'react-native-fast-image';

import ImageIcon from '../../assets/icons/ImageIcon.svg';
import { useActionCreator } from '../hooks/useActionCreator';
import { useToast } from 'react-native-toast-notifications';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';

const ProductCard = ({ item, setHeight, setWidth }) => {
  const quant = React.useRef(0);
  const { addToCart } = useActionCreator();
  const toast = useToast();
  let {
    product_id,
    product_name: itemName,
    product_price: amount,
    product_image,
    product_properties,
    product_has_property,
    product_quantity,
    product_stock_level,
  } = item;
  const { cart } = useSelector(state => state.sale);
  const showCheck = _.find(cart, i => {
    return i.id === product_id;
  });

  const isProductStockLow =
    Number(product_quantity) <= Number(product_stock_level);
  const outOfStock = Number(product_quantity) === 0;

  amount = Number(amount);
  return (
    <ShadowedView
      style={[
        shadowStyle({
          opacity: 0.1,
          radius: 1,
          offset: [0, 0],
        }),
        {
          marginRight: 10,
          margin: Dimensions.get('window').width * 0.005,
          marginBottom: 10,
          borderRadius: 6,
        },
      ]}>
      <Pressable
        onPress={() => {
          if (product_quantity !== '-99' && product_quantity !== 'Unlimited') {
            if (product_quantity == 0) {
              toast.show('Product is out of stock', {
                type: 'danger',
                placement: 'top',
              });
              return;
            }
            if (showCheck && showCheck.quantity >= product_quantity) {
              toast.show(
                `cannot add more - only ${product_quantity} in stock`,
                {
                  type: 'danger',
                  placement: 'top',
                },
              );
              return;
            }
          }
          if (
            product_has_property &&
            product_properties &&
            product_properties.length > 0
          ) {
            SheetManager.show('variants', {
              payload: item,
            });
            return;
          }

          quant.current += 1;
          addToCart({
            id: product_id,
            itemName,
            amount,
            quantity: 1,
            product_image,
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
        {/* {showCheck && cart.length > 0 && (
        <View style={styles.checkWrapper}>
          <CheckIcon height={20} width={20} style={styles.check} />
        </View>
      )} */}
        <View style={styles.imageWrapper}>
          {product_image && product_image.length > 0 ? (
            <Image source={{ uri: product_image }} style={styles.image} />
          ) : (
            <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
          )}
        </View>

        <View style={styles.textWrapper}>
          <Text numberOfLines={1} style={styles.itemName}>
            {itemName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.amount}>
              <Text style={{ fontSize: 12 }}>GHS</Text>{' '}
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(Number(amount))}
            </Text>
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
              {product_quantity == '-99' || product_quantity === 'Unlimited'
                ? 'UNLT'
                : product_quantity}
            </Text>
          </View>
        </View>
        {/* <View style={styles.addToCartWrapper}>
        <Text style={styles.addToCart}>Add to Cart</Text>
      </View> */}
      </Pressable>
    </ShadowedView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    // borderWidth: 0.5,
    // borderColor: '#eee',
    // marginBottom: 10,
    // margin: Dimensions.get('window').width * 0.005,
    width: Dimensions.get('screen').width * 0.135,
    borderRadius: 6,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-Bold',
  },
  imageWrapper: {
    alignItems: 'center',
    // margin: 2.6,
    // paddingTop: 6,
  },
  check: { zIndex: 100 },
  textWrapper: { paddingLeft: 16, marginTop: 12, paddingBottom: 12 },
  itemName: {
    fontFamily: 'ReadexPro-Regular',
    color: '#3C4959',
    width: '85%',
    fontSize: 14,
    flex: 1,
  },
  amount: {
    fontFamily: 'ReadexPro-Medium',
    color: '#0069FF',
    fontSize: 15,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  image: {
    height: 140,
    width: '100%',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
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

export default React.memo(ProductCard);
