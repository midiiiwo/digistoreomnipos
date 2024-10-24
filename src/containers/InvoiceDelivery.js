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
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import DropDownPicker from 'react-native-dropdown-picker';

import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
// import PrimaryButton from '../PrimaryButton';
import Loading from '../components/Loading';
import { useGetAreaBasedDelivery } from '../hooks/useGetAreaBasedDelivery';
import _ from 'lodash';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';
import { useGetMerchantDelivery } from '../hooks/useGetMerchantDelivery';
import { useMerchantDistDelivery } from '../hooks/useMerchantDistDelivery';
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

export function InvoiceDelivery() {
  const { user } = useSelector(state => state.auth);
  const [deliveryOptions, setDeliveryOptions] = React.useState(null);
  const [merchantDistStatus, setMerchantDistStatus] = React.useState();
  const { data: config_, isLoading: isConfigLoading } =
    useGetStoreDeliveryConfig(user.merchant);
  const mutation = useGetAreaBasedDelivery(setDeliveryOptions);
  const [toggleMerchantDelivery, setMerchantDelivery] = React.useState(false);
  const { setInvoiceDelivery } = useActionCreator();
  const deliveryInfo = React.useRef();
  const { data: merchantDelivery } = useGetMerchantDelivery(
    user.merchant,
    toggleMerchantDelivery,
  );

  const merchantDistDelivery = useMerchantDistDelivery(setMerchantDistStatus);

  const { outlet: outlet_ } = useSelector(state => state.auth);
  const navigation = useNavigation();

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

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      setDeliveryOptions(null);
    });
  }, [navigation]);

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
  if (isConfigLoading) {
    return <Loading />;
  }
  return (
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
          key: 'AIzaSyDz3nLNtITAtLX-Iju3-Tvn1xHREaI9yB0',
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
            fontFamily: 'SFProDisplay-Medium',
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
                fontFamily: 'SFProDisplay-Medium',
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
                data={deliveryOptions.pricingestimate}
                keyExtractor={item => item.estimateId}
                renderItem={({ item, index }) => {
                  if (!item) {
                    return;
                  }
                  let item_ = {};
                  try {
                    item_ = JSON.parse(item.value) || {};
                  } catch (error) {
                    item_ = {};
                  }

                  console.log(deliveryOptions);

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setInvoiceDelivery({
                          value: 'DELIVERY',
                          meta: item.delivery_location,
                          price: Number(item.price || 0),
                          label: 'Delivery',
                          delivery_gps: deliveryInfo.current.delivery_gps,
                          delivery_location:
                            deliveryInfo.current.delivery_location,
                          delivery_id: item.delivery_id,
                          delivery_config:
                            config_ &&
                            config_.data &&
                            config_.data.data &&
                            config_.data.data.option_delivery,
                          estimate_id: item.estimateId,
                          chargeType: item.pricingtype,
                        });
                        setDeliveryOptions(null);
                        navigation.goBack();
                      }}
                      style={locationStyles.optionsWrapper}>
                      <Text style={locationStyles.name}>
                        {index + 1}. {item && item.estimateName}
                      </Text>
                      <Text style={locationStyles.price}>GHS {item.price}</Text>
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
                  let price;
                  try {
                    price = Number(
                      JSON.parse(item?.value || '{}')?.delivery_price,
                    );
                  } catch (error) {}
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setInvoiceDelivery({
                          value: 'DELIVERY',
                          // meta: JSON.parse(item.value).delivery_location,
                          price,
                          label: 'Delivery',
                          delivery_gps: '',
                          delivery_location: JSON.parse(item?.value || '{}')
                            .delivery_location,
                          delivery_id: JSON.parse(item?.value || '{}')
                            ?.delivery_id,
                          delivery_config:
                            config_ &&
                            config_.data &&
                            config_.data.data &&
                            config_.data.data.option_delivery,
                        });
                        navigation.goBack();
                      }}
                      style={locationStyles.optionsWrapper}>
                      <Text style={locationStyles.name}>
                        {index + 1}. {JSON.parse(item.value).delivery_location}
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
    flex: 1,
    backgroundColor: '#fff',
  },
  list: { marginBottom: 30 },
  distance: {
    fontFamily: 'SFProDisplay-Medium',
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

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
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
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: -0.3,
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    borderRadius: 5,
  },
  textStyle: {
    fontFamily: 'SFProDisplay-Regular',
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
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    color: '#30475E',
  },
});

export default InvoiceDelivery;
