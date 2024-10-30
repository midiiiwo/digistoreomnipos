/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  RefreshControl,
  Platform,
  FlatList,
  UIManager,
  LayoutAnimation,
  PermissionsAndroid,
  Image,
} from 'react-native';
import * as Tabs from 'react-native-collapsible-tab-view';
import Lottie from 'lottie-react-native';
import BarScanner from '../../assets/icons/barscanner.svg';
import Search from '../../assets/icons/search.svg';
import Date from '../../assets/icons/date.svg';
import ProductCard from '../components/ProductCard';
import Flash from '../../assets/icons/flash.svg';
import { BackHandler, Alert } from 'react-native';
// import ButtonLargeBottom from '../components/ButtonLargeBottom';
// import ButtonCancelBottom from '../components/ButtonCancelBottom';
import { useSelector } from 'react-redux';
import { useGetOutletCategories } from '../hooks/useGetOutletCategories';
import { useGetOutletProducts } from '../hooks/useGetOutletProducts';
import { useGetCategoryProducts } from '../hooks/useGetCategoryProducts';
// import Flash from '../../assets/icons/flash.svg';
import { handleSearch } from '../utils/shared';
// import Loading from '../components/Loading';
import { useActionCreator } from '../hooks/useActionCreator';
// import { FlashList } from '@shopify/flash-list';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import CustomStatusBar from '../components/StatusBar';
import CartItem from '../components/CartItem';
import { useGetApplicableTaxes } from '../hooks/useGetApplicableTaxes';
import { DateTimePicker, Switch } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';
import { useToast } from 'react-native-toast-notifications';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, request } from 'react-native-permissions';
import { showLocalNotification } from '../utils/pushNotification';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import NotificationModal from '../components/Modals/NotificationModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import InventoryLoading from '../components/InventoryLoading';

