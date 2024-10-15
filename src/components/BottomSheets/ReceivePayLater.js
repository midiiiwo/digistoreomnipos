/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  InteractionManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
// import { Picker } from '@react-native-picker/picker';
import Picker from '../Picker';
import { Picker as RNPicker } from 'react-native-ui-lib';
import _ from 'lodash';
import Input from '../Input';
import PrimaryButton from '../PrimaryButton';
import Bin from '../../../assets/icons/delcross';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { useMutation } from 'react-query';

const options = [
  { value: 'CASH', label: 'Cash' },
  { value: 'MTNMM', label: 'MTN Mobile Money' },
  { value: 'TIGOC', label: 'AirtelTigo Money' },
  { value: 'VODAC', label: 'Vodafone Cash' },
];

import { receivePayLater } from '../../api/orders';
import { useGetTransactionFee } from '../../hooks/useGetTransactionFee';
import { useToast } from 'react-native-toast-notifications';

export function useReceivePayLater(handleSuccess) {
  const queryResult = useMutation(
    ['receive-pay-later'],
    payload => receivePayLater(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

const ReceivedPayLater = props => {
  const [paymentType, setPaymentType] = React.useState();
  const [number, setNumber] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  // const [amount, setAmout] = React.useState('');
  const client = useQueryClient();
  const next = React.useRef(false);

  const orderDetails = props.payload?.item;
  const setInvoice = props.payload?.setInvoice;
  const setBalanceInstructions = props.payload?.setBalanceInstructions;
  const { user } = useSelector(state => state.auth);
  const { data } = useGetTransactionFee(
    paymentType?.value,
    orderDetails?.total_amount,
    user.merchant,
    paymentType !== null,
  );

  const toast = useToast();

  const { mutate, isLoading } = useReceivePayLater(res => {
    if (res) {
      if (paymentType?.value === 'CASH') {
        client.invalidateQueries([
          'selected-order',
          user?.merchant,
          orderDetails?.order_no,
        ]);
      }
      setInvoice(res);
      SheetManager.hide('Receive PayLater');
      next.current = true;
    }
  });

  const transactionFee = data?.data;

  console.log('feeeeeee', transactionFee);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      closeOnTouchBackdrop={false}
      openAnimationConfig={{ bounciness: 0 }}
      migrateTextField
      onClose={() => {
        InteractionManager.runAfterInteractions(() => {
          if (next.current) {
            setBalanceInstructions(true);
            next.current = false;
          }
        });
      }}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
          }}>
          {/* <Text
            style={{
              color: '#30475e',
              fontFamily: 'ReadexPro-Medium',
              fontSize: 15,
              textAlign: 'center',
              alignSelf: 'center',
              position: 'absolute',
              left: 0,
              right: 0,
            }}>
            Pay Balance
          </Text> */}
          <Pressable
            onPress={() => SheetManager.hide('Receive PayLater')}
            style={{ marginLeft: 'auto', paddingVertical: 12 }}>
            <Bin />
          </Pressable>
        </View>
        <View>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'ReadexPro-bold',
              fontSize: 16.8,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            GHS {orderDetails?.total_amount}
          </Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <Picker
            placeholder="Select Payment Method"
            floatingPlaceholder
            value={paymentType}
            showError={showError && !paymentType}
            // enableModalBlur={false}

            setValue={item => {
              setPaymentType(item);
            }}
            // useNativePicker
            // topBarProps={{ title: 'Delivery options' }}
            // searchPlaceholder={'Search a language'}
            migrateTextField>
            {_.map(options, option => (
              <RNPicker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </Picker>
        </View>
        <View
          style={{
            paddingHorizontal: 18,
            marginBottom: Dimensions.get('window').height * 0.05,
          }}>
          {paymentType && paymentType.value !== 'CASH' && (
            <Input
              placeholder="Enter Number"
              showError={showError && number.length === 0}
              val={number}
              setVal={setNumber}
              keyboardType="phone-pad"
            />
          )}
          {/* <Input
            placeholder="Enter Amount"
            showError={
              showError &&
              paymentType &&
              paymentType.value !== 'CASH' &&
              amount.length === 0
            }
            val={amount}
            keyboardType="number-pad"
            setVal={setAmount}
          /> */}
        </View>
        <View style={styles.btnWrapper}>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'ReadexPro-Regular',
              fontSize: 14,
              textAlign: 'right',
              marginBottom: 12,
              marginRight: 16,
            }}>
            Service Fee: GHS {transactionFee?.charge || 0}
          </Text>
          <PrimaryButton
            style={styles.btn}
            disabled={
              (paymentType &&
                paymentType.value !== 'CASH' &&
                number.length !== 10) ||
              !paymentType ||
              isLoading
            }
            handlePress={() => {
              if (
                paymentType &&
                paymentType.value !== 'CASH' &&
                number.length !== 10
              ) {
                setShowError(true);
                return;
              }
              if (!paymentType) {
                setShowError(true);
                return;
              }
              if (
                transactionFee?.charge === null &&
                paymentType?.value !== 'CASH'
              ) {
                toast.show('Fetching transaction fee', { placement: 'top' });
                return;
              }
              const payload = {
                total_amount: orderDetails?.total_amount,
                service_charge: transactionFee?.charge || 0,
                payment_invoice: orderDetails?.payment_invoice,
                payment_number: number.length > 0 ? number : '0000000000',
                payment_network: paymentType?.value,
                payment_receipt: '',
                secret: '',
                customer: '',
                merchant: user?.merchant,
                mod_by: user?.login,
              };
              mutate(payload);
            }}>
            {isLoading ? 'Processing' : 'Proceed'}
          </PrimaryButton>
        </View>
      </View>
    </ActionSheet>
  );
};

export default ReceivedPayLater;
const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
    width: Dimensions.get('window').width * 0.5,
  },
  picker: {
    borderWidth: 3,
    borderColor: '#ddd',
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  btnWrapper: {
    // position: 'absolute',
    bottom: 12,
    // alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  dropdownWrapper: {
    paddingHorizontal: 24,
    marginVertical: 12,
    marginTop: 16,
  },
  mainText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475e',
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    borderRadius: 5,
  },
  textStyle: {
    fontFamily: 'Inter-Regular',
    color: '#30475E',
  },
  dropdownContainer: {
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    paddingVertical: 6,
  },

  itemStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  labelStyle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#30475E',
  },
});
