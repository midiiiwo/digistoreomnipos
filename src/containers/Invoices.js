import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import InvoiceHistory from './InvoiceHistory';
import EstimateHistory from './EstimateHistory';
import { useActionCreator } from '../hooks/useActionCreator';

const Invoices = () => {
  const pagerRef = React.useRef();
  const { invoicingTab } = useSelector(state => state.invoice);
  const navigation = useNavigation();
  const { setActiveInvoiceTab } = useActionCreator();

  React.useEffect(() => {
    pagerRef.current?.setPage(invoicingTab);
  }, [invoicingTab]);

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      pagerRef.current?.setPage(invoicingTab);
    });
  }, [navigation, invoicingTab]);

  return (
    <>
      {/* <StatusBar backgroundColor="#fff" barStyle={'dark-content'} /> */}
      <PagerView
        style={styles.main}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={e => setActiveInvoiceTab(e.nativeEvent.position)}>
        <View key={1} collapsable={false}>
          <InvoiceHistory navigation={navigation} />
        </View>
        <View key={2} collapsable={false}>
          <EstimateHistory navigation={navigation} />
        </View>
      </PagerView>
    </>
  );
};

export default Invoices;

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
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingRight: 14,
    paddingVertical: 3.5,
    backgroundColor: '#f9f9f9',
    alignSelf: 'flex-end',
    marginTop: 'auto',
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

  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
  },
});
