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
  Dimensions,
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

const mapBillerIdToLookupName = {
  SMTNMM: 'mtn',
  SARTLM: 'airtelTigo',
  STIGOC: 'airtelTigo',
  SVODAC: 'vodafone',
};

function ConfirmSendMoney(props) {
  const [payStatus, setPayStatus] = React.useState();
  const { user } = useSelector(state => state.auth);
  const { bill, amount, state, lookup, navigation } = props.payload;
  const { data, isLoading } = useServiceChargeFee(bill, amount, user.merchant);
  const { mutate, isLoading: isSendMoneyLoading } = useSendMoney(setPayStatus);
  const { data: lookupData, isLoading: isLookupLoading } = useLookupAccount(
    mapBillerIdToLookupName[props.payload.lookup],
    state.accountNumber,
    lookup && state.accountNumber.length > 0,
  );

  React.useEffect(() => {
    if (payStatus) {
      navigation.navigate('Send Money Status', {
        payStatus,
        name: lookupData.data.name,
        number: state.accountNumber,
        description: state.description,
        serviceProvider: lookup,
        amount: data && data.data && data.data.amount,
      });
      SheetManager.hideAll();
    }
  }, [payStatus, navigation, lookupData, state, lookup, data]);
  console.log(lookup);
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
          onPress={() => SheetManager.hideAll()}>
          <Text
            style={{
              fontFamily: 'Lato-Medium',
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
                  to:
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
                      source={require('../../../assets/images/AirtelTigo-Money.jpeg')}
                      style={styles.img}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/images/AirtelTigo-Money.jpeg')}
                      style={styles.img}
                    />
                  )}

                  <Text
                    style={{
                      fontFamily: 'Lato-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      marginLeft: 12,
                    }}>
                    {state.accountNumber}
                  </Text>
                </View>
                <View>
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        color: '#30475e',
                        fontSize: 14,
                        // marginLeft: 12,
                      }}>
                      Recepient/Beneficiary Name:
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Semibold',
                        color: '#30475e',
                        fontSize: 16,
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
                        fontFamily: 'Lato-Medium',
                        color: '#30475e',
                        fontSize: 14,
                        // marginLeft: 12,
                      }}>
                      Payment Description:
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Semibold',
                        color: '#30475e',
                        fontSize: 16,
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
                      { fontSize: 16, fontFamily: 'Inter-Medium' },
                    ]}>
                    Total
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        marginLeft: 'auto',
                        marginRight: 12,
                        fontFamily: 'Inter-Medium',
                        fontSize: 16,
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
            mutate({
              // name: state.accountName || '',
              // email: state.customerEmail || '',
              // contact_no: state.customerNumber || '',
              recipient: state.accountNumber || '',
              merchant_code: user.user_merchant_receivable,
              amount: (data && data.data && data.data.amount) || 0,
              mod_by: user.login || '',
              reference: state.description,
              pay_date: mod_date,
              pay_channel: bill,
              notify_source:
                Platform.OS === 'ios' ? 'IOS V2' : 'ANDROID POS V2',
              notify_device:
                Platform.OS === 'ios' ? 'IOS V2' : 'ANDROID POS V2',
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
    width: Dimensions.get('window').width * 0.5,
  },
  main: {
    // height: '40%',
    paddingTop: 8,
    paddingHorizontal: 22,
    width: '100%',
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
    fontFamily: 'Lato-Semibold',
    fontSize: 16,
    color: '#30475e',
  },
  confirm: {
    fontFamily: 'Lato-Medium',
    fontSize: 16,
    color: '#30475e',
  },
  confirmWrapper: {
    // alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 12,
  },
});

export default ConfirmSendMoney;
