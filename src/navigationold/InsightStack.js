import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Analytics from '../containers/Analytics';
import AnalyticsHeader from '../components/AnalyticsHeader';
import OrderDetails from '../containers/OrderDetails';
import InventoryHeader from '../components/InventoryHeader';
import OrderReceipt from '../containers/OrderReceipt';

const Stack = createNativeStackNavigator();

const InsightStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Insights"
        component={Analytics}
        options={{
          header: () => <AnalyticsHeader />,
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

export default InsightStack;
