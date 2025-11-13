import AsyncStorage from '@react-native-async-storage/async-storage';
import {ConsoleMsg} from '../utils';

export const LocalStorage_Identifiers = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  TOKEN_TIMESTAMP: 'TOKENTIMESTAMP',
  AskExpert: 'AskExpert',
  FCM_TOKEN: 'FCM_TOKEN',
};

export const getStringData = async (key, callback) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (callback) callback(value);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

export const setStringData = async (key, value, callback) => {
  try {
    await AsyncStorage.setItem(key, value);
    if (callback) callback(true);
  } catch (error) {
    if (callback) callback(false);
  }
};

export const getObjectData = async (key, callback) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const parsedData = JSON.parse(value);
      if (callback) callback(parsedData);
      return parsedData;
    } else {
      if (callback) callback(null);
      return null;
    }
  } catch (e) {}
};

export const setObjectData = async (key, value, callback) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    if (callback) callback(true);
  } catch (error) {
    if (callback) callback(false);
  }
};

export const ClearStorage = async () => {
  AsyncStorage.clear();
  // AsyncStorage.getAllKeys()
  //   .then((keys) => AsyncStorage.multiRemove(keys))
  //   .then(() => ConsoleMsg('Data Cleared'));
};

export const LocalStorage = {
  getStringData,
  setStringData,
  getObjectData,
  setObjectData,
  ClearStorage,
};
