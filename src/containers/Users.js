/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';

import { useSelector } from 'react-redux';
import { useGetMerchantUserDetails } from '../hooks/useGetMerchantUserDetails';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { useDeleteMerhantUser } from '../hooks/useDeleteMerchantUser';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import DeleteDialog from '../components/DeleteDialog';

function Users(props) {
  const client = useQueryClient();
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetMerchantUserDetails(
    user.merchant,
  );
  const navigation = useNavigation();
  const toast = useToast();
  const currentDeleteRef = React.useRef();
  const [visible, setVisible] = React.useState(false);

  const deleteMerchantUser = useDeleteMerhantUser(i => {
    if (i) {
      client.invalidateQueries('merchant-user-details');
      toast.show(i.message, { placement: 'top', type: 'danger' });
    }
  });

  return (
    <View style={styles.main}>
      <View style={{ paddingHorizontal: 22, marginBottom: 14 }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 22,
            color: '#002',
          }}>
          Users
        </Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingBottom: Dimensions.get('window').height * 0.1,
        }}
        data={data && data.data && data.data.data}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return (
            // <Drawer
            //   rightItems={[
            //     {
            //       text: 'Delete',
            //       background: 'red',
            //       onPress: async () => {
            //         currentDeleteRef.current = item.user_id;
            //         setVisible(true);
            //       },
            //     },
            //   ]}>
            <Pressable
              onPress={async () => {
                navigation.navigate('Edit User', { item });
              }}
              style={{
                borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                borderBottomWidth: 0.3,
                alignItems: 'center',
                paddingVertical: 18,

                paddingHorizontal: 18,
                flexDirection: 'row',
                backgroundColor: '#fff',
              }}>
              <View style={{ maxWidth: '88%' }}>
                <Text style={styles.channelText}>{item && item.user_name}</Text>
                <Text style={styles.address}>{item && item.group_name}</Text>
              </View>
              <View
                style={[
                  styles.caret,
                  {
                    backgroundColor:
                      item.user_status.toLowerCase() === 'inactive'
                        ? 'rgba(214, 19, 85, 0.1)'
                        : 'rgba(16, 161, 157, 0.1)',

                    borderColor:
                      item.user_status.toLowerCase() === 'inactive'
                        ? '#D61355'
                        : '#10A19D',
                    borderWidth: 0.6,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color:
                      item.user_status.toLowerCase() === 'inactive'
                        ? '#D61355'
                        : '#10A19D',
                  }}>
                  {item && item.user_status}
                </Text>
              </View>
            </Pressable>
            // </Drawer>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Create User');
          }}>
          Create User
        </PrimaryButton>
      </View>
      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        title="Are you sure you want delete user?"
        prompt="This process is irreversible"
        handleSuccess={() => {
          deleteMerchantUser.mutate({ id: currentDeleteRef.current });
          currentDeleteRef.current = null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    paddingBottom: 12,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: '#30475E',
    letterSpacing: -0.2,
  },

  channelText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    color: '#002',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13,
    color: '#7B8FA1',
  },
  caret: {
    marginLeft: 'auto',
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
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
});

export default Users;
