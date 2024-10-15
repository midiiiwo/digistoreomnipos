/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';

import React from 'react';

export const DeleteDialog = ({
  title,
  prompt,
  handleSuccess,
  handleCancel,
  visible,
}) => {
  return (
    <View>
      <Dialog.Container
        visible={visible}
        contentStyle={{ backgroundColor: '#fff' }}
        onBackdropPress={handleCancel}>
        <Dialog.Title style={{ color: '#30475e' }}>{title}</Dialog.Title>
        <Dialog.Description>{prompt}</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={handleCancel}
          color="rgba(25, 66, 216, 0.9)"
        />
        <Dialog.Button
          label="Delete"
          onPress={() => {
            handleSuccess();
            handleCancel();
          }}
          color="rgba(25, 66, 216, 0.9)"
        />
      </Dialog.Container>
    </View>
  );
};

export default DeleteDialog;

// const styles = StyleSheet.create({});
