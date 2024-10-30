/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { decode } from 'he';

import { SheetManager } from 'react-native-actions-sheet';

import AccountInfoBanner from '../components/AccountInfoBanner';
// import FrameIcon from '../../assets/icons/frame.svg';
import StatsCard from '../components/StatsCard';
import ServiceButton from '../components/ServiceButton';

import PaymentsIcon from '../../assets/icons/empty-wallet.svg';
import SalesIcon from '../../assets/icons/tag.svg';
import ExpensesIcon from '../../assets/icons/money-send.svg';
import HistoryIcon from '../../assets/icons/rotate-left.svg';
import ProductsIcon from '../../assets/icons/shopping-bag.svg';
import MoreIcon from '../../assets/icons/settings-bold.svg';

import { useActionCreator } from '../hooks/useActionCreator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
// import { useSalesInsights } from '../hooks/useSalesInsights';
import { useSelector } from 'react-redux';
// import moment from 'moment';
import { useGetSummaryFilter } from '../hooks/useGetSummaryFilter';
import moment from 'moment';
import CaretOutline from '../../assets/icons/caret-outline.svg';
import { useQuery } from 'react-query';
import { Platform } from 'react-native';
// import SoundPlayer from 'react-native-sound-player';
// import { useGetTransactionDetails } from '../hooks/useGetTransactionDetails';
import NotificationModal from '../components/Modals/NotificationModal';
import { showLocalNotification } from '../utils/pushNotification';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Spinner from 'react-native-spinkit';
import { Dimensions } from 'react-native';
import BlogItem from '../components/BlogItem';
import { useTodoList } from '../hooks/useGetTodoList';
import CaretRight from '../../assets/icons/cart-right';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BlogSkeleton from '../components/BlogSkeleton';
import { uniqBy } from 'lodash';
import ActivationDialog from '../components/ActivationDialog';
import { PERMISSIONS, request } from 'react-native-permissions';
// import { formatNumberTwoSig } from '../utils/shared';

// import { Alert } from 'react-native';

const mapDisplayToSummary = {
  GROSS_SALES: 'Gross Sales',
  VOLUME_SALES: 'No. of Orders',
  EXPENSES: 'Expenses',
  GROSS_PROFIT: 'Gross Profit',
  NET_PROFIT: 'Net Profit',
  DIRECT_COST: 'Direct Cost',
};

const backgroundColors = [
  'rgba(44, 116, 179, 0.07)',
  'rgba(44, 116, 179, 0.07)',
  'rgba(44, 116, 179, 0.07)',
  'rgba(44, 116, 179, 0.07)',
  'rgba(44, 116, 179, 0.07)',
];

const todoDescOptions = {
  setup_first_sale: 'Record your first Sale and avoid losing sales books.',
  setup_outlet: null,
  setup_product: 'Create products, categories and manage inventory.',
  setup_shortcode: null,
  setup_store: 'Create a website & start selling online in 5mins',
  setup_delivery: null,
  setup_domain: null,
  setup_first_customer: 'Record customer details and track purchase trends.',
  setup_print_receipt: 'Customize your receipts. Add business logo etc.',
};

export const TodoItem = ({ item }) => {
  const navigation = useNavigation();
  const { code } = item;
  return (
    <Pressable
      onPress={() => {
        switch (code) {
          case 'activation':
            navigation.navigate('Activation Type');
            break;
          case 'setup_first_sale':
            navigation.navigate('Inventory');
            break;
          case 'setup_product':
            navigation.navigate('Add Product');
            break;
          default:
            break;
        }
      }}
      style={{
        backgroundColor: 'rgba(44, 116, 179, 0.04)',
        padding: 12,
        paddingVertical: 8,
        marginTop: 5,
        borderRadius: 5,
        flexDirection: 'row',
        borderColor: '#ddd',
        borderWidth: 0.5,
      }}>
      <Text
        style={{
          color: '#30475e',
          fontFamily: 'Lato-Medium',
          fontSize: 16,
        }}>
        {item.instruction}
      </Text>
      <CaretRight style={{ marginLeft: 'auto' }} />
    </Pressable>
  );
};

const titleColors = ['#2C74B3', '#2C74B3', '#2C74B3', '#2C74B3', '#2C74B3'];

let list = [];

