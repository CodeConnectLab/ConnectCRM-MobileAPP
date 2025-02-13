/* eslint-disable react/self-closing-comp */
import React from 'react';
import {Pressable, Text, StyleSheet, Image} from 'react-native';
import {COLORS} from '../styles/themes';

export const ButtonContainer = ({
  bgColor = COLORS.Blue,
  borderColour = COLORS.Black,
  top = 20,
  bottom = 0,
  magHorizontal = 0,
  width = '95%',
  height = 50,
  TextColor = COLORS.Black,
  textValue = 'Button 1',
  fontSize = 20,
  onClick,
  isActive = true,
}) => {
  return (
    <Pressable
      onPress={() => onClick()}
      style={[
        styles.button,
        {
          marginHorizontal: magHorizontal,
          width: width,
          height: height,
          marginTop: top,
          marginBottom: bottom,
          backgroundColor: isActive ? bgColor : COLORS.LightGray,
          borderColor: isActive ? borderColour : COLORS.LightGray,
        },
      ]}>
      <Text style={[styles.text, {color: TextColor, fontSize: fontSize}]}>
        {textValue}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    // width: '100%',
    // height: '10%',
  },
  text: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29.26,
    textAlign: 'center',
    flex: 1,
    position: 'absolute',
  },
});
