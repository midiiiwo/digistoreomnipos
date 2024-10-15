import React from 'react';
import { StyleSheet, InteractionManager } from 'react-native';
import RNModal from 'react-native-modal';

const Modal = ({ children, modalState, onModalHide, ...otherProps }) => {
  return (
    // <View style={styles.modalContainer}>
    <RNModal
      isVisible={modalState}
      style={styles.modal}
      onModalHide={() => {
        InteractionManager.runAfterInteractions(onModalHide);
      }}
      {...otherProps}
      animationIn="zoomIn"
      animationOut="zoomOut"
      // hideModalContentWhileAnimating

      backdropTransitionOutTiming={0}
      supportedOrientations={['portrait', 'landscape']}
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
