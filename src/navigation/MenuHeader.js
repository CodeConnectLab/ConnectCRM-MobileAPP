/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../components/MainContainer';
import {
  Image,
  View,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { COLORS } from '../styles/themes';
import { ImagerHanlde } from '../utils/ImageProvider';
import { ScreenIdentifiers } from '../routes';
import { navigate } from '../routes/RootNavigation';
import { API } from '../API';
import { END_POINT } from '../API/UrlProvider';
import { dispatchAddUser } from '../redux/actionDispatchers/user-dispatchers';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { VersionView } from '../utils';

const MenuHeader = ({ user, authData }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const MenuList = [
    {
      id: 1,
      title: "Lead's",
      subTitle: 'Connecting You to Quality Opportunities Worldwide',
      icon: ImagerHanlde.BottomNav.add_user,
      ScreenName: ScreenIdentifiers.ImportedLead,
      IsVisable: false,
      sublist: [
        {
          id: 1,
          title: "Add Lead",
          icon: ImagerHanlde.BottomNav.add_user,
          ScreenName: ScreenIdentifiers.AddLeadScreen,
          type: "Menu"
        },
        {
          id: 2,
          title: "All Lead's",
          ScreenName: ScreenIdentifiers.AllLeadsScreen,
          icon: ImagerHanlde.MenuNav.layers,
          type: "Home"
        },
        {
          id: 3,
          title: "Followup's",
          ScreenName: ScreenIdentifiers.FollowupScreen,
          icon: ImagerHanlde.MenuNav.layers,
          type: "Home"
        },
        {
          id: 4,
          title: "Imported Lead's",
          ScreenName: ScreenIdentifiers.ImportedLead,
          icon: ImagerHanlde.MenuNav.layers,
          type: "Menu"
        },
        {
          id: 4,
          title: "Out Sourced",
          ScreenName: ScreenIdentifiers.Outsourcedlead,
          icon: ImagerHanlde.MenuNav.layers,
          type: "Home"
        }
      ]
    },
    {
      id: 3,
      title: 'Analytic Report',
      subTitle: 'Insights That Drive Informed Decisions',
      icon: ImagerHanlde.BottomNav.bar_chart,
      ScreenName: ScreenIdentifiers.AnalyticReportScreen,
      IsVisable: false,
      sublist: null
    },
    {
      id: 4,
      title: 'Call History',
      subTitle: 'Track and Review Your Communication Records',
      icon: ImagerHanlde.MenuNav.call,
      ScreenName: ScreenIdentifiers.CallHistory,
      IsVisable: false,
      sublist: null
    },
    {
      id: 5,
      title: 'Setting',
      subTitle: 'Customize Your Preferences and Manage Your Options',
      icon: ImagerHanlde.MenuNav.settings,
      ScreenName: ScreenIdentifiers.Settings,
      IsVisable: false,
      sublist: null
    },
  ];
  const [menuData, setMenuData] = useState(MenuList);

  useEffect(() => {
    getAPIDate();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAPIDate();
  }, []);

  const getAPIDate = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.profile,
      authData.sessionId,
      navigation,
      res => {
        setRefreshing(false);
        if (res.status) {
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

  const userProfile = () => {
    return (
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          backgroundColor: COLORS.White,
          shadowColor: COLORS.Black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          flexDirection: 'row',
          borderRadius: 10,
          marginTop: 10,
          paddingHorizontal: 20,
          paddingVertical: 15,
          alignItems: 'center',
          gap: 20,
        }}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              user?.image ? { uri: user?.image } : ImagerHanlde.noImage}
            resizeMode="cover"
            style={styles.profileBgImage}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>
            {user?.name || '-- --'}
            <Text style={styles.userLoginType}>
              {user?.loginType ? ' (' + user?.loginType + ')' : '---'}
            </Text>
          </Text>
          <Text style={styles.userCompany}>
            {'CPID: '}
            {user?.userData.code || '-- --'}
          </Text>
          <Pressable
            onPress={() => navigate(ScreenIdentifiers.UserDetails)}
            style={{
              width: 110,
              height: 30,
              borderRadius: 10,
              backgroundColor: COLORS.Blue,
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: COLORS.White,
                fontWeight: '600',
              }}>
              {'View Profile'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderMenuItem = (item, index) => {
    const ItemClickHandle = res => {
      if (res?.sublist) {
        const updatedMenuData = menuData.map((item) =>
          item?.id === res?.id ? { ...item, IsVisable: !item.IsVisable } : item
        );
        setMenuData(updatedMenuData);
      } else {
        
        navigate(res?.ScreenName);
      }

    };

    const subItemHandle = res => {
      if (res?.type === "Menu") {
        navigate(res?.ScreenName);
      } else {
        navigation.navigate(ScreenIdentifiers.Dashboard, {
          screen: res?.ScreenName,
          params: null
        });
      }

    }

    return (
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          {item?.icon && (
            <Image
              source={item?.icon}
              resizeMode="contain"
              style={styles.menuItemImage}
            />
          )}
          <View style={styles.menuItemTextContainer}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubTitle}>{item.subTitle}</Text>
          </View>
          <Pressable
            onPress={() => ItemClickHandle(item)}
            style={styles.menuItemButton}>
            <Image
              source={item?.IsVisable ? ImagerHanlde.downArrow : ImagerHanlde.backIcon}
              resizeMode="contain"
              style={{
                ...styles.menuItemButtonIcon, width: item?.IsVisable ? 18 : 24, height: item?.IsVisable ? 18 : 24
              }}
            />

          </Pressable>
        </View>
        <View style={{
          width: "95%",
          alignSelf: "flex-end"
        }}>
          {
            item?.IsVisable && item?.sublist.map((res, subIndex) => {
              return (
                <Pressable
                  onPress={() => subItemHandle(res)}
                  style={{
                    width: "100%",
                    flexDirection: 'row',
                    paddingVertical: 10, borderBottomWidth: item?.sublist.length - 1 === subIndex ? 0 : 0.5,
                    borderColor: COLORS.LightGray, gap: 10,
                  }}>
                  <Text style={{
                    fontSize: 16, color: COLORS.Black, fontWeight: '600',
                    flex: 1
                  }}>{res?.title}</Text>
                  <Image
                    source={ImagerHanlde.backIcon}
                    resizeMode="contain"
                    style={{ ...styles.menuItemButtonIcon, while: 18, height: 18 }}
                  />
                </Pressable>
              )
            })
          }

        </View>

        {index !== menuData?.length - 1 && (
          <View style={styles.menuItemDivider} />
        )}
      </View>
    );
  };

  return (
    <MainContainer
      screenType={3}
      backgroundColor={COLORS.lightWhite}
      HaderName={'Details'}
      buttonStyle={{
        right: 0,
        position: 'absolute',
        marginRight: 20,
        transform: [{ scaleX: -1 }],
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: COLORS.lightWhite,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {userProfile()}
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: COLORS.White,
            shadowColor: COLORS.Black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderRadius: 10,
            marginTop: 10,
            alignItems: 'center',
            padding: 20,
          }}>
          {menuData.map(renderMenuItem)}
        </View>
      </ScrollView>
      {VersionView()}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 40,
    backgroundColor: 'transparent', // Or use "transparent" if you want
    overflow: 'hidden', // Optional, keeps shadows in bounds
  },
  profileBgImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.Black,
  },
  userCompany: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.Black,
    opacity: 0.7,
  },
  userLoginType: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.Blue,
  },
  flatList: {
    borderRadius: 20,
    backgroundColor: COLORS.White,
    marginVertical: 10,
    marginHorizontal: 10,
    alignSelf: 'center',
    width: '100%',
  },
  flatListContent: {
    gap: 15,
    padding: 20,
  },

  menuItemContainer: {
    alignItems: 'center',
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemImage: {
    width: 24,
    height: 24,
  },
  menuItemTextContainer: {
    marginHorizontal: 10,
    justifyContent: 'center',
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21.94,
    color: COLORS.Black,
  },
  menuItemSubTitle: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14.63,
    color: COLORS.Black,
  },
  menuItemButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D2D6D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemButtonIcon: {
    width: 24,
    height: 24,
    transform: [{ scaleX: -1 }],
  },
  menuItemDivider: {
    width: '99%',
    height: 1,
    backgroundColor: '#D2D6D6',
    marginVertical: 20,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(MenuHeader);
