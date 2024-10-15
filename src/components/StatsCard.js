/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import ArrowUpIcon from '../../assets/icons/arrow-up.svg';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import { useSelector } from 'react-redux';

const StatsCard = React.forwardRef(
  ({ title, metric, prevData, backgroundColor, titleColor }, ref) => {
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
      typeof metric === 'string'
        ? parseFloat(metric.replace(/,/g, ''))
        : metric;
    let prevFloatMetric =
      typeof prevData.value === 'string'
        ? parseFloat(prevData.value.replace(/,/g, ''))
        : prevData.value;
    const diff = floatMetric - prevFloatMetric;
    prevFloatMetric = prevFloatMetric === 0 ? 1 : prevFloatMetric;
    const percentChange = ((diff / prevFloatMetric) * 100).toFixed(1);

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
        <View>
          <Text style={[styles.amount]}>
            {currencySymbol}
            {metric}
          </Text>
          <View
            style={[
              styles.stats,
              // {
              //   backgroundColor:
              //     percentChange >= 0
              //       ? 'rgba(135, 196, 201, 0.1)'
              //       : 'rgba(253, 138, 138, 0.1)',
              // },
              // { marginLeft: 'auto' },
            ]}>
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
                    fontFamily: 'SFProDisplay-Medium',
                  }}>
                  from {previousStat.toLowerCase()}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* </View> */}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cardMain: {
    paddingBottom: 0,
    paddingVertical: 18,
    paddingTop: 8,
    minWidth: Dimensions.get('window').width * 0.18,
    paddingHorizontal: 20,
    marginBottom: Dimensions.get('window').height * 0.01,
    marginHorizontal: Dimensions.get('window').height * 0.0008,
    borderColor: '#D6E4E5',
    // borderWidth: 1,
    borderRadius: 10,
  },
  cardTitle: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#091D60',
    fontSize: 16,
    marginTop: 8,
    // fontWeight: '700',
    // marginHorizontal: 18,
    // letterSpacing: 0.45,
    // marginLeft: 18,
  },
  amount: {
    fontFamily: 'SFProDisplay-Semibold',
    // fontWeight: 'bold',
    color: '#091D60',
    fontSize: 20,
    letterSpacing: 0.5,
    marginTop: 0,

    // marginHorizontal: 18,
  },
  ArrowUpIcon: {
    marginRight: 0,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // marginTop: 12,
    marginTop: Dimensions.get('window').width * 0.023,
    marginBottom: 18,
  },
  statsText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 15,
  },
});

export default StatsCard;
