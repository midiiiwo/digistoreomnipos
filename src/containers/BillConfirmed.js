/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { ScrollView } from 'react-native-gesture-handler';
import { useServiceChargeFee } from '../hooks/useServiceChargeFee';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { usePayBill } from '../hooks/usePayBill';
import { useAddExpense } from './CreateExpense';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import moment from 'moment';
import { isObject } from 'lodash';

const DetailItem = ({ label, value, firstItem }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        // paddingLeft: 22,
        borderBottomWidth: 0.4,
        borderBottomColor: '#ddd',
        paddingVertical: 12,
        borderTopColor: firstItem ? '#ddd' : '',
        borderTopWidth: firstItem ? 0.4 : 0,
      }}>
      <Text
        style={{
          color: '#4B6587',
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 15,
        }}>
        {label}:{' '}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: '#4B6587',
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 16,
          marginLeft: 'auto',
          // marginRight: 12,
          width: '60%',
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </View>
  );
};

// const mapProviderToName = {
//   SURF: 'Surfline LTE Internet',
//   BUSY: 'Busy Internet',
//   ECGP: 'ECG Postpaid',
//   ECG: 'ECG Prepaid',
//   MTNPP: 'Mtn Postpaid',
//   VPP: 'Vodafone Postpaid',
//   GWCL: 'Ghana Water',
//   GOTV: 'GOTV',
//   ADSL: 'Vodafone Broadband',
//   MTNBB: 'Mtn Broadband',
// };

const BillConfirmed = ({ route, navigation }) => {
  const { user } = useSelector(state => state.auth);
  const {
    name,
    accountNumber,
    amount,
    bill,
    mobileNumber,
    billName,
    billCategory,
    checkAsExpense,
    pricePlan,
  } = route.params;
  const [payStatus, setPayStatus] = React.useState();
  const { data, isLoading } = useServiceChargeFee(bill, amount, user.merchant);

  console.log('data', data?.data);
  const { mutate, isLoading: isPayBillLoading } = usePayBill(res => {
    setPayStatus(res);
    if (isObject(res) && res?.status == 0) {
      if (checkAsExpense) {
        const payload = {
          name: billName,
          category: billCategory?.id,
          mod_by: user?.login,
          merchant: user?.merchant,
          total_amount: data?.data?.amount || amount,
          amount_paid: data?.data?.amount || amount,
          occurance: 'NONE',
          notify_device: Platform.OS,
          notify_source: 'Digistore Business',
          date: moment(new Date()).format('DD-MM-YYYY'),
        };
        addExpense.mutate(payload);
      } else {
        navigation.navigate('Bill Status', {
          payStatus: res,
          name,
          accountNumber,
          bill,
          amount: data?.data?.amount || amount,
          mobileNumber,
        });
      }
    } else {
      navigation.navigate('Bill Status', {
        payStatus: res,
        name,
        accountNumber,
        bill,
        amount: data?.data?.amount || amount,
        mobileNumber,
      });
    }
  });
  const client = useQueryClient();
  const toast = useToast();

  const addExpense = useAddExpense(res => {
    if (res) {
      if (res) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        toast.show(res?.message, { placement: 'top' });

        navigation.navigate('Bill Status', {
          payStatus,
          name,
          accountNumber,
          bill,
          amount: data?.data?.amount || 0,
          mobileNumber,
        });
      }
    }
  });

  // React.useEffect(() => {
  //   if (payStatus) {
  //     navigation.navigate('Bill Status', {
  //       payStatus,
  //       name,
  //       accountNumber,
  //       bill,
  //       amount: data?.data?.amount || 0,
  //       mobileNumber,
  //     });
  //   }
  // }, [
  //   payStatus,
  //   navigation,
  //   name,
  //   accountNumber,
  //   bill,
  //   data,
  //   amount,
  //   mobileNumber,
  // ]);

  if (isLoading) {
    return <Loading />;
  }

  console.log(route.params);
  return (
    <>
      <ScrollView style={styles.main}>
        <View style={{ height: '100%' }}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  color: '#30475e',
                  textAlign: 'center',
                  width: '90%',
                  fontSize: 18,
                }}>
                {billName.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Regular',
                  color: '#4B6587',
                  textAlign: 'center',
                  width: '90%',
                  fontSize: 15,
                  marginTop: 26,
                }}>
                A service fee of GHS {data?.data?.charge || 0} would be charge.
                Once confirmed, this cannot be reversed
              </Text>
            </View>
            <View style={{ marginTop: 26, paddingHorizontal: 22 }}>
              {bill !== 'SURF' && bill !== 'BUSY' && (
                <DetailItem label="Amount Name" value={name} firstItem />
              )}
              <DetailItem
                label="Amount Due"
                value={`GHS ${data?.data?.amount || 0}`}
              />
              <DetailItem
                label="Service Fee"
                value={`GHS ${data?.data?.charge || 0}`}
              />
              <DetailItem
                label="Total Amount Due"
                value={`GHS ${data?.data?.total || amount?.split('-')[0]}`}
              />
              {/* <DetailItem label="Commission Earned" value={name} /> */}
              {/* <DetailItem
              label="Service Provider"
              value={mapProviderToName[serviceProvider]}
            /> */}
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        handlePress={() => {
          mutate({
            vendor: bill,
            amount: pricePlan || data?.data?.total || amount,
            merchant: user.merchant,
            mod_by: user.login,
            billaccount: accountNumber,
            contactno: mobileNumber,
            notify_source: 'Digistore Business',
          });
        }}
        style={{
          borderRadius: 5,
          width: '92%',
          marginTop: 12,
          position: 'absolute',
          bottom: 12,
          alignSelf: 'center',
        }}
        disabled={isPayBillLoading}>
        {isPayBillLoading ? 'Processing' : 'Proceed'}
      </PrimaryButton>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default BillConfirmed;
