/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import { Pressable } from 'react-native';

function NotesSheet(props) {
  const { orderNotes } = useSelector(state => state.sale);
  const { setOrderNote } = useActionCreator();
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      openAnimationConfig={{ bounciness: 0 }}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Add notes</Text>
          <Pressable
            style={styles.doneWrapper}
            onPress={() => SheetManager.hide('note')}>
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            multiline
            textAlignVertical="top"
            // autoFocus
            value={orderNotes}
            onChangeText={text => setOrderNote(text)}
            placeholder="Add note here..."
            placeholderTextColor="#888"
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
    fontSize: 18,
    color: '#30475E',
    letterSpacing: 0.3,
  },
  done: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: 0.3,
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
    height: '40%',
    padding: 18,
    color: '#30475e',
    fontSize: 15,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: 12,
    borderColor: '#ddd',
    borderWidth: 0.8,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.5,
    paddingVertical: 22,
  },
});

export default NotesSheet;

