/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  processColor,
  RefreshControl,
  Platform,
} from 'react-native';
// import { BarChart, PieChart } from 'react-native-chart-kit';

import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Pie from 'react-native-pie';
import { BarChart, CombinedChart } from 'react-native-charts-wrapper';
import { TabView, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { useGetCustomerAnalytics } from '../hooks/useGetCustomerAnalytics';
import moment from 'moment';
import { useSalesInsights } from '../hooks/useSalesInsights';
import { useProductAnalytics } from '../hooks/useProductAnalytics';
import { useActionCreator } from '../hooks/useActionCreator';
import { SheetManager } from 'react-native-actions-sheet';
import { formatNumberTwoSig } from '../utils/shared';
import { useGetMerchantCustomers } from '../hooks/useGetMerchantCustomers';
import { useGetExpensesHistory } from './ExpensesHistory';
import _ from 'lodash';

const colors = {
  'MTN Mobile Money': '#FFDD83',
  'AT Money': '#284A9A',
  'Telecel Cash': '#EA5455',
  'Bank Card': '#5D3891',
  Cash: '#408E91',
  GhQR: '#BE0909',
  'Offline Card': '#30475e',
  'Offline MoMo': '#009FBD',
  'Pay Later': '#009FBD',
  Others: '#009FBD',
};

const shortName = {
  'MTN Mobile Money': 'MTN MoMo',
  'AT Money': 'AT Money',
  'Telecel Cash': 'Telecel Cash',
  'Bank Card': 'Card',
  Cash: 'Cash',
  'Pay Later': 'Pay Later',
  'Offline Card': 'Offline Card',
  Others: 'Others',
};

const mapSalesToName = {
  GROSS_SALES: 'Gross Sales',
  AVG_SALES_VALUE: 'Avg Sale Value',
  VOLUME_SALES: 'No. of Orders',
  DISCOUNTS: 'Discounts',
  NET_SALES: 'Net Sales',
  COST_OF_GOODS: 'Cost of Goods sold',
  SHIPPING_FEES: 'Delivery Fees',
  GROSS_PROFIT: 'Gross Profit',
  EXPENSES: 'Expenses',
  SALES_TAX: 'Sale Tax',
  NET_PROFIT: 'Net Profit',
  TRANSACTION_FEES: 'Payment Fees',
  REFUNDED_SALES: 'Refunds',
  SMS_COST: 'SMS Cost',
};

const InsightCard = ({ title, currencySymbol, metric }) => {
  return (
    <View style={[styles.cardMain]}>
      <Text style={[styles.amount]}>
        {currencySymbol}
        {metric}
      </Text>
      <Text style={[styles.cardTitle]}>{title}</Text>
    </View>
  );
};

const Overview = () => {
  const { user } = useSelector(state => state.auth);
  const { summaryStartDate, summaryEndDate, range } = useSelector(
    state => state.merchant,
  );
  const [insights, setInsights] = React.useState();

  const { mutate, isLoading } = useSalesInsights(setInsights);

  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();

  React.useEffect(() => {
    mutate({
      merchant: user.merchant,
      outlet: 'ALL',
      start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
      end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
    });
  }, [summaryStartDate, summaryEndDate, user.merchant, mutate]);

  if (isLoading) {
    return <Loading />;
  }

  const summary = insights && insights.sales_summary;

  return (
    <View style={[ss.card, { flex: 1 }]}>
      <View style={[ss.header, { flexDirection: 'row' }]}>
        {/* <Text style={ss.headerText}>Sales</Text> */}
        <Pressable
          style={{
            marginLeft: 'auto',
            marginRight: Dimensions.get('window').width * 0.05,
          }}
          onPress={() => {
            SheetManager.show('AnalyticsFilter', {
              payload: {
                startDate: summaryStartDate,
                endDate: summaryEndDate,
                setStartDate: setSummaryStartDate,
                setEndDate: setSummaryEndDate,
                startIndex: 4,
              },
            });
          }}>
          <Text
            style={[
              ss.headerText,
              {
                color: '#006DFF',
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 14.5,
              },
            ]}>
            {range.label}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() =>
              mutate({
                merchant: user.merchant,
                outlet: 'ALL',
                start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
                end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
              })
            }
          />
        }>
        {summary && (
          <View
            style={{
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <InsightCard
                title={mapSalesToName.GROSS_SALES}
                metric={summary.GROSS_SALES}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.REFUNDED_SALES}
                metric={summary.REFUNDED_SALES}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <InsightCard
                title={mapSalesToName.DISCOUNTS}
                metric={summary.DISCOUNTS}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.TRANSACTION_FEES}
                metric={summary.TRANSACTION_FEES}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <InsightCard
                title={mapSalesToName.SHIPPING_FEES}
                metric={summary.SHIPPING_FEES}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.SMS_COST}
                metric={summary.SMS_COST}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <InsightCard
                title={mapSalesToName.SALES_TAX}
                metric={summary.SALES_TAX}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.NET_SALES}
                metric={summary.NET_SALES}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <InsightCard
                title={mapSalesToName.COST_OF_GOODS}
                metric={summary.COST_OF_GOODS}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.GROSS_PROFIT}
                metric={summary.GROSS_PROFIT}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <InsightCard
                title={mapSalesToName.EXPENSES}
                metric={summary.EXPENSES}
              />
              <View style={{ marginHorizontal: 1 }} />
              <InsightCard
                title={mapSalesToName.NET_PROFIT}
                metric={summary.NET_PROFIT}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Sales = () => {
  const { user } = useSelector(state => state.auth);
  const { summaryStartDate, summaryEndDate, range } = useSelector(
    state => state.merchant,
  );

  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();
  // const { data, isLoading, refetch, isFetching } = useGetGrossSalesStats(
  //   user.merchant,
  //   user.user_merchant_group === 'Administrators' ? undefined : user.login,
  //   moment(startDate).format('DD-MM-YYYY'),
  //   moment(endDate).format('DD-MM-YYYY'),
  // );

  const [insights, setInsights] = React.useState();
  const state = React.useRef({
    legend: {
      enabled: false,
      textSize: 14,
      form: 'SQUARE',
      formSize: 14,
      xEntrySpace: 10,
      yEntrySpace: 5,
      formToTextSpace: 5,
      wordWrapEnabled: true,
      maxSizePercent: 0.5,
    },
    data: {
      dataSets: [
        {
          values: [
            { y: 100 },
            { y: 105 },
            { y: 102 },
            { y: 110 },
            { y: 114 },
            { y: 109 },
            { y: 105 },
            { y: 99 },
            { y: 95 },
          ],
          // label: 'Bar dataSet',
          config: {
            color: processColor('teal'),
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 90,
            highlightColor: processColor('red'),
          },
        },
      ],

      config: {
        barWidth: 0.7,
      },
    },
    // highlights: [{ x: 3 }, { x: 6 }],
    xAxis: {
      valueFormatter: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
      granularityEnabled: true,
      granularity: 3,
      position: 'BOTTOM',
    },
  });

  const { mutate, isLoading } = useSalesInsights(setInsights);
  // const {} = useGetOrderStats(user.merchant, '01-03-2021', '22-03-2023');

  React.useEffect(() => {
    mutate({
      merchant: user.merchant,
      outlet: 'ALL',
      start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
      end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
    });
  }, [summaryStartDate, summaryEndDate, user.merchant, mutate]);

  if (isLoading) {
    return <Loading />;
  }

  const notIncluded = ['Offline MoMo', 'Offline Card', 'GhQR', 'Store Credit'];

  const momoPayments = ['MTN Mobile Money', 'Telecel Cash', 'AT Money'];

  // console.log('ddddddddddddddd', data && data.data && data.data.data);
  const total = ((insights && insights.sales_by_paymenttype) || []).reduce(
    (acc, curr) => {
      if (notIncluded.includes(curr.PAYMENT_TYPE)) {
        return acc;
      }
      return acc + Number(curr.TYPE_TOTAL_AMOUNT.replace(/,/g, ''));
    },
    0,
  );

  const chartData = (
    ((insights && insights.sales_by_paymenttype) || []).map(i => {
      if (!i) {
        return;
      }

      if (notIncluded.includes(i.PAYMENT_TYPE)) {
        return;
      }
      if (Number(i.TYPE_TOTAL_AMOUNT) === 0) {
        return;
      }

      const percent =
        (Number(i.TYPE_TOTAL_AMOUNT.replace(/,/g, '')) / total) * 100;
      return {
        name: i.PAYMENT_TYPE,
        value: Number(i.TYPE_TOTAL_AMOUNT.replace(/,/g, '')),
        color: colors[i.PAYMENT_TYPE],
        percentage: `${percent.toFixed(1)}%`,
      };
    }) || []
  ).filter(i => i);

  console.log(chartData);

  // const barChartLabels = [];
  // const barChartData = [];

  // const salesTrend = ((insights && insights.sales_by_day_graph) || []).map(
  //   (i, idx) => {
  //     if (!i) {
  //       return;
  //     }
  //     return {
  //       value: Number(i.TOTAL_SALES.replace(/,/g, '')),
  //       label: idx % 3 === 0 ? i.DAYS.slice(5) : null,
  //       labelTextStyle: {
  //         // fontFamily: 'Lato-Medium',
  //         fontSize: 12,
  //         color: '#30475e',
  //         width: 300,
  //       },
  //     };
  //   },
  // );

  const salesTrend = {
    data: {
      barData: {
        dataSets: [
          {
            values: [],
            config: {
              color: processColor('#006DFF'),
              barShadowColor: processColor('#006DFF'),
              highlightAlpha: 90,
              highlightColor: processColor('orange'),
            },
          },
        ],
        config: {
          barWidth: 0.5,
          dashedLine: {
            lineLength: 5, // required
            spaceLength: 2, // required
            // phase: number,
          },
        },
      },
      lineData: {
        dataSets: [
          {
            values: [],
            // label: 'Trend',
            config: {
              drawValues: false,
              colors: [processColor('#F29C6E')],
              mode: 'LINEAR',
              drawCircles: false,
              lineWidth: 1.4,
              axisDependency: 'LEFT',
            },
          },
        ],
      },
    },
    xAxis: {
      valueFormatter: [],
      granularityEnabled: true,
      granularity: 3,
      position: 'BOTTOM',
      fontFamily: 'SFProDisplay-Regular',
      textSize: 10.7,
      fontStyle: {
        color: processColor('#091D60'),
      },
      drawGridLines: false,
      gridDashedLine: {
        lineLength: Dimensions.get('window').width * 0.03,
        spaceLength: Dimensions.get('window').width * 0.02,
      },
      // avoidFirstLastClipping: true,
      // yOffset: 0,
      textColor: processColor('#091D60'),
      gridColor: processColor('#9BABB8'),
    },

    yAxis: {
      right: {
        enabled: false,
      },
      left: {
        drawAxisLine: false,
        gridColor: processColor('#9BABB8'),
        gridDashedLine: {
          lineLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.03
              : Dimensions.get('window').width * 0.01,
          spaceLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.02
              : Dimensions.get('window').width * 0.01,
        },
        fontFamily: 'SFProDisplay-Regular',
        // zeroLine: {
        //   // enabled: false,
        // },
        textColor: processColor('#091D60'),
      },
    },
  };

  ((insights && insights.sales_by_day_graph) || []).forEach((data, idx) => {
    if (data) {
      // if (idx % 3 === 0) {
      salesTrend.xAxis.valueFormatter.push(data.DAYS.slice(5));
      // }

      salesTrend.data.barData.dataSets[0].values.push({
        y: Number(data.TOTAL_SALES.replace(/,/g, '')),
        // marker: new Intl.NumberFormat().format(
        //   Number(data.TOTAL_SALES.replace(/,/g, '')),
        // ),
      });
      salesTrend.data.lineData.dataSets[0].values.push({
        y: Number(data.TOTAL_SALES.replace(/,/g, '')),
        marker: new Intl.NumberFormat().format(
          Number(data.TOTAL_SALES.replace(/,/g, '')),
        ),
      });
    }
  });

  const momoTotal = chartData.reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    if (!momoPayments.includes(curr.name)) {
      return acc;
    }
    return curr.value + acc;
  }, 0);

  console.log('ccccc', chartData);

  const barChartData = {
    data: {
      dataSets: [
        {
          values: [],
          config: {
            color: processColor('#006DFF'),
            barShadowColor: processColor('#006DFF'),
            highlightAlpha: 90,
            highlightColor: processColor('orange'),
          },
        },
      ],
      config: {
        barWidth: 0.25,
        dashedLine: {
          lineLength: 5, // required
          spaceLength: 2, // required
          // phase: number,
        },
      },
    },
    xAxis: {
      valueFormatter: [],
      granularityEnabled: true,
      granularity: 1,
      position: 'BOTTOM',
      fontFamily: 'SFProDisplay-Regular',
      textSize: 10.7,
      fontStyle: {
        color: processColor('#091D60'),
      },
      drawGridLines: false,
      gridDashedLine: {
        lineLength: Dimensions.get('window').width * 0.03,
        spaceLength: Dimensions.get('window').width * 0.02,
      },
      // avoidFirstLastClipping: true,
      // yOffset: 0,
      textColor: processColor('#091D60'),
      gridColor: processColor('#9BABB8'),
    },

    yAxis: {
      right: {
        enabled: false,
      },
      left: {
        drawAxisLine: false,
        gridColor: processColor('#9BABB8'),
        gridDashedLine: {
          lineLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.03
              : Dimensions.get('window').width * 0.01,
          spaceLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.02
              : Dimensions.get('window').width * 0.01,
        },
        fontFamily: 'SFProDisplay-Regular',
        zeroLine: {
          // enabled: false,
        },
        textColor: processColor('#091D60'),
        // valueFormatter: '1000.11',
        // valueFormatter: 'largeValue',
      },
    },
  };

  ((insights && insights.sales_by_channel_breakdown) || []).forEach(data => {
    if (data) {
      barChartData.xAxis.valueFormatter.push(data.BREAKDOWNS);
      barChartData.data.dataSets[0].values.push({
        y: Number(data.TOTAL_SALES.replace(/,/g, '')),
        marker: new Intl.NumberFormat().format(
          Number(data.TOTAL_SALES.replace(/,/g, '')),
        ),
      });
    }
  });
  const salesByChannelLegend = (
    (insights && insights.sales_by_channel_breakdown) ||
    []
  ).map(i => {
    if (!i) {
      return;
    }
    return {
      value: Number(i.TOTAL_SALES.replace(/,/g, '')),
      label: i.BREAKDOWNS,
    };
  });

  // const data = {
  //   labels: barChartLabels,
  //   datasets: [
  //     {
  //       data: barChartData,
  //     },
  //   ],
  // };

  let summary = [];
  for (let i in (insights && insights.sales_summary) || {}) {
    summary.push({ title: i, metric: insights.sales_summary[i] });
  }
  console.log('charrrrrrrrrr', chartData);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() =>
            mutate({
              merchant: user.merchant,
              outlet: 'ALL',
              start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
              end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
            })
          }
        />
      }>
      <View style={styles.main}>
        <View style={[ss.card, { marginHorizontal: 0 }]}>
          <View
            style={{
              marginTop: 14.5,
              paddingLeft: 18,
              flexDirection: 'row',
              alignItems: 'center',
              // position: 'absolute'
            }}>
            <Text style={ss.headerText}>Sales Trend</Text>
            <Pressable
              style={{
                marginLeft: 'auto',
                marginRight: Dimensions.get('window').width * 0.05,
                padding: 8,
              }}
              onPress={() => {
                console.log('prrrrrrrr');
                SheetManager.show('AnalyticsFilter', {
                  payload: {
                    startDate: summaryStartDate,
                    endDate: summaryEndDate,
                    setStartDate: setSummaryStartDate,
                    setEndDate: setSummaryEndDate,
                    startIndex: 4,
                  },
                });
              }}>
              <Text
                style={[
                  {
                    color: '#006DFF',
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 14.5,
                  },
                ]}>
                {range.label}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              marginVertical: 14,
              // flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              paddingLeft: 10,
              flex: 1,
              // backgroundColor: 'red',
              width: '100%',
              height: Dimensions.get('window').height * 0.4,
              alignItems: 'stretch',
            }}>
            <CombinedChart
              style={styles.chart}
              data={salesTrend.data}
              xAxis={salesTrend.xAxis}
              animation={{ durationX: 100 }}
              legend={state.current.legend}
              gridBackgroundColor={processColor('#ffffff')}
              visibleRange={{ x: { min: 11, max: 11 } }}
              drawBarShadow={false}
              drawValueAboveBar={true}
              chartDescription={{ text: '' }}
              // drawHighlightArrow={true}
              // onSelect={this.handleSelect.bind(this)}
              // highlights={state.current.highlights}
              yAxis={salesTrend.yAxis}
              drawOrder={['BAR', 'LINE']}
              pinchZoom={false}
              dragEnabled={true}
              doubleTapToZoomEnabled={false}
              marker={{
                enabled: true,
                digits: 0,
                markerColor: processColor('#006DFF'),
                textColor: processColor('#FFF'),
                textSize: 20,
                textAlign: 'center',
              }}

              // viewPortOffsets={{ left: -10 }}
            />
          </View>
        </View>
        <View style={[ss.card, { marginHorizontal: 0 }]}>
          <View
            style={{
              marginTop: 14.5,
              paddingLeft: 18,
              marginBottom: 0,
              flexDirection: 'row',
            }}>
            <Text style={ss.headerText}>Sales By Channel</Text>
            <Pressable
              style={{
                marginLeft: 'auto',
                marginRight: Dimensions.get('window').width * 0.05,
              }}
              onPress={() => {
                SheetManager.show('AnalyticsFilter', {
                  payload: {
                    startDate: summaryStartDate,
                    endDate: summaryEndDate,
                    setStartDate: setSummaryStartDate,
                    setEndDate: setSummaryEndDate,
                    startIndex: 4,
                  },
                });
              }}>
              <Text
                style={[
                  {
                    color: '#006DFF',
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 14.5,
                  },
                ]}>
                {range.label}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              marginVertical: 14,
              flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              paddingLeft: 10,
              width: '100%',
              height: Dimensions.get('window').height * 0.63,
            }}>
            <BarChart
              style={styles.chart}
              data={barChartData.data}
              xAxis={barChartData.xAxis}
              animation={{ durationX: 100 }}
              // legend={state.current.legend}
              gridBackgroundColor={processColor('#ffffff')}
              visibleRange={{ x: { min: 5, max: 5 } }}
              drawBarShadow={false}
              drawValueAboveBar={true}
              // drawHighlightArrow={true}
              // onSelect={this.handleSelect.bind(this)}
              // highlights={state.current.highlights}
              yAxis={barChartData.yAxis}
              chartDescription={{ text: '' }}
              marker={{
                enabled: true,
                digits: 3,
                markerColor: processColor('#006DFF'),
                textColor: processColor('#FFF'),
                textSize: 20,
                textAlign: 'center',
              }}
            />
            {/* <BarChart
              data={barChartData}
              // width={Dimensions.get('window').width * 0.9}
              barBorderRadius={2.4}
              barWidth={22}
              yAxisTextStyle={{ color: '#30475e' }}
              // rotateLabel
              // xAxisColor="#fff"
              // yAxisColor="#fff"
              // topColor={'#ff66f4'}
              // xAxisThickness={0}
              xAxisType="dashed"
              yAxisThickness={0}
              xAxisTextNumberOfLines={4}
              xAxisColor={'lightgray'}
              // barMarginBottom={10}
              // hideOrigin
              // roundedTop
              // roundedBottom

              backgroundColor="#fff"
              frontColor={'#006DFF'}
              spacing={Dimensions.get('window').width / 5}
              height={Dimensions.get('window').height * 0.34}
              xAxisLabelTextStyle={{
                color: '#30475e',
                width: 300,
                backgroundColor: 'red',
              }}
            /> */}
            <View
              style={{
                alignSelf: 'center',
                marginTop: 22,
              }}>
              {salesByChannelLegend.map((item, idx) => {
                if (!item) {
                  return;
                }
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 8,
                      // backgroundColor: 'red',
                      width: '90%',
                      borderBottomColor: '#ddd',
                      borderBottomWidth: 0.5,
                      borderTopColor: '#ddd',
                      borderTopWidth: idx === 0 ? 0.5 : 0,
                    }}
                    key={item.label}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Regular',
                        color: '#191825',
                        fontSize: 14,
                      }}>
                      {item.label.slice(0, 1).toUpperCase() +
                        item.label.slice(1).toLowerCase()}{' '}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Regular',
                        color: '#191825',
                        fontSize: 14,
                        marginLeft: 'auto',
                      }}>
                      {formatNumberTwoSig(item?.value)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* <View style={{ marginVertical: 14, paddingLeft: 18 }}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 16.5,
              color: '#30475e',
            }}>
            Sales
          </Text>
        </View> */}

        <View>
          <View style={[ss.card, { paddingLeft: 10 }]}>
            <View style={[ss.header, { flexDirection: 'row' }]}>
              <Text style={[ss.headerText]}>Sales By Payment Type</Text>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range?.label}
                </Text>
              </Pressable>
            </View>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 14,
                  paddingLeft: 10,
                }}>
                {/* {chartData.length > 0 && ( */}
                <PieChart
                  data={chartData}
                  showText
                  textColor="#000"
                  radius={85}
                  textSize={12}
                  donut
                  // innerCircleBorderColor="#fff"
                  // showTextBackground
                  // textBackgroundRadius={26}
                  // showGradient
                  // radius={90}
                  innerRadius={62}
                  innerCircleColor={'#232B5D'}
                  centerLabelComponent={() => {
                    return (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'white',
                            // fontWeight: 'bold',
                          }}>
                          {new Intl.NumberFormat().format(total)}
                        </Text>
                        <Text style={{ fontSize: 12, color: 'white' }}>
                          Total
                        </Text>
                      </View>
                    );
                  }}
                />
                {/* )} */}
                <View style={{ paddingHorizontal: 0 }}>
                  {chartData.map((item, i) => {
                    if (!item) {
                      return;
                    }
                    if (notIncluded.includes(item.name)) {
                      return;
                    }
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 4.5,
                          alignItems: 'center',
                        }}
                        key={item.name}>
                        <View
                          style={{
                            height: 7,
                            width: 7,
                            backgroundColor: item.color,
                            marginRight: 12,
                            borderRadåius: 0,
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              fontFamily: 'ReadexPro-Medium',
                              color: '#30475e',
                              fontSize: 13.8,
                            }}>
                            {shortName[item.name]}{' '}
                            <Text
                              style={{
                                color: '#656',
                                fontFamily: 'ReadexPro-Regular',
                                opacity: 0.7,
                              }}>
                              ({item.percentage})
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'ReadexPro-Medium',
                              color: '#30475e',
                              fontSize: 12.8,
                            }}>
                            GHS {formatNumberTwoSig(item?.value)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Medium',
                      fontSize: 14,
                      color: '#30475e',
                      marginTop: 6,
                    }}>
                    MoMo Total: GHS{' '}
                    {new Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(momoTotal)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const Products = () => {
  const [productStatus, setProductStatus] = React.useState();
  const { mutate, isLoading } = useProductAnalytics(setProductStatus);

  const { summaryStartDate, summaryEndDate, range } = useSelector(
    state => state.merchant,
  );
  const { user } = useSelector(state => state.auth);
  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();
  React.useEffect(() => {
    mutate({
      merchant: user.merchant,
      outlet: 'ALL',
      start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
      end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
    });
  }, [mutate, user, summaryStartDate, summaryEndDate]);

  if (isLoading) {
    return <Loading />;
  }

  const topSellingProducts =
    productStatus && productStatus.products_top_selling;

  const productSummary = productStatus && productStatus.products_summary;

  const leastSellingProducts =
    productStatus && productStatus.products_least_selling;

  const productsNewAdded = productStatus && productStatus.products_new_added;

  const productLowStock = productStatus && productStatus.products_low_stock;

  const productsTrend = (productStatus && productStatus.products_trend) || [];

  const trendLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // const barChartData = (
  //   (insights && insights.sales_by_channel_breakdown) ||
  //   []
  // ).map(i => {
  //   if (!i) {
  //     return;
  //   }
  //   return {
  //     value: Number(i.TOTAL_SALES.replace(/,/g, '')),
  //     label: i.BREAKDOWNS,
  //     topLabelComponent: () => (
  //       <Text style={{ color: 'blue', fontSize: 18, marginBottom: 6 }}>50</Text>
  //     ),
  //     labelTextStyle: {
  //       // fontFamily: 'Lato-Medium',
  //       fontSize: 14,
  //       color: '#30475e',
  //     },
  //     labelComponent: () => {
  //       return (
  //         <Text numberOfLines={1} style={{ fontSize: 11, color: '#30475e' }}>
  //           {i.BREAKDOWNS}
  //         </Text>
  //       );
  //     },
  //   };

  //   // barChartLabels.push(i.BREAKDOWNS);

  //   // return {
  //   //   name: i.PAYMENT_TYPE,
  //   //   amount: Number(i.TYPE_TOTAL_AMOUNT),
  //   //   color: colors[i.PAYMENT_TYPE],
  //   //   legendFontColor: '#7F7F7F',
  //   //   legendFontSize: 14,
  //   //   legendFontFamily: 'Lato-Semibold',
  //   // };
  // });

  const trendData = [];

  // trendLabels.forEach((label, i) => {
  //   if (!productsTrend[i]) {
  //     trendData.push({
  //       value: 0,
  //       label: label,
  //       topLabelComponent: () => (
  //         <Text
  //           style={{
  //             color: '#30475e',
  //             fontSize: 12,
  //             // marginBottom: 6,
  //             position: 'absolute',
  //           }}>
  //           0
  //         </Text>
  //       ),
  //       // topLabelComponent: () => (
  //       //   <Text style={{ color: 'blue', fontSize: 18, marginBottom: 6 }}>
  //       //     0
  //       //   </Text>
  //       // ),
  //       // labelTextStyle: {
  //       //   // fontFamily: 'Lato-Medium',
  //       //   fontSize: 12,
  //       //   color: '#30475e',
  //       // },
  //       // labelComponent: () => {
  //       //   return (
  //       //     <Text numberOfLines={1} style={{ fontSize: 11, color: '#30475e' }}>
  //       //       {label}
  //       //     </Text>
  //       //   );
  //       // },
  //       frontColor: '#006DFF',
  //       gradientColor: '#009FFF',
  //       spacing: 4,
  //     });
  //     trendData.push({
  //       value: 0,
  //       topLabelComponent: () => (
  //         <Text
  //           style={{
  //             color: '#30475e',
  //             fontSize: 12,
  //             // marginBottom: 6,
  //             position: 'absolute',
  //           }}>
  //           0
  //         </Text>
  //       ),
  //       frontColor: '#3BE9DE',
  //       gradientColor: '#93FCF8',
  //       // spacing: Dimensions.get('window').width / 8,
  //     });
  //     return;
  //   }
  //   trendData.push({
  //     value: Number(
  //       (productsTrend[i] || { PRODUCT_SALES: '0' }).PRODUCT_SALES.replace(
  //         /,/g,
  //         '',
  //       ),
  //     ),
  //     label: label,
  //     gradientColor: '#009FFF',
  //     topLabelComponent: () => (
  //       <Text
  //         style={{
  //           color: '#30475e',
  //           fontSize: 12,
  //           // marginBottom: 6,
  //           position: 'absolute',
  //         }}>
  //         {Number(
  //           (productsTrend[i] || { PRODUCT_SALES: '0' }).PRODUCT_SALES.replace(
  //             /,/g,
  //             '',
  //           ),
  //         )}
  //       </Text>
  //     ),
  //     frontColor: '#006DFF',
  //     spacing: 4,
  //   });

  //   trendData.push({
  //     value: Number(
  //       (productsPrevTrend[i] || { PRODUCT_SALES: '0' }).PRODUCT_SALES.replace(
  //         /,/g,
  //         '',
  //       ),
  //     ),
  //     topLabelComponent: () => (
  //       <Text
  //         style={{
  //           color: '#30475e',
  //           fontSize: 12,
  //           // marginBottom: 6,
  //           position: 'absolute',
  //         }}>
  //         {Number(
  //           (
  //             productsPrevTrend[i] || { PRODUCT_SALES: '0' }
  //           ).PRODUCT_SALES.replace(/,/g, ''),
  //         )}
  //       </Text>
  //     ),
  //     frontColor: '#3BE9DE',
  //     gradientColor: '#93FCF8',
  //     // spacing: Dimensions.get('window').width / 8,
  //   });
  // });

  console.log(trendLabels);

  const salesTrend = {
    data: {
      barData: {
        dataSets: [
          {
            values: [],
            config: {
              color: processColor('#006DFF'),
              barShadowColor: processColor('#006DFF'),
              highlightAlpha: 90,
              highlightColor: processColor('orange'),
            },
          },
        ],
        config: {
          barWidth: 0.5,
          dashedLine: {
            lineLength: 5, // required
            spaceLength: 2, // required
            // phase: number,
          },
        },
      },
      lineData: {
        dataSets: [
          {
            values: [],
            // label: 'Trend',
            config: {
              drawValues: false,
              colors: [processColor('#F29C6E')],
              mode: 'LINEAR',
              drawCircles: false,
              lineWidth: 1.4,
              axisDependency: 'LEFT',
            },
          },
        ],
      },
    },
    xAxis: {
      valueFormatter: [],
      granularityEnabled: true,
      granularity: 3,
      position: 'BOTTOM',
      fontFamily: 'SFProDisplay-Regular',
      textSize: 10.7,
      fontStyle: {
        color: processColor('#091D60'),
      },
      drawGridLines: false,
      gridDashedLine: {
        lineLength: Dimensions.get('window').width * 0.03,
        spaceLength: Dimensions.get('window').width * 0.02,
      },
      // avoidFirstLastClipping: true,
      // yOffset: 0,
      textColor: processColor('#091D60'),
      gridColor: processColor('#9BABB8'),
    },

    yAxis: {
      right: {
        enabled: false,
      },
      left: {
        drawAxisLine: false,
        gridColor: processColor('#9BABB8'),
        gridDashedLine: {
          lineLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.03
              : Dimensions.get('window').width * 0.01,
          spaceLength:
            Platform.OS === 'android'
              ? Dimensions.get('window').width * 0.02
              : Dimensions.get('window').width * 0.01,
        },
        fontFamily: 'SFProDisplay-Regular',
        zeroLine: {
          // enabled: false,
        },
        textColor: processColor('#091D60'),
        position: 'OUTSIDE_CHART',
        // gridLineWidth: 1,
      },
    },
  };

  ((productsTrend && productsTrend) || []).forEach((data, idx) => {
    if (data) {
      // if (idx % 3 === 0) {
      salesTrend.xAxis.valueFormatter.push(data.DAYS.slice(5));
      // }

      salesTrend.data.barData.dataSets[0].values.push({
        y: Number(data.PRODUCT_SALES.replace(/,/g, '')),
      });
      salesTrend.data.lineData.dataSets[0].values.push({
        y: Number(data.PRODUCT_SALES.replace(/,/g, '')),
        marker: new Intl.NumberFormat().format(
          Number(data.PRODUCT_SALES.replace(/,/g, '')),
        ),
      });
    }
  });

  return (
    <ScrollView
      style={{ backgroundColor: '#F9F9F9' }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() =>
            mutate({
              merchant: user.merchant,
              outlet: 'ALL',
              start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
              end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
            })
          }
        />
      }>
      <View style={[ss.card, { marginHorizontal: 0 }]}>
        <View
          style={{
            marginTop: 14.5,
            paddingLeft: 18,
            marginBottom: 0,
            flexDirection: 'row',
          }}>
          <Text style={ss.headerText}>Product Sales Trend (count)</Text>
          <Pressable
            style={{ marginLeft: 'auto', marginRight: 12 }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            marginVertical: 14,
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            // marginBottom: 16,
          }}>
          <View
            style={{
              marginVertical: 14,
              // flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              // paddingLeft: 10,
              flex: 1,
              // backgroundColor: 'red',
              width: '100%',
              height: Dimensions.get('window').height * 0.4,
              alignItems: 'stretch',
            }}>
            <CombinedChart
              style={styles.chart}
              data={salesTrend.data}
              xAxis={salesTrend.xAxis}
              animation={{ durationX: 100 }}
              // legend={state.current.legend}
              gridBackgroundColor={processColor('#ffffff')}
              visibleRange={{ x: { min: 11, max: 1 } }}
              drawBarShadow={false}
              drawValueAboveBar={true}
              chartDescription={{ text: '' }}
              // drawHighlightArrow={true}
              // onSelect={this.handleSelect.bind(this)}
              // highlights={state.current.highlights}
              yAxis={salesTrend.yAxis}
              drawOrder={['BAR', 'LINE']}
              pinchZoom={false}
              dragEnabled={true}
              doubleTapToZoomEnabled={false}
              marker={{
                enabled: true,
                digits: 0,
                markerColor: processColor('#006DFF'),
                textColor: processColor('#FFF'),
                textSize: 20,
                textAlign: 'center',
              }}
              onSelect={event => {
                // console.log(event.nativeEvent);
              }}
              // viewPortOffsets={{ left: -10 }}
            />
            {/* <BarChart
              data={trendData}
              barWidth={30}
              initialSpacing={10}
              // spacing={20}
              spacing={Dimensions.get('window').width / 11}
              barBorderRadius={2.4}
              // showGradient
              yAxisThickness={0}
              xAxisType={'dashed'}
              xAxisColor={'lightgray'}
              yAxisTextStyle={{ color: '#30475e' }}
              width={Dimensions.get('window').width * 0.9}
              showScrollIndicator
              // yAxisLabelPrefix="$"
              // stepValue={1000}
              // maxValue={6000}
              // noOfSections={6}
              // yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
              labelWidth={40}
              xAxisLabelTextStyle={{
                color: '#30475e',
                textAlign: 'center',
                fontSize: 12,
              }}
            /> */}
          </View>
          {/* <BarChart
            data={trendData}
            // width={Dimensions.get('window').width * 0.9}
            barBorderRadius={3}
            barWidth={7}
            // rotateLabel
            // xAxisColor="#fff"
            // yAxisColor="#fff"
            // topColor={'#ff66f4'}
            // xAxisThickness={0}
            yAxisThickness={0}
            // xAxisTextNumberOfLines={4}
            // barMarginBottom={10}
            // hideOrigin
            // roundedTop
            // roundedBottom
            backgroundColor="#fff"
            frontColor={'#1B6BB0'}
            spacing={Dimensions.get('window').width / 8}
            height={Dimensions.get('window').height * 0.34}
            yAxisTextStyle={{ color: '#30475e' }}
            showScrollIndicator
            xAxisLabelTextStyle={{
              color: '#30475e',
              textAlign: 'center',
            }}
            xAxisLabelTexts={trendLabels}
            initialSpacing={10}
            // showLine
            // lineConfig={{
            //   color: '#F29C6E',
            //   thickness: 3,
            //   curved: true,
            //   hideDataPoints: true,
            //   shiftY: 20,
            //   initialSpacing: -30,
            // }}
            xAxisType={'dashed'}
            xAxisColor={'lightgray'}
          /> */}
        </View>
      </View>
      <View style={ss.card}>
        <View style={[ss.header, { flexDirection: 'row' }]}>
          <Text style={ss.headerText}>Products Summary</Text>
          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>

        <View style={ss.item}>
          <Text style={ss.name} numberOfLines={1}>
            Products Sold (count)
          </Text>
          <Text style={ss.amount}>
            {productSummary && productSummary.PRODUCTS_SOLD}
          </Text>
        </View>
        {/* <View style={ss.item}>
          <Text style={ss.name} numberOfLines={1}>
            Avg Products Per Order
          </Text>
          <Text style={ss.amount}>
            {productSummary && productSummary.PRODUCTS_PER_ORDER}
          </Text>
        </View> */}
        <View style={ss.item}>
          <Text style={ss.name} numberOfLines={1}>
            Avg Products Per Sale
          </Text>
          <Text style={ss.amount}>
            {productSummary && productSummary.AVG_PRODUCTS_PER_SALE}
          </Text>
        </View>
      </View>
      <View style={ss.card}>
        <View style={[ss.header, { flexDirection: 'row' }]}>
          <Text style={ss.headerText}>Products with low stock</Text>
          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>
        {(productLowStock || []).map(i => {
          if (!i) {
            return;
          }
          return (
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                {i.product_name}
              </Text>
              <Text style={ss.amount}>{i.product_quantity}</Text>
            </View>
          );
        })}
      </View>
      <View style={ss.card}>
        <View style={[ss.header, { flexDirection: 'row' }]}>
          <Text style={ss.headerText}>New Products Added</Text>
          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>
        {(productsNewAdded || []).map(i => {
          if (!i) {
            return;
          }
          return (
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                {i.product_name}
              </Text>
              {/* <Text style={ss.amount}>{i.product_quantity}</Text> */}
            </View>
          );
        })}
      </View>
      <View style={ss.card}>
        <View style={[ss.header, { flexDirection: 'row' }]}>
          <Text style={ss.headerText}>Top 5 Selling Products</Text>
          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>
        {(topSellingProducts || []).map(i => {
          if (!i) {
            return;
          }
          return (
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                {i.product_name}
              </Text>
              <Text style={ss.amount}>{i.sales_count}</Text>
            </View>
          );
        })}
      </View>
      <View style={ss.card}>
        <View style={[ss.header, { flexDirection: 'row' }]}>
          <Text style={ss.headerText}>Least Performing Products (5)</Text>
          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              console.log('prrrrrrrr');
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View>
        {(leastSellingProducts || []).map(i => {
          if (!i) {
            return;
          }
          return (
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                {i.product_name}
              </Text>
              <Text style={ss.amount}>{i.sales_count}</Text>
            </View>
          );
        })}
      </View>

      {/* <View>
        <View style={{ marginVertical: 14, paddingLeft: 18 }}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 16.5,
              color: '#30475e',
            }}>
            Top 5 Selling Products
          </Text>
        </View>
        <View
          style={{
            // justifyContent: 'center',
            paddingHorizontal: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingLeft: Dimensions.get('window').width * 0.05,
          }}>
          {(topSellingProducts || []).map(i => {
            return (
              <AnalyticsProductCard
                itemName={i.product_name}
                amount={i.sales_amount}
                product_image={i.product_image}
                count={i.sales_count}
              />
            );
          })}
        </View>
      </View> */}
      {/* <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View>
          <View style={{ marginVertical: 14, paddingLeft: 18 }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 16.5,
                color: '#30475e',
              }}>
              Least Performing Products (5)
            </Text>
          </View>
          {(leastSellingProducts || []).map(i => {
            if (!i) {
              return;
            }
            return (
              <View style={ss.item}>
                <Text style={ss.name} numberOfLines={1}>
                  {i.product_name}
                </Text>
                <Text style={ss.amount}>{i.sales_count}</Text>
              </View>
            );
          })}
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingLeft: Dimensions.get('window').width * 0.05,
            }}>
            {(leastSellingProducts || []).map(i => {
              return (
                <AnalyticsProductCard
                  itemName={i.product_name}
                  amount={i.sales_amount}
                  product_image={i.product_image}
                  count={i.sales_count}
                />
              );
            })}
          </View>
        </View>
      </View> */}
    </ScrollView>
  );
};

