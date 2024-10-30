import { Pressable, Text, StyleSheet, View } from 'react-native';
import React from 'react';
import { useActionCreator } from '../hooks/useActionCreator';

const ModalCancel = ({
  handlePress,
  navigation,
  newSale = false,
  cancel = true,
  extraStyle,
  cancelText,
  onNewSaleTrigger,
}) => {
  const { setInvoice, setCustomerPayment, resetCart, selectCustomer } =
    useActionCreator();
  return (
    <View style={[styles.main, { ...extraStyle }]}>
      {newSale && (
        <Pressable
          onPress={() => {
            if (onNewSaleTrigger) {
              onNewSaleTrigger();
              return;
            }
            navigation.navigate('Inventory');
            setInvoice(null);
            resetCart();
            selectCustomer(null);
            setInvoice(null);
            setCustomerPayment({});
          }}
          style={(styles.press, { marginRight: 'auto' })}>
          <Text style={styles.newsale}>New sale</Text>
        </Pressable>
      )}
      {cancel && (
        <Pressable
          onPress={() => {
            setInvoice(null);
            setCustomerPayment({});
            handlePress();
          }}
          style={styles.press}>
          <Text style={styles.text}>{cancelText ? cancelText : 'Cancel'}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    marginHorizontal: 18,
  },
  press: {
    marginLeft: 'auto',
  },
  text: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    marginLeft: 'auto',
    color: '#EB455F',
  },
  newsale: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    marginLeft: 'auto',
    color: 'rgba(25, 66, 216, 0.9)',
  },
});

export default ModalCancel;
