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
import { useAddMerchantRoute } from '../hooks/useAddMerchantRoute';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';
import Loading from '../components/Loading';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'location':
      return { ...state, location: action.payload };
    case 'rate':
      return { ...state, rate: action.payload };
    default:
      return state;
  }
};

const AddDelivery = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    location: '',
    rate: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const { data, isLoading } = useGetStoreDeliveryConfig(user.merchant);

  const addDelivery = useAddMerchantRoute(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-delivery');
    }
  });

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top', type: 'success' });
        navigation.navigate('Manage Deliveries');
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
  if (isLoading) {
    return <Loading />;
  }

  const config = data && data.data && data.data.data;
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter location area of delivery"
            showError={showError && state.location.length === 0}
            val={state.location}
            setVal={text =>
              handleTextChange({
                type: 'location',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Shipping rate for location"
            val={state.rate}
            showError={showError && state.rate.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'rate',
                payload: text,
              })
            }
            keyboardType="number-pad"
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={addDelivery.isLoading}
          handlePress={() => {
            if (state.location.length === 0 || state.rate.length === 0) {
              setShowError(true);
              toast.show('Please provide all required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            addDelivery.mutate({
              merchant: user.merchant,
              delivery_source: user.user_merchant_type,
              location: state.location,
              price: state.rate,
              mod_by: user.login,
              delivery_option_id: (config && config.option_id) || '',
              delivery: (config && config.option_delivery) || '',
            });
          }}>
          {addDelivery.isLoading ? 'Processing' : 'Save Delivery Route'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddDelivery;
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
