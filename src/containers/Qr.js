/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SheetManager } from 'react-native-actions-sheet';
// import {RNCamera} from 'react-native-camera';
// import Icon from 'react-native-vector-icons/Ionicons';
// import * as Animatable from 'react-native-animatable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Qr = () => {
  const onScanSuccess = e => {
    if (
      SheetManager.get('result') &&
      SheetManager.get('result').current &&
      SheetManager.get('result').current.isOpen()
    ) {
      return;
    }

    SheetManager.show('result', {
      payload: e,
    });
  };

  return (
    <View style={styles.main}>
      <QRCodeScanner
        vibrate={false}
        reactivate
        showMarker
        onRead={onScanSuccess}
        cameraStyle={{ height: SCREEN_HEIGHT }}
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={styles.topOverlay}>
              {/* <Text style={{fontSize: 30, color: 'white'}}>
                QR CODE SCANNER
              </Text> */}
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={styles.leftAndRightOverlay} />

              <View style={styles.rectangle}>
                {/* <Icon
                  name="ios-scan-outline"
                  size={SCREEN_WIDTH * 0.73}
                  color={iconScanColor}
                />
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1700}
                  easing="linear"
                  animation={makeSlideOutTranslation(
                    'translateY',
                    SCREEN_WIDTH * -0.54,
                  )}
                /> */}
              </View>

              <View style={styles.leftAndRightOverlay} />
            </View>

            <View style={styles.bottomOverlay} />
          </View>
        }
      />
    </View>
  );
};

const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = 'red';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = '#22ff00';

const iconScanColor = 'blue';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scanner: {
    height: Dimensions.get('window').height,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },
});

export default Qr;
