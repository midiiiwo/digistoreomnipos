/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Clipboard from '@react-native-community/clipboard';
import OtpInputs from 'react-native-otp-inputs';
import { useActiveWalletAccount } from '../hooks/useActivateWalletAccount';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import LoadingModal from '../components/LoadingModal';
import { useSelector } from 'react-redux';
import moment from 'moment';

const VerifyWalletAccount = ({ navigation, route }) => {
  const [walletStatus, setWalletStatus] = React.useState();
  const inputRef = React.useRef();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useSelector(state => state.auth);
  const { number } = route.params;
  const { mutate, isLoading } = useActiveWalletAccount(i => {
    if (i && i.status == 0) {
      queryClient.invalidateQueries('account-list');
      setWalletStatus(i);
    }
  });

  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 600);
    }
  }, []);

  React.useEffect(() => {
    if (walletStatus && walletStatus.status == 0) {
      Clipboard.setString('');
      navigation.navigate('Add Money');
    } else if (walletStatus && walletStatus != 0) {
      toast.show(walletStatus.message, {
        placement: 'top',
        type: 'danger',
      });
    }
  }, [navigation, walletStatus, toast]);

  return (
    <View style={styles.main}>
      <Text
        style={{
          color: '#30475e',
          fontFamily: 'Inter-SemiBold',
          fontSize: 19,
          marginTop: 6,
        }}>
        Enter OTP Code
      </Text>
      {isLoading && <LoadingModal />}
      {/* <OtpInputs
        handleChange={code => console.log(code)}
        numberOfInputs={6}
        autofillFromClipboard
        autoFocus
        selectionColor="red"
      /> */}
      <OTPInputView
        style={{ width: '80%', height: 200 }}
        pinCount={6}
        autoFocusOnLoad={false}
        ref={inputRef}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}

        placeholderTextColor="#30475e"
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
          mutate({
            account_no: user.user_merchant_account,
            verify_code: code,
            topup_number: number,
            mod_date: mod_date,
            mod_by: user.login,
          });
        }}
      />
    </View>
  );
};

export default VerifyWalletAccount;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#30475e',
  },

  underlineStyleBase: {
    width: 30,
    height: 55,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#30475e',
    color: '#30475e',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
