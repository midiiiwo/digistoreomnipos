/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useServiceChargeFee } from '../../hooks/useServiceChargeFee';
import LoadingModal from '../LoadingModal';
import PrimaryButton from '../PrimaryButton';
import { useSendMoney } from '../../hooks/useSendMoney';
import moment from 'moment';
import { useLookupAccount } from '../../hooks/useLookupAccount';
import { useNavigation } from '@react-navigation/native';
import { useAddExpense } from '../../containers/CreateExpense';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import BankIcon from '../BankIcon';

const mapBillerIdToLookupName = {
  SMTNMM: 'mtn',
  SARTLM: 'airtelTigo',
  STIGOC: 'airtelTigo',
  SVODAC: 'vodafone',
};

function ConfirmSendMoney(props) {
  const [payStatus, setPayStatus] = React.useState();
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const { bill, amount, state, lookup, checkAsExpense, sendMoneyCategory } =
    props.payload;

  console.log(state);

  const { data, isLoading } = useServiceChargeFee(bill, amount, user.merchant);
  const { data: lookupData, isLoading: isLookupLoading } = useLookupAccount(
    mapBillerIdToLookupName[props.payload.lookup],
    state.accountNumber && state.accountNumber.replace(' ', ''),
    lookup && state.accountNumber.length > 0,
  );
  const client = useQueryClient();
  const toast = useToast();

  const addExpense = useAddExpense(res => {
    if (res) {
      if (res) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        toast.show(res?.message, { placement: 'top' });
        SheetManager.hide('confirmSendMoney');

        navigation.navigate('Send Money Status', {
          payStatus,
          name: lookupData.data.name,
          number: state.accountNumber,
          description: state.description,
          serviceProvider: lookup,
          amount: data?.data?.amount,
        });
      }
    }
  });

  const { mutate, isLoading: isSendMoneyLoading } = useSendMoney(res => {
    if (res) {
      setPayStatus(res);
      if (res.status == 0) {
        if (checkAsExpense) {
          const payload = {
            name: state.description,
            category: sendMoneyCategory?.id,
            mod_by: user?.login,
            merchant: user?.merchant,
            total_amount: data?.data?.amount,
            amount_paid: data?.data?.amount,
            occurance: 'NONE',
            notify_device: Platform.OS,
            notify_source: 'Digistore Business',
            date: moment(new Date()).format('DD-MM-YYYY'),
          };
          addExpense.mutate(payload);
        } else {
          SheetManager.hide('confirmSendMoney');
          navigation.navigate('Send Money Status', {
            payStatus: res,
            name: lookupData.data.name,
            number: state.accountNumber,
            description: state.description,
            serviceProvider: lookup,
            amount: data?.data?.amount,
          });
        }
      } else {
        SheetManager.hide('confirmSendMoney');
        navigation.navigate('Send Money Status', {
          payStatus: res,
          name: lookupData.data.name,
          number: state.accountNumber,
          description: state.description,
          serviceProvider: lookup,
          amount: data?.data?.amount,
        });
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
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      closeOnTouchBackdrop={false}
      // snapPoints={[50]}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <Pressable
          style={{ marginLeft: 'auto', paddingVertical: 12 }}
          onPress={() => SheetManager.hide('confirmSendMoney')}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 16,
              color: '#DF2E38',
            }}>
            Cancel
          </Text>
        </Pressable>
        {(isLoading || isLookupLoading) && <LoadingModal />}
        {!isLoading &&
          !isLookupLoading &&
          lookupData &&
          lookupData.data &&
          lookupData.data.status == 0 &&
          data &&
          data.data &&
          data.data.status == 0 && (
            <View>
              <View style={styles.confirmWrapper}>
                <Text style={styles.confirm}>
                  Confirm payment of GHS {data && data.data && data.data.amount}{' '}
                  to
                </Text>
                <View style={styles.imgWrapper}>
                  {lookup === 'SMTNMM' ? (
                    <Image
                      source={require('../../../assets/images/mtn-momo.png')}
                      style={styles.img}
                    />
                  ) : lookup === 'SVODAC' ? (
                    <Image
                      source={require('../../../assets/images/voda-cash.png')}
                      style={styles.img}
                    />
                  ) : lookup === 'SARTLM' ? (
                    <Image
                      source={require('../../../assets/images/atmoney.png')}
                      style={styles.img}
                    />
                  ) : lookup === 'SBANK' ? (
                    <BankIcon bank={state?.bank?.value} />
                  ) : (
                    <></>
                  )}

                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Regular',
                      color: '#304753',
                      fontSize: 15,
                      marginLeft: 12,
                    }}>
                    {state.accountNumber}
                  </Text>
                </View>
                <View>
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Regular',
                        color: '#30475e',
                        fontSize: 14,
                        // marginLeft: 12,
                      }}>
                      Recipient/Beneficiary Name:
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#512B81',
                        fontSize: 15,
                        marginTop: 3,
                        width: '90%',
                        textAlign: 'left',
                        // marginLeft: 16,
                      }}>
                      {(lookupData &&
                        lookupData.data &&
                        lookupData.data.status == 0 &&
                        lookupData.data.name) ||
                        'No Account found'}
                    </Text>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#30475e',
                        fontSize: 14,
                        // marginLeft: 12,
                      }}>
                      Payment Description:
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#512B81',
                        fontSize: 14,
                        marginTop: 3,
                        width: '90%',
                        textAlign: 'left',
                        // marginLeft: 16,
                      }}>
                      {state && state.description}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 18 }}>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.text}>Amount</Text>
                  <Text
                    style={[
                      styles.text,
                      { marginLeft: 'auto', marginRight: 12 },
                    ]}>
                    GHS {data.data.amount}
                  </Text>
                </View>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.text}>Service Charge</Text>
                  <Text
                    style={[
                      styles.text,
                      { marginLeft: 'auto', marginRight: 12 },
                    ]}>
                    GHS {data.data.charge}
                  </Text>
                </View>
                <>
                  {payStatus && payStatus.commission !== undefined ? (
                    <View style={styles.detailsWrapper}>
                      <Text style={styles.text}>Commission</Text>
                      <Text
                        style={[
                          styles.text,
                          { marginLeft: 'auto', marginRight: 12 },
                        ]}>
                        GHS {payStatus && payStatus.commission}
                      </Text>
                    </View>
                  ) : null}
                </>
                <View
                  style={[
                    styles.detailsWrapper,
                    // { borderBottomColor: '#ddd', borderBottomWidth: 0.4 },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 15, fontFamily: 'ReadexPro-Medium' },
                    ]}>
                    Total
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        marginLeft: 'auto',
                        marginRight: 12,
                        fontFamily: 'ReadexPro-Medium',
                        fontSize: 15,
                      },
                    ]}>
                    GHS {data.data.total}
                  </Text>
                </View>
              </View>
            </View>
          )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            let mod_date = moment().format('YYYY-MM-DD h:mm:ss');
            if (bill === 'SBANK') {
              const payload = {
                recipient: state.accountNumber || '',
                merchant_code: user.user_merchant_receivable,
                amount: state.amount,
                mod_by: user.login || '',
                reference: state.description,
                pay_date: mod_date,
                pay_channel: 'SBANK',
                notify_source: 'Digistore Business',
                notify_device: Platform.OS,
                mod_date: mod_date,
                bank_name: state.bank?.label,
                bank_branch: state.branch?.label,
                bank_code: state.bank?.value,
                merchant: user?.merchant,
              };
              mutate(payload);
              return;
            }
            mutate({
              recipient: state.accountNumber || '',
              merchant_code: user.user_merchant_receivable,
              amount: (data && data.data && data.data.amount) || 0,
              mod_by: user.login || '',
              reference: state.description,
              pay_date: mod_date,
              pay_channel: bill,
              notify_source: 'Digistore Business',
              notify_device: Platform.OS,
              mod_date: mod_date,
            });
          }}
          disabled={isSendMoneyLoading}>
          {isSendMoneyLoading ? 'Processing' : 'Pay'}
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
    paddingTop: 8,
    paddingHorizontal: 22,
    marginBottom: 82,
  },
  img: { height: 48, width: 48, borderRadius: 118 },
  imgWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
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
    paddingHorizontal: 5,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    paddingVertical: 12,
    // marginTop: 18,
  },
  text: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#30475e',
  },
  confirm: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475e',
  },
  confirmWrapper: {
    // alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 12,
  },
});

export default ConfirmSendMoney;
