/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';

import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useUpdateMerchantUser } from '../hooks/useUpdateMerchantUser';
import Picker from '../components/Picker';
import { useGetMerchantUserRoles } from '../hooks/useGetMerchantUserRoles';
import { useGetMerchantUserOutlets } from '../hooks/UseGetMerchantUserOutlets';
import { CheckItem } from './ReceiptDetails';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import Loading from '../components/Loading';
import { useMapMerchantOutletsToUser } from '../hooks/useMapMerchantOutletsToUser';
import Input from '../components/Input';

const reducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload };
    case 'email':
      return { ...state, email: action.payload };
    case 'phone':
      return { ...state, phone: action.payload };
    case 'username':
      return { ...state, username: action.payload };
    case 'role':
      return { ...state, role: action.payload };
    case 'status':
      return { ...state, status: action.payload };
    case 'outlets':
      return { ...state, outlets: action.payload };
    case 'old_outlets':
      return { ...state, outlets: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const EditUser = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [outletStatus, setOutletStatus] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    email: '',
    phone: '',
    username: '',
    role: null,
    status: null,
    outlets: [],
    oldOutlets: [],
  });
  const toast = useToast();
  const client = useQueryClient();

  const { item } = route && route.params;

  const { mutate: addOutlets } = useMapMerchantOutletsToUser(setOutletStatus);

  const { data, isLoading: rolesLoading } = useGetMerchantUserRoles(
    user.merchant,
  );

  const { data: currentMappedOutlets, isLoading: isMappedOutletsLoading } =
    useGetMerchantUserOutlets(user.merchant, item.user_id);

  const { data: outlets } = useGetMerchantOutlets(user.merchant);

  const { mutate, isLoading } = useUpdateMerchantUser(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      let oldOutletsIds = '[';
      let outletIds = '[';
      state.outlets.forEach(({ value }) => {
        outletIds += '"' + value + '",';
      });
      outletIds = outletIds.substring(0, outletIds.length - 1);
      outletIds += ']';

      state.oldOutlets.forEach(({ value }) => {
        oldOutletsIds += '"' + value + '",';
      });
      oldOutletsIds = oldOutletsIds.substring(0, oldOutletsIds.length - 1);
      oldOutletsIds += ']';
      addOutlets({
        merchant: user.merchant,
        user: item.user_id,
        old_outlet_list: state.oldOutlets.length > 0 ? oldOutletsIds : '[]',
        outlet_list: state.outlets.length > 0 ? outletIds : '[]',
        mod_by: user.login,
      });
      client.invalidateQueries('merchant-user-details');
    }
  });

  React.useEffect(() => {
    if (item) {
      const roles = (data && data.data && data.data.data) || [];
      const currentMapped = (
        (currentMappedOutlets &&
          currentMappedOutlets.data &&
          currentMappedOutlets.data.data) ||
        []
      ).map(i => {
        if (!i) {
          return;
        }
        return i.outlet_id;
      });

      const allOutlets = (outlets && outlets.data && outlets.data.data) || [];

      const filteredOutlets = allOutlets
        .filter(i => {
          if (!i) {
            return;
          }
          return currentMapped.includes(i.outlet_id);
        })
        .map(i => ({
          label: i.outlet_name,
          value: i.outlet_id,
        }));

      const currentRole = roles.find(i => {
        if (!i) {
          return;
        }
        return i.group_id === item.group_id;
      });
      dispatch({
        type: 'update_all',
        payload: {
          name: item.user_name,
          email: item.user_email,
          phone: item.user_phone,
          username: item.user_login,
          role: {
            label: currentRole && currentRole.group_name,
            value: currentRole && JSON.stringify(currentRole),
            key: currentRole && currentRole.group_name,
          },
          status: item.user_status === 'Active',
          outlets: filteredOutlets,
          oldOutlets: filteredOutlets,
        },
      });
    }
  }, [data, item, currentMappedOutlets, outlets]);

  // const { data: verifyData } = useVerifyMerchantUserUsername(
  //   user.merchant,
  //   state.username,
  //   verify && state.username.length !== 0,
  // );

  // React.useEffect(() => {
  //   const status = data && data.data && data.data.data

  // }, [])

  React.useEffect(() => {
    if (saved) {
      if (saved.status == 0) {
        toast.show(saved.message, { placement: 'top', type: 'success' });
        navigation.goBack();
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

  if (rolesLoading || isMappedOutletsLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: '100%' }}>
        <ScrollView style={styles.main}>
          <Input
            placeholder="Enter Name"
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
            placeholder="Enter Email"
            val={state.email}
            // nLines={3}
            setVal={text =>
              handleTextChange({
                type: 'email',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Phone"
            val={state.phone}
            keyboardType="phone-pad"
            // nLines={3}
            showError={showError && state.phone.length === 0}
            setVal={text =>
              handleTextChange({
                type: 'phone',
                payload: text,
              })
            }
          />
          <Input
            placeholder="Enter Username"
            val={state.username}
            setVal={text =>
              handleTextChange({
                type: 'username',
                payload: text,
              })
            }
            showError={showError && state.username.length === 0}
            editable={false}
            // onEndEditing={e => {
            //   if (e.nativeEvent.text.length > 0) {
            //     setVerify(true);
            //   }
            // }}
          />
          <CheckItem
            placeholder="Change Status (Active/Inactive)"
            value={state.status}
            onValueChange={() => {
              dispatch({
                type: 'status',
                payload: !state.status,
              });
            }}
          />
          <View style={{ marginVertical: 10 }} />
          <Picker
            showError={!state.role && showError}
            placeholder="User Role"
            value={state.role}
            setValue={i => {
              handleTextChange({
                type: 'role',
                payload: i,
              });
            }}>
            {data &&
              data.data &&
              data.data.data &&
              data.data.data.map(i => {
                if (!i) {
                  return;
                }
                return (
                  <RNPicker.Item
                    key={i.group_name}
                    label={i.group_name}
                    value={JSON.stringify(i)}
                  />
                );
              })}
          </Picker>
          <Picker
            showError={!state.outlets && showError}
            placeholder="User Outlets"
            mode="MULTI"
            value={state.outlets}
            setValue={i => {
              handleTextChange({
                type: 'outlets',
                payload: i,
              });
            }}>
            {outlets &&
              outlets.data &&
              outlets.data.data &&
              outlets.data.data.map(i => {
                if (!i) {
                  return;
                }
                return (
                  <RNPicker.Item
                    key={i.outlet_name}
                    label={i.outlet_name}
                    value={{ label: i.outlet_name, value: i.outlet_id }}
                  />
                );
              })}
          </Picker>
        </ScrollView>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={isLoading}
          handlePress={() => {
            console.log(state);
            if (
              state.name.length === 0 ||
              !state.role ||
              state.phone.length === 0 ||
              state.username.length === 0
            ) {
              setShowError(true);
              toast.show('Please provide all required details', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            mutate({
              uid: item.user_id,
              name: state.name,
              email: state.email,
              phone: state.phone,
              group: Number(JSON.parse(state?.role?.value || '{}')?.group_id),
              // merchant: user.merchant,
              mod_by: user.login,
              status: state.status ? 'Active' : 'Inactive',
              // user_type: 'MERCHANT',
            });
          }}>
          {isLoading ? 'Processing' : 'Save User'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EditUser;
const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
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
});

const dd = StyleSheet.create({
  placeholder: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 14,
    height: '100%',
    zIndex: 100,
  },
  main: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#B7D9F8',
    paddingHorizontal: 14,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#F5FAFF',
  },
});
