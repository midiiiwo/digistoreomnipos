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
import FastImage from 'react-native-fast-image';

const InvoiceProductCard = ({ item, setHeight, setWidth }) => {
  const quant = React.useRef(0);
  const { addToInvoiceCart } = useActionCreator();
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

  const { user } = useSelector(state => state.auth);

  const isProductStockLow =
    Number(product_quantity) <= Number(product_stock_level);
  const outOfStock = Number(product_quantity) === 0;

  amount = Number(amount);
  const productHasNoLogo = product_image?.includes('LOGO-' + user.merchant);
  return (
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
            toast.show(`cannot add more - only ${product_quantity} in stock`, {
              type: 'danger',
              placement: 'top',
            });
            return;
          }
        }
        if (
          product_has_property &&
          product_properties &&
          product_properties.length > 0
        ) {
          SheetManager.show('Invoice variant', {
            payload: item,
          });
          return;
        }

        quant.current += 1;
        addToInvoiceCart({
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
      <View style={styles.imageWrapper}>
        {product_image && product_image.length > 0 ? (
          <Image
            source={{
              uri: product_image,
              cache: FastImage.cacheControl.web,
              priority: FastImage.priority.low,
            }}
            style={[styles.image, { opacity: productHasNoLogo ? 0.3 : 1 }]}
          />
        ) : (
          <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
        )}
      </View>

      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.itemName}>
          {itemName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.amount}>GHS {amount}</Text>
          <Text
            style={[
              styles.amount,
              {
                fontFamily: 'ReadexPro-Regular',
                fontSize: 10,
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
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    borderWidth: 0.9,
    borderColor: '#F2F2F2',
    marginBottom: 10,
    // margin: Dimensions.get('window').width * 0.017,
    width: Dimensions.get('screen').width * 0.307,
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
  textWrapper: { paddingLeft: 12, marginTop: 12, paddingBottom: 8 },
  itemName: {
    fontFamily: 'ReadexPro-Regular',
    color: '#738598',

    width: '85%',
    fontSize: 14,
    flex: 1,
    letterSpacing: 0.2,
  },
  amount: {
    fontFamily: 'ReadexPro-Medium',
    color: '#002',
    fontSize: 12.2,
    marginTop: 2,
  },
  image: {
    height: 100,
    width: '100%',
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
    fontFamily: 'ReadexPro-Regular',
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

export default React.memo(InvoiceProductCard);
