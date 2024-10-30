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
import { useGetTaxes } from '../hooks/useGetTaxes';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

function ManageTaxes(props) {
  const { user } = useSelector(state => state.auth);
  const { data, refetch, isFetching } = useGetTaxes(user.merchant);
  const navigation = useNavigation();

  return (
    <View style={styles.main}>
      <View style={{ paddingHorizontal: 22, marginBottom: 13 }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 22,
            color: '#002',
          }}>
          Configure Taxes
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
            <Pressable
              onPress={async () => {
                navigation.navigate('Edit Tax', { id: item.tax_id });
              }}
              style={{
                borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                borderBottomWidth: 0.3,
                alignItems: 'center',
                paddingVertical: 18,

                paddingHorizontal: 20,
                flexDirection: 'row',
              }}>
              <View style={{ maxWidth: '88%' }}>
                <Text style={styles.channelText}>{item && item.tax_name}</Text>
                <Text style={styles.address}>
                  {item && item.tax_value_desc}%
                </Text>
              </View>
              <View
                style={[
                  styles.caret,
                  {
                    backgroundColor:
                      item.tax_status.toLowerCase() === 'inactive'
                        ? 'rgba(214, 19, 85, 0.1)'
                        : 'rgba(16, 161, 157, 0.1)',

                    borderColor:
                      item.tax_status.toLowerCase() === 'inactive'
                        ? '#D61355'
                        : '#10A19D',
                    borderWidth: 0.6,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color:
                      item.tax_status.toLowerCase() === 'inactive'
                        ? '#D61355'
                        : '#10A19D',
                  }}>
                  {item &&
                    item.tax_status.slice(0, 1).toUpperCase() +
                      item.tax_status.slice(1).toLowerCase()}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Add Tax');
          }}>
          Create Tax
        </PrimaryButton>
      </View>
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

export default ManageTaxes;
