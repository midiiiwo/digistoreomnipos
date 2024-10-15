/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { DateTimePicker, Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useAddProductCategory } from '../hooks/useAddProductCategory';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useAddCustomer } from '../hooks/useAddCustomer';
import moment from 'moment';
import { useGetCustomerDetails } from '../hooks/useGetCustomerDetails';
import Loading from '../components/Loading';
import { useEditCustomer } from '../hooks/useEditCustomer';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useEditCustomerLocation } from '../hooks/useEditCustomerLocation';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'customer_name':
      return { ...state, name: action.payload };
    case 'customer_email':
      return { ...state, email: action.payload };
    case 'customer_phone':
      return { ...state, phone: action.payload };
    case 'customer_dob':
      return { ...state, dob: action.payload };
    case 'customer_alt':
      return { ...state, alt: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const EditCustomer = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  // const locationInfo = React.useRef();
  const [location, setLocation] = React.useState();
  const [showLocation, setShowLocation] = React.useState(true);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    email: '',
    phone: '',
    dob: '',
    alt: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const { data, isLoading } = useGetCustomerDetails(
    user.merchant,
    route.params.id,
  );

  const editCustomer = useEditCustomer(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-customers');
      client.invalidateQueries('merchant-customer-orders');
      client.invalidateQueries('customer-details');
    }
  });
  const editCustomerLocation = useEditCustomerLocation(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-customers');
      client.invalidateQueries('merchant-customer-orders');
      client.invalidateQueries('customer-details');
    }
  });

  React.useEffect(() => {
    if (data && data.data.status == 0) {
      dispatch({
        type: 'update_all',
        payload: {
          name:
            data && data.data && data.data.data && data.data.data.customer_name,
          phone:
            data &&
            data.data &&
            data.data.data &&
            data.data.data.customer_phone,
          email:
            data &&
            data.data &&
            data.data.data &&
            data.data.data.customer_email,
          alt:
            data &&
            data.data &&
            data.data.data &&
            data.data.data.customer_alt_phone,
          dob: moment(
            data && data.data && data.data.data && data.data.data.customer_dob,
          ).isValid()
            ? moment(
                data &&
                  data.data &&
                  data.data.data &&
                  data.data.data.customer_dob,
                'DD-MM-YYYY',
              ).toDate()
            : // .toDate()
              '',
        },
      });
    }
  }, [user.user_name, data]);

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top' });
        navigation.goBack();
        setSaved(null);
        return;
      }
      toast.show(saved.message, { placement: 'top', type: 'danger' });
      setSaved(null);
    }
  }, [saved, toast, navigation]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  if (isLoading) {
    return <Loading />;
  }

  console.log('dob--------.', data && data.data && data.data.data);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <View style={styles.main}>
          <Input
            placeholder="Enter Customer Name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'customer_name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Customer Email"
            val={state.email}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_email',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Customer Phone"
            val={state.phone}
            keyboardType="phone-pad"
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_phone',
                payload: text,
              })
            }
            disabled
          />
          <Input
            placeholder="Enter Customer Alt Phone"
            val={state.alt}
            keyboardType="phone-pad"
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_alt',
                payload: text,
              })
            }
            // disabled
          />
          <View style={{ marginTop: 22 }}>
            <DateTimePicker
              title={''}
              placeholder={'Enter Date of Birth'}
              mode={'date'}
              migrate
              value={state.dob}
              onChange={val => {
                handleTextChange({
                  type: 'customer_dob',
                  payload: val,
                });
              }}
            />
          </View>
          {showLocation && (
            <GooglePlacesAutocomplete
              placeholder="Enter location address here"
              placeholderTextColor="#ff0000"
              fetchDetails={true}
              // textInputHide={mutation.isLoading || deliveryOptions !== null}
              onPress={(id, details) => {
                setLocation({
                  location_gps:
                    details.geometry.location.lat +
                    ',' +
                    details.geometry.location.lng,
                  location_name: details && details.formatted_address,
                });
                setShowLocation(false);
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
                  // height: 48,
                  // flexGrow: mutation.isLoading || deliveryOptions ? 0 : 1,
                  // flexGrow: 0,
                  // flexShrink: mutation.isLoading || deliveryOptions ? 0 : 1,
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
          )}
          {location && !showLocation && (
            <Pressable onPress={() => setShowLocation(true)}>
              <Text
                style={{
                  fontFamily: 'Lato-Medium',
                  fontSize: 16,
                  color: '#30475e',
                }}>
                Location: {location && location.location_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Medium',
                  fontSize: 16,
                  color: '#30475e',
                }}>
                GPS: {location && location.location_gps}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={editCustomer.isLoading}
          handlePress={() => {
            if (
              state.name.length === 0
              // state.email.length === 0 ||
              // state.phone.length === 0 ||
            ) {
              setShowError(true);
              return;
            }
            console.log(typeof state.dob);
            editCustomer.mutate({
              client_id: route.params.id,
              client_name: state.name,
              client_email: state.email,
              client_phone: state.phone,
              client_alt_phone: state.alt,
              client_dob:
                typeof state.dob === 'object'
                  ? moment(state.dob).format('DD-MM-YYYY')
                  : data &&
                    data.data &&
                    data.data.data &&
                    data.data.data.customer_dob,
              client_merchant: user.merchant,
              mod_by: user.login,
            });
            if (location) {
              editCustomerLocation.mutate({
                customer_id: route.params.id,
                location_gps: location.location_gps,
                location_name: location.location_name,
                customer_merchant: user.merchant,
                mod_by: user.login,
              });
            }
          }}>
          {editCustomer.isLoading ? 'Processing' : 'Save Customer'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditCustomer;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
    backgroundColor: '#fff',
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
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
});

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 14,
    height: '100%',
    zIndex: 100,
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
  },
});
