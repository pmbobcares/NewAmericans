import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchTransactions } from '../components/Transactions/TransactionFetching';
import { putStudent } from '../components/Students/PuttingStudent';
import { deleteStudent } from '../components/Students/DeleteStudent';
import edit from '../assets/edit.png';



const StudentOrders = ({ route }) => {
  const [student, setStudent] = useState(route.params.student);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(student.first_name);
  const [editedLastName, setEditedLastName] = useState(student.last_name);
  const [transactions, setTransactions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStudentTransactions = async () => {
      try {
        const studentID = student.StudentID;
        const studentTransactions = await fetchTransactions(studentID);
        setTransactions(studentTransactions);
      } catch (error) {
        console.error('Error fetching student transactions:', error);
      }
    };

    fetchStudentTransactions();
  }, [student]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePress = (transaction) => {
    // Navigate to a different page and pass student and transaction information
    navigation.navigate('StudentOrdersItems', { student: student, transaction: transaction });
  };

  const handleSaveChanges = async () => {
    const updatedStudent = {
      ...student,
      first_name: editedFirstName !== '' ? editedFirstName : student.first_name,
      last_name: editedLastName !== '' ? editedLastName : student.last_name,
    };

    putStudent(updatedStudent);
    setStudent(updatedStudent);
    setIsEditModalVisible(false);

    setEditedFirstName(updatedStudent.first_name);
    setEditedLastName(updatedStudent.last_name);
  };

  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(student);
      navigation.goBack();

    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.header}>{student.first_name} {student.last_name}</Text>
        <TouchableOpacity style={styles.editIconContainer} onPress={() => setIsEditModalVisible(true)}>
          <Image source={edit} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      {/* Modal to edit student */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.inputRow}>
                <Text style={styles.modalTitle}>First Name: </Text>
                <TextInput
                  style={styles.input}
                  value={editedFirstName}
                  onChangeText={(text) => setEditedFirstName(text)}
                  placeholder="First Name"
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.modalTitle}>Last Name: </Text>
                <TextInput
                  style={styles.input}
                  value={editedLastName}
                  onChangeText={(text) => setEditedLastName(text)}
                  placeholder="Last Name"
                />
              </View>
              <TouchableOpacity style={[styles.closeButton, { width:'100%' }]} onPress={handleDeleteStudent}>
                <Text style={styles.closeButtonText}>Delete Student</Text>
              </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { width:'100%' }]}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <View style={{ width: 10 }} />
                <TouchableOpacity
                  style={[styles.closeButton, { width:'100%' }]}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>


      <View>
      <Text style={styles.ordersText}>Orders</Text>
      </View>
      {/* Render the fetched transactions */}
      <ScrollView style={styles.scrollView}>
        {transactions.map(transaction => (
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
    paddingTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginRight: 10,
    fontFamily: 'Nunito-Bold',
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
  editButtonContainer: {
    backgroundColor: '#F3D014',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#FA4616',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginRight: 'auto',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
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
    maxHeight: '80%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfButton: {
    flex: 0.5,
    marginRight: 5,
  },
  buttonLeft: {
    marginRight: 'auto',
  },
  buttonRight: {
    marginLeft: 'auto',
  },  
  ordersText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Nunito-Bold',
  },
  scrollView: {
    width: '100%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
});

export default StudentOrders;
