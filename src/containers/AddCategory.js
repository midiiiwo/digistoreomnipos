/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useAddProductCategory } from '../hooks/useAddProductCategory';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import CustomInput from '../components/Input';

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

const AddCategory = ({ navigation }) => {
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
        navigation.navigate('Products');
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
          <CustomInput
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
          <CustomInput
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
          disabled={saved === 'Success'}
          handlePress={() => {
            if (state.name.length === 0) {
              setShowError(true);
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
    marginTop: 0,
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
