import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';

import Header from '../components/Header';
import QuickCharge from '../containers/QuickCharge';
import CustomerSelect from '../containers/CustomerSelect';
import DiscountQr from '../containers/DiscountQr';
import Discount from '../containers/Discount';
import DeliveryLocation from '../containers/DeliveryLocation';
import PaymentOptions from '../containers/PaymentOptions';
import Receipt from '../containers/Receipt';
import ReceiptHeader from '../components/ReceiptHeader';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';

const Stack = createNativeStackNavigator();

const QuickSaleNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Quick Sale"
        component={QuickCharge}
        options={{
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Customer Select"
        component={CustomerSelect}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Discount Qr"
        component={DiscountQr}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Scan voucher"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Add Discount"
        component={Discount}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Add Discount"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Delivery Location"
        component={DeliveryLocation}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{ backgroundColor: '#fff' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentOptions}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              mainHeader={{ backgroundColor: '#F1F6F9' }}
              navigation={props.navigation}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Receipts"
        component={Receipt}
        options={{
          header: props => (
            <ReceiptHeader
              navigation={props.navigation}
              navigateTo="Quick Sale"
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

export default QuickSaleNavigator;
