/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';

import { useApplyDiscountCode } from '../hooks/useApplyDiscountCode';
import { useActionCreator } from '../hooks/useActionCreator';
// import ButtonLargeBottom from '../ButtonLargeBottom';
import { useToast } from 'react-native-toast-notifications';

import PrimaryButton from '../components/PrimaryButton';
import Qr from '../../assets/icons/qr-scanner.svg';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

function Discount(props) {
  const navigation = useNavigation();
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

  // console.log(props.payload.data);

  React.useEffect(() => {
    setDiscountCode(
      (props.route && props.route.params.data && props.route.params.data) || '',
    );
  }, [setDiscountCode, props.route]);

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
        navigation.navigate('Cart');
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

  return (
    <>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <View style={styles.main}>
          {/* <View style={styles.topRow}> */}
          <View style={{ paddingHorizontal: 18 }}>
            <Input
              placeholder="Enter Discount"
              val={discount}
              style={{
                marginRight: 4,
                backgroundColor: '#fff',
                // height: 50,
              }}
              keyboardType="number-pad"
              setVal={text => setDiscount(text)}
            />
            <SegmentedControl
              values={tabValues}
              selectedIndex={tabIndex}
              onChange={event => {
                setTabIndex(event.nativeEvent.selectedSegmentIndex);
              }}
              backgroundColor="rgba(96, 126, 170, 0.1)"
              tintColor="#1942D8"
              activeFontStyle={styles.activeText}
              fontStyle={styles.inactiveText}
              style={styles.arbitrary}
            />
          </View>

          {/* </View> */}
          <View style={{ alignItems: 'center', marginVertical: 23 }}>
            <Text
              style={{ fontSize: 18, fontFamily: 'Lato-Bold', color: '#fff' }}>
              Or
            </Text>
          </View>
          <View
            style={[
              styles.input,
              {
                marginBottom: 12,
                // marginTop: 46,
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
                // height: 50,
                backgroundColor: '#fff',
                flex: 1,
                marginRight: 14,
              }}
            />
            <Pressable
              style={{ marginHorizontal: 6 }}
              onPress={() => {
                navigation.navigate('Discount Qr', {
                  prev_screen: 'Inventory',
                });
                SheetManager.hide('discount');
              }}>
              <Qr stroke="#30475e" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
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

              if (tabValues[tabIndex] !== '%' && Number(discount) > subTotal) {
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
              navigation.navigate('Cart');
              setDiscount('');
              return;
            }
            if (discountCode.length > 0 && discount.length === 0) {
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
          }}
          disabled={applyDiscountCode.isLoading}>
          {applyDiscountCode.isLoading ? 'Processing' : 'Apply Discount'}
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
  },
  segmentedControlWrapper: {},
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Dimensions.get('window').height * 0.05,
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
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  arbitrary: {
    height: 40,
    width: 150,
    marginTop: 22,
  },

  activeText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 16,
    color: '#748DA6',
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Medium',
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

export default Discount;
