/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import CaretRight from '../../../assets/icons/cart-right.svg';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useGetSaleChannelList } from '../../hooks/useGetSaleChannelList';

function ChannelSheet(props) {
  const { selectChannel } = useActionCreator();
  function handleSelect(channel) {
    selectChannel(channel);
    SheetManager.hide('channels');
  }
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetSaleChannelList(user.merchant);
  return (
    <ActionSheet
      id={props.sheetId}
      // statusBarTranslucent={false}
      // drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Sale Source</Text>
        </View>
        <ScrollView>
          {data &&
            data.data &&
            data.data.data.map(channel => {
              return (
                <Pressable
                  key={channel}
                  style={styles.channelType}
                  onPress={() => handleSelect(channel)}>
                  {channel === 'Inshop' && (
                    <Image
                      source={require('../../../assets/images/online-store.png')}
                      style={styles.img}
                    />
                  )}
                  {/* {channel === 'INSHP' && (
                    <Image
                      source={require('../../assets/images/online-store.png')}
                      style={styles.img}
                    />
                  )} */}

                  {/* {channel === 'ONLINE' && (
                    <Image
                      source={require('../../assets/images/wifi.png')}
                      style={styles.img}
                    />
                  )} */}
                  {channel === 'Snapchat' && (
                    <Image
                      source={require('../../../assets/images/snapchat_.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Instagram' && (
                    <Image
                      source={require('../../../assets/images/instagram.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Twitter' && (
                    <Image
                      source={require('../../../assets/images/twitter.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Whatsapp' && (
                    <Image
                      source={require('../../../assets/images/whatsapp.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Tiktok' && (
                    <Image
                      source={require('../../../assets/images/tik-tok.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Facebook' && (
                    <Image
                      source={require('../../../assets/images/facebook.png')}
                      style={styles.img}
                    />
                  )}
                  {channel === 'Others' && (
                    <Image
                      source={require('../../../assets/images/sale.png')}
                      style={styles.img}
                    />
                  )}
                  {/* {channel === 'UNKNOWN' && (
                    <Image
                      source={require('../../../assets/images/payment.png')}
                      style={styles.img}
                    />
                  )} */}
                  <Text style={styles.channelText}>{channel}</Text>
                  <CaretRight style={styles.caret} height={15} width={15} />
                </Pressable>
              );
            })}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
    width: Dimensions.get('window').width * 0.5,
  },
  // indicatorStyle: {
  //   display: 'none',
  // },
  caret: {
    marginLeft: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#30475E',
    letterSpacing: -0.1,
  },
  img: {
    height: 30,
    width: 30,
    borderRadius: 4,
    marginRight: 12,
    // marginVertical: 6,
    // marginTop: 6,
    // marginRight: 10,
    // alignSelf: 'flex-start',
    // backgroundColor: 'green',
  },
  done: {
    fontFamily: 'Inter-SemiBold',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.8,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  channelType: {
    // alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  channelText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 17.4,
    color: '#30475E',
  },
});

export default ChannelSheet;