const Customers = () => {
  const { user } = useSelector(state => state.auth);
  const [data, setData] = React.useState();
  // const { startDate, endDate } = useSelector(state => state.orders);
  const { summaryStartDate, summaryEndDate, range } = useSelector(
    state => state.merchant,
  );
  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();
  const { mutate, isLoading } = useGetCustomerAnalytics(setData);

  const {
    data: $customersData,
    isLoading: isCustomersLoading,
    // isRefetching,
    // refetch,
  } = useGetMerchantCustomers(user.merchant);

  const customersData = $customersData?.data?.data || [];

  console.log('tttttyyy', typeof $customersData?.data?.data);

  React.useEffect(() => {
    mutate({
      merchant: user.merchant,
      outlet: 'ALL',
      start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
      end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
    });
  }, [mutate, user, summaryStartDate, summaryEndDate]);

  if (isLoading || isCustomersLoading) {
    return <Loading />;
  }
  const topSales = (data && data.customers_top_sales) || [];
  const topOrders = (data && data.customers_top_orders) || [];
  const leastSales = (data && data.customers_least_sales) || [];
  const summary = (data && data.customers_summary) || {};
  console.log('customer summary ', summary);
  const customerCat = (data && data.customers_pie_chart) || {};
  const colors_ = {
    NEW: '#6C9BCF',
    RETURNING: '#05BFDB',
  };
  const totalCustomerType =
    Number(customerCat.RETURNING) + Number(customerCat.NEW);
  const chartData = [];
  for (let i in customerCat) {
    chartData.push({
      name: i,
      value: Number(customerCat[i]),
      color: colors_[i],
      percent: `${(
        (Number(customerCat[i] || 0) / (totalCustomerType || 1)) *
        100
      ).toFixed(1)}%`,
    });
  }

  // const chartData =
  //   ((insights && insights.sales_by_paymenttype) || []).map(i => {
  //     if (!i) {
  //       return;
  //     }
  //     return {
  //       name: i.PAYMENT_TYPE,
  //       amount: Number(i.TYPE_TOTAL_AMOUNT.replace(/,/g, '')),
  //       color: colors[i.PAYMENT_TYPE],
  //       legendFontColor: '#7F7F7F',
  //       legendFontSize: 14,
  //       legendFontFamily: 'Lato-Semibold',
  //     };
  //   }) || [];

  return (
    <View style={ss.main}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            onRefresh={() =>
              mutate({
                merchant: user.merchant,
                outlet: 'ALL',
                start_date: moment(summaryStartDate).format('DD-MM-YYYY'),
                end_date: moment(summaryEndDate).format('DD-MM-YYYY'),
              })
            }
            refreshing={isLoading}
          />
        }>
        <View>
          <View style={ss.card}>
            <View style={ss.header}>
              <View>
                <Text style={[ss.headerText]} numberOfLines={2}>
                  Customers by type
                </Text>
                <Text style={[ss.headerText]}>(New or Returning)</Text>
              </View>

              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable>
            </View>

            <View style={{ alignItems: 'flex-start', marginLeft: 20 }}>
              {chartData?.length > 0 && (
                <PieChart
                  data={chartData}
                  donut
                  // showGradient
                  // focusOnPress
                  radius={106}
                  innerRadius={80}
                  innerCircleColor={'#232B5D'}
                  showText
                  // showValuesAsLabels
                  textColor="#30475e"
                  centerLabelComponent={() => {
                    return (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                          {((chartData[0] && chartData[0]).value || 0) +
                            ((chartData[1] && chartData[1]).value || 0)}
                        </Text>
                        <Text style={{ fontSize: 13, color: 'white' }}>
                          Total
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
            {chartData.length > 0 && (
              <View style={{ paddingHorizontal: 26 }}>
                {chartData.map(item => {
                  if (!item) {
                    return;
                  }
                  return (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                      key={item.name}>
                      <View
                        style={{
                          height: 7,
                          width: 7,
                          backgroundColor: item.color,
                          marginRight: 6,
                          marginVertical: 9,
                          borderRadius: 0,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: 'SFProDisplay-Medium',
                          color: '#091D60',
                          fontSize: 14,
                        }}>
                        {item.name.slice(0, 1).toUpperCase() +
                          item.name.slice(1).toLowerCase()}{' '}
                        -{' '}
                        <Text
                          style={{
                            fontFamily: 'SFProDisplay-Medium',
                            color: '#091D60',
                            fontSize: 14,
                          }}>
                          {item.value}{' '}
                          <Text
                            style={{
                              color: '#656',
                              fontFamily: 'SFProDisplay-Regular',
                            }}>
                            ({item.percent})
                          </Text>
                        </Text>
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View style={ss.card}>
            <View style={[ss.header, { flexDirection: 'row' }]}>
              <Text style={ss.headerText}>Customer Summary</Text>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  console.log('prrrrrrrr');
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable>
            </View>

            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                Total Customers
              </Text>
              <Text style={ss.amount}>{summary?.TOTAL_CUSTOMERS}</Text>
            </View>
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                Avg Spend per Customer
              </Text>
              <Text style={ss.amount}>
                GHS{' '}
                {new Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(summary?.AVG_SPEND || 0)}
              </Text>
            </View>
            <View style={ss.item}>
              <Text style={ss.name} numberOfLines={1}>
                Avg Orders per Customer
              </Text>
              <Text style={ss.amount}>{summary?.AVG_ORDERS}</Text>
            </View>
          </View>
          <View style={ss.card}>
            <View style={ss.header}>
              <Text style={ss.headerText}>Top 5 Customers by Spend</Text>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  console.log('prrrrrrrr');
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable>
            </View>

            <View>
              {topSales.map(i => {
                if (!i) {
                  return;
                }
                const splitName = i.CUSTOMER_NAME.split(' ');
                const first =
                  (splitName[0] || '').slice(0, 1).toUpperCase() +
                  (splitName[0] || '').slice(1).toLowerCase();
                const second =
                  (splitName[1] || '').slice(0, 1).toUpperCase() +
                  (splitName[1] || '').slice(1).toLowerCase();
                return (
                  <View style={ss.item}>
                    <Text style={ss.name} numberOfLines={1}>
                      {first} {second}
                    </Text>
                    <Text style={ss.amount}>
                      GHS {new Intl.NumberFormat().format(i.CUSTOMER_SALES)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={ss.card}>
            <View style={ss.header}>
              <Text style={ss.headerText}>Top 5 Customers by Orders</Text>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  console.log('prrrrrrrr');
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable>
            </View>

            <View>
              {topOrders.map(i => {
                if (!i) {
                  return;
                }
                const splitName = i.CUSTOMER_NAME.split(' ');
                const first =
                  (splitName[0] || '').slice(0, 1).toUpperCase() +
                  (splitName[0] || '').slice(1).toLowerCase();
                const second =
                  (splitName[1] || '').slice(0, 1).toUpperCase() +
                  (splitName[1] || '').slice(1).toLowerCase();
                return (
                  <View style={ss.item}>
                    <Text style={ss.name} numberOfLines={1}>
                      {first} {second}
                    </Text>
                    <Text style={ss.amount}>{i.CUSTOMER_ORDERS}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={ss.card}>
            <View style={ss.header}>
              <Text style={ss.headerText}>Least Performing Customers (5)</Text>
              <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable>
            </View>

            <View>
              {leastSales.map(i => {
                if (!i) {
                  return;
                }
                const splitName = i.CUSTOMER_NAME.split(' ');
                const first =
                  (splitName[0] || '').slice(0, 1).toUpperCase() +
                  (splitName[0] || '').slice(1).toLowerCase();
                const second =
                  (splitName[1] || '').slice(0, 1).toUpperCase() +
                  (splitName[1] || '').slice(1).toLowerCase();
                return (
                  <View style={ss.item}>
                    <Text style={ss.name} numberOfLines={1}>
                      {first} {second}
                    </Text>
                    <Text style={ss.amount}>
                      GHS {new Intl.NumberFormat().format(i.CUSTOMER_SALES)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={ss.card}>
            <View style={ss.header}>
              <Text style={ss.headerText}>Top 5 Debtors</Text>
              {/* <Pressable
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  SheetManager.show('AnalyticsFilter', {
                    payload: {
                      startDate: summaryStartDate,
                      endDate: summaryEndDate,
                      setStartDate: setSummaryStartDate,
                      setEndDate: setSummaryEndDate,
                      startIndex: 4,
                    },
                  });
                }}>
                <Text
                  style={[
                    ss.headerText,
                    {
                      color: '#006DFF',
                      fontFamily: 'SFProDisplay-Medium',
                      fontSize: 14.5,
                    },
                  ]}>
                  {range.label}
                </Text>
              </Pressable> */}
            </View>

            {customersData?.length > 0 && (
              <View>
                {customersData
                  ?.sort(
                    (a, b) =>
                      Number(a?.customer_credit_limit) -
                      Number(b?.customer_credit_limit),
                  )
                  ?.slice(0, 5)
                  ?.map(i => {
                    if (!i) {
                      return;
                    }

                    return (
                      <View style={ss.item}>
                        <Text style={ss.name} numberOfLines={1}>
                          {i?.customer_name}
                        </Text>
                        <Text style={[ss.amount, {}]}>
                          GHS{' '}
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(i?.customer_credit_limit)}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerText: {
    fontFamily: 'SFProDisplay-Semibold',
    color: '#191825',
    fontSize: 14.8,
    letterSpacing: 0.2,
  },
  card: {
    // marginHorizontal: 12,
    backgroundColor: '#fff',
    paddingBottom: 8,
    marginTop: 8,
    // borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
  },
  name: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15.2,
    // maxWidth: '60%',
    letterSpacing: 0.2,
    flex: 1,
    marginRight: 18,
  },
  amount: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15.2,
    marginLeft: 'auto',
  },
});

const expensesColors = ['#BB67FE', '#A4A5E9', '#66CDB0', '#F97668', '#F49D72'];

const ExpensesInsights = props => {
  const { summaryStartDate, summaryEndDate, range } = useSelector(
    state => state.merchant,
  );

  const { user } = useSelector(state => state.auth);

  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();

  const { data, isLoading, refetch, isFetching } = useGetExpensesHistory(
    user.merchant,
    moment(summaryStartDate).format('DD-MM-YYYY'),
    moment(summaryEndDate).format('DD-MM-YYYY'),
  );
  const [avgWidth, setAvgWidth] = React.useState(0);

  if (isLoading) {
    return <Loading />;
  }

  const expensesData = data?.data?.data;

  let pieData = {};

  expensesData?.forEach((item, idx) => {
    if (item) {
      if (pieData[item?.expense_category_name]) {
        pieData[item?.expense_category_name].percentage += Number(
          item?.expense_amount_paid,
        );
        pieData[item?.expense_category_name].amount += Number(
          item?.expense_amount_paid,
        );
      } else {
        pieData[item?.expense_category_name] = {
          percentage: Number(item?.expense_amount_paid),
          color: expensesColors[idx % expensesColors.length],
          category: item?.expense_category_name,
          amount: Number(item?.expense_amount_paid),
        };
      }
    }
  });

  const categoryCount = {};

  expensesData?.forEach((item, idx) => {
    if (item) {
      if (categoryCount[item?.expense_category_name]) {
        categoryCount[item?.expense_category_name].percentage += 1;
        categoryCount[item?.expense_category_name].count += 1;
      } else {
        categoryCount[item?.expense_category_name] = {
          percentage: 1,
          color: expensesColors[idx % expensesColors.length],
          category: item?.expense_category_name,
          count: 1,
        };
      }
    }
  });

  const totalAmount = Object.values(pieData).reduce(
    (acc, curr) => acc + curr.percentage,
    0,
  );

  const totalCount = Object.values(categoryCount).reduce(
    (acc, curr) => acc + curr.percentage,
    0,
  );

  Object.values(pieData).forEach(i => {
    pieData[i.category] = {
      ...pieData[i.category],
      percentage: (i.percentage / totalAmount) * 100,
    };
  });

  Object.values(categoryCount).forEach(i => {
    categoryCount[i.category] = {
      ...categoryCount[i.category],
      percentage: (i.percentage / totalCount) * 100,
    };
  });

  const expenseAvgs = Object.values(pieData).map(
    i => i?.amount / categoryCount[i?.category].count,
  );

  const maxAvg = _.max(expenseAvgs);

  pieData = Object.values(pieData).map(i => {
    return {
      ...i,
      name: i?.category,
      percentage: i?.percentage.toFixed(2),
      value: Number(i?.amount.toFixed(2)),
    };
  });

  console.log('pieData', pieData);

  return (
    <ScrollView
      style={{ backgroundColor: '#fafafa', flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }>
      <View style={[ss.header, { paddingTop: 14 }]}>
        <View>
          <Text style={[ss.headerText]} numberOfLines={2}>
            Expenses Amount Summary
          </Text>
        </View>

        <Pressable
          style={{ marginLeft: 'auto' }}
          onPress={() => {
            SheetManager.show('AnalyticsFilter', {
              payload: {
                startDate: summaryStartDate,
                endDate: summaryEndDate,
                setStartDate: setSummaryStartDate,
                setEndDate: setSummaryEndDate,
                startIndex: 4,
              },
            });
          }}>
          <Text
            style={[
              ss.headerText,
              {
                color: '#006DFF',
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 14.5,
              },
            ]}>
            {range.label}
          </Text>
        </Pressable>
      </View>
      <View style={{ backgroundColor: '#fff', paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              alignItems: 'center',
              marginLeft: 18,
              backgroundColor: '#fff',
              alignSelf: 'flex-start',
            }}>
            <PieChart
              data={pieData}
              showText
              textColor="#000"
              radius={85}
              textSize={12}
              donut
              innerRadius={62}
              innerCircleColor={'#232B5D'}
              centerLabelComponent={() => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'white',
                        // fontWeight: 'bold',
                      }}>
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalAmount)}
                    </Text>
                    <Text style={{ fontSize: 12, color: 'white' }}>Total</Text>
                  </View>
                );
              }}
            />
            {/* <View style={styles.gauge}>
              <Text style={styles.gaugeText}>
                GHS
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalAmount)}
              </Text>
            </View> */}
          </View>
          <View>
            {Object.values(pieData).map(i => {
              return (
                <View style={{ paddingVertical: 6, marginLeft: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        backgroundColor: i.color,
                        marginRight: 4,
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        color: '#30475e',
                        // fontFamily: 'ReadexPro-Regular',
                        opacity: 0.9,
                      }}>
                      {i.category}
                    </Text>
                    <View style={{ marginHorizontal: 4 }} />
                  </View>
                  <Text
                    style={{
                      color: '#30475e',
                      // fontFamily: 'ReadexPro-Regular',
                      opacity: 0.8,
                    }}>
                    GHS{formatNumberTwoSig(i?.amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ marginBottom: 14 }} />
        {/* <View style={ss.header}>
          <View>
            <Text style={[ss.headerText]} numberOfLines={2}>
              Expenses Category Count
            </Text>
          </View>

          <Pressable
            style={{ marginLeft: 'auto' }}
            onPress={() => {
              SheetManager.show('AnalyticsFilter', {
                payload: {
                  startDate: summaryStartDate,
                  endDate: summaryEndDate,
                  setStartDate: setSummaryStartDate,
                  setEndDate: setSummaryEndDate,
                  startIndex: 4,
                },
              });
            }}>
            <Text
              style={[
                ss.headerText,
                {
                  color: '#006DFF',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 14.5,
                },
              ]}>
              {range.label}
            </Text>
          </Pressable>
        </View> */}
        {/* <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              // width: 175,
              alignItems: 'center',
              marginLeft: 18,
              marginTop: 8,
              backgroundColor: '#fff',
              alignSelf: 'flex-start',
            }}>
            <Pie
              radius={100}
              innerRadius={85}
              sections={Object.values(categoryCount)}
              backgroundColor="#ddd"
            />
            <View style={styles.gauge}>
              <Text style={styles.gaugeText}>{totalCount}</Text>
            </View>
          </View>
          <View>
            {Object.values(categoryCount).map(i => {
              return (
                <View style={{ paddingVertical: 6, marginLeft: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        backgroundColor: i.color,
                        marginRight: 4,
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        color: '#30475e',
                      }}>
                      {i?.category}
                    </Text>
                    <View style={{ marginHorizontal: 4 }} />
                  </View>
                  <Text
                    style={{
                      color: '#30475e',
                    }}>
                    {i?.count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View> */}
        <View
          style={{ paddingVertical: 16 }}
          onLayout={e => setAvgWidth(e.nativeEvent.layout.width)}>
          <View style={ss.header}>
            <View>
              <Text style={[ss.headerText]} numberOfLines={2}>
                Avg Spend Per Category
              </Text>
            </View>

            <Pressable
              style={{ marginLeft: 'auto' }}
              onPress={() => {
                SheetManager.show('AnalyticsFilter', {
                  payload: {
                    startDate: summaryStartDate,
                    endDate: summaryEndDate,
                    setStartDate: setSummaryStartDate,
                    setEndDate: setSummaryEndDate,
                    startIndex: 4,
                  },
                });
              }}>
              <Text
                style={[
                  ss.headerText,
                  {
                    color: '#006DFF',
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 14.5,
                  },
                ]}>
                {range.label}
              </Text>
            </Pressable>
          </View>
          <View>
            {Object.values(pieData).map(i => {
              const avgValue =
                Number(i?.amount) / (categoryCount[i?.category]?.count || 1);
              return (
                <View style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        backgroundColor: 'transparent',
                        color: '#000',
                        fontSize: 14,
                        fontFamily: 'ReadexPro-Medium',
                        marginBottom: 2,
                      }}>
                      {i?.category}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: 'transparent',
                        color: '#000',
                        fontSize: 14,
                        fontFamily: 'ReadexPro-Medium',
                        marginLeft: 'auto',
                      }}>
                      GHS{formatNumberTwoSig(avgValue)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: `${(Number(avgValue) / maxAvg) * 100}%`,
                      height: 6,
                      backgroundColor: i?.color,
                      borderRadius: 10,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const renderLabel = ({ route }) => {
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: 'ReadexPro-Medium',
        fontSize: 12.6,
        color: '#30475e',
        textTransform: 'capitalize',
        letterSpacing: -0.2,
      }}>
      {route.title}
    </Text>
  );
};

const Analytics = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Overview' },
    { key: 'second', title: 'Sales' },
    { key: 'third', title: 'Products' },
    { key: 'fourth', title: 'Customers' },
    { key: 'fifth', title: 'Expenses' },
  ]);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <Overview />;
      case 'second':
        return <Sales />;
      case 'third':
        return <Products />;
      case 'fourth':
        return <Customers />;
      case 'fifth':
        return <ExpensesInsights />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
      swipeEnabled={false}
      renderTabBar={props => (
        <TabBar
          renderLabel={renderLabel}
          {...props}
          style={{ backgroundColor: '#fafafa', elevation: 0 }}
          activeColor="#000"
          labelStyle={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 12.6,
            color: '#30475e',
            textTransform: 'capitalize',
            letterSpacing: -0.2,
          }}
          indicatorStyle={{
            backgroundColor: '#2F66F6',
            borderRadius: 22,
            height: 3,
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  cardMain: {
    borderRadius: 6,
    marginHorizontal: '1%',
    width: '50%',
    marginTop: 8,
    paddingVertical: 12,
    paddingBottom: 10,
    backgroundColor: '#F5F7F8',
    maxWidth: Dimensions.get('window').width * 0.46,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'ReadexPro-Medium',
    color: '#7F8487',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  gauge: {
    position: 'absolute',
    width: 100,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 14,
    fontFamily: 'ReadexPro-Medium',
  },
  amount: {
    fontFamily: 'ReadexPro-bold',
    color: '#002',
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 2,
    opacity: 1,
    // marginTop: 18,
    // marginHorizontal: 18,
  },
  ArrowUpIcon: {
    marginRight: 3,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // marginTop: 12,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 7,
    marginTop: 'auto',
    marginBottom: 9,
  },
  statsText: {
    fontFamily: 'Lato-Medium',
    fontSize: 14,
  },
});

export default Analytics;
