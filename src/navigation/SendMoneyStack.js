import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SendMoney from '../containers/SendMoney';
import SendMoneyDetails from '../containers/SendMoneyDetails';
import SendMoneyStatus from '../containers/SendMoneyStatus';
import OrderDetails from '../containers/OrderDetails';
import InventoryHeader from '../components/InventoryHeader';
import OrderReceipt from '../containers/OrderReceipt';
import SendMoneyReceipt from '../containers/SendMoneyReceipt';
import BillReceiptHeader from '../components/BillReceiptHeader';
import Header from '../components/Header';

const Stack = createNativeStackNavigator();

const SendMoneyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Send"
        component={SendMoney}
        options={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Send Money"
        component={SendMoneyDetails}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              // title="Order Details"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Send Money Status"
        component={SendMoneyStatus}
        options={{
          header: props => (
            <BillReceiptHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{ backgroundColor: '#F9F9F9' }}
              handleNavigation={() => props.navigation.navigate('Send')}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Send Money Receipt"
        component={SendMoneyReceipt}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Receipt"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Order Details"
        component={OrderDetails}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              // title="Order Details"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Order Receipt"
        component={OrderReceipt}
        options={{
          header: props => (
            <InventoryHeader
              addCustomer={false}
              // prevScreen={props.back.title}
              mainHeader={{ backgroundColor: '#fff' }}
              navigation={props.navigation}
              title="Order Receipt"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default SendMoneyStack;
