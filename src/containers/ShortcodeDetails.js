/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useGetShortcodeDetails } from '../hooks/useGetShortcodeDetails';
import Loading from '../components/Loading';
import { useUpdateStoreOrShortcode } from '../hooks/useUpdateStoreOrShortcode';
import { useSetupStoreOrShortcode } from '../hooks/useSetupStoreOrShortcode';
import { useChangeStoreStatus } from '../hooks/useChangeStoreStatus';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'contact':
      return { ...state, contact: action.payload };
    case 'code':
      return { ...state, code: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const ShortcodeDetails = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    code: '',
    contact: '',
    id: '',
    status: '',
  });
  const toast = useToast();
  const client = useQueryClient();

  const { data, isLoading } = useGetShortcodeDetails(user.merchant);

  const setupStoreOrShortcode = useSetupStoreOrShortcode(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('shortcode');
      client.invalidateQueries('online-store');
    }
  });

  const changeStoreStatus = useChangeStoreStatus(i => {
    // if (i) {
    //   setStatus(i);
    // }
    if (i.status == 0) {
      client.invalidateQueries('shortcode');
      client.invalidateQueries('online-store');
    }
  });

  const updateStoreOrShortcode = useUpdateStoreOrShortcode(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      client.invalidateQueries('shortcode');
      client.invalidateQueries('online-store');
    }
  });

  React.useEffect(() => {
    const shortcodeDetails = data && data.data && data.data.data;
    if (shortcodeDetails && data && data.data && data.data.status == 0) {
      dispatch({
        type: 'update_all',
        payload: {
          name: shortcodeDetails.store_name,
          code: shortcodeDetails.store_code,
          contact: shortcodeDetails.store_number,
          id: shortcodeDetails.store_id,
          status: shortcodeDetails.store_status,
        },
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top', type: 'success' });
        // navigation.navigate('Manage Deliveries');
        setSaved(null);
        return;
      }
      toast.show(saved.message, { placement: 'top', type: 'danger' });
      setSaved(null);
    }
  }, [saved, toast, navigation]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          paddingHorizontal: 22,
          marginBottom: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            fontSize: 26,
            color: '#002',
          }}>
          Shortcode
        </Text>
        {state.status && state.status.length > 0 && (
          <View style={[styles.statusWrapper, { marginLeft: 'auto' }]}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    state.status === 'INACTIVE' ? '#FD8A8A' : '#87C4C9',
                },
              ]}
            />
            <Text style={styles.orderStatus}>
              {/* {item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED'
                    ? 'Paid'
                    : 'Unpaid'} */}
              {state.status === 'ACTIVE' ? 'Online' : 'Offline'}
            </Text>
          </View>
        )}
      </View>
      {/* <View> */}
      <ScrollView style={[styles.main]}>
        <Input
          placeholder="Shop name"
          showError={showError && state.name.length === 0}
          val={state.name}
          setVal={text =>
            handleTextChange({
              type: 'name',
              payload: text,
            })
          }
        />
        <Input
          placeholder="Merchant or Shop Mobile Number"
          showError={showError && state.contact.length === 0}
          val={state.contact}
          setVal={text =>
            handleTextChange({
              type: 'contact',
              payload: text,
            })
          }
        />
        <Input
          placeholder="Shop code"
          showError={showError && state.code.length === 0}
          val={state.code}
          setVal={text =>
            handleTextChange({
              type: 'code',
              payload: text,
            })
          }
          keyboardType="number-pad"
        />
        <View style={{ paddingBottom: 14 }}>
          <PrimaryButton
            style={[styles.btn, { width: '100%' }]}
            handlePress={() => {
              handleTextChange({
                type: 'code',
                payload: JSON.stringify(
                  Math.floor(1000 + Math.random() * 9000),
                ),
              });
            }}>
            Generate Business Code
          </PrimaryButton>
        </View>

        {data && data.data && data.data.status == 0 && (
          <View>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 18,
                color: '#526D82',
                marginVertical: 12,
              }}>
              YOUR BUSNESS SHORT CODE *725*{state.code}#
            </Text>
            <View style={{ marginTop: 10, paddingVertical: 4 }}>
              <PrimaryButton
                disabled={changeStoreStatus.isLoading}
                style={[
                  styles.btn,
                  {
                    width: '100%',
                    backgroundColor:
                      state.status === 'ACTIVE' ? '#FF6464' : '#47B749',
                  },
                ]}
                handlePress={() => {
                  changeStoreStatus.mutate({
                    id: state.id,
                    status: state.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                    mod_by: user.login,
                  });
                }}>
                {changeStoreStatus.isLoading
                  ? 'Processing'
                  : state.status === 'ACTIVE'
                  ? 'Deactivate Business Code'
                  : 'Activate Business Code'}
              </PrimaryButton>
            </View>
          </View>
        )}
      </ScrollView>
      {/* </View> */}
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={
            setupStoreOrShortcode.isLoading || updateStoreOrShortcode.isLoading
          }
          handlePress={() => {
            if (
              state.name.length === 0 ||
              state.contact.length === 0 ||
              state.code.length === 0
            ) {
              setShowError(true);
              return;
            }
            if (data && data.data && data.data.status != 0) {
              setupStoreOrShortcode.mutate({
                name: state.name,
                code: state.code,
                number: state.contact,
                mod_by: user.login,
                merchant: user.merchant,
                type: 'MOBILE',
                desc: '',
                image_store: '',
              });
            } else if (data && data.data && data.data.status == 0) {
              updateStoreOrShortcode.mutate({
                name: state.name,
                code: state.code,
                number: state.contact,
                mod_by: user.login,
                merchant: user.merchant,
                type: 'MOBILE',
                desc: '',
                image_store: '',
                id: state.id,
              });
            }
          }}>
          {setupStoreOrShortcode.isLoading || updateStoreOrShortcode.isLoading
            ? 'Processing'
            : data && data.data && data.data.status != 0
            ? 'Create Business Code'
            : 'Update Business Code'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default ShortcodeDetails;
const styles = StyleSheet.create({
  main: {
    // height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 16,
    backgroundColor: '#fff',
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    backgroundColor: '#fff',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
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
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 6,
    backgroundColor: '#87C4C9',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingRight: 13,
    paddingVertical: 3,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  orderStatus: {
    fontFamily: 'SFProDisplay-Semibold',
    color: '#30475e',
    fontSize: 17.5,
  },
});
