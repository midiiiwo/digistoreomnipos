/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput as RNTextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Checkbox } from 'react-native-ui-lib';

import Share from 'react-native-share';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import AddImage from '../../assets/icons/importImage.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import { CheckItem } from './ReceiptDetails';
import ColorModal from '../components/Modals/ColorModal';
import { useGetOnlineStoreDetails } from '../hooks/useGetOnlineStoreDetails';
import { useVerifyStoreAlias } from '../hooks/useVerifyStoreAlias';
import Loading from '../components/Loading';
import { useSetupStoreOrShortcode } from '../hooks/useSetupStoreOrShortcode';
import { useUpdateStoreOrShortcode } from '../hooks/useUpdateStoreOrShortcode';
import { useRemoveStoreOrLandingBanner } from '../hooks/useRemoveStoreOrLandingBanner';
import Bin from '../../assets/icons/delcross.svg';
import { useDeleteMerchantStore } from '../hooks/useDeleteMerchantStore';
import DeleteDialog from '../components/DeleteDialog';
import { useChangeStoreStatus } from '../hooks/useChangeStoreStatus';
import { useReplaceStoreBanner } from '../hooks/useReplaceStoreBanner';
import ShareIcon from '../../assets/icons/share.svg';
import Copy from '../../assets/icons/copy.svg';
import Clipboard from '@react-native-community/clipboard';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'url':
      return { ...state, url: action.payload };
    case 'banners':
      return { ...state, banners: action.payload };
    case 'activateLanding':
      return { ...state, activateLanding: action.payload };
    case 'landing_name':
      return { ...state, landingName: action.payload };
    case 'about_us_tagline':
      return { ...state, aboutUsTagline: action.payload };
    case 'about_us_description':
      return { ...state, aboutUsDescription: action.payload };
    case 'menu_tagline':
      return { ...state, menuTagline: action.payload };
    case 'color':
      return { ...state, color: action.payload };
    case 'facebook_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          facebook: Object.assign({}, state.socials.facebook, {
            check: !state.socials.facebook.check,
          }),
        }),
      };
    case 'facebook_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          facebook: Object.assign({}, state.socials.facebook, {
            handle: action.payload,
          }),
        }),
      };
    case 'instagram_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          instagram: Object.assign({}, state.socials.instagram, {
            check: !state.socials.instagram.check,
          }),
        }),
      };
    case 'instagram_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          instagram: Object.assign({}, state.socials.instagram, {
            handle: action.payload,
          }),
        }),
      };
    case 'linkedin_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          linkedIn: Object.assign({}, state.socials.linkedIn, {
            check: !state.socials.linkedIn.check,
          }),
        }),
      };
    case 'linkedin_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          linkedIn: Object.assign({}, state.socials.linkedIn, {
            handle: action.payload,
          }),
        }),
      };
    case 'twitter_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          twitter: Object.assign({}, state.socials.twitter, {
            check: !state.socials.twitter.check,
          }),
        }),
      };
    case 'twitter_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          twitter: Object.assign({}, state.socials.twitter, {
            handle: action.payload,
          }),
        }),
      };
    case 'whatsapp_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          whatsapp: Object.assign({}, state.socials.whatsapp, {
            check: !state.socials.whatsapp.check,
          }),
        }),
      };
    case 'whatsapp_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          whatsapp: Object.assign({}, state.socials.whatsapp, {
            handle: action.payload,
          }),
        }),
      };
    case 'youtube_check':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          youtube: Object.assign({}, state.socials.youtube, {
            check: !state.socials.youtube.check,
          }),
        }),
      };
    case 'youtube_handle':
      return {
        ...state,
        socials: Object.assign({}, state.socials, {
          youtube: Object.assign({}, state.socials.youtube, {
            handle: action.payload,
          }),
        }),
      };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const SocialCheck = ({
  social,
  check,
  setCheck,
  textInput,
  onChangeText,
  placeholder,
}) => {
  return (
    <View style={{ marginTop: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox value={check} onValueChange={setCheck} />
        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            color: '#091D60',
            marginLeft: 8,
            fontSize: 17,
          }}>
          {placeholder}
        </Text>
      </View>
      {check && (
        <Input
          val={textInput}
          setVal={onChangeText}
          placeholder="Enter Social Handle"
        />
      )}
    </View>
  );
};

