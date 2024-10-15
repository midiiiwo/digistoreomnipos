/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { SheetManager } from 'react-native-actions-sheet';

const mapCodeToName = {
  MTN: 'MTN Mobile',
  VODAFONE: 'Vodafone Mobile',
  TIGO: 'Tigo Mobile',
  AIRTEL: 'Airtel Mobile',
  GLO: 'Glo Mobile',
  ADSL: 'Vodafone Broadband',
  SURF: 'Surfline LTE',
  MTNBB: 'MTN Fibre Broadband',
  BUSY: 'Busy Internet',
  ECGP: 'ECG Postpaid',
  GWCL: 'Water Bill',
  MTNPP: 'MTN postpaid',
  VPP: 'Vodafone Postpaid',
  DSTV: 'Multichoice - DStv',
  GOTV: 'Multichoice - GOtv',
  BO: 'Box Office',
  MTNMM: 'MTN Mobile Money',
  AIRTELM: 'AirtelTigo Money',
  VODAC: 'Vodafone Cash',
  TIGOC: 'AirtelTigo Money',
};

const RecentCard = ({ item, navigation }) => {
  const {
    CHANNEL: name,
    AMOUNT: amount,
    ACCOUNT: recipient,
    STATUS: status,
    CUSTOMER_NAME: customerName,
  } = item;
  return (
    <Pressable
      style={styles.recentCard}
      onPress={() => {
        SheetManager.show('transaction', {
          payload: { item, name: mapCodeToName[name], navigation },
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
          source={require('../../assets/images/AirtelTigo-Money.jpeg')}
          style={styles.img}
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
      {name === 'BO' && (
        <Image
          source={require('../../assets/images/boxoffice.png')}
          style={styles.img}
        />
      )}
      <View style={styles.details}>
        {customerName.trim().length === 0 ? (
          <Text style={styles.name} numberOfLines={1}>
            {mapCodeToName[name]}
          </Text>
        ) : (
          <Text style={styles.name} numberOfLines={1}>
            {customerName}
          </Text>
        )}
        <Text style={styles.customer}>{recipient}</Text>
      </View>
      <View style={{ marginLeft: 'auto', marginRight: 6 }}>
        <Text style={styles.transactAmount}>
          <Text style={{ fontSize: 10 }}>GHS</Text> {Number(amount).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.transactAmount,
            {
              fontSize: 16,
              color:
                status === 'Completed'
                  ? '#10A19D'
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
    height: 48,
    width: 48,
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
    // borderBottomColor: '#ddd',
    // borderBottomWidth: 0.5,
    padding: 5,
    paddingVertical: 12,
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
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#748DA6',
    textAlign: 'right',
  },
  name: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475E',
    fontSize: 16,
    letterSpacing: 0.5,

    // width: '50%',
  },
  customer: {
    color: '#748DA6',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    letterSpacing: 0.0,
    marginTop: 2,
  },
});
