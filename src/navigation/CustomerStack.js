import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';
import Header from '../components/Header';
import EditCustomer from '../containers/EditCustomer';
import CustomerDetails from '../containers/CustomerDetails';
import AddCustomer from '../containers/AddCustomer';
import Customers from '../containers/Customers';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';
import ReceiptHeader from '../components/ReceiptHeader';

const Stack = createNativeStackNavigator();

const CustomerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customers"
        component={Customers}
        options={{
          header: props => (
            <Header navigation={props.navigation} backgroundColor="#fafafa" />
          ),
        }}
      />
      <Stack.Screen
        name="Edit Customer"
        component={EditCustomer}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Edit Customer"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Customer Details"
        component={CustomerDetails}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              // rightComponentText="Edit Customer"
              // rightComponentFunction={() =>
              //   props.navigation.navigate('Edit Customer')
              // }
              // title="Edit Category"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Add Customer"
        component={AddCustomer}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Add Customer"
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

export default CustomerStack;
