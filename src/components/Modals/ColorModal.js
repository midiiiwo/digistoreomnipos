/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { Dialog } from 'react-native-ui-lib';
import Warning from '../../../assets/icons/Info';
import { useNavigation } from '@react-navigation/native';
import Modal from '../Modal';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ColorPicker, {
  Panel1,
  Swatches,
  OpacitySlider,
  HueSlider,
  colorKit,
  PreviewText,
} from 'reanimated-color-picker';

const ColorModal = ({ dialog, setDialog, color, setColor }) => {
  const customSwatches = new Array(6)
    .fill('#fff')
    .map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(color);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onColorSelect = color_ => {
    setColor(color_.hex);
    selectedColor.value = color_.hex;
  };
  return (
    <Modal modalState={dialog} changeModalState={setDialog}>
      <Animated.View style={[styles.container, backgroundColorStyle]}>
        <View style={styles.pickerContainer}>
          <ColorPicker
            value={selectedColor.value}
            sliderThickness={25}
            thumbSize={24}
            thumbShape="circle"
            onChange={onColorSelect}
            boundedThumb>
            <Panel1 style={styles.panelStyle} />
            <HueSlider style={styles.sliderStyle} />
            <OpacitySlider style={styles.sliderStyle} />
            <Swatches
              style={styles.swatchesContainer}
              swatchStyle={styles.swatchStyle}
              colors={customSwatches}
            />
            <View style={styles.previewTxtContainer}>
              <PreviewText style={{ color: '#707070' }} />
            </View>
          </ColorPicker>
        </View>

        <Pressable style={styles.closeButton} onPress={() => setDialog(false)}>
          <Text
            style={{
              color: 'rgba(25, 66, 216, 0.9)',
              fontWeight: 'bold',
              fontFamily: 'Roboto-Regular',
              fontSize: 15,
            }}>
            Confirm
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

export default ColorModal;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    borderRadius: 3,
    width: '100%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '56%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 26,
    paddingBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 20,
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,

    // elevation: 10,
  },
  panelStyle: {
    borderRadius: 24,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 0.6,
    borderColor: '#ddd',
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    // borderTopWidth: 1,
    // borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  openButton: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
});
