/* eslint-disable react-native/no-inline-styles */
// FloatingButton.js
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Platform,
} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

import {useNavigation, CommonActions} from '@react-navigation/native';
import {ImagerHanlde} from '../utils/ImageProvider';
import {COLORS} from '../styles/themes';
import {ScreenIdentifiers} from '../routes';
const FloatingButton = ({
  icon = ImagerHanlde.BottomNav.add_user,
  bottom = 100,
  tintColor = COLORS.Black,
  onClick,
}) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffset = {x: 0, y: 0};
  // const [isCancelView, setIsCancelView] = useState(false);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.x += event.nativeEvent.translationX;
      lastOffset.y += event.nativeEvent.translationY;

      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLongPress = () => {
    console.log('hello');
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={[
          styles.container,
          {
            bottom: bottom,
            transform: [
              {translateX: Animated.add(translateX, lastOffset.x)},
              {translateY: Animated.add(translateY, lastOffset.y)},
            ],
          },
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onClick}
          onLongPress={handleLongPress}>
          <Image
            source={icon}
            resizeMode="contain"
            style={{height: 25, width: 25, tintColor: tintColor}}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: COLORS.White,
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  button: {
    // backgroundColor: 'blue',
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
  },
});

export default FloatingButton;
