/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import CallLogs from 'react-native-call-log';
import {CallLogPermission} from '../../../utils/Permissions';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {COLORS} from '../../../styles/themes';
import {formatTimestamp} from '../../../utils';
import {navigate} from '../../../routes/RootNavigation';
import {ScreenIdentifiers} from '../../../routes';

const CallDetailsList = ({user, authData, route}) => {
  const Limit = 50;
  const ItemList = route.params?.itemDate || {};
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [offset, setOffset] = useState(Limit);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    CallLogPermission(res => {
      if (res.status) {
        getCallLogs();
      }
    });
  }, [offset]);

  useEffect(() => {
    filterLogsByType();
  }, [callLogs]);

  const getCallLogs = async () => {
    if (loading || !hasMore) return; // Prevent making requests if already loading or no more logs
    setLoading(true);

    try {
      const logs = await CallLogs.loadAll();
      setCallLogs(logs);
      // if (logs.length > offset) {
      //   setHasMore(false); // No more logs to load
      // } else {
      //   setCallLogs(prevLogs => {
      //     // Prevent duplicate logs
      //     const newLogs = logs.filter(
      //       log => !prevLogs.some(prev => prev.timestamp === log.timestamp),
      //     );
      //     return [...prevLogs, ...newLogs];
      //   });
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogsByType = type => {
    const filtered = callLogs.filter(
      log => log.phoneNumber === ItemList.phoneNumber,
    );
    setFilteredLogs(filtered);
  };

  const handleCalling = async phoneNumber => {
    //  try {
    //    if (Platform.OS === 'android') {
    //      const granted = await PermissionsAndroid.request(
    //        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    //      );
    //      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //        console.log(`Calling ${phoneNumber}`);
    //        // Implement actual calling logic here
    //      }
    //    }
    //  } catch (error) {
    //    console.error('Error during call initiation:', error);
    //  }
  };

  const renderItem = ({item, index}) => {
    let ItemIcon = ImagerHanlde.MenuNav.call;
    let itemColor = COLORS.Black;

    switch (item.type) {
      case 'MISSED':
        itemColor = COLORS.Red;
        break;
      case 'REJECTED':
        itemColor = COLORS.Red;
        break;
      default:
        itemColor = COLORS.Black;
        break;
    }
    return (
      <View>
        {index === 0 && (
          <View style={styles.headerContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={ImagerHanlde.noImage}
                style={styles.profileImage}
              />
              <View style={{flex: 1}}>
                <Text style={styles.profileName}>
                  {ItemList.name || 'Unknown'}
                </Text>
                <Text style={styles.phoneNumber}>
                  {ItemList.phoneNumber || ''}
                </Text>
              </View>
              <Pressable
                onPress={() => handleCalling(ItemList.phoneNumber)}
                style={styles.callNowButton}>
                <Text style={styles.callNowText}>Call Now</Text>
              </Pressable>
            </View>
            <Text style={styles.callLogsLabel}>Call Logs</Text>
          </View>
        )}

        <View style={styles.logItemContainer}>
          <Image
            source={ImagerHanlde.MenuNav.call}
            style={{width: 20, height: 20, tintColor: itemColor}}
          />
          <Text style={[styles.logType, {color: itemColor}]}>
            {item?.type || ''}
          </Text>
          <Text style={styles.logDuration}>{item?.duration}s</Text>
          <Text style={styles.logTimestamp}>
            {item?.timestamp
              ? new Date(Number(item.timestamp)).toLocaleString()
              : 'Unknown'}
          </Text>
        </View>
      </View>
    );
  };

  const loadMoreLogs = () => {
    if (!loading && hasMore) {
      setOffset(prevOffset => prevOffset + Limit);
    }
  };

  const refreshLogs = () => {
    // setCallLogs([]);
    // setFilteredLogs([]);
    // setOffset(Limit);
    // setHasMore(true);
  };

  const FooterComponent = () => {
    if (!loading || !hasMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading more logs...</Text>
      </View>
    );
  };

  return (
    <MainContainer
      screenType={3}
      HaderName="Call Details"
      BackHandleName={'Back'}>
      <FlatList
        data={filteredLogs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // onEndReached={loadMoreLogs}
        // onEndReachedThreshold={0.5}
        refreshing={loading}
        // onRefresh={refreshLogs}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={FooterComponent}
        // ListEmptyComponent={
        //   !loading ? (
        //     <View style={styles.emptyContainer}>
        //       <Text style={styles.emptyText}>No call logs found</Text>
        //     </View>
        //   ) : null
        // }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.lightWhite,
  },
  listContainer: {
    gap: 0,
    paddingBottom: 50,
    paddingTop: 20,
  },
  headerContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: COLORS.lightWhite,
  },
  profileName: {
    fontSize: 17,
    color: COLORS.Blue,
    fontWeight: '700',
  },
  phoneNumber: {
    fontSize: 12,
    color: COLORS.Black,
    fontWeight: '400',
  },
  callNowButton: {
    height: 30,
    paddingHorizontal: 10,
    backgroundColor: COLORS.Blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
  },
  callNowText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.White,
  },
  callLogsLabel: {
    fontSize: 15,
    color: COLORS.Black,
    fontWeight: '500',
    opacity: 0.5,
  },

  logType: {
    fontSize: 14,
  },
  logDuration: {
    fontSize: 11,
    color: COLORS.Black,
    fontWeight: '400',
    marginTop: 2,
    flex: 1,
    textAlign: 'center',
  },
  logTimestamp: {
    fontSize: 11,
    color: COLORS.Black,
  },
  logItemContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(CallDetailsList);
