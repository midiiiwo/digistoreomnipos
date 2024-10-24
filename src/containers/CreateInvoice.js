/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import CaretRight from '../../assets/icons/cart-right.svg';
import AddCircle from '../../assets/icons/add-circle-dark.svg';
import Input from '../components/InvoiceInput';
import { DateTimePicker } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Plus from '../../assets/icons/plus';
import Minus from '../../assets/icons/minus';
import DateIcon from '../../assets/icons/date.svg';
import { useActionCreator } from '../hooks/useActionCreator';
import Bin from '../../assets/icons/bin.svg';
import { useGetApplicableTaxes } from '../hooks/useGetApplicableTaxes';
import Loading from '../components/Loading';
import PrimaryButton from '../components/PrimaryButton';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import { useToast } from 'react-native-toast-notifications';
import _, { isEmpty } from 'lodash';
import InventoryHeader from '../components/InventoryHeader';

const SectionItem = ({ label, amount, handlePress, labelColor }) => {
  return (
    <Pressable
      onPress={() => {
        if (handlePress) {
          handlePress();
        }
      }}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          color: labelColor ? labelColor : '#505B7A',
          fontSize: 14.5,
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          color: labelColor ? labelColor : '#0E2954',
          fontSize: 14.5,
          marginLeft: 'auto',
        }}>
        {amount}
      </Text>
    </Pressable>
  );
};

const TotalSection = ({ label, amount, handlePress }) => {
  return (
    <Pressable
      onPress={() => {
        if (handlePress) {
          handlePress();
        }
      }}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopColor: '#E8EEFC',
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginTop: 6,
      }}>
      <Text
        style={{
          fontFamily: 'ReadexPro-bold',
          color: '#0E2954',
          fontSize: 15,
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: 'ReadexPro-bold',
          color: '#0E2954',
          fontSize: 15,
          marginLeft: 'auto',
        }}>
        GHS{' '}
        {new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)}
      </Text>
    </Pressable>
  );
};

const TaxItem = ({ label, appliedAs, amount, percent, handlePress }) => {
  return (
    <Pressable
      onPress={() => {
        if (handlePress) {
          handlePress();
        }
      }}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          color: '#505B7A',
          fontSize: 14,
        }}>
        {label}{' '}
        <Text
          style={{
            fontFamily: 'ReadexPro-Regular',
            color: '#505B7A',
            fontSize: 12,
            textTransform: 'capitalize',
            letterSpacing: 0.3,
          }}>
          ({percent * 100}%) {appliedAs === 'EXCLUSIVE' ? 'Excl.' : 'Incl.'}
        </Text>
      </Text>
      <Text
        style={{
          fontFamily: 'ReadexPro-Medium',
          color: '#505B7A',
          fontSize: 15,
          marginLeft: 'auto',
        }}>
        {amount}
      </Text>
    </Pressable>
  );
};

