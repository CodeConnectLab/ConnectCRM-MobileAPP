/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import MainRoute from './src/routes/MainRoute';
import {Provider} from 'react-redux';
import {configStore} from './src/redux/store';
import {StatusBar, PermissionsAndroid} from 'react-native';
import {
  checkNotificationPermission,
  requestLocationPermission,
} from './src/utils/Permissions';

import {fcmService} from './src/utils/FCMService';
import {LocalStorage, LocalStorage_Identifiers} from './src/localStorage';
import CodePush from 'react-native-code-push';

//appcenter codepush release-react -a prafullgoel7-gmail.com/Code-connect-CRM -d CodePushDeploymentKey

const App = () => {
  useEffect(() => {
    setPermission();
  }, []);

  const setPermission = async () => {
    await checkNotificationPermission();
    // const hasPermission = await requestLocationPermission();
  };

  const onRegister = async token => {
    // console.log("[App] Token ", token);
    // ReactMoE.passFcmPushToken(token);
    await LocalStorage.setObjectData(LocalStorage_Identifiers.FCM_TOKEN, token);
  };

  const onNotification = notify => {
    // console.log("[App] onNotification", notify);
  };

  const onOpenNotification = async notify => {
    //console.log('notify', notify);
  };

  useEffect(() => {
    fcmService.requestUserPermission();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
  }, []);

  return (
    <Provider store={configStore}>
      <StatusBar
        hidden={false}
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <MainRoute />
    </Provider>
  );
};

// CodePush Configuration
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START, // Check for updates on app start
};

// Wrap the App component with CodePush
export default CodePush(codePushOptions)(App);
//export default App;
