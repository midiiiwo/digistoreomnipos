/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
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
    notify_device: '',
    notify_source: Platform.OS === 'ios' ? 'IOS' : 'ANDROIDPOS',
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
              fontFamily: 'ReadexPro-Medium',
              fontSize: 17,
              color: '#30475e',
              marginBottom: 10,
              marginTop: 14,
            }}>
            Transfer Commission
          </Text>
          {transferStatus && (
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                fontSize: 14,
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
            style={{ width: '100%', backgroundColor: '#fff' }}
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
