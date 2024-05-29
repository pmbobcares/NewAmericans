import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import createCSV from '../components/Reports/CreateCSV';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const FilteredReports = ({ route }) => {
  const { filteredData } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const handleExport = async () => {
    try {
      // Create CSV data
      const csvData = createCSV(filteredData);

      // Create file in cache directory
      console.log(FileSystem.documentDirectory);
      const fileUri = FileSystem.documentDirectory + 'exported_report.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvData);

      // Share the CSV file
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error exporting CSV:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Filtered Transactions</Text>
          <TouchableOpacity onPress={handleExport} style={styles.button}>
            <Text style={styles.buttonText}>Export Report</Text>
          </TouchableOpacity>
          {filteredData.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={{ fontFamily: 'Nunito-Bold' }}>{item.Student_FirstName} {item.Student_LastName}: {item.ProductName} ({item.Quantity}) </Text>
              <Text style={{ fontFamily: 'Nunito-Bold' }}>
                Family: {item.Family_Name ? item.Family_Name : 'N/A'}
              </Text>
              <Text>{formatDate(item.DateCreated)}</Text>
              <Text>Admin: {item.Admin_FirstName} {item.Admin_LastName}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <Button title="Export to CSV" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  dataContainer: {
    flexGrow: 1,
    marginBottom: 50,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
  },
  itemContainer: {
    marginTop: 20,

    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  button: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
});

export default FilteredReports;
