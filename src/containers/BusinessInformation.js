/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

import {
  Picker as RNPicker,
  RadioButton,
  RadioGroup,
} from 'react-native-ui-lib';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { IndexPath, Menu, MenuItem } from '@ui-kitten/components';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Loading from '../components/Loading';

import DocumentPicker from 'react-native-document-picker';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

// import { Switch } from 'react-native-ui-lib';

import PrimaryButton from '../components/PrimaryButton';
// import { useAddCategoryProduct } from '../hooks/useAddCategoryProduct';
import Picker from '../components/Picker';
import AddImage from '../../assets/icons/add-image.svg';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
// import { Switch } from '@rneui/themed';
// import { DateTimePicker } from 'react-native-ui-lib';
import { useGetOnboardingRequirements } from '../hooks/useGetOnboardingRequirements';
import { useGetPreactiveState } from '../hooks/useGetPreactiveState';
import { useAddBusinessInformation } from '../hooks/useAddBusinessInformation';
import Input from '../components/Input';
import { PERMISSIONS, request } from 'react-native-permissions';

const reducer = (state, action) => {
  switch (action.type) {
    case 'bType':
      return { ...state, businessType: action.payload };
    case 'bName':
      return { ...state, BusinessName: action.payload };
    case 'bSocial':
      return { ...state, BusinessSocial: action.payload };
    case 'bLocation':
      return { ...state, location: action.payload };
    case 'bDescription':
      return { ...state, description: action.payload };
    case 'bDocumentType':
      return { ...state, businessDocumentType: action.payload };
    case 'bDocumentNumber':
      return { ...state, businessDocumentNumber: action.payload };
    case 'bCategory':
      return { ...state, businessCategory: action.payload };
    case 'bContact':
      return { ...state, businessContact: action.payload };
    case 'bEmail':
      return { ...state, businessEmail: action.payload };
    case 'bLogo':
      return { ...state, BusinessLogo: action.payload };
    case 'bDocument':
      return { ...state, businessDocument: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const bTypes = [
  'LIMITED LIABILITY',
  'SOLE PROPRIETORSHIP',
  'PARTNERSHIP',
  'PROFESSIONAL FIRMS',
  'NON-REGISTERED BUSINESS',
];

const BusinessInformation = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  const [docRes, setDocRes] = React.useState();
  const client = useQueryClient();
  const [businessRegistered, setBusinessRegistered] = React.useState('YES');

  const [businessStatus, setBusinessStatus] = React.useState();
  const [hasLocation, setHasLocation] = React.useState(true);
  const cacheBust = new Date().toString();
  const [state, dispatch] = React.useReducer(reducer, {
    businessType: { label: '' },
    BusinessName: '',
    BusinessSocial: '',
    location: null,
    description: '',
    businessDocumentType: { label: '' },
    businessDocumentNumber: '',
    businessCategory: { label: '' },
    businessContact: '',
    businessEmail: '',
    BusinessLogo: null,
    businessDocument: null,
  });

  const { data: requirements, isLoading: isRequirmentsLoading } =
    useGetOnboardingRequirements();

  const { data: personal, isLoading: isPersonalLoading } = useGetPreactiveState(
    user.merchant,
  );

  const { mutate, isLoading: isMutating } = useAddBusinessInformation(i => {
    client.invalidateQueries('current-activation-step');
    setBusinessStatus(i);
  });

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const pData = personal && personal.data && personal.data.data;

  React.useEffect(() => {
    if (businessStatus) {
      if (businessStatus.status == 0) {
        toast.show(businessStatus.message, {
          placement: 'top',
          type: 'success',
        });
        navigation.navigate('Activation Type');
        setBusinessStatus(null);
      } else {
        toast.show(businessStatus.message, {
          placement: 'top',
          type: 'danger',
        });
      }
      setBusinessStatus(null);
    }
  }, [navigation, businessStatus, toast]);

  React.useEffect(() => {
    if (businessRegistered === 'YES') {
      dispatch({
        type: 'bType',
        payload: null,
      });
    }
  }, [businessRegistered]);

  React.useEffect(() => {
    if (pData) {
      const bCategory = (requirements &&
        requirements.data &&
        requirements.data.data &&
        requirements.data.data.business_category.find(
          i => i.category_id === pData.merchant_category,
        )) || { category_name: '' };
      setDocRes(pData && pData.merchant_reg_cert);
      const isBusinessRegistered =
        pData &&
        pData.merchant_reg_number.length > 0 &&
        pData.merchant_reg_cert.length > 0;
      setBusinessRegistered(isBusinessRegistered ? 'YES' : 'NO');
      const businessHasLocation =
        pData &&
        typeof pData.merchant_location === 'string' &&
        pData.merchant_location.length > 0;

      setHasLocation(businessHasLocation);
      dispatch({
        type: 'update_all',
        payload: {
          businessType: {
            label: pData.merchant_business_type,
            value: pData.merchant_business_type,
            key: pData.merchant_business_type,
          },
          // businessType: pData.merchant_business_type,
          businessCategory: {
            label: bCategory.category_name,
            value: bCategory.category_id,
            key: bCategory.category_id,
          },
          BusinessName: pData.merchant_name,
          BusinessSocial: pData.merchant_website,
          description: pData.merchant_business_desc,
          businessContact: pData.merchant_phone,
          businessEmail: pData.merchant_email,
          location: {
            delivery_location: pData.merchant_location,
            delivery_gps: {
              location: {
                lat:
                  pData &&
                  pData.merchant_address_gps &&
                  pData.merchant_address_gps.split(',')[0],
                lng:
                  pData &&
                  pData.merchant_address_gps &&
                  pData.merchant_address_gps.split(',')[1],
              },
            },
          },
          businessDocumentNumber: pData.merchant_reg_number,
          businessDocumentType: {
            label: (
              (requirements &&
                requirements.data &&
                requirements.data.data &&
                requirements.data.data.business_documents.find(
                  i => i.document_id === pData.merchant_business_id_type,
                )) || { document_name: '' }
            ).document_name,
            value: pData.merchant_business_id_type,
            key: pData.merchant_business_id_type,
          },
          BusinessLogo: pData.merchant_brand_logo,
        },
      });
    }
  }, [pData, requirements]);

  console.log(personal && personal.data && personal.data.data);

  React.useEffect(() => {
    if (route && route.params) {
      if (route.params.prev_screen == 'location') {
        dispatch({
          type: 'bLocation',
          payload: route.params.location,
        });
      }
    }
  }, [route]);

  if (isRequirmentsLoading || isPersonalLoading) {
    return <Loading />;
  }

  const businessTypes =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.business_category.map(i => {
      return {
        label: i.category_name,
        value: i.category_id,
        key: i.category_id,
      };
    });

  const businessDocumentTypes =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.business_documents.map(i => {
      return {
        label: i.document_name,
        value: i.document_id,
        key: i.document_id,
      };
    });

  console.log(
    'statetatta',
    state.location &&
      typeof state.location.delivery_location === 'string' &&
      state.location.delivery_location.length == 0,
  );

  return (
    <View>
      <ScrollView style={{ height: '100%', backgroundColor: '#fff' }}>
        <View style={styles.main}>
          <View style={{ alignItems: 'center' }}>
            <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
              <MenuTrigger
                onPress={() => setOpenMenu(!openMenu)}
                children={
                  <View
                  // onPress={}
                  >
                    {!state.BusinessLogo && (
                      <AddImage height={100} width={100} />
                    )}
                    {state.BusinessLogo &&
                      typeof state.BusinessLogo === 'string' && (
                        <Image
                          style={{ height: 100, width: 100, borderRadius: 5 }}
                          source={{
                            uri:
                              'https://payments.ipaygh.com/app/webroot/img/logo/' +
                              state.BusinessLogo +
                              '?' +
                              cacheBust,
                          }}
                        />
                      )}
                    {state.BusinessLogo &&
                      typeof state.BusinessLogo === 'object' && (
                        <Image
                          style={{ height: 100, width: 100, borderRadius: 5 }}
                          source={{ uri: state.BusinessLogo.uri }}
                        />
                      )}
                  </View>
                }
              />
              <MenuOptions
                optionsContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  paddingBottom: 16,
                  borderRadius: 6,
                  // elevation: 0,
                }}>
                <MenuOption
                  style={{ marginVertical: 10 }}
                  onSelect={async () => {
                    setOpenMenu(false);
                    if (Platform.OS === 'android') {
                      try {
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.CAMERA,
                          {
                            title: 'App Camera Permission',
                            message: 'App needs access to your camera',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                          },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                          const result = await launchCamera({
                            includeBase64: false,
                            includeExtra: false,
                            mediaType: 'photo',
                          });
                          if (result) {
                            dispatch({
                              type: 'image',
                              payload: result.assets[0],
                            });
                          }
                        } else {
                          toast.show('Camera permission denied', {
                            placement: 'top',
                          });
                        }
                      } catch (error) {}
                    } else if (Platform.OS === 'ios') {
                      try {
                        const granted = await request(PERMISSIONS.IOS.CAMERA);

                        if (granted === 'granted') {
                          const result = await launchCamera({
                            includeBase64: false,
                            includeExtra: false,
                            mediaType: 'photo',
                          });
                          console.log('grrrr', result);
                          if (result) {
                            dispatch({
                              type: 'image',
                              payload: result.assets[0],
                            });
                          }
                        } else {
                          // request(PERMISSIONS.IOS.CAMERA);
                        }
                      } catch (error) {}
                    }
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'Inter-Medium',
                      fontSize: 15,
                    }}>
                    Take Photo
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={async () => {
                    setOpenMenu(false);
                    const result = await launchImageLibrary({
                      mediaType: 'photo',
                      quality: 0.6,
                    });
                    if (result) {
                      dispatch({
                        type: 'bLogo',
                        payload: result.assets[0],
                      });
                    }
                  }}>
                  <Text
                    style={{
                      color: '#30475e',
                      fontFamily: 'Inter-Medium',
                      fontSize: 15,
                    }}>
                    Choose from Gallery
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>

            <View
              style={{ padding: 5, marginVertical: 12 }}
              onPress={() => {
                dispatch({ type: 'bLogo', payload: null });
              }}>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#567189',
                }}>
                Upload Business Logo
              </Text>
            </View>

            {state.BusinessLogo && (
              <Pressable
                style={{ padding: 5, marginTop: 4 }}
                onPress={() => {
                  dispatch({ type: 'bLogo', payload: null });
                }}>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    color: '#E0144C',
                  }}>
                  Clear Image
                </Text>
              </Pressable>
            )}
          </View>

          <Input
            placeholder="Enter Business Trading Name"
            showError={showError && state.BusinessName.length === 0}
            val={state.BusinessName}
            setVal={text =>
              handleTextChange({
                type: 'bName',
                payload: text,
              })
            }
          />
          {showError && state.BusinessName.length === 0 && (
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#EB455F',
                marginBottom: 10,
              }}>
              Please provide your business name
            </Text>
          )}
          <Input
            placeholder="Business Contact Number"
            val={state.businessContact}
            showError={showError && state.businessContact.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'bContact',
                payload: text,
              })
            }
          />
          {showError && state.businessContact.length === 0 && (
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#EB455F',
                marginBottom: 10,
              }}>
              Please provide your business contact phone
            </Text>
          )}
          <Input
            placeholder="Business Email"
            val={state.businessEmail}
            // showError={showError && state.businessEmail.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'bEmail',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Business Description (Describe what you sell, who you sell to, and when you charge your customers)"
            val={state.description}
            showError={showError && state.description.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'bDescription',
                payload: text,
              })
            }
            nLines={3}
          />
          {showError && state.description.length === 0 && (
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 13.5,
                color: '#EB455F',
                marginBottom: 10,
                marginTop: -3,
              }}>
              Please provide a short description about your business
            </Text>
          )}
          <Input
            placeholder="Business Website, Social Media Page or URL to App"
            val={state.BusinessSocial}
            // showError={showError && state.BusinessSocial.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'bSocial',
                payload: text,
              })
            }
          />
          <View style={{ marginVertical: 6 }} />
          <Picker
            showSearch
            searchPlaceholder="Search Business Category"
            showError={
              showError &&
              (!state.businessCategory ||
                state.businessCategory.label.length === 0) &&
              showError
            }
            placeholder="What is your business Category?"
            value={state.businessCategory}
            setValue={item => {
              handleTextChange({
                type: 'bCategory',
                payload: item,
              });
            }}>
            {businessTypes &&
              businessTypes.map(i => (
                <RNPicker.Item key={i.key} label={i.label} value={i.value} />
              ))}
          </Picker>
          {(!state.businessCategory ||
            state.businessCategory.label.length === 0) &&
            showError && (
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 13.5,
                  color: '#EB455F',
                  marginBottom: 10,
                  marginTop: -8,
                }}>
                Please select your business category
              </Text>
            )}

          <View style={{ marginVertical: 14 }} row>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#30475e',
                justifyContent: 'center',
                marginBottom: 10,
                fontSize: 14,
              }}>
              Is your business registered?
            </Text>
            <RadioGroup
              initialValue={businessRegistered}
              onValueChange={setBusinessRegistered}>
              <RadioButton
                value={'YES'}
                label={'Yes'}
                labelStyle={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 15,
                  color: '#567189',
                }}
                color="rgba(25, 66, 216, 0.87)"
              />
              <View style={{ marginVertical: 8 }} />
              <RadioButton
                value={'NO'}
                label={'No'}
                labelStyle={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 15,
                  color: '#567189',
                }}
                color="rgba(25, 66, 216, 0.87)"
              />
            </RadioGroup>
          </View>
          {businessRegistered === 'YES' && (
            <>
              <Picker
                // showSearch
                // searchPlaceholder="Search Business Category"
                showError={
                  showError &&
                  businessRegistered === 'YES' &&
                  (!state.businessType ||
                    state.businessType.label.length === 0) &&
                  showError
                }
                placeholder="What is your business Type?"
                value={state.businessType}
                setValue={item => {
                  handleTextChange({
                    type: 'bType',
                    payload: item,
                  });
                }}>
                {bTypes.map(i => {
                  return <RNPicker.Item key={i} label={i} value={i} />;
                })}
              </Picker>
              {showError &&
                businessRegistered === 'YES' &&
                (!state.businessType ||
                  state.businessType.label.length === 0) && (
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      fontSize: 13.5,
                      color: '#EB455F',
                      marginBottom: 14,
                      marginTop: -8,
                    }}>
                    Please select your business type
                  </Text>
                )}
              <Picker
                placeholder="Business Document Type"
                value={state.businessDocumentType}
                showError={
                  showError &&
                  businessRegistered === 'YES' &&
                  (!state.businessDocumentType ||
                    state.businessDocumentType.label.length === 0)
                }
                setValue={item => {
                  handleTextChange({
                    type: 'bDocumentType',
                    payload: item,
                  });
                }}>
                {businessDocumentTypes.map(i => (
                  <RNPicker.Item key={i.key} label={i.label} value={i.value} />
                ))}
              </Picker>
              {showError &&
                businessRegistered === 'YES' &&
                (!state.businessDocumentType ||
                  state.businessDocumentType.label.length === 0) && (
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      fontSize: 13.5,
                      color: '#EB455F',
                      marginBottom: 14,
                      marginTop: -8,
                    }}>
                    Please select your business document type
                  </Text>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 18,
                }}>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Semibold',
                    color: '#30475e',
                    justifyContent: 'center',
                  }}>
                  Upload Scanned PDF or Business Document
                </Text>
                {/* {docRes && (
              <Check style={{ marginLeft: 3 }} height={18} width={18} />
            )} */}
              </View>

              <Pressable
                onPress={async () => {
                  const res = await DocumentPicker.pickSingle({
                    type: DocumentPicker.types.pdf,
                  });
                  setDocRes(res);
                }}
                style={{
                  marginTop: 14,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderColor:
                    showError && businessRegistered === 'YES' && !docRes
                      ? '#EB455F'
                      : '#B7C4CF',
                  borderWidth: 1.3,
                  borderStyle: 'dashed',
                  marginBottom: 8,
                  borderRadius: 4,
                  paddingHorizontal: 14,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    color:
                      showError && businessRegistered === 'YES' && !docRes
                        ? '#EB455F'
                        : 'rgba(25, 66, 216, 0.87)',
                    fontSize: 15,
                  }}>
                  {docRes && typeof docRes === 'object' && docRes.name
                    ? docRes.name
                    : docRes && typeof docRes === 'string' && docRes.length > 0
                    ? docRes
                    : docRes && typeof docRes === 'string' && docRes.length == 0
                    ? 'Upload'
                    : 'Upload'}
                </Text>
              </Pressable>
              {docRes && (
                <Pressable
                  onPress={() => {
                    setDocRes(null);
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderColor: '#ddd',
                    borderWidth: 1.3,
                    // borderStyle: 'dashed',
                    marginBottom: 14,
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: '#E0144C',
                      fontSize: 15,
                    }}>
                    Clear
                  </Text>
                </Pressable>
              )}
              <View style={{ marginVertical: 10 }} />
              <Input
                val={state.businessDocumentNumber}
                placeholder="Selected Business Document Number"
                showError={
                  showError &&
                  businessRegistered === 'YES' &&
                  state.businessDocumentNumber.length === 0
                }
                setVal={text =>
                  handleTextChange({
                    type: 'bDocumentNumber',
                    payload: text,
                  })
                }
              />
              {showError &&
                businessRegistered === 'YES' &&
                state.businessDocumentNumber.length === 0 && (
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      fontSize: 13.5,
                      color: '#EB455F',
                      marginBottom: 10,
                      marginTop: -3,
                    }}>
                    Please provide your business document number
                  </Text>
                )}
            </>
          )}
          <View style={{ marginVertical: 14 }} row>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#30475e',
                justifyContent: 'center',
                marginBottom: 10,
                fontSize: 14,
              }}>
              Does your business operate from a physical location?
            </Text>
            <RadioGroup
              initialValue={hasLocation}
              onValueChange={setHasLocation}>
              <RadioButton
                value={true}
                label={'Yes'}
                labelStyle={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 15,
                  color: '#567189',
                }}
                color="rgba(25, 66, 216, 0.87)"
              />
              <View style={{ marginVertical: 8 }} />
              <RadioButton
                value={false}
                label={'No'}
                labelStyle={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 15,
                  color: '#567189',
                }}
                color="rgba(25, 66, 216, 0.87)"
              />
            </RadioGroup>
          </View>
          {hasLocation && (
            <Pressable
              onPress={async () => {
                navigation.navigate('location');
              }}
              style={{
                marginTop: 14,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: '#B7C4CF',
                borderWidth: 0.9,
                // borderStyle: 'dashed',
                marginBottom: 8,
                borderRadius: 4,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color:
                    showError &&
                    hasLocation &&
                    state.location &&
                    typeof state.location.delivery_location === 'string' &&
                    state.location.delivery_location.length == 0
                      ? '#EB455F'
                      : 'rgba(25, 66, 216, 0.87)',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {state.location &&
                typeof state.location.delivery_location === 'string' &&
                state.location.delivery_location.length == 0
                  ? 'Physical Location of Business'
                  : state.location &&
                    state.location.delivery_location &&
                    state.location.delivery_location}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isMutating}
          handlePress={() => {
            console.log('has locationssss', hasLocation);
            console.log('has locationssss', businessRegistered);
            if (
              // !state.businessType ||
              state.BusinessName.length === 0 ||
              state.description.length === 0 ||
              state.businessContact.length === 0 ||
              !state.businessCategory ||
              state.businessCategory.label.length === 0
            ) {
              toast.show('Please provide the required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            if (businessRegistered === 'YES') {
              if (
                !state.businessType ||
                state.businessType.label.length === 0 ||
                !state.businessDocumentType ||
                state.businessDocumentType.label.length === 0 ||
                !docRes ||
                state.businessDocumentNumber.length === 0
              ) {
                toast.show('Please provide the required details', {
                  placement: 'top',
                  type: 'danger',
                });
                setShowError(true);
                return;
              }
            }

            if (hasLocation) {
              if (
                state.location &&
                typeof state.location.delivery_location === 'string' &&
                state.location.delivery_location.length == 0
              ) {
                toast.show('Please provide the required details', {
                  placement: 'top',
                  type: 'danger',
                });
                setShowError(true);
                return;
              }
            }
            const payload = {
              buss_name: state.BusinessName,
              buss_type: state.businessType && state.businessType.value,
              buss_category:
                state.businessCategory && state.businessCategory.value,
              buss_address:
                (state.location && state.location.delivery_location) || '',
              buss_address_gps:
                (state.location &&
                  state.location.delivery_gps.location.lat +
                    ',' +
                    state.location.delivery_gps.location.lng) ||
                '',
              buss_description: state.description,
              buss_phone: state.businessContact,
              buss_email: state.businessEmail,
              buss_website_url: state.BusinessSocial,
              buss_reg_no: state.businessDocumentNumber,
              buss_registered: businessRegistered,
              account_no: user.user_merchant_account,
              buss_has_outlet: hasLocation ? 'YES' : 'NO',
              buss_reg_id_type: state.businessDocumentType.value,
              outlet_address:
                (state.location && state.location.delivery_location) || '',
              outlet_gps:
                (state.location &&
                  state.location.delivery_gps.location.lat +
                    ',' +
                    state.location.delivery_gps.location.lng) ||
                '',
              // image_logo:
              //   state.BusinessLogo && typeof state.BusinessLogo === 'object'
              //     ? {
              //         name: state.BusinessLogo.fileName,
              //         type: state.BusinessLogo.type,
              //         uri:
              //           Platform.OS === 'android'
              //             ? state.BusinessLogo.uri
              //             : state.BusinessLogo.uri.replace('file://', ''),
              //       }
              //     : state.BusinessLogo && typeof state.BusinessLogo === 'string'
              //     ? state.BusinessLogo
              //     : '',
              // image_cert:
              //   docRes && typeof docRes === 'object'
              //     ? {
              //         name: docRes.name,
              //         type: docRes.type,
              //         uri:
              //           Platform.OS === 'android'
              //             ? docRes.uri
              //             : docRes.uri.replace('file://', ''),
              //       }
              //     : docRes && typeof docRes === 'string'
              //     ? docRes
              //     : '',
              // image_cert: docRes,
              source: 'MOBILE',
              mod_by: user.login,
              merchant_id: user.merchant,
            };
            if (state.BusinessLogo && typeof state.BusinessLogo === 'object') {
              payload.image_logo = {
                name: state.BusinessLogo.fileName,
                type: state.BusinessLogo.type,
                uri:
                  Platform.OS === 'android'
                    ? state.BusinessLogo.uri
                    : state.BusinessLogo.uri.replace('file://', ''),
              };
            } else if (
              state.BusinessLogo &&
              typeof state.BusinessLogo === 'string'
            ) {
              payload.buss_brand_logo = state.BusinessLogo;
            } else {
              payload.image_logo = '';
            }
            if (docRes && typeof docRes === 'object') {
              payload.image_cert = {
                name: docRes.name,
                type: docRes.type,
                uri:
                  Platform.OS === 'android'
                    ? docRes.uri
                    : docRes.uri.replace('file://', ''),
              };
            } else if (docRes && typeof docRes === 'string') {
              payload.buss_reg_cert = docRes;
            } else {
              payload.image_cert = '';
            }
            mutate(payload);
          }}>
          {isMutating ? 'Processing' : 'Save'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default BusinessInformation;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 10,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
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

  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 6,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
