/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  // TouchableOpacity,
  TextInput,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import { Pressable } from 'react-native';

function DeliveryNote(props) {
  const { deliveryNote } = useSelector(state => state.sale);
  const { setDeliveryNote } = useActionCreator();
  // const { user } = useSelector(state => state.auth);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Add Delivery Notes</Text>
          <Pressable
            style={styles.doneWrapper}
            onPress={() => SheetManager.hide('deliveryNote')}>
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            multiline
            textAlignVertical="top"
            autoFocus
            value={deliveryNote}
            onChangeText={text => setDeliveryNote(text)}
            placeholder="Add delivery note here..."
            placeholderTextColor="#bbb"
          />
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '92%',
    borderRadius: 0,
    backgroundColor: '#fff',
  },
  btn: {
    marginTop: 12,
  },
  itemStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
  containerStyle: {
    borderRadius: 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.5,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 19,
    color: '#30475E',
    letterSpacing: -0.1,
  },
  done: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#1942D8',
    fontSize: 18,
    letterSpacing: -0.1,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  indicatorStyle: {
    display: 'none',
  },
  inputWrapper: {
    height: '90%',
    padding: 12,
  },
  input: {
    height: '50%',
    padding: 18,
    color: '#30475e',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: 12,
    borderColor: '#ddd',
    borderWidth: 0.8,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.5,
    paddingVertical: 22,
    paddingTop: 22,
  },
});

export default DeliveryNote;

