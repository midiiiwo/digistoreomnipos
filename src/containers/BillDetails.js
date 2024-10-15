/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useLookupCustomerFromVendor } from '../hooks/useLookupCustomerFromVendor';
import { useGetVendorOptions } from '../hooks/useGetVendorOptions';
import { useToast } from 'react-native-toast-notifications';

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
    case 'account_number':
      return { ...state, accountNumber: action.payload };
    case 'account_name':
      return { ...state, accountName: action.payload };
    case 'customer_number':
      return { ...state, customerNumber: action.payload };
    case 'customer_name':
      return { ...state, customerName: action.payload };
    case 'customer_email':
      return { ...state, customerEmail: action.payload };
    case 'mobile_number':
      return { ...state, mobileNumber: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    default:
      return state;
  }
};

function BillDetails(props) {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const step = React.useRef(0);
  const [lookUp, setLookup] = React.useState(false);

  const [state, dispatch] = React.useReducer(reducer, {
    accountNumber: '',
    accountName: '',
    mobileNumber: '',
    amount: '',
  });

  const toast = useToast();

  const {
    data: lookupData,
    isLoading: isLookupLoading,
    isFetching,
  } = useLookupCustomerFromVendor(
    props.route.params.billCode,
    state.accountNumber,
    lookUp && state.accountNumber.length > 0,
  );
  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  // const { data, isLoading } = useGetVendorOptions(
  //   props.payload.billCode,
  //   state.accountNumber,
  //   lookUp && state.accountNumber.length > 0,
  // );

  React.useEffect(() => {
    if (!isLookupLoading && lookupData && lookupData.data) {
      if (lookupData.data.status == 0) {
        SheetManager.show('confirmBillPayment', {
          payload: {
            bill: props.route.params.billCode,
            name: lookupData.data.message.acctName,
            amountDue: lookupData.data.message.amountDue,
            navigation: props.navigation,
            accountNumber: state.accountNumber,
            message: lookupData.data.message,
            mobileNumber: state.mobileNumber,
            // accountNumber: state.accountNumber,
          },
        });
      } else if (lookupData.data.status != 0) {
        toast.show('Account number provided failed account validation', {
          type: 'danger',
          placement: 'top',
          duration: 5000,
        });
      }
      setLookup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lookupData,
    isLookupLoading,
    toast,
    props.route.params.billCode,
    props.navigation,
    // state.accountNumber,
  ]);

  return (
    <>
      <View
        style={{
          height: '100%',
          borderRadius: 0,
          backgroundColor: '#fff',
          // paddingTop: 14,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginTop: 14,
          }}>
          {props.route.params.bill.toUpperCase()}
        </Text>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Account number"
            showError={showError && state.accountNumber.length === 0}
            val={state.accountNumber}
            setVal={text =>
              handleTextChange({
                type: 'account_number',
                payload: text,
              })
            }
          />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: '#4B6587',
              fontSize: 13,
              marginTop: 16,
            }}>
            This number would receive the receipt of the transaction
          </Text>
          <Input
            placeholder="Mobile Number (Optional)"
            val={state.mobileNumber}
            setVal={text =>
              handleTextChange({
                type: 'mobile_number',
                payload: text,
              })
            }
            keyboardType="phone-pad"
            inputMode="tel"
          />
          {/* <Picker
            // showError={!state.category && showError}
            value={state.category}
            setValue={item => {
              handleTextChange({
                type: 'product_category',
                payload: item,
              });
            }}>
            {data &&
              data.data &&
              data.data.data &&
              data.data.message.map(item => {
                console.log('item----<', item);
                return (
                  <RNPicker.Item
                  // key={item.category_name}
                  // label={item.category_name}
                  // value={JSON.stringify(item)}
                  />
                );
              })}
          </Picker> */}
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLookupLoading || isFetching}
          handlePress={() => {
            if (state.accountNumber.length === 0) {
              setShowError(true);
              return;
            }
            if (step.current === 0) {
              setLookup(true);
              return;
            }
            // if (step.current === 1 && lookupData.data.status == 0) {
            //   SheetManager.show('confirmBillPayment', {
            //     payload: {
            //       bill: props.route.params.billCode,
            //       amount: state.amount,
            //       state,
            //     },
            //   });
            // }
          }}>
          {isLookupLoading || isFetching ? 'Processing' : 'Proceed'}
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
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
export default BillDetails;
