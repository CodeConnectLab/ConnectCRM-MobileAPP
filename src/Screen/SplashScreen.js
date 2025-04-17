import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, NativeModules, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundActions from 'react-native-background-actions';
import { useNavigation, CommonActions } from '@react-navigation/native';
import MainContainer from '../components/MainContainer';
import { ImagerHanlde } from '../utils/ImageProvider';
import { COLORS } from '../styles/themes';
import { VersionView } from '../utils';
import { ScreenIdentifiers } from '../routes';
import { API } from '../API';
import { END_POINT } from '../API/UrlProvider';

const { CallLogModule } = NativeModules;

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Background task options
const taskOptions = {
  taskName: 'UploadCallLogs',
  taskTitle: 'Uploading Call Logs',
  taskDesc: 'Syncing your call history',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#FF0000',
  linkingURI: 'yourapp://call-logs',
  delay: 5000, // 5 seconds between checks
  batchSize: 500 // Number of logs to fetch at once
};

const SplashScreen = ({ authData, permissionsHandled = false }) => {
  const navigation = useNavigation();
  const sessionId = authData?.sessionId;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('SplashScreen mounted, sessionId:', sessionId);
    console.log('permissionsHandled:', permissionsHandled);
    
    // Only start background tasks if permissions have been handled
    if (permissionsHandled && Platform.OS === 'android') {
      initializeBackgroundTasks();
    }
    
    // Initialize the app but don't navigate until permissions are handled
    initializeApp();
    
    return () => {
      console.log('SplashScreen unmounting');
    };
  }, [permissionsHandled]); // Re-run when permissionsHandled changes

  // Effect to handle navigation after everything is ready
  useEffect(() => {
    // If both initialization is done AND permissions are handled, then navigate
    if (isInitialized && permissionsHandled) {
      // Add a small delay for better UX
      setTimeout(() => {
        handleNavigation();
      }, 1000);
    }
  }, [isInitialized, permissionsHandled]);

  const initializeApp = async () => {
    try {
      // Add a small delay to show the splash screen
      setTimeout(() => {
        setIsInitialized(true);
      }, 2000);
    } catch (error) {
      console.error('Error in app initialization:', error);
      setIsInitialized(true);
    }
  };

  const initializeBackgroundTasks = async () => {
    try {
      // Set up background tasks now that we have permission
      await setupBackgroundTask();
    } catch (error) {
      console.error('Error setting up background tasks:', error);
    }
  };

  const handleNavigation = () => {
    const targetScreen = sessionId ? ScreenIdentifiers.Dashboard : ScreenIdentifiers.LoginScreen;
    console.log('Navigating to:', targetScreen);
    
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: targetScreen }],
      }),
    );
  };

  const setupBackgroundTask = async () => {
    try {
      if (await BackgroundActions.isRunning()) {
        await BackgroundActions.stop();
      }

      await BackgroundActions.start(uploadCallLogsTask, {
        ...taskOptions,
        parameters: {
          delay: taskOptions.delay,
          batchSize: taskOptions.batchSize
        }
      });
      console.log('Background task started successfully');
    } catch (error) {
      console.error('Failed to start background task:', error);
    }
  };

  const uploadCallLogsTask = async (taskData) => {
    let lastCheckTime = Date.now();

    // while (BackgroundActions.isRunning()) {
    //   try {
    //     const currentTime = Date.now();
    //     console.log(`Background task running. Time since last check: ${(currentTime - lastCheckTime) / 1000}s`);
        
    //     await uploadCallLogs();
    //     lastCheckTime = currentTime;
        
    //     await sleep(taskData.delay || taskOptions.delay);
    //   } catch (error) {
    //     console.error('Error in background task:', error);
    //     await sleep(taskOptions.delay);
    //   }
    // }
  };

  // const uploadCallLogs = async () => {
  //   try {
  //     const storedLogs = JSON.parse(await AsyncStorage.getItem('uploadedLogs')) || [];
  //     const sessionId = JSON.parse(await AsyncStorage.getItem('sessionId'));

  //     if (!sessionId) {
  //       console.log('No session ID available, skipping upload');
  //       return;
  //     }

  //     if (!CallLogModule?.getCallLogs) {
  //       console.error('CallLogModule is not properly initialized');
  //       return;
  //     }

  //     const callLogs = await CallLogModule.getCallLogs(
  //       "ALL CALLS",
  //       "simType",
  //       taskOptions.batchSize
  //     );

  //     if (!callLogs || callLogs.length === 0) {
  //       console.log('No call logs available');
  //       return;
  //     }

  //     const newLogs = callLogs.filter(log => 
  //       !storedLogs.some(storedLog => storedLog?.timestamp === log?.timestamp)
  //     );

  //     if (newLogs.length === 0) {
  //       console.log('No new call logs to upload');
  //       return;
  //     }

  //     console.log(`Uploading ${newLogs.length} new call logs`);

  //     const body = JSON.stringify(newLogs);
  //     // await API.postAuthAPI(
  //     //   body,
  //     //   END_POINT.afterAuth.CallHistory,
  //     //   sessionId,
  //     //   null,
  //     //   async res => {
  //     //     if (res?.data) {
  //     //       await AsyncStorage.setItem('uploadedLogs', JSON.stringify(callLogs));
  //     //       console.log(`Successfully uploaded ${newLogs.length} call logs`);
  //     //     }
  //     //   }
  //     // );
  //   } catch (error) {
  //     console.error('Error in uploadCallLogs:', error);
  //     throw error;
  //   }
  // };

  return (
    <MainContainer 
      screenType={0} 
      backgroundColor={COLORS.lightWhite} 
      paddingTop={0}
    >
      <View style={styles.container}>
        <Image
          source={ImagerHanlde.clientLogo}
          resizeMode="contain"
          style={styles.clientLogo}
        />
      {/* <Text style={{ fontSize: 20, color: COLORS.Black, marginBottom:-20 }}>
      collaboration with
      </Text> */}
        {/* <Image
          source={ImagerHanlde.logo}
          resizeMode="contain"
          style={styles.splashImg}
        /> */}
      </View>
      {VersionView()}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 60
  },
  splashImg: {
    width: 250,
    height: 80,
    alignSelf: 'center',
  },
  clientLogo: {
    width: "100%",
    // height: 80,
    alignSelf: 'center',
  },
});

