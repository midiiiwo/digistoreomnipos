import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';
import ViewProductDetails from '../containers/ViewProductDetails';
import ReceiptHeader from '../components/ReceiptHeader';
import Header from '../components/Header';
import Products from '../containers/Products';
import AddProduct from '../containers/AddProduct';
import EditProduct from '../containers/EditProduct';
import InventoryProductOptions from '../containers/InventoryProductOptions';
import BarcodeScanner from '../containers/BarcodeScanner';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';
import PHeader from '../components/PHeader';
import AddCategory from '../containers/AddCategory';
import EditCategory from '../containers/EditCategory';

const Stack = createNativeStackNavigator();

const ProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          header: ({ navigation }) => (
            <PHeader navigation={navigation} backgroundColor="#fff" />
          ),
        }}
      />
      <Stack.Screen
        name="Add Product"
        component={AddProduct}
        options={{
          header: props => (
            <InventoryHeader
              // prevScreen={props.back.title}
              navigation={props.navigation}
              addCustomer={false}
              mainHeader={{
                justifyContent: 'center',
              }}
              title="Add product"
              // title="Order Details"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Edit Product"
        component={EditProduct}
        options={{
          header: props => (
            <InventoryHeader
              navigation={props.navigation}
              text="Edit Product"
              navigateTo="Edit Product"
              title="Edit Product"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Add Category"
        component={AddCategory}
        options={{
          header: props => (
            <InventoryHeader
              navigation={props.navigation}
              text="Add Category"
              navigateTo="Add Category"
              title="Add Category"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Edit Category"
        component={EditCategory}
        options={{
          header: props => (
            <InventoryHeader
              navigation={props.navigation}
              text="Edit Category"
              navigateTo="Edit Category"
              title="Edit Category"
            />
          ),
        }}
      />
      <Stack.Screen
        name="Product Details"
        component={ViewProductDetails}
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
        name="Product Options"
        component={InventoryProductOptions}
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
        name="Barcode"
        component={BarcodeScanner}
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

export default ProductStack;