const ManageStore = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [verifyAlias, setVerifyAlias] = React.useState();
  const [verify, setVerify] = React.useState(true);
  const [deleteStatus, setDeleteStatus] = React.useState();
  const imageUrlRef = React.useRef(new Date());

  const [state, dispatch] = React.useReducer(reducer, {
    id: '',
    name: '',
    description: '',
    url: '',
    banners: null,
    activateLanding: false,
    landingName: '',
    aboutUsTagline: '',
    aboutUsDescription: '',
    menuTagline: '',
    color: '#dddddd',
    status: '',
    storeDomain: '',
    socials: {
      facebook: {
        check: false,
        handle: '',
      },
      instagram: {
        check: false,
        handle: '',
      },
      linkedIn: {
        check: false,
        handle: '',
      },
      twitter: {
        check: false,
        handle: '',
      },
      whatsapp: {
        check: false,
        handle: '',
      },
      youtube: {
        check: false,
        handle: '',
      },
    },
  });
  const [landing, setLanding] = React.useState(true);
  const [openMenu, setOpenMenu] = React.useState(false);
  const toast = useToast();
  const [color, setColor] = React.useState('#dddddd');
  const [deleteStoreStatus, setDeleteStoreStatus] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const client = useQueryClient();
  const [status, setStatus] = React.useState();
  const [colorModal, setColorModal] = React.useState(false);
  const { data, isLoading } = useGetOnlineStoreDetails(user.merchant);
  console.log(user);

  const { refetch } = useVerifyStoreAlias(state.url, i => setVerifyAlias(i));
  const deleteImage = useRemoveStoreOrLandingBanner(i => {
    if (i) {
      setDeleteStatus(i);
      client.invalidateQueries('online-store');
    }
  });

  const replaceImage = useReplaceStoreBanner(i => {
    if (i) {
      if (i.status == 0) {
        client.invalidateQueries('online-store');
        // toast.show(i.message, { placement: 'top', type: 'success' });
      }
    }
  });

  const setupStore = useSetupStoreOrShortcode(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('online-store');
    }
  });

  const deleteStore = useDeleteMerchantStore(i => {
    if (i) {
      setDeleteStoreStatus(i);
      if (i.status == 0) {
        client.invalidateQueries('online-store');
      }
      toast.show(i.message, { placement: 'top' });
    }
  });

  const updateStore = useUpdateStoreOrShortcode(i => {
    if (i) {
      if (i.status == 0) {
        if (state.banners && typeof state.banners === 'object') {
          const storeDetails = data && data.data && data.data.data;
          replaceImage.mutate({
            id: state.id,
            type: 'BANNER',
            image:
              storeDetails && storeDetails.store_logo.length === 0
                ? 'NEW'
                : storeDetails.store_logo,
            new_image: state.banners
              ? {
                  name: state.banners.fileName,
                  type: state.banners.type,
                  uri:
                    Platform.OS === 'android'
                      ? state.banners.uri
                      : state.banners.uri.replace('file://', ''),
                }
              : '',
            mod_by: user.login,
          });
        }
        client.invalidateQueries('online-store');
        setSaved(i);
      }
    }
  });

  const changeStoreStatus = useChangeStoreStatus(i => {
    if (i) {
      setStatus(i);
    }
    if (i.status == 0) {
      toast.show(i.message, { placement: 'top' });
      client.invalidateQueries('shortcode');
      client.invalidateQueries('online-store');
    }
  });

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top', type: 'success' });
        navigation.goBack();
        setSaved(null);
        return;
      }
      toast.show(saved.message, { placement: 'top', type: 'danger' });
      setSaved(null);
    }
  }, [saved, toast, navigation]);

  React.useEffect(() => {
    if (deleteStoreStatus) {
      if (deleteStoreStatus.status == 0) {
        toast.show(deleteStoreStatus.message, {
          placement: 'top',
          type: 'success',
        });
        navigation.goBack();
        setDeleteStoreStatus(null);
        return;
      }
      toast.show(deleteStoreStatus.message, {
        placement: 'top',
        type: 'danger',
      });
      setDeleteStoreStatus(null);
    }
  }, [deleteStoreStatus, toast, navigation]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  // console.log('stateatta', user);

  React.useEffect(() => {
    const storeDetails = data && data.data && data.data.data;
    if (storeDetails && data && data.data && data.data.status == 0) {
      const storeSocials = {};
      for (let [key, value] of Object.entries(
        storeDetails.store_social_media || {},
      )) {
        storeSocials[key] = {
          check: value.length > 0,
          handle: value,
        };
      }

      dispatch({
        type: 'update_all',
        payload: {
          name: storeDetails.store_name,
          description: storeDetails.store_desc,
          url: storeDetails.store_code && storeDetails.store_code.toLowerCase(),
          landingName: storeDetails.store_landing_tag_line,
          aboutUsTagline: storeDetails.store_landing_about_tag,
          aboutUsDescription: storeDetails.store_landing_about_desc,
          color: storeDetails.store_landing_color_code,
          activateLanding: storeDetails.store_has_landing_page === 'YES',
          menuTagline: storeDetails.store_landing_product_tag,
          banners: storeDetails.store_logos,
          socials: Object.assign({}, state.socials, storeSocials),
          id: storeDetails.store_id,
          status: storeDetails.store_status,
          storeDomain: storeDetails.store_domain,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    if (verifyAlias) {
      if (verifyAlias.status == 0) {
        // toast.show(verifyStatus.message, { placement: 'top', type: 'success' });
        setVerify(true);
      } else {
        setVerify(false);
        // toast.show(verifyAlias.message, { placement: 'top', type: 'danger' });
      }
      // setVerifyAlias(null);
    }
  }, [data, toast, verifyAlias]);

  if (isLoading) {
    return <Loading />;
  }

  console.log('statataatatt', state.status);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <View
          style={{
            paddingHorizontal: 22,
            marginBottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Semibold',
              fontSize: 24,
              color: '#002',
            }}>
            Setup Online Store
          </Text>
          {state.status && state.status.length > 0 && (
            <View style={[styles.statusWrapper, { marginLeft: 'auto' }]}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      state.status === 'INACTIVE' ? '#FD8A8A' : '#87C4C9',
                  },
                ]}
              />
              <Text style={styles.orderStatus}>
                {/* {item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED'
                    ? 'Paid'
                    : 'Unpaid'} */}
                {state.status === 'ACTIVE' ? 'Online' : 'Offline'}
              </Text>
            </View>
          )}
        </View>
        {state.storeDomain.length > 0 && (
          <View>
            {/* <View style={{ backgroundColor: '#E7F1FF' }}>
            <Text>buy.digistoreafrica.com/hansahstore</Text>
          </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingLeft: 16,
                marginTop: 14,
              }}>
              <Pressable
                onPress={async () => {
                  await Share.open({
                    title: 'Share Blog',
                    url: state.storeDomain,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(231, 241, 255, 0.7)',
                  paddingVertical: 12,
                  paddingHorizontal: Dimensions.get('window').width * 0.035,
                  borderRadius: 24,
                  marginHorizontal: 4,
                  paddingLeft: Dimensions.get('window').width * 0.03,
                }}>
                <ShareIcon
                  stroke="#1D73FF"
                  height={26}
                  width={26}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    color: '#1D73FF',
                    fontSize: 16.5,
                  }}>
                  Share Link
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Clipboard.setString(state.storeDomain);
                  toast.show('Store link copied', { placement: 'top' });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(231, 241, 255, 0.7)',
                  paddingVertical: 6,
                  paddingHorizontal: Dimensions.get('window').width * 0.035,
                  borderRadius: 24,
                  marginHorizontal: 4,
                }}>
                <Copy
                  stroke="#1D73FF"
                  height={18}
                  width={18}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    color: '#1D73FF',
                    fontSize: 16.5,
                  }}>
                  Copy Link
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.main}
          contentContainerStyle={{ paddingBottom: 12 }}>
          <Input
            placeholder="Store Name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text => {
              handleTextChange({
                type: 'name',
                payload: text,
              });
              handleTextChange({
                type: 'url',
                payload: text.replace(/ /g, '').toLowerCase(),
              });
            }}
          />
          <Input
            placeholder="Store Description"
            val={state.description}
            setVal={text =>
              handleTextChange({
                type: 'description',
                payload: text,
              })
            }
            nLines={3}
            showError={state.description.length === 0 && showError}
          />
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 16,
                color: '#091D60',
              }}>
              Store URL
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 60,
                borderColor:
                  state.url.length === 0 && showError ? '#EB455F' : '#B7C4CF',
                borderWidth: 1.6,
                borderRadius: 5,
                marginTop: 6,
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(236, 242, 255, 0.8)',
                  justifyContent: 'center',
                  paddingHorizontal: 8,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  // borderRightColor: '#30475e',
                  // borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 17,
                    color: '#091D60',
                  }}>
                  https://buy.digistoreafrica.com/
                </Text>
              </View>
              <RNTextInput
                value={state.url}
                style={{
                  flex: 1,
                  color: '#30475e',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 17,
                  // paddingTop: 15,
                  paddingLeft: 8,
                }}
                autoCapitalize="none"
                cursorColor="#6DA9E4"
                onEndEditing={e => {
                  if (e.nativeEvent.text.length > 0) {
                    refetch();
                  }
                }}
                onChangeText={val =>
                  handleTextChange({
                    type: 'url',
                    payload: val.replace(/ /g, '').toLowerCase(),
                  })
                }
              />
            </View>
            {verifyAlias && (
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 13,
                  color: verifyAlias.status == 0 ? '#47B749' : '#FD8A8A',
                  marginTop: 6,
                }}>
                {verifyAlias.message}
              </Text>
            )}
          </View>
          <View style={{ marginTop: 22 }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 16,
                color: '#091D60',
                marginBottom: 6,
              }}>
              Store Banners (Optional) - Max 1 image (1080 x 300)
            </Text>
            {/* <Text
              style={{
                fontFamily: 'SFPro Display-Regular',
                fontSize: 13,
                color: '#091D60',
                marginBottom: 6,
              }}>
              Minimum Size: 1080 x 300
            </Text> */}
            <Pressable
              onPress={async () => {
                // const response = await openPicker({
                //   multiple: true,
                //   maxSelectedAssets: 3,
                //   mediaType: 'image',
                // });
                const result = await launchImageLibrary({
                  mediaType: 'photo',
                  quality: 0.6,
                });
                handleTextChange({
                  type: 'banners',
                  payload: result.assets[0],
                });
              }}>
              {!state.banners && (
                <View
                  style={{
                    width: '100%',
                    height: Dimensions.get('window').height * 0.3,
                    flex: 1,
                    borderRadius: 6,
                    borderColor: '#ACB1D6',
                    borderWidth: 1.2,
                    borderStyle: 'dashed',
                    backgroundColor: 'rgba(236, 242, 255, 0.8)',
                  }}>
                  <AddImage
                    height={35}
                    width={35}
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                </View>
              )}
              {state.banners &&
                state.banners.length === 1 &&
                state.banners[0].length === 0 && (
                  <View
                    style={{
                      width: '100%',
                      height: Dimensions.get('window').height * 0.3,
                      flex: 1,
                      borderRadius: 6,
                      borderColor: '#ACB1D6',
                      borderWidth: 1.2,
                      borderStyle: 'dashed',
                      backgroundColor: 'rgba(236, 242, 255, 0.8)',
                    }}>
                    <AddImage
                      height={35}
                      width={35}
                      style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                    />
                  </View>
                )}
              {state.banners && !Array.isArray(state.banners) && (
                <Image
                  style={{
                    height: Dimensions.get('window').height * 0.18,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  source={{ uri: state.banners.uri }}
                />
              )}
              {state.banners &&
                Array.isArray(state.banners) &&
                !(
                  state.banners.length === 1 && state.banners[0].length === 0
                ) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      height: Dimensions.get('window').height * 0.3,
                    }}>
                    {state.banners &&
                      state.banners.map((i, idx) => {
                        if (!i) {
                          return;
                        }
                        const uri =
                          i.path ||
                          'https://payments.ipaygh.com/app/webroot/img/stores/' +
                            i +
                            '?' +
                            imageUrlRef.current;
                        return (
                          <View style={{ flex: 1 }}>
                            {!i.path && (
                              <Pressable
                                style={{
                                  padding: 4,
                                  position: 'absolute',
                                  right: 4,
                                  top: 4,
                                  zIndex: 100,
                                  backgroundColor: '#fff',
                                  borderRadius: 100,
                                }}
                                onPress={() => {
                                  if (!i.path && state.id) {
                                    deleteImage.mutate({
                                      id: state.id,
                                      image: i,
                                      type: 'BANNER',
                                      mod_by: user.login,
                                    });
                                  }
                                }}>
                                <Bin style={{ height: 7, width: 7 }} />
                              </Pressable>
                            )}
                            <Image
                              key={uri}
                              source={{
                                uri,
                              }}
                              style={{
                                flex: 1,
                                height: '100%',
                                borderRightWidth:
                                  idx !== state.banners.length - 1 ? 1 : 0,
                                borderRightColor: '#fff',
                              }}
                            />
                          </View>
                        );
                      })}
                  </View>
                )}
            </Pressable>

            {state.image && (
              <Pressable
                style={{ padding: 5, marginTop: 12 }}
                onPress={() => {
                  dispatch({ type: 'banners', payload: null });
                }}>
                <Text style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
                  Clear Image
                </Text>
              </Pressable>
            )}
          </View>
          <View style={{ marginTop: 10 }} />
          {user.user_permissions.includes('MGSHOPLNPG') && (
            <>
              {data && data.data && data.data.status == 0 && (
                <CheckItem
                  placeholder="Activate Store Landing Page"
                  value={state.activateLanding}
                  onValueChange={() => {
                    handleTextChange({
                      type: 'activateLanding',
                      payload: !state.activateLanding,
                    });
                  }}
                  showBorder={false}
                />
              )}
              {state.activateLanding && (
                <View>
                  <Input
                    placeholder="Landing Page Main Tagline"
                    showError={showError && state.name.length === 0}
                    val={state.landingName}
                    setVal={text =>
                      handleTextChange({
                        type: 'customer_name',
                        payload: text,
                      })
                    }
                  />
                  <Input
                    placeholder="About Us Tagline"
                    showError={showError && state.name.length === 0}
                    val={state.aboutUsTagline}
                    setVal={text =>
                      handleTextChange({
                        type: 'customer_name',
                        payload: text,
                      })
                    }
                  />
                  <Input
                    placeholder="About Us Description"
                    showError={showError && state.name.length === 0}
                    val={state.aboutUsDescription}
                    setVal={text =>
                      handleTextChange({
                        type: 'customer_name',
                        payload: text,
                      })
                    }
                    nLines={4}
                  />
                  <Input
                    placeholder="Product Menu Tagline"
                    showError={showError && state.name.length === 0}
                    val={state.menuTagline}
                    setVal={text =>
                      handleTextChange({
                        type: 'customer_name',
                        payload: text,
                      })
                    }
                  />
                  <View style={{ marginTop: 12 }}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        fontSize: 16,
                        color: '#30475e',
                      }}>
                      Define Color Code for your Landing Page
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: 48,
                        borderColor: '#B7C4CF',
                        borderWidth: 1.6,
                        borderRadius: 5,
                        marginTop: 6,
                      }}>
                      <Pressable
                        onPress={() => {
                          setColorModal(true);
                        }}
                        style={{
                          backgroundColor: state.color,
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          borderTopLeftRadius: 5,
                          borderBottomLeftRadius: 5,
                          // borderRightColor: '#30475e',
                          // borderRightWidth: 1
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 13,
                            color: '#30475e',
                          }}>
                          Click to Pick Color
                        </Text>
                      </Pressable>
                      <RNTextInput
                        style={{
                          flex: 1,
                          color: '#30475e',
                          fontFamily: 'SFProDisplay-Medium',
                          fontSize: 14,
                          // paddingTop: 15,
                          paddingLeft: 14,
                        }}
                        cursorColor="#6DA9E4"
                        value={state.color}
                        onChangeText={val => setColor(val)}
                      />
                    </View>
                  </View>
                  <View style={{ marginTop: 18 }}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        fontSize: 16,
                        color: '#30475e',
                        marginBottom: 6,
                      }}>
                      Landing Page About Us Section Image (Optional)
                    </Text>
                    <View
                    // onPress={}
                    >
                      {!state.image && (
                        <View
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').height * 0.3,
                            flex: 1,
                            borderRadius: 6,
                            borderColor: '#ACB1D6',
                            borderWidth: 1.2,
                            borderStyle: 'dashed',
                            backgroundColor: 'rgba(236, 242, 255, 0.8)',
                          }}>
                          <AddImage
                            height={35}
                            width={35}
                            style={{
                              marginTop: 'auto',
                              marginBottom: 'auto',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                          />
                        </View>
                      )}
                      {state.image && (
                        <Image
                          style={{ height: 100, width: 100, borderRadius: 5 }}
                          source={{ uri: state.image.uri }}
                        />
                      )}
                    </View>

                    {state.image && (
                      <Pressable
                        style={{ padding: 5, marginTop: 12 }}
                        onPress={() => {
                          dispatch({ type: 'image', payload: null });
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Inter-Medium',
                            color: '#E0144C',
                          }}>
                          Clear Image
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <ColorModal
                    dialog={colorModal}
                    setDialog={setColorModal}
                    setColor={colorHex =>
                      handleTextChange({
                        type: 'color',
                        payload: colorHex,
                      })
                    }
                    color={color}
                  />
                </View>
              )}
            </>
          )}

          <View>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#091D60',
                paddingVertical: 8,
                marginTop: 12,
                fontSize: 16,
              }}>
              Add your Social Media Handles
            </Text>
            <SocialCheck
              check={state.socials.facebook.check}
              setCheck={() =>
                handleTextChange({
                  type: 'facebook_check',
                })
              }
              textInput={state.socials.facebook.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'facebook_handle',
                  payload: val,
                })
              }
              placeholder="Facebook"
            />
            <SocialCheck
              check={state.socials.instagram.check}
              setCheck={() =>
                handleTextChange({
                  type: 'instagram_check',
                })
              }
              textInput={state.socials.instagram.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'instagram_handle',
                  payload: val,
                })
              }
              placeholder="Instagram"
            />
            <SocialCheck
              check={state.socials.linkedIn.check}
              setCheck={() =>
                handleTextChange({
                  type: 'linkedin_check',
                })
              }
              textInput={state.socials.linkedIn.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'linkedin_handle',
                  payload: val,
                })
              }
              placeholder="LinkedIn"
            />
            <SocialCheck
              check={state.socials.twitter.check}
              setCheck={() =>
                handleTextChange({
                  type: 'twitter_check',
                })
              }
              textInput={state.socials.twitter.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'twitter_handle',
                  payload: val,
                })
              }
              placeholder="Twitter"
            />
            <SocialCheck
              check={state.socials.whatsapp.check}
              setCheck={() =>
                handleTextChange({
                  type: 'whatsapp_check',
                })
              }
              textInput={state.socials.whatsapp.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'whatsapp_handle',
                  payload: val,
                })
              }
              placeholder="WhatsApp"
            />
            <SocialCheck
              check={state.socials.youtube.check}
              setCheck={() =>
                handleTextChange({
                  type: 'youtube_check',
                })
              }
              textInput={state.socials.youtube.handle}
              onChangeText={val =>
                handleTextChange({
                  type: 'youtube_handle',
                  payload: val,
                })
              }
              placeholder="YouTube"
            />
          </View>
          {state.id && state.id.length > 0 && (
            <View style={{ marginTop: 14 }}>
              <PrimaryButton
                style={[
                  styles.btn,
                  {
                    backgroundColor: 'rgba(255, 100, 100, 0.15)',
                    width: '100%',
                    borderColor: 'rgba(255, 100, 100, 1)',
                    borderWidth: 1,
                  },
                ]}
                disabled={deleteStore.isLoading}
                handlePress={() => {
                  setVisible(true);
                }}>
                <Text style={{ color: 'rgba(255, 100, 100, 1)' }}>
                  {deleteStore.isLoading ? 'Processing' : 'Delete Store'}
                </Text>
              </PrimaryButton>
            </View>
          )}
        </ScrollView>
      </View>
      <View style={[styles.btnWrapper, { flexDirection: 'row' }]}>
        <PrimaryButton
          style={styles.btn}
          disabled={setupStore.isLoading || updateStore.isLoading}
          handlePress={() => {
            if (
              state.name.length === 0 ||
              state.description.length === 0 ||
              state.url.length === 0
            ) {
              setShowError(true);
              toast.show('Some details missing', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }

            const socialMedia = {};
            for (let [key, value] of Object.entries(state.socials)) {
              if (value.check) {
                socialMedia[key] = value.handle;
              }
            }
            // const bannerFiles = (state.banners || []).map(i => {
            //   if (!i) {
            //     return;
            //   }

            //   return {
            //     name: i.fileName,
            //     type: i.mime,
            //     uri:
            //       Platform.OS === 'android'
            //         ? i.path
            //         : i.path.replace('file://', ''),
            //   };
            // });
            if (data && data.data && data.data.status == 0) {
              // const firstBanner = state.banners[0];
              const payload = {
                id: state.id,
                name: state.name,
                desc: state.description,
                type: 'ONLINE',
                code: state.url,
                store_source: user.user_merchant_type,
                mod_by: user.login,
                merchant: user.merchant,
                social_media: JSON.stringify(socialMedia),

                // image_store: state.banners
                //   ? {
                //       name: firstBanner.fileName,
                //       type: firstBanner.mime,
                //       uri:
                //         Platform.OS === 'android'
                //           ? firstBanner.realPath
                //           : firstBanner.realPath.replace('file://', ''),
                //     }
                //   : '',
                has_Lpage: state.activateLanding ? 'YES' : 'NO',
                number: '',
              };
              if (state.activateLanding) {
                payload.lpage_tag = '';
                payload.lpage_color = state.color;
                payload.lpage_abt_tag = state.aboutUsTagline;
                payload.lpage_menu_tag = state.menuTagline;
                payload.lpage_abt_desc = state.aboutUsDescription;
              }
              updateStore.mutate(payload);
            } else if (data && data.data && data.data.status != 0) {
              const payload = {
                name: state.name,
                desc: state.description,
                type: 'ONLINE',
                code: state.url,
                store_source: user.user_merchant_type,
                mod_by: user.login,
                merchant: user.merchant,
                social_media: JSON.stringify(socialMedia),
                has_lpage: state.activateLanding ? 'YES' : 'NO',
                number: '',
                image_store: state.banners
                  ? {
                      name: state.banners.fileName,
                      type: state.banners.type,
                      uri:
                        Platform.OS === 'android'
                          ? state.banners.uri
                          : state.banners.uri.replace('file://', ''),
                    }
                  : '',
              };
              if (state.activateLanding) {
                payload.lpage_tag = '';
                payload.lpage_color = state.color;
                payload.lpage_abt_tag = state.aboutUsTagline;
                payload.lpage_menu_tag = state.menuTagline;
                payload.lpage_abt_desc = state.aboutUsDescription;
              }

              console.log('payyyyyyyyyy', payload);
              setupStore.mutate(payload);
            }
          }}>
          {setupStore.isLoading || updateStore.isLoading
            ? 'Processing'
            : data && data.data && data.data.status == 0
            ? 'Update Store'
            : 'Save Store'}
        </PrimaryButton>
        <View style={{ marginHorizontal: 3 }} />
        {state.status && state.status.length > 0 && (
          <PrimaryButton
            style={[
              styles.btn,
              {
                backgroundColor:
                  state.status === 'ACTIVE' ? '#FF6464' : '#47B749',
              },
            ]}
            disabled={changeStoreStatus.isLoading}
            handlePress={() => {
              changeStoreStatus.mutate({
                id: state.id,
                status: state.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                mod_by: user.login,
              });
            }}>
            {changeStoreStatus.isLoading
              ? 'Processing'
              : state.status === 'ACTIVE'
              ? 'Take Offline'
              : 'Take Online'}
          </PrimaryButton>
        )}
      </View>
      <DeleteDialog
        handleCancel={() => setVisible(false)}
        handleSuccess={() => {
          if (!state.id && state.id.length === 0) {
            toast.show('Store not setup yet', {
              placement: 'top',
              type: 'danger',
            });
            setVisible(false);
            return;
          }
          deleteStore.mutate({
            id: state.id,
          });
        }}
        visible={visible}
        prompt="This process is irreversible"
        title="Are you sure you want to delete store?"
      />
    </View>
  );
};

export default ManageStore;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 12,
    backgroundColor: '#fff',
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14.6,
    backgroundColor: '#fff',
    color: '#091D60',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    paddingHorizontal: 12,
  },
  btn: {
    borderRadius: 4,
    flex: 1,
  },
  dWrapper: {
    paddingTop: 12,
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 6,
    backgroundColor: '#87C4C9',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingRight: 13,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  orderStatus: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475e',
    fontSize: 18.5,
  },
});
