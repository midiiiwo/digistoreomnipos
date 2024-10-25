/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useAddMoneyToWallet } from '../../hooks/useAddMoneyToWallet';
import moment from 'moment';
import { useGetAccountBalance } from '../../hooks/useGetAccountBalance';
import Input from '../Input';

function AddMoneyAmount(props) {
  const { user } = useSelector(state => state.auth);
  // const { idx } = useRadioButton();
  const [amount, setAmount] = React.useState('');
  const [transferStatus, setTransferStatus] = React.useState();
  const [showError, setShowError] = React.useState(false);

  const { network, number, networkCode, navigation } = props.payload;

  const { mutate, isLoading } = useAddMoneyToWallet(setTransferStatus);
  const { data } = useGetAccountBalance(user.user_merchant_account);
  const toast = useToast();

  React.useEffect(() => {
    if (transferStatus) {
      if (transferStatus.status != '0') {
        SheetManager.hide('addMoneyAmount');
        toast.show(transferStatus.message, {
          placement: 'top',
          type: 'danger',
          duration: 7000,
        });
        return;
      }
      SheetManager.hide('addMoneyAmount');
      navigation.navigate('Add Money Status', {
        transferStatus,
      });
    }
  }, [transferStatus, navigation, toast]);
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
          borderRadius: 0,
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
              marginTop: 4,
            }}>
            {network}
          </Text>
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              fontSize: 15,
              color: '#6B728E',
              marginBottom: 14,
              marginTop: 4,
            }}>
            {number}
          </Text>
          <Input
            placeholder="Enter Amount"
            val={amount}
            setVal={text => setAmount(text)}
            style={{ width: '100%', backgroundColor: '#fff' }}
            keyboardType="number-pad"
            showError={showError && amount.length === 0}
          />
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            if (amount.length === 0) {
              setShowError(true);
              return;
            }
            const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
            if (data && data.data && data.data.data && data.data.status == 0) {
              mutate({
                account_no: user.user_merchant_account,
                last_bal:
                  (data &&
                    data.data &&
                    data.data.data &&
                    data.data.data.current_balance) ||
                  0,
                tran_amt: amount,
                mobilenumber: number,
                channel: networkCode,
                voucher_code: '',
                notify_source: 'Digistore Business',
                notify_device: 'Android',
                mod_date: mod_date,
                mod_by: user.login,
              });
            }
          }}
          disabled={isLoading}>
          {isLoading ? 'Processing' : 'Proceed'}
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
export default AddMoneyAmount;
