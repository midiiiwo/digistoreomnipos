/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { handleSearch } from '../utils/shared';
import { useToast } from 'react-native-toast-notifications';
import { useGetSalesHistory } from '../hooks/useSalesHistory';
import Filter from '../../assets/icons/filter.svg';
import Loading from '../components/Loading';
import { SheetManager } from 'react-native-actions-sheet';
import { Dimensions } from 'react-native';
import TransactionItem from '../components/TransactionItem';
import Search from '../../assets/icons/search.svg';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { printTransactionSummary } from '../modules/printer';
const headers = [
  'Date',
  'Invoice',
  'Payment Status',
  'Payment Channel',
  'Payment Number',
  'Payment Reference',
  'Amount',
  'Fee',
  'Source',
  'Customer Name',
  'Customer Phone',
  'Description',
];

const SaleHistoryScreen = () => {
  // const [startDate, setStartDate] = React.useState(
  //   new Date(new Date().setDate(d.getDate() - 30)),
  // );
  // const [endDate, setEndDate] = React.useState(new Date());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cancelledStatus, setCancelledStatus] = React.useState();
  const toast = useToast();

  const { user } = useSelector(state => state.auth);
  const { sStartDate, sEndDate } = useSelector(state => state.transactions);

  const { data, isLoading, refetch } = useGetSalesHistory(
    user.merchant,
    user.login,
    user.user_merchant_group === 'Administrators',
    moment(sStartDate).format('DD-MM-YYYY'),
    moment(sEndDate).format('DD-MM-YYYY'),
  );

  // React.useEffect(() => refetch(), [startDate, endDate]);

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sStartDate, sEndDate]);

  React.useEffect(() => {
    if (cancelledStatus) {
      toast.show(cancelledStatus.status, { placement: 'top' });
      setCancelledStatus(null);
    }
  }, [cancelledStatus, toast]);

  if (isLoading) {
    return <Loading />;
  }

  const totalAmount = (
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.filter(i => {
        if (!i) {
          return;
        }
        return i.PAYMENT_STATUS === 'Successful';
      })) ||
    []
  ).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    return acc + Number(curr.BILL_AMOUNT);
  }, 0);

  const cashEntities = ((data && data.data && data.data.data) || [])
    .filter(i => {
      if (!i) {
        return;
      }
      return i.PAYMENT_CHANNEL === 'CASH';
    })
    .filter(i => i.PAYMENT_STATUS === 'Successful');

  const cashAmount = (cashEntities || []).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    return acc + Number(curr.BILL_AMOUNT);
  }, 0);

  const transactionData =
    handleSearch(searchTerm, data && data.data && data.data.data) || {};

  const transactionTableData = [];

  for (const item of transactionData) {
    if (item) {
      const {
        TRANSACTION_DATE,
        PAYMENT_INVOICE,
        PAYMENT_STATUS,
        PAYMENT_CHANNEL,
        PAYMENT_NUMBER,
        PAYMENT_REFERENCE,
        BILL_AMOUNT,
        TRANSACTION_CHARGE,
        NOTIFICATION_SOURCE,
        CUSTOMER_NAME,
        CUSTOMER_CONTACTNO,
        PAYMENT_DESCRIPTION,
      } = item;
      const rowItem = [
        TRANSACTION_DATE,
        PAYMENT_INVOICE,
        PAYMENT_STATUS,
        PAYMENT_CHANNEL,
        PAYMENT_NUMBER,
        PAYMENT_REFERENCE,
        BILL_AMOUNT,
        TRANSACTION_CHARGE,
        NOTIFICATION_SOURCE,
        CUSTOMER_NAME,
        CUSTOMER_CONTACTNO,
        PAYMENT_DESCRIPTION,
      ];
      transactionTableData.push(rowItem);
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 10,
        }}>
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
                SheetManager.show('saleHistory');
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
        <Table
          style={{
            paddingTop: 12,
            paddingBottom: Dimensions.get('window').height * 0.1,
          }}
          borderStyle={{
            borderWidth: 0,
            borderColor: '#c8e1ff',
          }}>
          <Row data={headers} style={styles.head} textStyle={styles.text} />
          <Rows data={transactionTableData} textStyle={[styles.text]} />
        </Table>
      </View>

      {/* <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            const totalTransactions =
              (data && data.data && data.data.data) ||
              []
                .filter(i => i !== null)
                .filter(i => i.PAYMENT_STATUS === 'Successful').length;

            printTransactionSummary(
              totalTransactions,
              cashAmount,
              new Intl.NumberFormat().format(totalAmount - cashAmount),
              totalAmount,
              moment(sStartDate).format('DD-MM-YYYY').toString() +
                ' - ' +
                moment(sEndDate).format('DD-MM-YYYY').toString(),
            );
          }}>
          Print Transaction Summary
        // </PrimaryButton>
      </View> */}
    </SafeAreaView>
  );
};

export default SaleHistoryScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  img: {
    height: 32,
    width: 32,
    borderRadius: 24,
    // borderWidth: 0.7,
    // borderColor: '#ddd',
  },
  head: { backgroundColor: '#f1f8ff' },
  text: {
    margin: 6,
    color: '#272829',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
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
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.3,
    marginTop: 5,
  },
  headerText: {
    fontFamily: 'Lato-Semibold',
    color: '#30475e',
    fontSize: 18,
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
});
