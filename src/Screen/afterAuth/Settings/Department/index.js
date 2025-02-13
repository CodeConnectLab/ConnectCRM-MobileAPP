/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../../../components/MainContainer';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Pressable,
} from 'react-native';
import { COLORS } from '../../../../styles/themes';
import { API } from '../../../../API';
import { END_POINT } from '../../../../API/UrlProvider';
import { ImagerHanlde } from '../../../../utils/ImageProvider';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import { navigate } from '../../../../routes/RootNavigation';
import { ScreenIdentifiers } from '../../../../routes';

const DepartmentScreen = ({ user, authData }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);


  const toggleSwitch = dataItem => {
    const body = {
      isActive: !dataItem?.isActive
    }
    API.putAuthAPI(body,
      END_POINT.afterAuth.updateDepartment + dataItem?._id,
      authData?.sessionId,
      null, res => {
        if (res?.status) {
          setDepartmentList(prevList =>
            prevList.map(item =>
              item?._id === dataItem?._id
                ? { ...item, isActive: !item.isActive } // Toggle the specific item
                : item,
            ),
          );
        }
      })

  };

  useEffect(() => {
    getAPICall();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAPICall();
  }, []);

  const getAPICall = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.users,
      authData?.sessionId,
      null,
      res => {
        setLoading(false);
        setRefreshing(false);
        if (res.status) {
          setDepartmentList(res?.data?.data);
        }
      },
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => navigate(ScreenIdentifiers.DepartmentDetails, { item })}
        style={{ ...styles.viewBox, flexDirection: 'row' }}>
        <View style={{ flex: 1, gap: 5 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
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
              }}>{`${item?.name || ''}`}</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: COLORS.Blue,
                flex: 1,
              }}>
              {item?.role ? `(${item?.role})` : ''}
            </Text>
            <TouchableOpacity
              style={[
                styles.switch,
                item?.isActive ? styles.active : styles.inactive,
              ]}
              onPress={() => toggleSwitch(item)} // Pass item ID
            >
              <Animated.View
                style={[
                  styles.circle,
                  {
                    transform: [
                      { translateX: item?.isActive ? 24 : 0 }, // Update position dynamically
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              marginTop: 0,
            }}>
            {item?.phone && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Image
                  source={ImagerHanlde.MenuNav.call}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>{item?.phone || ''}</Text>
              </View>
            )}

            {item?.email && (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Image
                  source={ImagerHanlde?.MailIcon}
                  resizeMode="contain"
                  style={styles.itemIcon}
                />
                <Text style={styles.itemSubText}>{item?.email || ''}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <MainContainer
      HaderName={'Manage Your Department'}
      screenType={3}
      backgroundColor={COLORS.White}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={departmentList || []}
          renderItem={renderItem}
          keyExtractor={item => item?._id?.toString()}
          style={{
            width: '98%',
            flex: 1,
            alignSelf: 'center',
            backgroundColor: COLORS?.lightWhite,
          }}
          contentContainerStyle={{
            gap: 0,
            paddingBottom: 30,
            paddingTop: 5,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Data found</Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    marginHorizontal: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D9F0FA',
    marginVertical: 2,
    backgroundColor: COLORS.White,
    borderRadius: 10,
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
  switch: {
    width: 50,
    height: 25,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 2,
    backgroundColor: '#ddd',
  },
  active: {
    backgroundColor: '#5750F1',
  },
  inactive: {
    backgroundColor: '#ccc',
  },
  circle: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginTop: '50%',
    alignContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(DepartmentScreen);
