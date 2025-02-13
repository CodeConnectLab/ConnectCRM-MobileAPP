import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native';
import { COLORS } from '../../../styles/themes';
import { END_POINT } from '../../../API/UrlProvider';
import { Agenda } from "react-native-calendars";
import { API } from '../../../API';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../../components/showToast';
import { ScreenIdentifiers } from '../../../routes';

const CalendarScreen = ({ user, authData }) => {
    const navigation = useNavigation();
    const [items, setItems] = useState({}); // Agenda items state
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        getApiData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getApiData();
    }, []);

    const getApiData = () => {
        API.getAuthAPI(END_POINT.afterAuth.calendar, authData.sessionId, navigation, (res) => {
            setisLoading(false);
            setRefreshing(false);
            if (res?.status) {
                const ApiData = res?.data?.data || [];
                if (ApiData?.length > 0) {
                    const formattedData = {};
                    ApiData.forEach((item) => {
                        const date = item?.followUpDate.split("T")[0];
                        if (!formattedData[date]) {
                            formattedData[date] = [];
                        }
                        formattedData[date].push({
                            id: item?._id || "",
                            name: item?.firstName || "N/A",
                            comment: item?.comment || "No comment",
                            agent: item?.assignedAgent?.name || "Unassigned",
                            time: new Date(item?.followUpDate).toLocaleTimeString(),
                        });
                    });
                    setItems(formattedData);
                } else {
                    setItems({});
                }
            } else {
                showToast("Failed to fetch calendar data");
                setItems({});
            }
        });
    };

    const onItemHandle = (item) => {
        navigation.navigate(ScreenIdentifiers.LeadsDetailsScreen, {
            leadId: item?.id,
            screenName: "lead",
        });
    };

    const renderItem = (item) => (
        <Pressable
            onPress={() => onItemHandle(item)}
            style={styles.item}>
            <Text style={styles.name}>Name: {item?.name}</Text>
            <Text style={styles.comment}>Comment: {item?.comment}</Text>
            <Text style={styles.agent}>Agent: {item?.agent}</Text>
            <Text style={styles.time}>Time: {item?.time}</Text>
        </Pressable>
    );

    return (
        <MainContainer
            HaderName="Follow Up Calendar"
            screenType={3}
            backgroundColor={COLORS.White}
        >
            {isLoading && (
                <View
                    style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        flex: 1,
                        height: '130%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1,
                    }}>
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        style={{ alignSelf: 'center' }}
                    />
                </View>
            )}
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    height: "100%",
                    backgroundColor: COLORS.lightWhite,
                }}>
                <Agenda
                    items={items}
                    renderItem={renderItem}
                    showClosingKnob={true}
                    theme={{
                        agendaTodayColor: "#00adf5",
                        agendaKnobColor: "#00adf5",
                    }}
                    renderEmptyData={() => (
                        <View style={styles?.empty}>
                            <Text>No items for this day</Text>
                        </View>
                    )}
                />
            </View>
        </MainContainer>
    );
};


const styles = StyleSheet.create({
    item: {
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    comment: {
        color: "#555",
    },
    agent: {
        fontStyle: "italic",
        marginTop: 5,
    },
    time: {
        color: "#00adf5",
        marginTop: 5,
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 100,
    },
});

// Map Redux state to props
const mapStateToProps = (state) => ({
    user: state.userReducer,
    authData: state.AuthReducer,
});

// Wrap the component with connect and React.memo
export default connect(mapStateToProps)(React.memo(CalendarScreen));
