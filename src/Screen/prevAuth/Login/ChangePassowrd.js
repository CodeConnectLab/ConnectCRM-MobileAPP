/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {ButtonContainer} from '../../../components/ButtonContainer';
import {useBackHandler} from '@react-native-community/hooks';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {ScreenIdentifiers} from '../../../routes';
import {showToast} from '../../../components/showToast';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';

const ChangePassowrd = ({user, authData, route}) => {
  const navigation = useNavigation();
  const [PasswordInput, setPasswordInput] = useState('');
  const [ConfirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onhardwareBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: ScreenIdentifiers.LoginScreen}],
      }),
    );
    return true;
  };

  useBackHandler(onhardwareBack);

  const handlePassword = () => {
    if (PasswordInput === '' || ConfirmInput === '') {
      showToast('Please enter valid passowrd.');
    } else {
      if (PasswordInput === ConfirmInput) {
        ChangePassword();
      } else {
        showToast('Please enter valid passowrd.');
      }
    }
  };

  const ChangePassword = () => {
    setLoading(true);
    const body = {
      email: route?.params?.email || '',
      newPassword: PasswordInput,
      confirmPassword: ConfirmInput,
    };

    API.postAuthAPI(body, END_POINT.preAuth.resetPassword, null, null, res => {
      console.log(res);
      setLoading(false);
      if (res.status) {
        setPasswordInput('');
        setConfirmInput('');
        onhardwareBack();
        // showToast('');
      } else {
        showToast('something went wrong');
      }
    });
  };

  return (
    <MainContainer
      HaderName={'Change Password'}
      screenType={3}
      backgroundColor={COLORS.White}
      BackHandleName={ScreenIdentifiers.LoginScreen}>
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
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.White,
          paddingHorizontal: 20,
          paddingTop: 50,
        }}>
        <Text style={{fontSize: 16, fontWeight: '600', color: COLORS.Black}}>
          {'New Password'}
        </Text>
        <TextInput
          secureTextEntry={true}
          keyboardType="default"
          placeholder={'Enter New Password'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={PasswordInput}
          style={{...styles.Input, marginTop: 10}}
          onChangeText={value => setPasswordInput(value)}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.Black,
            marginTop: 20,
          }}>
          {'Confirm Password'}
        </Text>
        <TextInput
          secureTextEntry={true}
          keyboardType="default"
          placeholder={'Enter Confirm Password'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={ConfirmInput}
          style={{...styles.Input, marginTop: 10}}
          onChangeText={value => setConfirmInput(value)}
        />
        <ButtonContainer
          TextColor={COLORS.White}
          textValue={'Submit'}
          top={40}
          onClick={() => handlePassword()}
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  Input: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 50,
    fontWeight: '400',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: COLORS.Black,
    color: COLORS.Black,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(ChangePassowrd);
