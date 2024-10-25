/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useActionCreator } from '../../hooks/useActionCreator';
import Pen from '../../../assets/icons/pen';

function CustomerDetailsSheet(props) {
  const { selectChannel } = useActionCreator();
  function handleSelect(channel) {
    selectChannel(channel);
    SheetManager.hide('channels');
  }
  const { user } = useSelector(state => state.auth);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      snapPoints={[95]}
      defaultOverlayOpacity={0.3}></ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    height: '100%',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A8F8',
    borderRadius: 100,
    height: 90,
    width: 90,
    marginTop: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  initial: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 38,
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'center',
  },
  mainText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#30475E',
    letterSpacing: -0.4,
  },
  name: {
    fontFamily: 'Inter-Medium',
    color: '#30475e',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  addressWrapper: {
    width: '60%',
    backgroundColor: 'red',
  },
  address: {
    fontFamily: 'Inter-Regular',
    color: '#738598',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  stats: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'rgba(185, 224, 255, 0.1)',
    marginTop: 18,
    paddingVertical: 20,
    borderRadius: 8,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#30475e',
  },
  statsMetric: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#738598',
  },
});

export default CustomerDetailsSheet;
