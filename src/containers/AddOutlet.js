/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {
  Checkbox,
  DateTimePicker,
  Picker as RNPicker,
} from 'react-native-ui-lib';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useAddOutlet } from '../hooks/useAddOutlet';
import { CheckItem } from './ReceiptDetails';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

import AddImage from '../../assets/icons/add-image.svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';

const mapDaytoCode = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

export const WorkingTimeCheck = ({
  onValueChange,
  value,
  placeholder,
  onStartTimeChange,
  onEndTimeChange,
  dateValue,
}) => {
  return (
    <View
      // onPress={onValueChange}
      style={{
        flexDirection: 'row',
        // borderBottomColor: '#ddd',
        // borderBottomWidth: 0.7,
        // borderTopColor: '#ddd',
        // borderTopWidth: 0.7,
        marginVertical: 4,
        alignItems: 'flex-start',
      }}>
      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        <Checkbox
          value={value}
          onValueChange={onValueChange}
          color="rgba(25, 66, 216, 0.9)"
          style={{
            color: '#204391',
            // alignSelf: 'center',
            marginRight: 10,
          }}

          // label="By clicking to create an account, you agree to iPay's Terms of Use
          // and Privacy Policy"
        />
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            color: '#30475e',
            fontSize: 17,
          }}>
          {placeholder}
        </Text>
      </View>
      <View
        style={{
          marginLeft: 'auto',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <DateTimePicker
          title="Open"
          mode="time"
          onChange={i => {
            const time = i.toLocaleTimeString();
            const digits = time.slice(0, -6);
            const amPM = time.slice(-2);
            onStartTimeChange(digits + ' ' + amPM);
          }}
          editable={value}
          value={dateValue}
        />
        <View style={{ marginHorizontal: 8 }} />
        <DateTimePicker
          title="Close"
          mode="time"
          onChange={i => {
            const time = i.toLocaleTimeString();
            const digits = time.slice(0, -6);
            const amPM = time.slice(-2);
            onEndTimeChange(digits + ' ' + amPM);
          }}
          editable={value}
          value={dateValue}
        />
      </View>
    </View>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'contact':
      return { ...state, contact: action.payload };
    case 'notify_contact':
      return { ...state, notify: action.payload };
    case 'image':
      return { ...state, image: action.payload };
    case 'location':
      return { ...state, location: action.payload };
    case 'set_worktime':
      return { ...state, set_worktime: action.payload };
    case 'monday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          monday: Object.assign({}, state.worktime.monday, {
            status: action.payload,
          }),
        }),
      });
    case 'tuesday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          tuesday: Object.assign({}, state.worktime.tuesday, {
            status: action.payload,
          }),
        }),
      });
    case 'wednesday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          wednesday: Object.assign({}, state.worktime.wednesday, {
            status: action.payload,
          }),
        }),
      });
    case 'thursday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          thursday: Object.assign({}, state.worktime.thursday, {
            status: action.payload,
          }),
        }),
      });
    case 'friday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          friday: Object.assign({}, state.worktime.friday, {
            status: action.payload,
          }),
        }),
      });
    case 'saturday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          saturday: Object.assign({}, state.worktime.saturday, {
            status: action.payload,
          }),
        }),
      });
    case 'sunday_status':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          sunday: Object.assign({}, state.worktime.sunday, {
            status: action.payload,
          }),
        }),
      });

    case 'monday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          monday: Object.assign({}, state.worktime.monday, {
            start: action.payload,
          }),
        }),
      });
    case 'tuesday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          tuesday: Object.assign({}, state.worktime.tuesday, {
            start: action.payload,
          }),
        }),
      });
    case 'wednesday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          wednesday: Object.assign({}, state.worktime.wednesday, {
            start: action.payload,
          }),
        }),
      });
    case 'thursday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          thursday: Object.assign({}, state.worktime.thursday, {
            start: action.payload,
          }),
        }),
      });
    case 'friday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          friday: Object.assign({}, state.worktime.friday, {
            start: action.payload,
          }),
        }),
      });
    case 'saturday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          saturday: Object.assign({}, state.worktime.saturday, {
            start: action.payload,
          }),
        }),
      });
    case 'sunday_start':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          sunday: Object.assign({}, state.worktime.sunday, {
            start: action.payload,
          }),
        }),
      });

    case 'monday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          monday: Object.assign({}, state.worktime.monday, {
            end: action.payload,
          }),
        }),
      });
    case 'tuesday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          tuesday: Object.assign({}, state.worktime.tuesday, {
            end: action.payload,
          }),
        }),
      });
    case 'wednesday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          wednesday: Object.assign({}, state.worktime.wednesday, {
            end: action.payload,
          }),
        }),
      });
    case 'thursday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          thursday: Object.assign({}, state.worktime.thursday, {
            end: action.payload,
          }),
        }),
      });
    case 'friday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          friday: Object.assign({}, state.worktime.friday, {
            end: action.payload,
          }),
        }),
      });
    case 'saturday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          saturday: Object.assign({}, state.worktime.saturday, {
            end: action.payload,
          }),
        }),
      });
    case 'sunday_end':
      return Object.assign({}, state, {
        worktime: Object.assign({}, state.worktime, {
          sunday: Object.assign({}, state.worktime.sunday, {
            end: action.payload,
          }),
        }),
      });
    default:
      return state;
  }
};

