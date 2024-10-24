/* eslint-disable react-native/no-inline-styles */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import Input from '../components/Input';
import Bin from '../../assets/icons/remove.svg';
import AddCircle from '../../assets/icons/add-circle-dark.svg';
import { Switch } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { isArray, toUpper } from 'lodash';

const VariantItem = ({
  v,
  properties,
  setProperties,
  // variants,
  setVariants,
}) => {
  const [variant, setVariant] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [setPrice_, toggleSetPrice_] = React.useState(false);

  React.useEffect(() => {
    if (properties && properties[v] && properties[v][0]) {
      toggleSetPrice_(properties[v][0].priceSet === 'YES');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        backgroundColor: 'rgba(229, 229, 229, 0.3)',
        padding: 6,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 4,
          paddingHorizontal: 6,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#222831',
            fontSize: 16,
          }}>
          {v}
        </Text>
        <Pressable
          style={{ marginLeft: 4 }}
          onPress={() => {
            setVariants(i => i.filter(c => c !== v));
            for (let p in properties) {
              if (p === v) {
                setProperties({ ...properties, [v]: [] });
              }
            }
          }}>
          <Bin />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              color: '#526D82',
              marginRight: 2,
            }}>
            Set Price
          </Text>
          <Switch
            value={setPrice_}
            trackColor={{
              true: '#0081C9',
              false: '#CFCFCF',
            }}
            style={{ marginLeft: 'auto' }}
            onValueChange={() => {
              toggleSetPrice_(!setPrice_);
            }}
          />
        </View>
      </View>
      {(properties[v] || []).map(i => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 8,
              paddingHorizontal: 6,
              borderBottomColor: '#ccc',
              borderBottomWidth: 0.2,
              marginHorizontal: 4,
              marginVertical: 2,
            }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
                fontSize: 15,
                textAlign: 'center',
                width: '20%',
              }}>
              {i.variant}
            </Text>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
                fontSize: 15,
                textAlign: 'center',
                width: '20%',
              }}>
              GHS {i.price}
            </Text>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                color: '#30475e',
                fontSize: 15,
                textAlign: 'center',
                width: '20%',
              }}>
              {i.priceSet}
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
      <View
        style={{ flexDirection: 'row', marginTop: 3, alignItems: 'center' }}>
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
          showError={setPrice_ && price.length === 0 && showError}
          disabled={!setPrice_}
          keyboardType="number-pad"
        />
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => {
            if ((price.length === 0 && setPrice_) || variant.length === 0) {
              setShowError(true);
              return;
            }
            if (!properties.hasOwnProperty(v)) {
              setProperties({
                ...properties,
                [v]: [{ variant, price, priceSet: setPrice_ ? 'YES' : 'NO' }],
              });
              return;
            }
            setProperties({
              ...properties,
              [v]: [
                ...properties[v],
                { variant, price, priceSet: setPrice_ ? 'YES' : 'NO' },
              ],
            });
            setPrice('');
            setVariant('');
          }}>
          <AddCircle />
        </Pressable>
      </View>
    </View>
  );
};

const EditProductVariants = props => {
  const [variant, setVariant] = React.useState('');
  const [variants, setVariants] = React.useState([]);

  const [properties, setProperties] = React.useState({});
  const navigation = useNavigation();
  const { addVariants, variants: variants_ } = props.route.params;
  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    if (variants_ && typeof variants_ === 'object') {
      console.log('variantsssss----====', variants_);
      const props_ = {};
      const vars = [];
      for (let key in variants_) {
        const prop = variants_[key];
        const tProp = {
          price: prop.propertyPrice,
          priceSet: prop.propertyPriceSet,
          variant: prop.propertyValue,
        };
        if (!props_[prop.id]) {
          vars.push(prop.id);
          props_[prop.id] = [tProp];
        } else {
          props_[prop.id].push(tProp);
        }
      }
      console.log('pdpdpdpdpd====', props_);
      setProperties(props_);
      setVariants(vars);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('oooooooooo====', properties);

  // React.useEffect(() => {
  //   if (variants_ && typeof variants_ === 'object') {
  //     const props = {};
  //     const vars = [];
  //     for (let key in variants_) {
  //       const prop = variants_[key];
  //       const tProp = {
  //         price: prop.propertyPrice,
  //         priceSet: prop.propertyPriceSet,
  //         variant: prop.propertyValue,
  //       };
  //       if (!props[prop.id]) {
  //         vars.push(prop.id);
  //         props[prop.id] = [tProp];
  //       } else {
  //         props[prop.id].push(tProp);
  //       }
  //     }
  //     console.log('pdpdpdpdpd', props);
  //     setProperties(props);
  //     setVariants(vars);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  console.log('propsopsops', properties);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={{
          borderRadius: 0,
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginBottom: 88,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 8,
              alignItems: 'center',
              marginLeft: 6,
            }}>
            <Input
              placeholder="Enter Variant eg. Weight"
              val={variant}
              setVal={text => setVariant(text)}
              style={{ backgroundColor: '#fff', flex: 1 }}
              showError={variant.length === 0 && showError}
            />
            <Pressable
              style={{ marginLeft: 12 }}
              onPress={() => {
                if (variant.length === 0) {
                  setShowError(true);
                  return;
                }
                setVariants([...variants, variant]);
                setVariant('');
              }}>
              <AddCircle height={40} width={40} />
            </Pressable>
            {/* <PrimaryButton
              handlePress={() => {
              }}
              style={{
                paddingHorizontal: 26,
                height: '87%',
                marginTop: 5,
                marginLeft: 8,
                borderRadius: 5,
              }}>
              Add
            </PrimaryButton> */}
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
            console.log('propsopsopsops---------', properties);
            for (let key in properties) {
              for (let item of properties[key]) {
                const variant_ = {
                  propertyId: key.toUpperCase(),
                  propertyValue: item.variant,
                  propertyPrice: item.price,
                  propertyPriceSet: item.priceSet,
                  id: key,
                };
                v[i] = variant_;
                i++;
              }
            }
            addVariants(v);
            console.log('vvvvvvvvv', v);
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
            // SheetManager.hide('addProductVariants');
          }}>
          Done
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditProductVariants;

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
