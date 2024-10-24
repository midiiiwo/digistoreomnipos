/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import Image from 'react-native-fast-image';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import GetStarted from '../../assets/icons/getstarted.svg';
import { SheetManager } from 'react-native-actions-sheet';
import Logout from '../../assets/icons/logout.svg';
import { Pressable } from 'react-native';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import PercentageCircle from 'react-native-percentage-circle';
import { uniqBy } from 'lodash';
import { useTodoList } from '../hooks/useGetTodoList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
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
  const { user } = useSelector(state => state.auth);
  const { data: todoList } = useTodoList(user.merchant);

  let { data: activationStep } = useGetCurrentActivationStep(user.merchant);

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

  const percentCompleted = (numCompleted / list.length) * 100;
  // const { subscribables } = useSelector(state => state.merchant);

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
  const imageUrl = user.user_merchant_logo;

  const isAdmin = user.user_merchant_group === 'Administrators';
  return (
    <View style={{ flex: 1 }}>
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
              uri: imageUrl,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              //
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={[styles.name]}>
                {user.user_merchant}
                {'  '}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}></View>
          </View>

          <Text
            style={[
              styles.merchant_name,
              {
                fontSize: 14,
                fontFamily: 'ReadexPro-Regular',
                color: 'rgba(225,225,225, 0.6)',
              },
            ]}>
            {user.name}
          </Text>
        </LinearGradient>

        {isAdmin === 'Administrators' && (
          <Pressable
            onPress={() => {
              props.navigation.closeDrawer();
              SheetManager.show('todoList');
            }}
            style={{
              flexDirection: 'row',
              paddingLeft: 14,
              marginVertical: 2,
              alignItems: 'center',
            }}>
            <GetStarted height={22} width={22} stroke="#9DB2BF" />
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
        )}
        <DrawerItemList {...props} />

        <DrawerItem
          labelStyle={styles.label}
          style={{
            paddingVertical: -10,
            marginVertical: 0,
            marginTop: 'auto',
            marginBottom: 12,
            marginLeft: 23,
          }}
          label="Logout"
          icon={({ color }) => (
            <Logout height={24} width={24} stroke="#526D82" />
          )}
          inactiveBackgroundColor="#fff"
          activeBackgroundColor="#3C79F5"
          activeTintColor="#fff"
          inactiveTintColor="#526D82"
          onPress={async () => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Logout');
          }}
        />

        <View
          style={{
            paddingLeft: 14,
            justifyContent: 'center',
            marginBottom: 14,
            alignItems: 'center',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                styles.label,
                {
                  marginLeft: 12,
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                  color: '#aaa',
                },
              ]}>
              V{DeviceInfo.getVersion()} - Build: {DeviceInfo.getBuildNumber()}
            </Text>
          </View>
        </View>

        {/* <Pressable
          onPress={() => {
            props.navigation.closeDrawer();
            Linking.openURL('https://pos.digistoreafrica.com');
          }}
          style={{
            paddingLeft: 4,

            paddingVertical: 14,
            backgroundColor: 'rgba(25, 66, 216, 0.9)',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    marginLeft: 12,
                    color: '#fff',
                    fontSize: 18,
                    fontFamily: 'SFProDisplay-Medium',
                  },
                ]}>
                Use Digistore on a PC
              </Text>
              <View style={{ marginVertical: 2 }} />
              <Text
                style={[
                  styles.label,
                  { marginLeft: 12, color: '#fff', fontSize: 14 },
                ]}>
                Go to pos.digistoreafrica.com
              </Text>
            </View>
            <CaretRight
              height={26}
              width={26}
              fill="#fff"
              marginLeft={-5}
              style={{ transform: [{ rotate: '-90deg' }], marginLeft: 'auto' }}
            />
          </View>
        </Pressable> */}
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
  img: { height: 65, width: 65, borderRadius: 60 },
  name: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: '#fff',
    // marginTop: 12,
  },
  merchant_name: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#fff',
    // marginTop: 3,
    // flexShrink: 10,
  },
  label: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 12,
    marginLeft: -12,
    color: '#526D82',
    fontWeight: '100',
    opacity: 0.9,
    // backgroundColor: 'orange',
  },
});
