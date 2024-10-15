/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import React from 'react';
// import { DateTimePicker } from 'react-native-ui-lib';
// import { useAccountStatementHistory } from '../hooks/useAccountStatementHistory';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { handleSearch } from '../utils/shared';
import { useGetFundsTransferHistory } from '../hooks/useGetFundsTransferHistory';
import PrimaryButton from '../components/PrimaryButton';
import { useCancelFundsTransfer } from '../hooks/useCancelFundsTransfer';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import Filter from '../../assets/icons/filter';
import Loading from '../components/Loading';
import { SheetManager } from 'react-native-actions-sheet';
import Search from '../../assets/icons/search.svg';

const d = new Date();

const FundsTransfer = () => {
  const [startDate, setStartDate] = React.useState(
    new Date(new Date().setDate(d.getDate() - 30)),
  );
  const [endDate, setEndDate] = React.useState(new Date());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cancelledStatus, setCancelledStatus] = React.useState();
  const client = useQueryClient();
  const toast = useToast();

  const { user } = useSelector(state => state.auth);

  const { mutate, isLoading: isCancelLoading } = useCancelFundsTransfer(i => {
    setCancelledStatus(i);
    client.invalidateQueries('funds-transfer-history');
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // React.useEffect(() => refetch(), [startDate, endDate]);

  const { tStartDate, tEndDate } = useSelector(state => state.transactions);

  const { data, isFetching, isLoading, refetch } = useGetFundsTransferHistory(
    user.merchant,
    moment(tStartDate).format('DD-MM-YYYY'),
    moment(tEndDate).format('DD-MM-YYYY'),
  );

  React.useEffect(() => {
    if (cancelledStatus) {
      toast.show(cancelledStatus.status, { placement: 'top' });
      setCancelledStatus(null);
    }
  }, [cancelledStatus, toast]);

  if (isLoading) {
    return <Loading />;
  }

  const totalAmount =
    data &&
    data.data &&
    data.data.data &&
    data.data.data.reduce((acc, curr) => {
      if (!curr) {
        return acc;
      }
      return acc + Number(curr.payment_amount);
    }, 0);

  return (
    <View style={styles.main}>
      <View style={{ backgroundColor: '#fff', paddingBottom: 12 }}>
        <View style={styles.topIcons}>
          <View style={styles.searchBox}>
            <Search
              stroke="#131517"
              height={20}
              width={20}
              style={{ marginLeft: 12 }}
            />
            <TextInput
              style={styles.search}
              placeholder="Search transaction"
              placeholderTextColor="#929AAB"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Pressable
              onPress={() => {
                SheetManager.show('TransferFilter');
              }}>
              <Filter stroke="#30475e" height={32} width={32} />
            </Pressable>
          </View>
          {/* <View style={styles.viewSpace} /> */}
          {/* <Pressable
          onPress={() => {
            SheetManager.show('paypointHistorySheet');
          }}>
          <Filter stroke="#30475e" height={33} width={33} />
        </Pressable> */}
        </View>
      </View>

      <FlashList
        estimatedItemSize={160}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch();
            }}
            refreshing={isLoading || isFetching}
          />
        }
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                alignItems: 'flex-end',
                paddingRight: 12,
                backgroundColor: '#fff',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#748DA6',
                  fontSize: 15,
                }}>
                Total Transactions:{' '}
                {data &&
                  data.data &&
                  data.data.data.filter(i => i !== null).length}
              </Text>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#748DA6',
                  fontSize: 15,
                  marginTop: 4,
                }}>
                Total Amount: GHS{' '}
                {new Intl.NumberFormat().format(totalAmount.toFixed(2))}
              </Text>
            </View>
          );
        }}
        // ItemSeparatorComponent={() => (
        //   <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5 }} />
        // )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
        data={handleSearch(searchTerm, data && data.data && data.data.data)}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 18,
                marginVertical: 4,
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 10,
                backgroundColor: '#fff',
              }}>
              <View style={{ width: '65%' }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Invoice:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.invoice_number}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Settlement Date:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.transfer_date}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Inst. Name:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.beneficiary_name}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Inst. Branch:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.beneficiary_bank_name}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Inst. Branch:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.beneficiary_bank_branch}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Inst. Account:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
                    }}>
                    {item.beneficiary_account_number}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Semibold',
                    color: '#30475e',
                    fontSize: 15,
                    opacity: 0.93,
                  }}>
                  Channel:{' '}
                  <Text
                    style={{
                      fontFamily: 'Lato-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                      fontWeight: '',
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
                <View style={styles.status}>
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
                        fontFamily: 'Lato-Bold',
                        color: '#30475e',
                        fontSize: 14,
                      }}>
                      {item.transfer_status === 'INVALID'
                        ? 'CANCELLED'
                        : item.transfer_status === 'YES'
                        ? 'COMPLETED'
                        : item.transfer_status}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    color: '#30475e',
                    marginBottom: 10,
                    fontSize: 14,
                  }}>
                  GHS {item.payment_amount}
                </Text>
                {(item.transfer_status === 'INITIATED' ||
                  item.transfer_status === 'PENDING') &&
                  user.user_merchant_agent != '6' && (
                    <PrimaryButton
                      handlePress={() => {
                        const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
                        if (
                          item.transfer_status !== 'PENDING' &&
                          item.transfer_status !== 'INITIATED'
                        ) {
                          return;
                        }
                        const json_list = {};
                        json_list['0'] = {
                          id: item.invoice_number,
                          settledDate: 'Pending',
                          settled: 'PENDING',
                        };
                        toast.show('cancelling settlement', {
                          placement: 'top',
                        });
                        mutate({
                          batch: item.batch_no,
                          mod_by: user.login,
                          mod_date,
                          json_list: JSON.stringify(json_list),
                        });
                      }}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        marginTop: 'auto',
                        borderRadius: 6,
                        backgroundColor: '#FD8A8A',
                      }}>
                      Cancel
                    </PrimaryButton>
                  )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default FundsTransfer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Semibold',
    color: '#30475e',
    fontSize: 16,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    // marginTop: 6,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 100,
    marginRight: 4,
    backgroundColor: '#87C4C9',
  },

  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    // paddingHorizontal: 8,
    // paddingRight: 12,
    // paddingVertical: 5,
    // backgroundColor: '#f9f9f9',
    // marginRight: 8,
  },
  dateMain: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  dateSeparator: {
    marginHorizontal: 8,
  },
  dateWrapper: {
    flex: 1,
    paddingBottom: 0,
    height: 85,
  },
  topIcons: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'SFProDisplay-Regular',
    letterSpacing: 0.3,
  },
});
