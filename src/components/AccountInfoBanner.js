/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Dots from '../../assets/icons/dot.svg';
import { useSelector } from 'react-redux';
import { useGetAccountBalance } from '../hooks/useGetAccountBalance';

const AccountInfoBanner = React.forwardRef(
  ({ handleAddPress, navigation }, ref) => {
    const { user, outlet } = useSelector(state => state.auth);
    // useGetMerchantOutlets()

    const { data, refetch } = useGetAccountBalance(user.user_merchant_account);

    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        refetch();
      });
      return unsubscribe;
    }, [navigation, refetch]);
    return (
      <LinearGradient
        colors={['#0061C1', '#21438F']}
        start={{ x: 0.8, y: 0.8 }}
        end={{ x: 0.1, y: 0.1 }}
        locations={[0, 0.6]}
        style={[
          styles.main,
          {
            paddingVertical:
              user.user_merchant_group !== 'Administrators'
                ? Dimensions.get('window').height * 0.02
                : Dimensions.get('window').width * 0.03,
          },
        ]}>
        <View style={styles.accountTextWrapper} ref={ref}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={[styles.welcomeText]}>{user.user_merchant}</Text>
            {user.user_merchant_group === 'Administrators' &&
            user.user_merchant_agent != '6' ? (
              <Text style={styles.accountBalanceLabel}>Account Balance</Text>
            ) : (
              <Text style={styles.accountBalanceLabel}>
                {outlet.outlet_name}
              </Text>
            )}
            {user.user_merchant_group === 'Administrators' &&
              user.user_merchant_agent != '6' && (
                <Text style={styles.accountBalance}>
                  <Text style={{ fontSize: 15 }}>GHS </Text>
                  {(data &&
                    data.data &&
                    data.data.data &&
                    data.data.status == 0 &&
                    new Intl.NumberFormat().format(
                      data.data.data.current_balance,
                    )) ||
                    '--.--'}
                </Text>
              )}
          </View>
        </View>
        {user.user_merchant_group === 'Administrators' && (
          <Pressable onPress={handleAddPress} style={styles.addButtonWrapper}>
            <View style={styles.addButton}>
              <Dots height={26} width={26} stroke="#fff" />
            </View>
          </Pressable>
        )}
      </LinearGradient>
    );
  },
);

const styles = StyleSheet.create({
  main: {
    width: '100%',
    marginTop: 2,
    flexDirection: 'row',
    // paddingBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomeText: {
    // marginTop: 12,
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#fff',
  },
  accountBalanceLabel: {
    marginTop: 4,
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13,
    color: '#fff',
  },
  accountBalance: {
    marginTop: 4,
    fontSize: 24,
    fontFamily: 'ReadexPro-Medium',
    letterSpacing: 0.5,
    color: '#fff',
    // letterSpacing: -1.2,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1000,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevated: 1,
    marginRight: 30,
    // marginTop: 13,
  },
  addButtonWrapper: { marginLeft: 'auto', justifyContent: 'center' },
  accountTextWrapper: { marginLeft: 26 },
});

export default AccountInfoBanner;
