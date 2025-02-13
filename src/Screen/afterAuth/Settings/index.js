import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {FlatList, View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {ScreenIdentifiers} from '../../../routes';
import {ImagerHanlde} from '../../../utils/ImageProvider';
import {navigate} from '../../../routes/RootNavigation';

const Settings = ({user, authData}) => {
  const SettingList = [
    {
      id: 1,
      title: 'Company Details',
      img: ImagerHanlde.setting.company_details,
      screen: ScreenIdentifiers.CompanyDetails,
    },
    {
      id: 2,
      title: 'Department',
      img: ImagerHanlde.setting.department_icon,
      screen: ScreenIdentifiers.DepartmentScreen,
    },
    {
      id: 3,
      title: 'Product & Service',
      img: ImagerHanlde.meetingIcon,
      screen: ScreenIdentifiers.ProductService,
    },
    // {
    //   id: 4,
    //   title: 'Subscription',
    //   img: ImagerHanlde.setting.subscription_icon,
    //   screen: null,
    // },
    {
      id: 5,
      title: 'Logout',
      img: ImagerHanlde.MenuNav.exit,
      screen: ScreenIdentifiers.LogoutScreen,
    },
  ];

  const renderItem = ({item, index}) => {
    const ItemClickHandle = itemList => {
      if (itemList.screen) {
        navigate(itemList.screen, {type: itemList.title});
      } else {
        // showToast('Work in progress', 'Coming Soon', 'OK');
      }
    };

    return (
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          <Image
            source={item.img}
            resizeMode="contain"
            style={styles.menuItemImage}
          />
          <Text style={styles.menuItemTitle}>{item?.title}</Text>
          <Pressable
            onPress={() => ItemClickHandle(item)}
            style={styles.menuItemButton}>
            <Image
              source={ImagerHanlde.backIcon}
              resizeMode="contain"
              style={styles.menuItemButtonIcon}
            />
          </Pressable>
        </View>
        {index !== SettingList.length - 1 && (
          <View style={styles.menuItemDivider} />
        )}
      </View>
    );
  };
  return (
    <MainContainer
      HaderName={'Setting'}
      screenType={3}
      backgroundColor={COLORS.White}>
      <FlatList
        data={SettingList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    alignItems: 'center',
    gap: 20,
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
    marginHorizontal: 10,
    justifyContent: 'center',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21.94,
    color: COLORS.Black,
  },
  menuItemSubTitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14.63,
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
    transform: [{scaleX: -1}],
  },
  menuItemDivider: {
    width: '99%',
    height: 1,
    backgroundColor: '#D2D6D6',
  },
  flatList: {
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    alignSelf: 'center',
    width: '95%',
  },
  flatListContent: {
    gap: 20,
    padding: 20,
  },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(Settings);
