/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import PrimaryButton from '../PrimaryButton';
import _ from 'lodash';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useNavigation } from '@react-navigation/native';

export const Picker = ({
  setCurrentPrice,
  disabled,
  setCurrentIdx,
  currentIdx,
  children,
  title,
  items,
  setCurrentProperty,
  productVariants,
  selectedVariants,
  // level,
}) => {
  const [triggerActive, setTriggerActive] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const title_ =
    title.toLowerCase().charAt(0).toUpperCase() + title.toLowerCase().slice(1);

  // console.log('varrrrrrrrrrrrrryyyyyyyyyy', productVariants, title);
  return (
    <View style={styles.dWrapper}>
      <RNPicker
        placeholder={`Select ${title_}`}
        floatingPlaceholder
        value={value}
        // placeholderTextColor="#000"
        enableModalBlur={false}
        onChange={item => {
          setValue(item.value);
          const i = _.find(items, { property_value: item.value });
          setCurrentProperty(i);
          if (i.property_price_set === 'YES') {
            setCurrentPrice(i.property_price);
          } else {
            console.log('gotererererererer', item.value, title_);
            selectedVariants.current[title_] = item.value;
          }
          // productVariants.forEach(pv => {
          //   if (pv.variantOptionValue[title_] === item.value) {
          //     setCurrentPrice(pv.variantOptionPrice);
          //   }
          // });
          if (triggerActive) {
            return;
          }
          setCurrentIdx(currentIdx + 1);
          setTriggerActive(true);
        }}
        color="#30475e"
        labelColor="#30475e"
        floatingPlaceholderColor={disabled ? '#ddd' : '#009EFF'}
        floatingPlaceholderStyle={dd.placeholder}
        disabledColor={'#ddd'}
        topBarProps={{
          title: `Select ${title_}`,
        }}
        editable={!disabled}
        style={dd.main}
        migrateTextField>
        {children}
      </RNPicker>
    </View>
  );
};

const PropertyList = ({
  productProperties,
  setCurrentPrice,
  setCurrentProperty,
  productVariants,
  selectedVariants,
}) => {
  let elements;
  const dropdowns = [];

  // const selectedVariants = React.useRef({});
  // const v = productVariants.find(i => {

  // })

  const [currentIdx, setCurrentIdx] = React.useState(0);
  let counter = 0;

  console.log('selelclcldkds', selectedVariants);

  for (const key in productProperties) {
    if (Object.hasOwnProperty.call(productProperties, key)) {
      // const v = productVariants.map(i => {
      //   if (i.variantOptionValue.hasOwnProperty(capKey)) {
      //     keyTracker.push(capKey);
      //     return i;
      //   }
      // });

      // console.log('vvvvvv', v);

      elements = productProperties[key].map(prop => {
        // const f = productVariants.find(pv => {
        //   return pv.variantOptionValue[capKey] === prop.property_value;
        // });

        return (
          <RNPicker.Item
            key={prop.property_value}
            value={prop.property_value}
            label={prop.property_value}
            // disabled={f === undefined}
          />
        );
      });

      dropdowns.push(
        <Picker
          title={key}
          key={key}
          disabled={counter > currentIdx}
          setCurrentIdx={setCurrentIdx}
          level={counter}
          setCurrentPrice={setCurrentPrice}
          setCurrentProperty={setCurrentProperty}
          items={productProperties[key]}
          // productVariants={v}
          selectedVariants={selectedVariants}
          currentIdx={currentIdx}>
          {elements}
        </Picker>,
      );
    }
    counter++;
  }
  return dropdowns;
};

