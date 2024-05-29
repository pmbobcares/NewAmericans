import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchStudents } from '../components/Students/StudentFetching';
import { UpdateStudentFamily } from '../components/Families/UpdateStudentFamily';
import { putFamily } from '../components/Families/PuttingFamily';
import { deleteFamily } from '../components/Families/DeleteFamily';
import { fetchTransactions } from '../components/Transactions/TransactionFetching';
import edit from '../assets/edit.png';






const SelectedFamily = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [family, setFamily] = useState(route.params.family);

  const [addStudentModal, setAddStudentModal] = useState(false);
  const [editFamilyModal, setEditFamilyModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentSearchText, setStudentSearchText] = useState('');
  const [familyStudents, setFamilyStudents] = useState([]);
  const [selectedStudentDelete, setSelectedStudentDelete] = useState(null);
  const [deleteStudentModal, setDeleteStudentModal] = useState(false);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editedName, setEditedName] = useState(family.family_name);
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    const fetchStudentTransactions = async () => {
      try {
        const transactionsArray = await Promise.all(
          familyStudents.map(async (student) => {
            const studentTransactions = await fetchTransactions(student.StudentID);
            return studentTransactions;
          })
        );
  
        const flattenedTransactions = transactionsArray.flatMap(studentTransactions => studentTransactions);
        setTransactions(flattenedTransactions);
      } catch (error) {
        console.error('Error fetching student transactions:', error);
      }
    };
  
    fetchStudentTransactions();
  }, [familyStudents]);
  




  useEffect(() => {
    async function fetchStudentData() {
      try {
        const studentsData = await fetchStudents();
        setStudents(studentsData);
        const inFamily = studentsData.filter(student => student.familyID === family.FamilyID);
        setFamilyStudents(inFamily);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    fetchStudentData();
  }, [refreshDataTrigger]);

  // Filter students based on search text
  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(studentSearchText.toLowerCase()) ||
    student.last_name.toLowerCase().includes(studentSearchText.toLowerCase())
  );

  const handleAddStudent = async () => {
    if (selectedStudent.familyID) {
      setErrorMessage("This student is already part of a family.");
      return;
    }

    const updatedStudent = {
      ...selectedStudent,
      familyID: family.FamilyID !== '' ? family.FamilyID : student.familyID,
    };

    await UpdateStudentFamily(updatedStudent)
    setAddStudentModal(false);
    setStudentSearchText('');
    setSelectedStudent(null);
    setRefreshDataTrigger(t => !t);
    setErrorMessage('');
  };

  const handleRemoveStudent = async () => {
    if (selectedStudentDelete) {
      const updatedStudent = {
        ...selectedStudentDelete,
        familyID: null,
      };

      await UpdateStudentFamily(updatedStudent)
      setDeleteStudentModal(false);
      setSelectedStudent(null)
      setRefreshDataTrigger(t => !t);
    }

  };

  const handleSaveChanges = async () => {
    try {
      const updatedFamily = {
        ...family,
        family_name: editedName !== '' ? editedName : family.family_name,
      };
  
      setFamily(updatedFamily);
      await putFamily(updatedFamily);
      setEditFamilyModal(false);
  
      setEditedName(updatedFamily.family_name);
      setRefreshDataTrigger(t => !t);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDeleteFamily = async () => {
    try {
      // delete students from family
      for (const student of familyStudents) {
        const updatedStudent = {
          ...student,
          familyID: null,
        };
        await UpdateStudentFamily(updatedStudent);
      }
  
      // delete family
      await deleteFamily(family);
      navigation.goBack();
    } catch (error) {
      console.error('Error removing family:', error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setStudentSearchText(`${student.first_name} ${student.last_name}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const handlePress = async (transaction) => {
    try {
      const student = familyStudents.find(student => student.StudentID === transaction.StudentID);
      
      navigation.navigate('StudentOrdersItems', { student: student, transaction: transaction });
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  const sortedTransactions = transactions.slice().sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));


  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.filterButton, {width: '100%' }, { marginBottom: 10 }]} onPress={() => setAddStudentModal(true)}>
          <Text style={styles.filterButtonText}>Add Student</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.header}>Family: {family.family_name}</Text>
        <TouchableOpacity style={styles.editIconContainer} onPress={() => setEditFamilyModal(true)}>
          <Image source={edit} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      {/* Modal to add student */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addStudentModal}
        onRequestClose={() => setAddStudentModal(false)}
      >
        {/* Modal content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Student to Family</Text>
            {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
            <TextInput
              style={styles.searchInput}
              placeholder="Search Students"
              placeholderTextColor="#A0A0A0"
              value={studentSearchText}
              onChangeText={text => setStudentSearchText(text)}
            />
            <ScrollView style={styles.scrollView}>
              {filteredStudents.map(student => (
                <TouchableOpacity
                  key={student.id}
                  style={styles.itemButton}
                  onPress={() => handleStudentSelect(student)}
                >
                  <Text>{student.first_name} {student.last_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleAddStudent}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => {
                  setAddStudentModal(false);
                  setSelectedStudent(null);
                  setStudentSearchText('');
                  setErrorMessage('');
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal to delete student from family */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteStudentModal}
        onRequestClose={() => setDeleteStudentModal(false)}
      >
        {/* Modal content */}
        <View style={styles.modalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.modalHeader}>
              Remove {selectedStudentDelete ? `${selectedStudentDelete.first_name} ${selectedStudentDelete.last_name}` : 'Student'} from {family.family_name}?
            </Text>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleRemoveStudent}
              >
                <Text style={styles.saveButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => {
                  setDeleteStudentModal(false);
                  setSelectedStudentDelete(null);
                }}
              >
                <Text style={styles.closeButtonText}>No</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal to edit family */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editFamilyModal}
        onRequestClose={() => setEditFamilyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.inputRow}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Family: </Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={(text) => setEditedName(text)}
                placeholder="Family Name"
              />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleDeleteFamily}>
              <Text style={styles.closeButtonText}>Delete Family</Text>
            </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => setEditFamilyModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* display students in family */}
      <View style={styles.studentsContainer}>
        {familyStudents.map(student => (
          <View key={student.StudentID} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.first_name} {student.last_name}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setDeleteStudentModal(true);
                setSelectedStudentDelete(student);
              }}
            >
              <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* display transactions */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.ordersText}>Orders</Text>
        {transactions && sortedTransactions.map(transaction => (
          <TouchableOpacity
            key={transaction.TransactionID}
            style={styles.dateContainer}
            onPress={() => handlePress(transaction)}
          >
            <Text style={styles.dateText}>{formatDate(transaction.DateCreated)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  studentsContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  deleteButton: {
    backgroundColor: '#F3D014',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '40%',
    minHeight: '25%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginRight: 15,
    fontFamily: 'Nunito-Bold',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginRight: 15,
    fontFamily: 'Nunito-Bold',
  },
  deleteModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '40%',
  },
  filterButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  halfButton: {
    flex: 0.5,
    marginRight: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FA4616',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginRight: 'auto',
    width: '100%',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: 'auto',
    width: '100%',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  buttonLeft: {
    marginRight: 'auto',
  },
  buttonRight: {
    marginLeft: 'auto',
  },
  editButtonContainer: {
    backgroundColor: '#F3D014',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
    flex: 1,
    marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    alignSelf: 'flex-start',
    borderColor: '#F3D014',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  dateText: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  scrollView: {
    width: '100%',
    maxHeight: '60%',
  },
  ordersText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  editIconContainer: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SelectedFamily;
