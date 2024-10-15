/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, View, Text, Dimensions } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { RadioButtonProvider } from '../../context/RadioButtonContext';
import PrimaryButton from '../PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useNavigation } from '@react-navigation/native';

function ScannedProduct(props) {
  const { product } = props.payload;
  const toast = useToast();
  const { cart } = useSelector(state => state.sale);
  const showCheck = _.find(cart, i => {
    return i.id === product.product_id;
  });
  const quant = React.useRef(0);
  const { addToCart } = useActionCreator();
  const navigation = useNavigation();
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={{ paddingHorizontal: 18 }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            color: '#30475e',
            fontSize: 15,
            textAlign: 'center',
            marginVertical: 8,
          }}>
          Add to Cart
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 19 }}>
          <View>
            <Image source={{ uri: product.product_image }} style={styles.img} />
          </View>
          <View style={{ marginHorizontal: 14, justifyContent: 'center' }}>
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                fontSize: 16,
                color: '#30475e',
              }}>
              {product.product_name}
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Medium',
                fontSize: 15,
                color: '#30475e',
              }}>
              {product.product_category}
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 17,
                color: '#30475e',
              }}>
              GHS {product.product_price}
            </Text>
          </View>
        </View>
        <PrimaryButton
          style={{ borderRadius: 5 }}
          handlePress={() => {
            if (
              product.product_has_property &&
              product.product_properties &&
              product.product_properties.length > 0
            ) {
              SheetManager.show('variants', {
                payload: product,
              });
              return;
            }
            if (
              product.product_quantity !== '-99' ||
              product.product_quantity !== 'Unlimited'
            ) {
              if (product.product_quantity == 0) {
                toast.show('Product is out of stock', {
                  type: 'danger',
                  placement: 'top',
                });
                return;
              }
              if (showCheck && showCheck.quantity >= product.product_quantity) {
                toast.show(
                  `cannot add more - only ${product.product_quantity} in stock`,
                  {
                    type: 'danger',
                    placement: 'top',
                  },
                );
                return;
              }
            }
            quant.current += 1;
            addToCart({
              id: product.product_id,
              itemName: product.product_name,
              amount: Number(product.product_price),
              quantity: 1,
              product_image: product.product_image,
            });
            SheetManager.hideAll();
            navigation.navigate('Dashboard');
          }}>
          Add to Cart
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  img: {
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').height * 0.1,
    borderRadius: 7,
  },
  containerStyle: {
    width: Dimensions.get('window').width * 0.6,
  },
});

export default props => (
  <RadioButtonProvider>
    <ScannedProduct {...props} />
  </RadioButtonProvider>
);
