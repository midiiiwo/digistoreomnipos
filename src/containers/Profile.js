/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import Image from 'react-native-fast-image';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import AddImage from '../../assets/icons/add-image.svg';
import Loading from '../components/Loading';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'description':
      return { ...state, description: action.payload };
    case 'email':
      return { ...state, email: action.payload };
    case 'phone':
      return { ...state, phone: action.payload };
    case 'image':
      return { ...state, image: action.payload };
    case 'address':
      return { ...state, address: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const Profile = ({ route }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const navigation = useNavigation();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    address: null,
    description: '',
    phone: '',
    email: '',
    image: null,
  });
  const {
    data: details,
    isLoading: isDetailsLoading,
    refetch,
  } = useGetMerchantDetails(user.merchant);
  const toast = useToast();
  const client = useQueryClient();
  const imageRef = React.useRef(new Date());

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutate, isLoading } = useUpdateProfile(async i => {
    if (i) {
      setSaved(i);
      client.invalidateQueries('merchant-details');
      imageRef.current = new Date();
    }
  });

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top', type: 'success' });
      } else {
        toast.show(saved.message, { placement: 'top', type: 'danger' });
      }
      setSaved(null);
    }
  }, [toast, saved]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  // const pData = data && data.data && data.data.data;
  const merchantDetails = details && details.data && details.data.data;

  React.useEffect(() => {
    if (merchantDetails) {
      // console.log('pddddd', merchantDetails);
      dispatch({
        type: 'update_all',
        payload: {
          phone: merchantDetails.merchant_phone,
          email: merchantDetails.merchant_email,
          description: merchantDetails.merchant_business_desc,
          image: merchantDetails.merchant_brand_logo,
          address: merchantDetails.merchant_address,
        },
      });
    }
  }, [merchantDetails]);

  React.useEffect(() => {
    if (route && route.params) {
      if (route.params.prev_screen == 'profile_location') {
        dispatch({
          type: 'address',
          payload: route.params.location,
        });
      }
    }
  }, [route]);

  if (isDetailsLoading) {
    return <Loading />;
  }

  console.log('stateteatate', typeof state.image);

  const remoteImage =
    'https://payments.ipaygh.com/app/webroot/img/logo/' +
    state.image +
    '?' +
    imageRef.current;

  console.log('fsdgsgsgsg', remoteImage);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <View style={{ alignItems: 'center' }}>
            <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
              <MenuTrigger
                onPress={() => setOpenMenu(!openMenu)}
                children={
                  <View
                  // onPress={}
                  >
                    {(!state.image ||
                      (state.image && state.image.length === 0)) && (
                      <AddImage height={100} width={100} />
                    )}
                    {state.image && typeof state.image === 'string' && (
                      <Image
                        style={{ height: 100, width: 100, borderRadius: 5 }}
                        source={{
                          uri: remoteImage,
                        }}
                      />
                    )}
                    {state.image && typeof state.image === 'object' && (
                      <Image
                        style={{ height: 100, width: 100, borderRadius: 5 }}
                        source={{ uri: state.image.uri }}
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
                    try {
                      let granted;
                      if (Platform.OS === 'android') {
                        granted = await PermissionsAndroid.request(
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
                        console.log('andandad');
                      } else if (Platform.OS === 'ios') {
                        granted = await request(PERMISSIONS.IOS.CAMERA);
                        console.log('ggagagaggag', granted);
                        if (granted === RESULTS.GRANTED) {
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
                      }
                    } catch (error) {
                      console.error('=>>>>>>>>>>>>>>>>,', error);
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
                    });
                    if (result) {
                      dispatch({
                        type: 'image',
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
              style={{ padding: 5, marginTop: 12 }}
              onPress={() => {
                dispatch({ type: 'image', payload: null });
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  color: '#30475e',
                }}>
                Upload/Change Business Logo
              </Text>
            </View>

            {/* {state.image && (
              <Pressable
                style={{ padding: 5, marginBottom: 4 }}
                onPress={() => {
                  dispatch({ type: 'image', payload: null });
                }}>
                <Text style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
                  Clear Image
                </Text>
              </Pressable>
            )} */}
          </View>
          <Input
            placeholder="Business Description"
            val={state.description}
            setVal={text =>
              handleTextChange({
                type: 'description',
                payload: text,
              })
            }
            nLines={3}
          />
          <Input
            placeholder="Business Email"
            val={state.email}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'email',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Business Phone"
            val={state.phone}
            keyboardType="phone-pad"
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'phone',
                payload: text,
              })
            }
          />
          <Pressable
            onPress={async () => {
              navigation.navigate('Profile Location');
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
                fontFamily: 'SFProDisplay-Semibold',
                color: 'rgba(25, 66, 216, 0.87)',
                fontSize: 15,
                textAlign: 'center',
              }}>
              {!state.address
                ? 'Physical Location of Business'
                : typeof state.address === 'string'
                ? state.address
                : state.address.delivery_location}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLoading}
          handlePress={() => {
            // console.log(state);
            // if (
            //   state.name.length === 0 ||
            //   !state.role ||
            //   state.phone.length === 0 ||
            //   state.username.length === 0 ||
            //   !verify
            // ) {
            //   setShowError(true);
            //   return;
            // }

            const payload = {
              merchant_id: user.merchant,
              buss_address:
                typeof state.address === 'string'
                  ? state.address
                  : typeof state.address === 'object'
                  ? state.address.delivery_location
                  : '',
              buss_description: state.description,
              buss_phone: state.phone,
              buss_email: state.email,
              image_logo:
                state.image && typeof state.image === 'object'
                  ? {
                      name: state.image.fileName,
                      type: state.image.type,
                      uri:
                        Platform.OS === 'android'
                          ? state.image.uri
                          : state.image.uri.replace('file://', ''),
                    }
                  : state.image && typeof state.image === 'string'
                  ? state.image
                  : '',
              mod_by: user.login,
            };
            console.log('pppppppppp', payload);
            mutate(payload);
          }}>
          {isLoading ? 'Processing' : 'Save Profile'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default Profile;
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
  dWrapper: {
    paddingTop: 12,
  },
});
