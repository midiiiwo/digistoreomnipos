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
      initialRouteName="Home"
      screenOptions={{
        header: () => null,
        swipeEnabled: false,
        drawerStyle: {
          width: Dimensions.get('window').width * 0.7,
        },
      }}
      drawerContent={props => <RightDrawer {...props} />}>
      <Drawer.Screen name="HomeDrawer" component={HomeStackNavigator} />
    </Drawer.Navigator>
  );
}
