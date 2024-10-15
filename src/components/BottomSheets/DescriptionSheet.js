/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  // TouchableOpacity,
  TextInput,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import ToggleSwitch from 'toggle-switch-react-native';
import { Pressable } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import DeliverySheet from './DeliverySheet';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGetOutletCategories } from '../../hooks/useGetOutletCategories';
import { useAddCategoryProduct } from '../../hooks/useAddCategoryProduct';
import PrimaryButton from '../PrimaryButton';
import _ from 'lodash';
import Lottie from 'lottie-react-native';
import { Picker as RNPicker } from 'react-native-ui-lib';
import Picker from '../Picker';
import { useGetAllProductsCategories } from '../../hooks/useGetAllProductsCategories';
import { useToast } from 'react-native-toast-notifications';

function DescriptionSheet(props) {
  const { description, amount } = useSelector(state => state.quickSale);
  const { addDescription } = useActionCreator();
  const [save, setSave] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(null);
  const [id, setId] = React.useState();
  const [category, setCategory] = React.useState();
  const [success, setSuccess] = React.useState(false);
  const { user } = useSelector(state => state.auth);
  const toast = useToast();
  const { setTempProduct } = useActionCreator();
  const [showError, setShowError] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState();
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  // useGetAllProductsCategories
  const mutation = useAddCategoryProduct(i => {
    if (i.status === 0 && i.id) {
      setTempProduct(i);
      setSuccess(true);
      setSaveStatus(i);
    }
  });

  React.useEffect(() => {
    if (saveStatus) {
      if (saveStatus == 0) {
        toast.show(saveStatus.message, { placement: 'top' });
        SheetManager.hide('description');
      } else {
        toast.show(saveStatus.message, { placement: 'top' });
      }
    }
  }, [saveStatus, toast]);

  const categoryItems =
    (data &&
      data.data &&
      data.data.data &&
      data.data.data.map(cat => {
        if (!cat) {
          return;
        }
        return {
          label: cat.product_category,
          value: cat.product_category,
          id: cat.product_category_id,
        };
      })) ||
    [];

  let btnChild;
  if (!mutation.isLoading && !success) {
    btnChild = `Add Product - GHS${amount}`;
  } else if (mutation.isLoading && !success) {
    btnChild = 'loading...';
  } else if (!mutation.isLoading && success) {
    btnChild = 'success';
  }

  // const payload = {
  //   name: description,
  //   desc: description,
  //   price: amount,
  //   quantity: 1,
  //   category: id && id,
  //   tag: 'NORMAL',
  //   merchant: user.merchant,
  //   mod_by: user.merchant,
  // };
  // console.log('cagetoetete', JSON.parse(category.value).id);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={true}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      snapPoints={['93']}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Description</Text>
          <Pressable
            style={styles.doneWrapper}
            onPress={() => SheetManager.hide('description')}>
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>
        {user.user_permissions.includes('ADDPROD') && (
          <View style={styles.radioWrapper}>
            <ToggleSwitch
              isOn={save}
              onColor="#2192FF"
              offColor="#EEF1F2"
              label="Save Product"
              labelStyle={styles.label}
              size="medium"
              animationSpeed={200}
              onToggle={isOn => setSave(isOn)}
            />
          </View>
        )}
        {save && (
          <View style={styles.dWrapper}>
            <Picker
              placeholder="Select category"
              showError={!category && showError}
              value={category}
              setValue={item => {
                setCategory(item);
              }}>
              {categoryItems &&
                categoryItems.map(item => {
                  if (!item) {
                    return;
                  }
                  return (
                    <RNPicker.Item
                      key={item.label}
                      label={item.label}
                      value={JSON.stringify(item)}
                    />
                  );
                })}
            </Picker>
            <PrimaryButton
              disabled={btnChild === 'success'}
              handlePress={() => {
                if (!amount || Number(amount) === 0) {
                  toast.show('Enter amount', {
                    placement: 'top',
                    style: { zIndex: 100000000000 },
                  });
                  return;
                }
                mutation.mutate({
                  name: description,
                  desc: description,
                  price: amount,
                  quantity: 1,
                  category: category && JSON.parse(category.value).id,
                  tag: 'NORMAL',
                  merchant: user.merchant,
                  mod_by: user.merchant,
                  outlet_list: '{' + '"' + user.outlet + '"' + '}',
                });
              }}
              style={styles.btn}>
              {btnChild}
            </PrimaryButton>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                // borderTopColor: save ? '#ddd' : '',
                // borderTopWidth: save ? 0.5 : 0,
                // marginTop: save ? 12 : 0,
              },
            ]}
            multiline
            textAlignVertical="top"
            autoFocus
            value={description}
            onChangeText={text => addDescription(text)}
            placeholder="Enter item description here..."
            placeholderTextColor="#ddd"
          />
        </View>
      </View>
    </ActionSheet>
  );
}

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderRadius: 4,
//   },
//   inputAndroid: {
//     fontSize: 16,
//     borderColor: 'purple',
//     borderWidth: 1,
//     borderRadius: 8,
//     color: 'black',
//     paddingRight: 30,
//   },
// });

const styles = StyleSheet.create({
  main: {
    // height: '92%',
    // borderRadius: 0,
    backgroundColor: '#fff',
  },
  btn: {
    borderRadius: 5,
  },
  itemStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
  clear: {
    fontFamily: 'Inter-Regular',
    color: '#1942D8',
    fontSize: 13,
    marginLeft: 42,
  },
  containerStyle: {
    borderRadius: 0,
  },
  dWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.5)',
    borderRadius: 4,
  },
  dropdownContainer: {
    borderRadius: 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderColor: 'rgba(146, 169, 189, 0.6)',
    paddingVertical: 6,
    // width: '80%',
  },
  label: {
    fontFamily: 'Inter-Regular',
    color: '#30475E',
  },
  labelStyle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#30475E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
    color: '#30475E',
  },
  radioWrapper: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingBottom: 0,
    // borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    // borderBottomWidth: 0.3,
  },
  done: {
    fontFamily: 'Inter-Medium',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.1,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  indicatorStyle: {
    display: 'none',
  },
  inputWrapper: {
    height: '90%',
    padding: 14,
  },
  input: {
    height: '40%',
    padding: 18,
    color: '#000',

    marginTop: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    // backgroundColor: 'rgba(159, 201, 243, 0.08)',
    borderColor: '#ddd',
    borderWidth: 0.8,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.5,
  },
  save: {
    fontFamily: 'Inter-Regular',
    color: '#30475E',
    backgroundColor: 'red',
    width: '35%',
  },
});

export default DescriptionSheet;
