/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { DateTimePicker } from 'react-native-ui-lib';
import Lottie from 'lottie-react-native';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useServiceChargeFee } from '../../hooks/useServiceChargeFee';
import LoadingModal from '../LoadingModal';
import PrimaryButton from '../PrimaryButton';
import Loading from '../Loading';
import { usePayBill } from '../../hooks/usePayBill';
import { Input } from './AddProductSheet';
import Picker from '../Picker';

function ConfirmBillPayment(props) {
  const { bill, name, amountDue, accountNumber, message, mobileNumber } =
    props.payload;
  const [amount, setAmount] = React.useState('');
  const [dataPlan, setDataPlan] = React.useState(null);
  const [showError, setShowError] = React.useState(false);

  // console.log(JSON.parse(dataPlan.value).planPrice);

  console.log('======', message);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      // snapPoints={[50]}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: '#59CE8F',
              fontFamily: 'SQ Market Regular Regular',
              fontSize: 14,
            }}>
            Account number validation passed
          </Text>
          {bill !== 'SURF' && bill !== 'BUSY' && (
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
        {bill !== 'SURF' && bill !== 'BUSY' && (
          <Input
            placeholder="Account name (Optional)"
            val={name}
            setVal={text => setAmount(text)}
            editable={false}
          />
        )}
        {bill !== 'SURF' && bill !== 'BUSY' && (
          <Input
            placeholder="Amount"
            val={amount}
            setVal={text => setAmount(text)}
            keyboardType="number-pad"
          />
        )}
        {(bill === 'SURF' || bill === 'BUSY') && (
          <View>
            <Picker
              placeholder="Choose Surfline Data plan"
              showError={!dataPlan && showError}
              value={dataPlan}
              setValue={item => {
                setDataPlan(item);
              }}>
              {message &&
                message.map(item => {
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
          disabled={amount.length === 0 && dataPlan === null}
          handlePress={() => {
            if (amount.length === 0 && !dataPlan) {
              setShowError(true);
              return;
            }
            SheetManager.hideAll();
            props.payload.navigation.navigate('Bill Confirmed', {
              name,
              amount:
                amount.length > 0
                  ? amount
                  : JSON.parse(dataPlan.value).planPrice,
              bill,
              accountNumber,
              mobileNumber,
            });
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
