/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';

const LocationSelect = () => {
  const deliveryInfo = React.useRef();
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      <GooglePlacesAutocomplete
        placeholder="Enter Phyiscal Address"
        // currentLocation
        placeholderTextColor="#ff0000"
        fetchDetails={true}
        onPress={(id, details) => {
          deliveryInfo.current = {
            delivery_gps: details && details.geometry,
            delivery_location: details && details.formatted_address,
          };
          console.log(deliveryInfo);
          navigation.navigate('Business Information', {
            location: deliveryInfo.current,
            prev_screen: 'location',
          });
        }}
        query={{
          key: 'AIzaSyCEhoYQkAxqs75nVsS_xUWg2w5DVFZ_p_4',
          language: 'en',
          components: 'country:gh',
        }}
        textInputProps={{
          placeholderTextColor: '#ccc',
        }}
        styles={{
          textInput: {
            borderRadius: 4,
            paddingHorizontal: 18,
            fontSize: 16,
            flex: 1,
            color: '#30475e',
            fontFamily: 'Inter-Medium',
            backgroundColor: '#F5F7F9',
            marginTop: 12,
            height: 52,
          },
          listView: {
            // flexGrow: 0,
          },
          container: {
            zIndex: 10,
            overflow: 'visible',
            height: 48,
            // flexGrow: 0,
          },
        }}
        renderRow={i => {
          console.log('============', i);
          return (
            <View>
              <Text
                style={{
                  color: '#30475e',
                  fontSize: 14,
                  fontFamily: 'Inter-Medium',
                }}>
                {i.description}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default LocationSelect;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
});
