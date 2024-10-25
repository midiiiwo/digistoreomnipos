import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
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

function BuyInternetFilter(props) {
  const track = React.useRef(false);
  const {
    iStartDate,
    iEndDate,
    // summaryPrevStartDate,
    // summaryPrevEndDate,
    iRange,
  } = useSelector(state => state.transactions);
  const { IDateRange } = useActionCreator();
  const {
    setIStartDate,
    setIEndDate,
    // setPrevSummaryStartDate,
    // setPrevSummaryEndDate,
  } = useActionCreator();
  React.useEffect(() => {
    if (!track.current) {
      track.current = true;
      return;
    }
    // console.log('starttttt', JSON.parse(range.value).meta);
    try {
      if (JSON.parse(iRange.value).meta) {
        setIStartDate(
          moment()
            .startOf(JSON.parse(iRange.value).value)
            .subtract(1, JSON.parse(iRange.value).meta)
            .toDate(),
        );
        setIEndDate(
          moment()
            .startOf(JSON.parse(iRange.value).value)
            .subtract(1, 'day')
            .toDate(),
        );
        return;
      }
      setIStartDate(moment().startOf(JSON.parse(iRange.value).value).toDate());

      // setSummaryEndDate(new Date());
      setIEndDate(moment().endOf(JSON.parse(iRange.value).value).toDate());
    } catch (error) {}
  }, [iRange, setIStartDate, setIEndDate]);

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
            value={iRange}
            setValue={item => {
              IDateRange(item);
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
            value={iStartDate}
            onChange={val => {
              setIStartDate(val);
            }}
          />
        </View>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={'To'}
            placeholder={'End date'}
            mode={'date'}
            onChange={val => {
              setIEndDate(val);
            }}
            migrate
            value={iEndDate}
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
export default BuyInternetFilter;
