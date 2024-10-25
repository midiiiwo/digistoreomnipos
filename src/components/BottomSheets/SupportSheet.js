/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

import Whatsapp from '../../../assets/icons/whatsapp.svg';
import Phone from '../../../assets/icons/phone.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SupportSheet(props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      openAnimationConfig={{ bounciness: 0 }}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Support</Text>
        </View>
        <View style={styles.supportWrapper}>
          <Text style={styles.support}>
            Click on either Call or Whatsapp support to contact support for any
            help
          </Text>
        </View>

        <View style={styles.btnWrapper}>
          <Pressable
            style={[
              styles.btn,
              {
                backgroundColor: '#3C79F5',
                paddingBottom: Platform.OS === 'ios' ? bottom : 14,
              },
            ]}
            onPress={() => Linking.openURL('tel:+233303967121')}>
            <Phone height={35} width={35} />
            <Text style={styles.callText}>Call support</Text>
          </Pressable>
          <Pressable
            style={[
              styles.btn,
              {
                backgroundColor: '#48C558',
                paddingBottom: Platform.OS === 'ios' ? bottom : 14,
              },
            ]}
            onPress={() => {
              Linking.openURL('whatsapp://send?phone=+233509564931');
            }}>
            <Whatsapp height={40} width={40} />
            <Text style={styles.callText}>Whatsapp support</Text>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 17,
    color: '#30475E',
    letterSpacing: -0.4,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  support: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    color: '#30475e',
    marginLeft: 5,
    textAlign: 'center',
  },
  supportWrapper: {
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  callText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#fff',
    marginLeft: 5,
  },
});

export default SupportSheet;
