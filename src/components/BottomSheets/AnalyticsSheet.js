import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
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

function AnalyticsSheet(props) {
  const track = React.useRef(false);
  const {
    summaryStartDate,
    summaryEndDate,
    // summaryPrevStartDate,
    // summaryPrevEndDate,
    range,
  } = useSelector(state => state.merchant);
  const { setDateRange } = useActionCreator();
  const {
    setSummaryStartDate,
    setSummaryEndDate,
    setPrevSummaryStartDate,
    setPrevSummaryEndDate,
  } = useActionCreator();

  React.useEffect(() => {
    if (!track.current) {
      return;
    }
    if (JSON.parse(range.value || '').meta) {
      setSummaryStartDate(
        moment()
          .startOf(JSON.parse(range.value).value)
          .subtract(1, JSON.parse(range.value).meta)
          .toDate(),
      );
      setSummaryEndDate(
        moment()
          .startOf(JSON.parse(range.value).value)
          .subtract(1, 'day')
          .toDate(),
      );
      return;
    }
    setSummaryStartDate(
      moment().startOf(JSON.parse(range.value).value).toDate(),
    );

    // setSummaryEndDate(new Date());
    setSummaryEndDate(moment().endOf(JSON.parse(range.value).value).toDate());
  }, [range, setSummaryStartDate, setSummaryEndDate]);

  React.useEffect(() => {
    if (!track.current) {
      track.current = true;
      return;
    }
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      summaryStartDate.getFullYear(),
      summaryStartDate.getMonth(),
      summaryStartDate.getDate(),
    );
    const utc2 = Date.UTC(
      summaryEndDate.getFullYear(),
      summaryEndDate.getMonth(),
      summaryEndDate.getDate(),
    );
    const daysDiff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    setPrevSummaryEndDate(summaryStartDate);
    setPrevSummaryStartDate(
      new Date().setDate(summaryStartDate.getDate() - daysDiff),
    );
  }, [
    summaryStartDate,
    summaryEndDate,
    setPrevSummaryEndDate,
    setPrevSummaryStartDate,
  ]);
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
              setDateRange(item);
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
            // migrateTextField
            value={summaryStartDate}
            onChange={val => {
              setSummaryStartDate(val);
            }}
            editable={false}
          />
        </View>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={'To'}
            placeholder={'End date'}
            mode={'date'}
            onChange={val => {
              setSummaryEndDate(val);
            }}
            // migrateTextField
            value={summaryEndDate}
            editable={false}
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
  containerStyle: {
    width: Dimensions.get('window').width * 0.6,
  },
});
export default AnalyticsSheet;
