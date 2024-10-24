import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RightDrawer from './Drawer';

import Analytics from '../containers/Analytics';
import Order from '../../assets/icons/order-icon.svg';
import Analytics_ from '../../assets/icons/analytics.svg';
import Alert from '../../assets/icons/notifications-icon.svg';
import Checkout from '../../assets/icons/checkout.svg';
import Products_ from '../../assets/icons/products.svg';
import Transactions from '../../assets/icons/transactions.svg';
import CustomersIcon from '../../assets/icons/user.svg';
import SendMoneyIcon from '../../assets/icons/send.svg';
// import QuickSaleIcon from '../../assets/icons/flash.svg';
import Header from '../components/Header';
import OrderStack from '../navigationold/OrderStackNavigator';
import ProductStack from '../navigationold/ProductStackNavigator';
import TransactionStack from '../navigationold/TransactionStack';
import CustomerStack from '../navigationold/CustomerStack';
import CheckoutStack from '../navigationold/CheckoutStack';
// import QuickSaleNavigator from './QuickSaleNavigator';
import NotificationStack from '../navigationold/NotificationStack';
import SendMoneyStack from '../navigationold/SendMoneyStack';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const { user } = useSelector(state => state.auth);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        swipeEnabled: false,
        drawerLabelStyle: {
          marginLeft: -10,
          fontFamily: 'ReadexPro-Medium',
          fontSize: 12,
        },
        drawerInactiveTintColor: '#526D82',
        drawerActiveBackgroundColor: '#3F70F4',
        drawerActiveTintColor: '#fff',
        drawerItemStyle: {
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: -10,
          height: Dimensions.get('window').height * 0.065,
        },
      }}
      drawerContent={props => <RightDrawer {...props} />}>
      <Drawer.Screen
        name="Checkout"
        component={CheckoutStack}
        options={{
          drawerIcon: ({ color }) => (
            <Checkout stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />
      {/* <Drawer.Screen
        name="Quick Sale"
        component={QuickSaleNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <QuickSaleIcon stroke={color} height={28} width={28} />
          ),
          header: () => null,
        }}
      /> */}
      <Drawer.Screen
        name="Orders"
        component={OrderStack}
        options={{
          drawerIcon: ({ color }) => (
            <Order stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />

      <Drawer.Screen
        name="Products"
        component={ProductStack}
        options={{
          drawerIcon: ({ color }) => (
            <Products_ stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />
      {/* {user.user_merchant_group === 'Administrators' &&
        user.user_permissions.includes('TRANMGT') &&
        user.user_permissions.includes('MKPAYMT') &&
        user.user_permissions.includes('MMMGT') && (
          <Drawer.Screen
            name="Send Money"
            component={SendMoneyStack}
            options={{
              drawerIcon: ({ color }) => (
                <SendMoneyIcon stroke={color} height={24} width={24} />
              ),
              header: () => null,
            }}
          />
        )} */}
      <Drawer.Screen
        name="Transactions"
        component={TransactionStack}
        options={{
          drawerIcon: ({ color }) => (
            <Transactions stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          drawerIcon: ({ color }) => (
            <Alert stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />
      <Drawer.Screen
        name="Customers"
        component={CustomerStack}
        options={{
          drawerIcon: ({ color }) => (
            <CustomersIcon stroke={color} height={24} width={24} />
          ),
          header: () => null,
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={Analytics}
        options={{
          drawerIcon: ({ color }) => (
            <Analytics_ stroke={color} height={24} width={24} />
          ),
          header: ({ navigation }) => (
            <Header navigation={navigation} backgroundColor="#fff" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
