/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Platform,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {ScreenIdentifiers, Screens} from '../routes';
import {COLORS, AppThemes} from '../styles/themes';
import {ImagerHanlde} from '../utils/ImageProvider';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import {useNavigation} from '@react-navigation/native';
import {API} from '../API';
import {END_POINT} from '../API/UrlProvider';
import {dispatchAddUser} from '../redux/actionDispatchers/user-dispatchers';
import {SimSlectionModel} from '../components/SimSlectionModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CallLogPermission} from '../utils/Permissions';
import {ButtonContainer} from '../components/ButtonContainer';
import UpdateModel from '../components/UpdateModel';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

const TabBarIcon = ({icon, label, focused}) => (
  <View style={[styles.iconContainer]}>
    <Image
      resizeMode="contain"
      style={[
        styles.icon,
        {
          tintColor: focused
            ? AppThemes.bottomNavActive
            : AppThemes.bottomNavInactive,
        },
      ]}
      source={icon}
    />
    {focused && (
      <Text style={styles.label} ellipsizeMode="tail" numberOfLines={1}>
        {label}
      </Text>
    )}
  </View>
);

const Dashboard = ({user, authData, apiData}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModelVisable, setIsModelVisable] = useState(false);
  const [simSlot, setSimSlot] = useState('');
  // Use useRef to persist Animated.Value across re-renders
  const sidebarAnimation = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const navigation = useNavigation();

  useEffect(() => {
    getAPIDate();
    CallLogPermission(res => {
      if (res?.status) {
        getSimType();
      }
    });
  }, []);

  const getSimType = async () => {
    const simType = (await AsyncStorage.getItem('SimSlots')) || null;
    if (simType) {
      setIsModelVisable(false);
      setSimSlot(simType);
    } else {
      setIsModelVisable(true);
    }
  };

  const handleModelSelection = async res => {
    if (res !== '') {
      setSimSlot(res);
      setIsModelVisable(false);
      await AsyncStorage.setItem('SimSlots', res);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAPIDate();
  }, []);

  const getAPIDate = async () => {
    await API.getAuthAPI(
      END_POINT.afterAuth.profile,
      authData.sessionId,
      navigation,
      res => {
        setRefreshing(false);
        if (res?.status) {
          const AddData = {
            ...user,
            id: res?.data?.data?._id || null,
            name: res?.data?.data?.name || null,
            mobile: res?.data?.data?.phone || null,
            email: res?.data?.data?.email || null,
            image: res?.data?.data?.profilePic || null,
            loginType: res?.data?.data?.role || null,
            bio: res?.data?.data?.bio || null,
          };
          dispatchAddUser(AddData);
        }
      },
    );
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? -SCREEN_WIDTH : 0; // Show or hide sidebar
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarVisible(!isSidebarVisible);
  };

  const BottomList = [
    {
      name: ScreenIdentifiers.Home,
      screen: Screens.Home,
      icon: ImagerHanlde.BottomNav.home,
      headerShown: true,
    },
    {
      name: ScreenIdentifiers.AllLeadsScreen,
      screen: Screens.AllLeadsScreen,
      icon: ImagerHanlde.MenuNav.clients,
      headerShown: true,
    },
    {
      name: ScreenIdentifiers.FollowupScreen,
      screen: Screens.FollowupScreen,
      icon: ImagerHanlde.MenuNav.layers,
      headerShown: true,
    },
    {
      name: ScreenIdentifiers.Outsourcedlead,
      screen: Screens.Outsourcedlead,
      icon: ImagerHanlde.listIcon,
      headerShown: true,
    },
    // {
    //   name: ScreenIdentifiers.CallReportScreen,
    //   screen: Screens.CallReportScreen,
    //   icon: ImagerHanlde.BottomNav.bar_chart,
    //   headerShown: true,
    // },
  ];

  const HederHandle = ({title = ''}) => (
    <DashboardHeader
      title={title}
      onMenuPress={toggleSidebar} // Pass toggle function
    />
  );

  const MenuHandle = res => {
    toggleSidebar();
    navigation.navigate(res);
  };

  // PanResponder for swipe detection
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger when horizontal movement is significant
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        // Detect swipe direction (negative dx means right to left)
        if (gestureState.dx < -50 && isSidebarVisible) {
          toggleSidebar(); // Close sidebar on swipe left
        }
      },
    }),
  ).current;

  return (
    <>
      {/* Sidebar */}
      {/* {isModelVisable && (
        <SimSlectionModel onModelHandle={handleModelSelection} onSelectItem={simSlot} />
      )} */}

      <Animated.View
        style={[
          styles.sidebarContainer,
          {transform: [{translateX: sidebarAnimation}]},
        ]}
        {...panResponder.panHandlers}>
        {/* Sidebar Content */}
        <Sidebar
          user={user}
          navigation={navigation}
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
          onClose={() => toggleSidebar()}
          onUpdate={res => MenuHandle(res)}
        />
      </Animated.View>

      {/* Overlay (click to close sidebar) */}
      {isSidebarVisible && (
        <Pressable style={styles.overlay} onPress={toggleSidebar} />
      )}

      {/* Bottom Tab Navigator */}
      <Tab.Navigator
        initialRouteName={ScreenIdentifiers.Home}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: AppThemes.bottomNavActive,
          tabBarInactiveTintColor: AppThemes.bottomNavInactive,
          tabBarStyle: styles.tabBarStyle,
        }}>
        {BottomList.map(({name, screen, icon, headerShown}) => (
          <Tab.Screen
            key={name}
            name={name}
            component={screen}
            options={{
              headerShown: headerShown,
              header: () => <HederHandle title={name} />,
              tabBarIcon: ({focused}) => (
                <TabBarIcon icon={icon} label={name} focused={focused} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    width: 100,
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: AppThemes.bottomNavActive,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: COLORS.lightWhite,
    shadowColor: COLORS.Black,
    shadowOffset: {width: 0, height: 2},
    zIndex: 2,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sidebarItem: {
    fontSize: 16,
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    height: '120%',
    flex: 1,
  },
});

const mapStateToProps = state => ({
  user: state.userReducer,
  authData: state.AuthReducer,
  apiData: state.ApiReducer,
});

export default connect(mapStateToProps)(React.memo(Dashboard));
