/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../../styles/themes';
import { ImagerHanlde } from '../../../utils/ImageProvider';
import { navigate } from '../../../routes/RootNavigation';
import { ScreenIdentifiers } from '../../../routes';
import { ButtonContainer } from '../../../components/ButtonContainer';
import { API } from '../../../API';
import { END_POINT } from '../../../API/UrlProvider';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { showToast } from '../../../components/showToast';
import { dispatchAddUser } from '../../../redux/actionDispatchers/user-dispatchers';
import ImagePicker from 'react-native-image-crop-picker';

const UserDetails = ({ user, authData }) => {
  const navigation = useNavigation();
  const [ImageLoading, setImageLoading] = useState(false);
  const [NameInput, setNameInput] = useState(user?.name || '');
  const [BioInput, setBioInput] = useState(
    user?.bio ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacinia turpis tortor, consequat efficitur mi congue a. Curabitur cursus.',
  );
  const [loading, setLoading] = useState(false);
  const [IsVisable, setIsVisable] = useState(false);
  const [image, setImage] = useState(user?.image || null);

  useEffect(() => {
    if (NameInput !== user?.name || BioInput !== user?.bio) {
      setIsVisable(true);
    } else {
      setIsVisable(false);
    }
  }, [NameInput, BioInput, user]);

  const HandleUpdate = () => {
    if (IsVisable) {
      if (NameInput.length > 3) {
        setLoading(true);
        const body = JSON.stringify({
          name: NameInput,
          bio: BioInput || '',
        });
        API.putAuthAPI(
          body,
          END_POINT.afterAuth.profile,
          authData.sessionId,
          navigation,
          res => {
            setLoading(false);
            if (res.status) {
              const AddData = {
                ...user,
                name: NameInput || null,
                bio: BioInput || null,
              };
              dispatchAddUser(AddData);
              showToast('Your Profile has been update', 'successfully', 'OK');
            } else {
              showToast('something went wrong');
            }
          },
        );
      }
    }
  };

  const handleImageVieew = () => {
    if (image) {
      navigate(ScreenIdentifiers?.ImageViewScreen, {
        images: image,
      });
    }
  };

  const ImageView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          alignItems: 'center',
          gap: 10,
        }}>
        <View
          style={{
            width: 110,
            height: 110,
            marginTop: 30,
            marginBottom: 0,
            alignSelf: 'center',
          }}>
          <Pressable onPress={() => handleImageVieew()}>
            <Image
              source={image ? { uri: image } : ImagerHanlde.noImage}
              resizeMode="cover"
              style={styles.profileImage}
              onLoadStart={() => {
                setImageLoading(user?.image ? true : false);
              }}
              onLoadEnd={() => setImageLoading(false)}
            />
          </Pressable>

          {ImageLoading && (
            <ActivityIndicator
              size="large"
              style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                left: 45,
                top: 40,
              }}
              color="'#197BBD"
            />
          )}

          <Pressable
            onPress={() => toggleSelect()}
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.Blue,
              borderWidth: 3,
              borderRadius: 40,
              borderColor: COLORS.White,
              marginTop: -40,
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={ImagerHanlde.EditIcon}
              resizeMode="contain"
              style={{ width: 13, height: 13 }}
            />
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.Blue }}>
            {user?.loginType}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 5,
            }}>
            <Image
              source={ImagerHanlde.profile.mail} // Apne image ka path yahaan den
              style={{ width: 15, height: 15 }}
            />
            <Text
              style={{ fontSize: 13, fontWeight: '600', color: COLORS.Black }}>
              {user?.email}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 5,
            }}>
            <Image
              source={ImagerHanlde.MenuNav.call} // Apne image ka path yahaan den
              style={{ width: 15, height: 15 }}
            />
            <Text
              style={{ fontSize: 13, fontWeight: '400', color: COLORS.Black }}>
              {user?.mobile}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const PrsnlInfoView = () => {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.Black,
            marginHorizontal: 20,
            marginTop: 10,
          }}>
          {'Personal Information'}
        </Text>
        <View
          style={{
            width: '90%',
            backgroundColor: COLORS.White,
            borderWidth: 0,
            borderRadius: 10,
            padding: 20,
            alignSelf: 'center',
            marginTop: 10,
            shadowColor: 'black',
            elevation: 5,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
          <Text style={{ fontSize: 15, color: COLORS.Black, fontWeight: '600' }}>
            {'Name'}
          </Text>

          <View style={styles.inputContainer}>
            <Image
              source={ImagerHanlde.profile.person} // Apne image ka path yahaan den
              style={styles.iconStyle}
            />
            <TextInput
              secureTextEntry={false}
              keyboardType="default"
              placeholder={'Enter name'}
              placeholderTextColor={COLORS.DarkGray}
              maxLength={100}
              value={NameInput}
              style={styles.inputStyle}
              onChangeText={value => setNameInput(value)}
            />
          </View>

          <Text
            style={{
              fontSize: 15,
              color: COLORS.Black,
              fontWeight: '600',
              marginTop: 10,
            }}>
            {'Bio'}
          </Text>
          <View
            style={{
              ...styles.inputContainer,
              alignItems: 'flex-start',
              height: 200,
              padding: 10,
            }}>
            <Image
              source={ImagerHanlde.profile.edit} // Apne image ka path yahaan den
              style={styles.iconStyle}
            />

            <TextInput
              maxLength={250}
              secureTextEntry={false}
              placeholder="Description"
              keyboardType={'default'}
              placeholderTextColor={'#D0D5D5'}
              value={BioInput}
              style={{
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.Black,
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
                textAlignVertical: 'top',
              }}
              onChangeText={value => setBioInput(value)}
              multiline={true}
            />
          </View>
          <ButtonContainer
            TextColor={COLORS.White}
            textValue={'Submit'}
            top={40}
            onClick={() => HandleUpdate()}
            isActive={IsVisable}
          />
        </View>
      </View>
    );
  };

  const toggleSelect = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true, // Enables cropping
      });
      console.log(pickedImage);
      UploadImage(pickedImage);

    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const UploadImage = (pickedImage) => {
    const formData = new FormData();
    // Append fields to FormData
    formData.append('file', {
      uri: pickedImage?.path, // Local file path
      name: pickedImage?.filename || 'file.jpg', // Default file name
      type: pickedImage?.mime || 'image/jpeg', // MIME type of the file
    });
    setLoading(true);

    API.putFileUploadAPI(formData, END_POINT.afterAuth.profileUplode, authData.sessionId, navigation, (res) => {
      setLoading(false);
      if (res?.status) {
        const AddData = {
          ...user,
          image: pickedImage?.path || null,
        };
        setImage(pickedImage?.path);
        dispatchAddUser(AddData);
      }else{
        showToast('something went wrong.');
      }
    })
  }

  return (
    <MainContainer
      HaderName={'Profile Details'}
      screenType={3}
      backgroundColor={COLORS.White}>
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
            style={{ alignSelf: 'center' }}
          />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        {ImageView()}
        {PrsnlInfoView()}
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // This makes the image circular
    borderWidth: 2,
    borderColor: '#000',
    alignSelf: 'center',
  },
  Input: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 5,
    fontWeight: '400',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: COLORS.Black,
    color: COLORS.Black,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: COLORS.Black,
    height: 60,
    paddingHorizontal: 8,
    marginTop: 5,
    backgroundColor: COLORS.White, // Optional: Background color for better visuals
  },
  iconStyle: {
    width: 24, // Icon width
    height: 24, // Icon height
    marginRight: 10,
    marginTop: 10,
  },
  inputStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.Black,
    flex: 1, // To make TextInput take remaining space
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(UserDetails);
