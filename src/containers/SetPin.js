/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useToast } from 'react-native-toast-notifications';
import Pass from '../../assets/icons/pass.svg';
import { useNavigation } from '@react-navigation/native';
import { loginApi } from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActionCreator } from '../hooks/useActionCreator';

const SetPin = ({ route }) => {
  const [pin, setPin] = React.useState('');
  const [pinRepeat, setPinRepeat] = React.useState('');
  const { setAuth, setCurrentUser } = useActionCreator();
  const [secureEntry, setSecureEntry] = React.useState(true);
  const [secureEntry1, setSecureEntry1] = React.useState(true);
  const navigation = useNavigation();
  const { uid } = route.params;
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  // const imgWidth = Dimensions.get('window').width * 0.7;

  const _setPin = React.useCallback(async (uid, _pin) => {
    setLoading(true);
    const response = await loginApi.put('/users/merchant/user/pin', {
      uid,
      new_pin: _pin,
    });
    setLoading(false);
    return response;
  }, []);

  return (
    <View style={styles.main}>
      <Text
        style={{
          fontFamily: 'Lato-Black',
          fontSize: 26,
          color: '#183A8A',
          marginVertical: 22,
        }}>
        Set a 4-digit PIN
      </Text>
      <Text
        numberOfLines={2}
        style={{
          fontFamily: 'Inter-Regular',
          color: '#30475e',
          fontSize: 14,
          // marginVertical: Dimensions.get('window').height * 0.03,
          marginBottom: Dimensions.get('window').height * 0.026,
        }}>
        Set a unique 4-digit PIN to enable easy access to your account at
        anytime
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter pin"
          placeholderTextColor="#B8BEC4"
          value={pin}
          onChangeText={setPin}
          cursorColor="#82AAE3"
          autoFocus
          keyboardType="number-pad"
          secureTextEntry={secureEntry}
        />

        <Pressable
          style={styles.iconWrapper}
          onPress={() => setSecureEntry(!secureEntry)}>
          <Pass style={styles.icon} />
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Repeat pin"
          placeholderTextColor="#B8BEC4"
          value={pinRepeat}
          onChangeText={setPinRepeat}
          cursorColor="#82AAE3"
          keyboardType="number-pad"
          secureTextEntry={secureEntry1}
        />
        <Pressable
          style={styles.iconWrapper}
          onPress={() => setSecureEntry1(!secureEntry1)}>
          <Pass style={styles.icon} />
        </Pressable>
      </View>

      <Pressable
        disabled={pin.length === 0 || pinRepeat.length === 0}
        style={[
          styles.btn,
          {
            backgroundColor: 'rgba(71, 183, 73, 0.9)',
          },
        ]}
        onPress={async () => {
          if (pin !== pinRepeat) {
            toast.show('Pins do not match', {
              placement: 'top',
              type: 'danger',
            });
            return;
          }
          try {
            const { data } = await _setPin(uid, pin);
            if (data && data.status == '0') {
              toast.show(data.message, {
                placement: 'top',
              });
              navigation.navigate('Login');
              return;
            }
            toast.show(data && data.message, {
              placement: 'top',
              type: 'danger',
            });
          } catch (error) {}
        }}>
        <Text style={styles.signin}>{loading ? 'Loading' : 'Set Pin'}</Text>
      </Pressable>
    </View>
  );
};

export default SetPin;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
  },
  input: {
    height: '100%',
    borderRadius: 3,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
    color: '#30475e',
    fontFamily: 'Lato-Regular',
  },
  iconWrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  inputWrapper: {
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    borderColor: '#ddd',
    borderWidth: 0.9,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 3,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
});
