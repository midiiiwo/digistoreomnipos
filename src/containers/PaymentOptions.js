/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

import Modal from '../components/Modal';
import PaymentCard from '../components/PaymentCard';
import { RadioButtonProvider } from '../context/RadioButtonContext';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import CustomerDetailsModal from '../components/Modals/CustomerDetails';
import CashConfirm from '../components/Modals/CashConfirm';
import PaymentDetailsModal from '../components/Modals/PaymentDetails';
import PaymentConfirmedModal from '../components/Modals/PaymentConfirmed';
import PaymentInstructionsModal from '../components/Modals/PaymentInstructions';
import CashModal from '../components/Modals/CashModal';
import CashPaymentStatus from '../components/Modals/CashPaymentStatus';
import { useGetAllActiveVendors } from '../hooks/useGetAllActiveVendors';
import { useToast } from 'react-native-toast-notifications';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import ActivationDialog from '../components/ActivationDialog';
import OfflinePayment from '../components/Modals/OfflinePayment';
import _ from 'lodash';
import StoreCredit from '../components/Modals/StoreCredit';
import StoreCreditStatus from '../components/Modals/StoreCreditStatus';
import PayLater from '../components/Modals/PayLater';
import OtpModal from '../components/Modals/OtpModal';
import PartialPayModal from '../components/Modals/PartialPayModal';
import PartialPayCashConfirm from '../components/Modals/PartialPayCashConfirm';
import PartialPayMomoConfirm from '../components/Modals/PartialPayMomoConfirm';
import PatPayMomoOtp from '../components/Modals/PatPayMomoOtp';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F1F6F9',
  },
  title: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  choose: {
    fontFamily: 'ReadexPro-bold',
    fontSize: 22,
    color: '#30475E',
  },
  amount: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 38,
    marginVertical: 3,
    color: '#30475E',
  },
  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 26,
    borderRadius: 8,
  },
  group1: {
    flexDirection: 'row',
  },
  group2: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  textInput: {
    borderColor: 'rgba(96, 126, 170, 0.4)',
    borderWidth: 0.4,
    width: '100%',
    paddingHorizontal: 12,
    borderRadius: 2,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#30475E',
  },
  textInputWrapper: {
    width: '100%',
    paddingRight: 38,
  },
  option1Text: {
    color: 'rgba(48, 71, 94, 0.9)',
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
  },
  customerName: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  customerNumber: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 6,
  },
  paymentReviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paymentReviewItemName: {
    fontFamily: 'JetBrainsMono-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 15,
  },
  paymentReviewItemAmount: {
    fontFamily: 'JetBrainsMono-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 16,
    marginLeft: 'auto',
  },
  margin: {
    marginTop: 18,
    borderTopColor: 'solid rgba(146, 169, 189, 0.4)',
    borderTopWidth: 0.4,
    marginBottom: 6,
  },
  primary: { marginTop: 28 },
  container: {
    paddingVertical: 5,   // Reduce padding between items
    marginVertical: 2,
    // justifyContent: 'space-between',
  },
  paymentLabel: { width: '100%', alignItems: 'center' },
  paymentReceivedLabel: { width: '100%', alignItems: 'center', paddingTop: 40 },
  paymentReceivedText: {
    color: '#30475E',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    marginTop: 18,
  },
  goToReceipt: {
    flexDirection: 'row',
    marginTop: 70,
    alignItems: 'center',
  },
  goToReceiptText: {
    color: '#1942D8',
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'JetBrainsMono-Regular',
    letterSpacing: -0.2,
  },
  totalAmount: {
    fontFamily: 'Inter-Medium',
    fontSize: 22,
    marginTop: 14,
    color: '#30475E',
  },
  invoice: {
    color: '#30475E',
    textAlign: 'center',
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});

const nonDeliveryOptions = [
  'CASH',
  'CREDITBAL',
  'DEBITBAL',
  'BANK',
  'PATPAY',
  'OFFCARD',
  'OFFMOMO',
];

