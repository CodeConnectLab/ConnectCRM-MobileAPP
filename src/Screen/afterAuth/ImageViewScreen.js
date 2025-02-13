/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../components/MainContainer';
import {View, StyleSheet, Image} from 'react-native';
import {COLORS} from '../../styles/themes';

const ImageViewScreen = ({user, authData, route}) => {
  return (
    <MainContainer
      HaderName={'View Image'}
      screenType={3}
      tintColor={COLORS.White}
      taxtColour={COLORS.White}
      backgroundColor={COLORS.Black}>
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.Black,
        }}>
        {route?.params?.images && (
          <Image
            source={{uri: route?.params?.images}}
            resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          />
        )}
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(ImageViewScreen);
