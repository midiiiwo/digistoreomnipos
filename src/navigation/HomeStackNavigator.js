import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inventory from '../containers/Inventory';
import Tabs from './BottomTab';
import InventoryHeader from '../components/InventoryHeader';
import Cart from '../containers/Cart';
import PaymentOptions from '../containers/PaymentOptions';
import Receipt from '../containers/Receipt';
import ReceiptHeader from '../components/ReceiptHeader';
import QuickCharge from '../containers/QuickCharge';
import { useActionCreator } from '../hooks/useActionCreator';
import Paypoint from '../containers/Paypoint';
import PaypointHeader from '../components/PaypointHeader';
import Products from '../containers/Products';
import ProductsHeader from '../components/ProductsHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelector } from 'react-redux';
import OutletLogin from '../containers/OutletLogin';
import messaging from '@react-native-firebase/messaging';
import Login from '../containers/Login';
import { useSelector } from 'react-redux';
import Internet from '../containers/Internet';
import Airtime from '../containers/Airtime';
import Bills from '../containers/Bills';
import Utilities from '../containers/Utilities';
import Tv from '../containers/Tv';
import SendMoney from '../containers/SendMoney';
import SendMoneyDetails from '../containers/SendMoneyDetails';
import SendMoneyStatus from '../containers/SendMoneyStatus';
import BillDetails from '../containers/BillDetails';
import BillConfirmed from '../containers/BillConfirmed';
import BillStatus from '../containers/BillStatus';
import AirtimeStatus from '../containers/AirtimeStatus';
import Ticket from '../containers/Ticket';
import BillReceipt from '../containers/BillReceipt';
import BillReceiptHeader from '../components/BillReceiptHeader';
import SendMoneyReceipt from '../containers/SendMoneyReceipt';
import AirtimeReceipt from '../containers/AirtimeReceipt';
import TransferMoney from '../containers/TransferMoney';
import AddMoney from '../containers/AddMoney';
import VerifyWalletAccount from '../containers/VerifyWalletAccount';
import AddMoneyStatus from '../containers/AddMoneyStatus';
import PaypointTransactionHistory from '../containers/PaypointTransactionHistory';
import TransferMoneyStatus from '../containers/TransferMoneyStatus';
import AccountStatement from '../containers/AccountStatement';
import TransactionType from '../containers/TransactionType';
import FundsTransfer from '../containers/FundsTransfer';
import AddProduct from '../containers/AddProduct';
import BarcodeScanner from '../containers/BarcodeScanner';
import EditProduct from '../containers/EditProduct';
import AddCategory from '../containers/AddCategory';
import ViewProductDetails from '../containers/ViewProductDetails';
import OrderDetails from '../containers/OrderDetails';
import OrderReceipt from '../containers/OrderReceipt';
import DiscountQr from '../containers/DiscountQr';
import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { AppState } from 'react-native';
import Signup from '../containers/Signup';
import NewUserPhone from '../containers/NewUserPhone';
import VerifyOnboardingOtp from '../containers/VerifyOnboardingOtp';
import EditCategory from '../containers/EditCategory';
import CustomerDetails from '../containers/CustomerDetails';
import AddCustomer from '../containers/AddCustomer';
import EditCustomer from '../containers/EditCustomer';
import OperatorLockScreen from '../containers/OperatorLockScreen';
import ChangePass from '../containers/ChangePass';
import Notification from '../containers/Notification';
import AirtimeHistory from '../containers/AirtimeHistory';
import BillHistory from '../containers/BillHistory';
import InternetHistory from '../containers/InternetHistory';
import SendMoneyHistoryScreen from '../containers/SendMoneyHistory';
import SaleHistoryScreen from '../containers/SalesHistory';
import InventoryProductOptions from '../containers/InventoryProductOptions';
import Password from '../containers/Password';
import Outflows from '../containers/Outflows';
import Inflows from '../containers/Inflows';
import OutletList from '../containers/OutletList';
import Discount from '../containers/Discount';
import CartBarcode from '../containers/CartBarcode';
import SetPin from '../containers/SetPin';
import ResetPass from '../containers/ResetPass';
import InvoiceHistory from '../containers/InvoiceHistory';
import SignupOtp from '../containers/SignupOtp';
import InvoicePay from '../containers/InvoicePay';
import ActivationType from '../containers/ActivationType';
import PersonalInformation from '../containers/PersonalInformation';
import BusinessInformation from '../containers/BusinessInformation';
import LocationSelect from '../containers/LocationSelect';
import SettlementInformation from '../containers/SettlementInformation';
import ReceivedPaymentReceipt from '../containers/ReceivedPaymentReceipts';
import GetStarted from '../containers/GetStarted';
import SplashScreen from 'react-native-splash-screen';
import AddReceipt from '../containers/AddReceipt';
import EditReceipt from '../containers/EditReceipt';
import ReceiptDetails from '../containers/ReceiptDetails';
import Users from '../containers/Users';
import AddUser from '../containers/AddUser';
import EditUser from '../containers/EditUser';
import SignupSuccess from '../containers/SignupSuccess';
import Settings from '../containers/Settings';
import ReceiptPreview from '../containers/ReceiptPreview';
import ManageTaxes from '../containers/ManageTaxes';
import EditTax from '../containers/EditTax';
import AddTax from '../containers/AddTax';
import CustomerSelect from '../containers/CustomerSelect';
import Update from '../containers/Update';
import AddOutlet from '../containers/AddOutlet';
import OutletLocation from '../containers/OutletLocation';
import ManageOutlets from '../containers/ManageOutlets';
import EditOutlet from '../containers/EditOutlet';
import ManageRoutes from '../containers/ManageRoutes';
import ManageDeliveries from '../containers/ManageDeliveries1';
import AddDelivery from '../containers/AddDelivery';
import AddRider from '../containers/AddRider';
import ManageStore from '../containers/ManageStore';
import Shortcode from '../containers/ShortcodeDetails';
import AddWallet from '../containers/AddWallet';
import DeliveryLocation from '../containers/DeliveryLocation';
import ManageNotifications from '../containers/ManageNotification';
import Profile from '../containers/Profile';
import ProfileLocationSelect from '../containers/ProfileLocationSelect';
import Siren from 'react-native-siren';
import { Platform } from 'react-native';
import Account from '../containers/Account';
import SalesChannels from '../containers/SalesChannels';
import Logout from '../containers/Logout';
import More from '../containers/More';
import EventDetail from '../containers/EventDetail';
// import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import Status from '../containers/Status';
import Qr from '../containers/Qr';
import CreateEvent from '../containers/CreateEvent';
import EditEvent from '../containers/EditEvent';
import EventTickets from '../containers/EventTickets';
import AddEventTicket from '../containers/AddEventTicket';
import TicketDetails from '../containers/TicketDetails';
import EditEventTicket from '../containers/EditEventTicket';
import ResetPassOtp from '../containers/ResetPassOtp';
import AddProductVariants from '../containers/AddProductVariants';
import EditProductVariants from '../containers/EditProductVariants';
import SessionExpired from '../components/Modals/SessionExpired';
import { useAxiosErrorResponseInterceptor } from '../hooks/useAxiosErrorResponseInterceptor';
import { useInitInterceptor } from '../hooks/useInitInterceptor';
import SellTicketEvents from '../containers/SellTicketEvents';
import SellEventDetails from '../containers/SellEventDetails';
import SellTicket from '../containers/SellTicket';
import SellTicketStatus from '../containers/SellTicketStatus';
import TicketSoldHistory from '../containers/TicketSoldHistory';
import TicketSoldDetails from '../containers/TicketSoldDetails';
import CreateInvoice from '../containers/CreateInvoice';
import InvoiceInventory from '../containers/InvoiceInventory';
import InvoiceCustomerSelect from '../containers/InvoiceCustomerSelect';
import InvoiceDelivery from '../containers/InvoiceDelivery';
import InvoiceDiscount from '../containers/InvoiceDiscount';
import InvoicePreview from '../containers/InvoicePreview';
import InvoicePaymentSend from '../containers/InvoicePaymentSend';
import InvoiceQuikeSale from '../containers/InvoiceQuickSale';
import InvoiceOrderPreview from '../containers/InvoiceOrderPreview';
import SendInvoiceHeader from '../components/SendInvoiceHeader';
import SendEmailInvoice from '../containers/SendEmailInvoice';
import LoginAuthorizationOtp from '../containers/LoginAuthorizationOtp';
import InvoiceDetails from '../containers/InvoiceDetails';
import PaypointTransactions from '../containers/PaypointTransactionDetails';
import ExpensesHistory from '../containers/ExpensesHistory';
import ExpensesCategories from '../containers/ExpensesCategories';
import CreateExpenseCategory from '../containers/CreateExpenseCategory';
import CreateExpense from '../containers/CreateExpense';
import Suppliers from '../containers/Suppliers';
import CreateSupplier from '../containers/AddSupplier';
import ExpensesHeader from '../components/ExpensesHeader';
import ExpensesCategoriesLov from '../containers/ExpenseCategoryLov';
import SendMoneyBank from '../containers/SendMoneyBank';
import SmsHistory from '../containers/SmsHistory';
import UssdOffline from '../containers/UssdOffline';
import SmsDetails from '../containers/SmsDetails';
import Invoices from '../containers/Invoices';
import InvoicesHeader from '../components/InvoicesHeader';
import HeaderInventory from '../components/HeaderInventory';
import InventoryQuickSale from '../containers/InventoryQuickSale';
import ManageDeliveriesHeader from '../components/ManageDeliveriesHeader';
import Riders from '../components/Riders';
// import ManageRoutes from '../containers/ManageRoutes';

