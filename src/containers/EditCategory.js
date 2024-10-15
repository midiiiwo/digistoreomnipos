/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useGetSelectedCategoryDetails } from '../hooks/useGetSelectedCategoryDetails';
import Loading from '../components/Loading';
import { useEditCategory } from '../hooks/useEditCategory';
import { useQueryClient } from 'react-query';
import { SheetManager } from 'react-native-actions-sheet';
import { useDeleteProductCategory } from '../hooks/useDeleteProductCategory';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
// useEditCategory

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

const EditCategory = props => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const navigation = useNavigation();
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    desc: '',
  });
  const toast = useToast();

  const deleteCategory = useDeleteProductCategory(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      navigation.goBack();
    }
  });

  const queryClient = useQueryClient();

  const { data: categoryDetails, isLoading } = useGetSelectedCategoryDetails(
    props.route.params.id,
  );

  const editCategory = useEditCategory(i => {
    if (i.status == 0) {
      setSaved('Success');
      queryClient.invalidateQueries('product-categories');
      toast.show(i.message, { placement: 'top' });
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
      // console.log('data--------->', categoryDetails.data.data);
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
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
      <View style={[styles.btnWrapper, { flexDirection: 'row' }]}>
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
              id: props.route.params.id,
              mod_by: user.user_name,
            });
          }}>
          {editCategory.isLoading
            ? 'Processing'
            : saved.length > 0
            ? saved
            : 'Save category'}
        </PrimaryButton>
        <View style={{ marginHorizontal: 5 }} />
        <PrimaryButton
          style={[styles.btn, { backgroundColor: '#FF0060' }]}
          disabled={editCategory.isLoading}
          handlePress={() => {
            Alert.alert('Delete Category', 'This process is irreversible.', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () =>
                  deleteCategory.mutate({
                    id: props.route.params.id,
                  }),
              },
            ]);
          }}>
          {deleteCategory.isLoading ? 'Processing' : 'Delete Category'}
        </PrimaryButton>
      </View>
    </>
  );
};

export default EditCategory;

const styles = StyleSheet.create({
  main: {
    flex: 1,
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
    paddingHorizontal: 14,
  },
  btn: {
    borderRadius: 4,
    flex: 1,
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
