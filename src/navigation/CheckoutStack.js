import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';
import Inventory from '../containers/Inventory';
import HeaderInventory from '../components/HeaderInventory';
import CustomerSelect from '../containers/CustomerSelect';
import DiscountQr from '../containers/DiscountQr';
import Discount from '../containers/Discount';
import DeliveryLocation from '../containers/DeliveryLocation';
import PaymentOptions from '../containers/PaymentOptions';
import Receipt from '../containers/Receipt';
import ReceiptHeader from '../components/ReceiptHeader';
import InventoryQuickSale from '../containers/InventoryQuickSale';
import OutletList from '../containers/OutletList';
import CartBarcode from '../containers/CartBarcode';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';
import AddCustomer from '../containers/AddCustomer';
import InvoicePay from '../containers/InvoicePay';

const Stack = createNativeStackNavigator();

const CheckoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Inventory}
        options={{
          header: props => (
            <HeaderInventory
              navigation={props.navigation}
              backgroundColor="#F1F5F9"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Inventory Quick Sale"
        component={InventoryQuickSale}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Add Non-Inventory Item"
            />
          ),
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
        name="Cart Barcode"
        component={CartBarcode}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Scan barcode"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Outlets"
        component={OutletList}
        options={{
          header: props => (
            <InventoryHeader
              addCustomer={false}
              // prevScreen={props.back.title}
              mainHeader={{ backgroundColor: '#fff' }}
              navigation={props.navigation}
              title="Select Outlet"
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
              navigateTo="Dashboard"
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
      <Stack.Screen
        name="Invoice Pay"
        component={InvoicePay}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Send Invoice"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default CheckoutStack;
