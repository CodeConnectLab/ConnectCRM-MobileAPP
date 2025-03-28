/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import { ImagerHanlde } from '../../../utils/ImageProvider';
import { COLORS } from '../../../styles/themes';
import { ButtonContainer } from '../../../components/ButtonContainer';
import { validateEmail, VersionView } from '../../../utils';
import { showToast } from '../../../components/showToast';
import { API } from '../../../API';
import { END_POINT } from '../../../API/UrlProvider';
import { dispatchUserLogin } from '../../../redux/actionDispatchers/auth-dispatchers';
import { ScreenIdentifiers } from '../../../routes';
import { dispatchAddUser } from '../../../redux/actionDispatchers/user-dispatchers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage, LocalStorage_Identifiers } from '../../../localStorage';
//praful@yopmail.com
//12345678
const LoginScreen = ({ user, authData }) => {
  const navigation = useNavigation();
  const [EmailInput, setEmailInput] = useState('');
  const [PasswordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [IsVisable, setIsVisable] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    const fcmToken = await LocalStorage.getObjectData(
      LocalStorage_Identifiers.FCM_TOKEN,
    );
    if (!validateEmail(EmailInput)) {
      showToast('Please enter a valid email address.');
    } else if (PasswordInput === '' || PasswordInput.length < 4) {
      showToast('Please enter a valid Password.');
    } else {
      setLoading(true);
      const body = {
        email: EmailInput,
        password: PasswordInput,
        fcmMobileToken: fcmToken || ""
      };

      API.postAuthAPI(body, END_POINT.preAuth.login, null, null, async res => {
        setLoading(false);
        if (res?.status) {
          let userLoginData = {
            ...authData,
            sessionId: res?.data?.token || null,
            sessionRefreshId: res?.data?.refreshToken || null,
            tokenTimeStamp: new Date(),
          };

          await AsyncStorage.setItem(
            'sessionId',
            JSON.stringify(res?.data?.token),
          );

          dispatchUserLogin(userLoginData);

          const AddData = {
            ...user,
            id: res?.data?.user?._id || null,
            name: res?.data?.user?.name || null,
            mobile: res?.data?.user?.phone || null,
            email: res?.data?.user?.email || null,
            image: res?.data?.user?.profilePic || null,
            loginType: res?.data?.user?.role || null,
            // userData: res?.data?.user?.company || null,
            bio: res?.data?.user?.bio || null,
            companyData: res?.data?.user?.company || null
          };
          dispatchAddUser(AddData);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: ScreenIdentifiers.Dashboard,
                },
              ],
            }),
          );
        } else {
          showToast(res?.message || 'something went wrong');
        }
      });
    }
  };

  return (
    <MainContainer screenType={2} MainBackgroundColor={COLORS.Black} paddingTop={50}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flex: 1,
            height: '120%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ alignSelf: 'center' }}
          />
        </View>
      )}

      {
        !loading && <View
          style={{
            width: '100%',
            backgroundColor: COLORS.lightWhite,
            height: '92%',
            bottom: 0,
            borderTopRightRadius: 50,
            position: 'absolute',
            paddingVertical: 40,
            paddingHorizontal: 30,
            paddingTop: 20,
            shadowColor: COLORS.White,
            elevation: 5,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
          <View style={{ flex: 1 }}>
            <Image
              source={ImagerHanlde.clientLogo}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.title}>Log In Now</Text>
            <Text style={styles.subtitle}>
              please login to continue using our app
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: COLORS.Black,
                fontWeight: '600',
                marginTop: 50,
              }}>
              {'Email Address'}
            </Text>
            <View
              style={{
                ...styles.Input,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 10,
              }}>
              <Image
                source={ImagerHanlde.profile.mail}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: COLORS.Black }}
              />

              <TextInput
                secureTextEntry={false}
                keyboardType="email-address"
                placeholder={'Enter email address'}
                placeholderTextColor={COLORS.DarkGray}
                maxLength={100}
                value={EmailInput}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.Black,
                  flex: 1,
                }}
                onChangeText={value => setEmailInput(value)}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.Black,
                fontWeight: '600',
                marginTop: 10,
              }}>
              {'Password'}
            </Text>
            <View
              style={{
                ...styles.Input,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 10,
                marginTop: 10,
              }}>
              <Image
                source={ImagerHanlde.lock_closed}
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: COLORS.Black }}
              />

              <TextInput
                secureTextEntry={IsVisable ? false : true}
                keyboardType="default"
                placeholder={'Enter Password'}
                placeholderTextColor={COLORS.DarkGray}
                maxLength={100}
                value={PasswordInput}
                onChangeText={value => setPasswordInput(value)}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.Black,
                  flex: 1,
                }}
              />
              <Pressable onPress={() => setIsVisable((res) => !res)} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: "center" }}>
                <Image
                  source={!IsVisable ? ImagerHanlde.eye_off_outline : ImagerHanlde.eye_outline}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, tintColor: COLORS.Black }}
                />
              </Pressable>

            </View>

            <Pressable
              onPress={() =>
                navigation.navigate(ScreenIdentifiers.ForgotPassword)
              }>
              <Text style={styles.forgot}>{'Forgot password?'}</Text>
            </Pressable>

            <Pressable
              onPress={() => handleLogin()}
              style={{
                width: '60%',
                height: 50,
                backgroundColor: COLORS.Blue,
                marginTop: 50,
                marginBottom: 80,
                alignSelf: 'center',
                borderTopLeftRadius: 30,
                borderBottomRightRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{ fontSize: 20, fontWeight: '700', color: COLORS.White }}>
                {'Sign in'}
              </Text>
            </Pressable>
          </View>

          {!isKeyboardVisible && VersionView()}
        </View>
      }


    </MainContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 100,
    alignSelf: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 25,
    color: COLORS.Blue,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.Gray,
    fontWeight: '500',
    marginTop: 6,
  },
  Input: {
    paddingHorizontal: 8,
    marginTop: 5,
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: COLORS.Black,
    color: COLORS.Black,
    backgroundColor: COLORS.lightWhite,
  },
  forgot: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.Black,
    marginTop: 5,
    textAlign: 'right',
    opacity: 0.9,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(LoginScreen);
