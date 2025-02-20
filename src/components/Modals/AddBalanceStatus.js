/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react-native';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useGetPaymentStatus } from '../../hooks/useGetPaymentStatus';
import Modal from '../Modal';
import { View, Text, StyleSheet } from 'react-native';
import LoadingModal from '../LoadingModal';
import PrimaryButton from '../PrimaryButton';
import { useQueryClient } from 'react-query';
import ModalCancel from '../ModalCancel';

const AddBalanceStatus = ({
  paymentConfirmed,
  togglePaymentConfirmed,
  navigation,
  invoice,
}) => {
  const [poll, setPoll] = React.useState(true);
  const { user } = useSelector(state => state.auth);
  const fetchCount = React.useRef(0);
  // const { invoice } = useSelector(state => state.sale);
  const enabled = poll && invoice !== null && paymentConfirmed;

  const { setInvoice } = useActionCreator();
  // const receiveQuickPaymentMutation = useReceiveQuickPayment(setInvoice);
  const { data, isFetching } = useGetPaymentStatus(
    user.user_merchant_receivable,
    invoice?.id || invoice?.invoice,
    (_data, query) => {
      fetchCount.current = query.state.dataUpdateCount;
      return query.state.dataUpdateCount <= 3 && poll ? 10000 : false;
    },
    enabled,
  );

  const client = useQueryClient();

  // React.useEffect(() => {
  //   if (
  //     !isLoading &&
  //     data &&
  //     data.data &&
  //     data.data.message &&
  //     data.data.message !== 'new' &&
  //     data.data.message !== 'awaiting_payment' &&
  //     poll
  //   ) {
  //     setPoll(false);
  //   }
  // }, [data, isLoading, poll]);

  // if (
  //   invoice &&
  //   !isFetching &&
  //   data?.data?.message !== 'new' &&
  //   data?.data?.message !== 'awaiting_payment' &&
  //   data?.data?.message !== 'error' &&
  //   poll
  // ) {
  //   setPoll(false);
  // }

  // console.log('polllll', poll);

  return (
    <Modal
      modalState={paymentConfirmed}
      onModalHide={() => setPoll(true)}
      changeModalState={togglePaymentConfirmed}>
      <View style={[styles.modalView]}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => togglePaymentConfirmed(false)}
          // newSale
          cancel={data && data.data && data.data.message !== 'paid'}
        />
        {(isFetching || fetchCount.current <= 3) &&
          data &&
          data.data &&
          data.data.message &&
          (data.data.message === 'new' ||
            data.data.message === 'awaiting_payment' ||
            !invoice ||
            !data) && <LoadingModal />}
        {!data && <LoadingModal />}
        {!isFetching && data && data.data && (
          <View style={styles.paymentLabel}>
            {data &&
              data.data &&
              data.data.message === 'paid' &&
              data.data.status == '0' && (
                <>
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Regular',
                      fontSize: 15,
                      color: '#30475e',
                      marginBottom: 12,
                    }}>
                    Ref: #{invoice && (invoice.id || invoice.invoice)}
                  </Text>
                  <Lottie
                    source={require('../../lottie/payment-success.json')}
                    autoPlay
                    autoSize
                    loop={false}
                    style={styles.lottie}
                  />
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Regular',
                      fontSize: 16,
                      color: '#5C6E91',
                      textAlign: 'center',
                      marginHorizontal: 12,
                      width: '80%',
                    }}>
                    SUCCESSFULLY PAID
                  </Text>
                </>
              )}
            {((data && data.data && data.data.message === 'failed') ||
              data.data.status != 0) && (
              <Lottie
                source={require('../../lottie/116089-payment-failed.json')}
                autoPlay
                autoSize
                loop={false}
                style={styles.lottie}
              />
            )}
            {((fetchCount.current > 3 &&
              data &&
              data.data &&
              (data.data.message === 'new' ||
                data.data.message === 'awaiting_payment')) ||
              data.data.status != 0) && (
              <>
                <Lottie
                  source={require('../../lottie/paymentLoading.json')}
                  autoPlay
                  autoSize
                  loop={true}
                  style={styles.lottie}
                />
                <Text
                  style={[
                    styles.status,
                    {
                      textAlign: 'center',
                      fontFamily: 'ReadexPro-Regular',
                      marginBottom: 14,
                    },
                  ]}>
                  Sorry, payment for this transaction is pending confirmation.
                  You will be notified via Email/SMS once payment is confirmed.
                </Text>
                <PrimaryButton
                  handlePress={() => {
                    togglePaymentConfirmed(false);

                    // togglePaymentDetails(true);
                  }}
                  style={styles.goToReceipt}>
                  {/* <Text style={styles.goToReceiptText}>Restart payment</Text> */}
                  Close
                  {/* <ArrowRight /> */}
                </PrimaryButton>
              </>
            )}

            {data &&
              data.data &&
              data.data.message &&
              data.data.message === 'paid' && (
                <View style={{ flexDirection: 'row' }}>
                  <PrimaryButton
                    handlePress={() => {
                      togglePaymentConfirmed(false);
                      setInvoice(null);
                      client.invalidateQueries('customer-details');
                    }}
                    style={styles.goToReceipt}>
                    {/* <Text style={styles.goToReceiptText}>Sale Receipt</Text> */}
                    {/* <ArrowRight /> */}
                    Close
                  </PrimaryButton>
                </View>
              )}
            {data &&
              data.data &&
              (data.data.message === 'failed' ||
                data.data.message === 'error' ||
                data.data.status != 0) && (
                <PrimaryButton
                  handlePress={() => {
                    togglePaymentConfirmed(false);
                    setInvoice(null);
                    // togglePaymentDetails(true);
                  }}
                  style={styles.goToReceipt}>
                  {/* <Text style={styles.goToReceiptText}>Restart payment</Text> */}
                  Restart payment
                  {/* <ArrowRight /> */}
                </PrimaryButton>
              )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    width: '100%',
    alignItems: 'center',
    marginTop: 42,
  },
  choose: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#30475E',
  },
  amount: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 38,
    marginVertical: 12,
    color: '#30475E',
  },
  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  lottie: {
    height: 150,
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
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
    justifyContent: 'space-between',
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
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    marginTop: 19,
    paddingVertical: 16,
  },
  goToReceiptText: {
    color: '#1942D8',
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'Inter-Medium',
    letterSpacing: -0.2,
  },
  totalAmount: {
    fontFamily: 'JetBrainsMono-Medium',
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

export default AddBalanceStatus;
