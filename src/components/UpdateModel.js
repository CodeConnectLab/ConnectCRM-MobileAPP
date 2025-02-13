/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput,
  Linking,
  Keyboard,
} from 'react-native';
import {ButtonContainer} from './ButtonContainer';
import {COLORS} from '../styles/themes';
import {ImagerHanlde} from '../utils/ImageProvider';

const UpdateModel = ({isModalVisible, closeModal, data}) => {
  const [touchY, setTouchY] = useState(0);

  const HandleUpdate = () => {
    if (data?.details?.link) {
      Linking.openURL(data?.details?.link);
    }
  };

  const renderContent = () => (
    <View
      style={{
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
      //   onTouchEnd={e => {
      //     if (e.nativeEvent.pageY - touchY > 5) closeModal();
      //       }}
    >
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingBottom: 50,
          backgroundColor: COLORS.White,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <View
          style={{
            width: '40%',
            height: 3,
            backgroundColor: COLORS.LightGray,
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 5,
          }}
        />

        <View style={{alignItems: 'center', marginTop: 40}}>
          <Text
            style={{
              fontSize: 22,
              color: COLORS.Black,
              fontWeight: '800',
            }}>
            {'App Update Required'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.Black,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 10,
              marginHorizontal: 20,
            }}>
            {
              'We have added new features and fix some bugs to make your experience seamless.'
            }
          </Text>
        </View>

        <ButtonContainer
          TextColor={COLORS.White}
          textValue={'Update Now'}
          top={50}
          bottom={0}
          width={'70%'}
          onClick={() => HandleUpdate()}
        />
      </View>
    </View>
  );

  return (
    <View style={{}}>
      <Modal
        isVisible={isModalVisible}
        // onBackdropPress={closeModal}
        // onBackButtonPress={closeModal}
        animationInTiming={700}
        animationOutTiming={700}
        // swipeDirection={['down']}
        style={{margin: 0}}>
        {renderContent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default UpdateModel;
