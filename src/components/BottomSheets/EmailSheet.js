/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { DateTimePicker } from 'react-native-ui-lib';

import { useActionCreator } from '../../hooks/useActionCreator';
import { Input } from './AddProductSheet';
import PrimaryButton from '../PrimaryButton';
import { useSendTransactionNotification } from '../../hooks/useSendTransactionNotification';

function EmailSheet(props) {
  const [email, setEmail] = React.useState('');
  const { user } = useSelector(state => state.auth);
  const [sendStatus, setSendStatus] = React.useState();
  const { mutate, isLoading } = useSendTransactionNotification(setSendStatus);
  const payload = {
    tran_id: props.payload.paymentId,
    tran_type: 'ORDER',
    notify_type: 'EMAIL',
    merchant: user.merchant,
    mod_by: user.login,
    tracking_email: 'pherut@gmail.com',
    tracking_url: 'http://buy.digistoreafrica.com',
  };
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <Text
          style={{
            color: '#30475e',
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            marginBottom: 12,
          }}>
          Email address
        </Text>
        <Input
          placeholder="Email"
          // showError={showError && state.name.length === 0}
          val={email}
          setVal={setEmail}
          style={{ marginBottom: 88, width: '100%' }}
        />
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={email.length === 0 || isLoading}
          handlePress={() => mutate(payload)}>
          {isLoading ? 'Loading' : 'Send Email'}
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '30%',
    paddingHorizontal: 26,
    paddingTop: 28,
    alignItems: 'center',
    // marginBottom: 78,
    // marginTop: 26,
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
});

export default EmailSheet;
