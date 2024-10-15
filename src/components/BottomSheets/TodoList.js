/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  InteractionManager,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager, useScrollHandlers } from 'react-native-actions-sheet';

import Timer from '../../../assets/icons/timer.svg';
import Verified from '../../../assets/icons/verified.svg';
import Warning from '../../../assets/icons/Warning.svg';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetMerchantOutlets } from '../../hooks/useGetMerchantOutlets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTodoList } from '../../hooks/useGetTodoList';
import { useGetCurrentActivationStep } from '../../hooks/useGetCurrentActivationStep';
import { uniqBy } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../PrimaryButton';

const TodoItem = ({ item }) => {
  const navigation = useNavigation();
  console.log('iteeee', item);
  const { code } = item;
  return (
    <Pressable
      onPress={() => {
        if (item.status === 'COMPLETED') {
          return;
        }
        switch (code) {
          case 'activation':
            navigation.navigate('Activation Type');
            break;
          case 'setup_first_sale':
            navigation.navigate('Quick Sale');
            break;
          case 'setup_product':
            navigation.navigate('Add Product');
            break;
          case 'setup_first_customer':
            navigation.navigate('Add Customer');
            break;
          case 'setup_print_receipt':
            navigation.navigate('Receipt Details');
            break;
          case 'setup_store':
            navigation.navigate('Manage Store');
            break;
          default:
            break;
        }
        SheetManager.hide('todoList');
      }}
      style={{
        backgroundColor: 'rgba(207, 253, 225, 0.09)',
        padding: 12,
        // paddingVertical: 8,
        marginTop: 5,
        borderRadius: 6,
        // flexDirection: 'row',
        borderColor: '#ddd',
        borderWidth: 0.5,
        width: '48%',
        marginHorizontal: '1%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150,
        maxHeight: 150,
        // alignSelf: 'flex-start',
        // marginRight: 'auto',
      }}>
      {item.status === 'COMPLETED' ? (
        <Verified height={25} width={25} />
      ) : (
        <Timer height={25} width={25} />
      )}
      <Text
        numberOfLines={4}
        style={{
          color: '#2D2D2E',
          fontFamily: 'SFProDisplay-Medium',
          fontSize: 14,
          width: '90%',
          textAlign: 'center',
          marginTop: 12,
        }}>
        {item.instruction}
      </Text>
    </Pressable>
  );
};

const todoDescOptions = {
  setup_first_sale: 'Record your first Sale and avoid losing sales books.',
  setup_outlet: null,
  setup_product: 'Create products, categories and manage inventory.',
  setup_shortcode: null,
  setup_store: 'Create a website & start selling online in 5mins',
  setup_delivery: null,
  setup_domain: null,
  setup_first_customer: 'Record customer details and track purchase trends.',
  setup_print_receipt: 'Customize your receipts. Add business logo etc.',
};
function TodoList(props) {
  const { user } = useSelector(state => state.auth);
  const {
    data: todoList,
    refetch: refetchTodoList,
    isFetching: isTodoListFetching,
  } = useTodoList(user.merchant);

  const { data: activationStep } = useGetCurrentActivationStep(user.merchant);
  let list = [];
  const actionSheetRef = React.useRef(null);
  const next = React.useRef();
  const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);

  const step =
    activationStep &&
    activationStep.data &&
    activationStep.data.data &&
    activationStep.data.data.account_setup_step;
  let counter = 0;
  for (const [k, v] of Object.entries(
    (todoList && todoList.data && todoList.data.data) || {},
  )) {
    if (!todoDescOptions[k]) {
      continue;
    }
    // if (v === 'COMPLETED') {
    //   continue;
    // }
    if (counter === 2) {
      if (step != 8) {
        list.push({
          code: 'activation',
          instruction:
            'Complete Account Activation to receive and make payments',
          status: 'NEW',
        });
      }
      if (step == 8) {
        list.unshift({
          code: 'activation',
          instruction:
            'Complete payment account activation to Receive and Make payments',
          status: 'COMPLETED',
        });
      }
    }
    list.push({
      code: k,
      instruction: todoDescOptions[k],
      status: v,
    });
    counter++;
  }

  list = uniqBy(list, 'code');
  // console.log(todoList);
  // const processedList = [];
  // for (let [k, v] of Object.entries(todoList)) {
  //   const key = k
  //     .split('_')
  //     .map(str => str.charAt(0).toUpperCase() + str.slice(1))
  //     .join(' ');
  //   processedList.push({ key, value: v });
  // }

  // console.log('processed', processedList);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      onClose={() => {
        InteractionManager.runAfterInteractions(() => {
          if (next.current) {
            SheetManager.show('support');
            next.current = false;
          }
        });
      }}
      defaultOverlayOpacity={0.3}>
      <ScrollView {...scrollHandlers}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.mainText}>
              Welcome {user.user_merchant}, let's help you get started
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              // backgroundColor: 'red',
              paddingTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                // backgroundColor: 'orange',
                width: '90%',
                paddingHorizontal: 8,
                paddingBottom: 82,
              }}>
              {list.map(i => {
                return <TodoItem item={i} key={i.code} />;
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.btnWrapper, { backgroundColor: '#fff' }]}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            SheetManager.hide('todoList');
            // SheetManager.show('support');
            next.current = true;
          }}>
          Need Help?
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

PrimaryButton;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    // paddingBottom: 12,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 15,
    color: '#30475E',
    letterSpacing: -0.1,
    width: '70%',
    textAlign: 'center',
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
  channelText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30465e',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14,
    color: '#687980',
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default TodoList;
