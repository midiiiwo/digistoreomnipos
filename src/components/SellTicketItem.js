/* eslint-disable react-native/no-inline-styles */
import { Dimensions, Pressable, Text, View } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const SellTicketItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Sell Ticket', { item });
      }}
      style={{
        width: '100%',
        minHeight: Dimensions.get('window').height * 0.23,
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginVertical: 10,
      }}>
      <View
        style={{
          backgroundColor: '#3D5685',
          minWidth: '15%',
          maxWidth: '15%',
          flex: 1,
        }}>
        <View
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            transform: [{ rotate: '270deg' }],
            alignSelf: 'center',
          }}>
          <Text
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              fontFamily: 'ReadexPro-Regular',
              color: '#fff',
              fontSize: 12,
              textAlign: 'center',
              width: Dimensions.get('window').height * 0.19,
            }}>
            {item && item.ticket_name && item.ticket_name.trim()}
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingVertical: 12,
          paddingLeft: 14,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'ReadexPro-Medium',
            color: '#30475e',
            fontSize: 14,
            letterSpacing: 0.5,
            maxWidth: '90%',
          }}>
          {item && item.event_name}
        </Text>
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#272829',
                  fontSize: 11,
                  letterSpacing: -0.1,
                  opacity: 0.8,
                }}>
                Price
              </Text>
              <View
                style={{
                  backgroundColor: '#3D74850D',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginTop: 4,
                }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#272829',
                    fontSize: 13,
                    letterSpacing: -0.1,
                  }}>
                  GHS{' '}
                  {item &&
                    item.ticket_rate &&
                    new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.ticket_rate)}
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 4 }} />
            <View>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#272829',
                  fontSize: 11,
                  letterSpacing: -0.1,
                  // fontWeight: '200',
                  opacity: 0.8,
                }}>
                Date
              </Text>
              <View
                style={{
                  backgroundColor: '#3D74850D',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginTop: 4,
                }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#272829',
                    fontSize: 13,
                  }}>
                  {moment(item && item.ticket_startdate).format('DD.MM.YYYY')}
                </Text>
              </View>
            </View>
          </View>
          {/* <View>
            <Text
              style={{
                fontFamily: 'RobotoMono-Regular',
                color: '#272829',
                fontSize: 11,
                letterSpacing: -0.1,
                fontWeight: '100',
                opacity: 0.8,
                marginTop: 6,
              }}>
              Location
            </Text>
            <View
              style={{
                backgroundColor: '#3D74850D',
                alignSelf: 'flex-start',
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginTop: 4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'RobotoMono-Medium',
                  color: '#272829',
                  fontSize: 12,
                  letterSpacing: -0.5,
                  maxWidth: '80%',
                }}>
                {item && item.ticket_venue}
              </Text>
            </View>
          </View> */}
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Sell Ticket', { item });
          }}
          style={{
            marginTop: 'auto',
            backgroundColor: '#8E8FFA',
            alignSelf: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Medium',
              color: '#fff',
              fontSize: 13.4,
              letterSpacing: 0.3,
            }}>
            Sell Ticket
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute',
          right: (Dimensions.get('window').width * 0.15) / 3,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Regular',
            color: '#9DB2BF',
            fontSize: 10.4,
          }}>
          Admits
        </Text>
        <Text
          style={{
            fontFamily: 'RobotoMono-Bold',
            color: '#272829',
            fontSize: 18,
            letterSpacing: -0.5,
          }}>
          {item && item.ticket_unit}
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          width: 17,
          height: 17,
          backgroundColor: '#f1f1f1',
          top: -8,
          right: Dimensions.get('window').width * 0.15,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 17,
          height: 17,
          backgroundColor: '#f1f1f1',
          right: Dimensions.get('window').width * 0.15,
          borderRadius: 100,
          bottom: -8,
        }}
      />
    </Pressable>
  );
};

export default SellTicketItem;
