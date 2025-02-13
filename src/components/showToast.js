import {View, Text, Platform, Alert} from 'react-native';

export const showToast = (
  message,
  title = 'Error',
  itemText = 'Try again',
  onclick = null,
) => {
  Alert.alert(title, message, [{text: itemText, onPress: () => onclick}], {
    cancelable: false,
  });
};
