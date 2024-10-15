/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import { DateTimePicker } from 'react-native-ui-lib';
import { useAccountStatementHistory } from '../hooks/useAccountStatementHistory';
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
import { useGetAirtimeHistory } from '../hooks/useGetAirtimeHistory';
import Filter from '../../assets/icons/filter';
import Loading from '../components/Loading';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import AirtelItem from '../components/AirtimeItem';
import Search from '../../assets/icons/search.svg';

const d = new Date();

const AirtimeHistory = () => {
  const [startDate, setStartDate] = React.useState(
    new Date(new Date().setDate(d.getDate() - 30)),
  );
  const [endDate, setEndDate] = React.useState(new Date());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cancelledStatus, setCancelledStatus] = React.useState();
  const client = useQueryClient();
  const toast = useToast();

  const { aStartDate, aEndDate } = useSelector(state => state.transactions);
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();

  const { data, isFetching, isLoading, refetch } = useGetAirtimeHistory(
    user.merchant,
    user.login,
    user.user_merchant_group === 'Administrators',
    moment(aStartDate).format('DD-MM-YYYY'),
    moment(aEndDate).format('DD-MM-YYYY'),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // React.useEffect(() => refetch(), [startDate, endDate]);

  React.useEffect(() => {
    if (cancelledStatus) {
      toast.show(cancelledStatus.status, { placement: 'top' });
      setCancelledStatus(null);
    }
  }, [cancelledStatus, toast]);

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aStartDate, aEndDate]);

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
      return acc + Number(curr.topup_amount);
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
                SheetManager.show('AirtimeFilter');
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
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#748DA6',
                  fontSize: 14.5,
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
                  fontSize: 14.5,
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
          return <AirtelItem item={item} />;
        }}
      />
    </View>
  );
};

export default AirtimeHistory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  img: {
    height: 32,
    width: 32,
    borderRadius: 24,
    borderWidth: 0.7,
    borderColor: '#ddd',
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
});
