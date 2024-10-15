/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  // TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
// import { Picker } from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Picker as RNPicker } from 'react-native-ui-lib';
// import DropDownPicker from 'react-native-dropdown-picker';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
// import PrimaryButton from '../PrimaryButton';
import { useGetStoreOutlets } from '../../hooks/useGetStoreOutlets';
import Loading from '../Loading';
import { useGetAreaBasedDelivery } from '../../hooks/useGetAreaBasedDelivery';
import _ from 'lodash';
import Picker from '../Picker';
import { useGetStoreDeliveryConfig } from '../../hooks/useGetStoreDeliveryConfig';
import { useGetMerchantDelivery } from '../../hooks/useGetMerchantDelivery';
import { useMerchantDistDelivery } from '../../hooks/useMerchantDistDelivery';
import { useNavigation } from '@react-navigation/native';

// const DropDownListItem = ({ label, setValue, setOpen }) => {
//   return (
//     <TouchableOpacity
//       style={styles.itemStyle}
//       onPress={() => {
//         setValue(label);
//         setOpen(false);
//       }}>
//       <Text style={styles.labelStyle}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

export function LocationSheet(props) {
  const { user } = useSelector(state => state.auth);
  const [deliveryOptions, setDeliveryOptions] = React.useState(null);
  const [merchantDistStatus, setMerchantDistStatus] = React.useState();
  const { isLoading } = useGetStoreOutlets(user.merchant);
  const { data: config_, isLoading: isConfigLoading } =
    useGetStoreDeliveryConfig(user.merchant);
  const mutation = useGetAreaBasedDelivery(setDeliveryOptions);
  const [toggleMerchantDelivery, setMerchantDelivery] = React.useState(false);
  const { setDelivery } = useActionCreator();
  const deliveryInfo = React.useRef();
  const { data: merchantDelivery, isMerchantDeliveryLoading } =
    useGetMerchantDelivery(user.merchant, toggleMerchantDelivery);

  const merchantDistDelivery = useMerchantDistDelivery(setMerchantDistStatus);

  const { outlet: outlet_ } = useSelector(state => state.auth);
  console.log('oooooooooooooo', outlet_.outlet_gps);

  React.useEffect(() => {
    if (
      config_ &&
      config_.data &&
      config_.data.data &&
      config_.data.data.option_delivery === 'MERCHANT'
    ) {
      calculateDelivery(
        outlet_,
        _,
        config_ && config_.data && config_.data.data,
      );
    }
  }, [config_, outlet_, merchantDelivery, calculateDelivery]);

  React.useEffect(() => {
    if (merchantDistStatus && merchantDistStatus.status == 0) {
      const dList = merchantDistStatus.data;
      const deliveryOptionsList = [
        {
          label: 'GHS' + dList.delivery_price + ' - ' + dList.delivery_location,
          value: JSON.stringify(dList),
        },
      ];
      // console.log('llllllllllllllll', merchantDistStatus.data);
      // for (let d in merchantDistStatus.data) {
      //   if (merchantDistStatus.status == 0) {
      //     const dList = merchantDistStatus.data[d];
      //     deliveryOptionsList.push({
      //       label:
      //         'GHS' + dList.delivery_price + ' - ' + dList.delivery_location,
      //       value: JSON.stringify(dList),
      //     });
      //   }
      // }
      setDeliveryOptions(deliveryOptionsList);
    }
  }, [merchantDistStatus]);

  console.log();

  const calculateDelivery = React.useCallback(
    (outlet, destination, config) => {
      console.log('callllculateee', outlet.outlet_gps, destination, config);
      if (config && config.option_delivery === 'IPAY') {
        const deliveryChargePayload = {
          pickup_id: outlet.outlet_id,
          pickup_gps: outlet.outlet_gps,
          pickup_location: outlet.outlet_name,
          destination_gps: destination.geometry,
          destination_location: destination.formatted_address,
        };
        mutation.mutate(deliveryChargePayload);
      } else if (config && config.option_delivery === 'MERCHANT-DIST') {
        merchantDistDelivery.mutate({
          merchant: user.merchant,
          pickup_gps: outlet && outlet.outlet_gps,
          destination_gps: destination && destination.geometry,
        });
      } else {
        // var devList = await GetData("orders/delivery/route/" + user.user_merchant_id + "/list");
        setMerchantDelivery(true);
        if (
          merchantDelivery &&
          merchantDelivery.data &&
          merchantDelivery.data.data
        ) {
          console.log('cccccccccccccaaaaallllllllll');
          const deliveryOptionsList = [];
          for (let d in merchantDelivery.data.data) {
            if (merchantDelivery.data.data[d] !== null) {
              const dList = merchantDelivery.data.data[d];
              deliveryOptionsList.push({
                label:
                  'GHS' +
                  dList.delivery_price +
                  ' - ' +
                  dList.delivery_location,
                value: JSON.stringify(dList),
              });
            }
          }
          setDeliveryOptions(deliveryOptionsList);
        }
        //console.log(devList);

        // this.setState({ deliveryOptionsList: deliveryOptionsList });
      }
    },
    [merchantDelivery, user.merchant, mutation, merchantDistDelivery],
  );
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      snapPoints={['90']}
      defaultOverlayOpacity={0.3}>
      {(isLoading ||
        isMerchantDeliveryLoading ||
        isConfigLoading ||
        merchantDistDelivery.isLoading) && <Loading />}
      {!(
        isLoading ||
        isConfigLoading ||
        isMerchantDeliveryLoading ||
        merchantDistDelivery.isLoading
      ) && (
        <View style={locationStyles.locationMain}>
          <GooglePlacesAutocomplete
            placeholder="Enter delivery address here"
            placeholderTextColor="#ff0000"
            fetchDetails={true}
            textInputHide={mutation.isLoading || deliveryOptions !== null}
            onPress={(id, details) => {
              deliveryInfo.current = {
                delivery_gps: details && details.geometry,
                delivery_location: details && details.formatted_address,
              };
              calculateDelivery(
                outlet_,
                {
                  formatted_address: details.formatted_address,
                  geometry:
                    details.geometry.location.lat +
                    ',' +
                    details.geometry.location.lng,
                },
                config_ && config_.data && config_.data.data,
              );
            }}
            query={{
              key: 'AIzaSyCEhoYQkAxqs75nVsS_xUWg2w5DVFZ_p_4',
              language: 'en',
              components: 'country:gh',
            }}
            textInputProps={{
              placeholderTextColor: '#ccc',
            }}
            styles={{
              textInput: {
                borderRadius: 4,
                paddingHorizontal: 18,
                fontSize: 16,
                flex: 1,
                color: '#30475e',
                fontFamily: 'Inter-Medium',
                backgroundColor: '#F5F7F9',
                marginTop: 12,
                height: 52,
              },
              listView: {
                // flexGrow: 0,
              },
              container: {
                zIndex: 10,
                overflow: 'visible',
                height: 48,
                flexGrow: mutation.isLoading || deliveryOptions ? 0 : 1,
                // flexGrow: 0,
                flexShrink: mutation.isLoading || deliveryOptions ? 0 : 1,
              },
            }}
            renderRow={i => (
              <View>
                <Text
                  style={{
                    color: '#30475e',
                    fontSize: 14,
                    fontFamily: 'Inter-Medium',
                  }}>
                  {i.description}
                </Text>
              </View>
            )}
          />
          {mutation.isLoading && <Loading />}
          {deliveryOptions && (
            <View style={{ flex: 1, marginTop: 25 }}>
              {deliveryOptions.distance && (
                <Text style={locationStyles.distance}>
                  Estimated distance: {deliveryOptions.distance}
                </Text>
              )}
              {config_ &&
                config_.data &&
                config_.data.data &&
                config_.data.data.option_delivery === 'IPAY' && (
                  <FlatList
                    style={locationStyles.list}
                    data={deliveryOptions}
                    keyExtractor={item => item.estimateId}
                    renderItem={({ item, index }) => {
                      if (!item) {
                        return;
                      }
                      const item_ = JSON.parse(item.value);
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setDelivery({
                              value: 'DELIVERY',
                              meta: item_.delivery_location,
                              price: Number(item_.delivery_price),
                              label: 'Delivery',
                              delivery_gps: deliveryInfo.current.delivery_gps,
                              delivery_location:
                                deliveryInfo.current.delivery_location,
                              delivery_id: item.delivery_id,
                            });
                            SheetManager.hide('location');
                            SheetManager.hide('delivery');
                          }}
                          style={locationStyles.optionsWrapper}>
                          <Text style={locationStyles.name}>
                            {index + 1}. {item_.delivery_location}
                          </Text>
                          <Text style={locationStyles.price}>
                            GHS {item_.delivery_price}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={locationStyles.separator} />
                    )}
                  />
                )}
              {config_ &&
                config_.data &&
                config_.data.data &&
                (config_.data.data.option_delivery === 'MERCHANT' ||
                  config_.data.data.option_delivery === 'MERCHANT-DIST') && (
                  <FlatList
                    style={locationStyles.list}
                    data={deliveryOptions}
                    keyExtractor={item => item.delivery_id}
                    renderItem={({ item, index }) => {
                      if (!item) {
                        return;
                      }
                      console.log('iteeeeeeeeeeeeeeeeeeeeee', item);
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setDelivery({
                              value: 'DELIVERY',
                              // meta: JSON.parse(item.value).delivery_location,
                              price: Number(
                                JSON.parse(item.value).delivery_price,
                              ),
                              label: 'Delivery',
                              delivery_gps: '',
                              delivery_location: JSON.parse(item.value)
                                .delivery_location,
                              delivery_id: JSON.parse(item.value).delivery_id,
                            });
                            SheetManager.hide('location');
                            SheetManager.hide('delivery');
                          }}
                          style={locationStyles.optionsWrapper}>
                          <Text style={locationStyles.name}>
                            {index + 1}.{' '}
                            {JSON.parse(item.value).delivery_location}
                          </Text>
                          <Text style={locationStyles.price}>
                            GHS {JSON.parse(item.value).delivery_price}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={locationStyles.separator} />
                    )}
                  />
                )}
            </View>
          )}
          {/* <PrimaryButton style={locationStyles.btn}>
            Confirm location
          </PrimaryButton> */}
        </View>
      )}
    </ActionSheet>
  );
}

