/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Status = ({ route, navigation }) => {
  const { redeemStatus } = route.params;
  const data = redeemStatus && redeemStatus.data;
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.main}>
      {redeemStatus && redeemStatus.status == 99 && (
        <View
          style={{
            // justifyContent: 'flex-start',
            height: 140,
            width: '100%',
            // position: 'absolute',
            top: 20,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Lottie
            source={require('../lottie/94303-failed.json')}
            autoPlay
            loop={false}
            style={{ marginBottom: 12 }}
            // autoSize
          />
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#30475e',
              fontSize: 16,
              textAlign: 'center',
              marginTop: 22,
            }}>
            {redeemStatus.message}
          </Text>
        </View>
      )}
      {redeemStatus && redeemStatus.status == 1 && (
        <View
          style={{
            // justifyContent: 'flex-start',
            width: '100%',
            // position: 'absolute',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: Dimensions.get('window').height * 0.06,
          }}>
          <Lottie
            source={require('../lottie/97240-success.json')}
            autoPlay
            loop={false}
            style={{
              height: Dimensions.get('window').height * 0.15,
              width: Dimensions.get('window').height * 0.15,
            }}
          />
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#30475e',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 18,
            }}>
            {redeemStatus.message}
          </Text>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 14,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 16,
                borderBottomColor: '#eee',
                borderBottomWidth: 0.4,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                }}>
                Ticket
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 22,
                borderBottomColor: '#eee',
                borderBottomWidth: 0.4,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                }}>
                Name
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_customer_name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                }}>
                Phone
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_customer_phone}
              </Text>
            </View>
          </View>
        </View>
      )}
      {redeemStatus && redeemStatus.status == 95 && (
        <View
          style={{
            // justifyContent: 'flex-start',
            width: '100%',
            // position: 'absolute',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: Dimensions.get('window').height * 0.06,
          }}>
          <Lottie
            source={require('../lottie/134878-warning-status.json')}
            autoPlay
            loop={false}
            style={{
              height: Dimensions.get('window').height * 0.15,
              width: Dimensions.get('window').height * 0.15,
            }}
          />
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#30475e',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 18,
            }}>
            {redeemStatus.message.slice(8)}
          </Text>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 14,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 16,
                borderBottomColor: '#eee',
                borderBottomWidth: 0.4,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                }}>
                Ticket
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 22,
                borderBottomColor: '#eee',
                borderBottomWidth: 0.4,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                }}>
                Name
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_customer_name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                }}>
                Phone
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#304755',
                  fontSize: 16,
                  marginLeft: 'auto',
                }}>
                {data.ticket_customer_phone}
              </Text>
            </View>
          </View>
        </View>
      )}
      {redeemStatus && redeemStatus.status == 92 && (
        <View
          style={{
            // justifyContent: 'flex-start',
            width: '100%',
            // position: 'absolute',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: Dimensions.get('window').height * 0.06,
          }}>
          <Lottie
            source={require('../lottie/134878-warning-status.json')}
            autoPlay
            loop={false}
            style={{
              height: Dimensions.get('window').height * 0.15,
              width: Dimensions.get('window').height * 0.15,
            }}
          />
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#30475e',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 18,
            }}>
            {redeemStatus.message.slice(7)}
          </Text>
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 6,
          marginTop: 'auto',
          marginBottom: 0,
          paddingBottom: Platform.OS === 'android' ? 16 : bottom,
        }}>
        <Pressable
          style={styles.btn}
          onPress={() => {
            // navigation.navigate('Tickets');
            navigation.goBack();
          }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Regular',
              color: '#fff',
              fontSize: 16,
              textAlign: 'center',
              // marginTop: 16,
            }}>
            Close
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  btn: {
    backgroundColor: '#2192FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
});
