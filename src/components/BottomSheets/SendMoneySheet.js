/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import PrimaryButton from '../PrimaryButton';
import { useLookupAccount } from '../../hooks/useLookupAccount';

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
    case 'amount':
      return { ...state, amount: action.payload };
    default:
      return state;
  }
};

function SendMoneySheet(props) {
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const step = React.useRef(0);
  const [lookUp, setLookup] = React.useState(false);

  const [state, dispatch] = React.useReducer(reducer, {
    accountNumber: '',
    accountName: '',
    mobileNumber: '',
    amount: 0,
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

  const { data, isLoading } = useLookupAccount(
    props.payload.lookup,
    state.accountNumber,
    lookUp && state.accountNumber.length > 0,
  );

  React.useEffect(() => {
    if (!isLoading && data && data.data) {
      if (data.data.status == 0) {
        return dispatch({
          type: 'account_name',
          payload: data && data.data && data.data.name,
        });
      }
    }
  }, [data, isLoading]);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      openAnimationConfig={{ bounciness: 0, delay: 0 }}
      springOffset={150}
      defaultOverlayOpacity={0.3}>
      <View style={{ height: '96%', borderRadius: 0, backgroundColor: '#fff' }}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => SheetManager.hide('sendMoney')}
            style={{ marginLeft: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: '#EB455F',
                fontFamily: 'Inter-Medium',
                fontSize: 16,
              }}>
              Close
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginTop: 14,
          }}>
          {props.payload.bill}
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
            keyboardType="number-pad"
          />
          <Input
            placeholder="Account name"
            val={state.accountName}
            setVal={text =>
              handleTextChange({
                type: 'account_name',
                payload: text,
              })
            }
            editable={false}
          />
          <Input
            placeholder="Amount"
            val={state.amount}
            setVal={text =>
              handleTextChange({
                type: 'amount',
                payload: text,
              })
            }
            showError={showError && state.amount === 0}
            keyboardType="number-pad"
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={saved === 'Success'}
          handlePress={() => {
            if (state.accountNumber.length === 0 && state.amount === 0) {
              setShowError(true);
              return;
            }
            if (step.current === 0) {
              setLookup(true);
              step.current += 1;
              return;
            }
            if (step.current === 1 && data.data.status == 0) {
              SheetManager.show('confirmSendMoney', {
                payload: {
                  bill: props.payload.billCode,
                  amount: state.amount,
                  state,
                },
              });
            }
          }}>
          {isLoading ? 'Loading' : 'Proceed'}
        </PrimaryButton>
      </View>
    </ActionSheet>
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
export default SendMoneySheet;
