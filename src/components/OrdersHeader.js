import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Filter from '../../assets/icons/filter';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../hooks/useActionCreator';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersHeader = ({ navigation }) => {
  const { startDate, endDate } = useSelector(state => state.orders);
  const { setStartDate, setEndDate } = useActionCreator();
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerMain,
        { paddingTop: top + Dimensions.get('window').width * 0.028 },
      ]}>
      <Pressable
        style={styles.filterWrapper}
        onPress={() =>
          SheetManager.show('orderDate', {
            payload: {
              startDate,
              endDate,
              setStartDate,
              setEndDate,
              startIndex: 4,
            },
          })
        }>
        <Filter stroke="#30475e" height={40} width={40} />
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
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 16,
    color: '#30475e',
    textAlign: 'center',
    position: 'absolute',
    backgroundColor: 'red',
  },
});

export default OrdersHeader;
