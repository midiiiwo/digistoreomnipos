/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useEditReceipt } from '../hooks/useEditReceiptDetails';
import { useSelector } from 'react-redux';
import { Checkbox } from 'react-native-ui-lib';
import Loading from '../components/Loading';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';

import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'id':
      return { ...state, receiptId: action.payload };
    case 'header':
      return { ...state, receiptHeader: action.payload };
    case 'footer':
      return { ...state, receiptFooter: action.payload };
    case 'show_business':
      return { ...state, showBusiness: action.payload };
    case 'show_phone':
      return { ...state, showPhone: action.payload };
    case 'show_email':
      return { ...state, showEmail: action.payload };
    case 'show_address':
      return { ...state, showAddress: action.payload };
    case 'show_logo':
      return { ...state, showLogo: action.payload };
    case 'show_tin':
      return { ...state, showTin: action.payload };
    case 'show_attendant':
      return { ...state, showAttendant: action.payload };
    case 'show_customer':
      return { ...state, showCustomer: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const CheckItem = ({
  value,
  onValueChange,
  placeholder,
  showBorder = true,
}) => {
  return (
    <Pressable
      onPress={onValueChange}
      style={{
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomColor: '#ddd',
        borderBottomWidth: showBorder ? 0.6 : 0,
        // borderTopColor: '#ddd',
        // borderTopWidth: 0.7,
        // marginVertical: 4,
      }}>
      <Text
        style={{
          fontFamily: 'SFProDisplay-Regular',
          color: '#30475e',
          fontSize: 18,
          letterSpacing: 0.2,
        }}>
        {placeholder}
      </Text>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color="rgba(25, 66, 216, 0.9)"
        style={{
          color: '#204391',
          alignSelf: 'center',
          marginRight: 8,
          marginLeft: 'auto',
        }}

        // label="By clicking to create an account, you agree to iPay's Terms of Use
        // and Privacy Policy"
      />
    </Pressable>
  );
};

const ReceiptDetails = () => {
  const { user } = useSelector(state => state.auth);
  const [status, setStatus] = React.useState();
  const [deleteStatus, setDeleteStatus] = React.useState();
  const client = useQueryClient();
  const [state, dispatch] = React.useReducer(reducer, {
    receiptId: '',
    receiptHeader: '',
    receiptFooter: '',
    showBusiness: null,
    showPhone: null,
    showEmail: null,
    showAddress: null,
    showLogo: null,
    showTin: null,
    showAttendant: null,
    showCustomer: null,
  });
  const { data, isLoading } = useGetReceiptDetails(user.merchant);
  const navigation = useNavigation();

  // const { mutate: deleteReceipt } = useDeleteReceiptConfig(setDeleteStatus);

  const { mutate, isLoading: editingReceipt } = useEditReceipt(i => {
    if (i) {
      setStatus(i);
      client.invalidateQueries('get-receipt-details');
    }
  });

  const toast = useToast();

  React.useEffect(() => {
    if (data && data.data && data.data.data && data.data.status == 0) {
      const receiptItem = data && data.data && data.data.data;
      dispatch({
        type: 'update_all',
        payload: {
          receiptId: receiptItem.receipt_id,
          receiptHeader: receiptItem.receipt_header,
          receiptFooter: receiptItem.receipt_footer,
          showBusiness:
            receiptItem.receipt_show_business === 'YES' ? true : false,
          showPhone: receiptItem.receipt_show_phone === 'YES' ? true : false,
          showEmail: receiptItem.receipt_show_email === 'YES' ? true : false,
          showAddress:
            receiptItem.receipt_show_address === 'YES' ? true : false,
          showLogo: receiptItem.receipt_show_logo === 'YES' ? true : false,
          showTin: receiptItem.receipt_show_tin === 'YES' ? true : false,
          showAttendant:
            receiptItem.receipt_show_attendant === 'YES' ? true : false,
          showCustomer:
            receiptItem.receipt_show_customer === 'YES' ? true : false,
        },
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.status == 0) {
        toast.show(deleteStatus.message, { placement: 'top', type: 'success' });
      } else {
        toast.show(deleteStatus.message, { placement: 'top', type: 'danger' });
      }
      setDeleteStatus(null);
    }
  }, [toast, deleteStatus]);

  React.useEffect(() => {
    if (status) {
      if (status.status == 0) {
        toast.show(status.message, { placement: 'top', type: 'success' });
      } else {
        toast.show(status.message, { placement: 'top', type: 'danger' });
      }
      setStatus(null);
    }
  }, [toast, status]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <View style={styles.main}>
      <View style={{ paddingHorizontal: 22, marginBottom: 13 }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            fontSize: 26,
            color: '#002',
          }}>
          Configure Receipt
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Input
            placeholder="Receipt Header"
            val={state.receiptHeader}
            setVal={text => {
              dispatch({
                type: 'header',
                payload: text,
              });
            }}
          />
          <Input
            placeholder="Receipt Footer"
            val={state.receiptFooter}
            setVal={text => {
              dispatch({
                type: 'footer',
                payload: text,
              });
            }}
          />
          <View style={{ marginTop: 12, paddingHorizontal: 6 }}>
            <CheckItem
              value={state.showBusiness}
              onValueChange={() => {
                dispatch({
                  type: 'show_business',
                  payload: !state.showBusiness,
                });
              }}
              placeholder="Business Name"
            />
            <CheckItem
              value={state.showPhone}
              onValueChange={() => {
                dispatch({
                  type: 'show_phone',
                  payload: !state.showPhone,
                });
              }}
              placeholder="Work Phone"
            />
            <CheckItem
              value={state.showEmail}
              onValueChange={() => {
                dispatch({
                  type: 'show_email',
                  payload: !state.showEmail,
                });
              }}
              placeholder="Email"
            />
            <CheckItem
              value={state.showAddress}
              onValueChange={() => {
                dispatch({
                  type: 'show_address',
                  payload: !state.showAddress,
                });
              }}
              placeholder="Address"
            />
            <CheckItem
              value={state.showLogo}
              onValueChange={() => {
                dispatch({
                  type: 'show_logo',
                  payload: !state.showLogo,
                });
              }}
              placeholder="Logo"
            />
            <CheckItem
              value={state.showTin}
              onValueChange={() => {
                dispatch({
                  type: 'show_tin',
                  payload: !state.showTin,
                });
              }}
              placeholder="Tin"
            />
            <CheckItem
              value={state.showAttendant}
              onValueChange={() => {
                dispatch({
                  type: 'show_attendant',
                  payload: !state.showAttendant,
                });
              }}
              placeholder="Served By"
            />
            <CheckItem
              value={state.showCustomer}
              onValueChange={() => {
                dispatch({
                  type: 'show_customer',
                  payload: !state.showCustomer,
                });
              }}
              placeholder="Customer Details"
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.btnWrapper,
          { flexDirection: 'row', justifyContent: 'center' },
        ]}>
        <PrimaryButton
          style={[styles.btn, { width: '45%' }]}
          disabled={editingReceipt}
          handlePress={() => {
            mutate({
              id: state.receiptId,
              header: state.receiptHeader,
              footer: state.receiptFooter,
              show_business: state.showBusiness ? 'YES' : 'NO',
              show_phone: state.showPhone ? 'YES' : 'NO',
              show_email: state.showEmail ? 'YES' : 'NO',
              show_address: state.showAddress ? 'YES' : 'NO',
              show_logo: state.showLogo ? 'YES' : 'NO',
              show_tin: state.showTin ? 'YES' : 'NO',
              show_performed_by: state.showAttendant ? 'YES' : 'NO',
              show_customer_info: state.showCustomer ? 'YES' : 'NO',
              merchant: user.merchant,
              mod_by: user.login,
            });
          }}>
          {editingReceipt ? 'Processing' : 'Save'}
        </PrimaryButton>
        <View style={{ marginHorizontal: 3 }} />
        <PrimaryButton
          style={[styles.btn, { width: '45%', backgroundColor: '#30475e' }]}
          disabled={editingReceipt}
          handlePress={() => {
            navigation.navigate('Receipt Preview', {
              state,
            });
          }}>
          Preview
        </PrimaryButton>
      </View>
    </View>
  );
};

export default ReceiptDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: Dimensions.get('window').height * 0.1,
  },
  delete: {
    flex: 1,
    backgroundColor: 'rgba(234, 234, 234, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: 2.5,
    borderRadius: 4,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    // flexDirection: 'row',
    // paddingHorizontal: 12,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
    marginRight: 2.5,
  },
});