function VariantSheet({ sheetId, payload }) {
  const ref = React.useRef(null);
  const { addToCart } = useActionCreator();
  const { product_id, product_name, product_image } = payload;
  const [currentPrice, setCurrentPrice] = React.useState(payload.product_price);
  const [currentProperty, setCurrentProperty] = React.useState({});
  const selectedVariants = React.useRef({});
  const navigation = useNavigation();
  const productProperties = {};
  payload.product_properties &&
    payload.product_properties.forEach(prop => {
      if (!productProperties[prop.property_id]) {
        productProperties[prop.property_id] = [];
      }
      productProperties[prop.property_id].push(prop);
    });
  const productVariants =
    (payload.product_has_property_variants === 'YES' &&
      payload.product_properties_variants) ||
    [];
  return (
    <ActionSheet
      id={sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      ref={ref}
      snapPoints={['98']}
      defaultOverlayOpacity={0.3}>
      {/* <View style={styles.main}> */}
      <View>
        <Pressable
          onPress={() => SheetManager.hide('variants')}
          style={{ paddingVertical: 20, marginLeft: 'auto', marginRight: 24 }}>
          <Text
            style={{ fontFamily: 'Lato-Medium', fontSize: 16, color: 'red' }}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <PropertyList
          productProperties={productProperties}
          setCurrentPrice={setCurrentPrice}
          setCurrentProperty={setCurrentProperty}
          productVariants={productVariants}
          selectedVariants={selectedVariants}
        />
        {/* <View style={styles.amountWrapper}>
          <Text style={styles.amount}>GHS {currentPrice}</Text>
        </View> */}
      </ScrollView>
      {/* </View> */}

      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            if (payload.product_has_property_variants === 'YES') {
              // debugger;
              productVariants.forEach(i => {
                let track = true;
                for (let k of Object.keys(i.variantOptionValue)) {
                  if (selectedVariants.current[k] === i.variantOptionValue[k]) {
                    track = track && true;
                  } else {
                    track = false;
                  }
                }
                if (track) {
                  const processedVariants = {};
                  for (const [key, value] of Object.entries(
                    selectedVariants.current || {},
                  )) {
                    processedVariants[(key || '').toUpperCase()] = value;
                  }
                  addToCart({
                    id: product_id,
                    itemName: product_name,
                    amount: Number(i && i.variantOptionPrice),
                    quantity: 1,
                    product_image: product_image,
                    order_item_props: processedVariants,
                    order_item_prop_id: i && i.variantOptionId,
                  });
                  SheetManager.hide('variants');
                }
              });
              return;
            }
            if (payload.product_has_property === 'YES') {
              const processedVariants = {};
              for (const [key, value] of Object.entries(
                selectedVariants.current || {},
              )) {
                processedVariants[(key || '').toUpperCase()] = value;
              }
              addToCart({
                id: product_id,
                itemName: product_name,
                amount: Number(currentPrice),
                quantity: 1,
                product_image: product_image,
                order_item_props: processedVariants,
              });
              SheetManager.hide('variants');
              return;
            }
            navigation.navigate('Inventory');
          }}>
          Confirm selection
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14,
    paddingHorizontal: 14,
    // height: '100%',
    zIndex: 100,
    marginTop: 'auto',
    marginBottom: 'auto',
    // backgroundColor: 'red',
    color: '#009EFF',
  },
  main: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#B7D9F8',
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#F5FAFF',
    zIndex: -2,
  },
});

const styles = StyleSheet.create({
  main: {
    // height: '90%',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  container: {
    // minHeight: 128,
    paddingBottom: 100,
  },
  amountWrapper: {
    paddingTop: 12,
  },
  amount: {
    marginLeft: 'auto',
    marginRight: 12,
    color: '#30475e',
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 16,
  },
  buttonContainer: {
    height: '90%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    width: '100%',
  },
  itemStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
  btn: {
    borderRadius: 4,
    width: '88%',
  },
  dWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.5)',
    borderRadius: 2,
  },
  dropdownContainer: {
    borderRadius: 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    paddingVertical: 6,
    zIndex: 100000000,
  },
  label: {
    fontFamily: 'Inter-Regular',
    color: '#30475E',
  },
  labelStyle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#30475E',
  },
});

export default VariantSheet;
