/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import Qr from '../../assets/icons/qr-scanner.svg';
import Filter from '../../assets/icons/filter';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnalyticsHeader = ({ navigation }) => {
  const { summaryStartDate, summaryEndDate } = useSelector(
    state => state.merchant,
  );
  const { setSummaryStartDate, setSummaryEndDate } = useActionCreator();
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.headerMain, { paddingTop: top + 8 }]}>
      {/* <Pressable style={styles.scannerWrapper}>
        <Qr stroke="#30475e" height={29} width={29} />
      </Pressable> */}

      {/* <Text style={styles.headerTxt}>Orders</Text> */}

      <Pressable
        style={styles.filterWrapper}
        onPress={() =>
          SheetManager.show('AnalyticsFilter', {
            payload: {
              startDate: summaryStartDate,
              endDate: summaryEndDate,
              setStartDate: setSummaryStartDate,
              setEndDate: setSummaryEndDate,
              startIndex: 4,
            },
          })
        }>
        <Filter stroke="#30475e" height={33} width={33} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerMain: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Dimensions.get('window').width * 0.028,
  },
  filterWrapper: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  headerTxt: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475e',
    textAlign: 'center',
    position: 'absolute',
    backgroundColor: 'red',
  },
});

export default AnalyticsHeader;
