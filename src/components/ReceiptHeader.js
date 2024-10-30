/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const ReceiptHeader = ({
  navigation,
  text = 'New sale',
  navigateTo = 'Home',
  onNavigate,
  backgroundColor,
}) => {
  const { resetCart, selectCustomer, setInvoice, setCustomerPayment } =
    useActionCreator();
  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      style={[
        styles.headerMain,
        { paddingTop: Platform.OS === 'android' ? 22 : top, backgroundColor },
      ]}
      onPress={() => {
        resetCart();
        selectCustomer(null);
        setInvoice(null);
        setCustomerPayment({});
        if (onNavigate) {
          onNavigate();
          return;
        }
        navigation.navigate(navigateTo);
      }}>
      <Text style={styles.prev}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerMain: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerText: {
    color: '#1942D8',
    marginLeft: 'auto',
    marginRight: 18,
    fontSize: 16,
    // fontFamily: 'Inter-Medium',
  },
  prev: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1942D8',
    marginLeft: 12,
  },
});

export default ReceiptHeader;
