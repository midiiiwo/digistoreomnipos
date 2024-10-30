import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Filter from '../../assets/icons/filter.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersHeader = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerMain,
        { paddingTop: top + Dimensions.get('window').width * 0.028 },
      ]}>
      {/* <Pressable style={styles.scannerWrapper}>
        <Qr stroke="#30475e" height={29} width={29} />
      </Pressable> */}

      {/* <Text style={styles.headerTxt}>Orders</Text> */}

      <Pressable
        style={styles.filterWrapper}
        onPress={() => SheetManager.show('orderDate')}>
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

export default OrdersHeader;
