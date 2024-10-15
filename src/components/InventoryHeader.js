/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import BackIcon from '../../assets/icons/arrow-back.svg';
import { useSelector } from 'react-redux';

import User from '../../assets/icons/user.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InventoryHeader = ({
  navigation,
  prevScreen,
  addCustomer = true,
  mainHeader,
  title,
  rightComponentText,
  rightComponentFunction,
  showBack = true,
}) => {
  const { customer } = useSelector(state => state.sale);
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.main, { paddingTop: top + 4 }, mainHeader]}>
      <View style={[styles.headerMain, {}]}>
        {showBack && (
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <BackIcon height={28.5} width={28.5} stroke="#3C4959" />
            {/* <Text style={styles.prev}>{prevScreen}</Text> */}
          </Pressable>
        )}
        <View style={styles.titleWrapper}>
          {title && <Text style={[styles.prev]}>{title}</Text>}
        </View>
        {addCustomer &&
          (customer ? (
            <Pressable
              style={[
                styles.headerTextWrapper,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                },
              ]}
              onPress={() => navigation.navigate('Customer Select')}>
              <User height={20} width={20} fill="#1942D8" />
              <Text
                numberOfLines={1}
                style={[
                  styles.headerText,
                  { marginLeft: 3, maxWidth: '84%', textAlign: 'right' },
                ]}>
                {customer.customer_name}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.headerTextWrapper}
              onPress={() => navigation.navigate('Customer Select')}>
              <Text style={styles.headerText}>Add Customer</Text>
            </Pressable>
          ))}
        {rightComponentText && rightComponentText.length > 0 ? (
          <Pressable
            style={styles.headerTextWrapper}
            onPress={() => rightComponentFunction()}>
            <Text style={styles.headerText}>{rightComponentText}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingVertical: 8,
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerMain: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingTop: 30,
    // paddingBottom: 8,
    paddingLeft: 12,
  },

  headerText: {
    marginLeft: 'auto',
    marginRight: 14,
    color: '#1942D8',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
  },
  headerTextWrapper: {
    marginLeft: 'auto',
    padding: 6,
    position: 'absolute',
    right: 7,
  },
  titleWrapper: {
    flexDirection: 'row',
    textAlign: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',

    // right: 'auto',
  },
  prev: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 21,
    color: '#000',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 'auto',
    position: 'absolute',
    padding: 12,
    left: 15,
  },
});

export default InventoryHeader;
