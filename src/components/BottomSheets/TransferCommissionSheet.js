/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import { RadioButtonProvider } from '../../context/RadioButtonContext';
import RadioButton from '../RadioButton';
import { useRadioButton } from '../../hooks/useRadioButton';
import { useTransferCommission } from '../../hooks/useTransferCommission';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';

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
        borderWidth: 1.2,
        borderRadius: 5,
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

function TransferCommissionSheet(props) {
  const { user } = useSelector(state => state.auth);
  // const { idx } = useRadioButton();
  const [amount, setAmount] = React.useState('');
  const [transferStatus, setTransferStatus] = React.useState();

  const client = useQueryClient();

  const { mutate, isLoading } = useTransferCommission(i => {
    setTransferStatus(i);
    client.invalidateQueries('account-balance');
  });

  const payload = {
    account: user.user_merchant_account,
    type: 'CREDIT',
    amount,
    dest: 'MAIN',
    notify_device: Platform.OS === 'ios' ? 'IOS V2' : 'ANDROID POS V2',
    notify_source: Platform.OS === 'ios' ? 'IOS V2' : 'ANDROID POS V2',
    mod_by: user.login,
  };

  const toast = useToast();

  React.useEffect(() => {
    if (transferStatus && transferStatus.status == '0') {
      SheetManager.hide('transferCommission');
      toast.show(transferStatus.message, {
        duration: 10000,
        type: 'success',
        successColor: '#00ABB3',
        placement: 'top',
      });
      setTransferStatus(null);
    }
  }, [transferStatus, toast]);
  // console.log(idx);
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
      <View
        style={{
          // height: '96%',
          borderRadius: 0,
          // backgroundColor: '#fff',
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 18,
            marginBottom: 88,
          }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 18,
              color: '#30475e',
              marginBottom: 16,
              marginTop: 2,
            }}>
            Transfer Commission
          </Text>
          {transferStatus && (
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 15,
                color:
                  transferStatus && transferStatus.status == '99'
                    ? '#EB455F'
                    : '#30475e',
                textAlign: 'center',
                marginBottom: 12,
              }}>
              {transferStatus && transferStatus.message}
            </Text>
          )}
          <Input
            placeholder="Enter Amount to Transfer"
            val={amount}
            setVal={text => setAmount(text)}
            style={{
              width: '95%',
              backgroundColor: '#fff',
              marginBottom: Dimensions.get('window').width * 0.02,
              height: 55,
              fontSize: 17,
              fontFamily: 'SFProDisplay-Regular',
            }}
            keyboardType="number-pad"
          />
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            mutate(payload);
          }}
          disabled={isLoading}>
          {isLoading ? 'Processing' : 'Transfer'}
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
    // borderRadius: 0,
  },
  // indicatorStyle: {
  //   display: 'flex',
  // },
  containerStyle: {
    borderRadius: 0,
    width: Dimensions.get('window').width * 0.5,
  },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    backgroundColor: '#fff',
    height: 55,
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
export default TransferCommissionSheet;
