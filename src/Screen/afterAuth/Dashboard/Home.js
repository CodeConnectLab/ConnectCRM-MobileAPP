/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import {COLORS} from '../../../styles/themes';
import FloatingButton from '../../../components/FloatingButton';
import {ScreenIdentifiers} from '../../../routes';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import ProgressBar from '../../../components/ProgressBar';
// import {LineChart, Grid, YAxis, XAxis} from 'react-native-svg-charts';
import {PieChart} from 'react-native-svg-charts';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import BarChartGraph from '../../../components/BarChartGraph';
import {API} from '../../../API';
import {END_POINT} from '../../../API/UrlProvider';
import {LineChart} from 'react-native-chart-kit';
import {AppVersion, pieData} from '../../../utils/staticData';
import {G} from 'react-native-svg';
import {dispatchAddAPI} from '../../../redux/actionDispatchers/Api-dispatchers';
import {ButtonContainer} from '../../../components/ButtonContainer';
import UpdateModel from '../../../components/UpdateModel';
const Home = ({user, authData, apiData}) => {
  const navigation = useNavigation();

  const [ApiData, setApiData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [GraphApiDate, setGraphApiDate] = useState(null);

  const [UpdateDetails, setUpdateDetails] = useState({
    status: false,
    details: null,
  });

  const [notificationData, setNotifcationData] = useState({
    status: true,
    data: [],
  });

  useEffect(() => {
    getApiData();
    getNotification();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getApiData();
    getNotification();
  }, []);

  const getNotification = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.getNotification,
      authData.sessionId,
      null,
      async res => {
        if (res.status) {
          const result = hasUnseenNotifications(res?.data?.data);
          const data = {
            ...apiData,
            Notification: {
              status: result || false,
              data: res?.data?.data || [],
            },
          };
          await dispatchAddAPI(data);
        }
      },
    );
  };

  const hasUnseenNotifications = data => {
    return data.some(item => item.seenStatus === false);
  };

  const getApiData = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.dashboard,
      authData.sessionId,
      navigation,
      res => {
        setisLoading(false);
        setRefreshing(false);
        if (res?.status) {
          setApiData(res?.data?.data || null);
          if (res?.data?.data?.leadSourceMetricss?.sources) {
            const pieData = res?.data?.data?.leadSourceMetricss?.sources.map(
              (item, index) => ({
                key: index + 1, // Keys start from 1
                value: item?.value || '',
                svg: {fill: item?.color || COLORS?.LightGray},
                title: item?.name || '',
                percentage: item?.percentage || '',
              }),
            );

            const version =
              Platform.OS === 'android'
                ? res?.data?.data?.androidVersion
                : res?.data?.data?.iosversion;

            if (version !== AppVersion?.version) {
              setUpdateDetails({
                status: true,
                details: {
                  version: res?.data?.data?.androidVersion,
                  link: res?.data?.data?.mobileApkDownlodeLink,
                },
              });
            } else {
              setUpdateDetails({
                status: false,
                details: {
                  version: res?.data?.data?.androidVersion,
                  link: res?.data?.data?.mobileApkDownlodeLink,
                },
              });
            }
            setGraphApiDate(pieData);
          }
        }
      },
    );
  };

  const CenterText = () => (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.Black,
          opacity: 0.8,
        }}>
        Total
      </Text>
      <Text style={{fontSize: 14, fontWeight: 'bold', color: COLORS.Black}}>
        {ApiData?.leadSourceMetricss?.total || '0'}
      </Text>
    </View>
  );

  const graphCircleView = () => {
    return (
      <View
        style={{
          ...styles.viewBox,
          marginTop: 20,
          alignItems: 'flex-start',
        }}>
        <Text style={{...styles.titleGraph, paddingHorizontal: 20}}>
          Leads Source Overview
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
          <PieChart
            style={{
              height: 140,
              width: 180,
              shadowColor: 'black',
              elevation: 5,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
            }}
            data={GraphApiDate || pieData}
            innerRadius="90%"
            outerRadius="60%">
            {CenterText()}
          </PieChart>

          <View style={{gap: 10}}>
            {GraphApiDate?.map((item, index) => {
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
                    {`${item?.percentage || '0'}%`} {item?.title || ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderItem1 = ({item, index}) => {
    let IconUrl = ImagerHanlde?.MenuNav?.clients;

    switch (item?.deeplink) {
      case 'alllead':
        IconUrl = ImagerHanlde.MenuNav.clients;
        break;
      case 'allFollowupLeads':
        IconUrl = ImagerHanlde.MenuNav.layers;
        break;
      case 'allImportedLeads':
        IconUrl = ImagerHanlde.BottomNav.imported_lead;
        break;
      case 'allOutsourceLeads':
        IconUrl = ImagerHanlde.listIcon;
        break;
    }

    const HandleClick = res => {
      let screenName = ScreenIdentifiers.AllLeadsScreen;

      if (res === 'allImportedLeads') {
        navigation.navigate(ScreenIdentifiers.ImportedLead);
      } else {
        switch (res) {
          case 'alllead':
            screenName = ScreenIdentifiers.AllLeadsScreen;
            break;
          case 'allFollowupLeads':
            screenName = ScreenIdentifiers.FollowupScreen;
            break;
          case 'allOutsourceLeads':
            screenName = ScreenIdentifiers.Outsourcedlead;
            break;
          default:
            screenName = ScreenIdentifiers.Home;
            break;
        }
        navigation.navigate(ScreenIdentifiers.Dashboard, {
          screen: screenName,
        });
      }
    };

    return (
      <Pressable
        onPress={() => HandleClick(item?.deeplink)}
        style={{
          ...styles.viewBox,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingHorizontal: 10,
          marginHorizontal: 5,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: item?.color || COLORS.Green,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={IconUrl}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.White,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.Black,
              fontWeight: '600',
              flex: 1,
            }}>
            {item?.value}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.Black,
              opacity: 0.8,
              fontWeight: '600',
              flex: 1,
            }}>
            {item?.title || '-- --'}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: item?.change
                ? parseInt(item?.change) < 0
                  ? COLORS.Red
                  : COLORS.Green
                : COLORS.Green,
              opacity: 0.8,
              fontWeight: '700',
            }}>
            {item?.change ? `${item?.change}%` : '0.00%'}
          </Text>
          <Image
            source={ImagerHanlde.topArrow}
            resizeMode="contain"
            style={{
              width: 10,
              height: 10,
              transform: [
                {
                  scaleY: item?.change
                    ? parseInt(item?.change) < 0
                      ? -1
                      : 1
                    : -1,
                },
              ],
              tintColor: item?.change
                ? parseInt(item?.change) < 0
                  ? COLORS.Red
                  : COLORS.Green
                : COLORS.Green,
            }}
          />
        </View>
      </Pressable>
    );
  };

  const renderItem2 = ({item, index}) => {
    let IconUrl = ImagerHanlde.meeting_icon;
    switch (index) {
      case 0:
        IconUrl = ImagerHanlde.meeting_icon;
        break;
      case 1:
        IconUrl = ImagerHanlde.meetingIcon;
        break;
      case 2:
        IconUrl = ImagerHanlde.ReScheduleIcon;
        break;
      case 3:
        IconUrl = ImagerHanlde.scheduleIcon;
        break;
      default:
        IconUrl = ImagerHanlde.meeting_icon;
        break;
    }

    const onItemPress = res => {
      navigation.navigate(ScreenIdentifiers.Dashboard, {
        screen: ScreenIdentifiers.AllLeadsScreen,
        params: res,
      });
    };

    return (
      <Pressable
        onPress={() => onItemPress(item)}
        style={{
          ...styles.viewBox,
          width: 100,
          alignItems: 'flex-start',
          gap: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: item?.color || COLORS.Green,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={IconUrl}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: COLORS.White}}
            />
          </View>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.Black,
              fontWeight: '800',
              flex: 1,
              // textAlign: 'center',
            }}>
            {item?.today || '0'}
          </Text>
        </View>

        <Text style={{fontSize: 11, color: COLORS.Black, fontWeight: '600'}}>
          {item?.title || '-- --'}
        </Text>
      </Pressable>
    );
  };

  const renderView = () => {
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            ...styles.titleGraph,
            paddingHorizontal: 5,
            marginBottom: 0,
            marginHorizontal: 10,
            marginTop: 20,
          }}>
          {'Leads report'}
        </Text>
        <FlatList
          data={ApiData?.topMetrics || []}
          renderItem={renderItem1}
          keyExtractor={item => item?.title.toString()}
          style={{width: '98%', alignSelf: 'center'}}
          contentContainerStyle={{
            gap: 0,
            paddingBottom: 5,
            paddingTop: 0,
          }}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />

        <Text
          style={{
            ...styles.titleGraph,
            paddingHorizontal: 5,
            marginBottom: 0,
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          {"Status Lead's report"}
        </Text>
        <FlatList
          data={ApiData?.activityMetrics || []}
          horizontal
          renderItem={renderItem2}
          keyExtractor={(item, index) =>
            item?.title?.toString() || index?.toString()
          }
          style={{width: '100%'}}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 5,
            paddingTop: 0,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderSalesView = () => {
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            ...styles.titleGraph,
            paddingHorizontal: 5,
            marginBottom: 0,
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          {'Sales report'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingHorizontal: 8,
              paddingVertical: 7,
              gap: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor:
                    ApiData?.performanceMetrics?.yearlySales?.color ||
                    COLORS.Blue,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={ImagerHanlde.upSaleIcon}
                  resizeMode="contain"
                  style={{width: 20, height: 20, tintColor: COLORS.White}}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Yearly Sales'}
              </Text>
            </View>
            <Text
              style={{fontSize: 15, color: COLORS.Green, fontWeight: '600'}}>
              {ApiData?.performanceMetrics?.missOpportunity?.currency || ''}
              {ApiData?.performanceMetrics?.yearlySales?.amount || '0'}
              {` ( ${ApiData?.performanceMetrics?.yearlySales?.count || 0} )`}
            </Text>
            <ProgressBar
              value={ApiData?.performanceMetrics?.yearlySales?.percentage || 0} // Current sales value
              maxValue={100} // Max sales target
              progressColor={['#007BFF', '#00D58B']}
            />
          </View>
          <View
            style={{
              ...styles.viewBox,
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingHorizontal: 8,
              paddingVertical: 7,
              gap: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor:
                    ApiData?.performanceMetrics?.monthlySales?.color ||
                    COLORS.Blue,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={ImagerHanlde.saleIcon}
                  resizeMode="contain"
                  style={{width: 20, height: 20, tintColor: COLORS.White}}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.Black,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {'Monthly Sales'}
              </Text>
            </View>
            <Text
              style={{fontSize: 15, color: COLORS.Green, fontWeight: '600'}}>
              {ApiData?.performanceMetrics?.monthlySales?.currency || ''}
              {ApiData?.performanceMetrics?.monthlySales?.amount || '0'}
              {` ( ${ApiData?.performanceMetrics?.monthlySales?.count || 0} )`}
            </Text>
            <ProgressBar
              value={ApiData?.performanceMetrics?.monthlySales?.percentage || 0} // Current sales value
              maxValue={100} // Max sales target
              progressColor={['#007BFF', '#00D58B']}
            />
          </View>
        </View>

        <View
          style={{
            ...styles.viewBox,
            width: '95%',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 7,
            gap: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor:
                  ApiData?.performanceMetrics?.missOpportunity?.color ||
                  COLORS.Blue,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ImagerHanlde.downSaleIcon}
                resizeMode="contain"
                style={{width: 20, height: 20, tintColor: COLORS.White}}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.Black,
                fontWeight: '700',
                flex: 1,
              }}>
              {'Miss Opportunity'}
            </Text>
          </View>
          <Text style={{fontSize: 15, color: COLORS.Red, fontWeight: '600'}}>
            {ApiData?.performanceMetrics?.missOpportunity?.currency || ''}
            {ApiData?.performanceMetrics?.missOpportunity?.amount || '0'}
            {` ( ${ApiData?.performanceMetrics?.missOpportunity?.count || 0} )`}
          </Text>
          <ProgressBar
            value={
              ApiData?.performanceMetrics?.missOpportunity?.percentage || 0
            } // Current sales value
            maxValue={100} // Max sales target
            progressColor={['#0000FF', '#800080', '#D20F40']}
          />
        </View>
      </View>
    );
  };

  const graphView = () => {
    let months = null;
    let receivedAmounts = null;
    let lossAmounts = null;
    let graphDate = ApiData?.paymentOverview?.chartData || null;
    if (graphDate) {
      months = graphDate.map(data => data?.month);
      receivedAmounts = graphDate.map(data => data?.received);
      lossAmounts = graphDate.map(data => data?.loss);
    }

    return ApiData?.paymentOverview?.summary?.receivedLeads &&
      ApiData?.paymentOverview?.summary?.lostLeads ? (
      <View style={{...styles.viewBox, padding: 20}}>
        <Text style={styles.titleGraph}>Payments Overview</Text>
        {ApiData?.paymentOverview?.chartData && (
          <View style={{}}>
            <LineChart
              data={{
                labels: months,
                datasets: [
                  {
                    data: receivedAmounts,
                    color: () => '#34BEF9',
                    strokeWidth: 2,
                  }, // Received Amounts
                  {data: lossAmounts, color: () => '#496CF3', strokeWidth: 2}, // Loss Amounts
                ],
                legend: ['Received Amount', 'Loss Amount'],
              }}
              width={Dimensions.get('window').width - 30} // Adjust width to fit the screen
              height={250}
              chartConfig={{
                backgroundColor: COLORS.White,
                backgroundGradientFrom: COLORS.White,
                backgroundGradientTo: COLORS.White,
                decimalPlaces: 0, // Show integers only
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '0',
                  strokeWidth: '2',
                  stroke: '#ffffff',
                },

                propsForBackgroundLines: {
                  r: '1',
                  strokeWidth: '2',
                  stroke: '#f5f5f5',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 0,
              }}
            />
          </View>
        )}

        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Received Amount</Text>
            <Text style={styles.summaryValue}>
              {ApiData?.paymentOverview?.summary?.receivedLeads || '-- --'}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Loss Amount</Text>
            <Text style={styles.summaryValue}>
              {ApiData?.paymentOverview?.summary?.lostLeads || '-- --'}
            </Text>
          </View>
        </View>
      </View>
    ) : null;
  };

  const EmployeePerformance = () => {
    return (
      <View
        style={{
          // ...styles.viewBox,
          marginTop: 20,
          paddingHorizontal: 10,
          alignItems: 'flex-start',
        }}>
        <Text
          style={{...styles.titleGraph, paddingHorizontal: 5, marginBottom: 0}}>
          Employee Performance
        </Text>
        {ApiData?.employeePerformance?.map((item, index) => {
          return (
            <View
              style={{
                ...styles.viewBox,
                width: '100%',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}
              key={index?.toString()}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: COLORS.LightGray,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.Black,
                      fontSize: 12,
                      fontWeight: '700',
                    }}>
                    {item?.agent ? item?.agent?.slice(0, 1) : '-'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.Black,
                    flex: 1,
                  }}>
                  {item?.agent || '-- --'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  width: '100%',
                  marginTop: 10,
                  paddingHorizontal: 10,
                  backgroundColor: COLORS.lightWhite,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                  }}>
                  {'Assigned leads'}
                </Text>
                <Text
                  style={{
                    flex: 0.7,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    // textAlign: 'center',
                  }}>
                  {'Closed'}
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {'Open'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  width: '100%',
                  marginTop: 5,
                  paddingHorizontal: 10,
                  // backgroundColor: COLORS.lightWhite,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                  }}>
                  {item?.assignedLeads || '0'}
                </Text>
                <Text
                  style={{
                    flex: 0.7,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    // textAlign: 'center',
                  }}>
                  {item?.closed || '0'}
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {item?.open || '0'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  width: '100%',
                  marginTop: 10,
                  paddingHorizontal: 10,
                  backgroundColor: COLORS.lightWhite,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                  }}>
                  {'Conversion'}
                </Text>
                <Text
                  style={{
                    flex: 0.7,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    // textAlign: 'center',
                  }}>
                  {'Revenue'}
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {'Failed'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  width: '100%',
                  marginTop: 5,
                  paddingHorizontal: 10,
                  // backgroundColor: COLORS.lightWhite,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                  }}>
                  {item?.conversion || '0%'}
                </Text>
                <Text
                  style={{
                    flex: 0.6,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    // textAlign: 'center',
                  }}>
                  {`₹${item?.totalRevenue || '0'}` || '--'}
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 14,
                    color: COLORS.Black,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {item?.failed || '0'}
                </Text>
              </View>
            </View>
          );
        })}
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
            width: '100%',
            flex: 1,
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 100}}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        {ApiData ? (
          <View style={{flex: 1, width: '100%'}}>
            {renderView()}
            {renderSalesView()}
            {ApiData?.paymentOverview && graphView()}
            {GraphApiDate && graphCircleView()}
            {ApiData?.employeePerformance && EmployeePerformance()}
            {/* <BarChartGraph /> */}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{'No Data found'}</Text>
            <Text style={{fontSize: 15, color: '#888', fontWeight: '400'}}>
              {'Scroll down and try again.'}
            </Text>
          </View>
        )}
      </ScrollView>
      <FloatingButton
        onClick={() => navigation.navigate(ScreenIdentifiers.AddLeadScreen)}
      />
      <UpdateModel
        isModalVisible={UpdateDetails?.status}
        closeModal={() =>
          setUpdateDetails(prev => ({
            ...prev,
            status: false,
          }))
        }
        data={UpdateDetails}
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
    width: '95%',
    paddingVertical: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 12,
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
    paddingTop: 300,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    justifyContent: 'center',
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

  containerGraph: {
    padding: 20,
    borderRadius: 0,
    margin: 0,
  },
  titleGraph: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.Black,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  summaryBox: {
    alignItems: 'center',
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: 'grey',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  separator: {
    width: 1,
    backgroundColor: 'grey',
    height: 30,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
  apiData: state.ApiReducer,
});

export default connect(mapStateToProps, React.memo)(Home);
