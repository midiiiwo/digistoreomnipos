/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  InteractionManager,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useGetOutletCategories } from '../../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import Bin from '../../../assets/icons/delcross';

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
    case 'number':
      return { ...state, number: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    default:
      return state;
  }
};

function BuyArtimeSheet(props) {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const step = React.useRef(0);
  const [lookUp, setLookup] = React.useState(false);
  const next = React.useRef(false);

  const [state, dispatch] = React.useReducer(reducer, {
    number: '',
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

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      openAnimationConfig={{
        delay: 0,
      }}
      closeOnTouchBackdrop={false}
      containerStyle={styles.containerStyle}
      onClose={() => {
        console.log('neerererere', next);
        if (next.current) {
          InteractionManager.runAfterInteractions(() =>
            SheetManager.show('confirmAirtimePayment', {
              payload: {
                airtime: props.payload.airtimeCode,
                amount: state.amount,
                state,
                navigation: props.payload.navigation,
              },
            }),
          );
          next.current = false;
        }
      }}
      indicatorStyle={styles.indicatorStyle}>
      <View>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'Inter-Medium',
              paddingTop: 18,
              fontSize: 16,
              textAlign: 'center',
            }}>
            {props.payload.airtime}
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('buyAirtime')}
            style={{ marginLeft: 'auto', paddingVertical: 12 }}>
            <Bin />
          </Pressable>
        </View>
        {/* <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginTop: 14,
          }}>
          {props.payload.airtime}
        </Text> */}
        <View style={styles.main}>
          <Input
            placeholder="Receipient number"
            val={state.number}
            setVal={text =>
              handleTextChange({
                type: 'number',
                payload: text,
              })
            }
            showError={showError && state.number.length === 0}
            keyboardType="phone-pad"
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
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={state.number.length < 10 || state.amount <= 0}
          handlePress={() => {
            if (state.number.length === 0 || state.amount === 0) {
              setShowError(true);
              return;
            }
            next.current = true;
            SheetManager.hide('buyAirtime');
          }}>
          Proceed
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 84,
    // marginTop: 10,
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
    bottom: 12,
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
export default BuyArtimeSheet;
