/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
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
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {ButtonContainer} from './ButtonContainer';
import {COLORS} from '../styles/themes';
import {ImagerHanlde} from '../utils/ImageProvider';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {focusList, formList} from '../utils/staticData';
import {formatCreatedAt} from '../utils';
import {showToast} from './showToast';
import {API} from '../API';
import {END_POINT} from '../API/UrlProvider';
import {ScrollView} from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const QuickUpdateModel = ({
  isModalVisible,
  closeModal,
  dataList = null,
  selectData = null,
  authData = null,
  ENDUrl = null,
  onUpdate,
}) => {
  const [touchY, setTouchY] = useState(0);
  const [formState, setFormState] = useState(formList);
  const [focusStates, setFocusStates] = useState(focusList);
  const [isLoading, setisLoading] = useState(false);
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
    setisLoading(false);
    if (selectData) {
      const updatedFormList = {
        ...formState,
        datetime: selectData?.followUpDate || new Date(),
        comment: selectData?.comment || '',
        leadWonAmount:
          selectData?.leadStatus?.name === 'Won'
            ? selectData?.leadWonAmount || 0
            : null,
        leadLostReason: {
          Id:
            selectData?.leadStatus?.name === 'Lost'
              ? selectData?.leadLostReasonId || null
              : null,
          Name: null,
        },
        status: {
          Id: selectData?.leadStatus?._id || null,
          Name: selectData?.leadStatus?.name || null,
          lossStatus: selectData?.leadStatus?.name === 'Lost' ? true : false,
          wonStatus: selectData?.leadStatus?.name === 'Won' ? true : false,
        },
      };
      setFormState(updatedFormList);
    }
  }, [selectData]);

  const handleInputChange = (field, value) => {
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
            lossStatus: item?.name === 'Lost' ? true : false,
            wonStatus: item?.name === 'Won' ? true : false,
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

  const HandleUpdate = type => {
    setFocusStates(focusList);
    if (type === 'Clear') {
      closeModal();
      setFormState(formList);
    } else {
      if (formState?.status?.Id === null) {
        showToast('Please Select lead status');
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
      } else if (formState.comment === '') {
        showToast('Please enter the comment.');
      } else {
        setisLoading(true);
        UpdateHandler();
      }
    }
  };

  const UpdateHandler = () => {
    const body = {
      leadStatus: formState?.status?.Id || '',
      followUpDate: formState?.datetime + '' || '',
      comment: formState?.comment || '',
      leadCost: formState?.leadCost ? parseInt(formState?.leadCost) : 0,
      addCalender: focusStates?.calenderStatus,
      ...(formState?.status?.wonStatus &&
        formState?.leadWonAmount && {
          leadWonAmount: parseInt(formState?.leadWonAmount) || 0,
        }),
      ...(formState?.status?.lossStatus &&
        formState?.leadLostReason?.Id && {
          leadLostReasonId: formState?.leadLostReason?.Id || null,
        }),
    };
    const Url = END_POINT.afterAuth.getAllLead + `/${selectData?._id}`;
    API.putAuthAPI(body, Url, authData?.sessionId, null, res => {
      setisLoading(false);
      if (res?.status) {
        setFormState(formList);
        setFocusStates(focusList);
        onUpdate({
          ...body,
          id: selectData?._id,
          statusName: formState?.status?.Name,
        });
      } else {
        showToast('something went wrong.');
      }
    });
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
        if (e.nativeEvent.pageY - touchY > 5) closeModal();
      }}>
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
          paddingTop: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '700',
            color: COLORS.Black,
          }}>
          {'Quick Update'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.Black,
            marginTop: 30,
          }}>
          {'Lead status'}
        </Text>

        <View style={{...styles.boxDrop, marginTop: 5}}>
          {renderDropdown(
            dataList?.status,
            'Select Status',
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
            style={{...styles.Input, marginTop: 10}}
            onChangeText={value => handleInputChange('leadWonAmount', value)}
          />
        )}
        {formState?.status?.lossStatus && (
          <View style={{...styles.boxDrop, marginTop: 15}}>
            {renderDropdown(
              dataList?.leadLoseReason,
              'Lost Reason',
              formState?.leadLostReason?.Id || null,
              'leadLostReason',
            )}
          </View>
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.Black,
            marginTop: 10,
          }}>
          {'Follow Up Date *'}
        </Text>
        <Pressable
          onPress={() =>
            setFocusStates(prev => ({...prev, ['datetime']: true}))
          }
          style={{
            ...styles.Input,
            marginTop: 10,
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.Black,
            marginTop: 10,
          }}>
          {'Comment *'}
        </Text>
        <TextInput
          secureTextEntry={false}
          keyboardType="default"
          placeholder={'Enter Comment *'}
          placeholderTextColor={COLORS.DarkGray}
          maxLength={1000}
          value={formState?.comment}
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

          <Text style={{fontSize: 16, color: COLORS.Black, fontWeight: '500'}}>
            {'Add to calendar'}
          </Text>
        </View>
        {!isKeyboardVisible && (
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: 50,
              marginBottom: 0,
            }}>
            <Pressable
              onPress={() => HandleUpdate('Clear')}
              style={{
                flex: 0.5,
                height: 45,
                backgroundColor: COLORS.LightGray,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.Black,
                  fontWeight: '500',
                }}>
                {'Close'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => HandleUpdate('Apply')}
              style={{
                flex: 1,
                height: 45,
                backgroundColor: COLORS.Blue,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.White,
                  fontWeight: '600',
                }}>
                {'Update'}
              </Text>
            </Pressable>
          </View>
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={{}}>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        animationInTiming={700}
        animationOutTiming={700}
        swipeDirection={['down']}
        style={{margin: 0}}>
        {renderContent()}
      </Modal>

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
        date={formState?.datetime ? new Date(formState?.datetime) : new Date()}
        themeVariant="light" // Or 'light' for a lighter theme
        onConfirm={selectedDate => {
          setFocusStates(prev => ({...prev, ['datetime']: false}));
          handleInputChange('datetime', selectedDate);
        }}
        onCancel={() =>
          setFocusStates(prev => ({...prev, ['datetime']: false}))
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  Input: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 0,
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

export default QuickUpdateModel;
