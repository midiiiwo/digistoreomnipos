import React from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import RNModal from 'react-native-modal';

const Modal = ({
  children,
  modalState,
  onModalHide,
  onModalShow,
  onModalWillShow,
  ...otherProps
}) => {
  return (
    // <View style={styles.modalContainer}>
    <RNModal
      isVisible={modalState}
      style={styles.modal}
      onModalHide={() => {
        InteractionManager.runAfterInteractions(onModalHide);
      }}
      onModalShow={() => {
        InteractionManager.runAfterInteractions(onModalShow);
      }}
      {...otherProps}
      animationIn="zoomIn"
      animationOut="zoomOut"
      // hideModalContentWhileAnimating

      backdropTransitionOutTiming={0}
      supportedOrientations={['portrait', 'landscape']}
      onModalWillShow={onModalWillShow}
      // onBackdropPress={() => changeModalState(false)}
    >
      {children}
    </RNModal>
    // </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
});

export default Modal;
