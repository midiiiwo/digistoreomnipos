/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import Picker from '../components/Picker';
import { useGetTaxById } from '../hooks/useGetTaxById';
import { useUpdateTax } from '../hooks/useUpdateTax';
import { CheckItem } from './ReceiptDetails';
import { useChangeTaxStatus } from '../hooks/useChangeTaxStatus';
import Loading from '../components/Loading';
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
    case 'type':
      return { ...state, taxType: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const mapTaxTypes = {
  EXCLUSIVE: 'Apply to product price',
  INCLUSIVE: 'Inclusive in product price',
};

const EditTax = ({ navigation, route }) => {
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
    taxType: null,
  });
  const toast = useToast();
  const client = useQueryClient();

  const { id } = route && route.params;

  const { data, isLoading: taxLoading } = useGetTaxById(id);

  // useGetMerchantUserOutlets(user.merchant, item.user_id);

  const { mutate, isLoading } = useUpdateTax(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('merchant-taxes');
      changeStatus({
        id,
        status: state.status ? 'ACTIVE' : 'INACTIVE',
        mod_by: user.login,
      });
    }
  });

  const { mutate: changeStatus, isLoading: isStatusLoading } =
    useChangeTaxStatus(setTaxStatus);

  React.useEffect(() => {
    const item = (data && data.data && data.data.data) || [];
    const taxValue = item.tax_value * 100;

    if (item) {
      dispatch({
        type: 'update_all',
        payload: {
          id: item.tax_id,
          name: item.tax_name,
          tag: item.tax_tag,
          description: item.tax_descrition,
          tin: item.tax_identification_number,
          value: taxValue.toString(),
          showTax: item.tax_displayed === 'YES',
          status: item.tax_status === 'ACTIVE',
          taxType: {
            label: mapTaxTypes[item.tax_applied_as],
            value: item.tax_applied_as,
          },
        },
      });
    }
  }, [data]);

  // const { data: verifyData } = useVerifyMerchantUserUsername(
  //   user.merchant,
  //   state.username,
  //   verify && state.username.length !== 0,
  // );

  // React.useEffect(() => {
  //   const status = data && data.data && data.data.data

  // }, [])

  React.useEffect(() => {
    if (taxStatus) {
      if (taxStatus.status == 0) {
        toast.show('Tax updated succesfully', {
          placement: 'top',
          type: 'success',
        });
        navigation.goBack();
        setTaxStatus(null);
        client.invalidateQueries('merchant-taxes');
        return;
      }
      toast.show(taxStatus.message, { placement: 'top', type: 'danger' });
      setTaxStatus(null);
    }
  }, [taxStatus, toast, navigation, client]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  if (taxLoading) {
    return <Loading />;
  }

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
            showError={showError && state.tag.length === 0}
          />
          <Input
            placeholder="Enter Tax Value (Without %)"
            val={state.value}
            keyboardType="number-pad"
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
            nLines={3}
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
            placeholder="Show tax on invoice?"
            value={state.showTax}
            onValueChange={() => {
              dispatch({
                type: 'show_tax',
                payload: !state.showTax,
              });
            }}
          />
          <CheckItem
            placeholder="Activate Tax"
            value={state.status}
            onValueChange={() => {
              dispatch({
                type: 'status',
                payload: !state.status,
              });
            }}
            style={{ marginBottom: 12 }}
          />
          <Picker
            placeholder="Select Type"
            showError={showError && !state.taxType}
            value={state.taxType}
            setValue={item => {
              handleTextChange({
                type: 'type',
                payload: item,
              });
            }}>
            <RNPicker.Item
              key={'INCLUSIVE'}
              label={'Inclusive in product price'}
              value={'INCLUSIVE'}
            />
            <RNPicker.Item
              key={'EXCLUSIVE'}
              label={'Apply to product price'}
              value={'EXCLUSIVE'}
            />
          </Picker>
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
              !state.taxType ||
              state.tag.length === 0
            ) {
              setShowError(true);
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            mutate({
              id,
              name: state.name,
              tag: state.tag,
              description: state.description,
              tin: state.tin,
              value: state.value,
              merchant: user.merchant,
              mod_by: user.login,
              show_tax: state.showTax ? 'YES' : 'NO',
              tax_applied_as: state.taxType.value,
              // user_type: 'MERCHANT',
            });
          }}>
          {isLoading || isStatusLoading ? 'Processing' : 'Save Tax'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditTax;
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
