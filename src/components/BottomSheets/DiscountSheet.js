/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useApplyDiscountCode } from '../../hooks/useApplyDiscountCode';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useToast } from 'react-native-toast-notifications';
import { Input } from './EditCategorySheet';
import PrimaryButton from '../PrimaryButton';
import Qr from '../../../assets/icons/qr-scanner.svg';

function DiscountSheet(props) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [discount, setDiscount] = React.useState('');
  const [discountCode, setDiscountCode] = React.useState('');
  const tabValues = ['GHS', '%'];
  const { applyDiscount } = useActionCreator();
  const { discountPayload, subTotal, cart } = useSelector(state => state.sale);
  const { user } = useSelector(state => state.auth);
  const [discountCodeStatus, setDiscountCodeStatus] = React.useState();
  const applyDiscountCode = useApplyDiscountCode(setDiscountCodeStatus);
  const toast = useToast();

  console.log(props.payload.data);

  React.useEffect(() => {
    setDiscountCode(
      (props.payload && props.payload.data && props.payload.data) || '',
    );
  }, [setDiscountCode, props.payload]);

  React.useEffect(() => {
    if (discountCodeStatus) {
      if (discountCodeStatus.status == 0) {
        toast.show(discountCodeStatus.message, {
          placement: 'top',
          duration: 5000,
        });
        applyDiscount({
          discountType: 'GHS',
          quantity: Number(discountCodeStatus.discount),
          discountCode,
        });
        props.payload.navigation.navigate('Cart');
        SheetManager.hideAll();
      } else {
        toast.show(discountCodeStatus.message, {
          type: 'danger',
          placement: 'top',
        });
      }
    }
    setDiscountCodeStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountCodeStatus, toast, discountPayload]);

  console.log('subtotal_____', subTotal);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.topRow}>
          <Input
            placeholder="Enter Discount"
            // showError={showError && state.name.length === 0}
            val={discount}
            style={{
              flex: 1,
              marginRight: 4,
              backgroundColor: '#fff',
              height: 50,
            }}
            keyboardType="number-pad"
            setVal={text => setDiscount(text)}
          />
          <View style={styles.segmentedControlWrapper}>
            <SegmentedControl
              values={tabValues}
              selectedIndex={tabIndex}
              onChange={event => {
                setTabIndex(event.nativeEvent.selectedSegmentIndex);
              }}
              backgroundColor="rgba(96, 126, 170, 0.04)"
              tintColor="#1942D8"
              activeFontStyle={styles.activeText}
              fontStyle={styles.inactiveText}
              style={styles.arbitrary}
            />
          </View>
        </View>
        <View
          style={[
            styles.input,
            {
              marginBottom: 12,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <Input
            placeholder="Enter Discount Code or Gift Voucher"
            // showError={showError && state.name.length === 0}
            val={discountCode}
            setVal={text => setDiscountCode(text)}
            style={{
              height: 50,
              backgroundColor: '#fff',
              flex: 1,
              marginRight: 14,
            }}
          />
          <Pressable
            style={{ marginHorizontal: 6 }}
            onPress={() => {
              props.payload.navigation.navigate('Discount Qr', {
                prev_screen: 'Inventory',
              });
              SheetManager.hide('discount');
            }}>
            <Qr stroke="#30475e" />
          </Pressable>
        </View>

        <View>
          <PrimaryButton
            disabled={
              (props.payload &&
                props.payload.type &&
                props.payload.type === 'quickSale') ||
              applyDiscountCode.isLoading
            }
            textStyle={styles.textStyle}
            style={styles.btnExtra}
            backgroundColor="rgba(25, 66, 216, 0.9)"
            disabledColor="rgba(25, 66, 216, 0.3)"
            handlePress={() => {
              if (
                discount &&
                discountCode &&
                discount.length > 0 &&
                discountCode.length > 0
              ) {
                toast.show('Cannot apply two discount types', {
                  type: 'danger',
                  placement: 'top',
                });
                return;
              }
              const discountLength = discount.length;
              const discountCodeLength = discountCode.length;
              if (discountLength > 0 && discountCodeLength === 0) {
                if (tabValues[tabIndex] === '%') {
                  const discountedAmount = 0.01 * Number(discount) * subTotal;
                  if (discountedAmount > subTotal) {
                    toast.show('Cannot use more discount than subtotal', {
                      type: 'danger',
                      placement: 'top',
                    });
                    return;
                  }
                }

                if (
                  tabValues[tabIndex] !== '%' &&
                  Number(discount) > subTotal
                ) {
                  toast.show('Cannot use more discount than subtotal', {
                    type: 'danger',
                    placement: 'top',
                  });
                  return;
                }

                applyDiscount({
                  discountType: tabValues[tabIndex],
                  quantity: Number(discount),
                });
                toast.show('Discount applied', { placement: 'top' });
                SheetManager.hide('discount');
                setDiscount('');
                return;
              }
              if (
                discountCode &&
                discount &&
                discountCode.length > 0 &&
                discount.length === 0
              ) {
                applyDiscountCode.mutate({
                  code: discountCode,
                  type: 'ORDER',
                  outlet: user.outlet,
                  merchant: user.merchant,
                  amount: subTotal,
                  order_item: cart,
                  mod_by: user.login,
                  source: 'INSHOP',
                });
                // SheetManager.hideAll();
              }
            }}>
            {applyDiscountCode.isLoading ? 'Processing' : 'Apply Discount'}
          </PrimaryButton>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
  },
  segmentedControlWrapper: {},
  main: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    // justifyContent: 'center',
  },
  inputType: {
    flex: 1,
    height: 46,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 12,
    borderColor: 'rgba(96, 126, 170, 0.5)',
    borderWidth: 0.3,
    paddingHorizontal: 12,
    width: '100%',
    color: '#30475E',
    borderRadius: 2,
  },
  arbitrary: {
    height: 40,
    width: 120,
  },

  activeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 14,
    color: '#748DA6',
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: '100',
  },
  amountDetails: {
    paddingVertical: 16,
  },
  discountRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginVertical: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  amount: {
    marginLeft: 'auto',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  btnExtra: { height: 52, margin: 14, borderRadius: 4 },
  input: {
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    height: 46,
    marginTop: 8,
    // flex: 1,
  },
});

export default DiscountSheet;
