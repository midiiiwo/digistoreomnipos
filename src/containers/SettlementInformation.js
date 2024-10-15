/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import { useGetOutletCategories } from '../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';

import {
  Picker as RNPicker,
  RadioButton,
  RadioGroup,
} from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { IndexPath, Menu, MenuItem } from '@ui-kitten/components';
import Scanner from '../../assets/icons/barscanner';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Loading from '../components/Loading';

import { TextInput } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

// import { Switch } from 'react-native-ui-lib';

import PrimaryButton from '../components/PrimaryButton';
import { useAddCategoryProduct } from '../hooks/useAddCategoryProduct';
import Picker from '../components/Picker';
import AddImage from '../../assets/icons/add-image.svg';
import { useGetStoreOutlets } from '../hooks/useGetStoreOutlets';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { Switch } from '@rneui/themed';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import { DateTimePicker } from 'react-native-ui-lib';
import Check from '../../assets/icons/verified.svg';
import { useGetOnboardingRequirements } from '../hooks/useGetOnboardingRequirements';
import { useGetPreactiveState } from '../hooks/useGetPreactiveState';
import { useLookupAccount } from '../hooks/useLookupAccount';
import { useAddSettlementAccount } from '../hooks/useAddSettlementAccount';
import { useNavigation } from '@react-navigation/native';

