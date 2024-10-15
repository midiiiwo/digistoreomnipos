import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { DateTimePicker } from 'react-native-ui-lib';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useActionCreator } from '../../hooks/useActionCreator';
import Picker from '../Picker';
import moment from 'moment';

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

function PaypointTransactionFilter(props) {
  const track = React.useRef(false);
  const {
    startDate,
    endDate,
    // summaryPrevStartDate,
    // summaryPrevEndDate,
    range,
  } = useSelector(state => state.paypoint);
  const { PPDateRange } = useActionCreator();
  const { setPPStartDate, setPPEndDate } = useActionCreator();

  React.useEffect(() => {
    if (!track.current) {
      track.current = true;
      return;
    }
    console.log('ragnggg', range);
    console.log('starttttt', JSON.parse(range.value).meta);
    if (JSON.parse(range.value).meta) {
      setPPStartDate(
        moment()
          .startOf(JSON.parse(range.value).value)
          .subtract(1, JSON.parse(range.value).meta)
          .toDate(),
      );
      setPPEndDate(
        moment()
          .startOf(JSON.parse(range.value).value)
          .subtract(1, 'day')
          .toDate(),
      );
      return;
    }
    setPPStartDate(moment().startOf(JSON.parse(range.value).value).toDate());

    // setSummaryEndDate(new Date());
    setPPEndDate(moment().endOf(JSON.parse(range.value).value).toDate());
  }, [range, setPPStartDate, setPPEndDate]);

  // React.useEffect(() => {
  //   if (!track.current) {
  //     track.current = true;
  //     return;
  //   }
  //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //   // Discard the time and time-zone information.
  //   const utc1 = Date.UTC(
  //     summaryStartDate.getFullYear(),
  //     summaryStartDate.getMonth(),
  //     summaryStartDate.getDate(),
  //   );
  //   const utc2 = Date.UTC(
  //     summaryEndDate.getFullYear(),
  //     summaryEndDate.getMonth(),
  //     summaryEndDate.getDate(),
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
            placeholder="Select range"
            value={range}
            setValue={item => {
              PPDateRange(item);
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
              setPPStartDate(val);
            }}
          />
        </View>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={'To'}
            placeholder={'End date'}
            mode={'date'}
            onChange={val => {
              setPPEndDate(val);
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
export default PaypointTransactionFilter;
