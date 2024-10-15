/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useAddMerchantRider } from '../hooks/useAddMerchantRider';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'contact':
      return { ...state, contact: action.payload };
    case 'network':
      return { ...state, network: action.payload };
    case 'licence':
      return { ...state, licence: action.payload };
    default:
      return state;
  }
};

const networks = [
  { name: 'MTN Mobile Money', code: 'MTNMM' },
  { name: 'Vodafone Cash', code: 'VODAC' },
  { name: 'AirtelTigo Money', code: 'TIGOC' },
];

const AddRider = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    contact: '',
    network: null,
    licence: '',
  });
  console.log(state);
  const toast = useToast();
  const client = useQueryClient();

  const addRider = useAddMerchantRider(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-riders');
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
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter rider name"
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
            placeholder="Enter contact number of rider"
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
          <Picker
            // extraStyleOuter={{ flex: 2, marginRight: 6 }}
            showError={showError && !state.network}
            extraStyleOuter={{ marginVertical: 6, paddingTop: 0 }}
            placeholder="Contact Phone Network"
            value={state.network}
            setValue={item => {
              handleTextChange({
                type: 'network',
                payload: item,
              });
            }}>
            {networks.map(i => {
              return (
                <RNPicker.Item key={i.code} label={i.name} value={i.code} />
              );
            })}
          </Picker>
          <Input
            placeholder="Enter motor bike or vehicle registration number"
            val={state.licence}
            setVal={text =>
              handleTextChange({
                type: 'licence',
                payload: text,
              })
            }
          />
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={addRider.isLoading}
          handlePress={() => {
            if (
              state.name.length === 0 ||
              state.contact.length === 0 ||
              !state.network
            ) {
              setShowError(true);
              return;
            }
            console.log(state);
            addRider.mutate({
              merchant: user.merchant,
              phone: state.contact,
              network: state.network.value,
              vehicle: state.licence,
              name: state.name,
              mod_by: user.login,
            });
          }}>
          {addRider.isLoading ? 'Processing' : 'Save Rider'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddRider;
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
