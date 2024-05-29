import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { fetchReportData } from '../components/Reports/FetchingReportInfo';
import { fetchStudents } from '../components/Students/StudentFetching';
import { fetchAdminData } from '../components/Admins/FetchingAdmins';
import { fetchFamilyData } from '../components/Families/fetchFamilyData';
import { filterReportDataByAdminID } from '../components/Reports/ReportFilters/filterReportAdmin'
import { filterReportDataByFamilyID } from '../components/Reports/ReportFilters/filterReportsFamily'
import { filterReportDataByUserId } from '../components/Reports/ReportFilters/filterReportUser'
import { filterReportDataByYear } from '../components/Reports/ReportFilters/filterReportYear'


const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const navigation = useNavigation();

  LogBox.ignoreLogs(['Found screens with the same name nested inside one another']);

  useEffect(() => {
    // Fetch report data when component mounts
    fetchReportData()
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching report data: ', error);
        setLoading(false);
      });

    // Fetch admin data
    fetchAdminData()
      .then(adminData => {
        setAdmins(adminData);
      })
      .catch(error => {
        console.error('Error fetching admin data: ', error);
      });

    // Fetch student data
    fetchStudents()
      .then(studentsData => {
        setStudents(studentsData);
      })
      .catch(error => {
        console.error('Error fetching student data: ', error);
      });

    // Fetch family data
    fetchFamilyData()
      .then(familyData => {
        setFamilies(familyData);
      })
      .catch(error => {
        console.error('Error fetching family data: ', error);
      });
  }, []);

  const handleFilterByUser = () => {
    try {
      const filteredData = filterReportDataByUserId(reportData, selectedStudent);
      console.log('Filtered data by user:', filteredData);
      navigation.navigate('FilteredReports', { filteredData });
    } catch (error) {
      console.error('Error filtering data by user:', error);
    }
  };

  const handleFilterByAdmin = () => {
    try {
      const filteredData = filterReportDataByAdminID(reportData, selectedAdmin);
      //console.log('Filtered data by admin:', filteredData);
      navigation.navigate('FilteredReports', { filteredData });
    } catch (error) {
      console.error('Error filtering data by admin:', error);
    }
  };

  const handleFilterByYear = () => {
    try {
      const filteredData = filterReportDataByYear(reportData, selectedYear);
      console.log('Filtered data by year:', filteredData);
      navigation.navigate('FilteredReports', { filteredData });
    } catch (error) {
      console.error('Error filtering data by year:', error);
    }
  };

  const handleFilterByFamily = () => {
    try {
      const filteredData = filterReportDataByFamilyID(reportData, selectedFamily);
      console.log('Filtered data by family:', filteredData);
      navigation.navigate('FilteredReports', { filteredData });
    } catch (error) {
      console.error('Error filtering data by family:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleFilterByUser} style={styles.button}>
          <Text style={styles.buttonText}>Filter by Student</Text>
        </TouchableOpacity>
        <Picker
          style={styles.picker}
          selectedValue={selectedStudent}
          onValueChange={(itemValue, itemIndex) => setSelectedStudent(itemValue)}
          itemStyle={{ height: 115, fontFamily: 'Nunito-Bold' }}
        >
          <Picker.Item label="Select Student" value="" />
          {students.map(student => (
            <Picker.Item key={student.StudentID} label={`${student.first_name} ${student.last_name}`} value={student.StudentID} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleFilterByAdmin} style={styles.button}>
          <Text style={styles.buttonText}>Filter by Admin</Text>
        </TouchableOpacity>
        <Picker
          style={styles.picker}
          selectedValue={selectedAdmin}
          onValueChange={(itemValue, itemIndex) => setSelectedAdmin(itemValue)}
          itemStyle={{ height: 115, fontFamily: 'Nunito-Bold' }}
        >
          <Picker.Item label="Select Admin" value="" />
          {admins.map(admin => (
            <Picker.Item key={admin.AdminID} label={`${admin.first_name} ${admin.last_name}`} value={admin.AdminID} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleFilterByFamily} style={styles.button}>
          <Text style={styles.buttonText}>Filter by Family</Text>
        </TouchableOpacity>
        <Picker
          style={styles.picker}
          selectedValue={selectedFamily}
          onValueChange={(itemValue, itemIndex) => setSelectedFamily(itemValue)}
          itemStyle={{ height: 115, fontFamily: 'Nunito-Bold' }}
        >
          <Picker.Item label="Select Family" value="" />
          {families.map(family => (
            <Picker.Item key={family.FamilyID} label={family.family_name} value={family.FamilyID} />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleFilterByYear} style={styles.button}>
          <Text style={styles.buttonText}>Filter by Year</Text>
        </TouchableOpacity>
        <Picker
          style={styles.picker}
          selectedValue={selectedYear}
          onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
          itemStyle={{ height: 115, fontFamily: 'Nunito-Bold' }}
        >
          <Picker.Item label="Select Year" value="" />
          {Array.from({ length: new Date().getFullYear() - 2019 }, (_, index) => (
            <Picker.Item key={2020 + index} label={`${2020 + index}`} value={`${2020 + index}`} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#F3D014',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
});

export default Reports;