const mapStateToProps = (state) => ({
  authData: state.AuthReducer,
});

export default connect(mapStateToProps)(SplashScreen);


// import React, { useEffect, useState } from 'react';
// import { Image, Text, View, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';
// import { connect } from 'react-redux';
// import MainContainer from '../components/MainContainer';
// import { ImagerHanlde } from '../utils/ImageProvider';
// import { useNavigation, CommonActions } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BackgroundActions from 'react-native-background-actions';
// import { CallLogPermission } from '../utils/Permissions';
// import { API } from '../API';
// import { END_POINT } from '../API/UrlProvider';
// import { COLORS } from '../styles/themes';
// import { VersionView } from '../utils';
// import { ScreenIdentifiers } from '../routes';

// const BATCH_SIZE = 20; // Define batch size for uploads
// const CALL_LOG_EVENT = 'CALL_LOG_EVENT'; // Mock event name for call log changes
// const { CallLogModule } = NativeModules;

// const SplashScreen = ({ authData }) => {
//   const navigation = useNavigation();
//   const sessionId = authData?.sessionId;
//   const [isVisible, setisVisible] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (isVisible) {
//         CallLogPermission(async res => {
//           if (res?.status) {
//             await startBackgroundTask();
//           }
//         });
//         await getInitData();
//       } else {
//         setTimeout(() => {
//           setisVisible(true);
//         }, 1000);
//       }
//     })();
//   }, [isVisible]);

//   const getInitData = () => {
//     setTimeout(() => {
//       if (sessionId === null) {
//         handleScreen(ScreenIdentifiers.LoginScreen);
//       } else {
//         handleScreen(ScreenIdentifiers.Dashboard);
//       }
//     }, 2000);
//   };

//   const handleScreen = where => {
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 1,
//         routes: [{ name: where }],
//       }),
//     );
//   };

//   const startBackgroundTask = async () => {
//     const options = {
//       taskName: 'UploadCallLogs',
//       taskTitle: 'Uploading Call Logs',
//       taskDesc: 'Foreground service to upload call logs.',
//       taskIcon: {
//         name: 'ic_launcher',
//         type: 'mipmap',
//       },
//       color: '#FF0000', // Notification color
//       linkingURI: 'myapp://upload-call-logs', // Deep linking URI
//       parameters: {
//         delay: 1000, // Delay for checking call logs
//       },
//     };

//     const uploadCallLogsTask = async taskData => {
//       try {
//         while (BackgroundActions.isRunning()) {
//           await uploadCallLogs(); // Upload call logs
//           await sleep(taskData.delay); // Wait before the next upload
//         }
//       } catch (error) {
//         console.error('Error in foreground task:', error);
//       }
//     };

//     await BackgroundActions.start(uploadCallLogsTask, options);
//   };

//   return (
//     <MainContainer screenType={0} backgroundColor={COLORS.lightWhite} paddingTop={0}>
//       <View
//         style={{
//           flex: 1,
//           width: '100%',
//           height: '100%',
//           flex: 1,
//           alignItems: 'center',
//           alignSelf: 'center',
//           justifyContent: 'center',
//         }}>
//         <Image
//           source={ImagerHanlde.logo}
//           resizeMode="contain"
//           style={styles.splashImg}
//         />
//       </View>
//       {VersionView()}
//     </MainContainer>
//   );
// };

// const styles = StyleSheet.create({
//   splashImg: {
//     width: 250,
//     height: 80,
//     alignSelf: 'center',
//     alignContent: 'center',
//     justifyContent: 'center',
//   },
// });

// const mapStateToProps = (state, ownProps) => ({
//   user: state.userReducer,
//   authData: state.AuthReducer,
// });

// export default connect(mapStateToProps, React.memo)(SplashScreen);

// const uploadCallLogs = async () => {
//   try {
//     const storedLogs =
//       JSON.parse(await AsyncStorage.getItem('uploadedLogs')) || [];
//     const sessionId =
//       JSON.parse(await AsyncStorage.getItem('sessionId')) || null;
//     // const simType =
//     //   await AsyncStorage.getItem('SimSlots') || null;

//     if (sessionId !== null ) {
//       const callLogs = await CallLogModule.getCallLogs("ALL CALLS", "simType", 500);

//       const newLogs = await callLogs.filter(log => {
//         return !storedLogs.some(
//           storedLog => storedLog?.timestamp === log?.timestamp,
//         );
//       });

//       if (newLogs?.length > 0) {
//         const body = JSON.stringify(newLogs);
//         await API.postAuthAPI(
//           body,
//           END_POINT.afterAuth.CallHistory,
//           sessionId,
//           null,
//           async res => {
//             if (res?.data) {
//               await AsyncStorage.setItem(
//                 'uploadedLogs',
//                 JSON.stringify(callLogs),
//               );
//             }
//           },
//         );
//       } else {
//         console.log('No new call logs to upload.');
//       }
//     } else {
//       console.log('Token & sim selection problem.');
//     }
//   } catch (error) {
//     console.error('Error uploading call logs:', error);
//   }
// };

// // Sleep utility for task delay
// const sleep = time => new Promise(resolve => setTimeout(resolve, time));
