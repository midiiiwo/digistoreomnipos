import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import CaretRight from '../../../assets/icons/cart-right.svg';
import { useNavigation } from '@react-navigation/native';

import { useMutation, useQueryClient } from 'react-query';
import { deleteExpenseCategory } from '../../api/expenses';
import { useToast } from 'react-native-toast-notifications';

export function useDeleteExpenseCategory(handleSuccess) {
  const queryResult = useMutation(
    ['delete-expense-category'],
    payload => {
      try {
        return deleteExpenseCategory(payload?.id);
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

function ExpenseCategoryActions(props) {
  const { category, categories } = props.payload;
  const toast = useToast();
  const client = useQueryClient();
  const navigation = useNavigation();
  const { mutate } = useDeleteExpenseCategory(res => {
    if (res?.status == 0) {
      client.invalidateQueries('expense-categories');
      client.invalidateQueries('expense-categories-lov');
      SheetManager.hide('ExpenseCategoryAction');
    }
    toast.show(res.message, { placement: 'top' });
  });

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>{category?.name}</Text>
        </View>

        <Pressable
          style={styles.channelType}
          onPress={() => {
            navigation.navigate('Create Expense Category', {
              category,
              categories,
              type: 'Edit',
              id: category?.id,
            });
            SheetManager.hide('ExpenseCategoryAction');
          }}>
          <Text style={styles.channelText}>Edit {category?.name}</Text>
          <CaretRight style={styles.caret} />
        </Pressable>

        <Pressable
          style={styles.channelType}
          onPress={() => {
            Alert.alert(
              'Delete Expense Category',
              'Are you sure you want to expense category?',
              [
                {
                  text: 'NO',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'DELETE CATEGORY',
                  onPress: () => {
                    mutate({
                      id: category?.id,
                    });
                  },
                },
              ],
            );
          }}>
          <Text style={styles.channelText}>Delete {category?.name}</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  // indicatorStyle: {
  //   display: 'none',
  // },
  caret: {
    marginLeft: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  img: {
    height: 24,
    width: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  done: {
    fontFamily: 'ReadexPro-Medium',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.8,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  channelType: {
    // alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  channelText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475E',
    letterSpacing: 0.2,
  },
});

export default ExpenseCategoryActions;
