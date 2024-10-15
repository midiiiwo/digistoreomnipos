/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
// import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { useGetTransferFundsAccount } from '../hooks/useGetTransferFundsAccount';
import Loading from '../components/Loading';
import PrimaryButton from '../components/PrimaryButton';
import { useRequestTransferFunds } from '../hooks/useRequestTransferFunds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useQueryClient } from 'react-query';
import { useCancelFundsTransfer } from '../hooks/useCancelFundsTransfer';

const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
  return (
    <TextInput
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#B7C4CF'}
      activeOutlineColor={showError ? '#EB455F' : '#1942D8'}
      outlineStyle={{
        borderWidth: 0.9,
        borderRadius: 4,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
    />
  );
};

function TransferMoney({ navigation, route }) {
  const { user } = useSelector(state => state.auth);
  // const { idx } = useRadioButton();
  const [amount, setAmount] = React.useState('');
  const [transferStatus, setTransferStatus] = React.useState();
  const [cancelledStatus, setCancelledStatus] = React.useState();

  const { data, isLoading } = useGetTransferFundsAccount(
    user.user_merchant_account,
  );

  const item =
    (route &&
      route.params &&
      route.params.pending &&
      route.params.pending[0]) ||
    null;

  const btchNo = route && route.params && route.params.batchNo;
  console.log(btchNo);

  const client = useQueryClient();

  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  React.useEffect(() => {
    if (transferStatus && transferStatus.status == 0) {
      navigation.navigate('Transfer Money Status', { transferStatus });

      setTransferStatus(null);
    } else if (transferStatus && transferStatus != 0) {
      toast.show(transferStatus && transferStatus.message, {
        placement: 'top',
        type: 'danger',
      });
    }
  }, [transferStatus, navigation, toast]);

  const { mutate: cancelSettleMent, isLoading: isCancelLoading } =
    useCancelFundsTransfer(i => {
      setCancelledStatus(i);
      client.invalidateQueries('funds-transfer-history');
    });

  React.useEffect(() => {
    if (cancelledStatus) {
      toast.show(cancelledStatus.status, { placement: 'top' });
      route.params = {};
      setCancelledStatus(null);
    }
  }, [cancelledStatus, toast, route]);

  const { mutate, isLoading: isTransferLoading } =
    useRequestTransferFunds(setTransferStatus);

  if (isLoading) {
    return <Loading />;
  }
  const accDetails = (data && data.data && data.data.data) || null;
  if (!accDetails) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text
          style={{ fontFamily: 'Lato-Bold', fontSize: 18, color: '#30475e' }}>
          You have not created a settlement account
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create a Settlement Account
        </Text>
        <Pressable
          style={[
            styles.btn1,
            {
              marginTop: 14,
              backgroundColor: '#rgba(25, 66, 216, 0.9)',
            },
          ]}
          onPress={async () => {
            navigation.navigate('Settlement Account');
          }}>
          <Text style={styles.signin}>Create Settlement Account</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.main}>
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
          {/* <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: 17,
              color: '#30475e',
              marginBottom: 10,
              marginTop: 14,
            }}>
            Transfer Funds
          </Text> */}
          {accDetails === null && data && data.data && data.data.status !== 0 && (
            <Text
              style={{
                color: '#30475e',
                fontSize: 15,
                fontFamily: 'Inter-Medium',
                textAlign: 'center',
              }}>
              {data && data.data && data.data.message.replace(/<br>/g, '')}
            </Text>
          )}
          {accDetails && (
            <>
              <View style={{ width: '100%' }}>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.details}>
                    {accDetails.settle_account_number &&
                      accDetails.settle_account_number}
                  </Text>
                </View>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.details}>
                    {accDetails.settle_institution &&
                      accDetails.settle_institution}
                  </Text>
                </View>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.details}>
                    {accDetails.settle_account_name &&
                      accDetails.settle_account_name}
                  </Text>
                </View>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.details}>
                    GHS{' '}
                    {accDetails.settle_available_amount &&
                      accDetails.settle_available_amount}
                  </Text>
                </View>
                <View style={styles.detailsWrapper}>
                  <Text style={styles.details}>
                    {accDetails.settle_channel && accDetails.settle_channel}
                  </Text>
                </View>
              </View>

              <Input
                placeholder="Enter Amount to Transfer"
                val={amount}
                setVal={text => setAmount(text)}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  marginTop: 22,
                }}
                keyboardType="number-pad"
                showError={showError && amount.length === 0}
              />
            </>
          )}
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'SFProDisplay-Semibold',
              color: '#30475e',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1.0,
              paddingBottom: 8,
              borderStyle: 'dashed',
              marginTop: 24,
              alignSelf: 'flex-start',
              width: '100%',
              // flex: 1,
            }}>
            Pending Settlement
          </Text>
          <View style={{ paddingTop: 3 }}>
            {item && (
              <View
                style={{
                  // paddingHorizontal: 20,
                  paddingVertical: 6,
                  marginVertical: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 10,
                  // backgroundColor: 'red',
                  width: '100%',
                }}>
                <View style={{ width: '65%' }}>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Invoice:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.invoice_number}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Date:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.contract_date}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Inst. Name:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.beneficiary_name}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Inst. Branch:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.beneficiary_bank_name}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Inst. Branch:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.beneficiary_bank_branch}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Inst. Account:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.beneficiary_account_number}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      fontSize: 16,
                      opacity: 0.94,
                    }}>
                    Channel:{' '}
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#6D8299',
                        fontSize: 15,
                      }}>
                      {item.payout_type}
                    </Text>
                  </Text>

                  {/* <Text style={{ fontFamily: 'Inter-Medium', color: '#30475e' }}>
                  {item.deposit_status}
                </Text> */}
                </View>
                <View
                  style={{
                    height: '100%',
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                  }}>
                  {/* <View style={styles.status}>
                    <View style={[styles.statusWrapper]}>
                      <View
                        style={[
                          styles.statusIndicator,
                          {
                            backgroundColor:
                              item.transfer_status === 'YES'
                                ? '#87C4C9'
                                : item.transfer_status === 'INITIATED'
                                ? '#FFDB89'
                                : '#FD8A8A',
                          },
                        ]}
                      />
                      <Text
                        style={{
                          fontFamily: 'Inter-Medium',
                          color: '#30475e',
                          fontSize: 13,
                        }}>
                        {item.transfer_status === 'INVALID'
                          ? 'CANCELLED'
                          : item.transfer_status}
                      </Text>
                    </View>
                  </View> */}
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Semibold',
                      color: '#30475e',
                      marginBottom: 10,
                      fontSize: 16,
                    }}>
                    GHS {item.payment_amount}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {item && (
            <PrimaryButton
              handlePress={() => {
                console.log('repprereres');
                const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
                const json_list = {};
                json_list['0'] = {
                  id: item.invoice_number,
                  settledDate: 'Pending',
                  settled: 'PENDING',
                };
                toast.show('cancelling settlement', { placement: 'top' });
                cancelSettleMent({
                  batch: btchNo,
                  mod_by: user.login,
                  mod_date,
                  json_list: JSON.stringify(json_list),
                });
              }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginTop: 6,
                borderRadius: 4,
                backgroundColor: '#FD8A8A',
                width: '100%',
              }}>
              Cancel
            </PrimaryButton>
          )}
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          disabled={accDetails === null || isTransferLoading}
          style={styles.btn}
          handlePress={() => {
            if (amount.length === 0) {
              setShowError(true);
              return;
            }
            if (Number(amount) > Number(accDetails.settle_available_amount)) {
              toast.show(
                'Sorry, you cannot transfer more than your account balance',
                {
                  placement: 'top',
                  type: 'danger',
                  duration: 4000,
                },
              );
            }
            mutate({
              account: user.user_merchant_account,
              amount,
              mod_by: user.login,
            });
          }}>
          {isTransferLoading ? 'Processing' : 'Send Request'}
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 12,
    marginBottom: 78,
    backgroundColor: '#fff',
  },
  containerStyle: { borderRadius: 0 },
  details: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#30475e',
    width: '100%',
  },
  detailsWrapper: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btn1: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
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
});
export default TransferMoney;
