/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { DateTimePicker } from 'react-native-ui-lib';
import { useAccountStatementHistory } from '../hooks/useAccountStatementHistory';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { handleSearch } from '../utils/shared';

const d = new Date();

const AccountStatement = () => {
  const [startDate, setStartDate] = React.useState(
    new Date(new Date().setDate(d.getDate() - 30)),
  );
  const [endDate, setEndDate] = React.useState(new Date());
  const [searchTerm, setSearchTerm] = React.useState('');

  const { user } = useSelector(state => state.auth);

  const { data, isFetching, isLoading, refetch } = useAccountStatementHistory(
    user.merchant,
    moment(startDate).format('DD-MM-YYYY'),
    moment(endDate).format('DD-MM-YYYY'),
  );
  return (
    <View style={styles.main}>
      <View style={{ backgroundColor: '#fff' }}>
        <View style={styles.dateMain}>
          <View style={styles.dateWrapper}>
            <DateTimePicker
              title={'From'}
              placeholder={'Start date'}
              mode={'date'}
              migrate
              value={startDate}
              onChange={val => {
                setStartDate(val);
              }}
            />
          </View>
          <View style={styles.dateSeparator} />
          <View style={styles.dateWrapper}>
            <DateTimePicker
              title={'To'}
              placeholder={'End date'}
              mode={'date'}
              onChange={val => {
                setEndDate(val);
              }}
              migrate
              value={endDate}
            />
          </View>
        </View>
        <TextInput
          style={styles.search}
          placeholder="Search for transactions"
          placeholderTextColor="#B8BEC4"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
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
        // ItemSeparatorComponent={() => (
        //   <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5 }} />
        // )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 6 }}
        data={handleSearch(searchTerm, data && data.data && data.data.data)}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return (
            <View
              style={{
                paddingHorizontal: 12,
                // paddingVertical: 12,
                marginVertical: 2,
                // height: 160,
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  width: '65%',
                  height: '100%',
                  // backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#30475e',
                    fontSize: 15,
                    // marginBottom: 5,
                  }}>
                  #{item.deposit_id}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#6D8299',
                    fontSize: 14,
                  }}>
                  Remark:{' '}
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Medium',
                      color: '#6D8299',
                      fontSize: 14,
                    }}>
                    {item.deposit_remark}
                  </Text>
                </Text>

                <View style={styles.status}>
                  <View style={[styles.statusWrapper]}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            item.deposit_status === 'Successful'
                              ? '#87C4C9'
                              : item.deposit_status === 'Pending'
                              ? '#FFDB89'
                              : '#FD8A8A',
                        },
                      ]}
                    />
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#30475e',
                        fontSize: 15,
                      }}>
                      {item.deposit_status}
                    </Text>
                  </View>
                </View>

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
                  // backgroundColor: 'red',
                  // paddingTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: item.credit ? '#87C4C9' : '#FD8A8A',
                    fontSize: 15,
                    // marginTop: 16,
                  }}>
                  {item.credit ? 'Credit' : 'Debit'}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#30475e',
                    marginBottom: 10,
                    fontSize: 16,
                  }}>
                  GHS {item.credit || item.debit}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Regular',
                    color: '#30475e',
                    fontSize: 15,
                  }}>
                  Closing Balance
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#30475e',
                    fontSize: 16,
                  }}>
                  GHS {item.closing_balance}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Regular',
                    color: '#6D8299',
                    marginTop: 10,
                    fontSize: 13,
                  }}>
                  {item.mod_date.slice(0, 16)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AccountStatement;

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
    // paddingBottom: 12,
    marginTop: 'auto',
    // marginTop: 'auto'
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 6,
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
    marginRight: 8,
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
  search: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#30475e',
    backgroundColor: '#F5F7F9',
    fontFamily: 'Inter-Medium',
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 8,
    height: 52,
  },
});
