import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OutletList from '../containers/OutletList';
import AnalyticsHeader from '../components/AnalyticsHeader';
import OrderDetails from '../containers/OrderDetails';
import InventoryHeader from '../components/InventoryHeader';
import OrderReceipt from '../containers/OrderReceipt';
import ReceiptHeader from '../components/ReceiptHeader';

const Stack = createNativeStackNavigator();

const OutletStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Outlets"
        component={OutletList}
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
            <ReceiptHeader
              navigation={props.navigation}
              text="Orders"
              navigateTo="Orders"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default OutletStack;
