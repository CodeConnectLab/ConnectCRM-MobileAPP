/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  RefreshControl,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';
import {formList} from '../../../utils/staticData';
import ReportFilterModel from '../../../components/ReportFilterModel';
import FilterModel from '../../../components/FilterModel';
import {getFirstDateOfCurrentMonth} from '../../../utils';

const AnalyticReportScreen = ({user, authData}) => {
  const [reportType, setReportType] = useState(1);
  const [ApiDate, setApiDate] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const [CallReportData, setCallReportData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [PageNumber, setPageNumber] = useState(1);
  const [loadingNextData, setLoadingNextData] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const DateLimit = 20;
  const [selectFilter, setselectFilter] = useState(formList);
  const [isVisable, setIsvisable] = useState(false);
  const [isCallVisable, setIsCallvisable] = useState(false);
  const [FilterList, setFilterList] = useState(null);
  const [selectCallFilter, setSelectCallFilter] = useState({
    Employee: {
      Id: null,
      Name: null,
    },
    FormData: '',
    ToData: '',
  });

  useEffect(() => {
    if (reportType === 1) {
      getAPIData();
    } else {
      getCallApiData();
    }
  }, [reportType, selectFilter, selectCallFilter]);

  useEffect(() => {
    getLeadTypeData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (reportType === 1) {
      getAPIData();
    } else {
      getCallApiData();
    }
    getLeadTypeData();
  }, []);

  const getLeadTypeData = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.lead_types,
      authData.sessionId,
      null,
      res => {
        if (res?.status) {
          setFilterList(res?.data?.data || null);
        }
      },
    );
  };

  const getCallApiData = () => {
    const body = {
      userId: selectCallFilter?.Employee?.Id || user?.id,
      startDate: selectCallFilter?.FormData
        ? selectCallFilter?.FormData?.toISOString().split('T')[0]
        : getFirstDateOfCurrentMonth(),
      endDate: selectCallFilter?.ToData
        ? selectCallFilter?.ToData?.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };
    const APIURL =
      END_POINT.afterAuth.getCallList + `?page=${1}&limit=${DateLimit}`;
    API.postAuthAPI(body, APIURL, authData.sessionId, null, res => {
      setRefreshing(false);
      if (res?.status) {
        if (res?.data?.calls?.length > 0) {
          setPageNumber(2);
          setCallReportData(res?.data?.calls);
          setStoreData(res?.data?.pagination);
        } else {
          setLoadingNextData(false);
        }
      }
    });
  };

  const getAPIData = () => {
    const body = {
      assignedAgent: selectFilter?.agent?.Id || user?.id,
      ...(selectFilter?.service.Id && {
        ProductService: selectFilter?.service.Id,
      }),
      ...(selectFilter?.source.Id && {leadSource: selectFilter?.source.Id}),
      ...(selectFilter?.status.Id && {leadStatus: selectFilter?.status.Id}),
      startDate: selectFilter?.startDate
        ? selectFilter?.startDate?.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      endDate: selectFilter?.endDate
        ? selectFilter?.endDate?.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };
    API.postAuthAPI(
      body,
      END_POINT.afterAuth.manageReport,
      authData.sessionId,
      null,
      res => {
        setRefreshing(false);
        setisLoading(false);
        if (res.status) {
          setApiDate(res?.data || null);
        }
      },
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          ...styles.viewBox,
          flexDirection: 'row',
          paddingVertical: 10,
          borderRadius: 0,
          marginTop: 0,
        }}>
        <Text
          style={{
            flex: 0.5,
            textAlign: 'center',
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
          }}>
          {item?.srNo?.toString() || '--'}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
          }}>
          {item?.clientName || '-- --'}
        </Text>
        <Text
          style={{
            flex: 0.8,
            textAlign: 'center',
            fontSize: 14,
            color: COLORS.Black,
            fontWeight: '600',
          }}>
          {item?.leadPrice || '0'}
        </Text>
      </View>
    );
  };

  const ManageReport = () => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          backgroundColor: COLORS.lightWhite,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            width: '100%',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              borderRadius: 10,
              gap: 5,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Total'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '800',
                textAlign: 'center',
              }}>
              {ApiDate?.summary?.total || '0'}
            </Text>
          </View>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              borderRadius: 10,
              gap: 5,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Won'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '800',
                textAlign: 'center',
              }}>
              {ApiDate?.summary?.won || '0'}
            </Text>
          </View>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              borderRadius: 10,
              gap: 5,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Ratio'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '800',
                textAlign: 'center',
              }}>
              {ApiDate?.summary?.ratio
                ? `${ApiDate?.summary?.ratio}%`
                : '0.00%'}
            </Text>
          </View>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              borderRadius: 10,
              gap: 5,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Amount'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '800',
                textAlign: 'center',
              }}>
              {ApiDate?.summary?.amount || '0'}
            </Text>
          </View>
        </View>

        <View
          style={{
            ...styles.viewBox,
            paddingVertical: 0,
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 0,
              height: 40,
              backgroundColor: COLORS.lightBlue || '#FAFAFA',
              alignItems: 'center',
              paddingHorizontal: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 0.5,
                textAlign: 'center',
              }}>
              {'Sr. No.'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 1,
                textAlign: 'center',
              }}>
              {'Client Name'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '600',
                flex: 0.8,
                textAlign: 'center',
              }}>
              {'Lead Price'}
            </Text>
          </View>
        </View>
        <FlatList
          data={ApiDate?.leads || []}
          renderItem={renderItem}
          keyExtractor={item => item.srNo.toString()}
          style={{flex: 1, width: '100%'}}
          contentContainerStyle={{
            gap: 0,
            paddingBottom: 100,
            paddingTop: 0,
          }}
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
        />
      </View>
    );
  };

  const renderCallItem = ({item, index}) => {
    let ItemIcon = ImagerHanlde.MenuNav.call;
    let itemColor = COLORS.Black;

    switch (item?.callType) {
      case 'INCOMING':
        ItemIcon = ImagerHanlde.CallIcon.incoming;
        break;
      case 'OUTGOING':
        ItemIcon = ImagerHanlde.CallIcon.outgoing;
        break;
      case 'MISSED':
        ItemIcon = ImagerHanlde.CallIcon.missed_focused;
        itemColor = COLORS.Red;
        break;
      case 'REJECTED':
        ItemIcon = ImagerHanlde.CallIcon.rejected_focused;
        itemColor = COLORS.Red;
        break;
      default:
        break;
    }

    return (
      <View
        style={{
          ...styles.logItem,
        }}>
        <Image source={ItemIcon} style={{width: 20, height: 20}} />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'centers',
            }}>
            <Text style={{fontSize: 14, color: itemColor}}>
              {item?.clientName ? item?.clientName.slice(0, 20) : 'Unknown'}
              {item?.clientName && item?.clientName.length > 20 && '...'}
            </Text>
            <Text style={{fontSize: 11, color: COLORS.Black}}>
              {/* {item?.callDateTime
            ? new Date(Number(item?.callDateTime)).toLocaleString()
            : '-- ---'} */}
              {item?.callDateTime || '-- ---'}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.Black,
                fontWeight: '400',
                opacity: 0.8,
                marginTop: 2,
                flex: 1,
              }}>
              {item?.mobileNo || '---'}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.Black,
                fontWeight: '400',
                opacity: 0.8,
                marginTop: 2,
                flex: 0.5,
                textAlign: 'center',
              }}>
              {item?.duration ? item?.duration : '0h 0m 0s'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getListFooter = () => {
    if (!isLoading && PageNumber > storeData?.pages) {
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

  const loadData = () => {
    if (!isLoading && PageNumber !== 1) {
      if (PageNumber > storeData?.pages) {
        setLoadingNextData(false);
        setIsScrollingUp(false);
      } else {
        setLoadingNextData(true);

        API.getAuthAPI(APIURL, authData.sessionId, null, res => {
          setLoadingNextData(false);
          setIsScrollingUp(false);
          if (res.status) {
            if (res?.data?.calls?.length > 0) {
              if (PageNumber !== 1) {
                const data = [...CallReportData, ...res?.data?.calls];
                setCallReportData(data);
                setStoreData(res?.data?.pagination);
                setPageNumber(prev => prev + 1);
              }
            }
          }
        });

        const body = {
          userId: '6746a4bf44deffdbb6a5ed0f',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        };
        const APIURL =
          END_POINT.afterAuth.getCallList + `?page=${1}&limit=${DateLimit}`;
        API.postAuthAPI(body, APIURL, authData.sessionId, null, res => {
          setLoadingNextData(false);
          setIsScrollingUp(false);
          if (res?.status) {
            if (res?.data?.calls.length > 0) {
              if (PageNumber !== 1) {
                const data = [...CallReportData, ...res?.data?.calls];
                setCallReportData(data);
                setStoreData(res?.data?.pagination);
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

  const CallListReport = () => {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        <FlatList
          data={CallReportData || []}
          renderItem={renderCallItem}
          keyExtractor={item => item?.clientName?.toString()}
          style={{flex: 1, width: '100%'}}
          contentContainerStyle={{
            gap: 0,
            paddingBottom: 100,
            paddingTop: 0,
          }}
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
    );
  };

  const HandleFilterUpdate = res => {
    if (reportType === 1) {
      setselectFilter(res);
    } else {
      setSelectCallFilter(res);
    }

    setIsvisable(false);
    setIsCallvisable(false);
  };

  const OpenFiterModel = () => {
    if (reportType === 1) {
      setIsvisable(true);
    } else {
      setIsCallvisable(true);
    }
  };

  return (
    <MainContainer
      HaderName={'Analytic Report'}
      screenType={3}
      buttonStatus={FilterList ? true : false}
      icon={ImagerHanlde.filterIcon}
      backgroundColor={COLORS.White}
      onHandleButton={() => OpenFiterModel()}>
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
            style={{alignSelf: 'center'}}
          />
        </View>
      )}
      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            paddingHorizontal: 10,
            marginTop: 20,
            paddingBottom: 5,
          }}>
          <Pressable
            onPress={() => setReportType(1)}
            style={{
              flex: 1,
              height: 45,
              backgroundColor: reportType === 1 ? COLORS.Blue : COLORS.White,
              borderRadius: 10,
              shadowColor: 'black',
              elevation: 5,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: reportType === 1 ? COLORS.White : COLORS.Black,
              }}>
              {'Manage report'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setReportType(2)}
            style={{
              flex: 1,
              height: 45,
              backgroundColor: reportType === 2 ? COLORS.Blue : COLORS.White,
              borderRadius: 10,
              shadowColor: 'black',
              elevation: 5,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: reportType === 2 ? COLORS.White : COLORS.Black,
              }}>
              {'Call List'}
            </Text>
          </Pressable>
        </View>
      </View>
      {reportType === 1 && ManageReport()}
      {reportType === 2 && CallListReport()}

      <ReportFilterModel
        isModalVisible={isVisable}
        closeModal={() => setIsvisable(false)}
        dataList={FilterList || null}
        Type={reportType}
        user={user}
        onUpdate={res => HandleFilterUpdate(res)}
      />

      <FilterModel
        isModalVisible={isCallVisable}
        closeModal={() => setIsCallvisable(false)}
        data={FilterList?.agents || null}
        Type={1}
        user={user}
        onUpdate={res => HandleFilterUpdate(res)}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    width: '95%',
    paddingVertical: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: COLORS.White,
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
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
  logItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    shadowColor: COLORS.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(AnalyticReportScreen);