const Viewer = ({
  refetchCategories,
  //isCategoryFetching,
  category,
  searchTerm,
}) => {
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const {
    data,
    isLoading,
    refetch,
    isFetching: isCategoryProductsFetching,
  } = useGetCategoryProducts(
    user.merchant,
    user.outlet,
    category?.id,
    category?.name !== 'All',
  );
  const {
    data: allProducts,
    isLoading: isAllProductsLoading,
    isFetching: isOutletProductsFetching,
    refetch: refetchOutletProducts,
  } = useGetOutletProducts(user.merchant, user.outlet);
  const renderAllItems = React.useCallback(({ item }) => {
    if (!item) {
      return;
    }

    return (
      <ProductCard
        item={item}
        hasProperties={item.product_has_property}
        hasPropertyVariants={item.product_has_property_variants}
        properties={item.product_properties}
        variants={item.product_properties_variants}
      />
    );
  }, []);

  const renderCategoryItems = React.useCallback(({ item, index }) => {
    if (!item) {
      return;
    }

    return (
      <ProductCard
        item={item}
        hasProperties={item.product_has_property}
        hasPropertyVariants={item.product_has_property_variants}
        properties={item.product_properties}
        variants={item.product_properties_variants}
      />
    );
  }, []);

  React.useEffect(() => {
    if (category.name !== 'All') {
      refetch();
    }
  }, [refetch, category.name]);

  if (isAllProductsLoading) {
    return <InventoryLoading />;
  }

  if (category.name !== 'All') {
    if (isLoading) {
      return <InventoryLoading />;
    }

    // if (data && data.data && data.data.data) {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: 'red' }}>
    //       <Text>hello</Text>
    //     </View>
    //   );
    // }

    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isCategoryProductsFetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_id;
        }}
        contentContainerStyle={styles.container}
        data={
          [...handleSearch(searchTerm, data && data.data && data.data.data)] ||
          []
        }
        numColumns={4}
        renderItem={renderCategoryItems}
      />
    );
  }
  if (
    ((allProducts && allProducts.data && allProducts.data.data) || []).filter(
      i => i != null,
    ).length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{ fontFamily: 'Lato-Bold', fontSize: 16, color: '#30475e' }}>
          You have no products yet
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first product
        </Text>
        <Pressable
          style={[
            styles.btn,
            {
              marginTop: 14,
              backgroundColor: '#rgba(25, 66, 216, 0.9)',
            },
          ]}
          onPress={async () => {
            navigation.navigate('Add Product');
          }}>
          <Text style={styles.signin}>Add Product</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetchCategories();
              refetchOutletProducts();
            }}
            refreshing={isOutletProductsFetching}
          />
        }
        showsVerticalScrollIndicator={false}
        estimatedItemSize={Dimensions.get('screen').width * 0.15}
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_id;
        }}
        contentContainerStyle={styles.container}
        data={
          [
            ...handleSearch(
              searchTerm,
              allProducts && allProducts.data && allProducts.data.data,
            ),
          ] || []
        }
        numColumns={4}
        renderItem={renderAllItems}
      />
    </>
  );
};

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const Inventory = ({ navigation }) => {
  React.useEffect(() => {
    const handleBackPress = () => {
      // Return true to prevent default back button behavior
      return true;
    };

    // Add event listener for back button
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener when the component unmounts
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
  const { user } = useSelector(state => state.auth);
  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const { data, isLoading, refetch, isRefetching } = useGetOutletCategories(
    user.merchant,
    user.outlet,
  );
  const { subTotal, cart } = useSelector(state => state.sale);
  // const LayoutAnimationRef = React.useRef(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { setQuickSaleInAction, resetCart } = useActionCreator();

  const { setTotalAmount, setOrderDate, clearDiscount, setDeliveryDueDate } =
    useActionCreator();
  const { discountPayload, delivery, addTaxes, orderDate, deliveryDueDate } =
    useSelector(state => state.sale);
  const dupNotif = React.useRef();
  const { data: taxes, isLoading: istaxesLoading } = useGetApplicableTaxes(
    user.merchant,
  );
  const messageListener = React.useRef();
  const {
    setCurrentUser,
    setCurrentOutlet,
    setNotification,
    setNotificationSound,
    setInventoryOutlet,
    setOrderTaxes,
    setAddTaxes,
  } = useActionCreator();
  const [toggleModal, setToggleModal] = React.useState(false);
  const [id, setId] = React.useState();
  const checkListener = React.useRef(true);
  const { notificationSound, notificationPriority } = useSelector(
    state => state.merchant,
  );

  const { bottom } = useSafeAreaInsets();

  const { data: data_ } = useGetMerchantOutlets(user.user_merchant_id);
  React.useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('outlet');
      try {
        const ot = await AsyncStorage.getItem('outlet');
        if (ot) {
          setCurrentUser({
            ...user,
            outlet: JSON.parse(ot).outlet_id,
          });
          setCurrentOutlet(JSON.parse(ot));
          setInventoryOutlet(JSON.parse(ot));
        } else {
          if (user.user_merchant_group === 'Administrators') {
            await AsyncStorage.setItem(
              'outlet',
              JSON.stringify(
                data_ &&
                data_.data &&
                data_.data.data &&
                data_.data.data[0] &&
                data_.data.data[0],
              ),
            );
            currentOt =
              data_ && data_.data && data_.data.data && data_.data.data[0];
            setCurrentUser({
              ...user,
              outlet: currentOt.outlet_id,
            });
            setCurrentOutlet(currentOt);
            setInventoryOutlet(currentOt);
            return;
          }
          let currentOt;
          const outlets =
            data_ && data_.data && data_.data.data && data_.data.data;
          for (let i = 0; i < outlets.length; i++) {
            let outlet = outlets[i];
            if (!outlet) {
              continue;
            }
            if (user && user.user_assigned_outlets.includes(outlet.outlet_id)) {
              await AsyncStorage.setItem(
                'outlet',
                JSON.stringify(
                  data_ &&
                  data_.data &&
                  data_.data.data &&
                  data_.data.data[i] &&
                  data_.data.data[i],
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
      } catch (error) { }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setCurrentUser]);

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
        //   console.warn(err);
        // }

        console.log('88888', user);

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

          await messaging().subscribeToTopic('thomasdavisiostest1234567891');
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
      } catch (error) {
        console.error('=>>>>>>>>>>>>>>>>,', error);
      }

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

  React.useEffect(() => {
    if (messageListener.current) {
      messageListener.current();
    }
    messageListener.current = messaging().onMessage(async remoteMessage => {
      console.log('messsssssssss');
      if (
        remoteMessage &&
        !remoteMessage.notification &&
        !remoteMessage.collapseKey
      ) {
        return;
      }

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
        const notifs = JSON.parse(cachedNotifications);
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
        const notifs = JSON.parse(cachedNotifications);
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
          const notifs = JSON.parse(cachedNotifications);
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

  // React.useLayoutEffect(() => {
  //   if (LayoutAnimationRef.current > 0) {
  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   }
  //   LayoutAnimationRef.current += 1;
  // }, [cart]);

  const cartListRef = React.useRef();
  React.useEffect(() => {
    if (quickSaleInAction) {
      setQuickSaleInAction(false);
      resetCart();
    }
  }, [quickSaleInAction, setQuickSaleInAction, resetCart]);

  const toast = useToast();

  if (isLoading || istaxesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Lottie
          source={require('../lottie/95136-2-parallel-lines-animation.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  const orderAmount = (cart || []).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    return acc + Number(curr?.amount) * Number(curr?.quantity);
  }, 0);

  const taxes_ =
    (taxes?.data?.data || []).map(tax => {
      if (tax) {
        return {
          taxName: tax.tax_name,
          amount: Number(
            (
              tax.tax_value *
              (orderAmount - (discountPayload?.discount || 0))
            ).toFixed(2),
          ),
          appliedAs: tax.tax_applied_as,
          taxId: tax.tax_id,
          taxValue: tax.tax_value,
        };
      }
    }) || [];

  console.log('taxxxxxx', orderAmount);

  const totalTaxesApplied =
    (addTaxes &&
      taxes_ &&
      taxes_
        .filter(i => i && i.appliedAs === 'EXCLUSIVE')
        .reduce((acc, curr) => {
          return acc + curr.amount;
        }, 0)) ||
    0;

  const totalOtherAmount =
    totalTaxesApplied +
    Number((delivery && delivery.price && delivery.price.toFixed(2)) || 0);

  const categoryItems = (data?.data?.data || []).map(cat => {
    return {
      id: cat.category_id,
      name: cat.category_name,
    };
  });

  const screens = [
    { id: 'donotusethisid', name: 'All' },
    ...(categoryItems || []),
  ].map(cat => {
    return (
      <Tabs.Tab name={cat.name} key={cat.id}>
        <Tabs.Lazy>
          <Viewer
            navigation={navigation}
            category={cat}
            searchTerm={searchTerm.trim()}
            isCategoryFetching={isRefetching}
            refetchCategories={refetch}
          />
        </Tabs.Lazy>
      </Tabs.Tab>
    );
  });

  return (
    <View style={[styles.main, { paddingBottom: bottom }]}>
      {Platform.OS === 'android' && (
        <CustomStatusBar backgroundColor="#59C1BD" />
      )}
      <View
        style={{ flexDirection: 'row', flex: 1, backgroundColor: '#F1F5F9' }}>
        <View
          style={{
            width: Dimensions.get('window').width * 0.6,
          }}>
          <Tabs.Container
            width={Dimensions.get('window').width * 0.6}
            lazy
            renderHeader={() => (
              <View style={styles.topIcons}>
                <Pressable style={styles.searchBox}>
                  <Search
                    stroke="#131517"
                    height={26}
                    width={26}
                    style={{ marginLeft: 12 }}
                  />
                  <TextInput
                    style={[
                      styles.search,
                      {
                        fontFamily: 'ReadexPro-Regular',
                        fontSize: 14,
                        marginTop: 4,
                      },
                    ]}
                    placeholder="Search product"
                    placeholderTextColor="#52555C"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    cursorColor="#131517"
                  />
                  <Pressable
                    onPress={() => navigation.navigate('Cart Barcode')}>
                    <BarScanner stroke="#30475e" height={30} width={30} />
                  </Pressable>
                </Pressable>
                <View style={styles.viewSpace} />
                <ShadowedView
                  style={[
                    shadowStyle({
                      opacity: 0.1,
                      radius: 1.2,
                      offset: [0, 0],
                    }),
                    { marginLeft: 4 },
                  ]}>
                  <Pressable
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 70,
                      padding: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      navigation.navigate('Quick Sale');
                    }}>
                    <Flash stroke="#30475e" height={32} width={32} />
                    {/* <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        color: '#304753',
                        fontSize: 15,
                      }}>
                      Add Non-Inventory Item
                    </Text> */}
                  </Pressable>
                </ShadowedView>
              </View>
            )}
            renderTabBar={props => (
              <Tabs.MaterialTabBar
                contentContainerStyle={{
                  paddingHorizontal: 18,
                  paddingVertical: 4,
                  // elevation: 0,
                }}
                labelStyle={styles.labelStyle}
                {...props}
                style={styles.containerStyle}
                indicatorStyle={styles.indicatorStyle}
                tabStyle={styles.tabStyle}
                inactiveColor="#000"
                activeColor="#0069FF"
                scrollEnabled
              />
            )}>
            {screens}
          </Tabs.Container>
        </View>
        <ShadowedView
          style={[
            shadowStyle({
              opacity: 0.1,
              radius: 1,
              offset: [0, 0],
            }),
            { marginRight: 10, flex: 1, marginTop: 2 },
          ]}>
          <View
            style={{
              flex: 1,
              // borderColor: '#eee',
              // borderWidth: 0.6,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              // marginRight: 14,
              paddingTop: 10,
              backgroundColor: '#fff',

              // marginTop: 4,
            }}>
            <View style={{ flex: 1 }}>
              <FlatList
                ref={cartListRef}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        paddingVertical: 24,
                      }}>
                      <Image
                        style={{ height: 200, width: 200 }}
                        source={require('../../assets/images/empty-cart.jpg')}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Regular',
                          fontSize: 18,
                          color: '#5C4B99',
                        }}>
                        Your cart is empty
                      </Text>
                    </View>
                  );
                }}
                data={cart || []}
                renderItem={({ item }) => {
                  if (item) {
                    return <CartItem item={item} />;
                  }
                }}
                contentContainerStyle={{
                  paddingHorizontal: 14,
                  // height: '100%',
                }}
                scrollEnabled
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      borderBottomColor: '#eee',
                      borderBottomWidth: 0.5,
                    }}
                  />
                )}
              />
            </View>

            <View style={{ marginTop: 'auto' }}>
              {/* {cart.length > 0 && ( */}
              <View style={[styles.allTaxMain, { paddingTop: 2 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {taxes_.length > 0 && (
                    <View style={styles.toggle}>
                      <Text
                        style={[
                          styles.taxLabel,
                          {
                            marginRight: 10,
                            fontFamily: 'ReadexPro-Medium',
                            fontSize: 14,
                            color: '#30475e',
                          },
                        ]}>
                        Apply taxes
                      </Text>
                      <Switch
                        value={addTaxes}
                        onColor="#0069FF"
                        offColor="#CFCFCF"
                        onValueChange={() => {
                          setAddTaxes(!addTaxes);
                        }}
                      />
                    </View>
                  )}
                  <Pressable
                    style={{ marginLeft: 'auto' }}
                    onPress={() => resetCart()}>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Regular',
                        fontSize: 14,
                        color: '#E0144C',
                        letterSpacing: 0.3,
                      }}>
                      Clear Cart
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.taxMain}>
                  <Text style={styles.taxLabel}>Subtotal</Text>
                  <View style={styles.amountWrapper}>
                    <Text style={styles.taxAmount}>
                      GHS{' '}
                      {new Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(orderAmount)}
                    </Text>
                  </View>
                </View>
                {discountPayload?.discount > 0 && (
                  <View style={styles.taxMain}>
                    <Text style={styles.taxLabel}>
                      Discount{' '}
                      {discountPayload && discountPayload.discountCode && (
                        <Text
                          style={{
                            fontFamily: 'Inter-Regular',
                            fontSize: 15,
                            color: '#73777B',
                          }}>
                          {`(${discountPayload.discountCode})`.trimEnd()}
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.taxAmount}>
                      GHS -{discountPayload.discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                {addTaxes && (
                  <FlatList
                    data={taxes_}
                    renderItem={({ item }) => {
                      if (item?.appliedAs === 'INCLUSIVE') {
                        return <></>;
                      }
                      return (
                        <View
                          style={[
                            styles.taxMain,
                            {
                              marginBottom: 0,
                              marginTop: 3,
                            },
                          ]}>
                          <Text style={styles.taxLabel}>
                            {item?.taxName} - {Number(item?.taxValue) * 100}%{' '}
                            <Text
                              style={{
                                textTransform: 'capitalize',
                                fontSize: 13,
                                color: '#9DB2BF',
                                fontFamily: 'ReadexPro-Medium',
                              }}>
                              (
                              {item?.appliedAs === 'INCLUSIVE'
                                ? 'Incl.'
                                : 'Excl.'}
                              )
                            </Text>
                          </Text>
                          <Text style={styles.taxAmount}>
                            GHS{' '}
                            {new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            }).format(Number(item?.amount))}
                          </Text>
                        </View>
                      );
                    }}
                  />
                )}
                {delivery && Number(delivery.price) > 0 && (
                  <View style={styles.taxMain}>
                    <Text style={styles.taxLabel}>Delivery</Text>
                    <Text style={styles.taxAmount}>
                      GHS {delivery ? delivery?.price : 0}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.taxMain,
                    {
                      borderTopColor: '#ccc',
                      borderTopWidth: 1.2,
                      paddingTop: 2,
                      borderStyle: 'dashed',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.taxLabel,
                      {
                        fontSize: 14,
                        fontFamily: 'ReadexPro-bold',
                        color: '#30475e',
                        // fontWeight: 'bold',
                      },
                    ]}>
                    Total
                  </Text>
                  <View style={[styles.amountWrapper]}>
                    {discountPayload && discountPayload.newAmount > 0 && (
                      <Text style={[styles.oldText]}>
                        GHS{' '}
                        {(discountPayload.oldAmount + totalOtherAmount).toFixed(
                          2,
                        )}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.taxAmount,
                        {
                          fontSize: 14,
                          fontFamily: 'ReadexPro-bold',
                          // fontWeight: 'bold',
                        },
                      ]}>
                      GHS{' '}
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(subTotal + totalOtherAmount)}
                    </Text>
                  </View>
                </View>
                {addTaxes && (
                  <FlatList
                    data={taxes_}
                    renderItem={({ item }) => {
                      if (item?.appliedAs === 'EXCLUSIVE') {
                        return <></>;
                      }
                      return (
                        <View
                          style={[
                            styles.taxMain,
                            {
                              marginBottom: 0,
                              marginTop: 3,
                            },
                          ]}>
                          <Text style={styles.taxLabel}>
                            {item?.taxName} - {Number(item?.taxValue) * 100}%{' '}
                            <Text
                              style={{
                                textTransform: 'capitalize',
                                fontSize: 13,
                                color: '#9DB2BF',
                                fontFamily: 'ReadexPro-Medium',
                              }}>
                              (
                              {item?.appliedAs === 'INCLUSIVE'
                                ? 'Incl.'
                                : 'Excl.'}
                              )
                            </Text>
                          </Text>
                          <Text style={styles.taxAmount}>
                            GHS{' '}
                            {new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            }).format(Number(item?.amount))}
                          </Text>
                        </View>
                      );
                    }}
                  />
                )}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      paddingVertical: 0,
                    }}>
                    <Pressable
                      onPress={
                        () => {
                          navigation.navigate('Add Discount', {
                            type: 'inventory',
                          });
                        }
                        // SheetManager.show('discount', {
                        //   payload: { type: 'inventory', navigation },
                        // })
                      }
                      style={{
                        padding: 2,
                        paddingHorizontal: 1,
                        // marginLeft: 'auto',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Regular',
                          fontSize: 14.5,
                          color: '#0069FF',
                        }}>
                        Add discount
                      </Text>
                    </Pressable>
                    <View style={{ marginHorizontal: 6 }} />
                    <Pressable
                      onPress={() =>
                        SheetManager.show('delivery', {
                          payload: { type: 'inventory' },
                        })
                      }
                      style={{
                        paddingHorizontal: 1,
                        padding: 2,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Regular',
                          fontSize: 14.5,
                          color: '#0069FF',
                        }}>
                        Select Delivery Option
                      </Text>
                    </Pressable>
                  </View>
                  {discountPayload && (
                    <Pressable
                      onPress={() =>
                        clearDiscount(
                          subTotal +
                          (discountPayload && discountPayload.discount) || 0,
                        )
                      }
                      style={{
                        paddingHorizontal: 1,
                        marginLeft: 'auto',
                        // marginTop: 10,
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Regular',
                          fontSize: 14,
                          color: '#E0144C',
                        }}>
                        Clear discount
                      </Text>
                    </Pressable>
                  )}
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#aaa', fontSize: 12 }}>
                        Order Date
                      </Text>
                      <DateTimePicker
                        title={''}
                        placeholder={'Order Date'}
                        mode={'date'}
                        migrate
                        value={orderDate}
                        onChange={val => {
                          setOrderDate(val);
                        }}
                        renderInput={props => {
                          return (
                            <View
                              style={{
                                borderBottomColor: '#eee',
                                borderBottomWidth: 0.8,
                                paddingVertical: 2,
                                width: '100%',
                                paddingLeft: 6,
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'ReadexPro-Medium',
                                  color: '#30475e',
                                  fontSize: 14,
                                  letterSpacing: 0.4,
                                }}>
                                {props.value}
                              </Text>
                              <Date
                                stroke="#DDE6ED"
                                height={28}
                                width={28}
                                style={{ marginLeft: 'auto' }}
                              />
                            </View>
                          );
                        }}
                      // style={{ borderBottomColor: '#eee' }}
                      // dateFormat="ddd, Do MMMM, YYYY"
                      />
                    </View>
                    <View style={{ marginHorizontal: 6 }} />
                    <View style={{ flex: 1 }}>
                      {user?.user_permissions?.includes('ADDORDERDLVRDATE') && (
                        <>
                          <Text style={{ color: '#aaa', fontSize: 12 }}>
                            Delivery Date
                          </Text>
                          <DateTimePicker
                            title={'Delivery Due Date'}
                            placeholder={'Delivery Due Date'}
                            mode={'date'}
                            migrate
                            value={deliveryDueDate}
                            onChange={val => {
                              setDeliveryDueDate(val);
                            }}
                            renderInput={props => {
                              return (
                                <View
                                  style={{
                                    borderBottomColor: '#eee',
                                    borderBottomWidth: 0.8,
                                    paddingVertical: 2,
                                    width: '100%',
                                    paddingLeft: 6,
                                    flexDirection: 'row',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: 'ReadexPro-Medium',
                                      color: '#30475e',
                                      fontSize: 14,
                                      letterSpacing: 0.4,
                                    }}>
                                    {props.value}
                                  </Text>
                                  <Date
                                    stroke="#DDE6ED"
                                    height={28}
                                    width={28}
                                    style={{ marginLeft: 'auto' }}
                                  />
                                </View>
                              );
                            }}
                          // style={{ borderBottomColor: '#eee' }}
                          // dateFormat="ddd, Do MMMM, YYYY"
                          />
                        </>
                      )}
                      {!user?.user_permissions?.includes(
                        'ADDORDERDLVRDATE',
                      ) && (
                          <Pressable
                            onPress={() => SheetManager.show('deliveryNote')}
                            style={{
                              paddingHorizontal: 1,
                              marginLeft: 'auto',
                              marginTop: 13,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'ReadexPro-Regular',
                                fontSize: 14,
                                color: '#0069FF',
                              }}>
                              Add Delivery Notes
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  </View>
                </View>
              </View>
              {/* )} */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  marginTop: 0,
                }}>
                <PrimaryButton
                  style={[
                    styles.btn,
                    {
                      backgroundColor: '#03C988',
                      width: '47%',
                      borderRadius: 5,
                      paddingVertical: 6,
                    },
                  ]}
                  textStyle={{ fontSize: 14.5 }}
                  handlePress={() => {
                    SheetManager.show('cartOptions', {
                      payload: { navigation },
                    });
                  }}>
                  More Options
                </PrimaryButton>

                <View style={{ marginHorizontal: 4 }} />
                <PrimaryButton
                  // disabled={cart.length === 0}
                  style={[
                    styles.btn,
                    {
                      backgroundColor: '#0069FF',
                      width: '47%',
                      borderRadius: 5,
                      paddingVertical: 6,
                    },
                  ]}
                  textStyle={{ fontSize: 14.5 }}
                  handlePress={() => {
                    if (cart.length === 0) {
                      toast.show('Cart is empty', { placement: 'top' });
                      return;
                    }
                    if (!delivery) {
                      toast.show('Please select delivery option', {
                        type: 'danger',
                        placement: 'top',
                      });
                      return;
                    }

                    if (addTaxes) {
                      setOrderTaxes(taxes_);
                    }

                    setQuickSaleInAction(false);

                    setTotalAmount(
                      JSON.parse((subTotal + totalOtherAmount).toFixed(2)),
                    );
                    navigation.navigate('Payments');
                  }}>
                  Checkout
                </PrimaryButton>
              </View>
            </View>
          </View>
        </ShadowedView>
        {toggleModal && (
          <NotificationModal
            toggleModal={toggleModal}
            id={id}
            setToggleModal={setToggleModal}
          />
        )}
      </View>
      {/* <View style={styles.buttonWrapper}>
        <ButtonLargeBottom
          extraStyle={styles.btnlarge}
          width="80%"
          handlePress={() => navigation.navigate('Cart')}
          disabled={cart.length === 0}
          disabledColor="rgba(89, 193, 189, 1)"
          backgroundColor="#59C1BD">
          {totalItems} items - GHS {subTotal}
        </ButtonLargeBottom>
        <ButtonCancelBottom extraStyle={styles.btnlarge} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  viewSpace: {
    width: 10,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingLeft: 15,
    backgroundColor: '#F1F5F9',
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  tabView: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#F1F5F9',
  },
  containerStyle: {
    // marginHorizontal: 12,
    // marginTop: 8,
    width: Dimensions.get('window').width * 0.6,
    paddingHorizontal: 8,
    backgroundColor: '#F1F5F9',
  },
  labelStyle: {
    fontFamily: 'ReadexPro-Medium',
    textTransform: 'uppercase',
    fontSize: 13.5,
  },
  indicatorStyle: {
    height: 4.2,
    borderRadius: 10,
    backgroundColor: '#0069FF',
    opacity: 1,
  },
  tabStyle: { backgroundColor: '#F1F5F9' },
  topText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickSale: {
    marginRight: 'auto',
    fontFamily: 'Inter-Regular',
    marginLeft: 20,
    color: '#1942D8',
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 18,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 55,
    borderColor: '#DCDCDE',
    borderWidth: 0.5,
    // width: Dimensions.get('window').width * 0.5,
    flex: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 17.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.3,
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 14,
    color: '#748DA6',
    fontFamily: 'Inter-Regular',
  },
  arbitrary: { height: 42 },
  viewAll: {
    fontFamily: 'Inter-Regular',
    marginLeft: 'auto',
    marginRight: 20,
    color: '#1942D8',
    marginTop: 10,
  },
  viewAllWrapper: {
    marginLeft: 'auto',
  },
  grid: {
    marginVertical: 110,
    marginBottom: 60,
  },

  container: {
    paddingVertical: 120,
    paddingBottom: 60,
    paddingLeft: Dimensions.get('window').width * 0.008,
    backgroundColor: '#F1F5F9',
  },
  buttonWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cartWrapper: {
    marginTop: 22,
    flex: 1,
  },
  oldText: {
    textDecorationLine: 'line-through',
    fontFamily: 'JetBrainsMono-Regular',
    marginRight: 10,
    color: '#73777B',
  },

  label: {
    fontFamily: 'ReadexPro-Regular',
    color: '#30475E',
    fontSize: 16,
    marginRight: 5,
  },
  toggle: {
    paddingVertical: 8,
    // borderBottomColor: '#eee',
    // borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountWrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  deleteMain: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 'auto',
    backgroundColor: '#FF6464',
    width: '100%',
    marginVertical: -1,
  },

  extraStyleBtnCancel: { backgroundColor: '#F1EEE9' },
  deleteText: {
    color: '#fff',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    marginRight: 20,
  },
  allTaxMain: {
    marginTop: 'auto',

    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    paddingVertical: 2,
    paddingBottom: 0,
    marginBottom: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  taxMain: {
    flexDirection: 'row',
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 12.4,
    color: '#8A8A8A',
    letterSpacing: 0.1,
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 13,
    color: '#304753',
  },
  btnWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
  // btnlarge: { height: 65 },
});

export default Inventory;