/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { TextInput } from 'react-native-paper';

import { useGetOutletCategories } from '../../hooks/useGetOutletCategories';
import { useSelector } from 'react-redux';
import PrimaryButton from '../PrimaryButton';
import { useGetSelectedCategoryDetails } from '../../hooks/useGetSelectedCategoryDetails';
import Loading from '../Loading';
import { useEditCategory } from '../../hooks/useEditCategory';
import { useQueryClient } from 'react-query';

export const Input = ({
  placeholder,
  val,
  setVal,
  nLines,
  showError,
  ...props
}) => {
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
        borderWidth: 1.3,
        borderRadius: 5,
        // borderColor: showError ? '#EB455F' : '#B7C4CF',
      }}
      placeholderTextColor="#B7C4CF"
      style={styles.input}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
      enablesReturnKeyAutomatically
    />
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'category_name':
      return { ...state, name: action.payload };
    case 'category_description':
      return { ...state, desc: action.payload };
    case 'update_all':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function EditCategorySheet(props) {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    desc: '',
  });

  const queryClient = useQueryClient();

  const { data: categoryDetails, isLoading } = useGetSelectedCategoryDetails(
    props.payload.id,
  );

  const editCategory = useEditCategory(i => {
    if (i.status == 0) {
      setSaved('Success');
      queryClient.invalidateQueries('product-categories');
      return;
    }
    setSaved('Failed');
  });

  const handleTextChange = React.useCallback(
    ({ type, payload }) => {
      dispatch({
        type,
        payload,
      });
    },
    [dispatch],
  );

  React.useEffect(() => {
    if (categoryDetails && categoryDetails.data.status == 0) {
      console.log('data--------->', categoryDetails.data.data);
      dispatch({
        type: 'update_all',
        payload: {
          name:
            categoryDetails &&
            categoryDetails.data &&
            categoryDetails.data.data &&
            categoryDetails.data.data.product_category,
          desc:
            categoryDetails &&
            categoryDetails.data &&
            categoryDetails.data.data &&
            categoryDetails.data.data.product_category_description,
        },
      });
    }
  }, [user.user_name, categoryDetails]);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={{ height: '100%' }}>
        <View
          style={{
            paddingHorizontal: 26,
            flexDirection: 'row',
          }}>
          <Pressable
            onPress={() => SheetManager.hide('editCategory')}
            style={{ marginRight: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: 'rgba(25, 66, 216, 0.9)',
                fontFamily: 'Inter-Medium',
              }}>
              Done
            </Text>
          </Pressable>
          <Text
            style={{
              color: '#30475e',
              fontFamily: 'Inter-Medium',
              paddingTop: 18,
              fontSize: 15,
            }}>
            Edit category
          </Text>
          <Pressable
            onPress={() => SheetManager.hide('editCategory')}
            style={{ marginLeft: 'auto' }}>
            <Text
              style={{
                paddingTop: 18,
                color: '#EB455F',
                fontFamily: 'Inter-Medium',
              }}>
              Cancel
            </Text>
          </Pressable>
        </View>
        {isLoading && <Loading />}
        {!isLoading && (
          <ScrollView style={styles.main}>
            <Input
              placeholder="Enter category name"
              showError={showError && state.name.length === 0}
              val={state.name}
              setVal={text =>
                handleTextChange({
                  type: 'category_name',
                  payload: text,
                })
              }
            />
            <Input
              placeholder="Enter description (optional)"
              val={state.desc}
              nLines={3}
              setVal={text =>
                handleTextChange({
                  type: 'category_description',
                  payload: text,
                })
              }
            />
          </ScrollView>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={editCategory.isLoading}
          handlePress={() => {
            if (state.name.length === 0) {
              setShowError(true);
              return;
            }
            editCategory.mutate({
              ...state,
              id: props.payload.id,
              mod_by: user.user_name,
            });
          }}>
          {editCategory.isLoading
            ? 'Loading'
            : saved.length > 0
            ? saved
            : 'Save category'}
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}
PrimaryButton;

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 26,
    marginBottom: 78,
    marginTop: 26,
  },
  indicatorStyle: {
    display: 'none',
  },
  containerStyle: { borderRadius: 0 },
  input: {
    marginVertical: 10,
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    backgroundColor: '#fff',
    paddingVertical: 6,
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

export default EditCategorySheet;
