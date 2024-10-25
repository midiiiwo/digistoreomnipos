/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  InteractionManager,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import ContactIcon from '../../../assets/icons/contact.svg';
import { PERMISSIONS, check, request } from 'react-native-permissions';
import { selectContactPhone } from 'react-native-select-contact';
import { Checkbox, Picker as RNPicker } from 'react-native-ui-lib';

import PrimaryButton from '../PrimaryButton';
import Bin from '../../../assets/icons/delcross';
import Input from '../Input';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useGetExpenseCategoriesLov } from '../../containers/ExpenseCategoryLov';
import Picker from '../Picker';

const reducer = (state, action) => {
  switch (action.type) {
    case 'number':
      return { ...state, number: action.payload };
    case 'amount':
      return { ...state, amount: action.payload };
    case 'category':
      return { ...state, category: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function BuyArtimeSheet(props) {
  const [showError, setShowError] = React.useState(false);
  const [checkAsExpense, setCheckAsExpense] = React.useState(false);

  const next = React.useRef(false);
  const { user } = useSelector(state => state.auth);

  const [state, dispatch] = React.useReducer(reducer, {
    number: '',
    amount: 0,
    category: null,
  });

  const { data } = useGetExpenseCategoriesLov(user?.merchant);

  const toast = useToast();

  const applyContactInfo = contact => {
    if (contact) {
      const phone = contact.selectedPhone.number
        .replace('+233', '0')
        .replaceAll(' ', '')
        .replaceAll('-', '');
      handleTextChange({ type: 'number', payload: phone });
    }
  };

  React.useEffect(() => {
    dispatch({
      type: 'update_all',
      payload: {
        number: (props.payload && props.payload.number) || '',
        amount: (props.payload && props.payload.amount) || '',
      },
    });
  }, [props.payload]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  const categoriesData = data?.data?.data;

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      openAnimationConfig={{
        bounciness: 0,
      }}
      closeOnTouchBackdrop={false}
      containerStyle={styles.containerStyle}
      onClose={() => {
        if (next.current) {
          InteractionManager.runAfterInteractions(() =>
            SheetManager.show('confirmAirtimePayment', {
              payload: {
                airtime: props.payload.airtimeCode,
                amount: state.amount,
                state,
                navigation: props.payload.navigation,
                checkAsExpense,
                airtimeCategory: state.category,
              },
            }),
          );
          next.current = false;
        }
      }}
      indicatorStyle={styles.indicatorStyle}>
      <View>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'Inter-Medium',
              paddingTop: 18,
              fontSize: 16,
              textAlign: 'center',
            }}>
            {props.payload.airtime}
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('buyAirtime')}
            style={{ marginLeft: 'auto', paddingVertical: 12 }}>
            <Bin />
          </Pressable>
        </View>

        <View style={styles.main}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Input
              placeholder="Receipient number"
              val={state.number}
              setVal={text =>
                handleTextChange({
                  type: 'number',
                  payload: text.replaceAll(' ', '').replaceAll('-', ''),
                })
              }
              style={{ flex: 1, backgroundColor: '#fff' }}
              showError={showError && state.number.length === 0}
              keyboardType="phone-pad"
            />
            <Pressable
              onPress={async () => {
                if (Platform.OS === 'ios') {
                  check(PERMISSIONS.IOS.CONTACTS)
                    .then(async status => {
                      if (status !== 'granted') {
                        request(PERMISSIONS.IOS.CONTACTS).then(async res => {
                          if (res === 'granted') {
                            const contact = await selectContactPhone();
                            applyContactInfo(contact);
                          }
                        });
                      } else if (status === 'granted') {
                        const contact = await selectContactPhone();
                        applyContactInfo(contact);
                      }
                    })
                    .catch(err => console.error(err));
                } else if (Platform.OS === 'android') {
                  check(PERMISSIONS.ANDROID.READ_CONTACTS).then(
                    async status => {
                      if (status !== 'granted') {
                        request(PERMISSIONS.ANDROID.READ_CONTACTS).then(
                          async res => {
                            if (res === 'granted') {
                              const contact = await selectContactPhone();
                              applyContactInfo(contact);
                            }
                          },
                        );
                      } else if (status === 'granted') {
                        const contact = await selectContactPhone();
                        if (contact) {
                          applyContactInfo(contact);
                        }
                      }
                    },
                  );
                }
              }}
              style={{
                paddingLeft: 14,
                paddingVertical: 6,
                marginTop: 4,
              }}>
              <ContactIcon height={34} width={34} />
            </Pressable>
          </View>

          <Input
            placeholder="Amount"
            val={state.amount}
            setVal={text =>
              handleTextChange({
                type: 'amount',
                payload: text,
              })
            }
            showError={showError && state.amount === 0}
            keyboardType="number-pad"
          />
          <Pressable
            onPress={() => {
              setCheckAsExpense(prev => !prev);
            }}
            style={{
              flexDirection: 'row',
              paddingVertical: 16,
            }}>
            <Checkbox
              value={checkAsExpense}
              onValueChange={setCheckAsExpense}
              color="rgba(25, 66, 216, 0.9)"
              style={{
                color: '#204391',
                alignSelf: 'center',
                marginRight: 8,
                marginLeft: 0,
              }}
            />
            <Text
              style={{
                fontFamily: 'ReadexPro-Regular',
                color: '#30475e',
                fontSize: 14,
                letterSpacing: -0.1,
                maxWidth: '90%',
              }}>
              Record transaction as an expense
            </Text>
          </Pressable>
          {checkAsExpense && (
            <Picker
              showSearch
              searchPlaceholder={'Search Expense Category'}
              placeholder="Select Expense Category"
              showError={showError && !state.category && checkAsExpense}
              value={state.category?.id || state.catergory?.value}
              setValue={item => {
                handleTextChange({
                  type: 'category',
                  payload: { id: item?.value },
                });
              }}>
              {categoriesData?.map(item => {
                if (
                  item?.expense_category_id &&
                  item?.expense_category_is_system != 1
                ) {
                  return (
                    <RNPicker.Item
                      key={item?.expense_category_id}
                      label={item?.expense_category}
                      value={item?.expense_category_id}
                    />
                  );
                }
              })}
            </Picker>
          )}
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={state.number.length < 10 || state.amount <= 0}
          handlePress={() => {
            if (state.number.length === 0 || state.amount === 0) {
              toast.show('Please enter amount', {
                placement: 'top',
                type: 'danger',
              });
              setShowError(true);
              return;
            }
            if (checkAsExpense && !state.category) {
              toast.show('Please select expense category', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            next.current = true;
            SheetManager.hide('buyAirtime');
          }}>
          Proceed
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 84,
    // marginTop: 10,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  dWrapper: {
    paddingTop: 12,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 14,
    marginLeft: 12,
  },
  toggle: {
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default BuyArtimeSheet;
