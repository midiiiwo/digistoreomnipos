import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import CustomButton from '../Button';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ActivationDialog from '../ActivationDialog';
import { useGetCurrentActivationStep } from '../../hooks/useGetCurrentActivationStep';

function FundsBottomSheet(props) {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [dialog, setDialog] = React.useState(false);
  const { data: step_ } = useGetCurrentActivationStep(user.merchant);
  const step =
    step_ &&
    step_.data &&
    step_.data.data &&
    step_.data.data.account_setup_step;

  return (
    <>
      <ActivationDialog dialog={dialog} setDialog={setDialog} />
      <ActionSheet
        id={props.sheetId}
        statusBarTranslucent={false}
        drawUnderStatusBar={false}
        gestureEnabled={true}
        containerStyle={[styles.containerStyle]}
        indicatorStyle={styles.indicatorStyle}
        springOffset={50}
        openAnimationConfig={{ bounciness: 0 }}
        defaultOverlayOpacity={0.3}>
        <View style={styles.buttonContainer}>
          <CustomButton
            width="100%"
            backgroundColor="#1942D8"
            color="#fff"
            height="33.33%"
            handlePress={() => {
              if (
                step &&
                step != 8
                // step == 1
              ) {
                setDialog(true);
                return;
              }
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('MACCTMGT') ||
                  !user.user_permissions.includes('REQSTLE'))
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
                !(
                  user.user_permissions.includes('MACCTMGT') &&
                  user.user_permissions.includes('REQSTLE')
                )
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                SheetManager.hide('add-funds');
                return;
              }
              navigation.navigate('Transfer Funds');
              SheetManager.hide('add-funds');
            }}>
            Transfer Funds
          </CustomButton>

          <CustomButton
            width="100%"
            backgroundColor="rgba(217, 217, 217, 0.25)"
            // insetHeight={insets.bottom}
            height="33.33%"
            handlePress={() => {
              if (
                step &&
                step != 8
                // step == 1
              ) {
                setDialog(true);
                return;
              }
              if (
                user &&
                user.user_merchant_agent == '6' &&
                (!user.user_permissions.includes('MACCTMGT') ||
                  !user.user_permissions.includes('MKDEPOSIT'))
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
                !user.user_permissions.includes('MACCTMGT') ||
                !user.user_permissions.includes('MKDEPOSIT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                SheetManager.hide('add-funds');
                return;
              }
              navigation.navigate('Add Money');
              SheetManager.hide('add-funds');
            }}
            color="#1942D8">
            Add Money
          </CustomButton>
          <CustomButton
            height="33.33%"
            width="100%"
            backgroundColor="rgba(217, 217, 217, 0.25)"
            color="#1942D8"
            insetHeight={30}
            handlePress={() => {
              if (
                step &&
                step != 8
                // step == 1
              ) {
                setDialog(true);
                return;
              }
              if (
                user &&
                user.user_merchant_agent == '6' &&
                !user.user_permissions.includes('MACCTMGT')
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
                user &&
                user.user_merchant_agent == '6' &&
                !user.user_permissions.includes('VIEWACCTDPT')
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
                !user.user_permissions.includes('MACCTMGT') ||
                !user.user_permissions.includes('VIEWACCTDPT')
              ) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade Needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                SheetManager.hide('add-funds');
                return;
              }
              SheetManager.hide('add-funds');
              navigation.navigate('Account Statement');
            }}>
            Account Statement
          </CustomButton>
        </View>
      </ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    // alignItems: 'center',
  },
  indicatorStyle: {
    display: 'none',
  },
  separator: {
    borderBottomColor: '#1942D8',
    borderBottomWidth: 0.6,
  },
  containerStyle: {
    height: Dimensions.get('window').height * 0.3,
  },
});

export default FundsBottomSheet;
