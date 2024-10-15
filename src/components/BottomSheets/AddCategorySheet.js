/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import { useAddCategory } from '../../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';

export const Picker = ({ disabled, children, value, setValue, showError }) => {
  return (
    <View style={styles.dWrapper}>
      <RNPicker
        placeholder="Select category"
        floatingPlaceholder
        value={value}
        enableModalBlur={false}
        onChange={item => setValue(item)}
        labelColor="#30475e"
        floatingPlaceholderColor={
          disabled ? '#ddd' : showError ? '#EB455F' : '#009EFF'
        }
        floatingPlaceholderStyle={dd.placeholder}
        topBarProps={{ title: 'Select category' }}
        style={[
          dd.main,
          {
            backgroundColor: showError ? 'rgba(235, 69, 95, 0.04)' : '#F5FAFF',
            borderColor: showError ? 'rgba(235, 69, 95, 1)' : '#B7D9F8',
          },
        ]}
        migrateTextField>
        {children}
      </RNPicker>
    </View>
  );
};

const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
  return (
    <TextInput
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#B7C4CF'}
      activeOutlineColor={showError ? '#EB455F' : '#1942D8'}
      outlineStyle={{
        borderWidth: 0.9,
        borderRadius: 4,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
    />
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'category_name':
      return { ...state, name: action.payload };
    case 'category_desc':
      return { ...state, desc: action.payload };
    default:
      return state;
  }
};

function AddCategorySheet(props) {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    desc: '',
    merchant: user.merchant,
    mod_by: user.login,
  });
  const toast = useToast();
  const client = useQueryClient();

  const addCategory = useAddCategory(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('product-categories');
    }
  });

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top' });
        SheetManager.hideAll();
        setSaved(null);
        return;
      }
      toast.show(saved.message, { placement: 'top', type: 'danger' });
      setSaved(null);
    }
  }, [saved, toast]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={{ height: '100%' }}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
          }}>
          <Pressable
            onPress={() => SheetManager.hide('addCategory')}
            style={{ marginRight: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: 'rgba(25, 66, 216, 0.9)',
                fontFamily: 'Inter-Medium',
              }}>
              Done
            </Text>
          </Pressable>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'Inter-Medium',
              paddingTop: 18,
              fontSize: 15,
            }}>
            Add new category
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('addCategory')}
            style={{ marginLeft: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: '#EB455F',
                fontFamily: 'Inter-Medium',
              }}>
              Cancel
            </Text>
          </Pressable>
        </View>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter category name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'category_name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter description (optional)"
            val={state.description}
            nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'product_description',
                payload: text,
              })
            }
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={addCategory.isLoading}
          handlePress={() => {
            if (state.name.length === 0) {
              setShowError(true);
              return;
            }
            addCategory.mutate(state);
          }}>
          {addCategory.isLoading ? 'Processing' : 'Save category'}
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}
PrimaryButton;

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    backgroundColor: '#fff',
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
  dWrapper: {
    paddingTop: 12,
  },
});

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 14,
    height: '100%',
    zIndex: 100,
  },
  main: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#B7D9F8',
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#F5FAFF',
  },
});

export default AddCategorySheet;
