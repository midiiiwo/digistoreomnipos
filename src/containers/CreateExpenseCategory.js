/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import {
  addExpenseCategory,
  editExpenseCategory,
  getExpenseDetails,
} from '../api/expenses';
import Loading from '../components/Loading';

function useGetExpenseCategoryDetails(id) {
  const queryResult = useQuery(['expense-category-details', id], () =>
    getExpenseDetails(id),
  );
  return queryResult;
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'update-all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function useAddExpenseCategory(handleSuccess) {
  const queryResult = useMutation(
    ['add-expense-category'],
    payload => {
      try {
        return addExpenseCategory(payload);
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

function useEditExpenseCategory(handleSuccess) {
  const queryResult = useMutation(
    ['edit-expense-category'],
    payload => {
      try {
        return editExpenseCategory(payload);
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

const CreateExpenseCategory = ({ route }) => {
  const { user } = useSelector(state => state.auth);
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    description: '',
  });

  const id = route?.params?.id;
  const toast = useToast();
  const client = useQueryClient();

  const addCategory = useAddExpenseCategory(i => {
    if (i?.status == 0) {
      client.invalidateQueries('expense-categories');
      client.invalidateQueries('expense-categories-lov');
      navigation.goBack();
    }
    toast.show(i.message, { placement: 'top' });
  });

  const editCategory = useEditExpenseCategory(i => {
    if (i?.status == 0) {
      client.invalidateQueries('expense-categories');
      client.invalidateQueries('expense-categories-lov');
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

  const { data, isLoading } = useGetExpenseCategoryDetails(id);
  const details = data?.data?.data;
  React.useEffect(() => {
    if (details) {
      dispatch({
        type: 'update-all',
        payload: {
          name: details?.expense_category,
          description: details?.expense_category_description,
        },
      });
    }
  }, [details]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter category name"
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
            placeholder="Enter description (optional)"
            val={state.description}
            nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'description',
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
            if (state.name.length === 0) {
              setShowError(true);
              toast.show('Please provide  required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            const payload = {
              name: state.name,
              desc: state.description,
              merchant: user?.merchant,
              mod_by: user?.login,
            };
            if (details && data?.data?.status == 0) {
              payload.id = id;
              editCategory.mutate(payload);
              return;
            }
            addCategory.mutate(payload);
          }}>
          {addCategory.isLoading || editCategory.isLoading
            ? 'Loading'
            : 'Save category'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default CreateExpenseCategory;
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