const AddOutlet = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [taxStatus, setTaxStatus] = React.useState(false);
  const [verifyStatus, setVerifyStatus] = React.useState();
  const [usernameStatus, setUsernameStatus] = React.useState();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    id: '',
    name: '',
    contact: '',
    notify: '',
    source: 'MOBILE',
    image: '',
    set_worktime: false,
    worktime: {
      monday: {
        status: false,
        start: '',
        end: '',
      },
      tuesday: {
        status: false,
        start: '',
        end: '',
      },
      wednesday: {
        status: false,
        start: '',
        end: '',
      },
      thursday: {
        status: false,
        start: '',
        end: '',
      },
      friday: {
        status: false,
        start: '',
        end: '',
      },
      saturday: {
        status: false,
        start: '',
        end: '',
      },
      sunday: {
        status: false,
        start: '',
        end: '',
      },
    },
    location: null,
  });
  const toast = useToast();
  const client = useQueryClient();

  // useGetMerchantUserOutlets(user.merchant, item.user_id);

  const { mutate, isLoading } = useAddOutlet(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('outlet-lov');
      client.invalidateQueries('merchant-outlets');
    }
  });

  console.log('svvvvvvvvvvvvvvvvv', state);

  // console.log(
  //   'cccccccc==========================',
  //   state.worktime.tuesday.status,
  // );

  React.useEffect(() => {
    if (route && route.params) {
      if (route.params.prev_screen == 'location') {
        dispatch({
          type: 'location',
          payload: route.params.location,
        });
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, {
          placement: 'top',
          type: 'success',
        });
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
                    {!state.image && <AddImage height={100} width={100} />}
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
                          quality: 0.6,
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
                      quality: 0.6,
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

            <View style={{ padding: 5, marginVertical: 12 }}>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#567189',
                  fontSize: 17,
                }}>
                Upload Outlet Image
              </Text>
            </View>

            {state.image && (
              <Pressable
                style={{ padding: 5, marginTop: 0 }}
                onPress={() => {
                  dispatch({ type: 'image', payload: null });
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
            placeholder="Enter Outlet Name"
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
            placeholder="Enter Outlet Contact"
            val={state.contact}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'contact',
                payload: text,
              })
            }
            keyboardType="phone-pad"
          />
          <Input
            placeholder="Enter Outlet Notification Contact"
            val={state.notify}
            keyboardType="phone-pad"
            // nLines={3}
            showError={showError && state.notify.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'notify_contact',
                payload: text,
              })
            }
          />
          <Pressable
            onPress={async () => {
              navigation.navigate('Outlet Location');
            }}
            style={{
              marginTop: 14,
              paddingVertical: 16,
              alignItems: 'center',
              borderColor: '#B7C4CF',
              borderWidth: 1.6,
              // borderStyle: 'dashed',
              marginBottom: 8,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                color: 'rgba(25, 66, 216, 0.87)',
                fontSize: 18,
              }}>
              {!state.location
                ? 'Physical Location of Outlet'
                : state.location.delivery_location}
            </Text>
          </Pressable>
          <CheckItem
            placeholder="Set Working Hours"
            value={state.set_worktime}
            onValueChange={() => {
              dispatch({
                type: 'set_worktime',
                payload: !state.set_worktime,
              });
            }}
          />
          {state.set_worktime && (
            <View style={{ marginTop: 12 }}>
              <WorkingTimeCheck
                placeholder="MON"
                value={state.worktime.monday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'monday_status',
                    payload: !state.worktime.monday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'monday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'monday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="TUE"
                value={state.worktime.tuesday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'tuesday_status',
                    payload: !state.worktime.tuesday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'tuesday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'tuesday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="WED"
                value={state.worktime.wednesday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'wednesday_status',
                    payload: !state.worktime.wednesday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'wednesday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'wednesday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="THUR"
                value={state.worktime.thursday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'thursday_status',
                    payload: !state.worktime.thursday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'thursday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'thursday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="FRI"
                value={state.worktime.friday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'friday_status',
                    payload: !state.worktime.friday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'friday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'friday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="SAT"
                value={state.worktime.saturday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'saturday_status',
                    payload: !state.worktime.saturday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'saturday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'saturday_end',
                    payload: time,
                  });
                }}
              />
              <WorkingTimeCheck
                placeholder="SUN"
                value={state.worktime.sunday.status}
                onValueChange={() => {
                  dispatch({
                    type: 'sunday_status',
                    payload: !state.worktime.sunday.status,
                  });
                }}
                onStartTimeChange={time => {
                  dispatch({
                    type: 'sunday_start',
                    payload: time,
                  });
                }}
                onEndTimeChange={time => {
                  dispatch({
                    type: 'sunday_end',
                    payload: time,
                  });
                }}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLoading}
          handlePress={() => {
            console.log(state);
            // if (
            //   state.name.length === 0 ||
            //   // !state.tin ||
            //   state.value.length === 0 ||
            //   state.showTax.length === 0
            // ) {
            //   setShowError(true);
            //   return;
            // }
            const workingTimes = {};
            let loop = 0;
            if (state.set_worktime) {
              for (const [key, value] of Object.entries(state.worktime)) {
                if (value.status) {
                  workingTimes[loop] = {
                    workDay: mapDaytoCode[key],
                    workStartTime: value.start,
                    workEndTime: value.end,
                  };
                  loop++;
                }
              }
            }
            console.log('wttttttttttttt', workingTimes);
            mutate({
              outlet_name: state.name,
              outlet_contact: state.contact,
              outlet_notify: state.notify,
              outlet_source: state.source,
              outlet_worktime_set: state.set_worktime ? 'YES' : 'NO',
              outlet_worktime_list: JSON.stringify(workingTimes),
              outlet_address:
                (state.location && state.location.delivery_location) || '',
              outlet_gps:
                (state.location &&
                  state.location.delivery_gps.location.lat +
                    ',' +
                    state.location.delivery_gps.location.lng) ||
                '',
              image_outlet: state.image
                ? {
                    name: state.image.fileName,
                    type: state.image.type,
                    uri:
                      Platform.OS === 'android'
                        ? state.image.uri
                        : state.image.uri.replace('file://', ''),
                  }
                : '',
              mod_by: user.login,
              merchant_id: user.merchant,
            });
          }}>
          {isLoading ? 'Processing' : 'Save Outlet'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddOutlet;
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
