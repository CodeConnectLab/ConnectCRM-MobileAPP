/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import {COLORS} from '../styles/themes';
import {Dropdown} from 'react-native-element-dropdown';
import {focusList, staticData} from '../utils/staticData';
import {ImagerHanlde} from '../utils/ImageProvider';
import {ButtonContainer} from '../components/ButtonContainer';
import {API} from '../API';
import {END_POINT} from '../API/UrlProvider';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {formatCreatedAt, openDialer, openWhatsApp} from '../utils';
import {ScreenIdentifiers} from '../routes';
import {showToast} from './showToast';
import SkeletonLoader from './SkeletonLoader';
import ReportFilterModel from './ReportFilterModel';
import FloatingButton from './FloatingButton';
import QuickUpdateModel from './QuickUpdateModel';

export const formList = {
  fullName: '',
  email: '',
  phoneNo: '',
  datetime: null,
  fullAddress: '',
  pinCode: '',
  leadCost: '',
  comment: '',
  formattedValue: '+91',
  startDate: '',
  endDate: '',
  leadWonAmount: null,
  leadLostReason: {Id: null, Name: null},
  agent: {Id: null, Name: null},
  status: {
    Id: null,
    Name: null,
    lossStatus: false,
    wonStatus: false,
  },
  service: {Id: null, Name: null},
  source: {Id: null, Name: null},
  country: {Id: null, Name: null},
  state: {Id: null, Name: null},
};

const today = new Date(); // Get the current date
const tomorrow = new Date(today); // Clone today's date
tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to the date

