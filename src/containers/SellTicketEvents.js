/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Animated,
  RefreshControl,
  TextInput,
} from 'react-native';
import React from 'react';
import { useGetMerchantEvents } from '../hooks/useGetMerchantEvents';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Search from '../../assets/icons/search.svg';
import { handleSearch } from '../utils/shared';
import PrimaryButton from '../components/PrimaryButton';

const EventItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Sell Event Details', {
          item,
        });
      }}
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.3,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#F5F7F8',
      }}>
      <FastImage
        defaultSource={require('../../assets/images/placeholder.png')}
        source={{
          uri:
            'https://payments.ipaygh.com/app/webroot/img/event/' +
            item.event_image_file,
        }}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          borderRadius: 10,
        }}
      />
      <Animated.View
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 9,
          width: '95%',
          height: Dimensions.get('window').height * 0.15,
          borderRadius: 6,
          paddingHorizontal: 12,
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            color: '#27374D',
            fontSize: 16,
            marginTop: 7,
          }}
          numberOfLines={1}>
          {item.event_name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'ReadexPro-Regular',
            color: '#DFA878',
            fontSize: 13.5,
            marginTop: 0,
          }}>
          {item.event_venue}
        </Text>
        <View
          style={{
            marginTop: 'auto',
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#526D82',
              fontSize: 12.5,
              marginLeft: 4,
              letterSpacing: 0.4,
            }}>
            {moment(new Date(item.event_enddate))
              .format('DD.MM.YYYY')
              .toUpperCase()}
            {'  '}
            {item.event_endtime}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 1,
              borderRadius: 4,
              marginLeft: 'auto',
              backgroundColor:
                item.event_status === 'OPEN'
                  ? '#35A29F'
                  : item.event_status === 'HOLD'
                  ? '#E9B384'
                  : '#F31559',
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                color: '#30475e',
              }}>
              {item.event_status}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const SellTicketEvents = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, isRefetching, refetch } = useGetMerchantEvents(
    user.merchant,
  );
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = React.useState('');
  if (isLoading) {
    return <Loading />;
  }
  const events = (data && data.data && data.data.data) || [];

  return (
    <>
      <View style={styles.main}>
        <View style={{ backgroundColor: '#fff', paddingBottom: 12 }}>
          <View style={styles.topIcons}>
            <View style={styles.searchBox}>
              <Search
                stroke="#131517"
                height={20}
                width={20}
                style={{ marginLeft: 12 }}
              />
              <TextInput
                style={styles.search}
                placeholder="Search Event"
                placeholderTextColor="#929AAB"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            {/* <View style={styles.viewSpace} /> */}
            {/* <Pressable
          onPress={() => {
            SheetManager.show('paypointHistorySheet');
          }}>
          <Filter stroke="#30475e" height={33} width={33} />
        </Pressable> */}
          </View>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
          }
          data={handleSearch(searchTerm, events)}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 14,
            paddingBottom: Dimensions.get('window').height * 0.1,
          }}
          renderItem={({ item }) => {
            if (!item) {
              return;
            }
            if (item && item.event_status === 'OPEN') {
              return <EventItem item={item} />;
            }
          }}
        />
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          handlePress={() => {
            navigation.navigate('Ticket Sold History');
          }}
          style={styles.btn}>
          Ticket Purchases
        </PrimaryButton>
      </View>
    </>
  );
};

export default SellTicketEvents;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topIcons: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0.3,
    marginTop: 4,
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
