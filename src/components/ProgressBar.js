/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProgressBar = ({value, maxValue, progressColor}) => {
  const progress = (value / maxValue) * 100;

  return (
    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={progressColor}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.progressBar, {width: `${progress}%`}]}
        />
      </View>
      <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 8,
    width: '100%',
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  percentageText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#555',
    fontWeight: '600',
  },
});

export default ProgressBar;
