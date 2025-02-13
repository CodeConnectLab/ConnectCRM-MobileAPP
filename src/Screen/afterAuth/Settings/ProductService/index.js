/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../../components/MainContainer';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import {COLORS} from '../../../../styles/themes';
import {API} from '../../../../API';
import {END_POINT} from '../../../../API/UrlProvider';
import {ImagerHanlde} from '../../../../utils/ImageProvider';
import {openDialer} from '../../../../utils';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import ProductModel from '../../../../components/ProductModel';
import {showToast} from '../../../../components/showToast';

const ProductService = ({user, authData, route}) => {
  const ParamsDate = route?.params;
  const [Apidata, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAPICall();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAPICall();
  }, []);

  const getAPICall = () => {
    API.getAuthAPI(
      END_POINT.afterAuth.productService,
      authData?.sessionId,
      null,
      res => {
        setRefreshing(false);
        setLoading(false);
        setSelectItem(null);
        if (res?.status) {
          setApiData(res?.data?.data);
        }
      },
    );
  };

  const ProductModelHandle = item => {
    setModalVisible(false);
    setRefreshing(true);
    const body = {
      name: item?.name || '',
      setupFee: parseInt(item?.setupFee || 0) || 0,
      price: parseInt(item?.price || 0) || 0,
    };
    if (item?._id) {
      API.putAuthAPI(
        body,
        END_POINT.afterAuth.productService + '/' + item?._id,
        authData?.sessionId,
        null,
        async res => {
          if (res?.status) {
            await onRefresh();
          } else {
            setModalVisible(true);
            setRefreshing(false);
            showToast('Something went wrong');
          }
        },
      );
    } else {
      API.postAuthAPI(
        body,
        END_POINT.afterAuth.productService,
        authData?.sessionId,
        null,
        async res => {
          if (res?.status) {
            await onRefresh();
          } else {
            setModalVisible(true);
            setRefreshing(false);
            showToast('Something went wrong');
          }
        },
      );
    }
  };

  const itemHandle = res => {
    setSelectItem(res);
    setModalVisible(true);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{...styles.viewBox}}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
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
              style={{color: COLORS.Black, fontSize: 12, fontWeight: '700'}}>
              {index + 1}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.Black,
              flex: 1,
            }}>
            {item?.name || '-- --'}
          </Text>
          <Pressable onPress={() => itemHandle(item)}>
            <Image
              source={ImagerHanlde.EditIcon}
              style={{width: 30, height: 30, tintColor: COLORS.Black}}
              resizeMode="center"
            />
          </Pressable>
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
            {'Setup Fee'}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '500',
              // textAlign: 'center',
            }}>
            {'Price'}
          </Text>
          <Text
            style={{
              flex: 0.5,
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            {'Orders'}
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
            {'Rs. ' + (item?.setupFee || '0')}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '500',
              // textAlign: 'center',
            }}>
            {'Rs. ' + (item?.price || '0')}
          </Text>
          <Text
            style={{
              flex: 0.5,
              fontSize: 14,
              color: COLORS.Black,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            {item?.order || '0'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <MainContainer
      HaderName={'Product & Service'}
      screenType={3}
      backgroundColor={COLORS?.White}
      buttonStatus={true}
      icon={ImagerHanlde.AddIcon}
      iconStyle={{width: 25, height: 25, zIndex: 1, tintColor: COLORS?.Green}}
      onHandleButton={() => itemHandle(null)}>
      <View style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={Apidata || []}
            renderItem={renderItem}
            keyExtractor={item => item?._id?.toString()}
            style={{
              width: '100%',
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
      </View>
      <ProductModel
        isModalVisible={isModalVisible}
        data={selectItem}
        closeModal={() => setModalVisible(false)}
        onUpdate={res => ProductModelHandle(res)}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    alignSelf: 'center',
    width: '95%',
    paddingVertical: 20,
    backgroundColor: COLORS.White,
    borderRadius: 10,
    marginTop: 8,
    padding: 15,
    elevation: 5, // Android box shadow
    shadowColor: 'black', // iOS box shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  Input: {
    fontSize: 16,
    paddingHorizontal: 8,
    marginTop: 5,
    fontWeight: '400',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10.67,
    borderColor: '#F2F2F2',
    backgroundColor: COLORS.lightWhite,
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flexDirection: 'row',
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

export default connect(mapStateToProps, React.memo)(ProductService);
