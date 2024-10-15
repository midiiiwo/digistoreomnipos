/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useAddTax } from '../hooks/useAddTax';
import { CheckItem } from './ReceiptDetails';
import { useChangeTaxStatus } from '../hooks/useChangeTaxStatus';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'id':
      return { ...state, id: action.payload };
    case 'name':
      return { ...state, name: action.payload };
    case 'tag':
      return { ...state, tag: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'tin':
      return { ...state, tin: action.payload };
    case 'value':
      return { ...state, value: action.payload };
    case 'show_tax':
      return { ...state, showTax: action.payload };
    case 'status':
      return { ...state, status: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const AddTax = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [taxStatus, setTaxStatus] = React.useState(false);

  const [state, dispatch] = React.useReducer(reducer, {
    id: '',
    name: '',
    tag: '',
    description: '',
    tin: '',
    value: '',
    showTax: false,
    status: false,
  });
  const toast = useToast();
  const client = useQueryClient();

  // useGetMerchantUserOutlets(user.merchant, item.user_id);

  const { mutate, isLoading } = useAddTax(i => {
    if (i) {
      setSaved(i);
    }
    // if (i.status == 0) {
    //   client.invalidateQueries('merchant-taxes');
    //   changeStatus({
    //     id,
    //     status: state.status ? 'ACTIVE' : 'INACTIVE',
    //     mod_by: user.login,
    //   });
    // }
  });

  console.log('cccccccc', saved);

  const { mutate: changeStatus, isLoading: isStatusLoading } =
    useChangeTaxStatus(setTaxStatus);

  // const { data: verifyData } = useVerifyMerchantUserUsername(
  //   user.merchant,
  //   state.username,
  //   verify && state.username.length !== 0,
  // );

  // React.useEffect(() => {
  //   const status = data && data.data && data.data.data

  // }, [])

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, {
          placement: 'top',
          type: 'success',
        });
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
            placeholder="Enter Tax Name"
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
            placeholder="Enter Tax Tag"
            val={state.tag}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'tag',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Tax Value (Without %)"
            val={state.value}
            keyboardType="number-pad"
            // nLines={3}
            showError={showError && state.value.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'value',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Tax Description"
            val={state.description}
            setVal={text =>
              handleTextChange({
                type: 'description',
                payload: text,
              })
            }
            // showError={showError && state.username.length === 0}
          />
          <Input
            placeholder="Enter TIN Number"
            val={state.tin}
            setVal={text =>
              handleTextChange({
                type: 'tin',
                payload: text,
              })
            }
            // showError={showError && state.tin.length === 0}
          />

          <CheckItem
            placeholder="Show Tax?"
            value={state.showTax}
            onValueChange={() => {
              dispatch({
                type: 'show_tax',
                payload: !state.showTax,
              });
            }}
          />
          {/* <CheckItem
            placeholder="Activate Tax"
            value={state.status}
            onValueChange={() => {
              dispatch({
                type: 'status',
                payload: !state.status,
              });
            }}
          /> */}
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLoading}
          handlePress={() => {
            console.log(state);
            if (
              state.name.length === 0 ||
              // !state.tin ||
              state.value.length === 0 ||
              state.showTax.length === 0
            ) {
              setShowError(true);
              return;
            }
            mutate({
              name: state.name,
              tag: state.tag,
              description: state.description,
              tin: state.tin,
              value: state.value,
              merchant: user.merchant,
              mod_by: user.login,
              show_tax: state.showTax ? 'YES' : 'NO',
              // user_type: 'MERCHANT',
            });
          }}>
          {isLoading || isStatusLoading ? 'Processing' : 'Save Tax'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddTax;
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
