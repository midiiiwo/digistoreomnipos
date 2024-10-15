/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Pdf from 'react-native-pdf';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNPrint from 'react-native-print';
import PrimaryButton from '../PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';

import { PermissionsAndroid } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

function ReceiptPreviewSheet(props) {
  const uri = props.payload.uri;
  const [pdfUri, setPdfUri] = React.useState('');
  const [printers, setPrinters] = React.useState([]);
  const toast = useToast();
  const [openMenu, setOpenMenu] = React.useState(false);

  var htmlString = `<div style="height: 100%; width: 100%"> 
    <img src="${uri}" style="width: "100%";"/>
    </div>`;

  // console.log(htmlString);

  React.useEffect(() => {
    let results;
    const print = async () => {
      try {
        results = await RNHTMLtoPDF.convert({
          html: htmlString,
          fileName: 'test',
          base64: true,
        });
        setPdfUri((results && results.filePath) || '');
      } catch (error) {
        toast.show('error generating pdf. Please try again');
      }
    };
    print();
  }, [htmlString, toast]);

  // React.useEffect(() => {
  //   BLEPrinter.printImageBase64(uri);
  // }, [uri]);

  React.useEffect(() => {
    console.log('calllllll');
    const init = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Cool Photo App Camera Permission',
          // message:
          //   'Cool Photo App needs access to your camera ' +
          //   'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      // if (granted === 'granted') {
      //   BLEPrinter.init().then(() => {
      //     BLEPrinter.getDeviceList().then(setPrinters);
      //   });
      // }
    };
    init();
  }, []);

  console.log('printersssss', printers);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      snapPoints={[98]}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.topRow}>
          <Pressable
            onPress={async () => {
              if (pdfUri.length === 0) {
                return;
              }
              try {
                console.log('jerererererer====>');
                // BLEPrinter.printRawData(uri, {});
                // await RNPrint.print({ filePath: pdfUri });
              } catch (error) {
                toast.show('Error printing file, Try again');
              }
            }}
            style={styles.printWrapper}>
            <Text style={styles.printTxt}>Print</Text>
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Menu opened={openMenu} onBackdropPress={() => setOpenMenu(false)}>
              <MenuTrigger
                onPress={() => setOpenMenu(!openMenu)}
                children={
                  <View
                  // onPress={}
                  >
                    <Text
                      style={{
                        color: '#30475e',
                        fontFamily: 'Inter-Medium',
                        fontSize: 15,
                      }}>
                      Select Printer
                    </Text>
                  </View>
                }
              />
              <MenuOptions
                optionsContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  paddingBottom: 16,
                  borderRadius: 6,
                  // elevation: 0,
                }}>
                {printers.map(item => {
                  return (
                    <MenuOption
                      style={{ marginVertical: 10 }}
                      onSelect={async () => {
                        setOpenMenu(false);
                      }}>
                      <Text
                        style={{
                          color: '#30475e',
                          fontFamily: 'Inter-Medium',
                          fontSize: 15,
                        }}>
                        {item.device_name}
                      </Text>
                    </MenuOption>
                  );
                })}
              </MenuOptions>
            </Menu>
          </View>
          <Pressable
            style={styles.closeWrapper}
            onPress={() => SheetManager.hideAll()}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
        {pdfUri.length > 0 && (
          <Pdf
            scale={1}
            source={{ uri: pdfUri }}
            style={styles.pdf}
            spacing={1}
            // fitPolicy={4}
          />
        )}
        {/* <PrimaryButton
          handlePress={async () => {
            if (pdfUri.length === 0) {
              return;
            }
            try {
              await RNPrint.print({ filePath: pdfUri });
            } catch (error) {
              toast.show('Error printing file, Try again');
            }
          }}
          style={styles.btn}>
          Print
        </PrimaryButton> */}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
  },
  indicatorStyle: {
    display: 'none',
  },
  pdf: {
    // flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 18,
  },
  btn: {
    marginHorizontal: 16,
    borderRadius: 4,
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
  },
  printTxt: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1942D8',
  },
  printWrapper: {
    padding: 8,
  },
  close: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EB455F',
  },
  closeWrapper: {
    marginLeft: 'auto',
    padding: 8,
  },
});

export default props => (
  <MenuProvider>
    <ReceiptPreviewSheet {...props} />
  </MenuProvider>
);
