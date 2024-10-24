/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import Input from '../components/Input';
import { useBuyTicket } from '../hooks/useBuyTicket';
import { useGetTransactionFee } from '../hooks/useGetTransactionFee';
import { useNavigation } from '@react-navigation/native';
import SellTicketPaymentInstructions from '../components/Modals/SellTicketPaymentInstructions';
import SellTicketPaymentStatus from '../components/Modals/SellTicketPaymentStatus';
import { useLookupCustomer } from '../hooks/useLookupCustomer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'email':
      return { ...state, email: action.payload };
    case 'phone':
      return { ...state, phone: action.payload };
    case 'payment':
      return { ...state, paymentMethod: action.payload };
    case 'momo':
      return { ...state, momoOption: action.payload };
    case 'momo_number':
      return { ...state, momoNumber: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    case 'quantity':
      return { ...state, quantity: action.payload };
    case 'ticket':
      return { ...state, ticket: action.payload };
    case 'charge':
      return { ...state, charge: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const momoOptions = [
  { name: 'MTN Mobile Money', code: 'MTNMM' },
  { name: 'Vodafone Cash', code: 'VODAC' },
  { name: 'AirtelTigo Money', code: 'TIGOC' },
  // { name: 'Card Payment', code: 'VISAG' },
  // { name: 'GHQR', code: 'QRPAY' },
  // { name: 'PayPal', code: 'PAYPAL' },
];

const telcoMomo = ['MTNMM', 'VODAC', 'TIGOC'];

const paymentOptions = [
  { name: 'Mobile Money', code: 'ONLINE' },
  { name: 'Cash Payment', code: 'CASH' },
  { name: 'Complementary', code: 'COMPLEMENTARY' },
];

const SellTicket = ({ route }) => {
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  const [invoice, setInvoice] = React.useState();
  const [balanceInstructions, setBalanceInstructions] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const { item } = route.params;
  const [state, dispatch] = React.useReducer(reducer, {
    email: '',
    name: '',
    phone: '',
    paymentMethod: null,
    momoOption: null,
    momoNumber: '',
    amount: '',
    quantity: '',
    ticket: '',
    charge: '0',
  });
  const toast = useToast();
  const client = useQueryClient();
  const navigation = useNavigation();
  const total = Number(state.amount) * Number(state.quantity);
  const { data, refetch, isFetching } = useGetTransactionFee(
    (state.momoOption && state.momoOption.value) || '',
    total,
    user.merchant,
    state.momoOption !== null && state.momoNumber !== undefined,
  );

  const {
    // isFetching: customerFetching,
    data: customerData,
    refetch: refetchCustomerData,
  } = useLookupCustomer(state.phone);

  const buyTicket = useBuyTicket(i => {
    if (i) {
      client.invalidateQueries(['event-tickets']);
      if (
        state &&
        state.paymentMethod &&
        state.paymentMethod.value === 'ONLINE'
      ) {
        setInvoice(i);
        setBalanceInstructions(true);
        return;
      }
      navigation.navigate('Sell Ticket Status', {
        payStatus: i && i.status,
        message: i && i.message,
      });
    }
  });

  React.useEffect(() => {
    dispatch({
      type: 'amount',
      payload: (item && item.ticket_rate) || '',
    });
    dispatch({
      type: 'ticket',
      payload: (item && item.ticket_name) || '',
    });
  }, [item]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  React.useEffect(() => {
    if (state.phone.length === 10) {
      refetchCustomerData();
    }
  }, [state.phone, refetchCustomerData]);

  React.useEffect(() => {
    const customerDetails = customerData && customerData.data;
    if (
      customerDetails &&
      customerDetails.data &&
      customerDetails.status == 0
    ) {
      const customer = customerDetails.data;
      dispatch({
        type: 'update_all',
        payload: {
          name: customer.user_name,
          email: customer.user_email,
        },
      });
    }
  }, [customerData]);

  React.useEffect(() => {
    if (
      state.momoOption &&
      state.paymentMethod &&
      state.paymentMethod.value === 'ONLINE'
    ) {
      refetch();
    }
  }, [refetch, state.momoOption, state.paymentMethod, state.quantity]);

  React.useEffect(() => {
    const serviceCharge = data && data.data;
    if (
      serviceCharge &&
      state.momoOption &&
      state.paymentMethod &&
      state.paymentMethod.value === 'ONLINE'
    ) {
      dispatch({
        type: 'charge',
        payload: (
          (serviceCharge && serviceCharge.charge && serviceCharge.charge) ||
          0
        ).toString(),
      });
    }
  }, [data, state.momoOption, state.paymentMethod]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView
          style={styles.main}
          contentContainerStyle={{
            paddingBottom: Dimensions.get('window').height * 0.3,
          }}>
          <Input
            placeholder="Customer Phone Number"
            showError={showError && state.phone.length === 0}
            val={state.phone}
            setVal={text =>
              handleTextChange({
                type: 'phone',
                payload: text,
              })
            }
            keyboardType="phone-pad"
          />
          <Input
            placeholder="Customer Fullname"
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
            placeholder="Customer Email (Optional)"
            val={state.email}
            setVal={text =>
              handleTextChange({
                type: 'email',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Ticket Name"
            val={state.ticket}
            setVal={text =>
              handleTextChange({
                type: 'ticket',
                payload: text,
              })
            }
            editable={false}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Ticket Quantity"
                showError={showError && state.quantity.length === 0}
                val={state.quantity}
                setVal={text =>
                  handleTextChange({
                    type: 'quantity',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              />
            </View>
            <View style={{ marginHorizontal: 5 }} />
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Ticket Price"
                showError={showError && state.amount.length === 0}
                val={state.amount}
                setVal={text =>
                  handleTextChange({
                    type: 'amount',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
                editable={false}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Total Amount"
                val={(Number(state.amount) * Number(state.quantity)).toFixed(2)}
                keyboardType="number-pad"
                editable={false}
              />
            </View>
            <View style={{ marginHorizontal: 5 }} />
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Service Charge"
                showError={showError && state.charge.length === 0}
                val={state.charge}
                keyboardType="number-pad"
                editable={false}
              />
            </View>
          </View>

          <Picker
            showError={showError && !state.paymentMethod}
            extraStyleOuter={{ marginTop: 12, paddingTop: 0 }}
            placeholder="Payment Method"
            value={state.paymentMethod}
            setValue={item => {
              handleTextChange({
                type: 'payment',
                payload: item,
              });
            }}>
            {paymentOptions.map(i => {
              if (
                !user.user_permissions.includes('TKTMOBPAY') &&
                i.code === 'ONLINE'
              ) {
                return;
              }
              if (
                !user.user_permissions.includes('TKTCASPAY') &&
                i.code === 'CASH'
              ) {
                return;
              }
              if (
                !user.user_permissions.includes('TKTNOPAY') &&
                i.code === 'COMPLEMENTARY'
              ) {
                return;
              }
              return (
                <RNPicker.Item key={i.code} label={i.name} value={i.code} />
              );
            })}
          </Picker>
          {state &&
            state.paymentMethod &&
            state.paymentMethod.value === 'ONLINE' && (
              <>
                <Picker
                  showError={showError && !state.momoOption}
                  extraStyleOuter={{ marginVertical: 6, paddingTop: 0 }}
                  placeholder="Mobile Money Options"
                  value={state.momoOption}
                  setValue={item => {
                    handleTextChange({
                      type: 'momo',
                      payload: item,
                    });
                  }}>
                  {momoOptions.map(i => {
                    if (user && !user.user_permissions.includes(i.code)) {
                      return;
                    }
                    return (
                      <RNPicker.Item
                        key={i.code}
                        label={i.name}
                        value={i.code}
                      />
                    );
                  })}
                </Picker>
                {telcoMomo.includes(
                  state && state.momoOption && state.momoOption.value,
                ) && (
                  <Input
                    placeholder="Mobile Money Number"
                    val={state.momoNumber}
                    setVal={text =>
                      handleTextChange({
                        type: 'momo_number',
                        payload: text,
                      })
                    }
                    keyboardType="phone-pad"
                    showError={
                      showError &&
                      state &&
                      state.paymentMethod &&
                      state.paymentMethod.value === 'ONLINE' &&
                      state.momoOption &&
                      telcoMomo.includes(
                        state && state.momoOption && state.momoOption.value,
                      ) &&
                      state.momoNumber.length === 0
                    }
                  />
                )}
              </>
            )}
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={buyTicket.isLoading || isFetching}
          handlePress={() => {
            if (isFetching) {
              toast.show('Service charge being calculated.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            if (
              state.phone.length === 0 ||
              state.quantity.length === 0 ||
              state.amount.length === 0 ||
              !state.paymentMethod
            ) {
              setShowError(true);
              toast.show('Please provide all required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            if (
              state &&
              state.paymentMethod &&
              state.paymentMethod.value === 'ONLINE' &&
              !state.momoOption
            ) {
              setShowError(true);
              toast.show('Please select one Mobile Money option', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            if (
              state &&
              state.paymentMethod &&
              state.paymentMethod.value === 'ONLINE' &&
              state.momoOption &&
              telcoMomo.includes(
                state && state.momoOption && state.momoOption.value,
              ) &&
              state.momoNumber.length === 0
            ) {
              setShowError(true);
              toast.show('Please enter Mobile Money number', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            console.log('sssstttt', state);
            const tickets = {
              0: {
                Code: (item && item.ticket_code) || '',
                Amount: (item && item.ticket_rate) || '',
                Qty: state.quantity,
                Name: state.name,
                Phone: state.phone,
                Email: state.email,
              },
            };
            const payload = {
              event: (item && item.event_id) || '',
              merchant: user.merchant,
              ticket_list: JSON.stringify(tickets),
              pay_mode:
                state && state.paymentMethod && state.paymentMethod.value,

              amount: Number(state.amount) * Number(state.quantity),
              pay_channel:
                state &&
                state.paymentMethod &&
                state.paymentMethod.value === 'CASH'
                  ? 'CASH'
                  : state &&
                    state.paymentMethod &&
                    state.paymentMethod.value === 'COMPLEMENTARY'
                  ? 'NONE'
                  : state && state.momoOption && state.momoOption.value,
              number:
                state &&
                state.paymentMethod &&
                state.paymentMethod.value === 'ONLINE'
                  ? state.momoNumber
                  : state.phone,
              mod_by: user.login,
              source: 'DIGISTORE BUSINESS',
            };

            if (
              state &&
              state.paymentMethod &&
              state.paymentMethod.value === 'ONLINE'
            ) {
              payload.service_charge = state.charge;
            }

            buyTicket.mutate(payload);
          }}>
          {isFetching
            ? 'Fetching charge...'
            : buyTicket.isLoading
            ? 'Processing'
            : 'Purchase Ticket'}
        </PrimaryButton>
      </View>
      <SellTicketPaymentInstructions
        invoice={invoice}
        paymentInstructions={balanceInstructions}
        togglePaymentInstructions={setBalanceInstructions}
        togglePaymentConfirmed={setConfirmed}
        setInvoice={setInvoice}
      />
      <SellTicketPaymentStatus
        paymentConfirmed={confirmed}
        togglePaymentConfirmed={setConfirmed}
        invoice={invoice}
      />
    </View>
  );
};

export default SellTicket;
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
