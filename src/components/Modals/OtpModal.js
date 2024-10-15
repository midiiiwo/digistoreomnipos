/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Warning from '../../../assets/icons/Info';
import Modal from '../Modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import PrimaryButton from '../PrimaryButton';
import { useSelector } from 'react-redux';
import { useRequestGenericOtp } from '../../hooks/useRequestGenericOtp';
import LoadingModal from '../LoadingModal';
import ModalCancel from '../ModalCancel';
import { useTimer } from 'react-timer-hook';
import { useVerifySaleOtp } from '../../hooks/useVerifySaleOtp';
import Clipboard from '@react-native-community/clipboard';

const OtpModal = ({
  dialog,
  setDialog,
  togglePaymentPreview,
  navigation,
  otp,
  setOtp,
}) => {
  const inputRef = React.useRef();
  const next = React.useRef(false);
  const [otpStatus, setOtpStatus] = React.useState();

  const { customerPayment } = useSelector(state => state.sale);
  const { mutate, isLoading } = useRequestGenericOtp(setOtpStatus);
  const { user } = useSelector(state => state.auth);
  const [verifyStatus, setVerifyStatus] = React.useState();
  const verifyOtp = useVerifySaleOtp(setVerifyStatus);

  const offsetDate = new Date();
  offsetDate.setSeconds(offsetDate.getSeconds() + 100);

  const { minutes, seconds, isRunning, restart, pause } = useTimer({
    expiryTimestamp: offsetDate,
    autoStart: true,
  });

  React.useEffect(() => {
    if (dialog && !verifyStatus) {
      mutate({
        destination: (customerPayment && customerPayment.phone) || '',
        notify_type: 'SMS',
        otp_type: 'RECVPAYMENT',
        merchant: user.merchant,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef &&
          inputRef.current &&
          inputRef.current.focusField &&
          inputRef.current.focusField(0);
      }, 600);
    }
    const offsetDate_ = new Date();
    offsetDate_.setSeconds(offsetDate_.getSeconds() + 100);
    restart(offsetDate_);
  }, [dialog, restart]);

  console.log('isssss', isRunning);
  console.log('isssss123', minutes);

  React.useEffect(() => {
    if (verifyStatus && verifyStatus.status == '0') {
      setDialog(false);
      next.current = true;
    }
  }, [verifyStatus, setDialog]);

  return (
    <Modal
      modalState={dialog}
      changeModalState={setDialog}
      onModalHide={() => {
        if (next.current) {
          togglePaymentPreview(true);
          next.current = false;
          pause();
          Clipboard.setString('');
        }
      }}
      onModalWillShow={() => setOtp('')}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => setDialog(false)}
        />
        {isLoading && <LoadingModal />}
        {!isLoading && otpStatus && (
          <View style={{ alignItems: 'center' }}>
            <Warning height={40} width={40} />
            {((verifyStatus && verifyStatus.status != '99') ||
              !verifyStatus) && (
              <>
                <Text style={styles.invoice}>{otpStatus.message}</Text>
                {true && (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.subText}>{`${minutes.toLocaleString(
                      'en-US',
                      {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      },
                    )}:${seconds.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}`}</Text>
                  </View>
                )}
                {!isRunning && (
                  <Pressable
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      // toast.show('')
                      if (dialog) {
                        mutate({
                          destination:
                            (customerPayment && customerPayment.phone) || '',
                          notify_type: 'SMS',
                          otp_type: 'RECVPAYMENT',
                          merchant: user.merchant,
                        });
                      }
                      const offsetDate_ = new Date();
                      offsetDate_.setSeconds(offsetDate_.getSeconds() + 120);
                      restart(offsetDate_);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#1AACAC',
                        fontSize: 16,
                      }}>
                      Resend Code
                    </Text>
                  </Pressable>
                )}

                {otpStatus && otpStatus.status == 0 && (
                  <OTPInputView
                    style={{ width: '80%', height: 200 }}
                    pinCount={6}
                    ref={inputRef}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    placeholderTextColor="#30475e"
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    // onCodeFilled={code => {}}
                    autoFocusOnLoad={false}
                    code={otp}
                    onCodeChanged={code => setOtp(code)}
                    // clearInputs
                  />
                )}
              </>
            )}

            {verifyStatus && verifyStatus.status != '0' && (
              <View style={{ marginVertical: 22 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'SFProDisplay-Regular',
                    color: '#30475e',
                  }}>
                  {verifyStatus && verifyStatus.message}
                </Text>
              </View>
            )}

            {otpStatus &&
              otpStatus.status == 0 &&
              (!verifyStatus || (verifyStatus && verifyStatus.status == 0)) && (
                <PrimaryButton
                  style={styles.primaryButton}
                  disabled={verifyOtp.isLoading}
                  handlePress={() => {
                    // setDialog(false);
                    // next.current = true;
                    verifyOtp.mutate({
                      destination:
                        (customerPayment && customerPayment.phone) || '',
                      otp,
                      otp_type: 'RECVPAYMENT',
                      merchant: user.merchant,
                    });
                  }}>
                  {verifyOtp.isLoading ? 'Processing' : 'Proceed'}
                </PrimaryButton>
              )}
            {((otpStatus && otpStatus.status != 0) ||
              (verifyStatus && verifyStatus.status != 0)) && (
              <PrimaryButton
                style={styles.primaryButton}
                handlePress={() => {
                  setDialog(false);
                  setVerifyStatus(null);

                  // next.current = true;
                }}>
                Restart Payment
              </PrimaryButton>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '100%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  invoice: {
    color: '#30475E',
    textAlign: 'center',
    marginHorizontal: 14,
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    marginVertical: 17,
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '56%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 26,
    paddingBottom: 16,
    borderRadius: 8,
    // alignItems: 'center',
  },
  primaryButton: {
    marginTop: 0,
    borderRadius: 5,
    paddingVertical: 16,
    width: '96%',
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
  subText: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15,
    marginTop: 4,
    letterSpacing: 0.35,
  },
});
