/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import PrimaryButton from '../components/PrimaryButton';
import { useLookupCustomerFromVendor } from '../hooks/useLookupCustomerFromVendor';
import { useToast } from 'react-native-toast-notifications';
import Input from '../components/Input';
import { useGetExpenseCategoriesLov } from './ExpenseCategoryLov';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import Picker from '../components/Picker';
import { Checkbox, Picker as RNPicker } from 'react-native-ui-lib';

const reducer = (state, action) => {
  switch (action.type) {
    case 'account_number':
      return { ...state, accountNumber: action.payload };
    case 'account_name':
      return { ...state, accountName: action.payload };
    case 'customer_number':
      return { ...state, customerNumber: action.payload };
    case 'customer_name':
      return { ...state, customerName: action.payload };
    case 'customer_email':
      return { ...state, customerEmail: action.payload };
    case 'mobile_number':
      return { ...state, mobileNumber: action.payload };
    case 'category':
      return { ...state, category: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function BillDetails(props) {
  const [showError, setShowError] = React.useState(false);
  const step = React.useRef(0);
  const [lookUp, setLookup] = React.useState(false);

  const [checkAsExpense, setCheckAsExpense] = React.useState(false);

  const [state, dispatch] = React.useReducer(reducer, {
    accountNumber: '',
    accountName: '',
    mobileNumber: '',
    amount: '',
    category: null,
  });
  const { user } = useSelector(s => s.auth);

  const { data, isLoading } = useGetExpenseCategoriesLov(user?.merchant);

  React.useEffect(() => {
    console.log(props.payload);
    dispatch({
      type: 'update_all',
      payload: {
        accountNumber: props?.route?.params?.accountNumber || '',
      },
    });
  }, [props]);

  const toast = useToast();

  const {
    data: lookupData,
    isLoading: isLookupLoading,
    isFetching,
  } = useLookupCustomerFromVendor(
    props.route.params.billCode,
    state.accountNumber,
    lookUp && state.accountNumber.length > 0,
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

  React.useEffect(() => {
    if (!isLookupLoading && lookupData?.data) {
      if (lookupData?.data?.status == 0) {
        SheetManager.show('confirmBillPayment', {
          payload: {
            bill: props.route.params.billCode,
            name: lookupData.data.message.acctName,
            amountDue: lookupData.data.message.amountDue,
            navigation: props.navigation,
            accountNumber: state.accountNumber,
            message: lookupData?.data?.message,
            mobileNumber: state.mobileNumber,
            amountPrev:
              (props.route &&
                props.route.params &&
                props.route.params.amount) ||
              '',
            checkAsExpense,
            billCategory: state.category,
            billName: props?.route?.params?.bill,
          },
        });
      } else if (lookupData.data.status != 0) {
        toast.show('Account number provided failed account validation', {
          type: 'danger',
          placement: 'top',
          duration: 5000,
        });
      }
      setLookup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lookupData,
    isLookupLoading,
    toast,
    props.route.params.billCode,
    props.navigation,
  ]);

  if (isLoading) {
    return <Loading />;
  }
  const categoriesData = data?.data?.data;

  return (
    <>
      <View
        style={{
          height: '100%',
          borderRadius: 0,
          backgroundColor: '#fff',
          // paddingTop: 14,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginTop: 14,
          }}>
          {props?.route?.params?.bill?.toUpperCase()}
        </Text>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Account number"
            showError={showError && state.accountNumber.length === 0}
            val={state.accountNumber}
            setVal={text =>
              handleTextChange({
                type: 'account_number',
                payload: text,
              })
            }
          />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: '#4B6587',
              fontSize: 13,
              marginTop: 16,
            }}>
            This number would receive the receipt of the transaction
          </Text>
          <Input
            placeholder="Mobile Number (Optional)"
            val={state.mobileNumber}
            setVal={text =>
              handleTextChange({
                type: 'mobile_number',
                payload: text,
              })
            }
            keyboardType="phone-pad"
            inputMode="tel"
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
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLookupLoading || isFetching}
          handlePress={() => {
            if (
              state.accountNumber.length === 0 ||
              (checkAsExpense && !state.category)
            ) {
              toast.show('Please enter required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            if (step.current === 0) {
              setLookup(true);
              return;
            }
          }}>
          {isLookupLoading || isFetching ? 'Processing' : 'Proceed'}
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
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
export default BillDetails;
