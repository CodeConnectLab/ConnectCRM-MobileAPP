/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../../../components/MainContainer';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Image,
  Pressable,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../../../styles/themes';
import { useNavigation, CommonActions } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import { Dropdown } from 'react-native-element-dropdown';
import { ImagerHanlde } from '../../../../utils/ImageProvider';
import { API } from '../../../../API';
import { END_POINT } from '../../../../API/UrlProvider';
import { ScreenIdentifiers } from '../../../../routes';
import { showToast } from '../../../../components/showToast';
import { companyFocus, companyList } from '../../../../utils/staticData';
import { dispatchAddUser } from '../../../../redux/actionDispatchers/user-dispatchers';

const DateFormatList = [
  { id: "DD/MM/YYYY", name: "DD/MM/YYYY" },
  { id: "MM/DD/YYYY", name: "MM/DD/YYYY" },
  { id: "YYYY-MM-DD", name: "YYYY-MM-DD" }
];

const TimezoneList = [
  { id: "UTC", name: 'UTC' },
  { id: "Asia/Kolkata", name: "Asia/Kolkata" },
  { id: "America/New_York", name: "America/New_York" },
  { id: "Europe/London", name: "Europe/London" }
];

const CurrencyList = [
  { id: "INR", name: 'Indian Rupee (INR)' },
  { id: 'USD', name: 'US Dollor (USD)' },
  { id: "EUR", name: 'Euro (EUR)' },
  { id: 'GBP', name: "British Pound (GBP)" }
];

