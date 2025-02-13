/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React, {useRef, useEffect, useState, useCallback} from 'react';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {Dropdown} from 'react-native-element-dropdown';
import {focusList, formList, staticData} from '../../../utils/staticData';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {ScreenIdentifiers} from '../../../routes';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';
import DatePicker from 'react-native-date-picker';
import {formatCreatedAt, validateEmail} from '../../../utils';
import {showToast} from '../../../components/showToast';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddLeadScreen = ({user, authData, route}) => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [ApiData, setApiData] = useState(null);
  const [StateData, setStateData] = useState([]);
  const data = route.params?.data;

  const dataList = {
    fullName: data?.firstName || '',
    email: data?.email || '',
    phoneNo: data?.contactNumber || '',
    datetime: data?.followUpDate || null,
    fullAddress: data?.fullAddress || '',
    pinCode: data?.pinCode || '',
    leadCost: data?.leadCost || '0',
    comment: data?.comment || '',
    description: data?.description || '',
    formattedValue: data?.contactNumber || '+91',
    leadWonAmount: data?.leadWonAmount || null,
    leadLostReason: {Id: data?.leadLostReasonId || null, Name: null},
    agent: {
      Id: data?.assignedAgent?._id || null,
      Name: data?.assignedAgent?.name || null,
    },
    status: {
      Id: data?.leadStatus?._id || null,
      Name: data?.leadStatus?.name || null,
      lossStatus:
        data?.leadStatus?.name === 'Lost' ? true : data?.lossStatus || false,
      wonStatus:
        data?.leadStatus?.name === 'Won' ? true : data?.wonStatus || false,
    },
    service: {
      Id: data?.productService?._id || null,
      Name: data?.productService?.name || null,
    },
    source: {
      Id: data?.leadSource?._id || null,
      Name: data?.leadSource?.name || null,
    },
    country: {
      Id: null,
      Name: data?.country || null,
    },
    state: {
      Id: null,
      Name: data?.state || null,
    },
  };
  const [formState, setFormState] = useState(data ? dataList : formList);

  const [focusStates, setFocusStates] = useState(focusList);
  const [CountryStates, setCountryStates] = useState({});
  const phoneInputRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getLeadTypeData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getLeadTypeData();
  }, []);

  useEffect(() => {
    if (CountryStates?.Id) {
      getStateData();
    }
  }, [CountryStates]);

  const getStateData = () => {
    setisLoading(true);
    API.getAuthAPI(
      END_POINT.afterAuth.stateList + CountryStates?.Id,
      authData.sessionId,
      null,
      res => {
        setisLoading(false);
        if (res.status) {
          setStateData(res?.data?.data || []);
        }
      },
    );
  };

  const getLeadTypeData = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.lead_types,
      authData.sessionId,
      navigation,
      res => {
        setRefreshing(false);
        setisLoading(false);
        if (res?.status) {
          setApiData(res?.data?.data || null);
        } else {
          showToast('Something went wrong');
        }
      },
    );
  };

  const handleInputChange = (field, value) => {
    if (field === 'country') {
      setCountryStates(value);
    }
    setFormState(prev => ({...prev, [field]: value}));
  };

  const renderDropdown = (data, placeholder, value, field) => (
    <Dropdown
      style={[styles.dropdown, focusStates[field] && {borderColor: 'gray'}]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data || []}
      maxHeight={300}
      labelField={field === 'leadLostReason' ? 'reason' : 'name'}
      valueField={field === 'country' ? 'isoCode' : '_id'}
      placeholder={placeholder}
      value={value}
      onFocus={() => setFocusStates(prev => ({...prev, [field]: true}))}
      onBlur={() => setFocusStates(prev => ({...prev, [field]: false}))}
      onChange={item =>
        handleInputChange(field, {
          Id: item?._id
            ? item?._id
            : item?.isoCode
            ? item?.isoCode
            : item?.code,
          Name: item?.name || item?.reason || '',
          ...(field === 'status' && {
            lossStatus: item?.lossStatus || false,
            wonStatus: item?.wonStatus || false,
          }),
        })
      }
      renderRightIcon={() => (
        <Image
          source={ImagerHanlde.caret_down}
          resizeMode="contain"
          style={styles.iconStyle}
        />
      )}
      renderItem={item => {
        return item ? (
          <View style={styles.itemContainer}>
            <Text
              style={{
                ...styles.itemText,
                color:
                  value ===
                  (item?._id
                    ? item?._id
                    : item?.isoCode
                    ? item?.isoCode
                    : item?.code)
                    ? COLORS.Blue
                    : COLORS.Black,
              }}>
              {item?.name || item?.reason || ''}
            </Text>
          </View>
        ) : null;
      }}
    />
  );

  const LeadInfoView = () => {
    return (
      <View style={styles.viewBox}>
        <Text style={styles.title}>{'Lead Information'}</Text>
        <View style={styles.boxDrop}>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Full Name *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.fullName}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('fullName', value)}
          />
          <TextInput
            secureTextEntry={false}
            keyboardType="email-address"
            placeholder={'Email Id'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.email}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('email', value)}
          />
        </View>
        <TextInput
          secureTextEntry={false}
          keyboardType="number-pad"
          placeholder={'Phone Number*'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={15}
          value={formState?.phoneNo}
          style={{...styles.Input, flex: 1, marginTop: 10}}
          onChangeText={value => handleInputChange('phoneNo', value)}
        />

        <View style={{...styles.boxDrop, marginTop: 10}}>
          {renderDropdown(
            ApiData?.agents,
            'Agent',
            formState?.agent?.Id,
            'agent',
          )}
          {renderDropdown(
            ApiData?.status,
            'Status',
            formState?.status?.Id,
            'status',
          )}
        </View>

        {formState?.status?.wonStatus && (
          <TextInput
            secureTextEntry={false}
            keyboardType="number-pad"
            placeholder={'Won amount in INR*'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={15}
            value={
              formState?.leadWonAmount ? formState?.leadWonAmount + '' : ''
            }
            style={{...styles.Input, flex: 1, marginTop: 10}}
            onChangeText={value => handleInputChange('leadWonAmount', value)}
          />
        )}
        {formState?.status?.lossStatus && (
          <View style={{...styles.boxDrop, marginTop: 15}}>
            {renderDropdown(
              ApiData?.leadLoseReason,
              'Lost Reason',
              formState?.leadLostReason?.Id || null,
              'leadLostReason',
            )}
          </View>
        )}

        <View style={{...styles.boxDrop, marginTop: 15}}>
          {renderDropdown(
            ApiData?.productsServices,
            'Services',
            formState?.service?.Id,
            'service',
          )}
        </View>
        <View style={{...styles.boxDrop, marginTop: 15}}>
          {renderDropdown(
            ApiData?.sources,
            'Lead Source',
            formState?.source?.Id,
            'source',
          )}
        </View>
      </View>
    );
  };

  const followpView = () => {
    return (
      <View style={styles.viewBox}>
        <Text style={styles.title}>{'Follow Up Date *'}</Text>
        <Pressable
          onPress={() =>
            setFocusStates(prev => ({...prev, ['datetime']: true}))
          }
          style={{
            ...styles.Input,
            marginTop: 10,
            // alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              formState?.datetime
                ? styles.selectedTextStyle
                : styles.placeholderStyle,
              {
                marginLeft: 0,
              },
            ]}>
            {formState?.datetime
              ? formatCreatedAt(formState?.datetime)
              : 'Select Date & Time *'}
          </Text>
        </Pressable>
        <Text style={{...styles.title, marginTop: 10}}>{'Description *'}</Text>
        <TextInput
          secureTextEntry={false}
          keyboardType="default"
          placeholder={'Enter Description *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={1000}
          value={formState?.description || ''}
          onChangeText={value => handleInputChange('description', value)}
          style={{
            ...styles.Input,
            fontSize: 16,
            fontWeight: '400',
            color: COLORS.Black,
            marginTop: 10,
            height: 100,
            paddingTop: 10,
            textAlignVertical: 'top',
          }}
          multiline={true}
        />

        {route.params?.screenType === 'Update Details' && (
          <View>
            <Text style={{...styles.title, marginTop: 10}}>{'Comment *'}</Text>
            <TextInput
              secureTextEntry={false}
              keyboardType="default"
              placeholder={'Enter Comment *'}
              placeholderTextColor={COLORS.DarkGray}
              maxLength={1000}
              value={formState?.comment || ''}
              onChangeText={value => handleInputChange('comment', value)}
              style={{
                ...styles.Input,
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.Black,
                marginTop: 10,
                height: 100,
                paddingTop: 10,
                textAlignVertical: 'top',
              }}
              multiline={true}
            />
          </View>
        )}

        {route.params?.screenType === 'Update Details' && (
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: 20,
              marginHorizontal: 5,
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() =>
                setFocusStates(prev => ({
                  ...prev,
                  ['calenderStatus']: !focusStates.calenderStatus,
                }))
              }
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: focusStates.calenderStatus
                  ? COLORS.Blue
                  : COLORS.Black,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {focusStates.calenderStatus && (
                <Image
                  source={ImagerHanlde.checkmark}
                  resizeMode="contain"
                  style={{width: 15, height: 15, tintColor: COLORS.Blue}}
                />
              )}
            </Pressable>

            <Text
              style={{fontSize: 16, color: COLORS.Black, fontWeight: '500'}}>
              {'Add to calendar'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const AdditionalInfoView = () => {
    return (
      <View
        style={{
          ...styles.viewBox,
          padding: 0,
          paddingVertical: 0,
        }}>
        <Pressable
          onPress={() =>
            setFocusStates(prev => ({
              ...prev,
              ['OptionStatus']: !focusStates.OptionStatus,
            }))
          }
          style={{
            width: '100%',
            height: 45,
            padding: 10,
            backgroundColor: COLORS.Blue,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: focusStates.OptionStatus ? 0 : 10,
            borderBottomLeftRadius: focusStates.OptionStatus ? 0 : 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{...styles.title, color: COLORS.White, flex: 1}}>
            {'Additional Information (Optional)'}
          </Text>
          <Image
            source={ImagerHanlde.caret_down}
            resizeMode="contain"
            style={{
              tintColor: COLORS.White,
              marginRight: 10,
              opacity: 1,
              width: 18,
              height: 16,
            }}
          />
        </Pressable>
        {focusStates?.OptionStatus && (
          <View
            style={{
              padding: 20,
              paddingTop: 5,
            }}>
            <TextInput
              secureTextEntry={false}
              keyboardType="default"
              placeholder={'Full Address'}
              placeholderTextColor={COLORS.DarkGray}
              maxLength={200}
              value={formState?.fullAddress}
              onChangeText={value => handleInputChange('fullAddress', value)}
              style={{
                ...styles.Input,
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.Black,
                marginTop: 15,
                height: 100,
                paddingTop: 10,
                textAlignVertical: 'top',
              }}
              multiline={true}
            />
            <View style={{marginTop: 10, gap: 10}}>
              {renderDropdown(
                ApiData?.countries,
                'country',
                formState?.country?.Id,
                'country',
              )}
              {renderDropdown(
                StateData,
                'State',
                formState?.state?.Id,
                'state',
              )}
            </View>

            <View style={styles.boxDrop}>
              <TextInput
                secureTextEntry={false}
                keyboardType="number-pad"
                placeholder={'PinCode'}
                placeholderTextColor={COLORS.DarkGray}
                maxLength={100}
                style={{...styles.Input, flex: 1}}
                value={formState?.pinCode}
                onChangeText={value => handleInputChange('pinCode', value)}
              />
              <TextInput
                secureTextEntry={false}
                keyboardType="number-pad"
                placeholder={'Lead Cost'}
                placeholderTextColor={COLORS.DarkGray}
                maxLength={100}
                style={{...styles.Input, flex: 1}}
                value={formState?.leadCost ? formState?.leadCost + '' : '0'}
                onChangeText={value => handleInputChange('leadCost', value)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };
  const HandleSave = type => {
    if (formState.fullName === '' || formState.fullName.length < 2) {
      showToast('Please enter the valid name');
    } else if (formState.phoneNo === '' || formState.phoneNo.length < 8) {
      showToast('Please enter the valid contact no');
    } else if (
      formState?.status?.lossStatus === true &&
      formState?.leadLostReason?.Id === null
    ) {
      showToast('Please Select Lost Reason.');
    } else if (
      formState?.status?.wonStatus === true &&
      formState?.leadWonAmount === null
    ) {
      showToast('Please enter Won amount');
    } else if (formState.datetime === null) {
      showToast('Please enter the date and time');
    } else if (formState.description === '') {
      showToast('Please enter the description.');
    } else {
      if (formState.email === '') {
        uploadDate(type);
      } else if (validateEmail(formState?.email)) {
        uploadDate(type);
      } else {
        showToast('Please enter the valid email address');
      }
    }
  };

  const uploadDate = type => {
    const body = {
      firstName: formState?.fullName || '',
      lastName: '',
      email: formState?.email || '',
      contactNumber: formState?.phoneNo || '',
      ...(formState?.source?.Id && {leadSource: formState?.source?.Id}),
      ...(formState?.service.Id && {productService: formState?.service.Id}),
      ...(formState?.agent.Id && {assignedAgent: formState?.agent.Id}),
      ...(formState?.status.Id && {leadStatus: formState?.status.Id}),
      followUpDate: formState?.datetime + '' || '',
      description: formState?.description || '',
      ...(route.params?.screenType === 'Update Details' && {
        comment: formState?.comment || '',
      }),
      companyName: '',
      website: '',
      fullAddress: formState?.fullAddress || '',
      country: formState?.country.Name || '',
      state: formState?.state.Name || '',
      city: '',
      pinCode: formState?.pinCode || '',
      alternatePhone: '',
      leadCost: parseInt(formState?.leadCost) || 0,
      ...(route.params?.screenType === 'Update Details' && {
        addCalender: focusStates?.calenderStatus,
      }),
      ...(formState?.status?.wonStatus &&
        formState?.leadWonAmount && {
          leadWonAmount: parseInt(formState?.leadWonAmount) || 0,
        }),
      ...(formState?.status?.lossStatus &&
        formState?.leadLostReason?.Id && {
          leadLostReasonId: formState?.leadLostReason?.Id || null,
        }),
    };

    setisLoading(true);

    const Url =
      route.params?.screenType !== 'Update Details'
        ? END_POINT.afterAuth.getAllLead
        : END_POINT.afterAuth.getAllLead + `/${data?._id}`;

    if (route.params?.screenType !== 'Update Details') {
      API.postAuthAPI(body, Url, authData.sessionId, null, res => {
        setisLoading(false);
        console.log(res);
        if (res.status) {
          if (type === 1) {
            navigation.navigate(ScreenIdentifiers.Dashboard, {
              screen: ScreenIdentifiers.AllLeadsScreen,
            });
          }
          setFormState(formList);
          setFocusStates(focusList);
        } else {
          showToast('something went wrong.');
        }
      });
    } else {
      API.putAuthAPI(body, Url, authData.sessionId, null, res => {
        setisLoading(false);
        if (res.status) {
          navigation.goBack({
            leadId: data?._id,
          });
          setFormState(formList);
          setFocusStates(focusList);
        } else {
          showToast('something went wrong.');
        }
      });
    }
  };

  return (
    <MainContainer
      HaderName={
        route.params?.screenType === 'Update Details'
          ? 'Update Lead'
          : 'Add Lead'
      }
      screenType={3}
      backgroundColor={COLORS.White}>
      {isLoading && (
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 300}}>
        {LeadInfoView()}
        {followpView()}
        {AdditionalInfoView()}
      </ScrollView>
      {!isLoading && (
        <View
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
              flex: route.params?.screenType !== 'Update Details' ? 0.5 : 1,
              height: 50,
              backgroundColor:
                route.params?.screenType !== 'Update Details'
                  ? COLORS.Blue
                  : COLORS.Green,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize:
                  route.params?.screenType !== 'Update Details' ? 16 : 18,
                fontWeight: '600',
                color: COLORS.White,
              }}>
              {route.params?.screenType !== 'Update Details'
                ? 'Save Lead'
                : 'Submit'}
            </Text>
          </Pressable>
          {route.params?.screenType !== 'Update Details' && (
            <Pressable
              onPress={() => HandleSave(2)}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.darkYellow,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: COLORS.White}}>
                {'Save & Add Another'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
      {/* <DatePicker
        modal
        open={focusStates['datetime']}
        date={formState?.datetime ? new Date(focusStates?.datetime) : new Date()}
        mode="datetime" // 'date', 'time', or 'datetime'
        onConfirm={selectedDate => {
          setFocusStates(prev => ({ ...prev, ['datetime']: false }));
          handleInputChange('datetime', selectedDate);
        }}
        onCancel={() =>
          setFocusStates(prev => ({ ...prev, ['datetime']: false }))
        }
      /> */}
      <DateTimePickerModal
        isVisible={focusStates['datetime']}
        mode="datetime" // 'datetime' mode for selecting both date and time
        onConfirm={selectedDate => {
          setFocusStates(prev => ({...prev, ['datetime']: false}));
          handleInputChange('datetime', selectedDate);
        }}
        onCancel={() =>
          setFocusStates(prev => ({...prev, ['datetime']: false}))
        }
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
  dropdown: {
    flex: 1,
    height: 50,
    backgroundColor: '#F2F2F2',
    borderColor: 'gray',
    borderWidth: 0,
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
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(AddLeadScreen);
