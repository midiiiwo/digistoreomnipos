/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
  Image,
} from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import AddImage from '../../assets/icons/importImage.svg';
import Input from '../components/Input';
import { launchImageLibrary } from 'react-native-image-picker';
import { DateTimePicker } from 'react-native-ui-lib';

const reducer = (state, action) => {
  switch (action.type) {
    case 'event_name':
      return { ...state, eventName: action.payload };
    case 'event_code':
      return { ...state, eventCode: action.payload };
    case 'event_description':
      return { ...state, eventDescription: action.payload };
    case 'event_image':
      return { ...state, eventImage: action.payload };
    case 'event_location':
      return { ...state, eventLocation: action.payload };
    case 'event_start_date':
      return { ...state, eventStartDate: action.payload };
    case 'event_end_date':
      return { ...state, eventEndDate: action.payload };
    case 'event_start_time':
      return { ...state, eventStartTime: action.payload };
    case 'event_end_time':
      return { ...state, eventEndTime: action.payload };
    default:
      return state;
  }
};

const EditEvent = () => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const [state, dispatch] = React.useReducer(reducer, {
    eventName: '',
    eventCode: '',
    eventDescription: '',
    eventImage: null,
    eventLocation: null,
    eventStartDate: '',
    eventEndDate: '',
    eventStartTime: '',
    eventEndTime: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const addCategory = useAddCategory(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('product-categories');
    }
  });

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
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Event Name"
            showError={showError && state.eventName.length === 0}
            val={state.eventName}
            setVal={text =>
              handleTextChange({
                type: 'event_name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Event Code"
            showError={showError && state.eventCode.length === 0}
            val={state.eventCode}
            setVal={text =>
              handleTextChange({
                type: 'event_code',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Event Description"
            val={state.eventDescription}
            showError={showError && state.eventDescription.length === 0}
            nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'event_description',
                payload: text,
              })
            }
          />
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 15,
              color: '#30475e',
              paddingVertical: 10,
            }}>
            Event Background Image
          </Text>
          <Pressable
            onPress={async () => {
              const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.6,
              });
              handleTextChange({
                type: 'event_image',
                payload: result.assets[0],
              });
            }}>
            {!state.eventImage && (
              <View
                style={{
                  width: '100%',
                  height: Dimensions.get('window').height * 0.18,
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
            {state.eventImage && typeof state.eventImage === 'object' && (
              <Image
                style={{
                  height: Dimensions.get('window').height * 0.18,
                  width: '100%',
                  borderRadius: 5,
                }}
                source={{ uri: state.eventImage.uri }}
              />
            )}
          </Pressable>
          <Pressable
            onPress={async () => {
              navigation.navigate('Outlet Location');
            }}
            style={{
              marginTop: 22,
              paddingVertical: 12,
              alignItems: 'center',
              borderColor: '#B7C4CF',
              borderWidth: 0.9,
              // borderStyle: 'dashed',
              marginBottom: 8,
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                color: 'rgba(25, 66, 216, 0.87)',
                fontSize: 15,
              }}>
              {!state.location
                ? 'Event Venue'
                : state.location.delivery_location}
            </Text>
          </Pressable>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View style={{ width: '50%' }}>
              <DateTimePicker
                title="Start Date"
                mode="date"
                onChange={i => {}}
                // value={dateValue}
              />
            </View>

            <View style={{ marginHorizontal: 12 }} />
            <View style={{ width: '50%' }}>
              <DateTimePicker
                title="End Date"
                mode="date"
                onChange={i => {}}
                // value={dateValue}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View style={{ width: '50%' }}>
              <DateTimePicker
                title="Start Time"
                mode="time"
                onChange={i => {}}
                // value={dateValue}
              />
            </View>

            <View style={{ marginHorizontal: 12 }} />
            <View style={{ width: '50%' }}>
              <DateTimePicker
                title="End Time"
                mode="time"
                onChange={i => {}}
                // value={dateValue}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton style={[styles.btn, { flex: 1 }]} handlePress={() => {}}>
          Save Event
        </PrimaryButton>
        <View style={{ marginHorizontal: 3 }} />
        <PrimaryButton
          style={[styles.btn, { flex: 1, backgroundColor: '#D61355' }]}
          handlePress={() => {}}>
          Delete Ticket
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditEvent;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 0,
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
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    flexDirection: 'row',
    paddingHorizontal: 14,
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
