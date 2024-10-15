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
import { useGetOutletCategories } from '../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';

import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { IndexPath, Menu, MenuItem } from '@ui-kitten/components';
import Scanner from '../../assets/icons/barscanner';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Loading from '../components/Loading';

import { TextInput } from 'react-native-paper';
// import { Switch } from 'react-native-ui-lib';

import PrimaryButton from '../components/PrimaryButton';
import { useAddCategoryProduct } from '../hooks/useAddCategoryProduct';
import Picker from '../components/Picker';
import AddImage from '../../assets/icons/add-image.svg';
import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { Switch } from '@rneui/themed';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import { DateTimePicker } from 'react-native-ui-lib';
import { useAddPersonalDetails } from '../hooks/useAddPersonalDetails';
import moment from 'moment';
import { useGetPreactiveState } from '../hooks/useGetPreactiveState';
import { useGetOnboardingRequirements } from '../hooks/useGetOnboardingRequirements';

export const Input = ({
  placeholder,
  val,
  setVal,
  nLines,
  showError,
  ...props
}) => {
  return (
    <TextInput
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#B7C4CF'}
      activeOutlineColor={showError ? '#EB455F' : '#1942D8'}
      outlineStyle={{
        borderWidth: 0.9,
        borderRadius: 4,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
    />
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'phone':
      return { ...state, phone: action.payload };
    case 'email':
      return { ...state, email: action.payload };
    case 'dob':
      return { ...state, dob: action.payload };
    case 'gender':
      return { ...state, gender: action.payload };
    case 'residential':
      return { ...state, residential: action.payload };
    case 'job':
      return { ...state, job: action.payload };
    case 'IdType':
      return { ...state, IdType: action.payload };
    case 'IdNumber':
      return { ...state, IdNumber: action.payload };
    case 'image':
      return { ...state, image: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

//  * Update Merchant Pre-active contact details for activation
//      * URL: {BASE_URL}/merchants/onboard/activate/contact
//      * @param: string $merchant_id
//      * @param: string $contact_person
//      * @param: string $contact_mobile
//      * @param: string $contact_dob
//      * @param: string $contact_gender
//      * @param: string $contact_email
//      * @param: string $contact_position
//      * @param: string $contact_id_type [INDIVIDUAL document]
//      * @param: string $contact_id_number
//      * @param: string $image_photo (uploaded customer Personal ID image (jpeg,png,gif)
const mapGenders = {
  MALE: 'Male',
  FEMALE: 'Female',
};

const PersonalInformation = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  const { data: outlets, isLoading: isOutletLoading } = useGetStoreOutlets(
    user.merchant,
  );
  const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [personalStatus, setPersonalStatus] = React.useState();
  const [applyTaxes, setApplyTaxes] = React.useState(true);
  const [saved, setSaved] = React.useState();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  const client = useQueryClient();
  const { mutate, isLoading: mutating } = useAddPersonalDetails(i => {
    client.invalidateQueries('current-activation-step');
    setPersonalStatus(i);
  });
  const { data: personal, isLoading: isPersonalLoading } = useGetPreactiveState(
    user.merchant,
  );

  const { data: requirements, isLoading: isRequirmentsLoading } =
    useGetOnboardingRequirements();

  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    residential: '',
    job: '',
    IdType: { label: '' },
    IdNumber: '',
    image: null,
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
    if (pData) {
      const dFormat =
        pData.merchant_contact_dob.length > 0
          ? pData.merchant_contact_dob.split('-')
          : '';
      dispatch({
        type: 'update_all',
        payload: {
          name: pData.merchant_contact,
          email: pData.merchant_email,
          phone: pData.merchant_phone,
          gender: {
            label: mapGenders[pData.merchant_contact_gender],
            value: mapGenders[pData.merchant_contact_gender],
            key: mapGenders[pData.merchant_contact_gender],
          },
          job: pData.merchant_contact_position,
          IdNumber: pData.merchant_contact_id_number,
          dob:
            dFormat.length > 0
              ? new Date(dFormat[0], dFormat[1] - 1, dFormat[2])
              : '',
          residential: pData.merchant_contact_address,
          IdType: {
            label: (
              (requirements &&
                requirements.data &&
                requirements.data.data &&
                requirements.data.data.personal_documents.find(
                  i => i.document_id === pData.merchant_contact_id_type,
                )) || { document_name: '' }
            ).document_name,
            value: pData.merchant_contact_id_type,
            key: pData.merchant_contact_id_type,
          },
          image: pData.merchant_contact_id_photo,
        },
      });
    }
  }, [pData, requirements]);

  console.log('personallllll', personalStatus);

  React.useEffect(() => {
    if (personalStatus) {
      if (personalStatus.status == 0) {
        toast.show(personalStatus.message, {
          placement: 'top',
          type: 'success',
        });
        navigation.navigate('Activation Type');
        setPersonalStatus(null);
      } else {
        toast.show(personalStatus.message, {
          placement: 'top',
          type: 'danger',
        });
      }
    }
  }, [navigation, personalStatus, toast]);

  if (isPersonalLoading || isRequirmentsLoading) {
    return <Loading />;
  }

  const genders =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.gender.map(i => {
      return {
        label: i,
        value: i,
        key: i,
      };
    });

  const idTypes =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.personal_documents.map(i => {
      return {
        label: i.document_name,
        value: i.document_id,
        key: i.document_id,
      };
    });

  return (
    <View>
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Full Name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Phone Number"
            val={state.phone}
            showError={showError && state.phone.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'phone',
                payload: text,
              })
            }
            keyboardType="phone-pad"
          />
          <Input
            placeholder="Email Address"
            val={state.email}
            setVal={text =>
              handleTextChange({
                type: 'email',
                payload: text,
              })
            }
          />
          <DateTimePicker
            title={''}
            placeholder={'Date of Birth'}
            mode={'date'}
            migrate
            showError={showError && state.dob.length === 0}
            value={state.dob}
            onChange={val => {
              handleTextChange({
                type: 'dob',
                payload: val,
              });
            }}
            style={{ marginTop: 16 }}
          />
          <Picker
            showError={
              (!state.gender ||
                (state.gender &&
                  (!state.gender.label || state.gender.label.length === 0))) &&
              showError
            }
            placeholder="Gender"
            value={state.gender}
            setValue={item => {
              handleTextChange({
                type: 'gender',
                payload: item,
              });
            }}>
            {genders.map(i => (
              <RNPicker.Item key={i.key} label={i.label} value={i.value} />
            ))}
          </Picker>
          <Input
            val={state.residential}
            placeholder="Residential Address or GhanaPost GPS Address of Residence"
            setVal={text =>
              handleTextChange({
                type: 'residential',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Position or Job Title"
            val={state.job}
            showError={showError && state.job.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'job',
                payload: text,
              })
            }
          />
          <Picker
            showError={state.IdType.label.length === 0 && showError}
            placeholder="Type of Photo ID"
            value={state.IdType}
            setValue={item => {
              handleTextChange({
                type: 'IdType',
                payload: item,
              });
            }}>
            {idTypes.map(i => (
              <RNPicker.Item key={i.key} label={i.label} value={i.value} />
            ))}
          </Picker>
          <View style={{ alignItems: 'center' }}>
            <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
              <MenuTrigger
                onPress={() => setOpenMenu(!openMenu)}
                children={
                  <View
                  // onPress={}
                  >
                    {!state.image && <AddImage height={100} width={100} />}
                    {state.image && typeof state.image === 'string' && (
                      <Image
                        style={{ height: 100, width: 100, borderRadius: 5 }}
                        source={{
                          uri:
                            'https://manage.ipaygh.com/xportal/content/resources/upload/doc/' +
                            state.image,
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
              style={{ padding: 5, marginVertical: 12 }}
              onPress={() => {
                dispatch({ type: 'image', payload: null });
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  color: showError && !state.image ? '#EB455F' : '#30475e',
                }}>
                Upload picture of your ID you selected
              </Text>
            </View>

            {state.image && (
              <Pressable
                style={{ padding: 5, marginTop: 4 }}
                onPress={() => {
                  dispatch({ type: 'image', payload: null });
                }}>
                <Text style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
                  Clear Image
                </Text>
              </Pressable>
            )}
          </View>
          <Input
            placeholder="ID Number"
            val={state.IdNumber}
            showError={showError && state.IdNumber.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'IdNumber',
                payload: text,
              })
            }
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={mutating}
          handlePress={() => {
            console.log(
              'statetetet---==',

              state.IdType.label.length === 0 && showError,
            );
            if (
              state.name.length === 0 ||
              state.phone.length === 0 ||
              // state.email ||
              // state.dob.length === 0 ||
              state.gender.length === 0 ||
              // state.residential ||
              state.job.length === 0 ||
              state.IdNumber.length === 0 ||
              state.IdType.label.length === 0 ||
              !state.image
            ) {
              setShowError(true);
              if (state.dob.length === 0) {
                toast.show('Please Enter Date of Birth', { placement: 'top' });
              }
              return;
            }

            mutate({
              merchant_id: user.merchant,
              contact_person: state.name,
              contact_mobile: state.phone,
              contact_dob: moment(state.dob).format('YYYY-MM-DD').toString(),
              contact_gender: state.gender.value,
              contact_email: state.email,
              contact_position: state.job,
              contact_id_type: state.IdType.value,
              contact_id_number: state.IdNumber,
              image_photo: state.image
                ? {
                    name: state.image.fileName,
                    type: state.image.type,
                    uri:
                      Platform.OS === 'android'
                        ? state.image.uri
                        : state.image.uri.replace('file://', ''),
                  }
                : null,
              mod_by: user.login,
              source: 'MOBILE',
            });
          }}>
          {mutating ? 'Processing' : 'Save'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default PersonalInformation;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 82,
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
