/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { Api } from '../../containers/api';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from 'react-query';

function ResultSheet(props) {
  const [voucher, setVoucher] = React.useState('');
  const [btnText, setBtnText] = React.useState('Validate');
  const [redeemStatus, setRedeemStatus] = React.useState(null);
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const client = useQueryClient();
  const redeem = async v => {
    setBtnText('Loading');
    const user = await AsyncStorage.getItem('user');
    const user_ = JSON.parse(user || '');
    let response;
    try {
      response = await Api.put('tickets/validate/ticket', {
        serial_code: '',
        pin: v,
        merchant: user_.user_merchant_id,
        mod_by: user_.login,
      });
    } catch (error) {
      console.log(error);
    }
    setBtnText('Validate');
    return response;
  };

  React.useEffect(() => {
    if (redeemStatus) {
      SheetManager.hide('result');
      client.invalidateQueries('ticket-history');
      navigation.navigate('Status', { redeemStatus });
      setRedeemStatus(null);
    }
  }, [redeemStatus, navigation, client]);

  console.log(bottom);

  React.useEffect(() => {
    setVoucher(props.payload.data);
  }, [props.payload.data]);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={true}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        {/* <Text style={styles.mainText}>Description</Text> */}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter voucher"
            placeholderTextColor="#B8BEC4"
            cursorColor="#82AAE3"
            value={voucher}
            onChangeText={setVoucher}
            editable={false}
          />
        </View>

        <Pressable
          disabled={voucher.length === 0 || btnText === 'Loading'}
          onPress={async () => {
            console.log('therererere');
            const { data } = await redeem(voucher);
            if (data && data.code == 200) {
              setRedeemStatus(data);
            } else {
              setRedeemStatus(data);
            }
          }}
          style={[
            styles.btn,
            {
              backgroundColor:
                voucher.length === 0 || btnText === 'Loading'
                  ? 'rgba(33, 146, 255, 0.5)'
                  : 'rgba(33, 146, 255, 1)',
              marginBottom: bottom + 28,
            },
          ]}>
          <Text style={styles.signin}>{btnText}</Text>
        </Pressable>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // paddingVertical: 2,
    paddingHorizontal: 18,
  },
  input: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 18,
    fontSize: 16,
    flex: 1,
    color: '#30475e',
    fontFamily: 'Inter-Regular',
  },
  inputWrapper: {
    backgroundColor: '#F5F7F9',
    height: 58,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  btn: {
    backgroundColor: '#2192FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 10,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});

export default ResultSheet;
