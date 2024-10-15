import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InventoryHeader from '../components/InventoryHeader';

import DrawerNavigation from './DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Login from '../containers/Login';
import SignupSuccess from '../containers/SignupSuccess';
import VerifyOnboardingOtp from '../containers/VerifyOnboardingOtp';
import SignupOtp from '../containers/SignupOtp';
import NewUserPhone from '../containers/NewUserPhone';
import OperatorLockScreen from '../containers/OperatorLockScreen';
import ChangePass from '../containers/ChangePass';
import ResetPass from '../containers/ResetPass';
import Password from '../containers/Password';
import SetPin from '../containers/SetPin';
import Signup from '../containers/Signup';
import GetStarted from '../containers/GetStarted';
import Logout from '../containers/Logout';
import OutletLogin from '../containers/OutletLogin';
import LoginAuthorization from '../containers/LoginAuthorization';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const { setCurrentUser, setAuth, setFirstLaunch } = useActionCreator();
  const { auth, firstLaunch } = useSelector(state => state.auth);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  React.useEffect(() => {
    (async () => {
      await messaging().subscribeToTopic('announcement');
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('user');
      const user_ = await AsyncStorage.getItem('user');

      if ((JSON.parse(user_) && JSON.parse(user_).sid) || auth) {
        const parsedUser = JSON.parse(user_);
        setCurrentUser({
          ...parsedUser,
          merchant: parsedUser.user_merchant_id,
          outlet: parsedUser.user_merchant_group_id,
        });
        setAuth(true);
      } else {
        setAuth(false);
      }
    })();
  }, [auth, setAuth, setCurrentUser]);

  React.useEffect(() => {
    (async () => {
      const launchStatus = await AsyncStorage.getItem('launchStatus');
      console.log('laaaaa', launchStatus);
      if (!launchStatus) {
        setFirstLaunch(true);
        await AsyncStorage.setItem('launchStatus', 'Launched');
      } else {
        setFirstLaunch(false);
      }
    })();
  }, [setFirstLaunch]);

  if (auth === null) {
    return <></>;
  }
  return (
    <Stack.Navigator>
      {auth === false && !firstLaunch && (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              header: () => null,
            }}
          />
          <Stack.Screen
            name="Signup Success"
            component={SignupSuccess}
            options={{
              header: () => null,
            }}
          />
          <Stack.Screen
            name="Login OTP"
            component={LoginAuthorization}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="VerifyOnboardingOtp"
            component={VerifyOnboardingOtp}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Signup Otp"
            component={SignupOtp}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="NewUserPhone"
            component={NewUserPhone}
            options={{ header: () => null }}
          />

          <Stack.Screen
            name="LockScreen"
            component={OperatorLockScreen}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 10 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="ChangePass"
            component={ChangePass}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Reset Pass"
            component={ResetPass}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Password"
            component={Password}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Set Pin"
            component={SetPin}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              header: ({ navigation }) => (
                <InventoryHeader
                  navigation={navigation}
                  addCustomer={false}
                  mainHeader={{ paddingVertical: 36 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Outlets Login"
            component={OutletLogin}
            options={{
              header: props => (
                <InventoryHeader
                  // prevScreen={props.back.title}
                  navigation={props.navigation}
                  addCustomer={false}
                  mainHeader={{
                    justifyContent: 'center',
                  }}
                  title="Select Outlet"
                />
              ),
            }}
          />
        </>
      )}
      {firstLaunch && auth === false && (
        <Stack.Screen
          name="Get Started"
          component={GetStarted}
          options={{
            header: () => null,
          }}
        />
      )}
      {auth && (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DrawerNavigation}
            options={{
              header: props => null,
            }}
          />

          <Stack.Screen
            name="Logout"
            component={Logout}
            options={{
              header: () => null,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
