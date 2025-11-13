import { Platform, PermissionsAndroid } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

// import PushNotification from 'react-native-push-notification';

export const CallLogPermission = async callback => {
  try {
    callback({status: false});
    // if (Platform.OS === 'android') {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    //     {
    //       title: 'Call Log Permission',
    //       message: 'This app needs access to your call logs to display your call history.',
    //       buttonNeutral: 'Ask Me Later',
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK',
    //     }
    //   );

    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     callback({status: true});
    //   } else {
    //     callback({status: false});
    //     console.log('Call Log permission denied');
    //   }
    // } else {
    //   callback({status: false});
    // }
  } catch (error) {
    callback({status: false});
    console.error(error);
  }
};

// Request all permissions at once
export const requestAllPermissionsAtOnce = async () => {
  console.log('Requesting all permissions at once');
  try {
    if (Platform.OS === 'android') {
      // Create an array of permission requests to request simultaneously
      const permissions = [];
      
      // Add call log permission
      // permissions.push(
      //   PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
      // );
      
      // Add location permission
      permissions.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      // Add notification permission for Android 13+
      if (Platform.Version >= 33) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      
      // Request all permissions at once
      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      console.log('Permission results:', results);
      
      // Return the results for each permission
      return {
        // callLog: results[PermissionsAndroid.PERMISSIONS.READ_CALL_LOG] === PermissionsAndroid.RESULTS.GRANTED,
        location: results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED,
        notification: Platform.Version >= 33 
          ? results[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED 
          : true
      };
    } else {
      // iOS handles permissions differently
      const { status } = await requestNotifications(['alert', 'sound', 'badge']);
      const notificationGranted = status === RESULTS.GRANTED;
      
      return {
        // callLog: true, // iOS doesn't have call log permission
        location: true, // For iOS, location is handled via Info.plist
        notification: notificationGranted
      };
    }
  } catch (error) {
    console.error('Error requesting all permissions:', error);
    return {
      callLog: false,
      location: false,
      notification: false
    };
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
  console.log('checkNotificationPermission');

  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13 and above
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs notification permission to alert you about new updates',
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