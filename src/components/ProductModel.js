/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
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
import {COLORS} from '../styles/themes';
import {ButtonContainer} from './ButtonContainer';
import {ImagerHanlde} from '../utils/ImageProvider';
import {showToast} from './showToast';

const stateList = {
  _id: '',
  name: '',
  order: '',
  price: '',
  setupFee: '',
};

const ProductModel = ({isModalVisible, closeModal, data, onUpdate}) => {
  const [touchY, setTouchY] = useState(0);
  const [formState, setFormState] = useState(stateList);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  useEffect(() => {
    if (data) {
      setFormState(data);
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormState(prev => ({...prev, [field]: value}));
  };

  const handleCloseModel = () => {
    setFormState(stateList);
    closeModal();
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
      onTouchEnd={e => {
        if (e.nativeEvent.pageY - touchY > 5) handleCloseModel();
      }}>
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: COLORS.White,
          borderTopRightRadius: isKeyboardVisible ? 0 : 20,
          borderTopLeftRadius: isKeyboardVisible ? 0 : 20,
          flex: isKeyboardVisible ? 1 : 0,
          paddingTop: isKeyboardVisible ? 60 : 0,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 50,
          }}>
          {'Service Name'}
        </Text>

        <TextInput
          secureTextEntry={false}
          keyboardType="default"
          placeholder={'Service Name *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={formState?.name}
          style={{...styles.Input}}
          onChangeText={value => handleInputChange('name', value)}
        />

        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'Setup fee'}
        </Text>

        <TextInput
          secureTextEntry={false}
          keyboardType="number-pad"
          placeholder={'Service Setup fee *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={formState?.setupFee + ''}
          style={{...styles.Input}}
          onChangeText={value => handleInputChange('setupFee', value)}
        />

        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'Price'}
        </Text>

        <TextInput
          secureTextEntry={false}
          keyboardType="default"
          placeholder={'Service price *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={formState?.price + ''}
          style={{...styles.Input}}
          onChangeText={value => handleInputChange('price', value)}
        />

        <ButtonContainer
          TextColor={COLORS?.White}
          textValue={'Submit'}
          top={50}
          bottom={20}
          onClick={() => onUpdate(formState)}
        />
      </Pressable>
    </View>
  );

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModel}
      onBackButtonPress={handleCloseModel}
      animationInTiming={700}
      animationOutTiming={700}
      swipeDirection={['down']}
      style={{margin: 0}}>
      {renderContent()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  cover: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  centerText: {
    marginTop: 20,
    fontSize: 96,
    fontWeight: '300',
    lineHeight: 117.02,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.Black,
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
    justifyContent: 'center',
    color: COLORS.Black,
  },
});

export default ProductModel;
