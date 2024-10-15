/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import Search from '../../assets/icons/search.svg';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import AddCircle from '../../assets/icons/add-circle-dark.svg';
import { handleSearch } from '../utils/shared';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import CaretRight from '../../assets/icons/cart-right.svg';
import { useNavigation } from '@react-navigation/native';

const Categories = () => {
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');

  if (isLoading) {
    return <Loading />;
  }
  if (
    data &&
    data.data &&
    data.data.data &&
    data.data.data.filter(i => i != null).length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{ fontFamily: 'Lato-Bold', fontSize: 18, color: '#30475e' }}>
          You have no categories yet
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            fontSize: 17,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first category
        </Text>
        <Pressable
          style={[
            styles.btn,
            {
              marginTop: 14,
              backgroundColor: '#rgba(25, 66, 216, 0.9)',
            },
          ]}
          onPress={async () => {
            navigation.navigate('Add Category');
          }}>
          <Text style={styles.signin}>Add Category</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.main}>
      <View style={styles.topIcons}>
        <Pressable style={styles.searchBox}>
          <Search
            stroke="#131517"
            height={25}
            width={25}
            style={{ marginLeft: 12 }}
          />
          <TextInput
            style={styles.search}
            placeholder="Search category"
            placeholderTextColor="#929AAB"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </Pressable>
        <View style={styles.viewSpace} />
        <Pressable
          onPress={() => {
            if (!user.user_permissions.includes('ADDPROD')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Add Category');
          }}>
          <AddCircle height={48} width={48} />
        </Pressable>
      </View>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={
          [...handleSearch(searchTerm, data.data.data, 'product_category')] ||
          []
        }
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_category_id;
        }}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return (
            <Pressable
              style={styles.wrapper}
              key={item.product_category}
              onPress={() => {
                if (!user.user_permissions.includes('EDTPROD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Edit Category', {
                  id: item.product_category_id,
                });
                // SheetManager.show('editCategory', {
                //   payload: { id: item.product_category_id },
                // });
              }}>
              <View>
                <Text style={styles.name}>{item.product_category}</Text>
                <Text style={styles.count}>{item.product_count}</Text>
              </View>
              <View style={{ marginLeft: 'auto', justifyContent: 'center' }}>
                <CaretRight height={16} width={16} />
              </View>
            </Pressable>
          );
        }}
        scrollEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // paddingHorizontal: 20,
  },
  wrapper: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  name: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#002',
    marginBottom: 2,
    fontSize: 18.6,
    letterSpacing: 0.4,
  },
  count: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#7B8FA1',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  viewSpace: {
    width: 8,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 55,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 17.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'SFProDisplay-Regular',
    letterSpacing: 0.3,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  searchBtn: {
    marginLeft: 'auto',
  },

  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
});

export default Categories;
