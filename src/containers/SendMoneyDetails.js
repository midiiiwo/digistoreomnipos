/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import PrimaryButton from '../components/PrimaryButton';
import Input from '../components/Input';
import { useToast } from 'react-native-toast-notifications';

const reducer = (state, action) => {
  switch (action.type) {
    case 'account_number':
      return { ...state, accountNumber: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    default:
      return state;
  }
};

function SendMoneyDetails(props) {
  const [saved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  // const [lookUp, setLookup] = React.useState(false);

  const [state, dispatch] = React.useReducer(reducer, {
    accountNumber: '',
    description: '',
    amount: '',
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

  console.log(props.route.params);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          fontSize: 18,
          color: '#30475e',
          textAlign: 'center',
          marginTop: 14,
        }}>
        Send {props.route.params.bill}
      </Text>
      <ScrollView
        style={styles.main}
        contentContainerStyle={{
          paddingHorizontal: Dimensions.get('window').width * 0.1,
        }}>
        <Input
          placeholder="Recepient number"
          showError={showError && state.accountNumber.length === 0}
          val={state.accountNumber}
          setVal={text =>
            handleTextChange({
              type: 'account_number',
              payload: text,
            })
          }
          keyboardType="phone-pad"
        />

        <Input
          placeholder="Amount (GHS)"
          val={state.amount}
          setVal={text =>
            handleTextChange({
              type: 'amount',
              payload: text,
            })
          }
          showError={showError && state.amount.length === 0}
          keyboardType="number-pad"
        />
        <Input
          placeholder="Payment Description"
          val={state.description}
          setVal={text =>
            handleTextChange({
              type: 'description',
              payload: text,
            })
          }
          nLines={4}
          showError={showError && state.description.length === 0}
        />
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={saved === 'Success'}
          handlePress={() => {
            if (
              state.accountNumber.length === 0 ||
              state.amount.length === 0 ||
              state.description.length === 0
            ) {
              setShowError(true);
              toast.show('Please provide required details', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }

            // if (step.current === 1 && data.data.status == 0) {
            SheetManager.show('confirmSendMoney', {
              payload: {
                bill: props.route.params.billCode,
                amount: state.amount,
                state,
                lookup: props.route.params.lookup,
                navigation: props.navigation,
              },
            });
            // }
          }}>
          {/* {isLoading ? 'Loading' : 'Proceed'} */}
          Proceed
        </PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
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
    fontSize: 16,
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
export default SendMoneyDetails;
