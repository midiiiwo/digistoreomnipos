/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

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

const AddCategory = () => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
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
        navigation.goBack();
        setSaved(null);
        return;
      }
      toast.show(saved.message, { placement: 'top', type: 'danger' });
      setSaved(null);
    }
  }, [saved, toast, navigation]);

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
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
                type: 'category_desc',
                payload: text,
              })
            }
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={saved === 'Success'}
          handlePress={() => {
            if (state.name.length === 0) {
              setShowError(true);
              toast.show('Please provide all required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            addCategory.mutate(state);
          }}>
          {addCategory.isLoading ? 'Loading' : 'Save category'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddCategory;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
    backgroundColor: '#fff',
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