export const LeadContainer = ({
  ENDUrl,
  authData,
  type = 'lead',
  selectData = null,
}) => {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [PageNumber, setPageNumber] = useState(1);
  const DateLimit = 10;

  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const [loadingNextData, setLoadingNextData] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const [storeData, setStoreData] = useState(null);
  const [LeadData, setLeadData] = useState([]);
  const [LeadType, setLeadType] = useState(null);

  const [formState, setFormState] = useState(formList);
  const [focusStates, setFocusStates] = useState(focusList);

  const [selectFilter, setselectFilter] = useState(formList);
  const [isVisable, setIsvisable] = useState(false);
  const [isQuickModel, setIsQuickModel] = useState(false);
  const [QuickSelectData, setQuickSelectData] = useState(null);

  useEffect(() => {
    getAPIData();
  }, [searchText, selectFilter]);

  useEffect(() => {
    if (selectData?.leadStatus) {
      const updatedFormList = {
        ...selectFilter,
        // startDate: today,
        // endDate: tomorrow,
        status: {
          ...selectFilter.status,
          Id: selectData?.leadStatus || null,
        },
      };
      setselectFilter(updatedFormList);
      setFormState(updatedFormList);
      setisLoading(true);
    }
  }, [selectData?.leadStatus]);

  useEffect(() => {
    getLeadTypeData();
  }, []);

  const getLeadTypeData = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.lead_types,
      authData?.sessionId,
      null,
      res => {
        if (res?.status) {
          setLeadType(res?.data?.data || null);
        }
      },
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setselectFilter(formList);
    setPageNumber(1);
    setFormState(formList);
    await getAPIData();
    getLeadTypeData();
  }, []);

  const buildAPIUrl = PageNo => {
    const params = new URLSearchParams();
    params.append('page', PageNo);
    params.append('limit', DateLimit);
    if (searchText) {
      params.append('search', searchText);
    }
    if (selectFilter?.source?.Id) {
      params.append('leadSource', selectFilter.source.Id);
    }
    if (selectFilter?.service?.Id) {
      params.append('productService', selectFilter.service.Id);
    }
    if (selectFilter?.status?.Id) {
      params.append('leadStatus', selectFilter.status.Id);
    }
    if (selectFilter?.agent?.Id) {
      params.append('assignedAgent', selectFilter.agent.Id);
    }

    if (selectFilter?.startDate) {
      params.append(
        'startDate',
        selectFilter?.startDate?.toISOString().split('T')[0],
      );
    }
    if (selectFilter?.endDate) {
      params.append(
        'endDate',
        selectFilter?.endDate?.toISOString().split('T')[0],
      );
    }

    return `${ENDUrl}?${params.toString()}`;
  };

  const getAPIData = async () => {
    const APIURL = await buildAPIUrl(1);
    setLeadData([]);
    setStoreData([]);

    API.getAuthAPI(APIURL, authData?.sessionId, navigation, res => {
      setRefreshing(false);
      setisLoading(false);
      if (res?.status) {
        if (res?.data?.data?.length > 0) {
          setPageNumber(2);
          setLoadingNextData(true);
          setIsScrollingUp(true);
          const cleanedData = removeDuplicates(res?.data?.data || []);
          setLeadData(cleanedData);

          setStoreData(res?.data?.options || null);
        } else {
          setPageNumber(1);
          setLeadData([]);
          setStoreData(null);
        }
      } else {
        setPageNumber(1);
        setLeadData([]);
        setStoreData(null);
      }
    });
  };

  const handleClearFiler = () => {
    setFormState(formList);
    setFocusStates(focusList);
    setSelectedItems([]);
  };

  const handleLongPress = id => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handlePress = id => {
    if (selectedItems?.length > 0) {
      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter(item => item !== id));
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    } else {
      navigation.navigate(ScreenIdentifiers.LeadsDetailsScreen, {
        leadId: id,
        screenName: type,
      });
    }
  };
  const handleQuickEdit = item => {
    setQuickSelectData(item);
    setIsQuickModel(true);
  };

  const handleQuicKMdel = updateDate => {
    setIsQuickModel(false);
    const updatedList = LeadData.map(item => {
      if (item._id === updateDate?.id) {
        return {
          ...item,
          addCalender: updateDate?.addCalender || false,
          comment: updateDate?.comment || '',
          followUpDate: updateDate.followUpDate
            ? new Date(updateDate.followUpDate).toISOString()
            : '',
          ...(updateDate?.leadCost && {leadCost: updateDate?.leadCost}),
          ...(updateDate?.leadWonAmount && {
            leadWonAmount: updateDate?.leadWonAmount,
          }),
          leadStatus: {
            _id: updateDate?.leadStatus || '',
            color: item?.color || '',
            name: updateDate?.statusName || '',
          },
        };
      }
      return item;
    });

    setLeadData(updatedList);
    // onRefresh();
  };

  const renderItem = ({item, index}) => {
    const name = `${item?.firstName || ''} ${item?.lastName || ''}`;

    return (
      <TouchableOpacity
        style={{
          ...styles.viewBox,
          paddingHorizontal: 10,
          marginBottom: 0,
          gap: 5,
          flexDirection: 'row',
          backgroundColor: selectedItems.includes(item?._id)
            ? COLORS.lightBlue
            : COLORS.White,
        }}
        onPress={() => handlePress(item?._id)}
        onLongPress={() => handleLongPress(item?._id, index)}>
        <View style={{flex: 1, gap: 5}}>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <View style={styles.imageWrapper}>
              <Image
                source={ImagerHanlde.profile.avatar}
                resizeMode="contain"
                style={styles.profileBgImage}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: COLORS.Black,
              }}>
              {name && name?.length > 2 ? name?.slice(0, 10) : 'Unknown'}
              {name?.length > 10 && '...'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: COLORS.Blue,
                flex: 1,
              }}>
              {item?.leadStatus?.name
                ? `(${item?.leadStatus?.name || ''})`
                : ''}
            </Text>
            {selectedItems?.length === 0 && (
              <Pressable
                onPress={() => handleQuickEdit(item)}
                style={{
                  marginRight: 10,
                  width: 70,
                  height: 25,
                  backgroundColor: COLORS.Blue,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.White,
                    fontWeight: '600',
                  }}>
                  {'Quick Edit'}
                </Text>
              </Pressable>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              marginTop: 0,
            }}>
            {item?.assignedAgent?.name && (
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={ImagerHanlde.profile.person}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>
                  {item?.assignedAgent?.name || ''}
                </Text>
              </View>
            )}

            {item?.followUpDate && (
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={ImagerHanlde.alarm}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>
                  {item?.followUpDate
                    ? formatCreatedAt(item?.followUpDate)
                    : ''}
                </Text>
              </View>
            )}
          </View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            {item?.contactNumber && (
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={ImagerHanlde.MenuNav?.call}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>
                  {item?.contactNumber || ''}
                </Text>
              </View>
            )}

            {item?.city && (
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={ImagerHanlde.location}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>{item?.city || ''}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Image
              source={ImagerHanlde.chatbox}
              resizeMode="contain"
              style={{...styles.itemIcon, width: 15, height: 15}}
            />
            <Text
              style={{
                ...styles.itemSubText,
                fontSize: 15,
                opacity: item?.comment?.length > 0 ? 1 : 0.5,
              }}>
              {item?.comment?.length > 0
                ? item?.comment?.slice(0, 15) +
                  (item?.comment?.length > 15 ? '...' : '')
                : 'No comment available'}
            </Text>
          </View>
        </View>
        {selectedItems?.length > 0 ? (
          <View
            style={{
              width: 25,
              height: 25,
              borderWidth: 0.5,
              borderRadius: 5,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: selectedItems.includes(item?._id)
                ? COLORS.Green
                : COLORS.Black,
              backgroundColor: selectedItems.includes(item?._id)
                ? COLORS.Green
                : COLORS.lightWhite,
            }}>
            {selectedItems.includes(item?._id) && (
              <Image
                source={ImagerHanlde.checkmark}
                style={{width: 17, height: 17, tintColor: COLORS.White}}
                resizeMode="contain"
              />
            )}
          </View>
        ) : (
          <View style={{alignItems: 'center', gap: 5}}>
            <Pressable
              onPress={() => {
                handleQuickEdit(item);
                openWhatsApp(item?.contactNumber, item?.firstName);
              }}
              style={{
                width: 25,
                height: 25,
                backgroundColor: COLORS.Green,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImagerHanlde.whatsappIcon}
                resizeMode="contain"
                style={{width: 15, height: 15}}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                handleQuickEdit(item);
                openDialer(item?.contactNumber);
              }}
              style={{
                width: 25,
                height: 25,
                backgroundColor: COLORS.Yellow,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImagerHanlde.MenuNav.call}
                resizeMode="contain"
                style={{width: 15, height: 15}}
              />
            </Pressable>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const SearchView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.White,
          borderRadius: 8,
          paddingHorizontal: 10,
          height: 40,
          margin: 10,
          gap: 5,
          shadowColor: 'black',
          elevation: 5,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
        <Image
          source={ImagerHanlde.search}
          style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
          }}
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 5,
            color: COLORS.Black,
          }}
          placeholder="Search here..."
          placeholderTextColor={COLORS.DarkGray}
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Close Icon */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Image
              source={ImagerHanlde.close}
              style={{
                width: 20,
                height: 20,
                marginHorizontal: 5,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getListFooter = () => {
    if (!isLoading && PageNumber > storeData?.pagination?.totalPages) {
      return null;
    }
    if (loadingNextData) {
      return (
        <View style={{paddingVertical: 10, alignItems: 'center'}}>
          <ActivityIndicator size="small" color={COLORS.Blue} />
        </View>
      );
    }
    return null;
  };

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isUp = currentOffset <= 0;

    if (isUp !== isScrollingUp) {
      setIsScrollingUp(isUp);
    }
  };

  const loadData = async () => {
    if (!isLoading && PageNumber !== 1) {
      if (PageNumber > storeData?.pagination?.totalPages) {
        setLoadingNextData(false);
        setIsScrollingUp(false);
      } else {
        setLoadingNextData(true);
        const APIURL = buildAPIUrl(PageNumber);
        API.getAuthAPI(APIURL, authData.sessionId, navigation, res => {
          setLoadingNextData(false);
          setIsScrollingUp(false);
          if (res.status) {
            if (res?.data?.data?.length > 0) {
              if (PageNumber > 1) {
                const data = [...LeadData, ...res?.data?.data];

                const cleanedData = removeDuplicates(data);
                setLeadData(cleanedData);
                setStoreData(res?.data?.options);
                setPageNumber(prev => prev + 1);
              }
            }
          }
        });
      }
    } else {
      setLoadingNextData(false);
      setIsScrollingUp(false);
    }
  };

  const removeDuplicates = dataArray => {
    const uniqueItems = dataArray.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          t => t?.contactNumber === item?.contactNumber && t?._id === item?._id,
        ),
    );
    return uniqueItems;
  };

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
      valueField="_id"
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

  const HandlebulkUpdate = () => {
    if (formState?.agent?.Id || formState?.status?.Id) {
      const body = {
        leadIds: selectedItems,
        ...(formState?.agent?.Id && {assignedAgent: formState?.agent?.Id}),
        ...(formState?.status?.Id && {leadStatus: formState?.status?.Id}),
      };
      API.putAuthAPI(
        body,
        END_POINT.afterAuth.bulkUpdate,
        authData.sessionId,
        null,
        res => {
          if (res.status) {
            setSelectedItems([]);
            setFormState(formList);
            onRefresh();
          }
        },
      );
    }
  };

  const BulkAction = () => {
    return (
      <View
        style={{
          ...styles.viewBox,
          width: '100%',
          marginHorizontal: 0,
          marginBottom: 0,
          backgroundColor: COLORS.White,
          shadowColor: 'black',
          borderRadius: 10,
          elevation: 5,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
        <Text style={styles.title}>{'Bulk Action'}</Text>
        <View style={{...styles.boxDrop, marginTop: 10}}>
          {renderDropdown(
            LeadType?.agents,
            'Agent',
            formState?.agent?.Id,
            'agent',
          )}
          {renderDropdown(
            LeadType?.status,
            'Status',
            formState?.status?.Id,
            'status',
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 15,
            gap: 15,
          }}>
          <Pressable
            onPress={() => handleClearFiler()}
            style={{
              flex: 0.5,
              height: 40,
              backgroundColor: COLORS.LightGray,
              borderWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.Black,
              }}>
              {'Clear'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => HandlebulkUpdate()}
            style={{
              flex: 1,
              height: 40,
              backgroundColor: COLORS.Blue,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: COLORS.White,
              }}>
              {'Submit'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const HandleFilterUpdate = res => {
    setselectFilter(res);
    setFormState(res);
    setIsvisable(false);
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: COLORS.lightWhite,
          }}>
          {selectedItems.length > 0 ? BulkAction() : SearchView()}
          <FlatList
            data={LeadData}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
            style={{flex: 1, width: '100%'}}
            contentContainerStyle={{gap: 0, paddingBottom: 100}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No Data found</Text>
                </View>
              ) : null
            }
            ListFooterComponent={getListFooter}
            onEndReachedThreshold={0.1}
            onScroll={handleScroll}
            onEndReached={loadData}
          />
        </View>
      )}

      <FloatingButton
        onClick={() => setIsvisable(true)}
        bottom={type === 'imported lead' ? 40 : 100}
        icon={ImagerHanlde.filterIcon}
      />

      <ReportFilterModel
        isModalVisible={isVisable}
        closeModal={() => setIsvisable(false)}
        dataList={LeadType || null}
        Type={1}
        formData={formState}
        staticData={formList}
        onUpdate={res => HandleFilterUpdate(res)}
      />

      <QuickUpdateModel
        isModalVisible={isQuickModel}
        closeModal={() => setIsQuickModel(false)}
        dataList={LeadType || null}
        selectData={QuickSelectData}
        authData={authData}
        ENDUrl={ENDUrl}
        onUpdate={res => handleQuicKMdel(res)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 40,
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Black,
  },
  viewBox: {
    paddingVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D9F0FA',
    marginVertical: 2,
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
  imageWrapper: {
    width: 25,
    height: 25,
    borderWidth: 0.5,
    borderRadius: 12.5,
    backgroundColor: 'transparent', // Or use "transparent" if you want
    overflow: 'hidden', // Optional, keeps shadows in bounds
  },
  profileBgImage: {
    width: '100%',
    height: '100%',
  },
  itemIcon: {
    width: 12,
    height: 12,
  },
  itemSubText: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.Black,
  },
});
