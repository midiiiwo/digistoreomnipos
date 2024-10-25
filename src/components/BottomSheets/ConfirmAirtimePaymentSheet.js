/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useServiceChargeFee } from '../../hooks/useServiceChargeFee';
import LoadingModal from '../LoadingModal';
import PrimaryButton from '../PrimaryButton';
import { useBuyAirtime } from '../../hooks/useBuyAirtime';
import moment from 'moment';
import Bill from '../../../assets/icons/delcross';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useAddExpense } from '../../containers/CreateExpense';

const mapCodeToProvider = {
  AIRTEL: 'AirtelTigo Top-up',
  GLO: 'Glo Top-up',
  MTN: 'Mtn Top-up',
  VODAFONE: 'Vodafone Top-up',
};

function ConfirmAirtimePayment(props) {
  const [payStatus, setPayStatus] = React.useState();
  const { user } = useSelector(state => state.auth);
  const { airtime, amount, state, checkAsExpense, airtimeCategory } =
    props.payload;
  const { data, isLoading } = useServiceChargeFee(
    airtime,
    amount,
    user.merchant,
  );

  const toast = useToast();
  const client = useQueryClient();

  const addExpense = useAddExpense(res => {
    if (res) {
      if (res) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        toast.show(res?.message, { placement: 'top' });

        SheetManager.hide('confirmAirtimePayment');
        props.payload.navigation.navigate('Airtime Status', {
          amount: data?.data?.total,
          number: state.number,
          payStatus,
          bill: airtime,
        });
      }
    }
  });

  const { mutate, isLoading: isBuyAirtimeLoading } = useBuyAirtime(res => {
    if (res) {
      setPayStatus(res);
      if (res.status == 0) {
        if (checkAsExpense) {
          const payload = {
            name: state.description,
            category: airtimeCategory?.id,
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
          SheetManager.hide('confirmAirtimePayment');
          props.payload.navigation.navigate('Airtime Status', {
            amount: data?.data?.total,
            number: state.number,
            payStatus: res,
            bill: airtime,
          });
        }
      } else {
        SheetManager.hide('confirmAirtimePayment');
        props.payload.navigation.navigate('Airtime Status', {
          amount: data?.data?.total,
          number: state.number,
          payStatus: res,
          bill: airtime,
        });
      }
    }
  });

  // React.useEffect(() => {
  //   if (payStatus) {
  //     SheetManager.hide('confirmAirtimePayment');
  //     props.payload.navigation.navigate('Airtime Status', {
  //       amount: data && data.data && data.data.total,
  //       number: state.number,
  //       payStatus,
  //       bill: airtime,
  //     });
  //   }
  // }, [payStatus, props.payload.navigation, data, state.number, airtime]);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      closeOnTouchBackdrop={false}
      springOffset={50}
      // snapPoints={[50]}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        {isLoading && <LoadingModal />}
        {!isLoading && data && data.data && data.data.status == 0 && (
          <View>
            <Pressable
              onPress={() => SheetManager.hide('confirmAirtimePayment')}
              style={{ marginLeft: 'auto' }}>
              <Bill />
            </Pressable>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Semibold',
                color: '#30475e',
                textAlign: 'center',
                fontSize: 15,
              }}>
              {(mapCodeToProvider[airtime] || '').toUpperCase()}
            </Text>
            <View style={styles.confirmWrapper}>
              <Text style={styles.confirm}>
                {`Confirm Airtime Top-up of GHS ${state.amount} to ${state.number}`}
              </Text>
            </View>
            <View style={styles.detailsWrapper}>
              <Text style={styles.text}>Amount</Text>
              <Text
                style={[styles.text, { marginLeft: 'auto', marginRight: 12 }]}>
                GHS {data.data.amount}
              </Text>
            </View>
            <View style={styles.detailsWrapper}>
              <Text style={styles.text}>Service Charge</Text>
              <Text
                style={[styles.text, { marginLeft: 'auto', marginRight: 12 }]}>
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
            <View style={styles.detailsWrapper}>
              <Text
                style={[
                  styles.text,
                  { fontSize: 16, fontFamily: 'ReadexPro-Medium' },
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
                    fontSize: 16,
                  },
                ]}>
                GHS {data.data.total}
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
            mutate({
              number: state.number,
              network: airtime || '',
              amount: (data && data.data && data.data.amount) || 0,
              merchant: user.user_merchant_id || '',
              mod_by: user.login || '',
              mod_date,
              date: mod_date,
              notify_source: 'Digistore Business',
            });
          }}
          disabled={isBuyAirtimeLoading}>
          {isBuyAirtimeLoading ? 'Processing' : 'Proceed'}
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
    bottom: 12,
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
    borderTopWidth: 0.4,
    paddingVertical: 12,
  },
  text: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 16,
    color: '#30475e',
  },
  confirm: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#30475e',
    width: '80%',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  confirmWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 22,
  },
});

export default ConfirmAirtimePayment;
