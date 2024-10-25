/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, View, Text, Dimensions } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import RadioButton from '../RadioButton';
import { RadioButtonProvider } from '../../context/RadioButtonContext';
import { Input } from './AddProductSheet';
import PrimaryButton from '../PrimaryButton';
import { useRadioButton } from '../../hooks/useRadioButton';
import { useAddWallet } from '../../hooks/useAddWallet';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import moment from 'moment';
// import { useQueryClient } from 'react-query';

const AccountCard = ({ network, index }) => {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <RadioButton idx={index}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {network === 'MTN Mobile Money' ? (
            <Image
              source={require('../../../assets/images/mtn-momo.png')}
              style={{
                height: 48,
                width: 48,
                borderRadius: 33,
                marginRight: 16,
                marginLeft: 8,
              }}
            />
          ) : network === 'Vodafone Cash' ? (
            <Image
              source={require('../../../assets/images/voda-cash.png')}
              style={{
                height: 48,
                width: 48,
                borderRadius: 33,
                marginRight: 16,
                marginLeft: 8,
              }}
            />
          ) : network === 'Tigo Cash' ? (
            <Image
              source={require('../../../assets/images/tigo.png')}
              style={{
                height: 48,
                width: 48,
                borderRadius: 33,
                marginRight: 16,
                marginLeft: 8,
              }}
            />
          ) : (
            <Image
              source={require('../../../assets/images/atmoney.png')}
              style={{
                height: 48,
                width: 48,
                borderRadius: 33,
                marginRight: 16,
                marginLeft: 8,
              }}
            />
          )}
          <View>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                color: '#30475e',
                fontSize: 15,
              }}>
              {network}
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Medium',
                color: '#6B728E',
                fontSize: 13,
              }}>
              Add your {network} wallet
            </Text>
          </View>
        </View>
      </RadioButton>
    </View>
  );
};

const networkCodes = ['MTNMM', 'VODAC', 'TIGOC'];

const AddWalletSheet = props => {
  const [number, setNumber] = React.useState('');
  const toast = useToast();
  const [showError, setShowError] = React.useState(false);
  const [transactStatus, setTransactStatus] = React.useState();
  const { idx } = useRadioButton();
  // const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddWallet(i => {
    setTransactStatus(i);
    // queryClient.invalidateQueries('account-list');
  });
  const { user } = useSelector(state => state.auth);

  React.useEffect(() => {
    if (transactStatus && transactStatus.status == 0) {
      props.payload.navigation.navigate('Verify Account', { number });
      setTransactStatus(null);
      SheetManager.hideAll();
    } else if (transactStatus && transactStatus.status != 0) {
      toast.show(transactStatus.message && transactStatus.message, {
        placement: 'top',
      });
      SheetManager.hideAll();
    }
  }, [transactStatus, toast, props.payload.navigation, number]);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      useBottomSafeAreaPadding
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <Text
          style={{
            fontFamily: 'Roboto Medium',
            color: '#30475e',
            fontSize: 16,
            textAlign: 'center',
            marginVertical: 14,
          }}>
          Select Payment Method
        </Text>
        <AccountCard index={1} network="MTN Mobile Money" />
        <AccountCard index={2} network="Vodafone Cash" />
        <AccountCard index={3} network="AirtelTigo Money" />

        <View style={{ paddingHorizontal: 18 }}>
          <Input
            placeholder="Enter wallet phone number"
            val={number}
            setVal={text => setNumber(text)}
            style={{
              width: '100%',
              backgroundColor: '#fff',
              marginTop: 12,
              marginBottom: 90,
            }}
            keyboardType="phone-pad"
            showError={showError && number.length === 0}
          />
          <View style={[styles.btnWrapper]}>
            <PrimaryButton
              style={[styles.btn, { borderRadius: 5, marginTop: 0 }]}
              handlePress={() => {
                if (number.length === 0) {
                  setShowError(true);
                  return;
                }
                const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
                mutate({
                  account_no: user.user_merchant_account,
                  topup_network: networkCodes[idx - 1],
                  topup_number: number,
                  mod_date: mod_date,
                  mod_by: user.login,
                });
              }}
              disabled={isLoading}>
              {isLoading ? 'Processing' : 'Proceed'}
            </PrimaryButton>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 0.4,
    justifyContent: 'center',
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  containerStyle: {
    paddingBottom: 33,
  },
});

export default props => {
  console.log('jdxxxxxxxxxx', AddWalletSheet);
  return (
    <RadioButtonProvider>
      <AddWalletSheet {...props} />
    </RadioButtonProvider>
  );
};
