import { View, StyleSheet, Platform, Dimensions, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Pressable } from "react-native"
import { COLORS, AppThemes } from '../styles/themes';
import { useState } from "react";
import { ImagerHanlde } from "../utils/ImageProvider";
import { ScreenIdentifiers } from "../routes";
import { navigate } from "../routes/RootNavigation";
import { VersionView } from "../utils";
const SCREEN_WIDTH = Dimensions.get('window').width;


const Sidebar = ({ user, onClose, onUpdate, refreshing = false, onRefresh, navigation }) => {
    const MenuList = [
        {
            id: 1,
            title: 'Dashboard',
            subTitle: 'All Your Data in One Place',
            icon: ImagerHanlde.BottomNav.home,
            ScreenName: ScreenIdentifiers.Home,
            IsVisable: false,
            sublist: null
        },
        {
            id: 2,
            title: "Lead's",
            subTitle: 'Connecting You to Quality Opportunities Worldwide',
            icon: ImagerHanlde.BottomNav.leadGeneration,
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
                    icon: ImagerHanlde.MenuNav.clients,
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
                    icon: ImagerHanlde.BottomNav.imported_lead,
                    type: "Menu"
                },
                {
                    id: 4,
                    title: "Out Sourced",
                    ScreenName: ScreenIdentifiers.Outsourcedlead,
                    icon: ImagerHanlde.listIcon,
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
            title: 'Calendar',
            subTitle: 'Never Miss an Important Follow-Up',
            icon: ImagerHanlde.scheduleIcon,
            ScreenName: ScreenIdentifiers.CalendarScreen,
            IsVisable: false,
            sublist: null
        },
        {
            id: 5,
            title: 'Call History',
            subTitle: 'Track and Review Your Communication Records',
            icon: ImagerHanlde.MenuNav.call,
            ScreenName: ScreenIdentifiers.CallHistory,
            IsVisable: false,
            sublist: null
        },
        {
            id: 6,
            title: 'Setting',
            subTitle: 'Customize Your Preferences and Manage Your Options',
            icon: ImagerHanlde.MenuNav.settings,
            ScreenName: ScreenIdentifiers.Settings,
            IsVisable: false,
            sublist: [
                {
                    id: 1,
                    title: "Company Details",
                    icon: ImagerHanlde.setting.company_details,
                    ScreenName: ScreenIdentifiers.CompanyDetails,
                    type: "Menu"
                },
                {
                    id: 2,
                    title: "Department",
                    icon: ImagerHanlde.setting.department_icon,
                    ScreenName: ScreenIdentifiers.DepartmentScreen,
                    type: "Menu"
                },
                {
                    id: 3,
                    title: "Product & Service",
                    icon: ImagerHanlde.meetingIcon,
                    ScreenName: ScreenIdentifiers.ProductService,
                    type: "Menu"
                },
                {
                    id: 4,
                    title: "Logout",
                    icon: ImagerHanlde.MenuNav.exit,
                    ScreenName: ScreenIdentifiers.LogoutScreen,
                    type: "Menu"
                },
            ]
        },
    ];
    const [menuData, setMenuData] = useState(MenuList);

    const userProfile = () => {
        return (
            <Pressable
                onPress={() => navigate(ScreenIdentifiers.UserDetails)}
                style={{
                    marginHorizontal: 0,
                    borderRadius: 10,
                    marginTop: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    gap: 10, alignItems: "center"
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
                    </Text>

                    <Text style={styles.userCompany}>
                        {'CPID: '}
                        {user?.companyData?.code || '-- --'}
                    </Text>
                </View>
                <Image source={ImagerHanlde.backIcon} resizeMode="contain" style={{ ...styles.menuItemButtonIcon }} />
            </Pressable>
        );
    };

    const renderMenuItem = (item, index) => {
        const itemHandle = (res) => {
            if (res?.sublist) {
                const updatedMenuData = menuData.map((item) =>
                    item?.id === res?.id ? { ...item, IsVisable: !item.IsVisable } : item
                );
                setMenuData(updatedMenuData);
            } else if (res?.ScreenName === ScreenIdentifiers.Home) {
                onClose();
                navigation.navigate(ScreenIdentifiers.Dashboard, {
                    screen: res?.ScreenName,
                    params: null
                });
            }
            else {
                onClose();
                navigate(res?.ScreenName)
            }
        };

        const subItemHandle = res => {
            onClose();
            const updatedMenuData = menuData.map((mapItem) =>
                item?.sublist !== null ? { ...mapItem, IsVisable: !item.IsVisable } : mapItem
            );
            setMenuData(updatedMenuData);
            if (res?.type === "Home") {
                navigation.navigate(ScreenIdentifiers.Dashboard, {
                    screen: res?.ScreenName,
                    params: null
                });

            } else {
                navigate(res?.ScreenName)
            }
        }

        return (
            <View style={{ gap: 5 }}>
                <Pressable
                    onPress={() => itemHandle(item)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 5 }}>
                    {item?.icon && (
                        <Image
                            source={item?.icon}
                            resizeMode="contain"
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: item?.IsVisable ? COLORS.Blue : COLORS.Black,
                            }}
                        />
                    )}
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.sidebarItem, color: item?.IsVisable ? COLORS.Blue : COLORS.Black, }}>{item?.title || ""}</Text>
                        <Text style={{ fontSize: 10, color: COLORS.Black, opacity: 0.8 }}>{item?.subTitle || ""}</Text>

                    </View>


                    {
                        item?.sublist && <Image
                            source={item?.IsVisable ? ImagerHanlde.downArrow : ImagerHanlde.backIcon}
                            resizeMode="contain"
                            style={{
                                ...styles.menuItemButtonIcon, width: item?.IsVisable ? 16 : 20, height: item?.IsVisable ? 16 : 20,
                                marginRight: 5,
                                tintColor: item?.IsVisable ? COLORS.Blue : COLORS.Black,
                                transform: [{ scaleY: item?.IsVisable ? -1 : 1 }, { scaleX: -1 }],
                            }}
                        />
                    }

                </Pressable>
                {item?.IsVisable && item?.sublist !== null && item?.sublist.map((subItem, subIndex) => {
                    return (
                        <Pressable onPress={() => subItemHandle(subItem)}
                            style={{ width: '95%', alignSelf: "flex-end", flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                            {subItem?.icon && (
                                <Image
                                    source={subItem?.icon}
                                    resizeMode="contain"
                                    style={{
                                        width: 18,
                                        height: 18,
                                        tintColor: COLORS.Black 
                                    }}
                                />
                            )}
                            <Text style={{ ...styles.sidebarItem, flex: 1, opacity: 0.7, fontSize: 14 }}>{subItem?.title || ""}</Text>
                        </Pressable>
                    )
                })}
            </View>

        )
    };

    return (
        <View style={styles.sidebarContent}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: COLORS.lightWhite
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {userProfile()}
                <View style={{ gap: 10, marginTop: 10 }}>
                    {menuData.map(renderMenuItem)}
                </View>

            </ScrollView>
            {VersionView()}

        </View>
    )
}


const styles = StyleSheet.create({
    sidebarContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.8,
        backgroundColor: COLORS.White,
        zIndex: 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 20,
    },
    sidebarContent: {
        flex: 1,
        backgroundColor: COLORS.lightWhite
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sidebarItem: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 0,
        color: COLORS.Black
    },
    imageWrapper: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 40,
        borderColor: COLORS.Blue,
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
        color: COLORS.Blue,
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
});
export default Sidebar;