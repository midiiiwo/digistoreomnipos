/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import Input from '../Input';
import PrimaryButton from '../PrimaryButton';
import Bin from '../../../assets/icons/bin.svg';
import { Pressable } from 'react-native';

const VariantItem = ({
  v,
  properties,
  setProperties,
  variants,
  setVariants,
}) => {
  const [variant, setVariant] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  return (
    <View style={{ width: '100%', marginTop: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 6,
          paddingHorizontal: 6,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: '#30475e',
            fontSize: 16,
          }}>
          {v}
        </Text>
        <Pressable
          style={{ marginLeft: 'auto' }}
          onPress={() => {
            setVariants(i => i.filter(c => c !== v));
            for (let p in properties) {
              if (p === v) {
                setProperties({ ...properties, [v]: {} });
              }
            }
          }}>
          <Bin />
        </Pressable>
      </View>
      {(properties[v] || []).map(i => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 8,
              paddingHorizontal: 6,
              borderBottomColor: '#eee',
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                color: '#30475e',
                fontSize: 14,
                textAlign: 'center',
              }}>
              {i.variant}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                color: '#30475e',
                fontSize: 14,
                textAlign: 'center',
              }}>
              GHS {i.price}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                color: '#30475e',
                fontSize: 14,
                textAlign: 'center',
              }}>
              YES
            </Text>
            <Pressable
              onPress={() => {
                const filteredProps = properties[v].filter(
                  c => c.variant !== i.variant,
                );
                setProperties({ ...properties, [v]: filteredProps });
              }}>
              <Bin />
            </Pressable>
          </View>
        );
      })}
      <View style={{ flexDirection: 'row', marginTop: 3 }}>
        <Input
          placeholder={v}
          val={variant}
          setVal={text => setVariant(text)}
          style={{
            backgroundColor: '#fff',
            flex: 1,
            marginRight: 4,
          }}
          showError={variant.length === 0 && showError}
        />
        <Input
          placeholder="Price"
          val={price}
          setVal={text => setPrice(text)}
          style={{ backgroundColor: '#fff', flex: 1 }}
          showError={price.length === 0 && showError}
        />
        <PrimaryButton
          handlePress={() => {
            if (price.length === 0 || variant.length === 0) {
              setShowError(true);
            }
            if (!properties.hasOwnProperty(v)) {
              setProperties({
                ...properties,
                [v]: [{ variant, price }],
              });
              return;
            }
            setProperties({
              ...properties,
              [v]: [...properties[v], { variant, price }],
            });
            setPrice('');
            setVariant('');
          }}
          style={{
            paddingHorizontal: 26,
            height: '85%',
            marginTop: 7,
            marginLeft: 8,
            borderRadius: 5,
          }}>
          Add
        </PrimaryButton>
      </View>
    </View>
  );
};

function AddProductVariant(props) {
  const [variant, setVariant] = React.useState('');
  const [variants, setVariants] = React.useState([]);

  const [properties, setProperties] = React.useState({});
  const { addVariants } = props.payload;

  console.log('variants-----', variants);
  console.log('properties---------', properties);

  console.log('properties----->', properties);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      openAnimationConfig={{ bounciness: 0, delay: 0 }}
      springOffset={150}
      defaultOverlayOpacity={0.3}>
      <ScrollView
        style={{
          borderRadius: 0,
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 18,
            marginBottom: 88,
          }}>
          <Text
            style={{
              fontFamily: 'Lato-SemiBold',
              fontSize: 16,
              color: '#30475e',
              marginBottom: 10,
            }}>
            Add Product Variants
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 8,
              alignItems: 'center',
            }}>
            <Input
              placeholder="Enter Variant eg. Weight"
              val={variant}
              setVal={text => setVariant(text)}
              style={{ backgroundColor: '#fff', flex: 1 }}
            />
            <PrimaryButton
              handlePress={() => {
                setVariants([...variants, variant]);
                setVariant('');
              }}
              style={{
                paddingHorizontal: 26,
                height: '87%',
                marginTop: 5,
                marginLeft: 8,
                borderRadius: 5,
              }}>
              Add
            </PrimaryButton>
          </View>
          <View style={{ width: '100%', padding: 12 }}>
            {variants.map(v => {
              return (
                <VariantItem
                  v={v}
                  properties={properties}
                  setProperties={setProperties}
                  variants={variants}
                  setVariants={setVariants}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            const v = {};
            let i = 0;
            for (let key in properties) {
              for (let item of properties[key]) {
                const variant_ = {
                  propertyId: key.toUpperCase(),
                  propertyValue: item.variant,
                  propertyPrice: item.price,
                  propertyPriceSet: 'YES',
                };
                v[i] = variant_;
                i++;
              }
            }
            addVariants(v);
            SheetManager.hide('addProductVariants');
          }}>
          Done
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
    // borderRadius: 0,
  },
  // indicatorStyle: {
  //   display: 'flex',
  // },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  dWrapper: {
    paddingTop: 12,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 12,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AddProductVariant;
