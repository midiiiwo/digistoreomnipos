import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import RightDrawer from './Drawer';

// import Settings from '../containers/Settings';
import HomeStackNavigator from './HomeStackNavigator';
import { Dimensions } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      iinitialRouteName="Home"
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
      <Drawer.Screen name="Home" component={HomeStackNavigator} options={{ header: () => null, }} />
    </Drawer.Navigator>
  );
}
