import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OrderScreen from '../containers/Orders';
import CustomerScreen from '../containers/Customers';
import SettingScreen from '../containers/Analytics';

import HomeIcon from '../../assets/icons/home.svg';
import OrderIcon from '../../assets/icons/order-icon.svg';
import CustomersIcon from '../../assets/icons/user.svg';
import AnalyticsIcon from '../../assets/icons/analytics.svg';
import Header from '../components/Header';
import Home from '../containers/Home';
import OrdersHeader from '../components/OrdersHeader';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import AnalyticsHeader from '../components/AnalyticsHeader';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const insets = useSafeAreaInsets();
  const { user } = useSelector(state => state.auth);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2F66F6',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          height: 92 + insets.bottom,
          borderTopWidth: 0.4,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: 'SFProDisplay-Regular',
          // marginBottom: 16,
        },
        tabBarIconStyle: {
          // marginTop: 18,
          // marginBottom: 7,
        },
        tabBarShowLabel: false,
        header: ({ navigation }) => <Header navigation={navigation} />,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => {
            return <HomeIcon stroke={color} height={45} width={45} />;
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        listeners={{
          tabPress: e => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('ORDERMGT')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              e.preventDefault();
              return;
            }
            if (!user.user_permissions.includes('ORDERMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              e.preventDefault();
              return;
            }
          },
        }}
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color }) => {
            return <OrderIcon stroke={color} height={43} width={43} />;
          },
          header: () => <OrdersHeader />,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomerScreen}
        listeners={{
          tabPress: e => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('CUSTMGT')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              e.preventDefault();
              return;
            }
            if (!user.user_permissions.includes('CUSTMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              e.preventDefault();
            }
          },
        }}
        options={{
          tabBarIcon: ({ color }) => {
            return <CustomersIcon stroke={color} height={45} width={45} />;
          },
          header: () => null,
        }}
      />
      {/* <Tab.Screen
        name="Alerts"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color }) => {
            return <NotificationsIcon stroke={color} height={45} width={34} />;
          },
        }}
      /> */}
      <Tab.Screen
        name="Insights"
        component={SettingScreen}
        listeners={{
          tabPress: e => {
            const a = 1;
            // if (a) {
            //   Toast.show({
            //     type: ALERT_TYPE.WARNING,
            //     title: 'Feature Coming Soon',
            //     textBody: 'This feature will be available soon',
            //   });
            //   e.preventDefault();
            //   return;
            // }
          },
        }}
        options={{
          tabBarIcon: ({ color }) => {
            return <AnalyticsIcon stroke={color} height={45} width={45} />;
          },
          header: () => <AnalyticsHeader />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
