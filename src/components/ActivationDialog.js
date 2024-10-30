/* eslint-disable react-native/no-inline-styles */
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Dialog } from 'react-native-ui-lib';
import Warning from '../../assets/icons/warning1';
import { useNavigation } from '@react-navigation/native';
import Modal from './Modal';
const ActivationDialog = ({ dialog, setDialog }) => {
  const navigation = useNavigation();
  return (
    <Modal modalState={dialog} changeModalState={setDialog}>
      <View style={styles.modalView}>
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Warning height={40} width={40} />
        </View>
        <Text
          style={{
            fontFamily: 'Lato-Semibold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 10,
            width: '80%',
          }}>
          You do not have an active payment account to use this feature
        </Text>
        <Pressable
          style={[
            styles.btn,
            {
              backgroundColor: 'rgba(71, 183, 73, 0.9)',
              marginTop: 12,
            },
          ]}
          onPress={async () => {
            navigation.navigate('Activation Type');
            setDialog(false);
          }}>
          <Text style={styles.signin}>Complete Account Activation</Text>
        </Pressable>
        <Pressable
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              padding: 14,
              marginTop: 12,
            },
          ]}
          onPress={async () => {
            setDialog(false);
          }}>
          <Text style={[styles.signin, { color: 'blue' }]}>Not Now</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// const ActivationDialog = ({ dialog, setDialog }) => {
//   const navigation = useNavigation();
//   Pressable;
//   return (
//     <Dialog
//       visible={dialog}
//       height={Dimensions.get('window').height * 0.36}
//       width={Dimensions.get('window').width * 0.73}
//       containerStyle={{
//         backgroundColor: '#fff',
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         borderRadius: 12,
//       }}
//       onDismiss={() => {
//         setDialog(false);
//       }}>
//       <View style={{ alignItems: 'center', paddingVertical: 12 }}>
//         <Warning height={40} width={40} />
//       </View>
//       <Text
//         style={{
//           fontFamily: 'Lato-Semibold',
//           fontSize: 16,
//           color: '#30475e',
//           textAlign: 'center',
//           marginVertical: 10,
//         }}>
//         You do not have an active payment account to use this feature
//       </Text>
//       <Pressable
//         style={[
//           styles.btn,
//           {
//             backgroundColor: 'rgba(71, 183, 73, 0.9)',
//             marginTop: 12,
//           },
//         ]}
//         onPress={async () => {
//           navigation.navigate('Activation Type');
//           setDialog(false);
//         }}>
//         <Text style={styles.signin}>Complete Account Activation</Text>
//       </Pressable>
//       <Pressable
//         style={[
//           {
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: 14,
//             marginTop: 12,
//           },
//         ]}
//         onPress={async () => {
//           setDialog(false);
//         }}>
//         <Text style={[styles.signin, { color: 'blue' }]}>Not Now</Text>
//       </Pressable>
//     </Dialog>
//   );
// };

export default ActivationDialog;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
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
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 26,
    paddingBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
