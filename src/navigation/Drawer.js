/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { Linking, StyleSheet, Text, View } from 'react-native';
import Image from 'react-native-fast-image';
import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import Settings from '../../assets/icons/drawersettings.svg';
import Order from '../../assets/icons/drawerorder.svg';
import Analytics_ from '../../assets/icons/draweranalytics.svg';
import Money from '../../assets/icons/drawerpaypoint.svg'
import Alert from '../../assets/icons/notifications-icon.svg';
import Checkout from '../../assets/icons/drawercheck.svg';
import Products_ from '../../assets/icons/drawerproduct.svg';
import Transactions from '../../assets/icons/drawertransactions.svg';
import CustomersIcon from '../../assets/icons/user.svg';
import SendMoneyIcon from '../../assets/icons/send.svg';
// import QuickSaleIcon from '../../assets/icons/flash.svg';
// import Transactions from '../../assets/icons/trans.svg';
import Logout from '../../assets/icons/drawerlogout.svg';
import Support from '../../assets/icons/drawerhelp.svg';
import GetStarted from '../../assets/icons/getstarted.svg';
import UsersSingle from '../../assets/icons/draweruser.svg';
import Shop from '../../assets/icons/shop.svg';
// import Checkout from '../../assets/icons/checkout.svg'
import Caret from '../../assets/icons/cart-right.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import CaretRight from '../../assets/icons/caret-down';
import { Pressable } from 'react-native';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import PercentageCircle from 'react-native-percentage-circle';
import { uniqBy } from 'lodash';
import { useTodoList } from '../hooks/useGetTodoList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnlineStore from '../../assets/icons/drawerweb';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { useToast } from 'react-native-toast-notifications';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const todoDescOptions = {
  setup_first_sale: 'Perform First Sale and avoid losing sales books',
  setup_outlet: null,
  setup_product: 'Create products, categories and manage inventory',
  setup_shortcode: null,
  setup_store: null,
  setup_delivery: null,
  setup_domain: null,
  setup_first_customer: 'Record customer details and track purchase trends',
  setup_print_receipt: 'Customize your receipt. Add business logo etc.',
};

