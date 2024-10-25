import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import OrderScreen from '../containers/Orders';
import CustomerScreen from '../containers/Customers';
import SettingScreen from '../containers/Analytics';
import Home from '../containers/Home';

import Header from '../components/Header';
import OrdersHeader from '../components/OrdersHeader';
import AnalyticsHeader from '../components/AnalyticsHeader';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={{
        header: ({ navigation }) => <Header navigation={navigation} />, // Keep your custom header
        tabBarStyle: { display: 'none' }, // Hide the tab bar
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        listeners={{
          tabPress: e => {
            if (user && user.user_merchant_agent == '6' && !user.user_permissions.includes('ORDERMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody: 'Service not available on your account. Please contact Ecobank support',
              });
              e.preventDefault();
            } else if (!user.user_permissions.includes('ORDERMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody: "You don't have access to this feature. Please upgrade your account",
              });
              e.preventDefault();
            }
          },
        }}
        options={{ header: () => <OrdersHeader /> }} // Custom header for Orders
      />
      <Tab.Screen
        name="Customers"
        component={CustomerScreen}
        listeners={{
          tabPress: e => {
            if (user && user.user_merchant_agent == '6' && !user.user_permissions.includes('CUSTMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody: 'Service not available on your account. Please contact Ecobank support',
              });
              e.preventDefault();
            } else if (!user.user_permissions.includes('CUSTMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody: "You don't have access to this feature. Please upgrade your account",
              });
              e.preventDefault();
            }
          },
        }}
      />
      {user && user.user_merchant_group === 'Administrators' && (
        <Tab.Screen
          name="Insights"
          component={SettingScreen}
          options={{ header: () => <AnalyticsHeader /> }} // Custom header for Insights
        />
      )}
    </Tab.Navigator>
  );
};

export default Tabs;
