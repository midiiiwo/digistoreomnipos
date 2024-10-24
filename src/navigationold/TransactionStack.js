import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';

import Inflows from '../containers/Inflows';
import SaleHistoryScreen from '../containers/SalesHistory';
import InvoiceHistory from '../containers/InvoiceHistory';
import ReceivedPaymentReceipt from '../containers/ReceivedPaymentReceipts';
import Header from '../components/Header';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';
import SendMoneyHistory from '../containers/SendMoneyHistory';
import SendMoneyReceipt from '../containers/SendMoneyReceipt';

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inflows"
        component={Inflows}
        options={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Sales History"
        component={SaleHistoryScreen}
        options={{
          header: props => (
            <InventoryHeader
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Sales History"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Invoice History"
        component={InvoiceHistory}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Invoice"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Send Money History"
        component={SendMoneyHistory}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Send Money"
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
              title="Send Money Receipt"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Received Payment Receipt"
        component={ReceivedPaymentReceipt}
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

export default TransactionStack;
