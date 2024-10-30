/* eslint-disable react-native/no-inline-styles */
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useGetSelectedCategoryDetails } from '../hooks/useGetSelectedCategoryDetails';
import Loading from '../components/Loading';
import { useEditCategory } from '../hooks/useEditCategory';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { useDeleteCategory } from '../hooks/useDeleteCategory';

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
  const [showError, setShowError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    name: '',
    desc: '',
  });
  const navigation = useNavigation();
  const toast = useToast();

  const id = props.route.params.id;
  console.log('idddddd', id);

  const queryClient = useQueryClient();

  const { data: categoryDetails, isLoading } = useGetSelectedCategoryDetails(
    props.route.params.id,
  );

  const editCategory = useEditCategory(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      if (i.status == 0) {
        queryClient.invalidateQueries('product-categories');
        navigation.goBack();
      }
    }
  });

  const deleteCategory = useDeleteCategory(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      if (i.status == 0) {
        queryClient.invalidateQueries('product-categories');
        navigation.goBack();
      }
    }
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
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          disabled={editCategory.isLoading}
          handlePress={() => {
            if (state.name.length === 0 || state.phone.length === 0) {
              setShowError(true);
              toast.show('Please provide all required details.', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }
            editCategory.mutate({
              ...state,
              id,
              mod_by: user.user_name,
            });
          }}>
          {editCategory.isLoading ? 'Processing' : 'Save category'}
        </PrimaryButton>
        <View style={{ marginHorizontal: 4 }} />
        <PrimaryButton
          style={[styles.btn, { backgroundColor: '#F24C3D' }]}
          disabled={deleteCategory.isLoading}
          handlePress={() => {
            Alert.alert('Delete Category', 'This process is irreversible', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () =>
                  deleteCategory.mutate({
                    category: id,
                  }),
              },
            ]);
          }}>
          {deleteCategory.isLoading ? 'Processing' : 'Delete category'}
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    borderRadius: 4,
    width: '45%',
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
