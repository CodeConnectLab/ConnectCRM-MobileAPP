import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS} from '../styles/themes';

const screenWidth = Dimensions.get('window').width;

const dataThisWeek = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {data: [40, 60, 80, 60, 20, 50, 70], color: () => 'rgba(93, 128, 238, 1)'},
  ],
};

const dataLastWeek = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {data: [30, 50, 70, 50, 15, 40, 60], color: () => 'rgba(93, 128, 238, 1)'},
  ],
};

const filterOptions = [
  {label: 'This Week', value: 'This Week'},
  {label: 'Last Week', value: 'Last Week'},
];

const BarChartGraph = ({}) => {
  const [filter, setFilter] = useState('This Week');
  const currentData = filter === 'This Week' ? dataThisWeek : dataLastWeek;

  return (
    <View style={styles.viewBox}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <Text style={{...styles.title, flex: 1}}>Profit this week</Text>
        <Dropdown
          style={styles.dropdown}
          data={filterOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Filter"
          value={filter}
          onChange={item => setFilter(item.value)}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
        />
      </View>

      <BarChart
        data={{
          labels: currentData.labels,
          datasets: currentData.datasets,
        }}
        width={screenWidth - 40}
        height={220}
        fromZero
        chartConfig={{
          backgroundColor: COLORS.White,
          backgroundGradientFrom: COLORS.White,
          backgroundGradientTo: COLORS.White,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={styles.chart}
        withHorizontalLabels
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f5f7',
  },
  viewBox: {
    width: '95%',
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: COLORS.White,
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    flex: 0.4,
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  placeholderStyle: {
    color: '#333',
    fontSize: 12,
  },
  selectedTextStyle: {
    color: '#5d80ee',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chart: {
    borderRadius: 10,
    paddingTop: 10,
  },
});

export default BarChartGraph;