const locationStyles = StyleSheet.create({
  separator: { borderBottomColor: '#ddd', borderBottomWidth: 0.5 },
  input: {
    borderRadius: 3,
    borderWidth: 0.4,
    borderColor: '#ddd',
    paddingHorizontal: 18,
    marginVertical: 18,
  },
  locationMain: {
    paddingHorizontal: 16,
    height: '100%',
    paddingBottom: 16,
  },
  list: { marginBottom: 30 },
  distance: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 16,
    color: '#30475E',
    textAlign: 'center',
  },
  btn: {
    borderRadius: 4,
    marginBottom: 18,
    marginTop: 'auto',
  },
  optionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  name: {
    fontFamily: 'Lato-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  price: {
    marginLeft: 'auto',
    marginRight: 16,
    fontFamily: 'Lato-Semibold',
    fontSize: 17,
    color: '#1942D8',
  },
});

function DeliverySheet(props) {
  const { delivery } = useSelector(state => state.sale);
  const { setDelivery } = useActionCreator();
  const navigation = useNavigation();
  const options = React.useMemo(
    () => [
      { label: 'Walk-in', value: 'WALK-IN', price: 0 },
      { label: 'Delivery', value: 'DELIVERY' },
      { label: 'Pick-up', value: 'PICKUP', price: 0 },
      { label: 'Dine-in', value: 'DINE-IN', price: 0 },
    ],
    [],
  );

  React.useEffect(() => {
    if (!delivery) {
      setDelivery(options[0]);
    }
  }, [delivery, setDelivery, options]);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      migrateTextField
      // onClose={() => {
      //   console.log('csfgdsgsg===========================');
      //   if (next.current) {
      //     InteractionManager.runAfterInteractions(() => {
      //       SheetManager.show('location');
      //     });
      //   }
      // }}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Select Delivery option</Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <Picker
            placeholder="Select Delivery method"
            floatingPlaceholder
            value={delivery && delivery.value}
            // enableModalBlur={false}

            setValue={item => {
              if (item.value === 'DELIVERY') {
                SheetManager.hide('delivery');
                navigation.navigate('Delivery Location');
                return;
              }
              setDelivery({ ...item, price: 0 });
            }}
            // useNativePicker
            topBarProps={{ title: 'Delivery options' }}
            searchPlaceholder={'Search a language'}
            migrateTextField>
            {_.map(options, option => (
              <RNPicker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </Picker>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
    width: Dimensions.get('window').width * 0.6,
    paddingHorizontal: 24,
  },
  main: {
    paddingVertical: 18,
  },
  picker: {
    borderWidth: 3,
    borderColor: '#ddd',
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingVertical: 12,
    // borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    // borderBottomWidth: 0.3,
  },
  dropdownWrapper: {
    // paddingHorizontal: 24,
    marginVertical: 22,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#3C4959',
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    borderRadius: 5,
  },
  textStyle: {
    fontFamily: 'Inter-Regular',
    color: '#30475E',
  },
  dropdownContainer: {
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    paddingVertical: 6,
  },

  itemStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  labelStyle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#30475E',
  },
});

export default DeliverySheet;
