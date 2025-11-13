/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, SafeAreaView, Image, Text, Pressable} from 'react-native';
import {COLORS} from '../styles/themes';
import {ImagerHanlde} from '../utils/ImageProvider';
import {useBackHandler} from '@react-native-community/hooks';
import {useNavigation} from '@react-navigation/native';

const MainContainer = ({
  children,
  MainBackgroundColor = COLORS.White,
  screenType = 1,
  paddingTop = 43,
  HaderName = '',
  BackHandleName = 'Back',
  backgroundColor = COLORS.White,
  buttonStyle = {},
  onHandleButton,
  buttonStatus = false,
  taxtColour = COLORS.Black,
  tintColor = COLORS.Black,
  icon = ImagerHanlde.EditIcon,
  iconStyle = {
    width: 20,
    height: 20,
    zIndex: 1,
    tintColor: tintColor,
  },
}) => {
  const navigation = useNavigation();

  const onhardwareBack = () => {
    if (BackHandleName === 'Back') {
      navigation.goBack();
    } else {
      navigation.navigate(BackHandleName);
    }

    return true;
  };

  useBackHandler(onhardwareBack);

  const UiType = () => {
    switch (screenType) {
      case 0:
        return (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor : backgroundColor,
              paddingTop: paddingTop,
            }}>
            {children}
          </View>
        );
      case 1:
        return (
          <SafeAreaView
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingTop: paddingTop,
            }}>
            {children}
          </SafeAreaView>
        );
      case 2:
        return (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingTop: paddingTop,
              backgroundColor: MainBackgroundColor,
            }}>
            {children}
          </View>
        );
      case 3:
        return (
          <SafeAreaView
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              paddingTop: paddingTop,
              backgroundColor: backgroundColor,
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                paddingHorizontal: 20,
                gap: 20,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: taxtColour,
                  textAlign: 'center',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 0,
                }}>
                {HaderName}
              </Text>
              <Pressable onPress={() => onhardwareBack()} style={buttonStyle}>
                <Image
                  source={ImagerHanlde.backIcon}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    zIndex: 1,
                    tintColor: tintColor,
                  }}
                />
              </Pressable>
              {buttonStatus && (
                <Pressable
                  onPress={onHandleButton}
                  style={{position: 'absolute', right: 20}}>
                  <Image source={icon} style={iconStyle} />
                </Pressable>
              )}
            </View>
            {children}
          </SafeAreaView>
        );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: MainBackgroundColor}}>
      {UiType()}
    </View>
  );
};

export default MainContainer;
