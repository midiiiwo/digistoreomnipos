/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { DateTimePicker } from 'react-native-ui-lib';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useAddCustomer } from '../hooks/useAddCustomer';
import moment from 'moment';

import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'customer_name':
      return { ...state, name: action.payload };
    case 'customer_email':
      return { ...state, email: action.payload };
    case 'customer_phone':
      return { ...state, phone: action.payload };
    case 'customer_alt_phone':
      return { ...state, alt: action.payload };
    case 'customer_dob':
      return { ...state, dob: action.payload };
    default:
      return state;
  }
};

const AddCustomer = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    email: '',
    phone: '',
    alt: '',
    dob: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const addCustomer = useAddCustomer(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-customers');
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
            placeholder="Enter Customer Name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'customer_name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Customer Email"
            val={state.email}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_email',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Customer Phone"
            val={state.phone}
            keyboardType="phone-pad"
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_phone',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Customer Alt Phone"
            val={state.alt}
            keyboardType="phone-pad"
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'customer_alt_phone',
                payload: text,
              })
            }
          />
          <View style={{ marginTop: 22 }}>
            <DateTimePicker
              title={''}
              placeholder={'Enter Date of Birth'}
              mode={'date'}
              migrate
              value={state.dob}
              onChange={val => {
                handleTextChange({
                  type: 'customer_dob',
                  payload: val,
                });
              }}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={addCustomer.isLoading}
          handlePress={() => {
            if (
              state.name.length === 0
              // state.email.length === 0 ||
              // state.phone.length === 0 ||
            ) {
              setShowError(true);
              return;
            }
            addCustomer.mutate({
              client_name: state.name,
              client_email: state.email,
              client_phone: state.phone,
              client_alt_phone: state.alt,
              client_dob: moment(state.dob).format('DD-MM-YYYY'),
              client_merchant: user.merchant,
              mod_by: user.login,
            });
          }}>
          {addCustomer.isLoading ? 'Processing' : 'Save Customer'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddCustomer;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 4,
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
