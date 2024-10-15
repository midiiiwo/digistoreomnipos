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

const Password = ({ route }) => {
  const [password, setPassword] = React.useState('');
  const { setAuth, setCurrentUser } = useActionCreator();
  const [secureEntry, setSecureEntry] = React.useState(true);
  const navigation = useNavigation();
  const { username } = route.params;
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  // const imgWidth = Dimensions.get('window').width * 0.7;

  const signin = React.useCallback(async (user, pin) => {
    setLoading(true);
    const response = await loginApi.post('/login/merchant', {
      username: user,
      password: pin,
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
          color: '#30475e',
          marginVertical: 22,
        }}>
        Enter Password
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#B8BEC4"
          value={password}
          onChangeText={setPassword}
          cursorColor="#82AAE3"
          autoFocus
          // keyboardType="number-pad"
          secureTextEntry={secureEntry}
        />
        <Pressable
          style={styles.iconWrapper}
          onPress={() => setSecureEntry(!secureEntry)}>
          <Pass style={styles.icon} />
        </Pressable>
      </View>
      <Pressable
        disabled={password.length === 0 || loading}
        style={[
          styles.btn,
          {
            backgroundColor: 'rgba(71, 183, 73, 0.9)',
          },
        ]}
        onPress={async () => {
          try {
            const { data } = await signin(username, password);
            if (data.status == '0') {
              await AsyncStorage.setItem('user', JSON.stringify(data));
              setCurrentUser({
                ...data,
                merchant: data.user_merchant_id,
                outlet: data.user_merchant_group_id,
              });
              setAuth(true);
              // setPinState({ pinStatus: 'enter', showPin: false });
              navigation.replace('Dashboard');
              return;
            }
            toast.show(data.message, {
              placement: 'top',
              type: 'danger',
            });
          } catch (error) {}
        }}>
        <Text style={styles.signin}>{loading ? 'Loading' : 'Sign in'}</Text>
      </Pressable>
    </View>
  );
};

export default Password;

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
