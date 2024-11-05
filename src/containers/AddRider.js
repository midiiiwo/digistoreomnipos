import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useAddMerchantRider } from '../hooks/useAddMerchantRider';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
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

const AddRider = ({ navigation }) => {
  const { user, outlet } = useSelector(state => state.auth);
  const outlet_id = outlet.outlet_id;
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    contact: '',
    outlet: outlet_id,
    license: '',
    vehicle: '',
    merchant_id: user,
  });
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
      console.log('Saved response:', saved);
      const toastType = saved.code === 200 ? 'success' : 'danger';
      toast.show(saved.message, { placement: 'top', type: toastType });
      if (saved.code === 200) {
        navigation.goBack();
      }
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
    [dispatch]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter rider name"
            showError={showError && state.name?.length === 0}
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
            showError={showError && state.contact?.length === 0}
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
            placeholder="Enter motor bike or vehicle registration number"
            val={state.licence}
            setVal={text =>
              handleTextChange({
                type: 'vehicle',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter licence Number"
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
              state.name?.length === 0 ||
              state.contact?.length === 0
            ) {
              setShowError(true);
              toast.show('Please provide all required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            addRider.mutate({
              name: state.name,
              vehicle: state.vehicle || '',
              telephone: state.contact,
              outlet: outlet_id,
              license: state.licence || '',
              merchant_id: user.merchant,
            });
          }}
        >
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
});