const Drawer = props => {
  const { user, outlet } = useSelector(state => state.auth);
  const { data: todoList } = useTodoList(user.merchant);

  let { data: activationStep } = useGetCurrentActivationStep(user.merchant);
  const { data: details } = useGetMerchantDetails(user.merchant);
  const toast = useToast();
  const [activeItem, setActiveItem] = React.useState('Checkout');

  let list = [];
  const step =
    activationStep &&
    activationStep.data &&
    activationStep.data.data &&
    activationStep.data.data.account_setup_step;
  for (const [k, v] of Object.entries(
    (todoList && todoList.data && todoList.data.data) || {},
  )) {
    if (!todoDescOptions[k]) {
      continue;
    }
    // if (v === 'COMPLETED') {
    //   continue;
    // }
    list.push({
      code: k,
      instruction: todoDescOptions[k],
      status: v,
    });
  }

  if (step != 8) {
    list.unshift({
      code: 'activation',
      instruction: 'Complete Account Activation to receive and make payments',
      status: 'NEW',
    });
  }
  if (step == 8) {
    list.unshift({
      code: 'activation',
      instruction: 'Complete Account Activation to receive and make payments',
      status: 'COMPLETED',
    });
  }

  list = uniqBy(list, 'code');

  const numCompleted = list.reduce((acc, curr) => {
    if (curr.status === 'COMPLETED') {
      return acc + 1;
    }
    return acc;
  }, 0);

  const percentCompleted = (numCompleted / (list && list.length) || 1) * 100;
  // const { subscribables } = useSelector(state => state.merchant);

  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  switch (step) {
    case '0':
      activationStep = 'Account Activation Pending';
      break;
    case '1' || '5':
      activationStep = 'Account Activation Pending';
      break;
    case '2' || '6':
      activationStep = 'Account Activation Pending';
      break;
    case '3':
      activationStep = 'Account Activation Pending';
      break;
    case '7':
      activationStep = 'Account Activation Pending';
      break;
    case '4':
      activationStep = 'Account Activation Pending';
      break;
    case '8':
      activationStep = 'Account is Live';
      break;
    default:
      activationStep = 'Account Activation Pending';
      break;
  }

  // const merchantDetails = details && details.data && details.data.data;
  const cacheBust = new Date().toString();

  const merchantDetails = details && details.data && details.data.data;
  const imgUrl =
    ((merchantDetails?.merchant_brand_logo?.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
      merchantDetails.merchant_brand_logo) ||
      user.user_merchant_logo) +
    '?' +
    cacheBust;

  const isAdmin = user.user_merchant_group === 'Administrators';
  return (
    <View style={{ flex: 1, }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.main, { paddingBottom: bottom }]}>
        <LinearGradient
          colors={['#0061C1', '#21438F']}
          start={{ x: 0.8, y: 0.8 }}
          end={{ x: 0.1, y: 0.1 }}
          locations={[0, 0.6]}
          style={[styles.top, { paddingTop: top + 12 }]}>
          {/* {' '}
        style={styles.top}> */}
          <Image
            style={[styles.img, { borderWidth: 1.6, borderColor: '#fff' }]}
            source={{
              uri: imgUrl,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              //
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('Account');
              }}
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={[styles.name, { fontSize: 20 }]}>
                {user.user_merchant}
              </Text>
            </Pressable>


          </View>

          <Text
            style={[
              styles.merchant_name,
              {
                fontSize: 13,
                fontFamily: 'ReadexPro-Regular',
                color: 'rgba(225,225,225, 0.6)',
              },
            ]}>
            {user.name}
          </Text>

        </LinearGradient>

        {/* {isAdmin && (
          <Pressable
            onPress={() => {
              props.navigation.closeDrawer();
              SheetManager.show('todoList');
            }}
            style={{
              flexDirection: 'row',
              paddingLeft: 19,
              marginVertical: 2,
              alignItems: 'center',
            }}>
            <GetStarted height={18} width={18}  />
            <Text style={[styles.label, { marginLeft: 21 }]}>Get Started</Text>
            <View style={{ marginLeft: 'auto', marginRight: 10 }}>
              <PercentageCircle
                radius={21}
                percent={Math.trunc(percentCompleted)}
                color="#57A55A"
                borderWidth={2.6}
                textStyle={{ fontFamily: 'Inter-Medium' }}
              />
            </View>
          </Pressable>
        )} */}

        {/* {isAdmin && (
          <DrawerItem
            labelStyle={styles.label}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
            }}
            label="Users"
            icon={({ color }) => (
              <Users_ height={18} width={18}  />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"
            onPress={() => {
              props.navigation.navigate('Manage Users');
            }}
          />
        )} */}
        {/* {isAdmin && (
          <DrawerItem
            labelStyle={styles.label}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
            }}
            label="Outlets"
            icon={({ color }) => (
              <Store_ height={18} width={18}  />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"
            onPress={() => {
              props.navigation.navigate('Manage Outlets');
            }}
          />
        )} */}
        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Checkout' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Checkout' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: 10, // Adjust the padding
            marginVertical: -1.5, // You can keep this
            backgroundColor: activeItem === 'Checkout' ? '#3C79F5' : '#fff',
            borderRadius: 15
          }}
          label="Checkout"
          icon={({ color }) => (
            <Checkout height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            setActiveItem('Checkout');
            props.navigation.navigate('Inventory');
          }}
        />


        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Orders' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Orders' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
            backgroundColor: activeItem === 'Orders' ? '#3C79F5' : '#fff',
          }}
          label="Orders"
          icon={({ color }) => (
            <Order height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            setActiveItem('Orders');
            props.navigation.navigate('Tabs', { screen: 'Orders' })
          }}
        />

        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Products' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Products' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
            backgroundColor: activeItem === 'Products' ? '#3C79F5' : '#fff',
          }}
          label="Products"
          icon={({ color }) => (
            <Products_ height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            setActiveItem('Products');
            navigation.navigate('lol')
          }}
        />
        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Paypoint' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Paypoint' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
            backgroundColor: activeItem === 'Paypoint' ? '#3C79F5' : '#fff',
          }}
          label="Paypoint"
          icon={({ color }) => (
            <Money height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            setActiveItem('Paypoint');
            navigation.navigate('Paypoint')
          }}
        />

        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Transactions' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Transactions' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
            backgroundColor: activeItem === 'Transactions' ? '#3C79F5' : '#fff',
          }}
          label="Transactions"
          icon={({ color }) => (
            <Transactions height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('TRANHISTMGT')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }
            if (!user.user_permissions.includes('TRANHISTMGT')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            setActiveItem('Transactions');
            navigation.navigate('Transaction Type');
          }}
        />
        {isAdmin && (
          <DrawerItem
            labelStyle={[
              styles.label, // Keep your existing label styles
              {
                color: activeItem === 'Online Store' ? '#fff' : '#000', // Text color based on active state
                fontWeight: activeItem === 'Online Store' ? 'bold' : 'normal', // Bold text if active
              },
            ]}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
              backgroundColor: activeItem === 'Online Store' ? '#3C79F5' : '#fff',
            }}
            label="Online Store"
            icon={({ color }) => (
              <OnlineStore height={30} width={30} />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"
            onPress={() => {
              if (step != '8') {
                toast.show(
                  'You must complete account activation before you can setup online store.',
                  { placement: 'top' },
                );
                return;
              }
              if (!user.user_permissions.includes('MGSHOP')) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Upgrade needed',
                  textBody:
                    "You don't have access to this feature. Please upgrade your account",
                });
                return;
              }
              setActiveItem('Online Store');

              props.navigation.navigate('Manage Store');
            }}
          />
        )}
        {isAdmin && (
          <DrawerItem
            labelStyle={[
              styles.label, // Keep your existing label styles
              {
                color: activeItem === 'Users' ? '#fff' : '#000', // Text color based on active state
                fontWeight: activeItem === 'Users' ? 'bold' : 'normal', // Bold text if active
              },
            ]}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
              backgroundColor: activeItem === 'Users' ? '#3C79F5' : '#fff',

            }}
            label="Users"
            icon={({ color }) => (
              <UsersSingle height={30} width={30} />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"

            onPress={() => {
              setActiveItem('Users');
              props.navigation.navigate('Manage Users')
            }}
          />
        )}
        {/* <DrawerItem
          labelStyle={styles.label}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
          }}
          label="Book Delivery"
          icon={({ color }) => (
            <Delivery height={18} width={18}  />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            props.navigation.navigate('Manage Deliveries');
          }}
        /> */}
        {isAdmin && (
          <DrawerItem
            labelStyle={[
              styles.label, // Keep your existing label styles
              {
                color: activeItem === 'Insight' ? '#fff' : '#000', // Text color based on active state
                fontWeight: activeItem === 'Insight' ? 'bold' : 'normal', // Bold text if active
              },
            ]}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
              backgroundColor: activeItem === 'Insight' ? '#3C79F5' : '#fff',
            }}
            label="Insight"
            icon={({ color }) => (
              <Analytics_ height={30} width={30} />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"
            onPress={() => {
              setActiveItem('Insight');
              props.navigation.navigate('Tabs', { screen: 'Insights' })
            }}
          />)}
        {isAdmin && (
          <DrawerItem
            labelStyle={[
              styles.label, // Keep your existing label styles
              {
                color: activeItem === 'Settings' ? '#fff' : '#000', // Text color based on active state
                fontWeight: activeItem === 'Settings' ? 'bold' : 'normal', // Bold text if active
              },
            ]}
            style={{
              paddingVertical: -10,
              marginVertical: -1.5,
              backgroundColor: activeItem === 'Settings' ? '#3C79F5' : '#fff',
            }}
            label="Settings"
            icon={({ color }) => (
              <Settings height={30} width={30} />
            )}
            inactiveBackgroundColor="#fff"
            activeBackgroundColor="#3C79F5"
            activeTintColor="#fff"
            inactiveTintColor="#4C4C4C"
            onPress={() => {
              props.navigation.closeDrawer();
              setActiveItem('Settings');
              props.navigation.navigate('Settings');
            }}
          />
        )}
        <DrawerItem
          labelStyle={[
            styles.label, // Keep your existing label styles
            {
              color: activeItem === 'Help' ? '#fff' : '#000', // Text color based on active state
              fontWeight: activeItem === 'Help' ? 'bold' : 'normal', // Bold text if active
            },
          ]}
          style={{
            paddingVertical: -10,
            marginVertical: -1.5,
          }}
          label="Help"
          icon={({ color }) => (
            <Support height={30} width={30} />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#4C4C4C"
          onPress={() => {
            props.navigation.closeDrawer();
            SheetManager.show('support');
          }}
        />


        <Pressable
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Logout');
          }}
          style={{
            paddingLeft: 14,
            justifyContent: 'center',
            marginTop: 'auto',
            marginBottom: 14,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Logout height={30} width={30} />
            <Text style={[styles.label, { marginLeft: 12 }]}>
              Logout
            </Text>
          </View>
        </Pressable>
      </DrawerContentScrollView>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  main: { paddingTop: 0, flex: 1 },
  top: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 10,
    paddingBottom: 8,
  },
  img: { height: 55, width: 55, borderRadius: 60 },
  name: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#fff',
    // marginTop: 12,
  },
  merchant_name: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 14,
    color: '#fff',
    // marginTop: 3,
    // flexShrink: 10,
  },
  label: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13.8,
    marginLeft: -12,
    color: '#30475e',
    opacity: 0.9,
    letterSpacing: -0.2,

    // backgroundColor: 'orange',
  },
});

