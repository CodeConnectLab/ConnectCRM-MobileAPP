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
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {focusList, formList} from '../utils/staticData';

const ReportFilterModel = ({
  isModalVisible,
  closeModal,
  dataList = null,
  Type = 1,
  user = null,
  onUpdate,
  formData = null,
  staticData = null,
}) => {
  const [touchY, setTouchY] = useState(0);
  const [formState, setFormState] = useState(formData);

  const [focusStates, setFocusStates] = useState(focusList);

  useEffect(() => {
    setFormState(formData);
  }, [formData]);

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
      labelField="name"
      valueField={'_id'}
      placeholder={placeholder}
      value={value}
      onFocus={() => setFocusStates(prev => ({...prev, [field]: true}))}
      onBlur={() => setFocusStates(prev => ({...prev, [field]: false}))}
      onChange={item =>
        handleInputChange(field, {
          Id: item?._id,
          Name: item?.name,
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
                color: value === item?._id ? COLORS.Blue : COLORS.Black,
              }}>
              {item?.name || ''}
            </Text>
          </View>
        ) : null;
      }}
    />
  );

  const HandleUpdate = type => {
    setFocusStates(focusList);
    if (type === 'Clear') {
      onUpdate(staticData);
      setFormState(staticData);
    } else {
      onUpdate(formState);
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
      onTouchEnd={e => {
        if (e.nativeEvent.pageY - touchY > 5) closeModal();
      }}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingBottom: 70,
          backgroundColor: COLORS.White,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <Pressable
          style={{
            width: '40%',
            height: 3,
            backgroundColor: COLORS.LightGray,
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 5,
          }}
        />
        <View
          style={{flexDirection: 'row', marginTop: 50, marginHorizontal: 2}}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',

              flex: 1,
            }}>
            {'Select User'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginLeft: 8,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
            }}>
            {'Select Status'}
          </Text>
        </View>

        <View style={{...styles.boxDrop, marginTop: 5}}>
          {renderDropdown(
            dataList?.agents,
            'Select user',
            formState?.agent?.Id || user?.id || '',
            'agent',
          )}
          {renderDropdown(
            dataList?.status,
            'Select Status',
            formState?.status?.Id,
            'status',
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'Select Product'}
        </Text>

        <View style={{...styles.boxDrop, marginTop: 10}}>
          {renderDropdown(
            dataList?.productsServices,
            'Select Product',
            formState?.service?.Id,
            'service',
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
            marginTop: 10,
          }}>
          {'Select Source'}
        </Text>

        <View style={{...styles.boxDrop, marginTop: 10}}>
          {renderDropdown(
            dataList?.sources,
            'Select Source',
            formState?.source?.Id,
            'source',
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginTop: 20,
              flex: 1,
            }}>
            {'From Date'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginTop: 20,
              flex: 1,
            }}>
            {'To Date'}
          </Text>
        </View>

        <View style={{flexDirection: 'row', gap: 10}}>
          <Pressable
            onPress={() =>
              setFocusStates(prev => ({...prev, ['startDate']: true}))
            }
            style={{
              ...styles.boxDrop,
              marginTop: 5,
              flex: 1,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.5,
              borderRadius: 10.67,
              borderColor: '#F2F2F2',
              backgroundColor: COLORS.lightWhite,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                flex: 1,
                justifyContent: 'center',
                fontSize: 15,
                color: formState?.startDate ? COLORS.Black : COLORS.LightGray,
              }}>
              {formState?.startDate
                ? formState?.startDate?.toDateString() + ''
                : 'form Date'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              setFocusStates(prev => ({...prev, ['endDate']: true}))
            }
            style={{
              ...styles.boxDrop,
              height: 40,
              marginTop: 5,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.5,
              borderRadius: 10.67,
              borderColor: '#F2F2F2',
              backgroundColor: COLORS.lightWhite,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                flex: 1,
                justifyContent: 'center',
                fontSize: 15,
                color: formState?.endDate ? COLORS.Black : COLORS.LightGray,
              }}>
              {formState?.endDate
                ? formState?.endDate?.toDateString()
                : 'To Date'}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: Type === 1 ? 80 : 40,
            marginBottom: 0,
          }}>
          <Pressable
            onPress={() => HandleUpdate('Clear')}
            style={{
              flex: 0.5,
              height: 40,
              backgroundColor: COLORS.LightGray,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{fontSize: 16, color: COLORS.Black, fontWeight: '500'}}>
              {'Clear'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => HandleUpdate('Apply')}
            style={{
              flex: 1,
              height: 40,
              backgroundColor: COLORS.Blue,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{fontSize: 16, color: COLORS.White, fontWeight: '600'}}>
              {'Apply'}
            </Text>
          </Pressable>
        </View>
      </View>
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

      <DatePicker
        modal
        open={focusStates['startDate']}
        date={formState?.startDate || new Date()}
        mode="date" // 'date', 'time', or 'datetime'
        onConfirm={selectedDate => {
          setFocusStates(prev => ({...prev, ['startDate']: false}));
          handleInputChange('startDate', selectedDate);
        }}
        onCancel={() =>
          setFocusStates(prev => ({...prev, ['startDate']: false}))
        }
      />
      <DatePicker
        modal
        open={focusStates['endDate']}
        date={formState?.endDate || new Date()}
        mode="date" // 'date', 'time', or 'datetime'
        onConfirm={selectedDate => {
          setFocusStates(prev => ({...prev, ['endDate']: false}));
          handleInputChange('endDate', selectedDate);
        }}
        onCancel={() => setFocusStates(prev => ({...prev, ['endDate']: false}))}
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
  },
});

export default ReportFilterModel;
