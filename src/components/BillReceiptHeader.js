import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BillReceiptHeader = ({ navigation, handleNavigation }) => {
  const { resetCart, selectCustomer, setInvoice, setCustomerPayment } =
    useActionCreator();

  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      style={[styles.headerMain, { paddingTop: top + 22 }]}
      onPress={() => {
        resetCart();
        selectCustomer(null);
        setInvoice(null);
        setCustomerPayment({});
        if (!handleNavigation) {
          navigation.navigate('Paypoint');
        } else if (handleNavigation && typeof handleNavigation === 'function') {
          handleNavigation();
        }
      }}>
      <Text style={styles.prev}>New transaction</Text>
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
    paddingTop: 22,
    paddingBottom: 10,
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

export default BillReceiptHeader;
