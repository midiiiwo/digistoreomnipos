/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TicketSolid from '../../assets/icons/ticket-solid.svg';
import { useNavigation } from '@react-navigation/native';

const EventTicketItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() =>
        navigation.navigate('Ticket Details', {
          id: item.ticket_id,
        })
      }>
      <View style={styles.details}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 'auto',
            }}>
            <TicketSolid />
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Medium',
                  fontSize: 15.4,
                  marginBottom: 4,
                  letterSpacing: 0.3,
                  marginLeft: 3,
                },
              ]}
              numberOfLines={1}>
              {item && item.ticket_name}
            </Text>
          </View>

          <Text
            style={[
              styles.name,
              {
                fontFamily: 'ReadexPro-Regular',
                fontSize: 14.3,
                color: '#6D8299',
                marginBottom: 4,
              },
            ]}
            numberOfLines={1}>
            {item && item.event_name}
          </Text>

          <Text
            style={[
              styles.name,

              {
                fontFamily: 'ReadexPro-Regular',
                fontSize: 14,
                color: '#6D8299',
                marginBottom: 12,
              },
            ]}>
            {item && item.event_startdate} {item && item.event_starttime}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: '#8CABFF',
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                color: '#30475e',
              }}>
              {item.event_code}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.status, { justifyContent: 'center' }]}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            // marginLeft: 'auto',
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
    </Pressable>
  );
};

export default EventTicketItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 3,
    paddingHorizontal: 12,
    borderRadius: 6,
    // alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
    marginTop: 6,
  },
  details: {
    maxWidth: '70%',
  },
  count: {
    fontFamily: 'ReadexPro-Medium',
    color: '#6D8299',
    fontSize: 15,
    marginBottom: 6,
    // marginTop: 8,
  },
  status: {
    marginLeft: 'auto',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
  },
  statusIndicator: {
    height: 8,
    width: 8,
    borderRadius: 100,
    marginRight: 4,
  },
  img: {
    height: 24,
    width: 24,
    borderRadius: 28,
    // marginVertical: 6,
    // marginTop: 6,
    // marginRight: 10,
    // alignSelf: 'flex-start',
    // backgroundColor: 'green',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingRight: 14,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    alignSelf: 'flex-end',
    marginTop: 'auto',
    // position: 'absolute',
    // right: 18,
  },
  name: {
    fontFamily: 'Lato-Bold',
    color: '#30475e',
    // marginBottom: 0,
    fontSize: 15,
  },
});
