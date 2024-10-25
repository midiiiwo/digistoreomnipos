/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { Picker as RNPicker } from 'react-native-ui-lib';
import PrimaryButton from '../PrimaryButton';
import Input from '../Input';
import Picker from '../Picker';
import Bin from '../../../assets/icons/delcross';
import { useToast } from 'react-native-toast-notifications';
import { isArray } from 'lodash';
import { useNavigation } from '@react-navigation/native';

function ConfirmBillPayment(props) {
  const {
    bill,
    name,
    amountDue,
    accountNumber,
    message,
    mobileNumber,
    amountPrev,
    billName,
    checkAsExpense,
    billCategory,
  } = props?.payload;
  const [amount, setAmount] = React.useState('');
  const [dataPlan, setDataPlan] = React.useState(null);
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();

  // console.log(JSON.parse(dataPlan.value).planPrice);
  const navigation = useNavigation();

  React.useState(() => {
    if (bill !== 'SURF' && bill !== 'BUSY') {
      setAmount(amountPrev);
    }
  }, []);

  console.log('biii', bill);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      springOffset={50}
      // snapPoints={[50]}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => SheetManager.hide('confirmBillPayment')}
            style={{ marginLeft: 'auto', paddingVertical: 5 }}>
            <Bin />
          </Pressable>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: '#59CE8F',
              fontFamily: 'SQ Market Regular Regular',
              fontSize: 14,
            }}>
            Account number validation passed
          </Text>
          {bill !== 'SURF' && bill !== 'BUSY' && !isArray(message) && (
            <Text
              style={{
                color: '#30475e',
                fontFamily: 'Inter-Medium',
                fontSize: 15,
                marginVertical: 12,
              }}>
              Amount due on account: GHS {amountDue}
            </Text>
          )}
        </View>
        {bill !== 'SURF' && bill !== 'BUSY' && !isArray(message) && (
          <Input
            placeholder="Account name (Optional)"
            val={name}
            editable={false}
          />
        )}
        {bill !== 'SURF' && bill !== 'BUSY' && !isArray(message) && (
          <Input
            placeholder="Amount"
            val={amount}
            setVal={text => setAmount(text)}
            keyboardType="number-pad"
          />
        )}
        {(bill === 'SURF' || bill === 'BUSY' || isArray(message)) && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <Picker
              placeholder="Choose Data plan"
              showError={!dataPlan && showError}
              value={dataPlan}
              setValue={item => {
                setDataPlan(item);
              }}>
              {message?.map(item => {
                return (
                  <RNPicker.Item
                    key={item.planName}
                    label={item.planDescription}
                    value={JSON.stringify(item)}
                  />
                );
              })}
            </Picker>
          </View>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          // disabled={amount.length === 0 && dataPlan === null}
          handlePress={() => {
            if (amount.length === 0 && !dataPlan) {
              toast.show('Please enter amount or select plan', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            console.log('heeeeddd', dataPlan);
            try {
              navigation.navigate('Bill Confirmed', {
                name,
                amount:
                  amount?.toString()?.length > 0
                    ? amount
                    : JSON.parse(dataPlan?.value || '')?.planPriceValue,
                bill,
                accountNumber,
                mobileNumber,
                billName,
                billCategory,
                checkAsExpense,
                priceValue: JSON.parse(dataPlan?.value || '{}')?.planPriceValue,
                pricePlan: JSON.parse(dataPlan?.value || '{}')?.planPrice,
              });
              SheetManager.hide('confirmBillPayment');
            } catch (error) {
              console.log('eerrr', error);
            }
            // mutate({
            //   name: state.accountName || '',
            //   email: state.customerEmail || '',
            //   contactno: state.customerNumber || '',
            //   billaccount: state.accountNumber || '',
            //   vendor: bill || '',
            //   amount: (data && data.data && data.data.amount) || 0,
            //   merchant: user.user_merchant_id || '',
            //   mod_by: user.login || '',
            // });
          }}>
          {/* {isPayBillLoading ? 'Loading' : 'Pay'} */}
          Proceed
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    // height: '40%',
    paddingTop: 18,
    paddingHorizontal: 22,
    marginBottom: 82,
    paddingBottom: 14,
  },

  btnWrapper: {
    position: 'absolute',
    bottom: 14,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.4,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  detailsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    paddingVertical: 12,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#30475e',
  },
  confirm: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#30475e',
  },
  confirmWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default ConfirmBillPayment;
