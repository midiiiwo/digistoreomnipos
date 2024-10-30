/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';
import ImageIcon from '../../assets/icons/ImageIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { SheetManager } from 'react-native-actions-sheet';
import FastImage from 'react-native-fast-image';

const ProductInventoryCard = ({ item, setHeight, setWidth, setInventoryOutlet }) => {
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
  const navigation = useNavigation();
  const { inventoryOutlet } = useSelector(state => state.products);
  const toast = useToast();
  const { user } = useSelector(state => state.auth);

  const cacheBust = new Date().toString();
  const isProductStockLow = Number(product_quantity) <= Number(product_stock_level);
  const outOfStock = Number(product_quantity) === 0;
  const productHasNoLogo = product_image?.includes('digiproduct-bg.png');
  const imgUrlBase = 'https://payments.ipaygh.com/app/webroot/img/products/';

  return (
    <Pressable
      onPress={() => {
        if (inventoryOutlet && inventoryOutlet.outlet_id === 'ALL') {
          toast.show('Please select outlet to edit product', { placement: 'top' });
          SheetManager.show('inventoryOutlet', { payload: { inventoryOutlet, setInventoryOutlet } });
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
          setInventoryOutlet,
          product_stock_level,
          product_price: amount,
        });
      }}
      style={styles.card}
      onLayout={e => {
        setHeight && setHeight(e.nativeEvent.layout.height);
        setWidth && setWidth(e.nativeEvent.layout.width);
      }}>
      {isProductStockLow && !outOfStock && product_stock_level !== '-99' && product_quantity !== '-99' && (
        <View style={[styles.checkWrapper, { backgroundColor: '#EE9322' }]}>
          <Text style={styles.checkText}>Low Stock</Text>
        </View>
      )}
      {outOfStock && (
        <View style={styles.checkWrapper}>
          <Text style={styles.checkText}>Out of Stock</Text>
        </View>
      )}
      <View style={styles.imageWrapper}>
        {product_image?.length > 0 ? (
          <Image
            source={{
              uri: (productHasNoLogo ? user?.user_merchant_logo : imgUrlBase + product_image) + '?' + cacheBust,
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
        <Text numberOfLines={1} style={styles.itemName}>{itemName}</Text>
        <View style={styles.metrics}>
          <Text style={styles.amount}>
            <Text style={{ fontSize: 11.4 }}>GHS</Text>{' '}
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(Number(amount))}
          </Text>
          <Text style={styles.quantity}>
            {product_quantity === '-99' || product_quantity === 'Unlimited' ? 'UNLT' : product_quantity}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 0.9,
    borderColor: '#F2F2F2',
    marginBottom: 10,
    marginRight: Dimensions.get('window').width * 0.01,
    width: Dimensions.get('screen').width * 0.309,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden', // Ensure the border radius is applied to the shadows
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
  checkText: {
    fontFamily: 'ReadexPro-Medium',
    color: '#fff',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 8, // Add some margin below the image
  },
  textWrapper: {
    paddingLeft: 8,
    paddingBottom: 8,
  },
  itemName: {
    fontFamily: 'ReadexPro-Regular',
    color: '#435560',
    fontSize: 14,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'ReadexPro-Medium',
    color: '#4477CE',
    fontSize: 12.5,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  quantity: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 11,
    marginLeft: 'auto',
    marginRight: 6,
    color: '#888',
  },
  image: {
    height: 100,
    width: '100%',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
});

export default ProductInventoryCard;
