import {PermissionsAndroid, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
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
    } else {
      // For iOS, permissions are handled automatically via `Info.plist`
      return true;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const checkNotificationPermission = async () => {
  try {
    const result = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.IOS.NOTIFICATIONS,
    );
    if (result !== RESULTS.GRANTED) {
      requestNotificationPermission();
    } else {
      await requestLocationPermission();
    }
  } catch (error) {
    console.error('Error checking notification permission:', error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const result = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.IOS.NOTIFICATIONS,
    );
    const requestResult = await requestNotifications([
      'alert',
      'sound',
      'badge',
    ]);
    await requestLocationPermission();
    // if (result !== RESULTS.GRANTED) {
    //   openSettings();
    // }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};
