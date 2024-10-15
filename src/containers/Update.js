/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import React from 'react';
import UpdateIcon from '../../assets/icons/update.svg';
import PrimaryButton from '../components/PrimaryButton';
import Playstore from '../../assets/icons/playstore';
import { useNavigation } from '@react-navigation/native';

const imgWidth = Dimensions.get('window').width * 0.6;

const Update = ({ route }) => {
  const navigation = useNavigation();
  const { url } = route.params;
  return (
    <View style={styles.main}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/POS_logo_png.png')}
          style={{ marginTop: 10, height: imgWidth / 4, width: imgWidth }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: Dimensions.get('window').height * 0.16,
        }}>
        {/* <UpdateIcon height={72} width={72} /> */}
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: 14,
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            color: '#30475e',
            fontSize: 25,
            textAlign: 'center',
            width: Dimensions.get('window').width * 0.6,
          }}>
          New update available
        </Text>
        <View style={{ marginVertical: 16 }}>
          <Playstore height={70} width={70} />
        </View>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            color: '#7C96AB',
            fontSize: 16,
            textAlign: 'center',
            width: Dimensions.get('window').width * 0.6,
            marginTop: 16,
          }}>
          A new version of Digistore POS is available on{' '}
          {Platform.OS === 'android' ? 'Google Playstore' : 'Apple Store'}
        </Text>
      </View>
      <View style={{ marginTop: 'auto', marginBottom: 25 }}>
        <View
          style={{
            alignItems: 'center',
            // marginTop: Dimensions.get('window').height * 0.16,
          }}>
          <Pressable
            onPress={() => {
              Linking.openURL(url);
            }}
            style={[
              styles.btn,
              {
                backgroundColor: '#47B749',
                borderRadius: 8,
                marginBottom: 22,
              },
            ]}>
            <Text style={styles.signin}>Install Latest Version</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.goBack()}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              color: 'rgba(25, 66, 216, 0.9)',
              fontSize: 17,
              textAlign: 'center',
              alignSelf: 'center',
              width: Dimensions.get('window').width * 0.6,
              marginTop: 16,
            }}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Update;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.04,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 3,
    width: '86%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});
