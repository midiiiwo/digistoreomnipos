/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  Animated,
  Platform,
} from 'react-native';
import React from 'react';
import { useGetMerchantEvents } from '../hooks/useGetMerchantEvents';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import moment from 'moment';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '@rneui/themed';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
// import ActionButton from 'react-native-action-button';

const EventItem = ({ item }) => {
  // const navigation = useNavigation();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0.97,
      duration: 250,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable
      onPress={() => {
        // navigation.navigate('Event Detail', {
        //   item,
        // });
      }}
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.3,
        marginBottom: 28,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#F5F7F8',
      }}>
      <Image
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
          opacity,
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Regular',
            color: '#27374D',
            fontSize: 15,
            marginTop: 7,
          }}
          numberOfLines={2}>
          {item.event_name}
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Regular',
            color: '#DFA878',
            fontSize: 14,
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
              color: '#9D9D9D',
              fontSize: 13,
            }}>
            {moment(new Date(item.event_enddate))
              .format('DD-MMM-YYYY')
              .toUpperCase()}{' '}
            {item.event_endtime}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
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
                fontFamily: 'SFProDisplay-Medium',
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

const EventList = () => {
  const { user } = useSelector(state => state.auth);
  const marginBottom = Platform.select({
    ios: 28,
    android: 14,
  });
  const navigation = useNavigation();
  const { data, isLoading } = useGetMerchantEvents(user.merchant);
  // const navigation = useNavigation();
  if (isLoading) {
    return <Loading />;
  }
  const events = (data && data.data && data.data.data) || [];

  return (
    <View style={styles.main}>
      <FlatList
        data={events}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 14 }}
        renderItem={({ item }) => {
          if (!item) {
            return;
          }
          return <EventItem item={item} />;
        }}
      />
      <FAB
        color="#7091F5"
        style={{ marginLeft: 'auto', marginBottom, marginRight: 14 }}
        titleStyle={{ fontFamily: 'ReadexPro-Regular' }}
        title="Sell Tickets"
        onPress={() => {
          if (
            user &&
            user.user_merchant_agent == '6' &&
            (!user.user_permissions.includes('TRANMGT') ||
              // !user.user_permissions.includes('MKPAYMT') ||
              !user.user_permissions.includes('SELTKTS'))
          ) {
            Toast.show({
              type: ALERT_TYPE.WARNING,
              title: 'No Access',
              textBody:
                'Service not available on your account. Please contact Ecobank support',
            });
            return;
          }
          if (
            !user.user_permissions.includes('TRANMGT') ||
            // !user.user_permissions.includes('MKPAYMT') ||
            !user.user_permissions.includes('SELTKTS')
          ) {
            Toast.show({
              type: ALERT_TYPE.WARNING,
              title: 'Upgrade Needed',
              textBody:
                "You don't have access to this feature. Please upgrade your account",
            });
            return;
          }
          navigation.navigate('Sell Ticket Events');
        }}
      />
      {/* <ActionButton
        buttonColor="#7091F5"
        onPress={() => {
          navigation.navigate('Create Event');
        }}
      /> */}
    </View>
  );
};

export default EventList;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
