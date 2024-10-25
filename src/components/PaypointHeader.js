/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import { SheetManager } from 'react-native-actions-sheet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PaypointHeader = ({ navigation, prevScreen }) => {
  const { setBalanceToShow } = useActionCreator();
  // const [index, setIndex] = React.useState(0);
  const { top } = useSafeAreaInsets();
  const { balanceToShow } = useSelector(state => state.paypoint);
  return (
    <View style={[styles.main, { paddingTop: top + 12 }]}>
      <View style={styles.headerMain}>
        <Pressable
          onPress={() => {
            navigation.openDrawer();
          }}
          style={{
            backgroundColor: '#fff',
            borderRadius: 60,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            left: 12,
            // backgroundColor: 'red',
            padding: 14,
          }}>
          <ProfileIcon height={28} width={27} stroke="#30475e" />
        </Pressable>
        <View
          style={styles.segmentedControlWrapper}
          onPress={() => SheetManager.show('customers')}>
          <SegmentedControl
            values={['Balance', 'Commission']}
            selectedIndex={balanceToShow}
            onChange={event => {
              setBalanceToShow(event.nativeEvent.selectedSegmentIndex);
            }}
            backgroundColor="rgba(225, 225, 225, 0.4)"
            tintColor="#fff"
            activeFontStyle={styles.activeText}
            fontStyle={styles.inactiveText}
            style={styles.arbitrary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: 12,
    backgroundColor: '#21438F',
  },
  headerMain: {
    width: '100%',
    backgroundColor: '#21438F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 12,
    justifyContent: 'center',
    // paddingTop: 26,
  },
  prev: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    marginLeft: 7,
  },
  segmentedControlWrapper: {
    paddingHorizontal: 10,
    width: '30%',
  },
  arbitrary: { height: 45, borderRadius: 5 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 12,
    // backgroundColor: 'red',
    padding: 14,
  },
  activeText: {
    fontSize: 17,
    color: '#1942D8',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  inactiveText: {
    fontSize: 17,
    color: '#1942D8',
    fontFamily: 'Inter-Medium',
  },
});

export default PaypointHeader;

// style={styles.back}