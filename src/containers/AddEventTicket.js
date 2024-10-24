/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import {
  Checkbox,
  DateTimePicker,
  Picker as RNPicker,
} from 'react-native-ui-lib';
import Picker from '../components/Picker';
import { Text } from 'react-native';
import { useGetEventTicketCode } from '../hooks/useGetEventTicketCode';
import { useGetEventDetailsByCode } from '../hooks/useGetEventDetailsByCode';
import Loading from '../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ticket_name':
      return { ...state, ticketName: action.payload };
    case 'ticket_code':
      return { ...state, ticketCode: action.payload };
    case 'ticket_description':
      return { ...state, ticketDescription: action.payload };
    case 'ticket_quantity':
      return { ...state, ticketQuantity: action.payload };
    case 'ticket_unit_type':
      return { ...state, ticketUnitType: action.payload };
    case 'ticket_rate':
      return { ...state, ticketRate: action.payload };
    case 'ticket_discount_coupon':
      return { ...state, ticketDiscountCoupon: action.payload };
    case 'ticket_discount_rate':
      return { ...state, ticketDiscountRate: action.payload };
    case 'ussd_channel':
      return { ...state, ussdChannel: action.payload };
    case 'start_date':
      return { ...state, startDate: action.payload };
    case 'start_time':
      return { ...state, startTime: action.payload };
    case 'ticket_venue':
      return { ...state, ticketVenue: action.payload };
    default:
      return state;
  }
};

const ticketUnitTypes = [
  { label: 'Single', value: 'Single' },
  { label: 'Double', value: 'Double' },
  { label: 'Triple', value: 'Triple' },
  { label: 'Quadriple', value: 'Quadriple' },
  { label: 'Bundle of Five', value: 'Bundle of Five' },
];

const AddEventTicket = ({ route }) => {
  const { event_code } = route.params;
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const [autoGenerate, setAutogenerate] = React.useState(true);
  const [state, dispatch] = React.useReducer(reducer, {
    ticketName: '',
    ticketCode: '',
    ticketDescription: '',
    ticketQuantity: '',
    ticketUnitType: null,
    ticketRate: '',
    ticketDiscountCoupon: '',
    ticketDiscountRate: '',
    ussdChannel: null,
    startDate: '',
    startTime: '',
    ticketVenue: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const { data, refetch } = useGetEventTicketCode(
    user.user_merchant_receivable,
    state.ticketName,
  );

  const addCategory = useAddCategory(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('product-categories');
    }
  });

  React.useEffect(() => {
    if (autoGenerate) {
      console.log('cododododd', data && data.data && data.data.data);
    }
  }, [data, autoGenerate]);

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
            placeholder="Ticket Name"
            showError={showError && state.ticketName.length === 0}
            val={state.ticketName}
            setVal={text =>
              handleTextChange({
                type: 'ticket_name',
                payload: text,
              })
            }
            onEndEditing={e => {
              console.log('daaggg', e.nativeEvent.text);
              refetch();
            }}
          />
          <Input
            placeholder="Ticket Code"
            showError={showError && state.ticketCode.length === 0}
            val={state.ticketCode}
            setVal={text =>
              handleTextChange({
                type: 'ticket_code',
                payload: text,
              })
            }
            disabled={autoGenerate}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              marginTop: 4,
            }}>
            <Checkbox
              value={autoGenerate}
              onValueChange={() => setAutogenerate(!autoGenerate)}
            />
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#30475e',
                marginLeft: 7,
              }}>
              Auto generate Ticket Code
            </Text>
          </View>
          <Input
            placeholder="Ticket Description"
            val={state.ticketDescription}
            nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'ticket_description',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Ticket Quantity"
            showError={showError && state.ticketQuantity.length === 0}
            val={state.ticketQuantity}
            setVal={text =>
              handleTextChange({
                type: 'ticket_quantity',
                payload: text,
              })
            }
            keyboardType="number-pad"
          />
          <Picker
            placeholder="Ticket Unit Type"
            value={state.ticketUnitType}
            showError={showError && !state.ticketUnitType}
            setValue={val => {
              handleTextChange({
                type: 'ticket_unit_type',
                payload: val,
              });
            }}>
            {ticketUnitTypes.map(i => {
              return (
                <RNPicker.Item key={i.value} label={i.label} value={i.value} />
              );
            })}
          </Picker>
          <Input
            placeholder="Ticket Rate"
            showError={showError && state.ticketRate.length === 0}
            val={state.ticketRate}
            setVal={text =>
              handleTextChange({
                type: 'ticket_rate',
                payload: text,
              })
            }
            keyboardType="number-pad"
          />
          <Input
            placeholder="Discount Coupon"
            val={state.ticketDiscountCoupon}
            setVal={text =>
              handleTextChange({
                type: 'ticket_discount_coupon',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Discount Rate"
            val={state.ticketDiscountRate}
            setVal={text =>
              handleTextChange({
                type: 'ticket_discount_rate',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Ticket Venue"
            showError={showError && state.ticketVenue.length === 0}
            val={state.ticketVenue}
            setVal={text =>
              handleTextChange({
                type: 'ticket_venue',
                payload: text,
              })
            }
          />
          <Picker
            placeholder="USSD Channel"
            value={state.ussdChannel}
            setValue={i => {
              handleTextChange({
                type: 'ussd_channel',
                payload: i,
              });
            }}>
            <RNPicker.Item key="YES" label="YES" value={'YES'} />
            <RNPicker.Item key={'NO'} label={'NO'} value={'NO'} />
          </Picker>
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
                onChange={i => {
                  handleTextChange({
                    type: 'start_date',
                    payload: i,
                  });
                }}
                value={state.startDate}
              />
            </View>

            <View style={{ marginHorizontal: 12 }} />
            <View style={{ width: '50%' }}>
              <DateTimePicker
                title="Start Time"
                mode="time"
                onChange={i => {
                  handleTextChange({
                    type: 'start_time',
                    payload: i,
                  });
                }}
                value={state.startTime}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={saved === 'Success'}
          handlePress={() => {
            console.log('state', state);
            if (
              state.ticketName.length === 0 ||
              state.ticketCode.length === 0 ||
              state.ticketQuantity.length === 0 ||
              !state.ticketUnitType ||
              state.ticketRate.length === 0 ||
              state.ticketVenue.length === 0 ||
              state.startDate.length === 0 ||
              state.startTime.length === 0
            ) {
              setShowError(true);
              return;
            }
            // addCategory.mutate(state);
          }}>
          {addCategory.isLoading ? 'Loading' : 'Save Ticket'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddEventTicket;
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
