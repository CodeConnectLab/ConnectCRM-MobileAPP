/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../../components/MainContainer';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import {COLORS} from '../../../../styles/themes';
import {API} from '../../../../API';
import {END_POINT} from '../../../../API/UrlProvider';
import {ImagerHanlde} from '../../../../utils/ImageProvider';
import {openDialer} from '../../../../utils';

const DepartmentDetails = ({user, authData, route}) => {
  const ParamsDate = route?.params?.item;

  const HandleSave = type => {};

  return (
    <MainContainer
      HaderName={'Details'}
      screenType={3}
      backgroundColor={COLORS?.White}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 20,
          backgroundColor: COLORS.lightWhite,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={{...styles.viewBox, flexDirection: 'row', gap: 10}}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              backgroundColor: COLORS.lightBlue,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: COLORS.Black, fontWeight: '500'}}>
              {ParamsDate?.name ? ParamsDate?.name?.slice(0, 1) : 'D'}
            </Text>
          </View>
          <View style={{justifyContent: 'center', flex: 1, gap: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Text
                style={{fontSize: 16, color: COLORS.Black, fontWeight: '500'}}>
                {ParamsDate?.name || '-- --'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: ParamsDate?.isActive ? COLORS.Green : COLORS.Red,
                  opacity: 0.7,
                  fontWeight: '700',
                }}>
                {ParamsDate?.isActive ? '( Active )' : ' ( Deactive )'}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              {`CID : ${ParamsDate?.companyId || '-- --'}`}
            </Text>
          </View>
          <Pressable
            onPress={() => openDialer(ParamsDate?.phone || '')}
            style={{
              width: 30,
              height: 30,
              backgroundColor: COLORS.Yellow,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={ImagerHanlde.MenuNav.call}
              resizeMode="contain"
              style={{width: 18, height: 18}}
            />
          </Pressable>
        </View>
        <View style={{...styles.viewBox, marginTop: 5}}>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Email Address'}
          </Text>
          <View style={styles.Input}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
                flex: 1,
              }}>
              {ParamsDate?.email || '--- ---'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: ParamsDate?.isEmailVerified
                  ? COLORS.Green
                  : COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
              }}>
              {ParamsDate?.isEmailVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Contact No'}
          </Text>
          <View style={styles.Input}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
                flex: 1,
              }}>
              {ParamsDate?.phone || '--- ---'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: ParamsDate?.isMobileVerified
                  ? COLORS.Green
                  : COLORS.Black,
                opacity: 0.7,
                fontWeight: '600',
              }}>
              {ParamsDate?.isMobileVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Assign Team Leader'}
          </Text>
          <View style={styles.Input}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
              }}>
              {'--- ---'}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* <View
        style={{
          width: '100%',
          flexDirection: 'row',
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: 10,
          backgroundColor: COLORS.lightWhite,
        }}>
        <Pressable
          onPress={() => HandleSave(1)}
          style={{
            flex: 0.5,
            height: 50,
            backgroundColor: COLORS.Red,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.White,
            }}>
            {'Delete'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => HandleSave(2)}
          style={{
            flex: 1,
            height: 50,
            backgroundColor: COLORS.Green,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 18, fontWeight: '600', color: COLORS.White}}>
            {'Update Details'}
          </Text>
        </Pressable>
      </View> */}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: COLORS.White,
    borderRadius: 10,
    marginTop: 15,
    padding: 15,
    elevation: 5, // Android box shadow
    shadowColor: 'black', // iOS box shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  Input: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 5,
    fontWeight: '400',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: '#F2F2F2',
    backgroundColor: COLORS.lightWhite,
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(DepartmentDetails);
