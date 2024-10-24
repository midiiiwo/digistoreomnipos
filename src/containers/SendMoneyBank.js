/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import PrimaryButton from '../components/PrimaryButton';
import Input from '../components/Input';
import { useToast } from 'react-native-toast-notifications';
import ContactIcon from '../../assets/icons/contact.svg';
import { PERMISSIONS, check, request } from 'react-native-permissions';
import { selectContactPhone } from 'react-native-select-contact';
import { Checkbox } from 'react-native-ui-lib';
import { useGetExpenseCategoriesLov } from './ExpenseCategoryLov';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import Picker from '../components/Picker';
import { Picker as RNPicker } from 'react-native-ui-lib';
import { useQuery, useQueryClient } from 'react-query';
import { getBankList } from '../api/paypoint';
import moment from 'moment';
import { useSendMoney } from '../hooks/useSendMoney';
import { useAddExpense } from './CreateExpense';
import { useNavigation } from '@react-navigation/native';

const reducer = (state, action) => {
  switch (action.type) {
    case 'account_number':
      return { ...state, accountNumber: action.payload };
    case 'bank':
      return { ...state, bank: action.payload };
    case 'branch':
      return { ...state, branch: action.payload };
    case 'branch_code':
      return { ...state, branchCode: action.payload };
    case 'account_name':
      return { ...state, accountName: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    case 'category':
      return { ...state, category: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export function useGetBankList(supervisor) {
  const queryResult = useQuery(['bank-list', supervisor], () =>
    getBankList(supervisor),
  );
  return queryResult;
}

function SendMoneyBank(props) {
  const [saved, _] = React.useState('');
  const [payStatus, setPayStatus] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const toast = useToast();
  const [checkAsExpense, setCheckAsExpense] = React.useState(false);
  const prevSendMoneyData = props.route.params.sendMoneyDetails;

  const { user } = useSelector(state => state.auth);
  const { data: bankData, isLoading: bankIsLoading } = useGetBankList('NA');
  // const [lookUp, setLookup] = React.useState(false);
  const [branches, setBranches] = React.useState([]);

  const [state, dispatch] = React.useReducer(reducer, {
    accountNumber: '',
    description: '',
    amount: '',
    bank: null,
    branch: '',
    branchCode: '',
    category: null,
  });

  const { data, isLoading } = useGetExpenseCategoriesLov(user?.merchant);

  React.useEffect(() => {
    if (prevSendMoneyData) {
      dispatch({
        type: 'update_all',
        payload: {
          accountNumber: prevSendMoneyData.accountNumber,
          description: prevSendMoneyData.description,
          amount: prevSendMoneyData.amount,
        },
      });
    }
  }, [prevSendMoneyData]);
  const client = useQueryClient();
  const navigation = useNavigation();

  const addExpense = useAddExpense(res => {
    if (res) {
      if (res) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        toast.show(res?.message, { placement: 'top' });
        SheetManager.hide('confirmSendMoney');

        navigation.navigate('Send Money Status', {
          payStatus,
          name: '',
          number: state.accountNumber,
          description: state.description,
          serviceProvider: state?.bank?.label,
          amount: data?.data?.amount,
        });
      }
    }
  });

  const { mutate, isLoading: isSendMoneyLoading } = useSendMoney(res => {
    if (res) {
      setPayStatus(res);
      if (res.status == 0) {
        if (checkAsExpense) {
          const payload = {
            name: state.description,
            category: state.category?.id,
            mod_by: user?.login,
            merchant: user?.merchant,
            total_amount: data?.data?.amount,
            amount_paid: data?.data?.amount,
            occurance: 'NONE',
            notify_device: Platform.OS,
            notify_source: 'Digistore Business',
            date: moment(new Date()).format('DD-MM-YYYY'),
          };
          addExpense.mutate(payload);
        } else {
          SheetManager.hide('confirmSendMoney');
          navigation.navigate('Send Money Status', {
            payStatus: res,
            name: '',
            number: state.accountNumber,
            description: state.description,
            serviceProvider: state?.bank?.label,
            amount: data?.data?.amount,
          });
        }
      } else {
        SheetManager.hide('confirmSendMoney');
        navigation.navigate('Send Money Status', {
          payStatus: res,
          name: '',
          number: state.accountNumber,
          description: state.description,
          serviceProvider: state?.bank?.label,
          amount: data?.data?.amount,
        });
      }
    }
  });

  React.useEffect(() => {
    if (state.bank) {
      const selectedBank = bankData?.data?.data?.find(
        item => item?.code === state.bank?.value,
      );
      setBranches(selectedBank?.branches);
    }
  }, [state.bank, bankData?.data?.data]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const applyContactInfo = contact => {
    if (contact) {
      const phone = contact.selectedPhone.number
        .replace('+233', '0')
        .replaceAll(' ', '')
        .replaceAll('-', '');
      handleTextChange({ type: 'account_number', payload: phone });
    }
  };

  if (isLoading || bankIsLoading) {
    return <Loading />;
  }

  const categoriesData = data?.data?.data;

  const banks = bankData?.data?.data?.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          fontSize: 18,
          color: '#053B50',
          textAlign: 'center',
          marginTop: 4,
          letterSpacing: 0.3,
        }}>
        Send {props.route.params.bill}
      </Text>
      <ScrollView style={styles.main}>
        <Picker
          showError={!state.bank && showError}
          placeholder="Select Bank"
          showSearch
          value={state.bank}
          setValue={item => {
            handleTextChange({
              type: 'bank',
              payload: item,
            });
            handleTextChange({
              type: 'branch',
              payload: null,
            });
          }}>
          {banks?.map(bank => {
            if (bank) {
              return (
                <RNPicker.Item
                  key={bank?.name}
                  label={bank?.name}
                  value={bank?.code}
                />
              );
            }
          })}
        </Picker>
        <Picker
          showError={!state.branch && showError}
          placeholder="Select Bank Branch"
          showSearch
          value={state.branch}
          setValue={item => {
            handleTextChange({
              type: 'branch',
              payload: item,
            });
          }}>
          {branches
            ?.sort(function (a, b) {
              if (a.branch_name < b.branch_name) {
                return -1;
              }
              if (a.branch_name > b.branch_name) {
                return 1;
              }
              return 0;
            })
            .map(branch => {
              if (branch) {
                return (
                  <RNPicker.Item
                    key={branch?.branch_code}
                    label={branch?.branch_name}
                    value={branch?.branch_code}
                  />
                );
              }
            })}
        </Picker>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Input
            placeholder="Account Number"
            showError={showError && state.accountNumber.length === 0}
            val={state.accountNumber}
            setVal={text =>
              handleTextChange({
                type: 'account_number',
                payload: text.replaceAll(' ', '').replaceAll('-', ''),
              })
            }
            keyboardType="phone-pad"
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
          <Pressable
            onPress={async () => {
              if (Platform.OS === 'ios') {
                check(PERMISSIONS.IOS.CONTACTS)
                  .then(async status => {
                    if (status !== 'granted') {
                      request(PERMISSIONS.IOS.CONTACTS).then(async res => {
                        if (res === 'granted') {
                          const contact = await selectContactPhone();
                          applyContactInfo(contact);
                        }
                      });
                    } else if (status === 'granted') {
                      const contact = await selectContactPhone();
                      applyContactInfo(contact);
                    }
                  })
                  .catch(err => console.error(err));
              } else if (Platform.OS === 'android') {
                check(PERMISSIONS.ANDROID.READ_CONTACTS).then(async status => {
                  if (status !== 'granted') {
                    request(PERMISSIONS.ANDROID.READ_CONTACTS).then(
                      async res => {
                        if (res === 'granted') {
                          const contact = await selectContactPhone();
                          applyContactInfo(contact);
                        }
                      },
                    );
                  } else if (status === 'granted') {
                    const contact = await selectContactPhone();
                    if (contact) {
                      applyContactInfo(contact);
                    }
                  }
                });
              }
            }}
            style={{
              paddingLeft: 14,
              paddingVertical: 6,
              marginTop: 4,
            }}>
            <ContactIcon height={34} width={34} />
          </Pressable>
        </View>

        <Input
          placeholder="Amount (GHS)"
          val={state.amount}
          setVal={text =>
            handleTextChange({
              type: 'amount',
              payload: text,
            })
          }
          showError={showError && state.amount.length === 0}
          keyboardType="number-pad"
        />
        <Input
          placeholder="Payment Description"
          val={state.description}
          setVal={text =>
            handleTextChange({
              type: 'description',
              payload: text,
            })
          }
          nLines={4}
          showError={showError && state.description.length === 0}
        />
        <Pressable
          onPress={() => {
            setCheckAsExpense(prev => !prev);
          }}
          style={{
            flexDirection: 'row',
            paddingVertical: 16,
          }}>
          <Checkbox
            value={checkAsExpense}
            onValueChange={setCheckAsExpense}
            color="rgba(25, 66, 216, 0.9)"
            style={{
              color: '#204391',
              alignSelf: 'center',
              marginRight: 8,
              marginLeft: 0,
            }}
          />
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#30475e',
              fontSize: 14,
              letterSpacing: -0.1,
              maxWidth: '90%',
            }}>
            Record transaction as an expense
          </Text>
        </Pressable>
        {checkAsExpense && (
          <Picker
            showSearch
            searchPlaceholder={'Search Expense Category'}
            placeholder="Select Expense Category"
            showError={showError && !state.category && checkAsExpense}
            value={state.category?.id || state.catergory?.value}
            setValue={item => {
              handleTextChange({
                type: 'category',
                payload: { id: item?.value },
              });
            }}>
            {categoriesData?.map(item => {
              if (
                item?.expense_category_id &&
                item?.expense_category_is_system != 1
              ) {
                return (
                  <RNPicker.Item
                    key={item?.expense_category_id}
                    label={item?.expense_category}
                    value={item?.expense_category_id}
                  />
                );
              }
            })}
          </Picker>
        )}
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={saved === 'Success'}
          handlePress={() => {
            // let mod_date = moment().format('YYYY-MM-DD h:mm:ss');
            if (
              state.accountNumber.length === 0 ||
              state.amount.length === 0 ||
              state.description.length === 0 ||
              (checkAsExpense && !state.category) ||
              !state.bank ||
              !state.branch
            ) {
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            // const payload = {
            //   recipient: state.accountNumber || '',
            //   merchant_code: user.user_merchant_receivable,
            //   amount: state.amount,
            //   mod_by: user.login || '',
            //   reference: state.description,
            //   pay_date: mod_date,
            //   pay_channel: 'SBANK',
            //   notify_source: 'Digistore Business',
            //   notify_device: Platform.OS,
            //   mod_date: mod_date,
            //   bank_name: state.bank?.label,
            //   bank_branch: state.branch?.label,
            //   bank_code: state.bank?.value,
            //   merchant: user?.merchant,
            // };
            SheetManager.show('confirmSendMoney', {
              payload: {
                bill: props.route.params.billCode,
                amount: state.amount,
                state: {
                  ...state,
                  accountNumber: state.accountNumber.replace(' ', ''),
                },
                lookup: props.route.params.lookup,
                navigation: props.navigation,
                checkAsExpense,
                sendMoneyCategory: state.category,
              },
            });

            // mutate(payload);

            // if (step.current === 1 && data.data.status == 0) {

            // }
          }}>
          {isSendMoneyLoading ? 'Loading' : 'Proceed'}
        </PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 16,
    borderRadius: 0,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
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
  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 12,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default SendMoneyBank;