const CreateInvoice = ({ route }) => {
  const [showError, setShowError] = React.useState(false);
  const isEstimate = route?.params?.isEstimate;
  const estimateData = route?.params?.estimateData;
  const estimateAction = route?.params?.estimateAction;
  const recordNumber = route?.params?.recordNumber;
  const [invoiceNumber, setInvoiceNumber] = React.useState('');
  const [invoiceDate, setInvoiceDate] = React.useState(new Date());
  const [dueDate, setDueDate] = React.useState(new Date());
  const [notes, setNotes] = React.useState('');
  const { cart, delivery, discountPayload } = useSelector(
    state => state.invoice,
  );
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetApplicableTaxes(user.merchant);
  const {
    updateInvoiceCartItemQuantity,
    deleteItemFromInvoiceCart,
    resetInvoiceCart,
    clearInvoiceDelivery,
    clearInvoiceDiscount,
    addToInvoiceCartBatch,
    setInvoiceCustomer,
    setInvoiceDiscount,
    setInvoiceDelivery,
  } = useActionCreator();
  const { data: merchantDetails_, isLoading: isMerchantDetailsLoading } =
    useGetMerchantDetails(user.merchant);

  const { customer } = useSelector(state => state.invoice);

  const toast = useToast();

  React.useEffect(() => {
    console.log('esss', estimateData);
    if (
      (isEstimate && estimateAction === 'update' && !isEmpty(estimateData)) ||
      estimateAction === 'convert'
    ) {
      addToInvoiceCartBatch(estimateData?.cart);
      setInvoiceNumber(estimateData?.invoiceNumber);
      setInvoiceDate(new Date(estimateData?.invoiceDate));
      setDueDate(new Date(estimateData?.dueDate));
      setInvoiceCustomer(estimateData?.customer);
      if (estimateData?.discount) {
        setInvoiceDiscount({ quantity: estimateData?.discount?.discount });
      }
      if (estimateData?.delivery) {
        setInvoiceDelivery(estimateData?.delivery);
      }
      if (estimateData?.notes) {
        setNotes(estimateData?.notes);
      }
    }
    setInvoiceDelivery(estimateData?.delivery);
  }, [
    estimateAction,
    isEstimate,
    estimateData,
    addToInvoiceCartBatch,
    setInvoiceCustomer,
    setInvoiceDelivery,
    setInvoiceDiscount,
  ]);

  if (isLoading || isMerchantDetailsLoading) {
    return <Loading />;
  }

  const subTotal =
    cart &&
    cart.reduce((acc, curr) => {
      return acc + curr.amount * curr.quantity;
    }, 0);

  const taxes = data?.data?.data || [];
  const taxes_ =
    taxes.map(tax => {
      if (tax) {
        return {
          taxName: tax.tax_tag,
          amount: Number(
            (
              tax.tax_value *
              (subTotal - (discountPayload?.discount || 0))
            ).toFixed(2),
          ),
          appliedAs: tax.tax_applied_as,
          taxId: tax.tax_id,
          taxPercent: tax.tax_value,
        };
      }
    }) || [];

  const merchantDetails =
    (merchantDetails_ && merchantDetails_.data && merchantDetails_.data.data) ||
    {};

  const taxExclusiveTotal = taxes_.reduce((acc, curr) => {
    if (curr && curr.appliedAs === 'EXCLUSIVE') {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const taxInclusiveTotal = taxes_.reduce((acc, curr) => {
    if (curr && curr.appliedAs === 'INCLUSIVE') {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  console.log('discccc', discountPayload);

  const grandTotal =
    subTotal +
    taxExclusiveTotal +
    ((delivery && delivery.price) || 0) -
    ((discountPayload && discountPayload.discount) || 0);

  console.log('sss', cart);

  const imgUrl =
    'https://payments.ipaygh.com/app/webroot/img/logo/' +
    merchantDetails.merchant_brand_logo +
    '?' +
    new Date().toDateString();

  return (
    <View style={styles.main}>
      <InventoryHeader
        // prevScreen={props.back.title}
        navigation={navigation}
        addCustomer={false}
        mainHeader={{
          justifyContent: 'center',
        }}
        title={
          isEstimate
            ? estimateAction === 'update'
              ? 'Update Estimate'
              : 'New Estimate'
            : 'New Invoice'
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.6,
        }}>
        <Pressable
          style={[
            styles.customer,
            {
              borderColor: '#E8EEFC',
              flexDirection: 'row',
              backgroundColor: 'rgba(210, 224, 251, 0.2)',
            },
          ]}
          onPress={() => {
            navigation.navigate('Edit Profile');
          }}>
          <View
            style={{
              backgroundColor: '#8E8FFA',
              // padding: 8,
              // paddingHorizontal: 8,
              // paddingVertical: 8,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 4,
              marginLeft: 2,
            }}>
            <Image
              source={{ uri: imgUrl }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 500,
                borderColor: '#E8EEFC',
                borderWidth: 1.2,
              }}
            />
            {/* <Text
              style={[
                {
                  color: '#fff',
                  marginLeft: 0,
                  textTransform: 'uppercase',
                  height: 20,
                  width: 20,
                  textAlign: 'center',
                  marginBottom: 0,
                },
              ]}>
              {merchantDetails &&
                merchantDetails.merchant_name &&
                merchantDetails.merchant_name.slice(0, 1)}
            </Text> */}
          </View>
          <View style={{ maxWidth: '82%' }}>
            <Text style={[styles.customerText]}>
              {merchantDetails && merchantDetails.merchant_name}
            </Text>
            <Text
              style={[
                styles.customerText,
                {
                  fontSize: 12,
                  marginTop: 0,
                  color: '#818FB4',
                  opacity: 0.7,
                  fontFamily: 'ReadexPro-Regular',
                },
              ]}>
              {merchantDetails && merchantDetails.merchant_phone}
            </Text>
          </View>

          <CaretRight style={{ marginLeft: 'auto' }} />
        </Pressable>
        <Pressable
          style={[
            styles.customer,
            { borderColor: !customer && showError ? '#EB455F' : '#E8EEFC' },
          ]}
          onPress={() => navigation.navigate('Invoice Customer')}>
          {customer && (
            <>
              <View
                style={{
                  backgroundColor: '#8E8FFA',
                  padding: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 4,
                  marginLeft: 2,
                }}>
                <Text
                  style={[
                    {
                      color: '#fff',
                      marginLeft: 0,
                      textTransform: 'uppercase',
                      height: 20,
                      width: 20,
                      textAlign: 'center',
                    },
                  ]}>
                  {customer && customer.name && customer.name.slice(0, 1)}
                </Text>
              </View>
              <View style={{ maxWidth: '82%' }}>
                <Text style={[styles.customerText]}>
                  {customer && customer.name}
                </Text>
                <Text
                  style={[
                    styles.customerText,
                    {
                      fontSize: 12,
                      marginTop: 0,
                      color: '#818FB4',
                      fontFamily: 'ReadexPro-Regular',
                      opacity: 0.7,
                    },
                  ]}>
                  {customer && customer.phone}
                </Text>
              </View>
            </>
          )}
          {!customer && (
            <Text style={styles.customerText}>Select Customer</Text>
          )}
          <CaretRight style={{ marginLeft: 'auto' }} />
        </Pressable>
        <View style={{ marginVertical: 14 }} />
        <Input
          placeholder={isEstimate ? 'Estimate Number' : 'Invoice Number'}
          showError={showError && invoiceNumber.length === 0}
          val={invoiceNumber}
          setVal={setInvoiceNumber}
        />
        <View style={{ flexDirection: 'column', marginTop: 16 }}>
          <View>
            <Text
              style={[
                styles.customerText,
                {
                  marginLeft: 4,
                  marginBottom: 4,
                  color: '#6A7FF5',
                  letterSpacing: 0.4,
                },
              ]}>
              Invoice Date
            </Text>
            <DateTimePicker
              title={''}
              placeholder={'Invoice Date'}
              mode={'date'}
              migrate
              value={invoiceDate}
              onChange={val => {
                setInvoiceDate(val);
              }}
              dateFormat="DD MMM YYYY"
              renderInput={props => {
                return (
                  <View
                    style={{
                      borderBottomColor:
                        showError && !invoiceDate ? '#EB455F' : '#E8EEFC',
                      borderBottomWidth: 1.2,
                      paddingVertical: 8,
                      width: '100%',
                      marginBottom: 4,
                      paddingLeft: 6,
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'ReadexPro-Medium',
                        color: '#30475e',
                        fontSize: 14.2,
                        letterSpacing: 0.4,
                      }}>
                      {props.value}
                    </Text>
                    <DateIcon
                      height={28}
                      width={28}
                      style={{ marginLeft: 'auto' }}
                    />
                  </View>
                );
              }}
            />
          </View>
          <View style={{ marginVertical: 10 }} />
          <View>
            <Text
              style={[
                styles.customerText,
                {
                  marginLeft: 4,
                  marginBottom: 4,
                  color: '#6A7FF5',
                  letterSpacing: 0.4,
                },
              ]}>
              Payment Date
            </Text>
            <DateTimePicker
              title={''}
              placeholder={'Payment Due'}
              mode={'date'}
              dateFormat="DD MMM YYYY"
              migrate
              value={dueDate}
              onChange={val => {
                setDueDate(val);
              }}
              renderInput={props => {
                return (
                  <View
                    style={{
                      borderBottomColor:
                        showError && !dueDate ? '#EB455F' : '#E8EEFC',
                      borderBottomWidth: 1.2,
                      paddingVertical: 8,
                      width: '100%',
                      marginBottom: 4,
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
                    <DateIcon
                      height={28}
                      width={28}
                      style={{ marginLeft: 'auto' }}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={{ marginVertical: 10 }} />

        {cart.length > 0 && (
          <>
            <Text
              onPress={() => resetInvoiceCart()}
              style={{
                fontFamily: 'ReadexPro-Regular',
                fontSize: 14.5,
                color: '#F31559',
                padding: 8,
                textAlign: 'right',
              }}>
              Clear Items
            </Text>
            <View
              style={{
                borderColor: '#E8EEFC',
                borderWidth: 1.3,
                borderRadius: 8,
                paddingVertical: 10,
                paddingBottom: 0,
              }}>
              {cart.map(item => {
                if (!item) {
                  return;
                }
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      borderBottomColor: '#E8EEFC',
                      borderBottomWidth: 1.2,
                      paddingHorizontal: 14,
                    }}>
                    <View style={{ maxWidth: '68%' }}>
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Medium',
                          color: '#0E2954',
                          fontSize: 14.8,
                        }}>
                        {item.itemName}
                      </Text>
                      {item &&
                        item.order_item_props &&
                        !_.isEmpty(item.order_item_props) && (
                          <Text
                            style={{
                              fontFamily: 'ReadexPro-Regular',
                              color: '#9DB2BF',
                              fontSize: 12,
                              marginBottom: 10,
                              marginTop: -2.5,
                            }}>
                            {Object.values(
                              (item && item.order_item_props) || {},
                            )
                              .toString()
                              .replaceAll(',', ', ')}
                          </Text>
                        )}
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Medium',
                          color: '#505B7A',
                          fontSize: 14,
                          marginTop: 'auto',
                        }}>
                        {item.amount} * {item.quantity}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 'auto', maxWidth: '40%' }}>
                      <Text
                        style={{
                          fontFamily: 'ReadexPro-Medium',
                          color: '#505B7A',
                          fontSize: 14.5,
                          textAlign: 'right',
                          marginRight: 4,
                          marginBottom: 12,
                        }}>
                        GHS{' '}
                        {new Intl.NumberFormat('en-US', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        }).format(Number(item.amount) * Number(item.quantity))}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#fff',
                          borderRadius: 33,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: '#E8EEFC',
                          borderWidth: 1,
                          alignSelf: 'flex-end',
                        }}>
                        {item.quantity === 0 && (
                          <Pressable
                            onPress={() => {
                              if (item.quantity === 0) {
                                deleteItemFromInvoiceCart(item.id);
                                return;
                              }
                            }}
                            style={[
                              {
                                paddingVertical: 6.5,
                                paddingHorizontal: 10.5,
                              },
                            ]}>
                            <Bin height={17} width={17} stroke="#" />
                          </Pressable>
                        )}
                        {item.quantity > 0 && (
                          <Pressable
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                            }}
                            onPress={() => {
                              updateInvoiceCartItemQuantity({
                                id: item.id,
                                by: -1,
                              });
                            }}>
                            <Minus height={13} width={13} />
                          </Pressable>
                        )}
                        <View style={{ marginHorizontal: 3 }} />
                        <Text
                          style={{
                            fontFamily: 'ReadexPro-Medium',
                            color: '#272829',
                            fontSize: 14.2,
                          }}>
                          {item.quantity}
                        </Text>
                        <View style={{ marginHorizontal: 3 }} />
                        <Pressable
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                          }}
                          onPress={() => {
                            updateInvoiceCartItemQuantity({
                              id: item.id,
                              by: 1,
                            });
                          }}>
                          <Plus height={13} width={13} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
              <Pressable
                style={[
                  {
                    paddingVertical: 10,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    alignItems: 'center',
                  },
                ]}
                onPress={() => navigation.navigate('Invoice Inventory')}>
                <Text
                  style={[
                    styles.customerText,
                    {
                      fontFamily: 'ReadexPro-Medium',
                      color: 'rgba(25, 66, 216, 0.86)',
                    },
                  ]}>
                  Add line items
                </Text>
                <AddCircle
                  style={{ marginLeft: 'auto' }}
                  height={28}
                  width={28}
                />
              </Pressable>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    alignItems: 'center',
                    borderTopColor: '#E8EEFC',
                    borderTopWidth: 1.2,
                  },
                ]}>
                <Text
                  onPress={() => {
                    if (discountPayload) {
                      clearInvoiceDiscount(null);
                    } else {
                      navigation.navigate('Invoice Discount', { subTotal });
                    }
                  }}
                  style={[
                    styles.customerText,
                    {
                      fontFamily: 'ReadexPro-Medium',
                      color: discountPayload
                        ? '#EB455F'
                        : 'rgba(25, 66, 216, 0.86)',
                      fontSize: 14.8,
                      paddingVertical: 12,
                    },
                  ]}>
                  {discountPayload ? 'Clear Discount' : 'Add Discount'}
                </Text>
                <Text
                  onPress={() => {
                    if (delivery) {
                      clearInvoiceDelivery(null);
                    } else {
                      navigation.navigate('Invoice Delivery');
                    }
                  }}
                  style={[
                    styles.customerText,
                    {
                      fontFamily: 'ReadexPro-Medium',
                      color: delivery ? '#EB455F' : 'rgba(25, 66, 216, 0.86)',
                      marginLeft: 'auto',
                      fontSize: 14,
                    },
                  ]}>
                  {delivery ? 'Clear Delivery' : 'Add Delivery'}
                </Text>
              </View>
              <View
                style={{
                  borderTopColor: '#E8EEFC',
                  borderTopWidth: 1.2,
                  backgroundColor: '#F8F9FE',
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}>
                <SectionItem
                  label={'Subtotal'}
                  amount={new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(subTotal)}
                />
                {discountPayload && (
                  <SectionItem
                    label={'Discount'}
                    amount={
                      '-' +
                      new Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(
                        (discountPayload && discountPayload.discount) || 0,
                      )
                    }
                    labelColor="#47A992"
                  />
                )}
                {taxes_.map(taxItem => {
                  if (!taxItem) {
                    return <></>;
                  }
                  if (taxItem?.appliedAs === 'INCLUSIVE') {
                    return <></>;
                  }
                  return (
                    <TaxItem
                      label={`${taxItem.taxName}`}
                      amount={new Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(taxItem.amount)}
                      appliedAs={taxItem.appliedAs}
                      percent={taxItem.taxPercent}
                    />
                  );
                })}
                {delivery && (
                  <SectionItem
                    label={'Delivery'}
                    amount={new Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format((delivery && delivery.price) || 0)}
                  />
                )}

                <TotalSection label="Total" amount={grandTotal} />
                {taxes_.map(taxItem => {
                  if (!taxItem) {
                    return <></>;
                  }
                  if (taxItem?.appliedAs === 'EXCLUSIVE') {
                    return <></>;
                  }
                  return (
                    <TaxItem
                      label={`${taxItem.taxName}`}
                      amount={new Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(taxItem.amount)}
                      appliedAs={taxItem.appliedAs}
                      percent={taxItem.taxPercent}
                    />
                  );
                })}
              </View>
            </View>
          </>
        )}
        {cart.length === 0 && (
          <Pressable
            style={[
              styles.customer,
              {
                paddingVertical: 10,
                borderColor:
                  cart.length === 0 && showError ? '#EB455F' : '#E8EEFC',
              },
            ]}
            onPress={() => navigation.navigate('Invoice Inventory')}>
            <Text style={styles.customerText}>Add line items</Text>
            <AddCircle style={{ marginLeft: 'auto' }} height={30} width={30} />
          </Pressable>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { minHeight: 100, paddingTop: 14 }]}
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes/terms here..."
            placeholderTextColor="#888"
            numberOfLines={4}
          />
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLoading}
          handlePress={() => {
            const params = {
              cart,
              customer,
              merchantDetails,
              invoiceNumber,
              invoiceDate,
              dueDate,
              notes,
              user,
              subTotal,
              grandTotal,
              taxes: taxes_,
              taxExclusiveTotal,
              taxInclusiveTotal,
              delivery,
              isEstimate,
              estimateAction,
              recordNumber,
            };
            if (delivery) {
              params.delivery = delivery;
            }
            if (discountPayload) {
              params.discount = discountPayload;
            }
            if (
              !customer ||
              invoiceNumber.length === 0 ||
              !invoiceDate ||
              !dueDate ||
              cart.length === 0
            ) {
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            navigation.navigate('Invoice Preview', params);
          }}>
          {isEstimate
            ? estimateAction === 'update'
              ? 'Save Estimate'
              : 'Create Estimate'
            : 'Create Invoice'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default CreateInvoice;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  customerText: {
    fontFamily: 'ReadexPro-Regular',
    color: '#30475e',
    fontSize: 15,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  customer: {
    // backgroundColor: '#F8F9FE',
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderColor: '#E8EEFC',
    borderWidth: 1.25,
    paddingHorizontal: 10,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '89%',
  },
  inputWrapper: {
    marginTop: 12,
  },
  input: {
    padding: 12,
    color: '#30475e',
    fontSize: 14,
    fontFamily: 'ReadexPro-Regular',
    marginTop: 12,
    borderColor: '#E8EEFC',
    borderWidth: 1.3,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.7,
    paddingVertical: 14,
    // borderBottomRightRadius: 0,
    // borderBottomLeftRadius: 0,
  },
});
