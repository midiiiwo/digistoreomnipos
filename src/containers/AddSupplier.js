/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import { Api } from './api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'contact':
      return { ...state, contact: action.payload };
    case 'address':
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

function useAddSupplier(handleSuccess) {
  const queryResult = useMutation(
    ['add-supplier'],
    payload => {
      try {
        return Api.post('/inventory/suppliers', payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

const CreateSupplier = () => {
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    contact: '',
    address: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const addSupplier = useAddSupplier(i => {
    if (i?.status == 0) {
      client.invalidateQueries('suppliers');
      navigation.goBack();
    }
    toast.show(i.message, { placement: 'top' });
  });

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
            placeholder="Supplier Name"
            showError={showError && state.name.length === 0}
            val={state.name}
            setVal={text =>
              handleTextChange({
                type: 'name',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Supplier Contact"
            showError={showError && state.contact.length === 0}
            val={state.contact}
            setVal={text =>
              handleTextChange({
                type: 'contact',
                payload: text,
              })
            }
            keyboardType="phone-pad"
          />
          <Input
            placeholder="Supplier Address"
            val={state.address}
            setVal={text =>
              handleTextChange({
                type: 'address',
                payload: text,
              })
            }
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            if (state.name.length === 0 || state.contact.length === 0) {
              setShowError(true);
              toast.show('Please provide  required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            const payload = {
              name: state.name,
              address: state.address,
              contact: state.contact,
              merchant: user?.merchant,
              mod_by: user?.login,
            };
            // console.log(payload);
            addSupplier.mutate(payload);
          }}>
          {addSupplier.isLoading ? 'Loading' : 'Save Supplier'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default CreateSupplier;
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
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '86%',
  },
  dWrapper: {
    paddingTop: 12,
  },
});
