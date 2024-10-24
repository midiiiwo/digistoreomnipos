/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';

import CaretRight from '../../assets/icons/cart-right.svg';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { getExpenseCategories } from '../api/expenses';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetExpenseCategoriesLov } from './ExpenseCategoryLov';
import { useToast } from 'react-native-toast-notifications';

export function useGetExpenseCategories(merchant) {
  const queryResult = useQuery(['expense-categories', merchant], () =>
    getExpenseCategories(merchant),
  );
  return queryResult;
}

export const CATEGORIES = [
  // { name: 'Fuel', id: 1000 },
  // { name: 'Loan Payments', id: 2000 },
  // { name: 'Airtime & Data', id: 3000 },
  // { name: 'Utilities', id: 4000 },
  // { name: 'Transport', id: 5000 },
  // { name: 'Marketing', id: 6000 },
  // { name: 'Salaries', id: 7000 },
];

function ExpensesCategories() {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, isRefetching, refetch } = useGetExpenseCategoriesLov(
    user?.merchant,
  );
  console.log('dddddd', data);
  const { bottom } = useSafeAreaInsets();
  const toast = useToast();

  if (isLoading) {
    return <Loading />;
  }

  const categories = (data?.data?.data || []).map(cat => ({
    name: cat?.expense_category,
    id: cat?.expense_category_id,
    isDefault: cat?.expense_category_is_default == 1,
    isSystem: cat?.expense_category_is_system == 1,
  }));

  return (
    <View style={styles.main}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        contentContainerStyle={{
          paddingBottom: bottom + Dimensions.get('window').height * 0.15,
          paddingTop: 14,
        }}>
        {categories
          ?.filter(item => item?.id)
          ?.filter(item => !item.isSystem)
          ?.filter(item => !item.isDefault)?.length > 0 && (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'ReadexPro-bold',
              color: '#5A639C',
              marginLeft: 16,
              marginBottom: 5,
            }}>
            Your Categories
          </Text>
        )}
        {categories
          ?.filter(item => !item.isSystem)
          ?.filter(item => !item.isDefault)
          ?.map(item => {
            if (item?.id) {
              return (
                <Pressable
                  style={styles.channelType}
                  onPress={() => {
                    const isPredefined = CATEGORIES?.find(
                      i => i?.id === item?.id,
                    );
                    if (isPredefined) {
                      navigation.navigate('Create Expense', {
                        category: item,
                        categories: CATEGORIES,
                      });
                      return;
                    }
                    SheetManager.show('ExpenseCategoryAction', {
                      payload: {
                        category: item,
                        categories: [...CATEGORIES, ...categories],
                        predefined: CATEGORIES,
                      },
                    });
                  }}>
                  <Text style={styles.channelText}>{item?.name}</Text>
                  <CaretRight style={styles.caret} height={16} width={16} />
                </Pressable>
              );
            }
          })}
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'ReadexPro-bold',
            color: '#5A639C',
            marginLeft: 16,
            marginBottom: 5,
            marginTop: 16,
          }}>
          Suggested Categories
        </Text>
        {categories
          ?.filter(item => !item.isSystem)
          ?.filter(item => item.isDefault)
          .map(item => {
            if (item?.id) {
              return (
                <Pressable
                  style={styles.channelType}
                  onPress={() => {
                    if (item?.isDefault) {
                      toast.show('You cannot edit suggested categories', {
                        placement: 'top',
                      });
                      return;
                    }
                    SheetManager.show('ExpenseCategoryAction', {
                      payload: {
                        category: item,
                        categories: [...CATEGORIES, ...categories],
                        predefined: CATEGORIES,
                      },
                    });
                  }}>
                  <Text style={styles.channelText}>{item?.name}</Text>
                  <CaretRight style={styles.caret} height={16} width={16} />
                </Pressable>
              );
            }
          })}
      </ScrollView>

      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Create Expense Category');
          }}>
          Create New Category
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },

  caret: {
    marginLeft: 'auto',
  },
  channelType: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 15.5,
    color: '#30475e',
    flex: 1,
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
});

export default ExpensesCategories;
