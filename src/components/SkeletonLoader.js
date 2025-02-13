/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import ContentLoader, {
  Rect,
  Circle,
  Instagram,
} from 'react-content-loader/native';
import {COLORS} from '../styles/themes';

const speed = 2;
const backgroundColor = COLORS.simpleLightGray;
const foregroundColor = COLORS.lightWhite;

const SkeletonLoader = ({type = 1}) => {
  return (
    <View
      style={{
        flex: 1,
        width: '95%',
        alignSelf: 'center',
        marginTop: 20,
      }}>
      {type === 1 && <CardLoader />}
    </View>
  );
};

const CardLoader = ({
  width = '100%',
  height = 60,
  itemWidth = '98%',
  itemHight = '55',
  dataLength = 15,
}) => (
  <View style={styles.cardContainer}>
    {Array.from({length: dataLength}).map((_, index) => (
      <ContentLoader
        speed={speed}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        style={styles.cardItem}>
        <Rect
          x="0"
          y="0"
          rx="10"
          ry="10"
          width={itemWidth}
          height={itemHight}
        />
        <Rect x="10" y="15" rx="15" ry="15" width="10%" height="30" />
        <Rect x="60" y="15" rx="4" ry="4" width="50%" height="10" />
        <Rect x="60" y="30" rx="4" ry="4" width="30%" height="10" />
      </ContentLoader>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 0,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  rectItem: {
    marginHorizontal: 5,
  },
  cardContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    // alignSelf: 'center',
    // flexDirection: 'row',
    gap: 10,
  },
  cardItem: {
    marginVertical: 0,
  },
  horizontalItem: {
    marginHorizontal: 10,
  },
  VerticalContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    // flexDirection: "row",
    gap: 10,
  },
  VerticalItem: {
    marginVertical: 0,
  },
  itemContainer: {
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.White,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
});

export default SkeletonLoader;
