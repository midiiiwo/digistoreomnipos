/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import { DateTimePicker, Picker as RNPicker } from 'react-native-ui-lib';
import Picker from '../components/Picker';
import { useEditEventTicket } from '../hooks/useEditEventTicket';
import moment from 'moment';

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
    case 'ticket_status':
      return { ...state, ticketStatus: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const ticketUnitTypes = [
  { label: 'Single', value: '1' },
  { label: 'Double', value: '2' },
  { label: 'Triple', value: '3' },
  { label: 'Quadriple', value: '4' },
  { label: 'Bundle of Five', value: '5' },
];

const mapValuetoUnit = {
  1: 'Single',
  2: 'Double',
  3: 'Triple',
  4: 'Quadriple',
  5: 'Bundle of Five',
};

const parseTime = time => {
  let parsedTime = new Date();
  let parts = time.match(/(\d+):(\d+) (AM|PM)/);
  if (parts) {
    let hours = parseInt(parts[1], 10),
      minutes = parseInt(parts[2], 10),
      tt = parts[3];
    if (tt === 'PM' && hours < 12) {
      hours += 12;
    }
    parsedTime.setHours(hours, minutes, 0, 0);
  }
  return parsedTime;
};

const EditEventTicket = ({ route }) => {
  const { ticket } = route.params;
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
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
    ticketStatus: null,
    id: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const editEventTicket = useEditEventTicket(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('event-tickets');
    }
  });

  React.useEffect(() => {
    if (ticket) {
      const startTime_ = parseTime(ticket.ticket_starttime);

      const startDate_ = new Date(ticket.ticket_startdate);
      dispatch({
        type: 'update_all',
        payload: {
          ticketName: ticket.ticket_name,
          ticketCode: ticket.ticket_code,
          ticketDescription: ticket.ticket_description,
          ticketQuantity: ticket.ticket_qty,
          ticketRate: ticket.ticket_rate,
          ticketDiscountCoupon: ticket.ticket_discount_coupon,
          ticketDiscountRate: ticket.ticket_discount_rate,
          startDate: startDate_ || '',
          startTime: startTime_ || '',
          ticketVenue: ticket.ticket_venue,
          ussdChannel: ticket.ticket_ussd,
          ticketUnitType: {
            label: mapValuetoUnit[ticket.ticket_unit],
            value: ticket.ticket_unit,
          },
          ticketStatus: ticket.ticket_status,
          id: ticket.ticket_id,
        },
      });
    }
  }, [ticket]);

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
            disabled={true}
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
            disabled={true}
          />
          <Picker
            showError={showError && !state.ticketStatus}
            placeholder="Ticket Status"
            value={state.ticketStatus}
            setValue={i => {
              handleTextChange({
                type: 'ticket_status',
                payload: i,
              });
            }}>
            <RNPicker.Item key="OPEN" label="OPEN" value={'OPEN'} />
            <RNPicker.Item key={'HOLD'} label={'HOLD'} value={'HOLD'} />
            <RNPicker.Item key={'CLOSED'} label={'CLOSED'} value={'CLOSED'} />
            <RNPicker.Item
              key={'INTERNAL'}
              label={'INTERNAL'}
              value={'INTERNAL'}
            />
            <RNPicker.Item
              key={'CLOSED-ONLINE'}
              label={'CLOSED-ONLINE'}
              value={'CLOSED-ONLINE'}
            />
          </Picker>
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
          disabled={editEventTicket.isLoading}
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
              state.startTime.length === 0 ||
              state.ticketStatus.length === 0
            ) {
              setShowError(true);
              return;
            }
            console.log('dddddd', state.startDate);
            const startDate = moment(state.startDate).format('DD-MM-YYYY');
            const startTime = moment(state.startTime).format('H:mm');
            editEventTicket.mutate({
              id: state.id,
              name: state.ticketName,
              code: state.ticketCode,
              rate: state.ticketRate,
              qty: state.ticketQuantity,
              unit: state.ticketUnitType.value,
              start_date: startDate,
              start_time: startTime,
              discount: state.ticketDiscountRate,
              venue: state.ticketVenue,
              ussd: state.ussdChannel,
              description: state.ticketDescription,
              status: state.ticketStatus,
              mod_by: user.login,
            });
            // addCategory.mutate(state);
          }}>
          {editEventTicket.isLoading ? 'Loading' : 'Save Ticket'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditEventTicket;
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
