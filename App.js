/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import MainRoute from './src/routes/MainRoute';
import {Provider} from 'react-redux';
import {configStore} from './src/redux/store';
import {StatusBar} from 'react-native';
import {requestAllPermissionsAtOnce} from './src/utils/Permissions';

import {fcmService} from './src/utils/FCMService';
import {LocalStorage, LocalStorage_Identifiers} from './src/localStorage';
import CodePush from 'react-native-code-push';

//appcenter codepush release-react -a prafullgoel7-gmail.com/Code-connect-CRM -d CodePushDeploymentKey

const App = () => {
  const [permissionsHandled, setPermissionsHandled] = useState(false);

  useEffect(() => {    
    // Request all permissions on first launch
    handleInitialSetup();
  }, []);

  const handleInitialSetup = async () => {
    // Request all permissions at once
    const permissionResults = await requestAllPermissionsAtOnce();
    console.log('All permission results:', permissionResults);
    
    // Mark permissions as handled regardless of the result
    setPermissionsHandled(true);
    
    // Set up FCM services
    fcmService.requestUserPermission();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
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

  // Only render MainRoute after permissions are handled
  return (
    <Provider store={configStore}>
      <StatusBar
        hidden={false}
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <MainRoute permissionsHandled={permissionsHandled} />
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
