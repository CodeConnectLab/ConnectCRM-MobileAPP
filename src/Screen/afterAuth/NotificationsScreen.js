import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../components/MainContainer';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { COLORS } from '../../styles/themes';
import { API } from '../../API';
import { END_POINT } from '../../API/UrlProvider';
import { dispatchAddAPI } from '../../redux/actionDispatchers/Api-dispatchers';
import { formatCreatedAt } from '../../utils';

const NotificationsScreen = ({ user, authData, apiData, route }) => {
  const [NotificationData, setNotificationData] = useState(apiData?.Notification || null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (apiData?.Notification?.status) {
      updateStatus();
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotification();
  }, []);

  const updateStatus = async () => {
    if (NotificationData?.data) {
      const body = extractNotificationIds(NotificationData?.data);
      if (body?.notificationIds) {
        await API.putAuthAPI(body, END_POINT.afterAuth.seenUpdate, authData.sessionId, null, (res) => {
          if (res?.status) {
            const data = {
              ...apiData,
              Notification: {
                status: false,
                data: NotificationData?.data || []
              }
            }
            dispatchAddAPI(data);
          }
        });
      }

    }
  };

  const extractNotificationIds = (data) => {
    const notificationIds = data
      .filter((item) => item.seenStatus === false)
      .map((item) => item._id);

    return { notificationIds };
  };

  const getNotification = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.getNotification,
      authData.sessionId,
      null,
      async (res) => {
        setRefreshing(false);
        if (res.status) {
          const result = hasUnseenNotifications(res?.data?.data);
          const data = {
            ...apiData,
            Notification: {
              status: result || false,
              data: res?.data?.data || []
            }
          }
          setNotificationData(data?.Notification);
          await dispatchAddAPI(data);
        }
      }
    );

  };

  const hasUnseenNotifications = (data) => {
    return data.some((item) => item.seenStatus === false);
  };

  const renderItem = ({ item, index }) => {
    //console.log(item)
    return (
      <View style={{ ...styles.viewBox, gap: 0 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.LightGray, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, color: COLORS.Black, textAlign: 'center', alignItems: "center" }}>{index + 1}</Text>
          </View>

          <Text style={{ fontSize: 16, color: NotificationData?.status ? COLORS.Blue : COLORS.Black, fontWeight: '600', flex: 1 }}>{item?.titleTemplate || ""}</Text>
          <Text style={{ fontSize: 12, color: COLORS.Black, fontWeight: '400', }}>{item?.createdAt ? formatCreatedAt(item?.createdAt) : ""}</Text>
        </View>
        <Text style={{ fontSize: 10, color: COLORS.Black, fontWeight: '400', flex: 1, marginLeft: 30 }}>{item?.bodyTemplate || ""}</Text>

      </View>
    )
  }

  return (
    <MainContainer
      HaderName={'Notifications'}
      screenType={3}
      backgroundColor={COLORS.White}>
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}>
        <FlatList
          data={NotificationData?.data || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index?.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No notification data found</Text>
              </View>
            )
          }
        />
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
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
  viewBox: {
    paddingVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D9F0FA',
    backgroundColor: COLORS.White,
    borderRadius: 10,
    marginVertical: 4,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
  apiData: state.ApiReducer,
});

export default connect(mapStateToProps, React.memo)(NotificationsScreen);
