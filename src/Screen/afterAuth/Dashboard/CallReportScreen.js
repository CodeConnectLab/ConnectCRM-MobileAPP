/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {PieChart} from 'react-native-svg-charts';
import FloatingButton from '../../../components/FloatingButton';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import FilterModel from '../../../components/FilterModel';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';
import {pieData} from '../../../utils/staticData';
import {ButtonContainer} from '../../../components/ButtonContainer';
import {showToast} from '../../../components/showToast';
import {useNavigation, CommonActions} from '@react-navigation/native';
const FirstDate = new Date();
FirstDate.setDate(1);

const FiterList = {
  Employee: {
    Id: null,
    Name: null,
  },
  FormData: '',
  ToData: '',
};

const CallReportScreen = ({user, authData}) => {
  const navigation = useNavigation();
  const [reportType, setReportType] = useState(1);
  const [isVisable, setIsvisable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [selectFilter, setselectFilter] = useState(FiterList);
  const [ApiReportData, setApiReportData] = useState(null);
  const [ApiEmpData, setApiEmpData] = useState(null);
  const [EmployaList, setEmployaList] = useState(null);

  useEffect(() => {
    getLeadTypeData();
  }, []);

  useEffect(() => {
    getAPIData();
  }, [selectFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAPIData();
    getLeadTypeData();
  }, []);

  const getLeadTypeData = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.lead_types,
      authData.sessionId,
      navigation,
      res => {
        if (res?.status) {
          setEmployaList(res?.data?.data?.agents || null);
        } else {
          //showToast('Something went wrong');
        }
      },
    );
  };

  const getAPIData = () => {
    const body = {
      userId: selectFilter?.Employee?.Id || user?.id,
      startDate: selectFilter?.FormData
        ? selectFilter?.FormData?.toISOString().split('T')[0]
        : FirstDate?.toISOString()?.split('T')[0],
      endDate: selectFilter?.ToData
        ? selectFilter?.ToData?.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };

    API.postAuthAPI(
      body,
      END_POINT.afterAuth.callReport,
      authData.sessionId,
      navigation,
      res => {
        setRefreshing(false);
        setisLoading(false);
        if (res.status) {
          setApiReportData(res?.data || null);
          setApiEmpData(res?.data?.employeeList || null);
        } else {
          showToast('Something went wrong');
        }
      },
    );
  };

  const graphView = () => {
    return (
      <View
        style={{
          ...styles.viewBox,
          marginTop: 20,
          flexDirection: 'row',
        }}>
        <PieChart
          style={{
            height: 140,
            width: 156,
            shadowColor: 'black',
            elevation: 5,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
          }}
          data={ApiReportData?.graphdata || pieData}
          innerRadius="90%"
          outerRadius="0%"
        />

        <View style={{gap: 10}}>
          {ApiReportData?.graphdata.map((item, index) => {
            return (
              <View
                key={item?.key.toString()}
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: item?.svg?.fill,
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={[
                    styles.legendText,
                    {color: item?.svg?.fill, alignSelf: 'center'},
                  ]}>
                  {`${item?.value || '0'}%`} {item?.title || ''}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderView = () => {
    return (
      <View
        style={{
          ...styles.viewBox,
          gap: 10,
          paddingVertical: 0,
          paddingBottom: 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 0,
            height: 40,
            backgroundColor: COLORS.lightBlue || '#FAFAFA',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'Call Type'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'Calls'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'Duration'}
          </Text>
        </View>
        {ApiReportData?.summary?.callType.map((item, index) => {
          return (
            <View
              style={
                index === ApiReportData?.summary?.callType?.length - 1
                  ? styles.itemStyle
                  : {flexDirection: 'row'}
              }>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                {item?.calltype || ''}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '500',
                  textAlign: 'center',
                  opacity: 0.8,
                }}>
                {item?.calls || '0'}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '500',
                  textAlign: 'center',
                  opacity: 0.8,
                }}>
                {item?.duration || '-- --'}
              </Text>
            </View>
          );
        })}
        {/* <View
          style={{
            flexDirection: 'row',
            paddingVertical: 0,
            height: 40,
            backgroundColor: '#FAFAFA',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'Total'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'241'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}>
            {'01:36:10'}
          </Text>
        </View> */}
      </View>
    );
  };

  const HandleFilterUpdate = res => {
    setselectFilter(res);
    setIsvisable(false);
  };

  const ReportView = () => {
    let hasPositiveValue = false;
    if (ApiReportData?.graphdata) {
      hasPositiveValue = ApiReportData?.graphdata.some(item => item?.value > 0);
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        {ApiReportData?.graphdata?.length > 0 &&
          hasPositiveValue &&
          graphView()}
        {ApiReportData?.summary && renderView()}

        {ApiReportData?.summary?.stats && (
          <View
            style={{
              ...styles.viewBox,
              alignItems: 'flex-start',
              paddingHorizontal: 15,
            }}>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Miss Call'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Connected Call'}
              </Text>
            </View>

            <View style={{flexDirection: 'row', gap: 10}}>
              <View style={{...styles.InputBox, flex: 1}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '600',
                    opacity: 0.7,
                  }}>
                  {ApiReportData?.summary?.stats?.missCall || '0'}
                </Text>
              </View>
              <View style={{...styles.InputBox, flex: 1}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '600',
                    opacity: 0.7,
                  }}>
                  {ApiReportData?.summary?.stats?.connectedCalls || '0'}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Rejected'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Not Connected Call'}
              </Text>
            </View>

            <View style={{flexDirection: 'row', gap: 10}}>
              <View style={{...styles.InputBox, flex: 1}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '600',
                    opacity: 0.7,
                  }}>
                  {ApiReportData?.summary?.stats?.rejected || '0'}
                </Text>
              </View>
              <View style={{...styles.InputBox, flex: 1}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '600',
                    opacity: 0.7,
                  }}>
                  {ApiReportData?.summary?.stats?.notConnectedCall || '0'}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '700',
                flex: 1,
                marginTop: 10,
              }}>
              {'Working Hours'}
            </Text>
            <View style={{...styles.InputBox, width: '100%'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '600',
                  opacity: 0.7,
                }}>
                {ApiReportData?.summary?.stats?.workingHours || '--- ---'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          ...styles.viewBox,
          flexDirection: 'row',
          gap: 5,
          paddingHorizontal: 10,
          alignItems: 'flex-start',
          paddingTop: 6,
          paddingBottom: 10,
        }}>
        <View style={{gap: 2, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 18,
                height: 18,
                // borderWidth: 0.5,
                borderRadius: 10,
                backgroundColor: COLORS.LightGray,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.Black,
                  fontWeight: '500',
                }}>
                {index + 1}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.Black,
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {item?.user || '-- --'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Green,
                fontWeight: '600',
              }}>
              {`( ${item?.employeeId || ''} )`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: 4,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.Black,
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {'Number of call : '}
              {item?.highestCalls || '0'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.Black,
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {'Total Duration : '}
              {item?.totalDuration || '0h om os'}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.Black,
                fontWeight: '600',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {'Average Call Duration : '}
              {item?.averageCallDuration || '0h om os'}
            </Text>
          </View>
        </View>
        {/* <Pressable onPress={() => null}>
          <Image
            source={ImagerHanlde.MailIcon}
            style={{width: 15, height: 15}}
            resizeMode="contain"
          />
        </Pressable> */}
      </View>
    );
  };

  const EmployeeListView = () => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          data={ApiEmpData}
          renderItem={renderItem}
          keyExtractor={item => item?.userId?.toString()}
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
        />
      </View>
    );
  };

  return (
    <MainContainer paddingTop={0}>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            width: '100%',
            height: '100%',
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
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          paddingHorizontal: 20,
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
            {'Employee report'}
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
            {'Employee List'}
          </Text>
        </Pressable>
      </View>
      {ApiReportData ? (
        <View style={{flex: 1}}>
          {reportType === 1 && ReportView()}
          {reportType === 2 && EmployeeListView()}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Data found</Text>
          <Pressable onPress={() => onRefresh()}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '500',
                color: COLORS.Blue,
                marginTop: 5,
              }}>
              Refresh
            </Text>
          </Pressable>
        </View>
      )}

      <FloatingButton
        icon={ImagerHanlde?.filterIcon}
        onClick={() => setIsvisable(true)}
      />
      <FilterModel
        isModalVisible={isVisable}
        closeModal={() => setIsvisable(false)}
        data={EmployaList || null}
        Type={reportType}
        user={user}
        onUpdate={res => HandleFilterUpdate(res)}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  legend: {
    marginTop: 0,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewBox: {
    width: '90%',
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
  InputBox: {
    paddingHorizontal: 8,
    marginTop: 5,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: '#F2F2F2',
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
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
  itemStyle: {
    flexDirection: 'row',
    paddingVertical: 0,
    height: 40,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(CallReportScreen);
