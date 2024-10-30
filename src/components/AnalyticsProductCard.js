/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import ImageIcon from '../../assets/icons/ImageIcon.svg';

const ProductCard = ({ itemName, amount, product_image, count }) => {
  return (
    <View style={[styles.main]}>
      <View style={styles.imageWrapper}>
        {product_image && product_image.length > 0 ? (
          <Image source={{ uri: product_image }} style={styles.image} />
        ) : (
          <ImageIcon fill="rgba(96, 126, 170, 0.3)" height={65} width={65} />
        )}
      </View>
      <View style={{ paddingVertical: 5 }}>
        <Text numberOfLines={1} style={styles.itemName}>
          {itemName}
        </Text>
        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Text style={styles.amount}>
            Prod Sold: {Number(count).toFixed(0)}
          </Text>
          {/* <Text style={styles.amount}>GHS {amount}</Text> */}
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Text style={styles.amount}>GHS {amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    marginBottom: 6,
    borderRadius: 6,
    flexDirection: 'column',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginHorizontal: Dimensions.get('window').width * 0.01,
    width: Dimensions.get('window').width * 0.28,
    paddingBottom: 5,
  },

  imageWrapper: {
    alignItems: 'center',
  },
  itemName: {
    fontFamily: 'Lato-Semibold',
    color: '#435560',
    width: '85%',
    fontSize: 16,
    marginLeft: 10,
  },
  amount: {
    fontFamily: 'Lato-Medium',
    color: '#738598',
    fontSize: 14,
  },
  image: {
    height: 65,
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    flex: 1,
  },
});

export default React.memo(ProductCard);
