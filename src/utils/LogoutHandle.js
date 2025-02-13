import React from 'react';
import { dispatchUserLogOut } from '../redux/actionDispatchers/auth-dispatchers';
import { dispatchRemoveUser } from '../redux/actionDispatchers/user-dispatchers';
import { ScreenIdentifiers } from '../routes';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  dispatchAddAPI,
  dispatchRemoveAPI,
} from '../redux/actionDispatchers/Api-dispatchers';
import { LocalStorage, LocalStorage_Identifiers } from '../localStorage';
// import {LocalStorage} from '../localStorage';
export const LogoutHandle = async navigation => {
  if (navigation) {
    // LocalStorage.ClearStorage();
    dispatchUserLogOut();
    dispatchRemoveUser();
    // dispatchRemoveAPI();

    const fcmToken = await LocalStorage.getObjectData(
      LocalStorage_Identifiers.FCM_TOKEN,
    );

    await LocalStorage.ClearStorage();
    const ReduxData = {
      Home: null,
    };

    await LocalStorage.setObjectData(
      LocalStorage_Identifiers.FCM_TOKEN,
      fcmToken,
    );

    dispatchAddAPI(ReduxData);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreenIdentifiers.LoginScreen }],
      }),
    );
  }

  return null;
};

export const ClearRedux = async () => {
  dispatchUserLogOut();
  dispatchRemoveUser();
}
