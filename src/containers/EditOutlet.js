/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
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
import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';
import { Checkbox, DateTimePicker } from 'react-native-ui-lib';

import { TextInput } from 'react-native-paper';
// import { Switch } from 'react-native-ui-lib';
import { Switch } from '@rneui/themed';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';
import _, { update } from 'lodash';
import { useEditProduct } from '../hooks/useEditProduct';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Scanner from '../../assets/icons/barscanner';
import AddImage from '../../assets/icons/add-image.svg';
import { useGetOutletDetails } from '../hooks/useGetOutletDetails';
import { CheckItem } from './ReceiptDetails';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import { useUpdateOutlet } from '../hooks/useUpdateOutlet';
// import { WorkingTimeCheck } from './AddOutlet';

const WorkingTimeCheck = ({
  onValueChange,
  value,
  placeholder,
  onStartTimeChange,
  onEndTimeChange,
  start,
  end,
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
            marginRight: 8,
          }}

          // label="By clicking to create an account, you agree to iPay's Terms of Use
          // and Privacy Policy"
        />
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            color: '#30475e',
            fontSize: 15,
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
          timeFormat="H:mm A"
          onChange={i => {
            // const time = i.toLocaleTimeString();
            // const digits = time.slice(0, -6);
            // const amPM = time.slice(-2);
            onStartTimeChange(i);
          }}
          editable={value}
          value={start}
        />
        <View style={{ marginHorizontal: 8 }} />
        <DateTimePicker
          title="Close"
          mode="time"
          timeFormat="h:mm A"
          onChange={i => {
            // console.log('iiiiii', i);
            // console.log('iiiiii', typeof i);
            // const time = i.toLocaleTimeString();
            // const digits = time.slice(0, -6);
            // const amPM = time.slice(-2);

            console.log('iiiiiii', i);
            onEndTimeChange(i);
          }}
          editable={value}
          value={end}
        />
      </View>
    </View>
  );
};
const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
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
    case 'update_all':
      return { ...state, ...action.payload };
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

const mapCodeToDay = {
  SUN: 'sunday',
  MON: 'monday',
  TUE: 'tuesday',
  WED: 'wednesday',
  THU: 'thursday',
  FRI: 'friday',
  SAT: 'saturday',
};

const mapDaytoCode = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

function EditOutlet(props) {
  const { user } = useSelector(state => state.auth);

  const [toggleMoreInput, setToggleMoreInput] = React.useState(false);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [applyTaxes, setApplyTaxes] = React.useState(true);
  const [openMenu, setOpenMenu] = React.useState(false);
  const client = useQueryClient();
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

  const queryClient = useQueryClient();

  const updateOutlet = useUpdateOutlet(i => {
    if (i && i.status == 0) {
      setSaved(i);
      client.invalidateQueries('outlet-lov');
      client.invalidateQueries('merchant-outlets');
      return;
    }
    setSaved(i);
  });

  const { data, isLoading } = useGetOutletDetails(props.route.params.id);

  const navigation = useNavigation();

  React.useEffect(() => {
    if (saved && saved.status == 0) {
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: saved.message,
      });
      props.navigation.goBack();
    } else if (saved) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed',
        textBody: saved && saved.message,
      });
    }
    setSaved(null);
  }, [saved, props.navigation]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const parseTime = React.useCallback(time => {
    let parsedTime = new Date();
    let parts = time.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
      let hours = parseInt(parts[1]),
        minutes = parseInt(parts[2]),
        tt = parts[3];
      if (tt === 'PM' && hours < 12) hours += 12;
      parsedTime.setHours(hours, minutes, 0, 0);
    }
    return parsedTime;
  });

  React.useEffect(() => {
    if (data && data.data && data.data.data && data.data.status == 0) {
      const outletData = data.data.data;
      console.log('ggggggggggggggggg', outletData);
      const [lat, lng] = outletData.outlet_gps.split(',');
      const location = {
        delivery_location: outletData.outlet_address,
        delivery_gps: {
          location: {
            lat,
            lng,
          },
        },
      };
      const workingTimes = {};
      (outletData.outlet_opening_hours || []).forEach(i => {
        console.log(parseTime(i.outlet_opening_starttime));
        if (i) {
          workingTimes[mapCodeToDay[i.outlet_opening_day]] = {
            status: true,
            start: parseTime(i.outlet_opening_starttime),
            end: parseTime(i.outlet_opening_endtime),
          };
        }
      });
      dispatch({
        type: 'update_all',
        payload: {
          name: outletData.outlet_name,
          contact: outletData.outlet_contact,
          notify: outletData.outlet_notification_contact,
          id: outletData.outlet_id,
          image: outletData.outlet_image,
          location,
          worktime: Object.assign({}, state.worktime, workingTimes),
          set_worktime: (outletData.outlet_opening_hours || []).length > 0,
        },
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  console.log('imageeeee', state.image);

  return (
    <>
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        {!isLoading && (
          <ScrollView style={styles.main}>
            <View style={{ alignItems: 'center' }}>
              <Menu
                opened={openMenu}
                onBackdropPress={() => setOpenMenu(false)}>
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
                              'https://payments.ipaygh.com/app/webroot/img/shops/' +
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
                            quality: 0.65,
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
                        console.log('=>>>>>>>>>>>>>>>>,', error);
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

              {state.image && (
                <Pressable
                  style={{ padding: 5, marginTop: 12 }}
                  onPress={() => {
                    dispatch({ type: 'image', payload: null });
                  }}>
                  <Text
                    style={{ fontFamily: 'Inter-Medium', color: '#E0144C' }}>
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
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: '#B7C4CF',
                borderWidth: 0.9,
                // borderStyle: 'dashed',
                marginBottom: 8,
                borderRadius: 4,
                paddingHorizontal: 12,
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: 'rgba(25, 66, 216, 0.87)',
                  fontSize: 15,
                  textAlign: 'center',
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
                  start={state.worktime.monday.start}
                  end={state.worktime.monday.end}
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
                  start={state.worktime.tuesday.start}
                  end={state.worktime.tuesday.end}
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
                  start={state.worktime.wednesday.start}
                  end={state.worktime.wednesday.end}
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
                  start={state.worktime.thursday.start}
                  end={state.worktime.thursday.end}
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
                  start={state.worktime.friday.start}
                  end={state.worktime.friday.end}
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
                  start={state.worktime.saturday.start}
                  end={state.worktime.saturday.end}
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
                  start={state.worktime.sunday.start}
                  end={state.worktime.sunday.end}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={updateOutlet.isLoading}
          handlePress={() => {
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
            updateOutlet.mutate({
              outlet_id: state.id,
              outlet_name: state.name,
              outlet_contact: state.contact,
              outlet_notify: state.notify,
              outlet_source: 'MOBILE',
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
              image_outlet:
                state.image && typeof state.image === 'object'
                  ? {
                      name: state.image.fileName,
                      type: state.image.type,
                      uri:
                        Platform.OS === 'android'
                          ? state.image.uri
                          : state.image.uri.replace('file://', ''),
                    }
                  : typeof state.image === 'string'
                  ? state.image
                  : '',
              mod_by: user.login,
              merchant_id: user.merchant,
            });
          }}>
          {updateOutlet.isLoading ? 'Processing' : 'Save Outlet'}
        </PrimaryButton>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
    backgroundColor: '#fff',
    borderRadius: 0,
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
    bottom: 14,
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

export default EditOutlet;
