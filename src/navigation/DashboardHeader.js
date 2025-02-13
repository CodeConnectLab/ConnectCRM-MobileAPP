/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ImageBackground,
  Platform,
  Linking,
  SafeAreaView,
} from 'react-native';
import { Screens, ScreenIdentifiers } from '.././routes';
import { COLORS } from '../styles/themes';
import { connect } from 'react-redux';
import { ImagerHanlde } from '../utils/ImageProvider';
import { navigate } from '../routes/RootNavigation';

const DashboardHeader = ({
  title = '',
  titleStatus = 1,
  user,
  config,
  authData,
  apiData,
  apiStatus = true,
  bgColor = COLORS.White,
  textColor = null,
  buttonBgColor = 'transparent',
  imgTintColor = COLORS.Black,
  textSize = 20,
  textFontWeight = '700',
  onMenuPress
}) => {

 // console.log(apiData.Notification);

  return (
    <View
      style={{
        ...styles.headerContent,
        backgroundColor: bgColor,
        justifyContent: 'space-between',
        paddingTop: 40,
      }}>
      <Pressable
        style={{
          ...styles.headerButton,
          backgroundColor: buttonBgColor,
        }}
        onPress={() =>
          onMenuPress()
          //navigate(ScreenIdentifiers.MenuHeader)
        }>
        <Image
          source={ImagerHanlde.BottomNav.menu}
          resizeMode="contain"
          tintColor={imgTintColor}
          style={styles.headerMenu}
        />
      </Pressable>
      {title !== '' && (
        <View style={styles.logoContainer}>
          <Text
            style={{
              fontSize: textSize,
              lineHeight: 29.26,
              alignSelf: 'center',
              fontWeight: textFontWeight,
              color: textColor || COLORS.Black,
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
      )}

      <Pressable
        style={{
          ...styles.headerButton,
          backgroundColor: buttonBgColor,
        }}
        onPress={() => navigate(ScreenIdentifiers.NotificationsScreen , apiData?.Notification || null )}>
        <Image
          source={ImagerHanlde.BottomNav.notification}
          resizeMode="contain"
          tintColor={imgTintColor}
          style={styles.headerNotification}
        />
        {
          apiData?.Notification?.status && <View style={{position: 'absolute', width: 10 , height: 10 , backgroundColor: COLORS.Green , borderRadius: 5 , top: 15 , right: 15}}/>
        }
        
      </Pressable>
    </View>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  config: state.themeReducer,
  authData: state.AuthReducer,
  apiData : state.ApiReducer,
});

export default connect(mapStateToProps, React.memo)(DashboardHeader);

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLORS.White,
    width: '100%',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoContainer: {
    flex: 1, // Use flex property to allow logo to take available space
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: COLORS.White,
    borderRadius: 260,
  },
  headerButtonIcon: {
    width: 18,
    height: 18,
  },
  headerMenu: {
    width: 25,
    height: 25,
  },
  headerNotification: {
    width: 20,
    height: 25,
  },
  logo: {
    width: 48,
    height: 29,
    marginLeft: 35,
  },
});
