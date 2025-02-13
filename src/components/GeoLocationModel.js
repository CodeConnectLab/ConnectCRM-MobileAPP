/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
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
  Platform,
} from 'react-native';
import { COLORS } from '../styles/themes';
import { ButtonContainer } from './ButtonContainer';
import { ImagerHanlde } from '../utils/ImageProvider';
import { showToast } from './showToast';
import { requestLocationPermission } from '../utils/Permissions';
import Geolocation from "react-native-geolocation-service";
import ImagePicker from 'react-native-image-crop-picker';

const stateList = {
  fileName: '',
  imagaName: null,
  imageUrl: null,
  location: null,
  imageType: null
};

const GeoLocationModel = ({ isModalVisible, closeModal, data, onUpdate }) => {
  const [touchY, setTouchY] = useState(0);
  const [formState, setFormState] = useState(stateList);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [image, setImage] = useState(null);

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


  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      console.log("Permission Denied");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleInputChange("location", { latitude, longitude })
      },
      (error) => {
        console.log("Error getting location: ", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const uploadFile = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true, // Enables cropping
      });
      console.log(pickedImage);
      setFormState(prev => ({ ...prev, ["imageUrl"]: pickedImage?.path, ["imageType"]: pickedImage?.mime, ["imagaName"]: pickedImage?.filename || "" }));
      await getLocation()
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };


  const handleInputChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseModel = () => {
    setFormState(stateList);
    closeModal();
  };

  const openMap = (res) => {
    const location = res ? `${res?.latitude},${res?.longitude}` : null;

    if (location) {
      let url = "";

      if (Platform.OS === "android") {
        // Use geo URI for Android
        url = `geo:${location}?q=${location}`;
      } else if (Platform.OS === "ios") {
        // Use Apple Maps URL for iOS
        url = `http://maps.apple.com/?q=${location}`;
      }

      // Attempt to open the map URL
      Linking.openURL(url)
        .then(() => {
          console.log("Map opened successfully.");
        })
        .catch((err) => {
          showToast("Unable to open map.");
          console.error("Error opening map:", err);
        });
    } else {
      // If no location is provided, call getLocation (or handle accordingly)
      getLocation();
    }
  };

  const onClickHandle = () => {
    if (formState?.fileName === "") {
      showToast("Enter File Name")
    } else if (!formState?.imageUrl) {
      showToast("Please Select attach file")
    } else if (!formState?.location) {
      showToast("Please select Location");
    } else {
      onUpdate(formState);
    }
  }


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
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: COLORS.White,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          flex: isKeyboardVisible ? 1 : 0,
          paddingTop: isKeyboardVisible ? 60 : 0,
        }}>
        <Pressable
          onPress={() => handleCloseModel()}
          style={{
            width: '30%',
            height: 3,
            backgroundColor: COLORS.Black,
            marginTop: 8,
            marginBottom: 20,
            alignSelf: 'center',
          }}
        />
        <Text style={{ fontSize: 14, color: COLORS.Black, fontWeight: '600' }}>
          {'Attach file'}
        </Text>

        <View
          style={{
            ...styles.Input,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              opacity: 0.7,
              flex: 1,
            }}>
            {formState.imagaName ? formState?.imagaName : 'No file chosen'}
          </Text>
          <Pressable
            onPress={() => uploadFile()}
            style={{
              width: 30,
              height: 30,
              backgroundColor: COLORS.Blue,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={ImagerHanlde.fileUpload}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.White,
              }}
            />
          </Pressable>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'File Name'}
        </Text>

        <TextInput
          secureTextEntry={false}
          keyboardType="default"
          placeholder={'File Name *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={100}
          value={formState.fileName}
          style={{ ...styles.Input }}
          onChangeText={value => handleInputChange('fileName', value)}
        />

        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'Location'}
        </Text>
        <View
          style={{
            ...styles.Input,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              opacity: 0.7,
              flex: 1,
            }}>
            {formState?.location ? ` ${formState?.location?.latitude}, ${formState?.location?.longitude}` : 'No Location'}
          </Text>
          <Pressable
            onPress={() => openMap(formState?.location || null)}
            style={{
              width: 30,
              height: 30,
              backgroundColor: formState.location
                ? COLORS.Green
                : COLORS.lightBlue,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={formState.location ? ImagerHanlde.location : ImagerHanlde?.currentLocation}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
                tintColor: formState.location ? COLORS.White : COLORS.Black,
              }}
            />
          </Pressable>
        </View>
        <ButtonContainer
          TextColor={COLORS.White}
          textValue={'Submit'}
          top={30}
          bottom={20}
          onClick={() => onClickHandle()}
        />
      </View>
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
      style={{ margin: 0 }}>
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
  },
});

export default GeoLocationModel;
