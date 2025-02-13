/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {LogoutHandle} from '../../../utils/LogoutHandle';
import {ImagerHanlde} from '../../../utils/ImageProvider';

const LogoutScreen = ({user, authData}) => {
  const navigation = useNavigation();
  const onConfirmHandle = () => {
    LogoutHandle(navigation);
  };
  return (
    <MainContainer>
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>
            {'Do you want to\n'}
            <Text style={styles.subHeaderText}>{'logout?'}</Text>
          </Text>
          <Image
            source={ImagerHanlde.setting.logout_image}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.confirmationText}>
            {'Are you sure you want to logout?'}
          </Text>
          <Text style={styles.descriptionText}>
            {'Reconnect with tranquility anytime. Stay mindful, stay balanced.'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={onConfirmHandle} style={styles.yesButton}>
            <Text style={styles.buttonText}>Yes</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.noButton}>
            <Text style={{...styles.buttonText, color: COLORS.White}}>No</Text>
          </Pressable>
        </View>
      </View>
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 29.26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1F3132',
  },
  subHeaderText: {
    fontWeight: '700',
    color: COLORS.Blue,
  },
  image: {
    width: 270,
    height: 296,
    marginVertical: 70,
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21.6,
    color: COLORS.Black,
  },
  descriptionText: {
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 21.6,
    color: COLORS.Black,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 30,
    marginBottom: 10,
  },
  yesButton: {
    flex: 1,
    height: 73,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1F3132',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noButton: {
    flex: 1,
    height: 73,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.Blue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Blue,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29.26,
    color: COLORS.Black,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(LogoutScreen);
