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

const ProductCard = React.memo(
  ({ item, setHeight, setWidth, hasDiscount, discountDescription, discountValue, discountType, ...props }) => {
    const quant = React.useRef(0);
    const { addToCart } = useActionCreator();
    const toast = useToast();
    const { user } = useSelector(state => state.auth);
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
    //calculates the discounts

    const originalAmount = Number(item.product_price);
    let discountedAmount = originalAmount;

    if (hasDiscount) {
      if (discountType === "PERCENTAGE") {
        // Calculate percentage discount
        discountedAmount = originalAmount * (1 - parseFloat(discountValue));
      } else {
        // Fixed amount discount
        discountedAmount = originalAmount - parseFloat(discountValue);
      }
      // Ensure the discounted amount is not negative
      discountedAmount = Math.max(discountedAmount, 0);
    }

    const isProductStockLow =
      Number(product_quantity) <= Number(product_stock_level);
    const outOfStock = Number(product_quantity) === 0;

    amount = Number(amount);
    const productHasNoLogo = product_image?.includes('LOGO-' + user.merchant);
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
              amount: originalAmount,
              quantity: 1,
              product_image,
              discount: hasDiscount ? {
                type: discountType,
                disc: discountValue,
                value: discountedAmount,
              } : null,

            });
            // console.log("Discount Object:", addToCart);
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
              <View style={[styles.checkWrapper, { backgroundColor: '#EE9322', borderTopRightRadius: hasDiscount ? 0 : 6, top: hasDiscount ? "45%" : 0, }]}>
                <Text style={{ fontFamily: 'ReadexPro-Medium', color: '#fff' }}>
                  Low Stock
                </Text>
              </View>
            )}
          {outOfStock && (
            <View style={[styles.checkWrapper, { borderTopRightRadius: hasDiscount ? 0 : 6, top: hasDiscount ? "45%" : 0, }]}>
              <Text style={{ fontFamily: 'ReadexPro-Medium', color: '#fff' }}>
                Out of Stock
              </Text>
            </View>
          )}
          <View style={styles.imageWrapper}>
            {hasDiscount && (
              <View style={styles.discountTag}>
                <Text style={styles.discountText}>
                  {discountType === "PERCENTAGE"
                    ? `-${(parseFloat(discountValue) * 100).toFixed(0)}%`
                    : `-₵${parseFloat(discountValue).toFixed(0)}`}
                </Text>
              </View>
            )}

            {product_image && product_image.length > 0 ? (
              <Image
                source={{
                  uri: product_image,
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
            {/* {hasDiscount && (
            <Text style={[styles.amount, styles.originalAmount]}>
              GHS {originalAmount.toFixed(2)}
            </Text>
          )}*/}
            {hasDiscount && (
              <Text style={styles.amountDisc}>
                GHS {discountedAmount.toFixed(2)}
              </Text>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {hasDiscount && (
                <View style={{ marginRight: 8 }}>
                  <Text style={[styles.amount, styles.originalAmount]}>
                    GHS {originalAmount.toFixed(2)}
                  </Text>

                </View>
              )}
              {!hasDiscount && (
                <Text style={styles.amount}>
                  GHS{' '}
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }).format(Number(amount))}
                </Text>
              )}
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
  },
  (prevProps, nextProps) => {
    prevProps?.item?.product_id === nextProps?.item?.product_id;
  },
);


const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    // borderWidth: 0.9,
    // borderColor: '#F2F2F2',
    // marginBottom: 10,
    // margin: Dimensions.get('window').width * 0.017,
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
  amountDisc: {
    fontFamily: 'ReadexPro-Medium',
    color: '#FF6347',
    fontSize: 12.2,
    marginTop: 2,
    letterSpacing: -0.5,
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

    backgroundColor: '#EF4444',
    zIndex: 100,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 3,

  },
  discountTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FF6347',
    padding: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  discountText: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
  },
  originalAmount: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 6,
  },
});

export default React.memo(ProductCard);
