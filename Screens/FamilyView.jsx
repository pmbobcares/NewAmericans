import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchStudents } from '../components/Students/StudentFetching';
import { fetchFamilyData } from '../components/Families/fetchFamilyData';
import { postNewFamily } from '../components/Families/PostingFamily';


const FamilyView = () => {
  const [students, setStudents] = useState([]);
  const [families, setFamilies] = useState([]);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [addFamilyModal, setAddFamilyModal] = useState(false);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');



  const navigation = useNavigation();

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const studentsData = await fetchStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyData = await fetchFamilyData();
        setFamilies(familyData);
      } catch (error) {
        console.error('Error fetching families:', error);
      }
    };

    fetchData();
  }, [refreshDataTrigger]);


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const updatedFamilies = await fetchFamilyData();
          setFamilies(updatedFamilies);
        } catch (error) {
          console.error('Error fetching family data:', error);
        }
      };

      fetchData();

      return () => {

      };
    }, [])
  );


  const handleAddFamily = async () => {
    const newFamily = {
      family_name: newFamilyName,
    };

    console.log('New Family: ', newFamily);
    await postNewFamily(newFamily);
    setAddFamilyModal(false);
    setNewFamilyName('');
    setRefreshDataTrigger(t => !t);
  };

  const handlePress = async (family) => {
    navigation.navigate('SelectedFamily', { family })
  };

  const sortedFamilies = [...families].sort((a, b) => a.family_name.localeCompare(b.family_name));

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = sortedFamilies.filter(family =>
      family.family_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFamilies(filtered);
  };

  let displayedFamilies = sortedFamilies;

  if (searchQuery.trim()) {
    displayedFamilies = filteredFamilies;
  }

  return (
    <View style={styles.container}>
      {/* Modal to add family */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addFamilyModal}
        onRequestClose={() => setAddFamilyModal(false)}
      >
        {/* Modal content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterButtonText}>Add Family</Text>
            <TextInput
              style={styles.input}
              placeholder="Family Name"
              placeholderTextColor="#808080"
              value={newFamilyName}
              onChangeText={(text) => setNewFamilyName(text)}
            />
            <TouchableOpacity
              style={[styles.saveButton, { width: '100%' }]}
              onPress={handleAddFamily}
            >
              <Text style={styles.saveButtonText}>Add Family</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { width: '100%' }]}
              onPress={() => setAddFamilyModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.filterButton, styles.fullButton]} onPress={() => setAddFamilyModal(true)}>
              <Text style={styles.filterButtonText}>Add Family</Text>
            </TouchableOpacity>
          </View>
          {/* Display Families */}
          {displayedFamilies.map((family, index) => (
            <TouchableOpacity key={family.FamilyID} onPress={() => handlePress(family)}>
              <View style={styles.card}>
                <Text style={styles.familyName}>{family.family_name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    width: '100%',
    //alignItems: 'center',
    //justifyContent: 'center',
    //padding: 10,
    backgroundColor: '#fff',

  },
  halfButton: {
    flex: 0.5,
    marginRight: 5,
  },
  fullButton: {
    flex: 1,
    marginRight: 5,
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
  closeButton: {
    marginTop: 10,
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
    marginTop: 10,
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: 'auto',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  buttonLeft: {
    marginRight: 'auto',
  },
  buttonRight: {
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  searchBarContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.5)',
  },
});

export default FamilyView;
