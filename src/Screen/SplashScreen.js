import React, { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import MainContainer from '../components/MainContainer';
import { ImagerHanlde } from '../utils/ImageProvider';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundActions from 'react-native-background-actions';
import { CallLogPermission } from '../utils/Permissions';
import { API } from '../API';
import { END_POINT } from '../API/UrlProvider';
import { COLORS } from '../styles/themes';
import { VersionView } from '../utils';
import { ScreenIdentifiers } from '../routes';

const BATCH_SIZE = 20; // Define batch size for uploads
const CALL_LOG_EVENT = 'CALL_LOG_EVENT'; // Mock event name for call log changes
const { CallLogModule } = NativeModules;

const SplashScreen = ({ authData }) => {
  const navigation = useNavigation();
  const sessionId = authData?.sessionId;
  const [isVisible, setisVisible] = useState(false);

  useEffect(() => {
    (async () => {
      if (isVisible) {
        CallLogPermission(async res => {
          if (res?.status) {
            await startBackgroundTask();
          }
        });
        await getInitData();
      } else {
        setTimeout(() => {
          setisVisible(true);
        }, 1000);
      }
    })();
  }, [isVisible]);

  const getInitData = () => {
    setTimeout(() => {
      if (sessionId === null) {
        handleScreen(ScreenIdentifiers.LoginScreen);
      } else {
        handleScreen(ScreenIdentifiers.Dashboard);
      }
    }, 2000);
  };

  const handleScreen = where => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: where }],
      }),
    );
  };

  const startBackgroundTask = async () => {
    const options = {
      taskName: 'UploadCallLogs',
      taskTitle: 'Uploading Call Logs',
      taskDesc: 'Foreground service to upload call logs.',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#FF0000', // Notification color
      linkingURI: 'myapp://upload-call-logs', // Deep linking URI
      parameters: {
        delay: 1000, // Delay for checking call logs
      },
    };

    const uploadCallLogsTask = async taskData => {
      try {
        while (BackgroundActions.isRunning()) {
          await uploadCallLogs(); // Upload call logs
          await sleep(taskData.delay); // Wait before the next upload
        }
      } catch (error) {
        console.error('Error in foreground task:', error);
      }
    };

    await BackgroundActions.start(uploadCallLogsTask, options);
  };

  return (
    <MainContainer screenType={0} backgroundColor={COLORS.lightWhite} paddingTop={0}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          flex: 1,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={ImagerHanlde.logo}
          resizeMode="contain"
          style={styles.splashImg}
        />
      </View>
      {VersionView()}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  splashImg: {
    width: 250,
    height: 80,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(SplashScreen);

const uploadCallLogs = async () => {
  try {
    const storedLogs =
      JSON.parse(await AsyncStorage.getItem('uploadedLogs')) || [];
    const sessionId =
      JSON.parse(await AsyncStorage.getItem('sessionId')) || null;
    // const simType =
    //   await AsyncStorage.getItem('SimSlots') || null;

    if (sessionId !== null ) {
      const callLogs = await CallLogModule.getCallLogs("ALL CALLS", "simType", 500);

      const newLogs = await callLogs.filter(log => {
        return !storedLogs.some(
          storedLog => storedLog?.timestamp === log?.timestamp,
        );
      });

      if (newLogs?.length > 0) {
        const body = JSON.stringify(newLogs);
        await API.postAuthAPI(
          body,
          END_POINT.afterAuth.CallHistory,
          sessionId,
          null,
          async res => {
            if (res?.data) {
              await AsyncStorage.setItem(
                'uploadedLogs',
                JSON.stringify(callLogs),
              );
            }
          },
        );
      } else {
        console.log('No new call logs to upload.');
      }
    } else {
      console.log('Token & sim selection problem.');
    }
  } catch (error) {
    console.error('Error uploading call logs:', error);
  }
};

// Sleep utility for task delay
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
