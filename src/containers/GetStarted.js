/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { useActionCreator } from '../hooks/useActionCreator';

const slides = [
  {
    key: 1,
    title: 'Manage your Business- like a PRO',
    image: require('../../assets/images/gs2.png'),
    backgroundColor: '#fffff',
    text: 'Manage your business operations in ONE place – Sales, Inventory, Customers, Payments, Insights and many more.',
  },
  {
    key: 2,
    title: 'Sell More, Anywhere at Anytime',
    image: require('../../assets/images/gs1.png'),
    backgroundColor: '#fffff',
    text: 'Everything you need to Sell - In-Store, Online, On Social Media, Offline and Marketplaces in ONE solution.',
  },

  {
    key: 3,
    title: 'Engage and Grow a Loyal Customer Base',
    image: require('../../assets/images/gs3.png'),
    backgroundColor: '#fffff',
    text: 'Attract, Engage, Reward and Build a loyal customer base with the suite of business tools & financial services.',
  },
];
const renderItem = ({ item }) => {
  const imgWidth = Dimensions.get('window').width * 0.6;
  return (
    <View style={styles.slide}>
      {/* <Text style={styles.title}>{item.title}</Text> */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/POS_logo_png.png')}
          style={{ marginTop: 10, height: imgWidth * 0.3, width: imgWidth }}
          resizeMode="contain"
        />
      </View>
      <Image
        source={item.image}
        style={{
          height: Dimensions.get('window').height * 0.25,
          width: Dimensions.get('window').width * 0.6,
        }}
        resizeMode="contain"
      />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );
};

const renderDoneButton = () => {
  return (
    <View
      style={{
        marginRight: 24,
        marginTop: 14,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#4D4D4D',
          fontSize: 15,
          textAlign: 'center',
        }}>
        Done
      </Text>
    </View>
  );
};

const renderNextButton = () => {
  return (
    <View
      style={{
        marginRight: 24,
        marginTop: 14,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#4D4D4D',
          fontSize: 15,
          textAlign: 'center',
        }}>
        Next
      </Text>
    </View>
  );
};

const renderSkipButton = () => {
  return (
    <View
      style={{
        marginRight: 24,
        backgroundColor: '#EDF8ED',
        paddingHorizontal: 54,
        paddingVertical: 14,
        borderRadius: 29,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#47B749',
          fontSize: 14,
          textAlign: 'center',
        }}>
        Skip
      </Text>
    </View>
  );
};

const renderPrevButton = () => {
  return (
    <View
      style={{
        marginRight: 24,
        backgroundColor: '#EDF8ED',
        paddingHorizontal: 54,
        paddingVertical: 14,
        borderRadius: 29,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#47B749',
          fontSize: 14,
          textAlign: 'center',
        }}>
        Previous
      </Text>
    </View>
  );
};

const GetStarted = () => {
  const navigation = useNavigation();
  const { setFirstLaunch } = useActionCreator();
  return (
    <View style={styles.main}>
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        onDone={() => {
          setFirstLaunch(false);
          navigation.navigate('Login');
        }}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        showSkipButton
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        renderDoneButton={renderDoneButton}
        renderPrevButton={renderPrevButton}
        showPrevButton
        onSkip={() => {
          setFirstLaunch(false);
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  textWrapper: {
    alignItems: 'center',
    width: '80%',
    marginTop: Dimensions.get('window').height * 0.04,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    color: '#204391',
    fontSize: 22.78,
    textAlign: 'center',
    lineHeight: 30,
    width: '86%',
  },
  text: {
    fontFamily: 'Inter-Regular',
    color: '#6E6E6E',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    width: '91%',
    lineHeight: 25,
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.08,
    marginBottom: Dimensions.get('window').height * 0.07,
  },
  dot: {
    backgroundColor: '#EDF8ED',
    width: 18,
    height: 6,
    marginBottom: Dimensions.get('window').height * 0.1,
  },
  activeDot: {
    backgroundColor: '#47B749',
    width: 30,
    height: 6,
    marginBottom: Dimensions.get('window').height * 0.1,
  },
});
