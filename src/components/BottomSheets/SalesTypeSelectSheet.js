/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomButton from '../Button';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

function SalesTypeSelectSheet({ sheetId, payload }) {
  const ref = React.useRef(null);
  const insets = useSafeAreaInsets();
  const { user } = useSelector(state => state.auth);
  return (
    <ActionSheet
      id={sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={
        {
          // height: Dimensions.get('window').height * 0.17,
          // padding: 0,
        }
      }
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      openAnimationConfig={{ bounciness: 0 }}
      ref={ref}
      defaultOverlayOpacity={0.3}>
      <View style={styles.buttonContainer}>
        <CustomButton
          width="100%"
          backgroundColor="#1942D8"
          color="#fff"
          // height="50%"
          handlePress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              (!user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('ORDERMGT'))
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }
            if (
              !user.user_permissions.includes('TRANMGT') ||
              !user.user_permissions.includes('ORDERMGT')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              // SheetManager.hideAll();
              return;
            }
            payload.navigation.navigate('Inventory');
            if (ref.current) {
              ref.current.hide();
            }
          }}>
          Sell from Inventory
        </CustomButton>
        <View style={styles.separator} />
        <CustomButton
          width="100%"
          // height="50%"
          paddingBottom={insets.bottom}
          backgroundColor="rgba(217, 217, 217, 0.25)"
          insetHeight={30}
          handlePress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              (!user.user_permissions.includes('TRANMGT') ||
                !user.user_permissions.includes('RCPAYMT'))
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }
            if (
              !user.user_permissions.includes('TRANMGT') ||
              !user.user_permissions.includes('RCPAYMT')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              // SheetManager.hideAll();
              return;
            }
            payload.navigation.navigate('Quick Sale', {
              prev_screen: 'Dashboard',
            });
            if (ref.current) {
              ref.current.hide();
            }
          }}
          color="#1942D8">
          Quick Sale
        </CustomButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  indicatorStyle: {
    display: 'none',
  },
});

export default SalesTypeSelectSheet;

