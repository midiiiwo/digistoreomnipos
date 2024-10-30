/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import Search from '../../assets/icons/search.svg';
import React from 'react';
import { useGetInvoiceHistory } from '../hooks/useGetInvoiceHistory';
import { useSelector } from 'react-redux';
import Filter from '../../assets/icons/filter';
import { SheetManager } from 'react-native-actions-sheet';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import moment from 'moment';
import InvoiceItem from '../components/InvoiceItem';
import { FloatingButton } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import CaretDown from '../../assets/icons/caret-down.svg';

const ranges = ['All', 'Pending', 'Overdue', 'Paid'];

const InvoiceHistory = () => {
  const { user } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { IVStartDate, IVEndDate } = useSelector(state => state.transactions);
  const { data, isLoading, refetch, isFetching } = useGetInvoiceHistory(
    user.merchant,
    moment(IVStartDate).format('DD-MM-YYYY'),
    moment(IVEndDate).format('DD-MM-YYYY'),
  );
  const [openMenu, setOpenMenu] = React.useState(false);
  const [range, setRange] = React.useState('All');
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IVStartDate, IVEndDate]);
  if (isLoading) {
    return <Loading />;
  }

  console.log('ivvvvv', IVStartDate, IVEndDate);

  const totalAmount = ((data && data.data && data.data.data) || []).reduce(
    (acc, curr) => {
      if (!curr) {
        return acc;
      }
      if (range === 'Pending' && curr.PAYMENT_STATUS !== 'Pending') {
        return acc;
      }
      if (range === 'Paid' && curr.PAYMENT_STATUS !== 'Successful') {
        return acc;
      }
      const currentDate = moment(new Date());
      const dueDate = moment(curr.PAYMENT_DUE_DATE);
      if (range === 'Overdue' && !(dueDate.diff(currentDate, 'days') < 0)) {
        return acc;
      }
      return acc + Number(curr.CURRENCY_AMOUNT);
    },
    0,
  );
  return (
    <View style={{ backgroundColor: '#fff', paddingBottom: 12, flex: 1 }}>
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
            placeholder="Search Invoices"
            placeholderTextColor="#929AAB"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Pressable
            onPress={() => {
              SheetManager.show('InvoiceFilter');
            }}>
            <Filter stroke="#30475e" height={32} width={32} />
          </Pressable>
        </View>
      </View>
      <FlatList
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
                // marginBottom: 6,
                paddingRight: 12,
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <View style={{ marginRight: 16 }}>
                <Menu
                  opened={openMenu}
                  onBackdropPress={() => setOpenMenu(false)}>
                  <MenuTrigger
                    onPress={() => setOpenMenu(!openMenu)}
                    children={
                      <View
                        style={{
                          flexDirection: 'row',
                          borderRadius: 6,
                          borderWidth: 1.5,
                          borderColor: '#eee',
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingRight: 0,
                        }}>
                        <Text
                          style={{
                            color:
                              range === 'All'
                                ? '#30475e'
                                : range === 'Overdue'
                                  ? '#D24545'
                                  : range === 'Pending'
                                    ? '#F5A25D'
                                    : '#87C4C9',
                            fontFamily: 'ReadexPro-Medium',
                            fontSize: 16,
                          }}>
                          {range}
                        </Text>
                        <CaretDown fill="#666" />
                      </View>
                    }
                  />
                  <MenuOptions
                    optionsContainerStyle={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      paddingBottom: 10,
                      borderRadius: 6,
                      // elevation: 0,
                    }}>
                    {ranges.map(i => (
                      <MenuOption
                        key={i.label}
                        style={{ marginVertical: 10 }}
                        onSelect={async () => {
                          setOpenMenu(false);
                          setRange(i);
                        }}>
                        <Text
                          style={{
                            color: '#30475e',
                            fontFamily: 'ReadexPro-Regular',
                            fontSize: 15,
                          }}>
                          {i}
                        </Text>
                      </MenuOption>
                    ))}
                  </MenuOptions>
                </Menu>
              </View>
              <View style={{ alignItems: 'flex-end', marginLeft: 'auto' }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#748DA6',
                    fontSize: 14.5,
                  }}>
                  Total Transactions:{' '}
                  {
                    ((data && data.data && data.data.data) || [])
                      .filter(i => i !== null)
                      .filter(item => {
                        if (
                          range === 'Pending' &&
                          item.PAYMENT_STATUS === 'Pending'
                        ) {
                          return item;
                        }
                        if (
                          range === 'Paid' &&
                          item.PAYMENT_STATUS === 'Successful'
                        ) {
                          return item;
                        }
                        const currentDate = moment(new Date());
                        const dueDate = moment(item.PAYMENT_DUE_DATE);
                        if (
                          range === 'Overdue' &&
                          dueDate.diff(currentDate, 'days') < 0
                        ) {
                          return item;
                        }
                        if (range === 'All') {
                          return item;
                        }
                      }).length
                  }
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#748DA6',
                    fontSize: 14.5,
                  }}>
                  Total Amount: GHS{' '}
                  {new Intl.NumberFormat().format(totalAmount.toFixed(2))}
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 24,
          paddingBottom: Dimensions.get('window').height * 0.12,
          backgroundColor: '#fff',
        }}
        data={handleSearch(searchTerm, data && data.data && data.data.data)}
        renderItem={({ item }) => {
          if (!item) {
            return <></>;
          }
          if (range === 'Pending' && item.PAYMENT_STATUS !== 'Pending') {
            return <></>;
          }
          if (range === 'Paid' && item.PAYMENT_STATUS !== 'Successful') {
            return <></>;
          }
          const currentDate = moment(new Date());
          const dueDate = moment(item.PAYMENT_DUE_DATE);
          if (range === 'Overdue' && !(dueDate.diff(currentDate, 'days') < 0)) {
            return <></>;
          }
          return <InvoiceItem item={item} />;
        }}
      />
      <FloatingButton
        visible={true}
        hideBackgroundOverlay
        // bottomMargin={Dimensions.get('window').width * 0.18}

        button={{
          label: 'Create Invoice',
          onPress: () => {
            navigation.navigate('Create Invoice', { isEstimate: false });
          },

          style: {
            // marginLeft: 'auto',
            // marginRight: 14,
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
            backgroundColor: 'rgba(60, 121, 245, 1.0)',
            marginBottom: Dimensions.get('window').width * 0.05,
          },
        }}
      />
    </View>
  );
};

export default InvoiceHistory;

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
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 15,
  },
  img: {
    height: 32,
    width: 32,
    borderRadius: 24,
    // borderWidth: 0.7,
    // borderColor: '#ddd',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    // marginTop: 6,
  },
  height: 38,
  width: 38,
  borderRadius: 24,
  // borderWidth: 0.7,
  // borderColor: '#ddd',
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
    marginTop: 2,
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
