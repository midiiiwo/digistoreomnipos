import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrdersScreen from '../containers/Orders';
import AnalyticsHeader from '../components/AnalyticsHeader';
import OrderDetails from '../containers/OrderDetails';
import InventoryHeader from '../components/InventoryHeader';
import OrderReceipt from '../containers/OrderReceipt';
import ReceiptHeader from '../components/ReceiptHeader';
import Notification from '../containers/Notification';
import Header from '../components/Header';
import OrderHeader from '../components/OrderHeader';

const Stack = createNativeStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          header: ({ navigation }) => (
            <OrderHeader navigation={navigation} backgroundColor="#f9f9f9" />
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

export default NotificationStack;
