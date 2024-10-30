/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';

const PaypointVendorCard = ({ path, bill, handlePress }) => {
  const { setBillType } = useActionCreator();
  console.log(bill);
  return (
    <Pressable
      style={[styles.cardMain]}
      onPress={() => {
        handlePress();
        setBillType(path);
      }}>
      <View style={styles.imgContainer}>
        {bill === 'MTNBB' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/mtn-fibre.png')}
          />
        )}
        {bill === 'ADSL' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/vodafone-broadband.png')}
          />
        )}
        {bill === 'SURF' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/surfline.png')}
          />
        )}
        {bill === 'BUSY' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/busy.png')}
          />
        )}
        {bill === 'MTN' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/mtn-fibre.png')}
          />
        )}
        {bill === 'VODAFONE' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/vodafone-broadband.png')}
          />
        )}
        {bill === 'GLO' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/glo.webp')}
          />
        )}
        {bill === 'AIRTEL' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/airteltigo.png')}
          />
        )}
        {bill === 'TIGO' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/airteltigo.png')}
          />
        )}
        {bill === 'MTNPP' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/mtn-fibre.png')}
          />
        )}
        {bill === 'VPP' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/vodafone-broadband.png')}
          />
        )}
        {bill === 'ECG' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/ecg.png')}
          />
        )}
        {bill === 'ECGP' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/ecg.png')}
          />
        )}
        {bill === 'GWCL' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/water.png')}
          />
        )}
        {bill === 'DSTV' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/dstv.png')}
          />
        )}
        {bill === 'STARTIMES' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/star.jpg')}
          />
        )}
        {bill === 'BO' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/boxoffice.png')}
          />
        )}
        {bill === 'GOTV' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/gotv.webp')}
          />
        )}
        {bill === 'SMTNMM' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/mtn-momo.png')}
          />
        )}
        {bill === 'SVODAC' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/voda-cash.png')}
          />
        )}
        {bill === 'STIGOC' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/atmoney.png')}
          />
        )}
        {bill === 'SBANK' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/saving.png')}
          />
        )}
        {bill === 'MTNMD' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/mtn-fibre.png')}
          />
        )}
        {bill === 'VODAMD' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/vodafone-broadband.png')}
          />
        )}
        {bill === 'TIGOMD' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/airteltigo.png')}
          />
        )}
        {bill === 'AirtelTigo Top-up' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/atmoney.png')}
          />
        )}
        <Text style={styles.option}>{path}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardMain: {
    marginBottom: 46,
    height: Dimensions.get('window').width * 0.25,
    width: Dimensions.get('window').width * 0.25,
    marginHorizontal: Dimensions.get('window').width * 0.017,
  },
  imgContainer: {
    alignItems: 'center',
  },
  option: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13.5,
    color: '#30475E',
    fontFamily: 'ReadexPro-Regular',
  },
  img: {
    height: 55,
    width: 55,
    borderRadius: 118,
    // borderColor: '#ddd',
    // borderWidth: 0.7,
  },
});

export default PaypointVendorCard;