const Home = () => {
  const {
    setCurrentUser,
    setCurrentOutlet,
    setSummaryStartDate,
    setSummaryEndDate,
    setPrevSummaryStartDate,
    setPrevSummaryEndDate,
    setNotification,
    // setNotificationPriority,
    setNotificationSound,
    setInventoryOutlet,

    // setDateRange,
  } = useActionCreator();
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [toggleModal, setToggleModal] = React.useState(false);
  const [id, setId] = React.useState();
  const checkListener = React.useRef(true);
  const loggedIn = React.useRef(true);
  const [dialog, setDialog] = React.useState(false);
  // const [insightSummary, setInsightSummary] = React.useState({});
  // const [prevInsightSummary, setPrevInsightSummary] = React.useState({});
  // const copilot = useTourGuideController();
  const scrollRef = React.useRef();
  // const [showFTE, setShowFTE] = React.useState(false);
  const targets = React.useRef({});

  const messageListener = React.useRef();

  const dupNotif = React.useRef();

  let step = React.useRef();

  const {
    summaryStartDate,
    summaryEndDate,
    summaryPrevStartDate,
    summaryPrevEndDate,
    range,
  } = useSelector(state => state.merchant);

  // const titles = [
  //   'Account Balance & Store Name',
  //   'Summary',
  //   'Payment',
  //   'Sales',
  //   'Expenses',
  //   'Transaction History',
  //   'Manage Inventory',
  //   'More services',
  //   'Blogs',
  // ];

  // const messages = [
  //   'Information about Store name and account balance. Shows only store name and outlet for Ecobank accounts.',
  //   'Know how you business is doing at a glance.',
  //   'Send money, buy internet and pay bills.',
  //   'Sell from inventory and receive quick payments.',
  //   'Feature coming soon.✨',
  //   'View history of all transactions and invoices.',
  //   'View and manage your inventory.',
  //   'This feature will be available soon.✨',
  //   'Get all the latest blogs from Digistore',
  // ];

  const {
    data: blogData,
    refetch: blogRefetch,
    isLoading: blogLoading,
    isFetching: blogFetching,
  } = useQuery(['blog-posts'], () =>
    axios.get('https://business.digistoreafrica.com/wp-json/wp/v2/posts'),
  );

  const { data: activationStep } = useGetCurrentActivationStep(user.merchant);
  const { notificationSound, notificationPriority } = useSelector(
    state => state.merchant,
  );

  const {
    data: todoList,
    refetch: refetchTodoList,
    isFetching: isTodoListFetching,
    isLoading: isTodoLoading,
  } = useTodoList(user.merchant);

  const step_ =
    activationStep &&
    activationStep.data &&
    activationStep.data.data &&
    activationStep.data.data.account_setup_step;

  React.useEffect(() => {
    if (loggedIn.current) {
      list = [];
      step.current =
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
        if (v === 'COMPLETED') {
          continue;
        }
        list.push({
          code: k,
          instruction: todoDescOptions[k],
          status: v,
        });
      }

      if (step && step.current && step.current != 8) {
        list.unshift({
          code: 'activation',
          instruction: 'Complete Account Activation',
          status: 'NEW',
        });
      }

      list = uniqBy(list, 'code');
    }
    return () => (list = []);
  }, [activationStep, todoList]);

  React.useEffect(() => {
    if (
      loggedIn.current &&
      list.length > 0 &&
      !isTodoLoading &&
      user.user_merchant_group === 'Administrators'
    ) {
      SheetManager.show('todoList');
      loggedIn.current = false;
      list = [];
    }
  }, [isTodoLoading, user]);

  const addTarget = (ref, id) => {
    if (ref && !targets.current[id]) {
      targets.current[id] = ref;
    }
  };

  React.useEffect(() => {
    (async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // let token;
        // try {
        //   token = await AsyncStorage.getItem('fcmToken');
        //   if (!token) {
        //     token = await messaging().getToken();
        //     if (token) {
        //       await AsyncStorage.setItem('fcmToken', token);
        //     }
        //   }
        // } catch (err) {
        // }

        if (checkListener.current) {
          const fcm = user.user_unique_device_ids;
          for (let f in fcm) {
            const fcmData = fcm[f];

            messaging()
              .subscribeToTopic(fcmData)
              .then(() => {
                console.log(`subscribed to topic: ${fcmData}`);
              });
          }

          await messaging().subscribeToTopic('thomasdavisiostest1234567891234');
          await messaging().subscribeToTopic('announcement');
          if (checkListener.current) {
            await messaging().subscribeToTopic('global');

            if (Platform.OS === 'ios') {
              await messaging().subscribeToTopic('iosusers');
            } else {
              await messaging().subscribeToTopic('androidusers');
            }
          }
        }
        checkListener.current = false;
      }

      try {
        let granted;
        if (Platform.OS === 'android') {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'App Camera Permission',
              message: 'App needs access to your camera',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
        } else if (Platform.OS === 'ios') {
          granted = await request(PERMISSIONS.IOS.CAMERA);
          console.log('ggagagaggag', granted);
        }
      } catch (error) {}

      // await messaging().registerDeviceForRemoteMessages();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      const soundStatus = await AsyncStorage.getItem('useSound');
      if (soundStatus === null) {
        await AsyncStorage.setItem('useSound', 'YES');
        setNotificationSound(true);
      } else if (soundStatus) {
        if (soundStatus === 'YES') {
          setNotificationSound(true);
        } else if (soundStatus === 'NO') {
          setNotificationSound(false);
        }
      }
    })();
  }, [setNotificationSound]);

  const {
    data: summaryData,
    isLoading,
    refetch: refetchSummary,
  } = useGetSummaryFilter(
    user.merchant,
    user.login,
    moment(summaryStartDate).format('DD-MM-YYYY'),
    moment(summaryEndDate).format('DD-MM-YYYY'),
    user.user_merchant_group === 'Administrators',
  );

  const { data: summaryPrevData, refetch: refetchPrevData } =
    useGetSummaryFilter(
      user.merchant,
      user.login,
      moment(summaryPrevStartDate).format('DD-MM-YYYY'),
      moment(summaryPrevEndDate).format('DD-MM-YYYY'),
      user.user_merchant_group === 'Administrators',
    );

  React.useEffect(() => {
    refetchSummary();
    refetchPrevData();
  }, [
    summaryStartDate,
    summaryEndDate,
    summaryPrevEndDate,
    summaryPrevStartDate,
    refetchSummary,
    refetchPrevData,
  ]);

  // const { mutate, isLoading: isInsightsLoading } = useSalesInsights(res => {
  //   setInsightSummary(res?.sales_summary);
  // });

  let summary_ = [];
  const summaryDataItems = summaryData?.data?.summary;
  const summaryOrdered = {
    GROSS_SALES: summaryDataItems?.GROSS_SALES,
    VOLUME_SALES: summaryDataItems?.VOLUME_SALES,
    GROSS_PROFIT: summaryDataItems?.GROSS_PROFIT,
    EXPENSES: summaryDataItems?.EXPENSES,
    NET_PROFIT: summaryDataItems?.NET_PROFIT,
    ...summaryDataItems,
  };
  const summaryDirectCost =
    Math.abs(Number(summaryOrdered?.REFUNDED_SALES?.replaceAll(',', '') || 0)) +
    Math.abs(Number(summaryOrdered?.DISCOUNTS?.replaceAll(',', '') || 0)) +
    Math.abs(
      Number(summaryOrdered?.TRANSACTION_FEES?.replaceAll(',', '') || 0),
    ) +
    Math.abs(Number(summaryOrdered?.SHIPPING_FEES?.replaceAll(',', '') || 0)) +
    Math.abs(Number(summaryOrdered?.SMS_COST?.replaceAll(',', '') || 0)) +
    Math.abs(Number(summaryOrdered?.SALES_TAX?.replaceAll(',', '') || 0)) +
    Math.abs(Number(summaryOrdered?.COST_OF_GOODS?.replaceAll(',', '') || 0));
  for (let i in (summaryData?.data?.status == 0 && summaryOrdered) || {}) {
    summary_.push({ value: summaryData?.data?.summary[i], displayName: i });
  }
  if (summary_) {
    summary_ = [
      ...summary_?.slice(0, 2),
      {
        displayName: 'DIRECT_COST',
        value: new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(summaryDirectCost),
      },
      ...summary_?.slice(2),
    ];
  }

  // console.log(user);pm

  let prevSummary_ = [];
  const $summaryDataItems = summaryPrevData?.data?.summary;
  const $summaryOrdered = {
    GROSS_SALES: $summaryDataItems?.GROSS_SALES,
    VOLUME_SALES: $summaryDataItems?.VOLUME_SALES,
    GROSS_PROFIT: $summaryDataItems?.GROSS_PROFIT,
    EXPENSES: $summaryDataItems?.EXPENSES,
    NET_PROFIT: $summaryDataItems?.NET_PROFIT,
    ...$summaryDataItems,
  };

  const $summaryDirectCost =
    Math.abs(
      Number($summaryOrdered?.REFUNDED_SALES?.replaceAll(',', '') || 0),
    ) +
    Math.abs(Number($summaryOrdered?.DISCOUNTS?.replaceAll(',', '') || 0)) +
    Math.abs(
      Number($summaryOrdered?.TRANSACTION_FEES?.replaceAll(',', '') || 0),
    ) +
    Math.abs(Number($summaryOrdered?.SHIPPING_FEES?.replaceAll(',', '') || 0)) +
    Math.abs(Number($summaryOrdered?.SMS_COST?.replaceAll(',', '') || 0)) +
    Math.abs(Number($summaryOrdered?.SALES_TAX?.replaceAll(',', '') || 0)) +
    Math.abs(Number($summaryOrdered?.COST_OF_GOODS?.replaceAll(',', '') || 0));
  for (let i in (summaryPrevData?.data?.status == 0 && $summaryOrdered) || {}) {
    prevSummary_.push({
      value: summaryPrevData.data.summary[i],
      displayName: i,
    });
  }

  if (prevSummary_?.length > 0) {
    prevSummary_ = [
      ...prevSummary_?.slice(0, 2),
      {
        displayName: 'DIRECT_COST',
        value: new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format($summaryDirectCost),
      },
      ...prevSummary_?.slice(2),
    ];
  }

  // step == 3 || step == 7 || step == 8; settlement

  const onRefresh = () => {
    refetchOutlet();
    refetchSummary();
    refetchPrevData();
    refetchTodoList();
    blogRefetch();
  };

  React.useEffect(() => {
    if (messageListener.current) {
      messageListener.current();
    }
    messageListener.current = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage?.notification && !remoteMessage?.collapseKey) {
        return;
      }

      console.log('=====', remoteMessage);

      const { body, title } = remoteMessage?.notification || {
        body: '',
        title: '',
      };
      const cachedNotifications = await AsyncStorage.getItem(
        user.merchant + 'notifications',
      );
      if (!cachedNotifications) {
        const initNotification = [
          {
            title,
            body,
            time: remoteMessage.sentTime,
            id:
              (body.startsWith('New Order Received') ? 'order' : 'payment') +
              body.split('#')[1],
            status: 'NEW',
            merchant: user.merchant,
          },
        ];
        await AsyncStorage.setItem(
          user.merchant + 'notifications',
          JSON.stringify(initNotification),
        );
      } else {
        const notifs = JSON.parse(cachedNotifications || '{}');
        notifs.unshift({
          title,
          body,
          time: remoteMessage.sentTime,
          id:
            (body.startsWith('New Order Received') ? 'order' : 'payment') +
            body.split('#')[1],
          status: 'NEW',
          merchant: user.merchant,
        });
        await AsyncStorage.setItem(
          user.merchant + 'notifications',
          JSON.stringify(notifs),
        );
      }
      setNotification(body);
      // if (device === 'android') {
      // showLocalNotification(
      //   {
      //     title:
      //       remoteMessage &&
      //       remoteMessage.notification &&
      //       remoteMessage.notification.title,
      //     body,
      //   },
      //   remoteMessage.messageId,
      // );
      // } else if (device === 'ios') {
      //   PushNotificationIOS.addNotificationRequest({
      //     id: remoteMessage.messageId,
      //     title:
      //       remoteMessage &&
      //       remoteMessage.notification &&
      //       remoteMessage.notification.android,
      //     body,
      //     isCritical: true,
      //   });
      // }

      if (body.startsWith('New Order Received')) {
        console.log('remotemotetmotemteomteomte');
        // PushNotificationIOS.addNotificationRequest({
        //   id: remoteMessage.messageId,
        //   title:
        //     remoteMessage &&
        //     remoteMessage.notification &&
        //     remoteMessage.notification.title,
        //   body,
        //   sound: 'danish_bicycle_bell.wav',
        // });

        if (dupNotif.current === remoteMessage.messageId) {
          return;
        }
        dupNotif.current = remoteMessage.messageId;
        console.log('wwwwww', remoteMessage);
        showLocalNotification(
          {
            title:
              remoteMessage &&
              remoteMessage.notification &&
              remoteMessage.notification.title,
            body,
            id: remoteMessage.messageId,
          },
          remoteMessage.messageId,
          notificationSound,
          notificationPriority,
        );
        const id_ = body.split('#')[1];

        if (id_) {
          AsyncStorage.setItem('notificationid', String(id_));
          navigation.navigate('Order Details', { id: id_ });
        }
      } else if (body.startsWith('New Payment Received')) {
        showLocalNotification(
          {
            title:
              remoteMessage &&
              remoteMessage.notification &&
              remoteMessage.notification.title,
            body,
          },
          remoteMessage.messageId,
          notificationSound,
          notificationPriority,
        );
        const id_ = body.split('#')[1];
        if (id_) {
          setId(id_);
          setToggleModal(true);
          // this.PaymentNotification(String(id[1]));
        }
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      // check for the id in the title
      // var title = remoteMessage.notification.title;

      if (
        remoteMessage &&
        !remoteMessage.notification &&
        !remoteMessage.collapseKey
      ) {
        return;
      }
      // console.log(
      //   'got messssssssssssssssssnnnnnnnnnnnewwwwwwwwww---->',
      //   remoteMessage,
      // );

      const { body, title } = (remoteMessage && remoteMessage.notification) || {
        body: '',
        title: '',
      };
      const cachedNotifications = await AsyncStorage.getItem(
        user.merchant + 'notifications',
      );
      if (!cachedNotifications) {
        const initNotification = [
          {
            title,
            body,
            time: (remoteMessage && remoteMessage.sentTime) || '',
            id:
              (body.startsWith('New Order Received') ? 'order' : 'payment') +
              body.split('#')[1],
            status: 'NEW',
            merchant: user.merchant,
          },
        ];
        await AsyncStorage.setItem(
          user.merchant + 'notifications',
          JSON.stringify(initNotification),
        );
      } else {
        const notifs = JSON.parse(cachedNotifications || '{}');
        notifs.unshift({
          title,
          body,
          time: (remoteMessage && remoteMessage.sentTime) || '',
          id:
            (body.startsWith('New Order Received') ? 'order' : 'payment') +
            body.split('#')[1],
          status: 'NEW',
          merchant: user.merchant,
        });
        await AsyncStorage.setItem(
          user.merchant + 'notifications',
          JSON.stringify(notifs),
        );
      }
      // setNotification(body);
      if (body.startsWith('New Order Received')) {
        const id_ = body.split('#')[1];
        if (id_) {
          // showLocalNotification(
          //   {
          //     title: remoteMessage.notification.title,
          //     body,
          //   },
          //   remoteMessage.messageId,
          // );
          navigation.navigate('Order Details', { id: id_ });
        }
      } else if (body.startsWith('New Payment Received')) {
        // showLocalNotification(
        //   {
        //     title: remoteMessage.notification.title,
        //     body,
        //   },
        //   remoteMessage.messageId,
        // );
        //console.log("----", 2);
        const id_ = body.split('#')[1];
        if (id_) {
          setToggleModal(true);
          setId(id_);
          setToggleModal(true);
          // this.PaymentNotification(String(id[1]));
        }
      }
    });
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        // check for the id in the title
        // var title = remoteMessage.notification.title;
        if (
          remoteMessage &&
          !remoteMessage.notification &&
          !remoteMessage.collapseKey
        ) {
          return {};
        }

        if (!remoteMessage) {
          return {};
        }

        const { body, title } = (remoteMessage &&
          remoteMessage.notification) || {
          body: '',
          title: '',
        };
        const cachedNotifications = await AsyncStorage.getItem(
          user.merchant + 'notifications',
        );
        if (!cachedNotifications) {
          const initNotification = [
            {
              title,
              body,
              time: (remoteMessage && remoteMessage.sentTime) || '',
              id:
                (body.startsWith('New Order Received') ? 'order' : 'payment') +
                body.split('#')[1],
              status: 'NEW',
              merchant: user.merchant,
            },
          ];
          await AsyncStorage.setItem(
            user.merchant + 'notifications',
            JSON.stringify(initNotification),
          );
        } else {
          const notifs = JSON.parse(cachedNotifications || '{}');
          notifs.unshift({
            title,
            body,
            time: (remoteMessage && remoteMessage.sentTime) || '',
            id:
              (body.startsWith('New Order Received') ? 'order' : 'payment') +
              body.split('#')[1],
            status: 'NEW',
            merchant: user.merchant,
          });
          await AsyncStorage.setItem(
            user.merchant + 'notifications',
            JSON.stringify(notifs),
          );
        }
        // setNotification(body);
        if (body.startsWith('New Order Received')) {
          const id_ = body.split('#')[1];
          if (id_) {
            AsyncStorage.setItem('notificationid', String(id_));
            navigation.navigate('Order Details', { id: id_ });
          }
        } else if (body.startsWith('New Payment Received')) {
          //console.log("----", 2);
          const id_ = body.split('#')[1];
          if (id_) {
            setToggleModal(true);
            setId(id_);
            setToggleModal(true);
            // this.PaymentNotification(String(id[1]));
          }
        }
      });
  }, [
    navigation,
    id,
    setNotification,
    user.merchant,
    notificationPriority,
    notificationSound,
  ]);

  // const { outlet } = useSelector(state => state.auth);

  const {
    data,
    refetch: refetchOutlet,
    isFetching: isOutletFetching,
  } = useGetMerchantOutlets(user.user_merchant_id);
  React.useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('outlet');
      const ot = await AsyncStorage.getItem('outlet');
      if (ot) {
        try {
          setCurrentUser({
            ...user,
            outlet: JSON.parse(ot || '{}')?.outlet_id,
          });
          setCurrentOutlet(JSON.parse(ot || '{}'));
          setInventoryOutlet(JSON.parse(ot || '{}'));
        } catch (error) {}
      } else {
        if (user.user_merchant_group === 'Administrators') {
          await AsyncStorage.setItem(
            'outlet',
            JSON.stringify(
              data &&
                data.data &&
                data.data.data &&
                data.data.data[0] &&
                data.data.data[0],
            ),
          );
          currentOt = data && data.data && data.data.data && data.data.data[0];
          setCurrentUser({
            ...user,
            outlet: currentOt.outlet_id,
          });
          setCurrentOutlet(currentOt);
          setInventoryOutlet(currentOt);
          return;
        }
        let currentOt;
        const outlets = data && data.data && data.data.data && data.data.data;
        for (let i = 0; i < outlets.length; i++) {
          let outlet = outlets[i];
          if (!outlet) {
            continue;
          }
          if (user && user.user_assigned_outlets.includes(outlet.outlet_id)) {
            await AsyncStorage.setItem(
              'outlet',
              JSON.stringify(
                data &&
                  data.data &&
                  data.data.data &&
                  data.data.data[i] &&
                  data.data.data[i],
              ),
            );
            currentOt = outlets[i];
            setCurrentUser({
              ...user,
              outlet: currentOt.outlet_id,
            });
            setCurrentOutlet(currentOt);
            setInventoryOutlet(currentOt);
            break;
          }
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setCurrentUser]);

  const blogs = blogData?.data || [];

  // step == 3 || step == 7 || step == 8; settlemen

  return (
    <View style={styles.topMain}>
      <ActivationDialog dialog={dialog} setDialog={setDialog} />
      <ScrollView
        contentContainerStyle={styles.main}
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={
              // isInsightsLoading ||
              isOutletFetching ||
              // $isInsightsLoading ||
              isTodoListFetching ||
              blogFetching
            }
          />
        }>
        <View style={styles.accountInfoBannerWrapper}>
          <AccountInfoBanner
            handleAddPress={() => {
              SheetManager.show('add-funds');
            }}
            navigation={navigation}
            ref={r => addTarget(r, '0')}
          />
        </View>

        <View style={[styles.statsWrapper]} ref={r => addTarget(r, '1')}>
          <View style={[styles.summaryWrapper]}>
            <Text
              style={[
                styles.dateText,
                {
                  textAlign: 'left',
                  marginLeft: 14,
                  fontSize: 15,
                  color: '#002',
                  letterSpacing: -0.2,
                },
              ]}>
              Overview
            </Text>
            <Pressable
              style={[styles.summary]}
              onPress={() => {
                if (user.user_merchant_group === 'Operators') {
                  return;
                }
                SheetManager.show('summaryFilter', {
                  payload: {
                    startDate: summaryStartDate,
                    endDate: summaryEndDate,
                    setStartDate: setSummaryStartDate,
                    setEndDate: setSummaryEndDate,
                    setPrevStartDate: setPrevSummaryStartDate,
                    setPrevEndDate: setPrevSummaryEndDate,
                    // range,
                    // setDateRange,
                  },
                });
              }}>
              <Text style={[styles.dateText]}>{range.label}</Text>
              <CaretOutline />
            </Pressable>
          </View>
          {/* {(isLoading || isFetching) && ( */}
          <Spinner
            type="Bounce"
            isVisible={isLoading}
            style={{ alignSelf: 'center' }}
            color="#2F66F6"
            size={45}
          />
          {!isLoading && (
            <FlatList
              contentContainerStyle={styles.list}
              renderItem={({ item: { displayName, value }, index }) => {
                if (!mapDisplayToSummary[displayName]) {
                  return <></>;
                }
                return (
                  <>
                    <StatsCard
                      key={displayName}
                      title={mapDisplayToSummary[displayName]}
                      metric={value}
                      prevData={prevSummary_ && prevSummary_[index]}
                      backgroundColor={backgroundColors[index]}
                      titleColor={titleColors[index]}
                      // ref={index === 0 ? r => addTarget(r, '7') : null}
                    />
                    <View style={{ marginHorizontal: 4 }} />
                  </>
                );
              }}
              scrollEnabled
              horizontal
              data={summary_}
              showsHorizontalScrollIndicator={false}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
        {/* {Platform.OS === 'ios' && (
          <View style={styles.servicesWrapper}>
            <View style={styles.serviceButtons}>
              <View style={[styles.serviceRow, styles.firstRow]}>
                <ServiceButton
                  backgroundColor="rgba(33, 70, 199, 0.1)"
                  color="#21438F"
                  service="Sales"
                  Icon={SalesIcon}
                  handlePress={() => {
                    // if (
                    //   user &&
                    //   user.user_merchant_agent == '6' &&
                    //   !user.user_permissions.includes('ORDERMGT')
                    // ) {
                    //   navigation.navigate('Quick Sale');
                    //   return;
                    // }
                    if (!user.user_permissions.includes('ORDERMGT')) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Upgrade needed',
                        textBody:
                          "You don't have access to this feature. Please upgrade your account",
                      });
                      return;
                    }
                    navigation.navigate('Inventory');
                    // SheetManager.show('sales-type', {
                    //   payload: { navigation },
                    // });
                  }}
                />

                <ServiceButton
                  backgroundColor="rgba(49, 198, 212, 0.1)"
                  color="#21438F"
                  service="Online Store"
                  Icon={Online}
                  ref={r => addTarget(r, '4')}
                  handlePress={() => {
                    navigation.navigate('Manage Store');
                  }}
                />
                <ServiceButton
                  backgroundColor="rgba(49, 198, 212, 0.1)"
                  color="#21438F"
                  service="Users"
                  Icon={UserService}
                  ref={r => addTarget(r, '4')}
                  handlePress={() => {
                    navigation.navigate('Manage Users');
                  }}
                />
              </View>
              <View style={styles.serviceRow}>
                <ServiceButton
                  backgroundColor="rgba(127, 188, 210, 0.1)"
                  color="#21438F"
                  service="Transactions"
                  Icon={HistoryIcon}
                  ref={r => addTarget(r, '5')}
                  handlePress={() => {
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
                    navigation.navigate('Transaction Type');
                  }}
                />

                <ServiceButton
                  backgroundColor="rgba(122, 134, 182, 0.1)"
                  color="#21438F"
                  service="Products"
                  Icon={ProductsIcon}
                  ref={r => addTarget(r, '6')}
                  handlePress={() => {
                    if (
                      user &&
                      user.user_merchant_agent == '6' &&
                      !user.user_permissions.includes('PRODMGT')
                    ) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'No Access',
                        textBody:
                          'Service not available on your account. Please contact Ecobank support',
                      });
                      return;
                    }
                    if (!user.user_permissions.includes('PRODMGT')) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Upgrade Needed',
                        textBody:
                          "You don't have access to this feature. Please upgrade your account",
                      });
                      return;
                    }

                    navigation.navigate('Products');
                  }}
                />

                <ServiceButton
                  backgroundColor="rgba(235, 83, 83, 0.1)"
                  color="#21438F"
                  service="Outlets"
                  Icon={MoreIcon}
                  ref={r => addTarget(r, '7')}
                  handlePress={() => {
                    navigation.navigate('Manage Outlets');
                  }}
                />
              </View>
            </View>
          </View>
        )} */}
        <View style={styles.servicesWrapper}>
          <View style={styles.serviceButtons}>
            <View style={[styles.serviceRow, styles.firstRow]}>
              <ServiceButton
                color="#21438F"
                service="Paypoint"
                Icon={PaymentsIcon}
                backgroundColor="rgba(141, 114, 225, 0.9)"
                handlePress={() => {
                  if (!step_ || step_ != 8) {
                    setDialog(true);
                    return;
                  }
                  if (
                    user &&
                    user.user_merchant_agent == '6'
                    // !user.user_permissions.includes('ORDERMGT')
                  ) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'No Access',
                      textBody:
                        'Service not available on your account. Please contact Ecobank support',
                    });
                    return;
                  }
                  if (
                    !(
                      user.user_permissions.includes('TRANMGT') &&
                      user.user_permissions.includes('MKPAYMT')
                    )
                  ) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }
                  navigation.navigate('Paypoint');
                }}
              />
              <ServiceButton
                backgroundColor="rgba(33, 70, 199, 0.1)"
                color="#21438F"
                service="Sales"
                Icon={SalesIcon}
                handlePress={() => {
                  // if (
                  //   user &&
                  //   user.user_merchant_agent == '6' &&
                  //   !user.user_permissions.includes('ORDERMGT')
                  // ) {
                  //   navigation.navigate('Quick Sale');
                  //   return;
                  // }
                  if (!user.user_permissions.includes('ORDERMGT')) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }
                  navigation.navigate('Inventory');
                  // SheetManager.show('sales-type', {
                  //   payload: { navigation },
                  // });
                }}
              />
              <ServiceButton
                backgroundColor="rgba(49, 198, 212, 0.1)"
                color="#21438F"
                service="Invoices"
                Icon={HistoryIcon}
                handlePress={() => {
                  if (
                    user &&
                    user.user_merchant_agent == '6' &&
                    !user.user_permissions.includes('VIEWMPAY')
                  ) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'No Access',
                      textBody:
                        'Service not available on your account. Please contact Ecobank support',
                    });
                    return;
                  }

                  if (!user.user_permissions.includes('VIEWMPAY')) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade Needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }
                  console.log('hellll');
                  navigation.navigate('Invoices');
                }}
              />
            </View>
            <View style={styles.serviceRow}>
              <ServiceButton
                backgroundColor="rgba(127, 188, 210, 0.1)"
                color="#21438F"
                service="Expenses"
                Icon={ExpensesIcon}
                handlePress={() => {
                  navigation.navigate('Expenses');
                }}
              />

              <ServiceButton
                backgroundColor="rgba(122, 134, 182, 0.1)"
                color="#21438F"
                service="Products"
                Icon={ProductsIcon}
                handlePress={() => {
                  if (
                    user &&
                    user.user_merchant_agent == '6' &&
                    !user.user_permissions.includes('PRODMGT')
                  ) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'No Access',
                      textBody:
                        'Service not available on your account. Please contact Ecobank support',
                    });
                    return;
                  }
                  if (!user.user_permissions.includes('PRODMGT')) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade Needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }

                  navigation.navigate('Products');
                }}
              />
              <ServiceButton
                backgroundColor="rgba(235, 83, 83, 0.1)"
                color="#21438F"
                service="More"
                Icon={MoreIcon}
                handlePress={() => {
                  // if (
                  //   user &&
                  //   user.user_merchant_agent == '6' &&
                  //   !user.user_permissions.includes('ORDERMGT')
                  // ) {
                  //   Toast.show({
                  //     type: ALERT_TYPE.WARNING,
                  //     title: 'No Access',
                  //     textBody:
                  //       'Service not available on your account. Please contact Ecobank support',
                  //   });
                  //   return;
                  // }
                  navigation.navigate('More');
                }}
              />
            </View>
          </View>
        </View>

        <View style={[styles.summaryWrapper, { flexDirection: 'column' }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
            }}>
            <Text
              style={[
                styles.dateText,
                {
                  textAlign: 'left',
                  // marginLeft: 12,
                  fontSize: 15,
                  color: '#091D60',
                  paddingVertical: 10,
                  paddingBottom: 5,
                  letterSpacing: -0.2,
                },
              ]}>
              Latest from Digistore
            </Text>

            <Pressable
              onPress={() =>
                Linking.openURL(
                  'https://business.digistoreafrica.com/index.php/blog/',
                )
              }>
              <Text
                style={[
                  styles.dateText,
                  {
                    // textAlign: 'left',
                    // marginLeft: 0,
                    fontSize: 15,
                    color: '#2F66F6',
                    width: '100%',
                    // paddingVertical: 10,
                  },
                ]}>
                More
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.blog} scrollEnabled horizontal>
            {blogs &&
              !blogLoading &&
              (blogs || [])
                ?.filter(i => i)
                ?.slice(0, 6)
                ?.map(i => {
                  if (!i) {
                    return;
                  }
                  return (
                    <BlogItem
                      link={i.link}
                      imgUrl={
                        (i &&
                          i._links &&
                          i._links['wp:attachment'] &&
                          i._links['wp:attachment'][0].href) ||
                        ''
                      }
                      date={new Date(i.date).toString().slice(4).slice(0, 6)}
                      excerpt={decode(
                        ((i && i.title && i.title.rendered) || '').replace(
                          /(<([^>]+)>)/gi,
                          '',
                        ),
                      )}
                      key={i.link}
                    />
                  );
                })}
            {blogLoading && (
              <>
                <BlogSkeleton />
                <BlogSkeleton />
              </>
            )}
          </ScrollView>
        </View>

        {toggleModal && (
          <NotificationModal
            toggleModal={toggleModal}
            id={id}
            setToggleModal={setToggleModal}
          />
        )}
      </ScrollView>
      {/* <FeatureHighlighter
        messages={messages}
        titles={titles}
        setShowFTE={setShowFTE}
        showFTE={showFTE}
        targets={targets.current}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  topMain: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
  },
  separator: {
    borderRightColor: '#eee',
    borderRightWidth: 0.4,
    height: '70%',
    alignSelf: 'center',
  },
  blog: {
    flexDirection: 'row',
    marginTop: 6,
    // backgroundColor: '#fff',
    borderRadius: 14,
    maxHeight: Dimensions.get('window').height * 0.35,
    minHeight: Dimensions.get('window').height * 0.3,
    marginBottom: 6,
    paddingVertical: 4,
    marginLeft: 10,
    // paddingHorizontal: 6,
  },

  list: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    paddingTop: 5,
  },
  summaryWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    backgroundColor: '#fff',
    // paddingVertical: 2,
    borderRadius: 8,
    // alignItems: 'center',
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  summaryFilterText: {
    color: '#1942D8',
    marginTop: 'auto',
    marginBottom: 2,
    marginRight: 4,
    fontFamily: 'ReadexPro-Medium',
  },
  accountInfoBannerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateText: {
    color: '#2F66F6',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15.5,
    width: '90%',
    textAlign: 'right',
    letterSpacing: -0.2,
  },
  summary: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  statsWrapper: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    // justifyContent: 'center',
    minHeight: 146,
  },
  servicesWrapper: {
    marginTop: 4,
    flex: 1,
    paddingVertical: Dimensions.get('window').height * 0.006,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  serviceButtons: {
    alignItems: 'center',
  },
  serviceLabel: {
    color: '#000',
    fontSize: 15,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    // width: '100%',
  },
  firstRow: {
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    shadowColor: '#470000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 24,
  },
  closeWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 22,
    marginBottom: 6,
  },
  close: {
    marginRight: 12,
  },
  transferButton: {
    width: '90%',
    backgroundColor: '#21438F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  addMoney: {
    width: '90%',
    backgroundColor: 'rgba(217, 217, 217, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 11,
  },
  addMoneyText: {
    color: '#21438F',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  sheetMain: {
    alignItems: 'center',
  },
});

export default Home;
