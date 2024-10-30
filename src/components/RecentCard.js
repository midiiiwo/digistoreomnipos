/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const mapCodeToName = {
  MTN: 'MTN Mobile',
  VODAFONE: 'Telecel Mobile',
  TIGO: 'Tigo Mobile',
  AIRTEL: 'Airtel Mobile',
  GLO: 'Glo Mobile',
  ADSL: 'Telecel Broadband',
  SURF: 'Surfline LTE',
  MTNBB: 'MTN Fibre Broadband',
  BUSY: 'Busy Internet',
  ECGP: 'ECG Postpaid',
  GWCL: 'Water Bill',
  MTNPP: 'MTN postpaid',
  VPP: 'Telecel Postpaid',
  DSTV: 'Multichoice - DStv',
  GOTV: 'Multichoice - GOtv',
  BO: 'Box Office',
  MTNMM: 'MTN Mobile Money',
  AIRTELM: 'AirtelTigo Money',
  VODAC: 'Telecel Cash',
  TIGOC: 'AirtelTigo Money',
  BANK: 'Bank Payout',
  MTNMD: 'MTN Data Bundle',
  VODAMD: 'Telecel Data Bundle',
  TIGOMD: 'At Data Bundle',
};

const RecentCard = ({ item, options }) => {
  const {
    CHANNEL: name,
    AMOUNT: amount,
    ACCOUNT: recipient,
    STATUS: status,
    CUSTOMER_NAME: customerName,
  } = item;
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.recentCard}
      onPress={() => {
        // SheetManager.show('transaction', {
        //   payload: { item, name: mapCodeToName[name], navigation, options },
        // });
        navigation.navigate('Paypoint Transaction', {
          payload: { item, name: mapCodeToName[name], navigation, options },
        });
      }}>
      {name === 'ADSL' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {name === 'MTNMM' && (
        <Image
          source={require('../../assets/images/mtn-momo.png')}
          style={styles.img}
        />
      )}
      {name === 'MTNBB' && (
        <Image
          source={require('../../assets/images/mtn.png')}
          style={styles.img}
        />
      )}
      {name === 'MTN' && (
        <Image
          source={require('../../assets/images/mtn.png')}
          style={styles.img}
        />
      )}
      {name === 'MTNMD' && (
        <Image
          source={require('../../assets/images/mtn.png')}
          style={styles.img}
        />
      )}
      {name === 'VODAMD' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {name === 'VODAFONE' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {name === 'VODAC' && (
        <Image
          source={require('../../assets/images/voda-cash.png')}
          style={styles.img}
        />
      )}
      {name === 'AIRTEL' && (
        <Image
          source={require('../../assets/images/airteltigo.png')}
          style={styles.img}
        />
      )}
      {name === 'TIGOC' && (
        <Image
          source={require('../../assets/images/atmoney.png')}
          style={[styles.img, { borderColor: '#eee', borderWidth: 0.8 }]}
        />
      )}
      {name === 'GLO' && (
        <Image
          source={require('../../assets/images/glo.webp')}
          style={styles.img}
        />
      )}
      {name === 'TIGO' && (
        <Image
          source={require('../../assets/images/airteltigo.png')}
          style={styles.img}
        />
      )}
      {name === 'SURF' && (
        <Image
          source={require('../../assets/images/surfline.png')}
          style={styles.img}
        />
      )}
      {name === 'BUSY' && (
        <Image
          source={require('../../assets/images/busy.png')}
          style={styles.img}
        />
      )}
      {name === 'ECG' && (
        <Image
          source={require('../../assets/images/ecg.png')}
          style={styles.img}
        />
      )}
      {name === 'GWCL' && (
        <Image
          source={require('../../assets/images/water.png')}
          style={styles.img}
        />
      )}
      {name === 'MTNPP' && (
        <Image
          source={require('../../assets/images/mtn-fibre.png')}
          style={styles.img}
        />
      )}
      {name === 'VPP' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {name === 'DSTV' && (
        <Image
          source={require('../../assets/images/dstv.png')}
          style={styles.img}
        />
      )}
      {name === 'GOTV' && (
        <Image
          source={require('../../assets/images/gotv.webp')}
          style={styles.img}
        />
      )}
      {name === 'BANK' && (
        <Image
          source={require('../../assets/images/saving.png')}
          style={styles.img}
        />
      )}
      {name === 'BO' && (
        <Image
          source={require('../../assets/images/boxoffice.png')}
          style={styles.img}
        />
      )}
      <View style={styles.details}>
        {customerName.trim().length === 0 ? (
          <Text style={styles.name} numberOfLines={1}>
            {mapCodeToName[name]?.toUpperCase()}
          </Text>
        ) : (
          <Text style={styles.name} numberOfLines={1}>
            {customerName?.toUpperCase()}
          </Text>
        )}
        <Text style={styles.customer}>{recipient}</Text>
      </View>
      <View
        style={{
          marginLeft: 'auto',
          marginRight: 6,
        }}>
        <Text style={styles.transactAmount}>
          <Text style={{ fontSize: 11 }}>GHS</Text>{' '}
          {new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(amount))}
        </Text>
        <Text
          style={[
            styles.transactAmount,
            {
              fontSize: 13,
              color:
                status === 'Completed'
                  ? '#22A699'
                  : status === 'Pending'
                  ? '#FFB84C'
                  : '#D61355',
            },
          ]}>
          {status}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentCard;

const styles = StyleSheet.create({
  img: {
    height: 35,
    width: 35,
    borderRadius: 24,
    // borderWidth: 0.7,
    // borderColor: '#ddd',
  },
  recentsWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recentCard: {
    width: '100%',
    padding: 5,
    paddingVertical: 8,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 6,
  },
  details: {
    marginLeft: 12,
    width: '50%',
  },
  transactAmount: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475e',
    textAlign: 'right',
  },
  name: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475E',
    fontSize: 14,
    letterSpacing: -0.3,
  },
  customer: {
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 13,
    letterSpacing: -0.1,
    marginTop: Platform.OS === 'android' ? -1 : 5,
    opacity: 0.65,
  },
});
