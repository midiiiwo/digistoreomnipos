/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { DateTimePicker, Picker as RNPicker } from 'react-native-ui-lib';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useAddProductCategory } from '../hooks/useAddProductCategory';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useAddCategory } from '../hooks/useAddCategory';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useCreateMerchantUser } from '../hooks/userCreateMerchantUser';
import moment from 'moment';
import Picker from '../components/Picker';
import { useGetMerchantUserRoles } from '../hooks/useGetMerchantUserRoles';
import { useVerifyMerchantUserUsername } from '../hooks/useVerifyMerhcantUserUsername';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import { useMapMerchantOutletsToUser } from '../hooks/useMapMerchantOutletsToUser';

const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
  return (
    <TextInput
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#B7C4CF'}
      activeOutlineColor={showError ? '#EB455F' : '#1942D8'}
      outlineStyle={{
        borderWidth: 0.9,
        borderRadius: 4,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
    />
  );
};

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
    case 'outlets':
      return { ...state, outlets: action.payload };
    default:
      return state;
  }
};

const AddUser = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState();
  const [showError, setShowError] = React.useState(false);
  const [verify, setVerify] = React.useState(false);
  const [verifyStatus, setVerifyStatus] = React.useState();
  const [outletStatus, setOutletStatus] = React.useState();
  const [usernameStatus, setUsernameStatus] = React.useState();
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    email: '',
    phone: '',
    username: '',
    role: null,
    outlets: [],
  });
  const toast = useToast();
  const client = useQueryClient();
  const { mutate: addOutlets, isLoading: isAddingOutlets } =
    useMapMerchantOutletsToUser(setOutletStatus);

  const { data: outlets } = useGetMerchantOutlets(user.merchant);

  const { mutate, isLoading } = useCreateMerchantUser(i => {
    if (i) {
      setSaved(i);
    }
    if (i.status == 0) {
      let outletIds = '[';
      state.outlets.forEach(({ value }) => {
        outletIds += '"' + value + '",';
      });
      outletIds = outletIds.substring(0, outletIds.length - 1);
      outletIds += ']';
      client.invalidateQueries('merchant-user-details');
      addOutlets({
        merchant: user.merchant,
        user: i.id,
        old_outlet_list: '{}',
        outlet_list: outletIds,
        mod_by: user.login,
      });
    }
  });

  const { data: verifyData, refetch } = useVerifyMerchantUserUsername(
    state.username,
    data => {
      console.log('ddddddddddd', data);
      setVerifyStatus(data);
    },
    false,
  );

  const { data } = useGetMerchantUserRoles(user.merchant);

  React.useEffect(() => {
    console.log('---------------', verifyStatus);
    if (verifyStatus) {
      if (verifyStatus.status == 0) {
        // toast.show(verifyStatus.message, { placement: 'top', type: 'success' });
        setVerify(true);
      } else {
        setVerify(false);
        toast.show(verifyStatus.message, { placement: 'top', type: 'danger' });
      }
      setVerifyStatus(null);
    }
  }, [data, toast, verifyStatus]);

  React.useEffect(() => {
    if (outletStatus) {
      if (outletStatus.status == 0) {
        toast.show('User added successfully', {
          placement: 'top',
          type: 'success',
        });
        navigation.goBack();
        setOutletStatus(null);
        return;
      }
      toast.show('User creation failed', { placement: 'top', type: 'danger' });
      setOutletStatus(null);
    }
  }, [outletStatus, toast, navigation]);

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );
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
            showError={
              (showError && state.username.length === 0) ||
              (state.username.length > 0 && !verify)
            }
            onEndEditing={e => {
              if (e.nativeEvent.text.length > 0) {
                refetch();
              }
            }}
          />
          <Picker
            placeholder="Select User Group"
            showError={!state.role && showError}
            value={state.role}
            setValue={item => {
              handleTextChange({
                type: 'role',
                payload: item,
              });
            }}>
            {data &&
              data.data &&
              data.data.data &&
              data.data.data.map(item => {
                if (!item) {
                  return;
                }
                return (
                  <RNPicker.Item
                    key={item.group_name}
                    label={item.group_name}
                    value={JSON.stringify(item)}
                  />
                );
              })}
          </Picker>
          <Picker
            showError={!state.outlets && showError}
            placeholder="Map Outlets to User"
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
                console.log('===========>>>>>', i);
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
              state.username.length === 0 ||
              !verify
            ) {
              setShowError(true);
              return;
            }
            mutate({
              name: state.name,
              email: state.email,
              phone: state.phone,
              username: state.username,
              group: Number(JSON.parse(state.role.value).group_id),
              merchant: user.merchant,
              mod_by: user.login,
              user_type: 'MERCHANT',
            });
          }}>
          {isLoading || isAddingOutlets ? 'Processing' : 'Save User'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddUser;
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
