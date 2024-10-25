/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductsHeader = ({ navigation }) => {
  const tabValues = ['Products', 'Categories'];
  const { activeProductsTab } = useSelector(state => state.products);
  const { setActiveProductsTab } = useActionCreator();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.headerMain, { paddingTop: top + 10 }]}>
      <Pressable
        onPress={() => {
          navigation.openDrawer();
        }}
        style={{
          backgroundColor: '#fff',
          borderRadius: 60,
          padding: 10,
        }}>
        <ProfileIcon height={28} width={27} stroke="#30475e" />
      </Pressable>

      <View style={styles.segmentedControlWrapper}>
        <SegmentedControl
          values={tabValues}
          selectedIndex={activeProductsTab}
          onChange={event => {
            setActiveProductsTab(event.nativeEvent.selectedSegmentIndex);
            // console.log('channnnnnnnnnnnneg');
          }}
          backgroundColor="rgba(96, 126, 170, 0.05)"
          tintColor="rgba(25, 66, 216, 0.9)"
          activeFontStyle={styles.activeText}
          fontStyle={styles.inactiveText}
          style={styles.arbitrary}
        />
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
    paddingVertical: 24,
    paddingHorizontal: 18,
    paddingLeft: 22,
  },
  arbitrary: {
    height: 50,
    width: 300,
  },
  segmentedControlWrapper: {
    marginLeft: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SFProDisplay-Medium',
    fontWeight: '100',
    letterSpacing: 0.5,
  },
  inactiveText: {
    fontSize: 18,
    color: '#30475e',
    fontFamily: 'SFProDisplay-Medium',
    fontWeight: '100',
    letterSpacing: 0.5,
  },
  headerText: {
    marginLeft: 'auto',
    marginRight: 14,
    color: '#1942D8',
    fontFamily: 'SFProDisplay-Medium',
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
});

export default ProductsHeader;

