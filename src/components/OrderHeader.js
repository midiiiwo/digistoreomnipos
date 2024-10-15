/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import Filter from '../../assets/icons/filter.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrderHeader = ({ navigation, backgroundColor }) => {
  const { startDate, endDate } = useSelector(state => state.orders);
  const { setStartDate, setEndDate } = useActionCreator();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerMain,
        {
          paddingTop: 12 + top,
          backgroundColor: backgroundColor ? backgroundColor : '#fff',
        },
      ]}>
      <Pressable
        onPress={() => {
          navigation.openDrawer();
        }}>
        <ProfileIcon height={38} width={38} stroke="#000" />
      </Pressable>

      {/* <Image source={require('../../assets/images/logo.png')} /> */}

      <View style={styles.rightIcons}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerMain: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,

    paddingVertical: Dimensions.get('window').width * 0.01,
  },
  rightIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderHeader;
