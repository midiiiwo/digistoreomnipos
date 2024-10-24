/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import { SharedElement } from 'react-navigation-shared-element';
import BackIcon from '../../assets/icons/cross-2.svg';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Ticket from '../../assets/icons/ticket-solid.svg';
import Calender from '../../assets/icons/calender.svg';
import Timer from '../../assets/icons/time.svg';
import Map from '../../assets/icons/mapsolid.svg';
import PrimaryButton from '../components/PrimaryButton';

const EventDetail = ({ route }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const { item } = route.params;
  const navigation = useNavigation();

  const scheme = Platform.select({
    ios: 'maps://0,0?q=',
    android: 'geo:0,0?q=',
  });
  const label = item.event_venue;
  const url = Platform.select({
    ios: `${scheme}${label}@${item.event_location_url}`,
    android: `${scheme}${item.event_location_url}(${label})`,
  });

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0.99,
      duration: 250,
      delay: 500,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.main}>
      <Animated.View
        style={{
          backgroundColor: '#f9f9f9',
          borderRadius: 100,
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 100,
          opacity,
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            height: 36,
            width: 36,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <BackIcon height={20} width={20} />
        </Pressable>
      </Animated.View>
      <SharedElement id={item.event_id} style={{ width: '100%' }}>
        <Image
          source={{
            uri:
              'https://payments.ipaygh.com/app/webroot/img/event/' +
              item.event_image_file,
          }}
          style={{
            // height: '100%',
            resizeMode: 'cover',
            width: '100%',
            height: Dimensions.get('window').height * 0.4,
          }}
          // resizeMode="contain"
        />
      </SharedElement>
      <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Semibold',
            color: '#27374D',
            fontSize: 18,
            marginTop: 8,
          }}>
          {item.event_name}
        </Text>
        <Text
          style={{
            color: '#C38154',
            fontFamily: 'SFProDisplay-Regular',
            fontSize: 15,
            marginVertical: 4,
          }}>
          {item.event_venue}
        </Text>
        {item &&
          item.event_location_url &&
          item.event_location_url.match(
            /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/gm,
          ) && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Map style={{ marginRight: 3 }} height={21} width={21} />
              <Text
                onPress={() => {
                  Linking.openURL(url);
                }}
                style={{
                  color: '#4E4FEB',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 15,
                  paddingVertical: 6,
                }}>
                View on Map
              </Text>
            </View>
          )}
      </View>
      <View
        style={{ flexDirection: 'row', paddingLeft: 14, alignItems: 'center' }}>
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
              fontFamily: 'SFProDisplay-Medium',
              color: '#30475e',
            }}>
            {item.event_status}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            marginLeft: 8,
            backgroundColor: '#8CABFF',
          }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#30475e',
            }}>
            {item.event_code}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 0,
          justifyContent: 'flex-start',
          marginTop: 20,
          paddingLeft: 14,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ticket height={20} width={20} />
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              color: '#526D82',
              fontSize: 13,
              marginLeft: 4,
            }}>
            {new Intl.NumberFormat().format(Number(item.tickets_sold))} tickets
            sold
          </Text>
        </View>
        <View style={{ marginHorizontal: 6 }} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Calender height={18} width={18} />
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              color: '#526D82',
              fontSize: 13,
              marginLeft: 4,
            }}>
            {moment(new Date(item.event_startdate))
              .format('DD-MMM-YYYY')
              .toUpperCase()}{' '}
            -{' '}
            {moment(new Date(item.event_enddate))
              .format('DD-MMM-YYYY')
              .toUpperCase()}
          </Text>
        </View>
        <View style={{ marginHorizontal: 6 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 14,
          marginTop: 12,
        }}>
        <Timer height={18} width={18} />
        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            color: '#526D82',
            fontSize: 13,
            marginLeft: 4,
          }}>
          {item.event_starttime} - {item.event_endtime}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 14,
          marginTop: 14,
          backgroundColor: '#fff',
          paddingVertical: 16,
          paddingBottom: 20,
          marginHorizontal: 10,
          borderRadius: 10,
          borderColor: '#eee',
          borderWidth: 1,
        }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Semibold',
            color: '#27374D',
            fontSize: 18,
            marginTop: 6,
          }}>
          About Event
        </Text>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            color: '#27374D',
            fontSize: 15,
            marginTop: 4,
          }}>
          {item.event_description}
        </Text>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={[styles.btn, { flex: 1 }]}
          handlePress={() => {
            navigation.navigate('Edit Event');
          }}>
          Edit Event
        </PrimaryButton>
        <View style={{ marginHorizontal: 3 }} />
        <PrimaryButton
          style={[styles.btn, { flex: 1, backgroundColor: '#30475e' }]}
          handlePress={() => {
            navigation.navigate('Event Tickets', {
              event_code: (item && item.event_code) || '',
              event_id: (item && item.event_id) || '',
            });
          }}>
          View Tickets
        </PrimaryButton>
      </View>
    </View>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  btn: {
    borderRadius: 4,
    // width: '90%',
  },
});
