/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
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
  RefreshControl,
  NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import { CallLogPermission } from '../../../utils/Permissions';
import { ImagerHanlde } from '../../../utils/ImageProvider';
import { COLORS } from '../../../styles/themes';
import FloatingButton from '../../../components/FloatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonContainer } from '../../../components/ButtonContainer';
import { SimSlectionModel } from '../../../components/SimSlectionModel';

const { CallLogModule } = NativeModules;

const CallTypesList = ['ALL CALLS', 'INCOMING', 'OUTGOING', 'MISSED'];
const SimSlotsList = ['SIM 1', 'SIM 2'];

const CallHistory = ({ user, authData }) => {
  const Limit = 50;
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [callType, setCallType] = useState('ALL CALLS');
  const [offset, setOffset] = useState(Limit);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [simSlot, setSimSlot] = useState("");
  const [isModelVisable, setIsModelVisable] = useState(false);

  useEffect(() => {
    CallLogPermission(res => {
      if (res.status) {
        getCallLogs();
        // if (simSlot !== "") {
        //   getCallLogs();
        // } else {
        //   getSimType();
        // }
      }
    });
  }, [offset, callType, simSlot]);


  const handleFloating = () => {
    CallLogPermission(res => {
      if (res?.status) {
        setIsModelVisable(true);
      }
    });

  }

  const getSimType = async () => {
    const simType =
      await AsyncStorage.getItem('SimSlots') || null;
    if (simType) {
      setIsModelVisable(false);
      setSimSlot(simType);
    } else {
      setIsModelVisable(true);
    }
  }

  // useEffect(() => {
  //   filterLogsByType(callType);
  // }, [callType]);

  const getCallLogs = async () => {
    if (loading || !hasMore) return; // Prevent making requests if already loading or no more logs
    setLoading(true);
    try {
      const logs = await CallLogModule.getCallLogs(callType, "simSlot", offset);
      if (logs.length < offset) {
        setHasMore(false); // No more logs to load
        setRefreshing(false);

      } else {
        setRefreshing(false);
        setCallLogs(logs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const filterLogsByType = type => {
    getCallLogs()
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    let ItemIcon = ImagerHanlde.MenuNav.call;
    let itemColor = COLORS.Black;

    switch (item.type) {
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
        <Image source={ItemIcon} style={{ width: 20, height: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: itemColor }}>
            {item?.name ? item?.name.slice(0, 15) : 'Unknown'}
            {item?.name && item?.name?.length > 15 && '...'}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.Black,
                fontWeight: '400',
                opacity: 0.8,
                marginTop: 2,
                flex: 1,
              }}>
              {item?.phoneNumber}
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
              {item?.duration}s
            </Text>
          </View>
          <Text style={{
            fontSize: 10,
            color: COLORS.Black,
            fontWeight: '400',
            opacity: 0.8,
          }}>{item?.simSlot || ""}</Text>
        </View>
        <Text style={{ fontSize: 11, color: COLORS.Black }}>
          {item?.timestamp
            ? new Date(Number(item?.timestamp)).toLocaleString()
            : '-- --'}
        </Text>

      </View>
    );
  };

  const HandleSelectType = type => {
    setCallLogs([]);
    setFilteredLogs([]);
    setOffset(Limit);
    setHasMore(true);
    setCallType(type);
  };

  const renderFilterButtons = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        backgroundColor: COLORS.White,
        borderBottomColor: COLORS.LightGray,
        borderBottomWidth: 0.2,
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}>
        {CallTypesList.map(type => (
          <View key={type} style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => HandleSelectType(type)}
              style={{ paddingHorizontal: 10, borderRadius: 5 }}>
              <Text
                style={{
                  color: callType === type ? COLORS.Blue : COLORS.Black,
                  fontSize: 14,
                  fontWeight: callType === type ? '600' : '500',
                }}>
                {type}
              </Text>
            </TouchableOpacity>
            {callType === type && (
              <View
                style={{
                  backgroundColor: COLORS.Blue,
                  width: '100%',
                  height: 2,
                  marginTop: 5,
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const loadMoreLogs = () => {
    if (!loading && hasMore) {
      setOffset(prevOffset => prevOffset + Limit);
    }
  };

  const refreshLogs = () => {
    setCallLogs([]);
    setFilteredLogs([]);
    setOffset(Limit);
    //setHasMore(true);
    //setRefreshing(true)
  };

  const onRefresh = useCallback(() => {
    setOffset(Limit);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);

  }, []);

  const FooterComponent = () => {
    if (!loading || !hasMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading more logs...</Text>
      </View>
    );
  };

  const handleModelSelection = async (res) => {
    if (res !== '') {
      setSimSlot(res);
      setIsModelVisable(false);
      await AsyncStorage.setItem(
        'SimSlots',
        res,
      );
    }
  }




  return (
    <MainContainer
      screenType={3}
      HaderName={'Call History'}
      BackHandleName={'Back'}>
      {renderFilterButtons()}

      {isModelVisable && (
        <SimSlectionModel onModelHandle={handleModelSelection} onSelectItem={simSlot} />
      )}

      <FlatList
        data={callLogs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreLogs}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshing={loading}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // onRefresh={refreshLogs}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={FooterComponent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No call logs found</Text>
            </View>
          ) : null
        }
      />
      {/* <FloatingButton
        bottom={20}
        icon={simSlot === '' ? ImagerHanlde.CallIcon.noSim_icon : simSlot === "SIM 1" ? ImagerHanlde.CallIcon.sim1_icon : ImagerHanlde.CallIcon.sim2_icon}
        tintColor={simSlot === '' ? COLORS.Black : COLORS.Blue}
        onClick={() => handleFloating()}
      /> */}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  logItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    shadowColor: COLORS.Black,
    shadowOffset: { width: 0, height: 2 },
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

export default connect(mapStateToProps, React.memo)(CallHistory);