const CompanyDetails = ({ user, authData }) => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const [ApiData, setApiData] = useState(null);
  const [ScreenType, setScreenType] = useState(1);

  const [formState, setFormState] = useState(user?.companyData || companyList);
  const [focusStates, setFocusStates] = useState(companyFocus);



  const onHandleEdit = () => {
    navigation.navigate(ScreenIdentifiers.UpdateCompany, {
      data: ApiData || null,
      screenType: 'Update Details',
    });
  };

  const openDialer = item => {
    const url = `tel:${item?.contactNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          showToast('Dialer app is not available on this device.');
        }
      })
      .catch(err => console.error('Error opening dialer', err));
  };

  const openWebsite = item => {
    Linking.openURL('https://example.com').catch(err =>
      console.error('Error opening URL:', err),
    );
  };

  const handleInputChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };


  const handleInputobjChange = (fieldPath, value) => {
    setFormState(prev => {
      const keys = fieldPath.split(".");
      let updated = { ...prev };

      // Navigate to the correct nested key
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      // Update the final key
      current[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const InputDesign = (
    title,
    keyboardType,
    placeholder,
    value,
    field,
    status = false,
    objectStatus = false,
  ) => {
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.DarkGray}
          editable={status}
          value={value}
          style={{ ...styles.Input, flex: 1, marginTop: 5 }}
          onChangeText={res => {
            if (status) {
              if (objectStatus) {
                handleInputobjChange(field, res);
              } else {
                handleInputChange(field, res);
              }
            }
          }}
        />
      </View>
    );
  };

  const renderDropdown = (title, data, placeholder, value, field, field2, status = false) => {
    return (
      <View style={{ marginBottom: 5 }}>
        <Text style={styles.title}>{title}</Text>
        {
          !status ?
            <View style={{ ...styles.dropdown, borderColor: 'gray', justifyContent: 'center', paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 16, color: COLORS.Gray, fontWeight: "600" }}>{value || placeholder}</Text>
            </View> : <Dropdown
              style={[styles.dropdown, focusStates[field] && { borderColor: 'gray' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={status ? data || [] : []} // Render options only if status is true
              maxHeight={300}
              labelField={'name'}
              valueField={'id'}
              placeholder={placeholder}
              value={value}
              onFocus={() => {
                if (status) {
                  setFocusStates(prev => ({ ...prev, [field2]: true }));
                }
              }}
              onBlur={() => {
                if (status) {
                  setFocusStates(prev => ({ ...prev, [field2]: false }));
                }
              }}
              onChange={item => {
                if (status) {
                  handleInputobjChange(field, item?.id);
                }
              }}
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
                        color: value === item?.id ? COLORS.Blue : COLORS.Black,
                      }}>
                      {item?.name || ''}
                    </Text>
                  </View>
                ) : null;
              }}
            />
        }

      </View>
    )
  }


  const ButtonHandle = (field, type) => {
    if (field === "cancel") {
      setFormState(user?.companyData || companyList);
      setFocusStates(companyFocus);
    } else {
      let body = null;
      if (type === "companyInfo") {
        body = {
          name: formState?.name || "",
          industry: formState?.industry || "",
          size: formState?.size ? parseInt(formState?.size) : 0,
          taxId: formState?.taxId || "",
        }
      }
      else if (type === "contactInf") {
        body = {
          primaryContact: {
            name: formState?.primaryContact?.name || "",
            email: formState?.primaryContact?.email || "",
            phone: formState?.primaryContact?.phone + "" || ""
          },
          website: formState?.website || "",
          billingAddress: formState?.billingAddress || "",
        }
      } else {
        body = {
          settings: {
            dateFormat: formState?.settings?.dateFormat || '',
            timezone: formState?.settings?.timezone || '',
            currency: formState?.settings?.currency || '',
            language: formState?.settings?.language || '',
            fiscalYearStart: formState?.settings?.fiscalYearStart || '',
          }
        }
      }
      updateHandle(body);

    }

  }


  const updateHandle = (body) => {
    // console.log(body)
    setisLoading(true);
    API.putAuthAPI(body, END_POINT.afterAuth.updateCompanyDetails, authData.sessionId, null, (res) => {
      setisLoading(false);
      if (res.status) {
        setFocusStates(companyFocus);
        const AddData = {
          ...user,
          companyData: {
            ...user?.companyData,
            ...body
          },
        };
        setFormState(AddData?.companyData);
        dispatchAddUser(AddData);
      }
    })

  }

  const ButtonView = ({ type = 'companyInfo' }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>

        <Pressable
          onPress={() => ButtonHandle("cancel", type)}
          style={{ flex: 0.5, height: 40, backgroundColor: COLORS.Green, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: COLORS.White, fontWeight: '600' }}>{"Cancel"}</Text>
        </Pressable>
        <Pressable
          onPress={() => ButtonHandle("save", type)}
          style={{ flex: 0.5, height: 40, backgroundColor: COLORS.Blue, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: COLORS.White, fontWeight: '600' }}>{"Save"}</Text>
        </Pressable>

      </View>
    )
  }


  const TitleView = ({ icon = ImagerHanlde.building_icon, title = "Company Information", field = 'companyInf' }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 30 }}>
        <Image source={icon} resizeMode="contain" style={{ width: 20, height: 20, tintColor: COLORS.Blue }} />
        <Text style={{ fontSize: 16, color: COLORS.Black, fontWeight: '600', flex: 1 }}>{title}</Text>
        {
          !focusStates[field] && <Pressable onPress={() => setFocusStates(prev => ({ ...prev, [field]: true }))} style={{ width: 60, height: 30, backgroundColor: COLORS.Blue, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
            <Text style={{ fontSize: 14, color: COLORS.White, fontWeight: '600' }}>{"Edit"}</Text>
          </Pressable>
        }
      </View>
    )
  }

  const CompanyInformation = () => {
    return (
      <View style={{ ...styles.viewBox }}>
        <TitleView
          icon={ImagerHanlde.building_icon}
          title="Company Information"
          field='companyInf' />

        {InputDesign(
          "Company Name",
          "default",
          "Enter company name*",
          formState?.name || "",
          "name",
          focusStates?.companyInf
        )}

        {InputDesign(
          "Industry",
          "default",
          "Enter Industry *",
          formState?.industry || "",
          "industry",
          focusStates?.companyInf
        )}

        {InputDesign(
          "Company Size",
          "number-pad",
          "Enter Company Size",
          formState?.size + "" || "",
          "size",
          focusStates?.companyInf
        )}

        {InputDesign(
          "Tax ID",
          "default",
          "Enter Tax ID",
          formState?.taxId || "",
          "taxId",
          focusStates?.companyInf
        )}
        {!focusStates?.companyInf && InputDesign(
          "Status",
          "default",
          "Status",
          formState?.status || "",
          "status",
          false
        )}
        {
          focusStates?.companyInf && <ButtonView type={'companyInfo'} />
        }

      </View>
    );
  };

  const ContactInformation = () => {
    return (
      <View style={{ ...styles.viewBox }}>

        <TitleView
          icon={ImagerHanlde.person_f}
          title="Contact Information"
          field='contactInf' />

        {InputDesign("Primary Contact",
          "default",
          "Enter Primary Contact",
          formState?.primaryContact?.name || "",
          "primaryContact.name",
          focusStates?.contactInf,
          true
        )}

        {InputDesign("Email",
          "email-address",
          "Enter Email Address",
          formState?.primaryContact?.email || "",
          "primaryContact.email",
          focusStates?.contactInf,
          true
        )}

        {InputDesign("Phone",
          "number-pad",
          "Enter Phone Number",
          formState?.primaryContact?.phone || "",
          "primaryContact.phone",
          focusStates?.contactInf,
          true
        )}

        {InputDesign("Website",
          "default",
          "Enter Website",
          formState?.website || "",
          "website",
          focusStates?.contactInf,
          false
        )}

        {InputDesign("Billing Address",
          "default",
          "Enter Billing Address",
          formState?.billingAddress || "",
          "billingAddress",
          focusStates?.contactInf,
          false
        )}

        {
          focusStates?.contactInf && <ButtonView type={'contactInf'} />
        }
      </View>
    );
  };

  const SystemSettings = () => {
    return (
      <View style={{ ...styles.viewBox }}>
        <TitleView
          icon={ImagerHanlde.WebIcon}
          title="System Settings"
          field='contactSetting' />

        {renderDropdown(
          "Date Format",
          DateFormatList,
          'Select an option',
          formState?.settings?.dateFormat || "",
          'settings.dateFormat',
          'dateFormat',
          focusStates?.contactSetting
        )}

        {renderDropdown(
          "Timezone",
          TimezoneList,
          'Select an option',
          formState?.settings?.timezone,
          'settings.timezone',
          'timezone',
          focusStates?.contactSetting
        )}

        {renderDropdown(
          "Currency",
          CurrencyList,
          'Select an option',
          formState?.settings?.currency,
          'settings.currency',
          'currency',
          focusStates?.contactSetting
        )}


        {InputDesign("Fiscal Year Start",
          "default",
          "Enter Fiscal Year Start",
          formState?.settings?.fiscalYearStart || "",
          "settings.fiscalYearStart",
          focusStates?.contactSetting,
          true
        )}
        {
          focusStates?.contactSetting && <ButtonView type={'settings'} />
        }
      </View>
    );
  };




  return (
    <MainContainer
      HaderName={'Company Settings'}
      screenType={3}
      backgroundColor={COLORS.White}
      buttonStatus={false}
      onHandleButton={() => onHandleEdit()}>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flex: 1,
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
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 20,
          backgroundColor: COLORS.lightWhite,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={{ flex: 1, width: "100%" }}>
          {CompanyInformation()}
          {ContactInformation()}
          {SystemSettings()}
        </View>
      </ScrollView>
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
    width: '100%',
    paddingVertical: 20,
    backgroundColor: COLORS.White,
    borderRadius: 10,
    marginTop: 15,
    padding: 15,
    elevation: 5, // Android box shadow
    shadowColor: 'black', // iOS box shadow
    shadowOffset: { width: 0, height: 2 },
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
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F2',
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 8,
    marginTop: 5
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
  boxDrop: { flexDirection: 'row', gap: 10, marginTop: 10 },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(CompanyDetails);
