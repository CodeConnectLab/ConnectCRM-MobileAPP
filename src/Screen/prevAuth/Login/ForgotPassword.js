/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {ButtonContainer} from '../../../components/ButtonContainer';
import {validateEmail} from '../../../utils';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {useNavigation} from '@react-navigation/native';
import {useBackHandler} from '@react-native-community/hooks';
import {showToast} from '../../../components/showToast';
import {ScreenIdentifiers} from '../../../routes';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';

const ForgotPassword = ({user, authData}) => {
  const navigation = useNavigation();
  const [EmailInput, setEmailInput] = useState('');
  const [OTPInput, setOTPInput] = useState('');
  const [ScreenType, setScreenType] = useState(false);

  const [seconds, setSeconds] = useState(30); // initial timer duration
  const [isActive, setIsActive] = useState(false); // track if timer is active
  const [loading, setLoading] = useState(false);

  const emailTitle = 'Enter the email address  associated with your account.';
  const emailSubTitle = 'We will email you a link to reset your password.';
  const OTPTitle =
    'Enter the verification code we just sent you on your email address.';

  useEffect(() => {
    let timer;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false); // stop timer when it reaches 0
    }
    return () => clearInterval(timer); // cleanup interval on unmount or reset
  }, [isActive, seconds]);

  const onhardwareBack = () => {
    if (ScreenType) {
      stopTimer();
      setScreenType(false);
    } else {
      navigation.goBack();
    }

    return true;
  };

  useBackHandler(onhardwareBack);

  const HandleButton = () => {
    if (ScreenType) {
      if (OTPInput.length >= 4) {
        OTPVerify();
      } else {
        showToast('Please enter a valid OTP.');
      }
    } else {
      if (validateEmail(EmailInput)) {
        sendtOtpHanlde();
      } else {
        showToast('Please enter a valid email address.');
        stopTimer();
        setScreenType(false);
      }
    }
  };

  const OTPVerify = () => {
    setLoading(true);
    const body = {
      email: EmailInput,
      otp: OTPInput,
    };

    API.postAuthAPI(body, END_POINT.preAuth.verifyOTP, null, null, res => {
      console.log(res);
      setLoading(false);
      if (res.status) {
        stopTimer();
        setOTPInput('');
        navigation.navigate(ScreenIdentifiers.ChangePassowrd, {
          email: EmailInput,
        });
      } else {
        setOTPInput('');
        showToast('something went wrong');
      }
    });
  };

  const HandleEmailInput = res => {
    setEmailInput(res);
    setScreenType(false);
    stopTimer();
  };

  const sendtOtpHanlde = () => {
    setLoading(true);
    const body = {
      email: EmailInput,
    };

    API.postAuthAPI(body, END_POINT.preAuth.requestOTP, null, null, res => {
      console.log(res);
      setLoading(false);
      if (res.status) {
        setScreenType(true);
        startTimer();
        setOTPInput(res?.data?.otp || '');
      } else {
        showToast('something went wrong');
      }
    });
  };

  const startTimer = () => {
    setSeconds(30); // reset timer to 30 seconds
    setIsActive(true);
  };
  const stopTimer = () => {
    setSeconds(0); // reset timer to 30 seconds
    setIsActive(false);
  };
  const BackHandle = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: COLORS.Black,
            textAlign: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 0,
          }}>
          {!ScreenType ? 'Forgot Password?' : 'Verification'}
        </Text>
        <Pressable onPress={() => onhardwareBack()}>
          <Image
            source={ImagerHanlde.backIcon}
            style={{width: 25, height: 25}}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <MainContainer>
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            width: '100%',
            height: '120%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{alignSelf: 'center'}}
          />
        </View>
      )}
      {BackHandle()}
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          // justifyContent: 'center',
          marginBottom: 30,
        }}>
        <Image
          source={ImagerHanlde.ForgotPassword.forgotIcon}
          style={{width: 200, height: 200, marginTop: 10}}
        />
        {!ScreenType ? (
          <View style={{alignItems: 'center', width: '100%'}}>
            <Text style={styles.title}>{emailTitle}</Text>
            <Text style={styles.subtitle}>{emailSubTitle}</Text>
            <TextInput
              secureTextEntry={false}
              keyboardType="email-address"
              placeholder={'Enter Email Address'}
              placeholderTextColor={COLORS.DarkGray}
              maxLength={100}
              value={EmailInput}
              style={styles.Input}
              onChangeText={value => HandleEmailInput(value)}
            />
          </View>
        ) : (
          <View style={{alignItems: 'center', width: '100%'}}>
            <Text style={styles.title}>{OTPTitle}</Text>
            <TextInput
              secureTextEntry={false}
              keyboardType="number-pad"
              placeholder={'Enter Valid OTP'}
              placeholderTextColor={COLORS.DarkGray}
              maxLength={100}
              value={OTPInput}
              style={styles.Input}
              onChangeText={value => setOTPInput(value)}
            />
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginHorizontal: 40,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  lineHeight: 19.5,
                  color: COLORS.Black,
                }}>
                {isActive ? `Resend OTP in ` : 'if you didn’t receive a code! '}
              </Text>
              <Pressable
                onPress={() => (!isActive ? sendtOtpHanlde() : null)}
                style={{}}>
                <Text
                  style={{
                    color: COLORS.Blue,
                    fontSize: 16,
                    fontWeight: '500',
                    lineHeight: 19.5,
                  }}>
                  {isActive ? `00:${seconds}` : 'Resend'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <ButtonContainer
          TextColor={COLORS.White}
          textValue={!ScreenType ? 'Send OTP' : 'Verify'}
          top={50}
          width={'50%'}
          onClick={() => HandleButton()}
        />
      </Pressable>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: COLORS.Black,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 19,
    color: COLORS.Gray,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
  },
  InputTitle: {
    fontSize: 20,
    color: COLORS.Blue,
    fontWeight: '700',
    marginTop: 40,
  },
  Input: {
    width: '80%',
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 15,
    fontWeight: '400',
    height: 60,
    // borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRadius: 10.67,
    borderColor: COLORS.Black,
    color: COLORS.Black,
    textAlign: 'center',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(ForgotPassword);
