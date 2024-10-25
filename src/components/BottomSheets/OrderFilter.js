import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { DateTimePicker } from 'react-native-ui-lib';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useActionCreator } from '../../hooks/useActionCreator';
import Picker from '../Picker';
import moment from 'moment';
import { useGetMerchantOutlets } from '../../hooks/useGetMerchantOutlets';
import { setDateRange } from '../../redux/actionCreators';

const ranges = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'day', meta: 'days' },
  { label: 'This Week', value: 'week' },
  { label: 'Last Week', value: 'week', meta: 'weeks' },
  { label: 'This Month', value: 'month' },
  { label: 'Last Month', value: 'month', meta: 'months' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'Last Quarter', value: 'quarter', meta: 'quarters' },
  { label: 'This Year', value: 'year' },
  { label: 'Last Year', value: 'year', meta: 'years' },
];

function OrderFilter(props) {
  const track = React.useRef(false);
  const {
    startDate,
    endDate,
    // summaryPrevStartDate,
    // summaryPrevEndDate,
    orderOutlet,
    range,
  } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const { orderDateRange, setOrderOutlet } = useActionCreator();
  const {
    setStartDate,
    setEndDate,
    // setPrevSummaryStartDate,
    // setPrevSummaryEndDate,
  } = useActionCreator();
  const { data } = useGetMerchantOutlets(user.user_merchant_id);
  React.useEffect(() => {
    if (!track.current) {
      track.current = true;
      return;
    }
    try {
      if (JSON.parse(range.value).meta) {
        setStartDate(
          moment()
            .startOf(JSON.parse(range.value).value)
            .subtract(1, JSON.parse(range.value).meta)
            .toDate(),
        );
        setEndDate(
          moment()
            .startOf(JSON.parse(range.value).value)
            .subtract(1, 'day')
            .toDate(),
        );
        return;
      }
      setStartDate(moment().startOf(JSON.parse(range.value).value).toDate());

      setEndDate(moment().endOf(JSON.parse(range.value).value).toDate());
    } catch (error) {}
  }, [range, setStartDate, setEndDate]);

  console.log('rrrr', range);

  React.useEffect(() => {
    if (!range) {
      setDateRange({ label: 'Today', value: 'today' });
    }
  }, [range]);

  // React.useEffect(() => {
  //   if (!track.current) {
  //     track.current = true;
  //     return;
  //   }
  //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //   // Discard the time and time-zone information.
  //   const utc1 = Date.UTC(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     startDate.getDate(),
  //   );
  //   const utc2 = Date.UTC(
  //     endDate.getFullYear(),
  //     endDate.getMonth(),
  //     endDate.getDate(),
  //   );
  //   const daysDiff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  //   setPrevSummaryEndDate(summaryStartDate);
  //   setPrevSummaryStartDate(
  //     new Date().setDate(summaryStartDate.getDate() - daysDiff),
  //   );
  // }, [
  //   summaryStartDate,
  //   summaryEndDate,
  //   setPrevSummaryEndDate,
  //   setPrevSummaryStartDate,
  // ]);
  const outlets = data?.data?.data || [];

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.dateWrapper}>
          <Picker
            placeholder="Select Outlet"
            value={
              orderOutlet ||
              (user.user_merchant_group === 'Administrators'
                ? { label: 'ALL', value: 'ALL' }
                : null)
            }
            setValue={item => {
              // orderDateRange(item);
              setOrderOutlet(item);
            }}>
            {[{ outlet_name: 'ALL', outlet_id: 'ALL' }, ...outlets].map(
              item => {
                if (!item) {
                  return;
                }
                if (
                  user.user_assigned_outlets &&
                  !user.user_assigned_outlets.includes(item.outlet_id) &&
                  user.user_merchant_group !== 'Administrators'
                ) {
                  return;
                }
                return (
                  <RNPicker.Item
                    key={item.outlet_name}
                    label={item.outlet_name}
                    value={item.outlet_id}
                  />
                );
              },
            )}
          </Picker>
          <Picker
            placeholder="Select range"
            value={range}
            setValue={item => {
              orderDateRange(item);
            }}>
            {ranges.map(item => {
              return (
                <RNPicker.Item
                  key={item.label}
                  label={item.label}
                  value={JSON.stringify(item)}
                />
              );
            })}
          </Picker>
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
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  main: {
    marginHorizontal: 18,
  },
  dateWrapper: {
    marginHorizontal: 12,
    marginTop: 14,
  },
});
export default OrderFilter;
