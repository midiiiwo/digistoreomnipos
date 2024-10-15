/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import CaretDown from '../../assets/icons/caret-down.svg';

const Picker = ({
  disabled,
  children,
  value,
  setValue,
  showError,
  placeholder,
  mode,
  title,
  showSearch = false,
  searchPlaceholder,
  extraStyleOuter,
}) => {
  return (
    <View style={[styles.dWrapper, extraStyleOuter]}>
      <RNPicker
        showSearch={showSearch}
        mode={mode ? mode : 'SINGLE'}
        placeholder={placeholder ? placeholder : 'Select category'}
        floatingPlaceholder
        value={value}
        // enableModalBlur={false}
        onChange={item => setValue(item)}
        labelColor="#30475e"
        // placeholderTextColor=
        floatingPlaceholderColor={
          disabled ? '#ddd' : showError ? '#EB455F' : '#777'
        }
        floatingPlaceholderStyle={dd.placeholder}
        topBarProps={{ title: placeholder ? placeholder : 'Select category' }}
        searchStyle={{
          color: '#30475e',
          placeholderTextColor: '#ccc',
        }}
        searchPlaceholder={searchPlaceholder}
        labelStyle={{ fontFamily: 'SFProDisplay-Medium', fontSize: 18 }}
        containerStyle={[
          dd.main,
          {
            // backgroundColor: showError ? 'rgba(235, 69, 95, 0.04)' : '#F5FAFF',
            borderColor: '#fff',
            // borderTopColor: '#fff'
            borderBottomColor: showError ? '#EB455F' : '#ddd',
            borderBottomWidth: 0.9,
            borderRadius: 0,
          },
        ]}
        // caretHidden={false}
        // disableFullscreenUI={true}
        // useWheelPicker
        trailingAccessory={<CaretDown fill={showError ? '#EB455F' : '#777'} />}
        migrateTextField>
        {children}
      </RNPicker>
    </View>
  );
};

const styles = StyleSheet.create({
  dWrapper: {
    paddingTop: 0,
  },
});

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    // paddingHorizontal: 10,
    height: '100%',
    zIndex: 100,
    letterSpacing: 0.2,
  },
  main: {
    // borderWidth: 1.2,
    // borderStyle: 'dashed',
    // borderColor: '#B7D9F8',
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    // backgroundColor: '#F5FAFF',
    marginVertical: 14,
  },
});

export default Picker;
