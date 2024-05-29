import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Image } from 'react-native';
import { fetchAdminData } from '../components/Admins/FetchingAdmins';
import { postNewAdmin } from '../components/Admins/PostingAdmin';
import { putAdmin } from '../components/Admins/PuttingAdmin';
import { removeAdmin } from '../components/Admins/RemoveAdmin';
import edit from '../assets/edit.png';


const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [editAdminModalVisible, setEditAdminModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all admins
        const fetchedAdmins = await fetchAdminData();
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchData();
  }, []);

  const openEditAdmin = (admin) => {
    console.log("editing admin", admin.first_name);
    setSelectedAdmin(admin); // Set the selected admin
    setEditAdminModalVisible(true); // Open the edit admin modal
  }

  const handleRemoveAdmin = async () => {
    try {
      // Remove the admin
      await removeAdmin(selectedAdmin);

      // Fetch updated admin data
      const updatedAdmins = await fetchAdminData();

      // Update the admin list in the state
      setAdmins(updatedAdmins);

      // Close the edit admin modal
      setEditAdminModalVisible(false);
    } catch (error) {
      console.error('Error removing admin:', error);
      // Handle error, show message to user, etc.
    }
  };


  const handleEditAdmin = () => {
    // Construct the updated admin object with edited values
    const updatedAdmin = {
      ...selectedAdmin, // Keep other properties unchanged
      first_name: editedFirstName !== '' ? editedFirstName : selectedAdmin.first_name,
      last_name: editedLastName !== '' ? editedLastName : selectedAdmin.last_name,
      email: editedEmail !== '' ? editedEmail : selectedAdmin.email,
      password: editedPassword !== '' ? editedPassword : selectedAdmin.password,
    };

    // Update the admin in the state
    const updatedAdmins = admins.map((admin) =>
      admin.AdminID === selectedAdmin.AdminID ? updatedAdmin : admin
    );
    setAdmins(updatedAdmins);
    putAdmin(updatedAdmin);
    // Close the edit admin modal
    setEditAdminModalVisible(false);

    // Reset edited values to empty strings
    setEditedFirstName('');
    setEditedLastName('');
    setEditedEmail('');
    setEditedPassword('');
  }

  const handleAddAdmin = async () => {
    const newAdmin = {
      email: newEmail,
      password: newPassword,
      first_name: newFirstName,
      last_name: newLastName,
    };
    console.log('New Admin: ', newAdmin);
    postNewAdmin(newAdmin);
    setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
    const updatedAdmins = await fetchAdminData();
    setAdmins(updatedAdmins);
    setAdminModalVisible(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPassword('');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TouchableOpacity style={styles.button} onPress={() => setAdminModalVisible(true)}>
          <Text style={styles.buttonText}>Add Admin</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={adminModalVisible}
          onRequestClose={() => setAdminModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>New Admin</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor='lightgrey'
                value={newFirstName}
                onChangeText={(text) => setNewFirstName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor='lightgrey'
                value={newLastName}
                onChangeText={(text) => setNewLastName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor='lightgrey'
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                keyboardType="numeric"
                placeholderTextColor='lightgrey'
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              />
              <TouchableOpacity style={styles.button} onPress={handleAddAdmin}>
                <Text style={styles.buttonText}>Add Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setAdminModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={editAdminModalVisible}
          onRequestClose={() => setEditAdminModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>Edit Admin</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                defaultValue={selectedAdmin.first_name}
                onChangeText={(text) => setEditedFirstName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                defaultValue={selectedAdmin.last_name}
                onChangeText={(text) => setEditedLastName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                defaultValue={selectedAdmin.email}
                onChangeText={(text) => setEditedEmail(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                keyboardType="numeric"
                defaultValue={selectedAdmin && selectedAdmin.password ? selectedAdmin.password.toString() : ''}
                onChangeText={(text) => setEditedPassword(text)}
              />
              <TouchableOpacity style={styles.button} onPress={handleEditAdmin}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleRemoveAdmin}>
                <Text style={styles.buttonText}>Remove Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setEditAdminModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {admins.map((admin, index) => (
          <View key={index} style={styles.adminContainer}>
            <View style={styles.adminTextContainer}>
              <Text style={styles.textContainerBold}>{admin.first_name} {admin.last_name}</Text>
              <Text style={styles.textContainer}>{admin.email}</Text>
            </View>
            <TouchableOpacity onPress={() => openEditAdmin(admin)} style={styles.editIconContainer}>
              <Image source={edit} style={styles.editIcon} />
            </TouchableOpacity>

          </View>
        ))}

      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  modalHeaderText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Nunito-Black',
  },
  adminContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
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
  adminTextContainer: {
    width: '80%',
    flexDirection: 'column',
  },
  textContainer: {
    fontFamily: 'Nunito-Bold',
  },
  textContainerBold: {
    fontFamily: 'Nunito-Black',
  },
  editIconContainer: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: "flex-end"
  },
  button: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',

  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    backgroundColor: '#FA4616',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',

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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
  },
  editButton: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
});


export default Admins;
