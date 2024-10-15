import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistData = async (key, value) => {
  let serializedData =
    typeof value !== 'string' ? JSON.stringify(value) : value;
  try {
    await AsyncStorage.setItem(key, serializedData);
  } catch (e) {
    // saving error
  }
};

export const retrievePersistedData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  } catch (e) {
    // error reading value
  }
};
