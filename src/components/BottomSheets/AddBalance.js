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
import { useReceiveQuickPayment } from '../../hooks/useReceiveQuickPayment';
import Bin from '../../../assets/icons/delcross';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';

const options = [
  { value: 'CASH', label: 'Cash' },
  { value: 'MTNMM', label: 'MTN Mobile Money' },
  { value: 'ARTLM', label: 'AirtelTigo Money' },
  { value: 'VODAC', label: 'Vodafone Cash' },
];

const AddBalance = props => {
  const [paymentType, setPaymentType] = React.useState();
  const [amount, setAmount] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  // const [paymentStatus, setPaymentStatus] = React.useState();
  const client = useQueryClient();
  const next = React.useRef(false);

  const { name, phone, email, setInvoice, setBalanceInstructions, type } =
    props.payload;
  const { user } = useSelector(state => state.auth);
  const { mutate, isLoading } = useReceiveQuickPayment(i => {
    if (i) {
      if (i.status == 0) {
        if (paymentType && paymentType.value === 'CASH') {
          client.invalidateQueries('customer-details');
          client.invalidateQueries('merchant-customers');
          client.invalidateQueries('summary-filter');
          client.invalidateQueries('all-orders');
        }
        setInvoice(i);
        SheetManager.hide('Add Balance');
        next.current = true;
      }
    }
  });

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
          <Text
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
            {type === 'DEBIT' ? 'Pay Balance' : 'Add Balance'}
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('Add Balance')}
            style={{ marginLeft: 'auto', paddingVertical: 12 }}>
            <Bin />
          </Pressable>
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
          <Input
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
          />
        </View>
        <View style={styles.btnWrapper}>
          <PrimaryButton
            style={styles.btn}
            disabled={
              amount.length === 0 ||
              (paymentType &&
                paymentType.value !== 'CASH' &&
                number.length !== 10) ||
              !paymentType ||
              isLoading
            }
            handlePress={() => {
              if (amount.length === 0) {
                setShowError(true);
                return;
              }
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
              mutate({
                name,
                phone,
                email,
                description: '',
                vendor: user.user_merchant_receivable,
                amount,
                channel: (paymentType && paymentType.value) || '',
                mobilenumber: number,
                notify_source: 'DIGISTORE BUSINESS',
                outlet: Number(user.outlet),
                instruction:
                  type === 'CREDIT' ? 'CREDIT ADJUSTMENT' : 'SETTLE DEBT',
                mod_by: user.login,
              });
            }}>
            {isLoading ? 'Processing' : 'Proceed'}
          </PrimaryButton>
        </View>
      </View>
    </ActionSheet>
  );
};

export default AddBalance;
const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
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