const PaymentOptions = ({ navigation }) => {
  const [paymentDetails, togglePaymentDetails] = React.useState(false);
  const [paymentPreview, togglePaymentPreview] = React.useState(false);
  const [paymentInstructions, togglePaymentInstructions] =
    React.useState(false);
  // const [paymentDone, togglePaymentDone] = React.useState(false);
  const [paymentConfirmed, togglePaymentConfirmed] = React.useState(false);
  const [cashPaymentStatus, toggleCashPaymentStatus] = React.useState(false);
  const [cashModal, toggleCashModal] = React.useState(false);
  const [patModal, togglePatModal] = React.useState(false);
  const [cashConfirmed, toggleCashConfirmed] = React.useState(false);
  const [patPayConfirmed, togglePatPayConfirmed] = React.useState(false);
  const [patPayMomoConfirmed, togglePatPayMomoConfirmed] =
    React.useState(false);
  const [offline, toggleOffline] = React.useState(false);
  const [otpModal, toggleOtpModal] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [patOtpModal, togglePatOtpModal] = React.useState(false);
  const [patOtp, setPatOtp] = React.useState('');
  const [payment, setPayment] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [receiptNumber, setReceiptNumber] = React.useState('');
  const [patPaymentNumber, setPatPaymentNumber] = React.useState('');
  const [paymentType, setPaymentType] = React.useState();

  const toast = useToast();
  const { delivery, totalAmount, customer, orderCheckoutTaxes } = useSelector(
    state => state.sale,
  );

  console.log('cusssss', customer);
  const [dialog, setDialog] = React.useState(false);
  const { user } = useSelector(state => state.auth);
  const { quickSaleInAction, subTotal } = useSelector(state => state.quickSale);
  // const { isLoading } = useGetApplicableTaxes(user.merchant);
  const { data: activeVendors, isActiveVendorsLoading } =
    useGetAllActiveVendors();
  const [storeCreditVisible, toggleStoreCredit] = React.useState(false);
  const [storeCreditStatus, toggleStoreCreditStatus] = React.useState(false);
  const [payLaterVisible, togglePayLater] = React.useState(false);
  // const [payLaterStatus, togglePayLaterStatus] = React.useState(false);
  const { data: step_, isLoading: stepLoading } = useGetCurrentActivationStep(
    user.merchant,
  );

  console.log('odertetererstadg', orderCheckoutTaxes);

  const [charge, setCharge] = React.useState('');

  if (isActiveVendorsLoading || stepLoading) {
    return (
      <Modal
        modalState={paymentInstructions}
        changeModalState={togglePaymentInstructions}>
        <View style={[styles.modalView, { height: 100 }]}>
          <Loading />
        </View>
      </Modal>
    );
  }

  const payOptions = [];
  ((activeVendors && activeVendors.data && activeVendors.data.data) || []).map(
    i => {
      if (!i) {
        return;
      }
      if (i && i.biller_type === 'recvpay') {
        payOptions.push(i);
      }
    },
  );

  // const taxes = data.data.data.map(tax => {
  //   return {
  //     taxName: tax.tax_name,
  //     amount: JSON.parse((tax.tax_value * subTotal).toFixed(2)),
  //   };
  // });
  // const total =
  //   subTotal +
  //   (!quickSaleInAction
  //     ? (addTaxes && taxes.reduce((acc, curr) => acc + curr.amount, 0)) +
  //       (delivery && (JSON.parse(delivery.price.toFixed(2)) || 0))
  //     : 0);

  console.log('dddddd', delivery.value);

  let options = payOptions
    .map(i => {
      if (
        quickSaleInAction &&
        (i.biller_id === 'CREDITBAL' || i.biller_id === 'DEBITBAL')
      ) {
        return;
      }
      if (
        delivery &&
        delivery.value === 'DELIVERY' &&
        delivery.delivery_config === 'IPAY'
      ) {
        if (nonDeliveryOptions.includes(i.biller_id)) {
          return;
        }
        return i;
      }
      return i;
    })
    .filter(i => i);

  // const ecobankOmissions = [
  //   'INVPAY',
  //   'BANK',
  //   'OFFCARD',
  //   'OFFMOMO',
  //   'VISAG',
  //   'CASH',
  // ];

  const offlinePaymentOptions = ['OFFCARD', 'OFFMOMO', 'BANK'];

  // options = options.filter(i => {
  //   if (user.user_merchant_agent == 6) {
  //     return !ecobankOmissions.includes(i.biller_id);
  //   }
  //   return i;
  // });

  const step = step_?.data?.data?.account_setup_step;

  console.log('usssss', user);

  return (
    <View style={styles.main}>
      <ActivationDialog dialog={dialog} setDialog={setDialog} />
      <View style={styles.title}>
        <Text style={styles.choose}>
          Pay GHS{' '}
          {new Intl.NumberFormat().format(
            quickSaleInAction ? subTotal : Number(totalAmount.toFixed(2)),
          )}
        </Text>
        {/* <Text style={styles.totalAmount}>
          GHS{' '}
          {quickSaleInAction ? subTotal : JSON.parse(totalAmount.toFixed(2))}
        </Text> */}
      </View>
      <View style={styles.paymentLabel}>
        <FlatList
          style={styles.flatgrid}
          contentContainerStyle={styles.container}
          data={options.filter(
            i => i?.biller_id !== 'INVPAY' && i?.biller_id !== 'DISC',
            // &&
            // i?.biller_id !== 'PATPAY',
          )}
          scrollEnabled={true}
          numColumns={3}
          // itemDimension={100}
          renderItem={({ item }) => {
            /**
             * @todo
             * implement partial payment
             */
            if (
              // item.biller_id === 'PATPAY' ||
              item.biller_id === 'DISC' ||
              item.biller_id === 'INVPAY'
            ) {
              return;
            }
            return (
              <PaymentCard
                handlePress={() => {
                  if (!user.user_permissions.includes(item.biller_id)) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }

                  if (
                    item.biller_id === 'CASH' &&
                    user.user_permissions.includes(item.biller_id)
                  ) {
                    setPayment(item.biller_id);
                    toggleCashModal(true);
                    return;
                  }
                  if (
                    offlinePaymentOptions.includes(item.biller_id) &&
                    user.user_permissions.includes(item.biller_id)
                  ) {
                    setPayment(item.biller_id);
                    toggleOffline(true);
                    return;
                  }
                  // console.log('custetererere', customer);
                  if (item.biller_id === 'CREDITBAL') {
                    if (!customer || _.isEmpty(customer)) {
                      toast.show(
                        'Please add a customer to proceed with Store Credit',
                        { placement: 'top', type: 'danger' },
                      );
                      navigation.navigate('Customer Select');
                      return;
                    }
                    toggleStoreCredit(true);
                    return;
                  }
                  // console.log('custetererere', customer);
                  if (item.biller_id === 'PATPAY') {
                    if (!customer || _.isEmpty(customer)) {
                      toast.show(
                        'Please add a customer to proceed with Partial Payment',
                        { placement: 'top', type: 'danger' },
                      );
                      navigation.navigate('Customer Select');
                      return;
                    }
                    togglePatModal(true);
                    return;
                  }
                  if (item.biller_id === 'DEBITBAL') {
                    if (!customer || _.isEmpty(customer)) {
                      toast.show(
                        'Please add a customer to proceed with Pay Later',
                        { placement: 'top', type: 'danger' },
                      );
                      navigation.navigate('Customer Select');
                      return;
                    }
                    togglePayLater(true);
                    return;
                  }
                  if (
                    step &&
                    step != 8
                    // step == 1
                  ) {
                    setDialog(true);
                    return;
                  }

                  if (item.biller_id === 'INVPAY') {
                    navigation.navigate('Invoice Pay', {
                      amount: quickSaleInAction
                        ? subTotal
                        : Number(totalAmount.toFixed(2)),
                    });

                    return;
                  }
                  if (item.biller_id === 'OFFUSSD') {
                    navigation.navigate('Ussd Offline', {
                      amount: quickSaleInAction
                        ? subTotal
                        : Number(totalAmount?.toFixed(2)),
                    });

                    return;
                  }
                  setPayment(item.biller_id);
                  togglePaymentDetails(true);
                }}
                payment={item.biller_id}
                path={item.biller_name}
              />
            );
          }}
          keyExtractor={item => {
            return item.biller_name;
          }}
        />
      </View>
      <View style={styles.modalContainer}>
        <RadioButtonProvider>
          {/* {paymentDetails && ( */}
          <PaymentDetailsModal
            navigation={navigation}
            paymentDetails={paymentDetails}
            togglePaymentDetails={togglePaymentDetails}
            togglePaymentPreview={togglePaymentPreview}
            toggleCashModal={toggleCashModal}
            paymentType={payment}
            otpModal={otpModal}
            toggleOtpModal={toggleOtpModal}
            payment={payment}
          />
          {/* )} */}
        </RadioButtonProvider>
      </View>
      {/* <View style={styles.modalContainer}> */}
      {/* {paymentPreview && ( */}
      <CustomerDetailsModal
        navigation={navigation}
        paymentPreview={paymentPreview}
        total={totalAmount}
        subTotal={subTotal}
        payment={payment}
        togglePaymentPreview={togglePaymentPreview}
        togglePaymentDone={togglePaymentInstructions}
        customerDetails={paymentPreview}
        setCharge={setCharge}
        otp={otp}
      />
      <OfflinePayment
        navigation={navigation}
        offline={offline}
        toggleOffline={toggleOffline}
        togglePaymentPreview={togglePaymentPreview}
        toggleCashConfirmed={toggleCashConfirmed}
        paymentType={payment}
        amount={amount}
        setAmount={setAmount}
        receiptNumber={receiptNumber}
        setReceiptNumber={setReceiptNumber}
        total={totalAmount}
      />
      {/* )} */}
      {/* </View> */}
      {/* <View style={styles.modalContainer}> */}
      {/* {paymentInstructions && ( */}
      <PaymentInstructionsModal
        navigation={navigation}
        paymentInstructions={paymentInstructions}
        togglePaymentInstructions={togglePaymentInstructions}
        togglePaymentConfirmed={togglePaymentConfirmed}
        cashAmount={amount}
      />
      {/* )} */}
      {/* </View> */}
      {/* <View style={styles.modalContainer}>
        <Modal modalState={paymentDone} changeModalState={togglePaymentDone}>
          <View style={styles.modalView}>
          </View>
        </Modal>
      </View> */}

      {/* <View style={styles.modalContainer}> */}
      {/* {paymentConfirmed && ( */}
      <PaymentConfirmedModal
        paymentConfirmed={paymentConfirmed}
        togglePaymentConfirmed={togglePaymentConfirmed}
        navigation={navigation}
        togglePaymentDetails={togglePaymentDetails}
        cashAmount={amount}
        charge={charge}
      />
      {/* )} */}
      {/* </View> */}

      {/* <View style={styles.modalContainer}> */}
      {/* {cashModal && ( */}
      <CashModal
        cashModal={cashModal}
        toggleCashModal={toggleCashModal}
        toggleCashConfirmed={toggleCashConfirmed}
        payment={payment}
        total={totalAmount}
        amount={amount}
        setAmount={setAmount}
        navigation={navigation}
        cashConfirmed={cashConfirmed}
      // togglePaymentDetails={togglePaymentDetails}
      />
      <PartialPayModal
        cashModal={patModal}
        toggleCashModal={togglePatModal}
        toggleCashConfirmed={togglePatPayConfirmed}
        togglePatPayMomoConfirmed={togglePatPayMomoConfirmed}
        payment={payment}
        total={totalAmount}
        amount={amount}
        setAmount={setAmount}
        navigation={navigation}
        cashConfirmed={patPayConfirmed}
        patPaymentNumber={patPaymentNumber}
        setPatPaymentNumber={setPatPaymentNumber}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        togglePatOtpModal={togglePatOtpModal}
      // togglePaymentDetails={togglePaymentDetails}
      />
      {/* )} */}
      {/* </View> */}
      {/* <View style={styles.modalContainer}> */}
      {/* {cashConfirmed && ( */}
      <CashConfirm
        cashConfirmed={cashConfirmed}
        toggleCashConfirmed={toggleCashConfirmed}
        payment={payment}
        amount={amount}
        navigation={navigation}
        toggleCashPaymentStatus={toggleCashPaymentStatus}
        receiptNumber={receiptNumber}
      />
      <PartialPayCashConfirm
        cashConfirmed={patPayConfirmed}
        toggleCashConfirmed={togglePatPayConfirmed}
        payment={payment}
        amount={amount}
        navigation={navigation}
        toggleCashPaymentStatus={toggleCashPaymentStatus}
        receiptNumber={receiptNumber}
      />
      <PartialPayMomoConfirm
        paymentType={paymentType}
        patPaymentNumber={patPaymentNumber}
        cashConfirmed={patPayMomoConfirmed}
        toggleCashConfirmed={togglePatPayMomoConfirmed}
        payment={payment}
        amount={amount}
        navigation={navigation}
        toggleCashPaymentStatus={toggleCashPaymentStatus}
        receiptNumber={receiptNumber}
        togglePaymentDone={togglePaymentInstructions}
        otp={patOtp}
      />
      {/* )} */}
      {/* </View> */}
      {/* <View style={styles.modalContainer}> */}
      {/* {cashPaymentStatus && ( */}
      <CashPaymentStatus
        cashPaymentStatus={cashPaymentStatus}
        toggleCashPaymentStatus={toggleCashPaymentStatus}
        payment={payment}
        navigation={navigation}
        cashAmount={amount}
      // navigation={navigation}
      // togglePaymentDetails={togglePaymentDetails}
      />
      <StoreCredit
        storeCreditVisible={storeCreditVisible}
        toggleStoreCredit={toggleStoreCredit}
        subTotal={subTotal}
        total={totalAmount}
        togglePaymentDone={toggleStoreCreditStatus}
      />
      <PayLater
        payLaterVisible={payLaterVisible}
        togglePayLater={togglePayLater}
        subTotal={subTotal}
        total={totalAmount}
        togglePaymentDone={toggleStoreCreditStatus}
      />
      <StoreCreditStatus
        storeCreditStatus={storeCreditStatus}
        toggleStoreCreditStatus={toggleStoreCreditStatus}
        cashAmount={amount}
        charge={charge}
      />
      <OtpModal
        dialog={otpModal}
        togglePaymentPreview={togglePaymentPreview}
        setDialog={toggleOtpModal}
        otp={otp}
        setOtp={setOtp}
      />
      <PatPayMomoOtp
        dialog={patOtpModal}
        togglePaymentPreview={togglePatPayMomoConfirmed}
        setDialog={togglePatOtpModal}
        otp={patOtp}
        setOtp={setPatOtp}
        phone={patPaymentNumber}
      />

      {/* )} */}
      {/* </View> */}
    </View>
  );
};

export default PaymentOptions;