export const Input = ({
  placeholder,
  val,
  setVal,
  nLines,
  showError,
  ...props
}) => {
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
    case 'aType':
      return { ...state, accountType: action.payload };
    case 'bank':
      return { ...state, bank: action.payload };
    case 'branch':
      return { ...state, branch: action.payload };
    case 'branch_code':
      return { ...state, branchCode: action.payload };
    case 'account_name':
      return { ...state, accountName: action.payload };
    case 'account_number':
      return { ...state, accountNumber: action.payload };
    case 'momo':
      return { ...state, momo: action.payload };
    case 'momo_number':
      return { ...state, momoNumber: action.payload };
    case 'momo_name':
      return { ...state, momoName: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const mapCodeToProvider = {
  MTNMM: 'mtn',
  VODAC: 'vodafone',
  TIGOC: 'airtelTigo',
};

const SettlementInformation = ({ route }) => {
  const { user } = useSelector(state => state.auth);
  const [settlementStatus, setSettlementStatus] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    accountType: null,
    bank: null,
    branch: null,
    branchCode: '',
    accountName: '',
    accountNumber: '',
    momo: null,
    momoName: '',
    momoNumber: '',
  });

  const {
    data: lookup,
    // isLookupLoading,
    refetch,
  } = useLookupAccount(
    mapCodeToProvider[(state.momo && state.momo.value) || ''],
    state.momoNumber,
    false,
  );

  const selectedBankBranches = React.useRef([]);
  const navigation = useNavigation();
  const toast = useToast();
  const client = useQueryClient();

  const { data: requirements, isLoading: isRequirmentsLoading } =
    useGetOnboardingRequirements();

  const { data: personal, isLoading: isPersonalLoading } = useGetPreactiveState(
    user.merchant,
  );

  const { mutate, isLoading: isSettlementLoading } = useAddSettlementAccount(
    i => {
      client.invalidateQueries('current-activation-step');
      setSettlementStatus(i);
    },
  );

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const pData = personal && personal.data && personal.data.data;

  React.useEffect(() => {
    if (state.momoNumber && state.momoNumber.length === 10) {
      refetch();
    }
  }, [
    state.momoNumber,
    handleTextChange,
    refetch,
    state.accountType,
    state.momo,
  ]);

  React.useEffect(() => {
    if (settlementStatus) {
      if (settlementStatus.status == 0) {
        toast.show(settlementStatus.message, {
          placement: 'top',
          type: 'success',
        });
        navigation.navigate('Activation Type');
        setSettlementStatus(null);
      } else {
        toast.show(settlementStatus.message, {
          placement: 'top',
          type: 'danger',
        });
        setSettlementStatus(null);
      }
    }
  }, [navigation, settlementStatus, toast]);

  React.useEffect(() => {
    if (lookup && lookup.data && lookup.data) {
      handleTextChange({
        type: 'momo_name',
        payload: lookup.data.name,
      });
    }
  }, [handleTextChange, state.momoNumber, lookup]);

  React.useEffect(() => {
    if (pData) {
      const settlement = pData.settlement;
      console.log('ssssssssssssssss', settlement);
      if (settlement.settlement_channel === 'MOBILEMONEY') {
        const momo =
          requirements &&
          requirements.data &&
          requirements.data.data &&
          requirements.data.data.settlement.MOBILEMONEY.options.find(
            i => i.code === settlement.settlement_institution,
          );

        dispatch({
          type: 'update_all',
          payload: {
            accountType: {
              key: 'Mobile Money',
              label: 'Mobile Money',
              value: 'MOBILEMONEY',
            },
            momo: {
              label: (momo && momo.name) || '',
              value: (momo && momo.code) || '',
              key: (momo && momo.name) || '',
            },
            momoName: settlement.settlement_account_name,
            momoNumber: settlement.settlement_account_no,
          },
        });
      } else if (settlement.settlement_channel === 'BANK') {
        const institution =
          requirements &&
          requirements.data &&
          requirements.data.data &&
          requirements.data.data.settlement.BANK.options.find(
            i => i.name === settlement.settlement_institution,
          );

        dispatch({
          type: 'update_all',
          payload: {
            bank: {
              label: institution.name,
              value: JSON.stringify(institution),
              key: institution.name,
            },
            branch: {
              label: settlement.settlement_institution_branch,
              value: settlement.settlement_institution_branch_code,
              key: settlement.settlement_institution_branch_code,
            },
            branchCode: settlement.settlement_institution_branch_code,
            accountType: {
              key: 'Bank',
              label: 'Bank',
              value: 'BANK',
            },
            accountName: settlement.settlement_account_name,
            accountNumber: settlement.settlement_account_no,
          },
        });
      }
    }
  }, [pData, requirements]);

  // React.useEffect(() => {
  //   if (route && route.params) {
  //     if (route.params.prev_screen == 'location') {
  //       dispatch({
  //         type: 'bLocation',
  //         payload: route.params.location,
  //       });
  //     }
  //   }
  // }, [route]);

  if (isRequirmentsLoading || isPersonalLoading) {
    return <Loading />;
  }

  const banks =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.settlement.BANK.options.map(i => {
      if (!i) {
        return;
      }
      return {
        label: i.name,
        value: JSON.stringify(i),
        key: i.name,
      };
    });

  const momo =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.settlement.MOBILEMONEY.options.map(i => {
      if (!i) {
        return;
      }
      return {
        label: i.name,
        value: i.code,
        key: i.name,
      };
    });

  return (
    <View>
      <ScrollView style={{ height: '100%', backgroundColor: '#fff' }}>
        <View style={styles.main}>
          <Picker
            showError={!state.accountType && showError}
            placeholder="Select Bank / Mobile Money"
            value={state.accountType}
            setValue={item => {
              handleTextChange({
                type: 'aType',
                payload: item,
              });
            }}>
            <RNPicker.Item key="Bank" label="Bank" value="BANK" />
            <RNPicker.Item
              key="Mobile Money"
              label="Mobile Money"
              value="MOBILEMONEY"
            />
          </Picker>
          {state.accountType && state.accountType.value === 'BANK' && (
            <>
              <Picker
                showError={!state.bank && showError}
                placeholder="Select Bank"
                value={state.bank}
                searchPlaceholder="Search Bank"
                showSearch
                setValue={item => {
                  handleTextChange({
                    type: 'bank',
                    payload: item,
                  });
                  if (state.branch) {
                    handleTextChange({
                      type: 'branch',
                      payload: null,
                    });
                  }
                  selectedBankBranches.current = JSON.parse(
                    item.value,
                  ).branches.map(i => {
                    if (!i) {
                      return;
                    }
                    return {
                      label: i.branch_name,
                      value: i.branch_code,
                      key: i.branch_code,
                    };
                  });
                }}>
                {banks.map(i => {
                  return (
                    <RNPicker.Item
                      key={i.key}
                      label={i.label}
                      value={i.value}
                    />
                  );
                })}
              </Picker>
              <Picker
                showError={!state.branch && showError}
                showSearch
                searchPlaceholder="Search Bank Branch"
                placeholder="Select Bank Branch"
                value={state.branch}
                setValue={item => {
                  handleTextChange({
                    type: 'branch',
                    payload: item,
                  });
                  handleTextChange({
                    type: 'branch_code',
                    payload: item.value,
                  });
                }}>
                {selectedBankBranches.current.map(i => (
                  <RNPicker.Item key={i.key} label={i.label} value={i.value} />
                ))}
              </Picker>
              {/* <Input
                placeholder="Enter Branch Code (Optional)"
                showError={showError && state.branchCode.length === 0}
                val={state.branchCode}
                setVal={text =>
                  handleTextChange({
                    type: 'branch_code',
                    payload: text,
                  })
                }
              /> */}
              <Input
                placeholder="Enter Account Name"
                showError={showError && state.accountName.length === 0}
                val={state.accountName}
                setVal={text =>
                  handleTextChange({
                    type: 'account_name',
                    payload: text,
                  })
                }
              />
              <Input
                placeholder="Enter Account Number"
                showError={showError && state.accountNumber.length === 0}
                val={state.accountNumber}
                setVal={text =>
                  handleTextChange({
                    type: 'account_number',
                    payload: text,
                  })
                }
                keyboardType="number-pad"
              />
            </>
          )}
          {state.accountType && state.accountType.value === 'MOBILEMONEY' && (
            <>
              <Picker
                showError={!state.momo && showError}
                placeholder="Select Mobile Money Provider"
                value={state.momo}
                setValue={item => {
                  handleTextChange({
                    type: 'momo',
                    payload: item,
                  });
                }}>
                {momo.map(i => {
                  return (
                    <RNPicker.Item
                      key={i.key}
                      label={i.label}
                      value={i.value}
                    />
                  );
                })}
              </Picker>
              <Input
                placeholder="Enter Account Number"
                showError={showError && state.momoNumber.length === 0}
                val={state.momoNumber}
                setVal={text =>
                  handleTextChange({
                    type: 'momo_number',
                    payload: text,
                  })
                }
                keyboardType="phone-pad"
              />
              {/* <Input
                placeholder="Enter Account Name"
                showError={showError && state.momoName.length === 0}
                val={state.momoName}
                setVal={text =>
                  handleTextChange({
                    type: 'momo_name',
                    payload: text,
                  })
                }
                disabled
              /> */}
              <View style={{ marginTop: 12, paddingLeft: 6 }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 14,
                    color: '#777',
                  }}>
                  Account Name
                </Text>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 16,
                    color: '#5C6E91',
                    marginTop: 4,
                  }}>
                  {state.momoName}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            if (!state.accountType) {
              setShowError(true);
              return;
            }
            if (state.accountType.value === 'MOBILEMONEY') {
              if (
                !state.momo ||
                state.momoNumber.length === 0 ||
                state.momoName.length === 0
              ) {
                setShowError(true);
                return;
              }
              const p = {
                merchant_id: user.merchant,
                settlement_channel: state.accountType.value,
                settlement_institution: state.momo.value,
                settlement_account_no: state.momoNumber,
                settlement_account_name: state.momoName,
                source: 'MOBILE',
                mod_by: user.login,
              };
              mutate(p);
              // mutate(p);
            } else if (state.accountType.value === 'BANK') {
              if (
                !state.bank ||
                !state.branch ||
                state.accountName.length === 0 ||
                state.accountNumber.length === 0
              ) {
                setShowError(true);
                return;
              }
              const p = {
                merchant_id: user.merchant,
                settlement_channel: state.accountType.value,
                settlement_institution: state.bank.label,
                settlement_account_no: state.accountNumber,
                settlement_account_name: state.accountName,
                settlement_institution_branch: state.branch.label,
                settlement_institution_branch_code: state.branch.value,
                source: 'MOBILE',
                mod_by: user.login,
              };
              mutate(p);
            }
          }}
          disabled={isSettlementLoading}>
          {isSettlementLoading ? 'Processing' : 'Save'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default SettlementInformation;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 10,
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

  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 6,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
