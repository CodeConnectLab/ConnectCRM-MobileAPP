/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../../components/MainContainer';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import {COLORS} from '../../../../styles/themes';
import {useNavigation, CommonActions} from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import {Dropdown} from 'react-native-element-dropdown';
import {ImagerHanlde} from '../../../../utils/ImageProvider';
import {API} from '../../../../API';
import {END_POINT} from '../../../../API/UrlProvider';
import {ButtonContainer} from '../../../../components/ButtonContainer';

const UpdateCompany = ({user, authData}) => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [formState, setFormState] = useState({
    companyName: '',
    address: '',
    contactPerson: '',
    pinCode: '',
    email: '',
    phone: '',
    formattedValue: '',
    website: '',
    gstNumber: '',
    panNumber: '',
    country: {Id: null, Name: null},
    state: {Id: null, Name: null},
    City: {Id: null, Name: null},
  });

  const [focusStates, setFocusStates] = useState({
    country: false,
    state: false,
  });
  const [ApiData, setApiData] = useState(null);
  const [StateData, setStateData] = useState([]);
  const [CityData, setCityData] = useState([]);
  const [CountryStates, setCountryStates] = useState({});
  const phoneInputRef = useRef(null);

  useEffect(() => {
    getLeadTypeData();
  }, []);

  const getLeadTypeData = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.lead_types,
      authData.sessionId,
      navigation,
      res => {
        setisLoading(false);
        if (res?.status) {
          setApiData(res?.data?.data || null);
        }
      },
    );
  };

  useEffect(() => {
    if (CountryStates?.Id) {
      getStateData();
    }
  }, [CountryStates]);

  const getStateData = () => {
    setisLoading(true);
    API.getAuthAPI(
      END_POINT.afterAuth.stateList + CountryStates?.Id,
      null,
      null,
      res => {
        setisLoading(false);
        if (res.status) {
          setStateData(res?.data?.data || []);
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
      labelField="name"
      valueField={
        field === 'country' ? 'isoCode' : field === 'state' ? 'code' : '_id'
      }
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
              {item?.name || ''}
            </Text>
          </View>
        ) : null;
      }}
    />
  );

  return (
    <MainContainer
      HaderName={'Update Details'}
      screenType={3}
      backgroundColor={COLORS.White}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 300}}>
        <View style={styles.viewBox}>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Company Name *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Company Name *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.companyName}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('companyName', value)}
          />
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Company Website *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Company Website url *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.website}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('website', value)}
          />
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Email Address *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Email Address*'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.email}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('email', value)}
          />
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Contact No. *'}
          </Text>

          <TextInput
            secureTextEntry={false}
            keyboardType="number-pad"
            placeholder={'Enter phone number*'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState?.phone ? formState?.phone + '' : ''}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('phone', value)}
          />
        </View>

        <View style={styles.viewBox}>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Company Address *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Company Address *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.address}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('address', value)}
          />
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginBottom: 5,
            }}>
            {'Country *'}
          </Text>
          {renderDropdown(
            ApiData?.countries,
            'country',
            formState?.country?.Id,
            'country',
          )}
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginBottom: 5,
              marginTop: 10,
            }}>
            {'State *'}
          </Text>
          {renderDropdown(StateData, 'State', formState?.state?.Id, 'state')}

          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginBottom: 5,
              marginTop: 10,
            }}>
            {'City *'}
          </Text>
          {renderDropdown(CityData, 'City', formState?.City?.Id, 'City')}
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              marginTop: 10,
            }}>
            {'PinCode *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter PinCode *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.pinCode}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('pinCode', value)}
          />
        </View>

        <View style={styles.viewBox}>
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Company PAN No. *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Company PAN No. *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.panNumber}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('panNumber', value)}
          />
          <Text style={{fontSize: 14, color: COLORS.Black, fontWeight: '600'}}>
            {'Company GST No. *'}
          </Text>
          <TextInput
            secureTextEntry={false}
            keyboardType="default"
            placeholder={'Enter Company GST No. *'}
            placeholderTextColor={COLORS.DarkGray}
            maxLength={100}
            value={formState.panNumber}
            style={{...styles.Input, flex: 1}}
            onChangeText={value => handleInputChange('panNumber', value)}
          />
        </View>
      </ScrollView>
      <ButtonContainer
        TextColor={COLORS.White}
        textValue={'Submit'}
        top={20}
        bottom={20}
        width={'80%'}
        onClick={() => null}
      />
      {/* <Pressable
        onPress={() => null}
        style={{
          width: '80%',
          height: 45,
          backgroundColor: COLORS.Green,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.White,
          }}>
          {'Submit'}
        </Text>
      </Pressable> */}
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
    alignSelf: 'center',
    width: '90%',
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
    marginBottom: 10,
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

export default connect(mapStateToProps, React.memo)(UpdateCompany);
