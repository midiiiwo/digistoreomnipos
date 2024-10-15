/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useApplyDiscountCode } from '../../hooks/useApplyDiscountCode';
import { useActionCreator } from '../../hooks/useActionCreator';
import ButtonLargeBottom from '../ButtonLargeBottom';
import { useToast } from 'react-native-toast-notifications';
import { Input } from './EditCategorySheet';
import PrimaryButton from '../PrimaryButton';

function QuickSaleDiscount(props) {
  const [discountCode, setDiscountCode] = React.useState('');
  const { applyDiscount, setQuickSaleAmount, applyQuickSaleDiscount } =
    useActionCreator();
  const { discountPayload, subTotal, cart } = useSelector(state => state.sale);
  const { amount } = useSelector(state => state.quickSale);
  const { user } = useSelector(state => state.auth);
  const [discountCodeStatus, setDiscountCodeStatus] = React.useState();
  const applyDiscountCode = useApplyDiscountCode(setDiscountCodeStatus);
  const toast = useToast();

  React.useEffect(() => {
    if (discountCodeStatus) {
      if (discountCodeStatus.status == 0) {
        toast.show(discountCodeStatus.message, {
          placement: 'top',
          duration: 5000,
        });
        // applyQuickSaleDiscount(Number(discountCodeStatus.discount));
        // setQuickSaleAmount(JSON.stringify(subTotal));
        SheetManager.hide(props.sheetId, {
          payload: {
            discount: discountCodeStatus.discount,
            code: discountCode,
          },
        });
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
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'SFProDisplay-Medium',
            color: '#30475e',
            paddingVertical: 12,
            textAlign: 'center',
          }}>
          Enter Discount/Gift Voucher
        </Text>
        <View style={[styles.input, { marginBottom: 18, marginTop: 16 }]}>
          <Input
            placeholder="Enter Discount Code or Gift Voucher"
            // showError={showError && state.name.length === 0}
            val={discountCode}
            setVal={text => setDiscountCode(text)}
            style={{ height: 50, backgroundColor: '#fff' }}
          />
        </View>

        <View>
          <PrimaryButton
            disabled={
              (props.payload &&
                props.payload.type &&
                props.payload.type === 'quickSale') ||
              applyDiscountCode.isLoading ||
              discountCode.length === 0
            }
            textStyle={styles.textStyle}
            style={styles.btnExtra}
            backgroundColor="rgba(25, 66, 216, 0.9)"
            disabledColor="rgba(25, 66, 216, 0.3)"
            handlePress={() => {
              if (discountCode.length === 0) {
                toast.show('Enter discount/voucher code', {
                  placement: 'top',
                  type: 'danger',
                });
              }
              if (discountCode.length > 0) {
                applyDiscountCode.mutate({
                  code: discountCode,
                  type: 'ORDER',
                  outlet: user.outlet,
                  merchant: user.merchant,
                  amount: Number(amount),
                  order_item: cart,
                  mod_by: user.login,
                  source: 'INSHOP',
                });
                // SheetManager.hideAll();
                // SheetManager.hide(props.sheetId, {
                //   payload
                // })
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
    paddingBottom: 12,
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

export default QuickSaleDiscount;
