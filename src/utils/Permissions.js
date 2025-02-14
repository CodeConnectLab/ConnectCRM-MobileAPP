import { Platform, PermissionsAndroid } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

// import PushNotification from 'react-native-push-notification';

export const CallLogPermission = async callback => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callback({status: true});
      } else {
        callback({status: false});
        console.log('Call Log permission denied');
      }
    } else {
      callback({status: false});
    }
  } catch (error) {
    callback({status: false});
    console.error(error);
  }
};

export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles permissions through Info.plist
  } catch (err) {
    console.warn('Error requesting location permission:', err);
    return false;
  }
};

export const checkNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13 and above
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs notification permission',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask Me Later',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below
        return true; // Notifications are enabled by default
      }
    } else {
      // iOS
      const { status } = await checkNotifications();
      if (status === RESULTS.DENIED) {
        const { status: newStatus } = await requestNotifications(['alert', 'sound', 'badge']);
        return newStatus === RESULTS.GRANTED;
      }
      return status === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs notification permission',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask Me Later',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // For Android < 13, notifications are enabled by default
    } else {
      // iOS
      const { status } = await requestNotifications(['alert', 'sound', 'badge']);
      return status === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};