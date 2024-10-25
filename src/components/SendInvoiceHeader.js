import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const SendInvoiceHeader = ({
  text = 'New sale',
  navigateTo = 'Home',
  onNavigate,
}) => {
  const { resetInvoiceCart } = useActionCreator();
  // const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Pressable
        style={[styles.headerMain]}
        onPress={() => {
          resetInvoiceCart();
          if (onNavigate) {
            onNavigate();
            return;
          }
          navigation.navigate(navigateTo);
        }}>
        <Text style={styles.prev}>{text}</Text>
      </Pressable>
    </SafeAreaView>
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

export default SendInvoiceHeader;
