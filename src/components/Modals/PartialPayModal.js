/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import { useSelector } from 'react-redux';
import Picker from '../Picker';
import { Picker as RNPicker } from 'react-native-ui-lib';
import Input from '../Input';
import _ from 'lodash';

const options = [
  { value: 'CASH', label: 'Cash' },
  { value: 'MTNMM', label: 'MTN Mobile Money' },
  { value: 'ARTLM', label: 'AirtelTigo Money' },
  { value: 'VODAC', label: 'Vodafone Cash' },
];

const momoPayments = ['MTNMM', 'VODAC', 'TIGOC'];

const PartialPayModal = ({
  cashModal,
  toggleCashModal,
  toggleCashConfirmed,
  amount,
  setAmount,
  navigation,
  total,
  togglePatPayMomoConfirmed,
  patPaymentNumber,
  setPatPaymentNumber,
  paymentType,
  setPaymentType,
  togglePatOtpModal,
}) => {
  // const { user } = useSelector(state => state.auth);
  // const {} = useSelector(state => state.sale);
  // const { data, isLoading, isFetching } = useGetTransactionFee(
  //   mapPaymentToChannel[payment],
  //   amount,
  //   user.merchant,
  // );
  // const { subTotal } = useSelector(state => state.sale);
  // const { quickSaleInAction } = useSelector(state => state.quickSale);
  // const checkTotal = quickSaleInAction ? subTotal : total;
  const next = React.useRef(false);
  const [showError, setShowError] = React.useState(false);
  const { user } = useSelector(state => state.auth);

  return (
    <Modal
      modalState={cashModal}
      changeModalState={toggleCashModal}
      onModalHide={() => {
        if (next.current) {
          if (paymentType?.value === 'CASH') {
            toggleCashConfirmed(true);
            next.current = false;
          } else {
            if (
              user.user_permissions.includes('REQCUSOTP') &&
              momoPayments.includes(paymentType?.value)
            ) {
              togglePatOtpModal(true);
            } else {
              togglePatPayMomoConfirmed(true);
            }
          }
          next.current = false;
        }
      }}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleCashModal(false)}
          extraStyle={{ width: '92%' }}
        />

        <View style={styles.dropdownWrapper}>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'ReadexPro-Medium',
              fontSize: 16,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            GHS {total}
          </Text>
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
            width: '100%',
          }}>
          {paymentType && paymentType.value !== 'CASH' && (
            <Input
              placeholder="Enter Number"
              showError={showError && patPaymentNumber.length === 0}
              val={patPaymentNumber}
              setVal={setPatPaymentNumber}
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
          {showError && Number(amount) > Number(total) && (
            <Text style={{ fontFamily: 'ReadexPro-Regular', color: 'red' }}>
              Amount entered cannot be be greater than GHS{total}
            </Text>
          )}
        </View>
        <PrimaryButton
          style={styles.primaryButton}
          // disabled={amount.length === 0}
          handlePress={() => {
            if (!paymentType) {
              setShowError(true);
              return;
            }
            if (Number(amount) > Number(total)) {
              setShowError(true);
              return;
            }
            if (
              paymentType?.value !== 'CASH' &&
              patPaymentNumber.length === 0
            ) {
              setShowError(true);
              return;
            }

            toggleCashModal(false);
            next.current = true;
          }}>
          Proceed
        </PrimaryButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },

  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  group1: {
    flexDirection: 'row',
  },
  group2: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  textInput: {
    borderRadius: 4,
    backgroundColor: '#F5F7F9',
    width: '96%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontFamily: 'ReadexPro-Regular',
    color: '#30475E',
    fontSize: 16,
    paddingLeft: 14,
    marginTop: 12,
  },
  textInputWrapper: {
    width: '100%',
    paddingRight: 38,
  },
  option1Text: {
    color: 'rgba(48, 71, 94, 0.9)',
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
  },
  customerName: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  customerNumber: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
    width: '100%',
  },
  margin: {
    marginTop: 18,
    borderTopColor: 'solid rgba(146, 169, 189, 0.4)',
    borderTopWidth: 0.4,
    marginBottom: 6,
  },
  primary: { marginTop: 28 },
  container: {
    justifyContent: 'space-between',
  },
  paymentLabel: { width: '100%', alignItems: 'center' },
  paymentReceivedLabel: { width: '100%', alignItems: 'center', paddingTop: 40 },
  paymentReceivedText: {
    color: '#30475E',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    marginTop: 18,
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
  dropdownWrapper: {
    paddingHorizontal: 24,
    marginVertical: 12,
    marginTop: 16,
    width: '100%',
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
export default PartialPayModal;
