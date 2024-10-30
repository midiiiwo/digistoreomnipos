/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import { useSelector } from 'react-redux';
import { Skeleton } from '@rneui/themed';

const StatsCard = React.forwardRef(({ title, metric, prevData }, ref) => {
  // debugger;
  const counts = ['Customers', 'No. of Orders'];
  const { range } = useSelector(state => state.merchant);
  let previousStat = '';
  switch (range.label) {
    case 'Today':
      previousStat = 'Yesterday';
      break;
    case 'Yesterday':
      previousStat = '2 Days ago';
      break;
    case 'This Week':
      previousStat = 'Last Week';
      break;
    case 'Last Week':
      previousStat = '2 Weeks ago';
      break;
    case 'This Month':
      previousStat = 'Last Month';
      break;
    case 'Last Month':
      previousStat = '2 Months ago';
      break;
    case 'This Quarter':
      previousStat = 'Last Quarter';
      break;
    case 'Last Quarter':
      previousStat = '2 Quarters ago';
      break;
    case 'This Year':
      previousStat = 'Last Year';
      break;
    case 'Last Year':
      previousStat = '2 Years ago';
      break;
  }
  const isCount = counts.includes(title);
  const currencySymbol = !isCount ? 'GHS' : '';
  const floatMetric =
    typeof metric === 'string' ? parseFloat(metric.replace(/,/g, '')) : metric;
  let prevFloatMetric =
    typeof prevData?.value === 'string'
      ? parseFloat(prevData?.value?.replace(/,/g, ''))
      : prevData?.value;
  const diff = floatMetric - prevFloatMetric;
  prevFloatMetric = prevFloatMetric === 0 ? 1 : prevFloatMetric;
  const percentChange = ((diff / prevFloatMetric) * 100).toFixed(1);

  console.log('metricccc', metric);

  return (
    <View
      style={[styles.cardMain, { backgroundColor: '#F2F8FB' }]}
      distance={2}
      startColor={'#fff'}
      ref={ref}
      // containerViewStyle={{ marginVertical: 20 }}
      radius={3}>
      {/* <View> */}
      <Text style={[styles.cardTitle]}>{title}</Text>
      <Text style={[styles.amount]}>
        {currencySymbol}
        {metric}
      </Text>
      {(prevData?.value === null || prevData?.value === undefined) && (
        <Skeleton animation="wave" style={styles.excerpts} />
      )}
      {prevData?.value !== null && prevData?.value !== undefined && (
        <View style={[styles.stats]}>
          {percentChange > 0 ? (
            <ArrowUpIcon style={styles.ArrowUpIcon} />
          ) : percentChange == 0 ? null : (
            <ArrowDownIcon style={styles.ArrowUpIcon} />
          )}
          <View>
            <Text
              style={[
                styles.statsText,
                {
                  color:
                    percentChange > 0
                      ? '#22A699'
                      : percentChange == 0
                      ? '#8D96AF'
                      : '#F24C3D',
                  opacity: 1,
                },
              ]}>
              {percentChange}%{' '}
              <Text
                style={{
                  color: '#8D96AF',
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                }}>
                from {previousStat.toLowerCase()}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cardMain: {
    paddingBottom: 0,
    borderRadius: 6,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 4,
    minWidth: 140,
  },
  cardTitle: {
    fontFamily: 'ReadexPro-Regular',
    color: '#8D96AF',
    fontSize: 13,
    marginTop: 7,
  },
  amount: {
    fontFamily: 'ReadexPro-bold',
    color: '#091D60',
    fontSize: 15.5,
    letterSpacing: 0.5,
    marginTop: 0,
    marginBottom: Dimensions.get('window').width * 0.053,
  },
  ArrowUpIcon: {
    marginRight: 0,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',

    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 7,
    marginTop: 'auto',
    marginBottom: 12,
  },
  statsText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13.5,
  },
  excerpts: {
    height: 20,
    width: '100%',
    borderRadius: 7,
    marginTop: 'auto',
    marginBottom: 12,
  },
});

export default StatsCard;
