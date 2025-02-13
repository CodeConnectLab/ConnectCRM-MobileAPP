/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Image,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {focusList, GeoList} from '../../../utils/staticData';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {Dropdown} from 'react-native-element-dropdown';
import {
  formatCreatedAt,
  openDialer,
  openEmail,
  openWhatsApp,
} from '../../../utils';
import {showToast} from '../../../components/showToast';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import {ScreenIdentifiers} from '../../../routes';
import GeoLocationModel from '../../../components/GeoLocationModel';
import {navigate} from '../../../routes/RootNavigation';

const LeadsDetailsScreen = ({user, authData, route}) => {
  //console.log(route?.params?.screenName);
  const navigation = useNavigation();
  const [ApiData, seApiData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ScreenType, setScreenType] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getApiDate();
  }, [route?.params?.leadId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getApiDate();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getApiDate();
    }, []),
  );

  const getApiDate = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.getAllLead + `/${route?.params?.leadId}`,
      authData.sessionId,
      navigation,
      res => {
        setRefreshing(false);
        setisLoading(false);
        if (res.status) {
          seApiData(res?.data?.data?.leadDetails);
        }
      },
    );
  };

  const infoView = () => {
    return (
      <View style={styles.viewBox}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            gap: 10,
          }}>
          <Image source={ImagerHanlde.profile.person} style={styles.image} />
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text
              style={{fontSize: 14, color: COLORS.Black, fontWeight: '500'}}>
              {ApiData?.lead?.firstName && ApiData?.lead?.firstName?.length > 2
                ? ApiData?.lead?.firstName
                : 'Unknown'}
            </Text>
            <Text
              style={{fontSize: 14, color: COLORS.Black, fontWeight: '500'}}>
              {ApiData?.lead?.contactNumber || ''}
            </Text>
          </View>
          {ApiData?.lead?.email && ApiData?.lead?.email !== '' && (
            <Pressable
              onPress={() => openEmail(ApiData?.lead?.email || '')}
              style={{
                width: 30,
                height: 30,
                backgroundColor: COLORS.lightBlue,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImagerHanlde.MailIcon}
                resizeMode="contain"
                style={{width: 18, height: 18}}
              />
            </Pressable>
          )}

          <Pressable
            onPress={() =>
              openWhatsApp(
                ApiData?.lead?.contactNumber || '',
                ApiData?.lead?.firstName || '',
              )
            }
            style={{
              width: 30,
              height: 30,
              backgroundColor: COLORS.Green,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={ImagerHanlde.whatsappIcon}
              resizeMode="contain"
              style={{width: 18, height: 18}}
            />
          </Pressable>
          <Pressable
            onPress={() => openDialer(ApiData?.lead?.contactNumber || '')}
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
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: COLORS.Black,
            opacity: 0.4,
            marginVertical: 10,
          }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={ImagerHanlde.chatbox} style={styles.image} />
          <Text
            style={{
              fontSize: 15,
              color: COLORS.Black,
              fontWeight: '400',
              flex: 1,
              opacity: ApiData?.lead?.description ? 1 : 0.5,
            }}>
            {ApiData?.lead?.description || 'No description available'}
          </Text>
        </View>
      </View>
    );
  };

  const onHandleEdit = () => {
    navigation.navigate(ScreenIdentifiers.AddLeadScreen, {
      data: ApiData?.lead || null,
      screenType: 'Update Details',
    });
  };

  const AllInfoView = () => {
    return (
      <View>
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
              }}>
              {ApiData?.lead?.email || '--- ---'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Agent'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Status'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.assignedAgent?.name || '--- ---'}
              </Text>
            </View>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.leadStatus?.name || '--- ---'}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Services'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Lead Source'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.productService?.name || '--- ---'}
              </Text>
            </View>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.leadSource?.name || '--- ---'}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginTop: 8,
            }}>
            {'Followup Date'}
          </Text>
          <View style={styles.Input}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
              }}>
              {formatCreatedAt(ApiData?.lead?.followUpDate) || '--- ---'}
            </Text>
          </View>
        </View>

        <View style={{...styles.viewBox, marginTop: 5}}>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Full Address'}
          </Text>
          <View
            style={{
              ...styles.Input,
              height: 70,
              justifyContent: 'flex-start',
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                opacity: 0.7,
              }}>
              {ApiData?.lead?.fullAddress || '--- ---'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Country'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'State'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.country || '--- ---'}
              </Text>
            </View>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.state || '--- ---'}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Pin Code'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
              }}>
              {'Lead Cost'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.pinCode || '--- ---'}
              </Text>
            </View>
            <View style={{...styles.Input, flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiData?.lead?.leadCost || '0'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const HistoryView = () => {
    return (
      <View>
        {ApiData?.history.map((item, index) => {
          return (
            <View
              key={item._id.toString()}
              style={{...styles.viewBox, marginTop: 5}}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: COLORS.lightBlue,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.Green,
                      fontWeight: '700',
                    }}>
                    {'FH'}
                  </Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'Commented By: '}
                    {item?.COMMENTED_BY || ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'Date: '}
                    {formatCreatedAt(item?.DATE) || ''}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1.5,
                  backgroundColor: COLORS.LightGray,
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: COLORS.Green,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.White,
                      fontWeight: '700',
                    }}>
                    {'S'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.Black,
                    fontWeight: '600',
                  }}>
                  {item?.STATUS || ''}
                </Text>
                <View
                  style={{
                    width: 22,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: COLORS.Green,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: COLORS.White,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    {'FD'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.Black,
                    fontWeight: '600',
                  }}>
                  {formatCreatedAt(item?.FOLLOWUP_DATE) || ''}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <View
                  style={{
                    width: 22,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: COLORS.Blue,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: COLORS.White,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    {'C'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.Black,
                    fontWeight: '600',
                  }}>
                  {item?.COMMENT || ''}
                </Text>
              </View>
            </View>
          );
        })}
        {!ApiData?.history ||
          (ApiData?.history?.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Data found</Text>
            </View>
          ))}
      </View>
    );
  };

  const openMap = item => {
    // Get coordinates from item
    const location = item?.coordinates || null; // Should be in "latitude,longitude" format

    if (!location) {
      console.error('Coordinates are not available.');
      showToast('Coordinates are missing.');
      return;
    }

    let url = '';
    if (Platform.OS === 'android') {
      // Use geo URI for Android
      url = `geo:${location}?q=${location}`;
    } else if (Platform.OS === 'ios') {
      // Use Apple Maps URL for iOS
      url = `http://maps.apple.com/?q=${location}`;
    }

    // Open the URL using Linking
    Linking.openURL(url)
      .then(() => {
        console.log('Map opened successfully.');
      })
      .catch(err => {
        showToast('Unable to open map.');
        console.error('Error opening map:', err);
      });
  };

  const handleGeoDelete = item => {};

  const GeoLocationView = () => {
    return (
      <View>
        {ApiData?.geoLocation && ApiData?.geoLocation?.length > 0 ? (
          ApiData?.geoLocation?.map((item, index) => {
            return (
              <View
                key={item?._id.toString()}
                style={{
                  ...styles.viewBox,
                  marginTop: 5,
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: COLORS.lightBlue,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {item?.s3Url ? (
                    <Pressable
                      onPress={() =>
                        navigate(ScreenIdentifiers?.ImageViewScreen, {
                          images: item?.s3Url,
                        })
                      }>
                      <Image
                        source={{uri: item?.s3Url}}
                        resizeMode="cover"
                        style={{width: 30, height: 30, borderRadius: 8}}
                      />
                    </Pressable>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.Green,
                        fontWeight: '700',
                      }}>
                      {'GL'}
                    </Text>
                  )}
                </View>
                <View style={{justifyContent: 'center', flex: 1}}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'File Name : '}
                    {item?.fileName || ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'Date: '}
                    {formatCreatedAt(item?.createdAt) || ''}
                  </Text>
                </View>

                <Pressable
                  onPress={() => openMap(item)}
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: COLORS.Green,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={ImagerHanlde.location}
                    resizeMode="contain"
                    style={{width: 18, height: 18, tintColor: COLORS.White}}
                  />
                </Pressable>

                {/* <Pressable
                  onPress={() => handleGeoDelete(item)}
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: COLORS.Red,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={ImagerHanlde.deleteIcon}
                    resizeMode="contain"
                    style={{ width: 18, height: 18, tintColor: COLORS.White }}
                  />
                </Pressable> */}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Data found</Text>
          </View>
        )}
      </View>
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onUpdateHandle = res => {
    closeModal();
    setisLoading(true);
    // Create FormData object
    const formData = new FormData();
    const coordinates = `${res?.location?.latitude},${res?.location?.longitude}`;

    // Append fields to FormData
    formData.append('file', {
      uri: res?.imageUrl, // Local file path
      name: res?.imagaName || 'file.jpg', // Default file name
      type: res?.imageType || 'image/jpeg', // MIME type of the file
    });
    formData.append('fileName', res?.fileName || 'Location image');
    formData.append('leadId', route?.params?.leadId || '');
    formData.append('coordinates', coordinates || '');

    API.postFileUploadAPI(
      formData,
      END_POINT.afterAuth.geolocation,
      authData.sessionId,
      navigation,
      res => {
        setisLoading(false);
        // console.log(res);
        if (res?.status) {
          onRefresh();
        } else {
          setIsModalVisible(true);
        }
      },
    );
  };

  return (
    <MainContainer
      HaderName={'Details'}
      screenType={3}
      backgroundColor={COLORS.White}
      buttonStatus={true}
      onHandleButton={() => onHandleEdit()}>
      {isLoading ? (
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
      ) : (
        <View
          style={{flex: 1, width: '100%', backgroundColor: COLORS.lightWhite}}>
          {ApiData ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{paddingBottom: 100}}
              style={{
                flex: 1,
                width: '100%',
                paddingHorizontal: 10,
                backgroundColor: COLORS.lightWhite,
              }}>
              {infoView()}
              <View
                style={{
                  marginTop: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.lightWhite,
                  gap: 8,
                }}>
                <Pressable
                  onPress={() => setScreenType(2)}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor:
                      ScreenType === 2 ? COLORS.Blue : COLORS.White,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5, // Android box shadow
                    shadowColor: 'black', // iOS box shadow
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: ScreenType === 2 ? COLORS.White : COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'History'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setScreenType(1)}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor:
                      ScreenType === 1 ? COLORS.Blue : COLORS.White,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5, // Android box shadow
                    shadowColor: 'black', // iOS box shadow
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: ScreenType === 1 ? COLORS.White : COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'All Information'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setScreenType(3)}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor:
                      ScreenType === 3 ? COLORS.Blue : COLORS.White,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5, // Android box shadow
                    shadowColor: 'black', // iOS box shadow
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: ScreenType === 3 ? COLORS.White : COLORS.Black,
                      fontWeight: '600',
                    }}>
                    {'Geo Location'}
                  </Text>
                </Pressable>
              </View>
              {ScreenType === 1 && AllInfoView()}
              {ScreenType === 2 && HistoryView()}
              {ScreenType === 3 && GeoLocationView()}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Data found</Text>
            </View>
          )}

          {ScreenType === 3 && (
            <Pressable
              onPress={() => setIsModalVisible(true)}
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                bottom: 20,
                right: 15,
                backgroundColor: COLORS.Blue,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5, // Android box shadow
                shadowColor: 'black', // iOS box shadow
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
              }}>
              <Image
                source={ImagerHanlde.plusIcon}
                style={{width: 25, height: 25, tintColor: COLORS.White}}
              />
            </Pressable>
          )}
        </View>
      )}
      <GeoLocationModel
        isModalVisible={isModalVisible}
        closeModal={() => closeModal()}
        data={ApiData}
        onUpdate={onUpdateHandle}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  image: {
    width: 25,
    height: 25,
    tintColor: COLORS.Blue,
  },
  viewBox: {
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Black,
  },
  Input: {
    // fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 5,
    // fontWeight: '400',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: '#F2F2F2',
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
  },
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    lineHeight: 19.5,
    fontWeight: '600',
    marginLeft: 20,
    color: COLORS.Black,
    opacity: 0.5,
  },
  selectedTextStyle: {
    fontSize: 16,
    lineHeight: 19.5,
    fontWeight: '600',
    marginLeft: 20,
    color: COLORS.Black,
  },
  iconStyle: {
    width: 12,
    height: 16,
    marginRight: 20,
    opacity: 0.7,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: COLORS.Black,
  },
  itemContainer: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.Black, // Change this to your desired color
    fontWeight: '600',
    lineHeight: 19.5,
  },
  boxDrop: {flexDirection: 'row', gap: 10, marginTop: 10},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(LeadsDetailsScreen);
