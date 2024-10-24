/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView, Text, Platform } from 'react-native';
import { DateTimePicker } from 'react-native-ui-lib';

import PrimaryButton from '../components/PrimaryButton';
// import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import Input from '../components/Input';
import Picker from '../components/Picker';
import { Picker as RNPicker } from 'react-native-ui-lib';
import DateIcon from '../../assets/icons/date.svg';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addExpense,
  deleteExpense,
  editExpense,
  getSelectedExpenseDetails,
} from '../api/expenses';
import moment from 'moment';
import Loading from '../components/Loading';
// import { useGetExpenseCategories } from './ExpensesCategories';
import { useGetExpenseCategoriesLov } from './ExpenseCategoryLov';
// import { useSelector } from 'react-redux';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'category':
      return { ...state, category: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    case 'paid':
      return { ...state, paid: action.payload };
    case 'date':
      return { ...state, date: action.payload };
    case 'occurance':
      return { ...state, occurance: action.payload };
    case 'update-all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function useGetExpenseDetails(id) {
  const queryResult = useQuery(
    ['expense-details', id],
    () => getSelectedExpenseDetails(id),
    { staleTime: 0 },
  );
  return queryResult;
}

export function useAddExpense(handleSuccess) {
  const queryResult = useMutation(
    ['add-expense'],
    payload => {
      try {
        return addExpense(payload);
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

function useEditExpense(handleSuccess) {
  const queryResult = useMutation(
    ['edit-expense'],
    payload => {
      try {
        return editExpense(payload);
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

function useDeleteExpense(handleSuccess) {
  const queryResult = useMutation(
    ['delete-expense'],
    payload => {
      try {
        return deleteExpense(payload?.id);
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

const CreateExpense = ({ route }) => {
  const category = route?.params.category;
  // const categories = route?.params.categories;
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const $deleteExpense = useDeleteExpense(res => {
    if (res) {
      if (res?.status == 0) {
        client.invalidateQueries(['expenses-history']);
        toast.show(res?.message, { placement: 'top' });
        navigation.navigate('Expenses');
      } else {
        toast.show(res?.message, { placement: 'top' });
      }
    }
  });
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    category,
    amount: '',
    paid: '',
    date: new Date(),
    occurance: 'NONE',
  });

  const id = route?.params?.id;
  const client = useQueryClient();

  const { data, isLoading } = useGetExpenseDetails(id);

  const toast = useToast();
  // const client = useQueryClient();
  // const { supplier } = useSelector($state => $state.expenses);

  const expenseDetails = data?.data?.data;

  const {
    data: $categories,
    isLoading: $loading,
    // isRefetching,
    // refetch,
  } = useGetExpenseCategoriesLov(user?.merchant);

  React.useEffect(() => {
    if (data?.data?.status == 0) {
      dispatch({
        type: 'update-all',
        payload: {
          name: expenseDetails?.expense_desc,
          category: { id: expenseDetails?.expense_category },
          amount: expenseDetails?.expense_amount_paid,
          paid: expenseDetails?.expense_amount_paid,
          date: new Date(expenseDetails?.expense_date),
          occurance: expenseDetails?.expense_occurance,
        },
      });
    }
  }, [expenseDetails, data?.data?.status]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const $addExpense = useAddExpense(res => {
    if (res) {
      if (res?.status == 0) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        navigation.navigate('Expenses');
      }
      toast.show(res?.message, { placement: 'top' });
    }
  });

  const $editExpense = useEditExpense(res => {
    if (res) {
      if (res?.status == 0) {
        client.invalidateQueries(['expense-details']);
        client.invalidateQueries(['expenses-history']);
        navigation.navigate('Expenses');
      }
      toast.show(res?.message, { placement: 'top' });
    }
  });

  if (isLoading || $loading) {
    return <Loading />;
  }

  const categoriesData = $categories?.data?.data;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <View style={{ height: '100%', paddingBottom: 14 }}>
          <ScrollView style={styles.main}>
            <Picker
              placeholder="Select Expense Category"
              searchPlaceholder="Search Expense Category"
              showSearch
              showError={showError && !state.category}
              value={state.category?.id || state.catergory?.value}
              setValue={item => {
                handleTextChange({
                  type: 'category',
                  payload: { id: item?.value },
                });
              }}>
              {categoriesData?.map(item => {
                if (item?.expense_category_id) {
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
            <Input
              placeholder="Enter Amount Spent"
              showError={showError && state.paid.length === 0}
              val={state.paid}
              setVal={text =>
                handleTextChange({
                  type: 'paid',
                  payload: text,
                })
              }
              keyboardType="numeric"
            />
            <View style={{ height: 14 }} />
            <View>
              <Text
                style={[
                  {
                    marginLeft: 4,
                    marginBottom: 4,
                    color: '#888',
                    fontFamily: 'IBMPlexSans-Regular',
                  },
                ]}>
                Select Expense Date
              </Text>
              <DateTimePicker
                title={''}
                placeholder={'Expense Date'}
                mode={'date'}
                migrate
                value={state.date}
                onChange={val => {
                  dispatch({
                    type: 'date',
                    payload: val,
                  });
                }}
                dateFormat="DD MMM YYYY"
                renderInput={props => {
                  return (
                    <View
                      style={{
                        borderBottomColor:
                          showError && !state.date
                            ? '#EB455F'
                            : 'rgba(183, 196, 207,0.8)',
                        borderBottomWidth: 1.2,
                        paddingVertical: 8,
                        width: '100%',
                        marginBottom: 4,
                        paddingLeft: 6,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'IBMPlexSans-Regular',
                          color: '#30475e',
                          fontSize: 14.2,
                          letterSpacing: 0.4,
                          marginBottom: -6,
                        }}>
                        {props.value}
                      </Text>
                      <DateIcon
                        height={28}
                        width={28}
                        style={{ marginLeft: 'auto' }}
                      />
                    </View>
                  );
                }}
              />
            </View>
            <View style={{ height: 14 }} />
            <Input
              placeholder="Enter what the expense was for"
              showError={showError && state.name.length === 0}
              val={state.name}
              setVal={text =>
                handleTextChange({
                  type: 'name',
                  payload: text,
                })
              }
            />
          </ScrollView>
        </View>
      </ScrollView>
      {data?.data?.status != 0 ? (
        <View style={styles.btnWrapper}>
          <PrimaryButton
            style={styles.btn}
            handlePress={() => {
              if (
                state.name.length === 0 ||
                state.paid.length === 0 ||
                !state.category ||
                !state.date
              ) {
                setShowError(true);
                toast.show('Please provide all required details.', {
                  placement: 'top',
                  type: 'danger',
                });
                return;
              }
              const payload = {
                name: state.name,
                category: state.category?.id,
                mod_by: user?.login,
                merchant: user?.merchant,
                total_amount: state.paid,
                amount_paid: state.paid,
                occurance: 'NONE',
                notify_device: Platform.OS,
                notify_source: 'Digistore Business',
                date: moment(state.date).format('DD-MM-YYYY'),
                // occurance_date: '',
              };
              $addExpense.mutate(payload);
            }}>
            {$addExpense.isLoading ? 'Loading' : 'Record Expense'}
          </PrimaryButton>
        </View>
      ) : (
        <View
          style={[
            styles.btnWrapper,
            {
              flexDirection: 'row',
              paddingHorizontal: 12,
              justifyContent: 'center',
              width: '100%',
            },
          ]}>
          <PrimaryButton
            style={[styles.btn, { width: '46%' }]}
            handlePress={() => {
              if (
                state.name.length === 0 ||
                state.amount.length === 0 ||
                state.paid.length === 0 ||
                !state.category ||
                !state.occurance ||
                !state.date
              ) {
                setShowError(true);
                toast.show('Please provide all required details.', {
                  placement: 'top',
                  type: 'danger',
                });
                return;
              }
              const payload = {
                name: state.name,
                expense_id: expenseDetails?.expense_id,
                category: state.category?.id || state.category?.value,
                mod_by: user?.login,
                merchant: user?.merchant,
                total_amount: state.paid,
                amount_paid: state.paid,
                occurance: state.occurance?.value || state.occurance,
                notify_device: Platform.OS,
                notify_source: 'Digistore Business',
                date: moment(state.date).format('DD-MM-YYYY'),
              };
              $editExpense.mutate(payload);
            }}>
            {$editExpense.isLoading ? 'Loading' : 'Save Expense'}
          </PrimaryButton>
          <View style={{ marginHorizontal: 5 }} />
          <PrimaryButton
            style={[styles.btn, { width: '46%', backgroundColor: '#EE4E4E' }]}
            handlePress={() => {
              $deleteExpense.mutate({
                id: expenseDetails?.expense_id,
              });
            }}>
            {$deleteExpense.isLoading ? 'Loading' : 'Delete Expense'}
          </PrimaryButton>
        </View>
      )}
    </View>
  );
};

export default CreateExpense;
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
  customerText: {
    fontFamily: 'ReadexPro-Regular',
    color: '#30475e',
    fontSize: 15,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  customer: {
    // backgroundColor: '#F8F9FE',
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    borderColor: '#E8EEFC',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 14,
  },
});