const Stack = createNativeStackNavigator();

function HomeStackNavigator() {
  const { setCurrentUser, setAuth, setFirstLaunch } = useActionCreator();
  const { auth, firstLaunch } = useSelector(state => state.auth);
  const { setPinState } = useActionCreator();
  const appState = React.useRef(AppState.currentState);
  const [sessionStatus, setSessionStatus] = React.useState(false);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const { error, ejectInterceptor } =
    useAxiosErrorResponseInterceptor(sessionStatus);
  const { ejectReqInterceptor } = useInitInterceptor({ sessionStatus });

  React.useEffect(() => {
    (async () => {
      if (error && auth) {
        if (error.response && error.response.status === 401) {
          const { data } = error.response;
          if (data.error === true) {
            setSessionStatus(true);
            ejectInterceptor();
            ejectReqInterceptor();
          }
        }
      }
    })();
  }, [error, auth, ejectInterceptor, ejectReqInterceptor]);

  React.useEffect(() => {
    (async () => {
      await messaging().subscribeToTopic('announcement');
    })();
  }, []);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      Siren.promptUser();
    }
  }, []);

  const showEnterPinLock = React.useCallback(async () => {
    const hasPin = await hasUserSetPinCode();
    if (hasPin) {
      setPinState({ pinStatus: 'enter', showPin: true });
    } else {
      setPinState({ pinStatus: 'choose', showPin: true });
    }
  }, [setPinState]);

  React.useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('user');
      const user_ = await AsyncStorage.getItem('user');
      try {
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
      } catch (error) { }
    })();
  }, [auth, setAuth, setCurrentUser]);

  React.useEffect(() => {
    showEnterPinLock();
  }, [showEnterPinLock, auth]);

  React.useLayoutEffect(() => {
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

  // React.useEffect(() => {
  //   (async () => {
  //     const version = await VersionCheck.getLatestVersion();
  //     console.log('versiononoiononr', version);
  //   })();
  // }, []);

  // React.useLayoutEffect(() => {
  //   (async () => {
  //     await hasUserSetPinCode();
  //   })();
  // }, []);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        showEnterPinLock();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [showEnterPinLock]);

  if (auth === null) {
    return <></>;
  }

  // if (!appStateVisible || appStateVisible !== 'active') {
  //   return <></>;
  // }

  // console.log('pppppppppppppppp', pinState);

  console.log('ffffffffff', firstLaunch);
  console.log('ccccccc', auth);
  return (
    <>
      {
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
                name="Login OTP"
                component={LoginAuthorizationOtp}
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
                name="Signup Success"
                component={SignupSuccess}
                options={{
                  header: () => null,
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
                name="Reset Otp"
                component={ResetPassOtp}
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
              {/* <Stack.Screen
                name="Outlets Login"
                component={Inventory}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      CustomerSelect={true}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ paddingVertical: 36 }}
                    />
                  ),
                }}
              /> */}
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
                name="Outlets Login"
                component={OutletLogin}
                options={{ header: () => null }}
              />
              <Stack.Screen
                name="Inventory"
                component={Inventory}
                options={{
                  header: props => (
                    <HeaderInventory
                      showCustomerOutlet={true}
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Cart"
                component={Cart}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Airtime History"
                component={AirtimeHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Airtime History"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Bill History"
                component={BillHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Bill History"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Paypoint Transaction"
                component={PaypointTransactions}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Send Money History"
                component={SendMoneyHistoryScreen}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Send Money History"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Internet History"
                component={InternetHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Internet History"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Sales History"
                component={SaleHistoryScreen}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Sales History"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoices"
                component={Invoices}
                options={{
                  header: props => (
                    <InvoicesHeader navigation={props.navigation} />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice History"
                component={InvoiceHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Invoice"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Estimate History"
                component={InvoiceHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Estimates"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Outlets"
                component={OutletList}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Select Store"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Manage Outlets"
                component={ManageOutlets}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Manage Notifications"
                component={ManageNotifications}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Manage Deliveries"
                component={ManageDeliveries}
                options={{
                  header: props => (
                    <ManageDeliveriesHeader navigation={props.navigation} />
                  ),
                }}
              />
              <Stack.Screen
                name="Riders"
                component={Riders}
                options={{
                  header: props => (
                    <ManageDeliveriesHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Riders"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Delivery Routes"
                component={ManageRoutes}
                options={{
                  header: props => (
                    <ManageDeliveriesHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Delivery Routes"
                    />
                  ),
                }}
              />
              {/* <Stack.Screen
                name="Manage Deliveries"
                component={ManageDeliveries}
                options={{
                  header: props => (
                    <ManageDeliveriesHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Manage Deliveries"
                    />
                  ),
                }}
              /> */}


              <Stack.Screen
                name="Edit Outlet"
                component={EditOutlet}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Outlet"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Product Options"
                component={InventoryProductOptions}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Product Options"
                    />
                  ),
                }}
              />

              {/* <Stack.Screen
                name="Sales History"
                component={}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                    />
                  ),
                }}
              /> */}

              <Stack.Screen
                name="Quick Sale"
                component={InventoryQuickSale}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      mainHeader={{ backgroundColor: '#F5F5F5' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Payments"
                component={PaymentOptions}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                      navigation={props.navigation}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Receipts"
                component={Receipt}
                options={{
                  header: props => (
                    <ReceiptHeader navigation={props.navigation} />
                  ),
                }}
              />
              <Stack.Screen
                name="Order Receipt"
                component={OrderReceipt}
                options={{
                  header: props => (
                    <ReceiptHeader
                      navigation={props.navigation}
                      text="Go Back"
                      navigateTo="Orders"
                      onNavigate={() => {
                        props.navigation.goBack();
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="lol" //this is for products i just changed the name
                component={Products}
                options={{
                  header: props => (
                    <ProductsHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Tabs"
                component={Tabs}
                options={{
                  header: props => (<HeaderInventory
                    navigation={props.navigation}
                    addCustomer={false}
                    mainHeader={{
                      justifyContent: 'center',
                    }}
                    title="Bill History"
                  />
                  ),
                }}

              />
              <Stack.Screen
                name="Paypoint"
                component={Paypoint}
                options={{
                  header: props => (
                    <PaypointHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Internet"
                component={Internet}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Notification"
                component={Notification}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Notifications"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Airtime"
                component={Airtime}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Bills"
                component={Bills}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Utilities"
                component={Utilities}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Tv"
                component={Tv}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F1F6F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send"
                component={SendMoney}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        paddingVertical: 28,
                        backgroundColor: '#f1f6f9',
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send Money Bank"
                component={SendMoneyBank}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        paddingVertical: 28,
                        backgroundColor: '#fff',
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send Money"
                component={SendMoneyDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        paddingVertical: 28,
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Account Statement"
                component={AccountStatement}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Account Statement"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Transaction Type"
                component={TransactionType}
                options={{
                  header: props => (
                    <HeaderInventory
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={
                        {
                          // justifyContent: 'center',
                        }
                      }
                      title=""
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Outflows"
                component={Outflows}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Outflows"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sms History"
                component={SmsHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Outflows"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sms Details"
                component={SmsDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Outflows"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Inflows"
                component={Inflows}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Inflows"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Update"
                component={Update}
                options={{
                  header: () => null,
                }}
              />
              <Stack.Screen
                name="Funds Transfer"
                component={FundsTransfer}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Transfer History"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Product"
                component={AddProduct}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add new product"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Product Variants"
                component={AddProductVariants}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add product variants"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Product Variants"
                component={EditProductVariants}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit product variants"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Outlet"
                component={AddOutlet}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add new outlet"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Category"
                component={EditCategory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Category"
                component={AddCategory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add new category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Manage Store"
                component={ManageStore}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Manage Store"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Product"
                component={EditProduct}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Product"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Manage Shortcode"
                component={Shortcode}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Manage Shortcode"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Product Details"
                component={ViewProductDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Product Details"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Barcode"
                component={BarcodeScanner}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Scan barcode"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Cart Barcode"
                component={CartBarcode}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Scan barcode"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Discount Qr"
                component={DiscountQr}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Scan voucher"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send Money Status"
                component={SendMoneyStatus}
                options={{
                  header: props => (
                    <BillReceiptHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F9F9F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Received Payment Receipt"
                component={ReceivedPaymentReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Bill Details"
                component={BillDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Bill Confirmed"
                component={BillConfirmed}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Bill Status"
                component={BillStatus}
                options={{
                  header: props => (
                    <BillReceiptHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F9F9F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Airtime Status"
                component={AirtimeStatus}
                options={{
                  header: props => (
                    <BillReceiptHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F9F9F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="More"
                component={More}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Tickets"
                component={Ticket}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Event Detail"
                component={EventDetail}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Create Event"
                component={CreateEvent}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                      title="Create Event"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Event"
                component={EditEvent}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                      title="Edit Event"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Event Ticket"
                component={AddEventTicket}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                      title="Add Ticket"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Event Ticket"
                component={EditEventTicket}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                      title="Edit Ticket"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Event Tickets"
                component={EventTickets}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                      title="Event Tickets"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Ticket Details"
                component={TicketDetails}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#2268BD' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Qr"
                component={Qr}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Status"
                component={Status}
                options={{
                  header: ({ navigation }) => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Bill Receipt"
                component={BillReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Transaction History"
                component={PaypointTransactionHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Transaction History"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Pay"
                component={InvoicePay}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Send Invoice"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Ussd Offline"
                component={UssdOffline}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Ussd Offline"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send Money Receipt"
                component={SendMoneyReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Airtime Receipt"
                component={AirtimeReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Transfer Funds"
                component={TransferMoney}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Transfer Funds"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Discount"
                component={Discount}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Discount"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Verify Account"
                component={VerifyWalletAccount}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Wallet"
                component={AddWallet}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Delivery Location"
                component={DeliveryLocation}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#fff' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Money Status"
                component={AddMoneyStatus}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{ backgroundColor: '#F9F9F9' }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Transfer Money Status"
                component={TransferMoneyStatus}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Order Details"
                component={OrderDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Order Details"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Activation Type"
                component={ActivationType}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Account Activation"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Personal Information"
                component={PersonalInformation}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Tell us about yourself"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Business Information"
                component={BusinessInformation}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Tell us about your Business"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Settlement Account"
                component={SettlementInformation}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Link a Settlement Account"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="location"
                component={LocationSelect}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Select Location"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Profile Location"
                component={ProfileLocationSelect}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Select Location"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Outlet Location"
                component={OutletLocation}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Select Location"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Money"
                component={AddMoney}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add money"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Customer"
                component={EditCustomer}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Customer"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Customer Details"
                component={CustomerDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // rightComponentText="Edit Customer"
                    // rightComponentFunction={() =>
                    //   props.navigation.navigate('Edit Customer')
                    // }
                    // title="Edit Category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Customer"
                component={AddCustomer}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Customer"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Delivery"
                component={AddDelivery}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Delivery Route"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Rider"
                component={AddRider}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Rider"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Receipt"
                component={AddReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Receipt"
                component={EditReceipt}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Receipt Details"
                component={ReceiptDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Configure Receipt"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Manage Users"
                component={Users}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Manage Users"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Manage Taxes"
                component={ManageTaxes}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Manage Taxes"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Create User"
                component={AddUser}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Create User"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit User"
                component={EditUser}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit User"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Tax"
                component={EditTax}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Tax"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Add Tax"
                component={AddTax}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Create Tax"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Edit Profile"
                component={Profile}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Edit Profile"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                        backgroundColor: '#F7F8FA',
                      }}
                    // title="Settings"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Account"
                component={Account}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                        backgroundColor: '#F7F8FA',
                      }}
                    // title="Settings"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sales Channels"
                component={SalesChannels}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                        backgroundColor: '#F7F8FA',
                      }}
                    // title="Settings"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Customer Select"
                component={CustomerSelect}
                options={{
                  header: props => (
                    <InventoryHeader

                      navigation={props.navigation}
                      addCustomer={false}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Logout"
                component={Logout}
                options={{
                  header: () => null,
                }}
              />
              <Stack.Screen
                name="Receipt Preview"
                component={ReceiptPreview}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Preview"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sell Ticket Events"
                component={SellTicketEvents}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Events"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sell Ticket"
                component={SellTicket}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Sell Ticket"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Sell Event Details"
                component={SellEventDetails}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Sell Ticket Status"
                component={SellTicketStatus}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Purchase Status"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Ticket Sold History"
                component={TicketSoldHistory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Ticket Purchases"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Ticket Sold Details"
                component={TicketSoldDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Ticket Details"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Create Invoice"
                component={CreateInvoice}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Invoice Customer"
                component={InvoiceCustomerSelect}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Invoice Inventory"
                component={InvoiceInventory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title=""
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice QuickSale"
                component={InvoiceQuikeSale}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Inventory"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Discount"
                component={InvoiceDiscount}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Inventory"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Delivery"
                component={InvoiceDelivery}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    // title="Inventory"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Preview"
                component={InvoicePreview}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Preview"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Details"
                component={InvoiceDetails}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Send Invoice"
                component={InvoicePaymentSend}
                options={{
                  header: () => <SendInvoiceHeader navigateTo="Invoices" />,
                }}
              />
              <Stack.Screen
                name="Send Email Invoice"
                component={SendEmailInvoice}
                options={{
                  header: props => (
                    <InventoryHeader
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Send Email"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Invoice Order"
                component={InvoiceOrderPreview}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Preview"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Expenses"
                component={ExpensesHistory}
                options={{
                  header: props => (
                    <ExpensesHeader navigation={props.navigation} />
                  ),
                }}
              />
              <Stack.Screen
                name="Expenses Category"
                component={ExpensesCategories}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Expenses Category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Expenses Category Lov"
                component={ExpensesCategoriesLov}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Expenses Category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Create Expense Category"
                component={CreateExpenseCategory}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Expense Category"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Create Expense"
                component={CreateExpense}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title={'Expense'}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Suppliers"
                component={Suppliers}
                options={{
                  header: props => null,
                }}
              />
              <Stack.Screen
                name="Add Supplier"
                component={CreateSupplier}
                options={{
                  header: props => (
                    <InventoryHeader
                      // prevScreen={props.back.title}
                      navigation={props.navigation}
                      addCustomer={false}
                      mainHeader={{
                        justifyContent: 'center',
                      }}
                      title="Add Supplier"
                    />
                  ),
                }}
              />
            </>
          )}
        </Stack.Navigator>
      }
      <SessionExpired
        sessionStatus={sessionStatus}
        toggleSessionStatus={setSessionStatus}
      />
    </>
  );
}

export default HomeStackNavigator;
