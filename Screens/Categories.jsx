import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../components/Categories/FetchingCategories';
import edit from '../assets/edit.png';
import { postNewCategory } from '../components/Categories/PostingCategory';
import { putCategory } from '../components/Categories/PuttingCategory';
import { deleteCategory } from '../components/Categories/DeleteCategory';
import { fetchItems } from '../components/Categories/FetchingItems';





const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [editedCategory, setEditedCategory] = useState({});
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);




  const navigation = useNavigation();




  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };


    fetchData();
  }, []);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        // Fetch all items
        const items = await fetchItems();
        setInventory(items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItemData();
  }, []);


  const handleAddCategory = async () => {

    const newCategory = {
      category_name: newCategoryName,
      // add PictureURI here ?
    };
    console.log('New Category: ', newCategory);
    postNewCategory(newCategory);
    const updatedCategories = await fetchCategories();
    setCategories(updatedCategories);
    setAddModalVisible(false);
    //setRefreshDataTrigger(t => !t);
    setNewCategoryName('');
  }


  const handleSaveChanges = async () => {
    const updatedCategory = {
      ...editedCategory,
      category_name: editedCategoryName !== '' ? editedCategoryName : editedCategory.category_name,
    };


    putCategory(updatedCategory);
    const updatedCategories = await fetchCategories();
    setCategories(updatedCategories);
    setEditModalVisible(false);

    setEditedCategoryName('');
  };


  const handleDeleteCategory = async () => {
    const isCategoryUsed = inventory.some(item => item.CategoryID === editedCategory.CategoryID);

    if (isCategoryUsed) {
      alert('Items in this category must be reassigned before deleting.');
      return;
    }


    try {
      await deleteCategory(editedCategory);


      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);


      setEditModalVisible(false);

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };


  const handleEdit = (item) => {
    setEditedCategory(item);
    setEditedCategoryName(item.category_name);
    setEditModalVisible(true);
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.filterButton]} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.filterButtonText}>Add New Category</Text>
        </TouchableOpacity>
        {/* Modal to add category */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setNewCategoryName(text)}
                  placeholder="Category Name"
                  placeholderTextColor="#808080"
                />
              </View>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveButtonText}>Add Category</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal to edit category */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={editedCategoryName}
                  onChangeText={(text) => setEditedCategoryName(text)}
                  placeholder="Category Name"
                />
              </View>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleDeleteCategory}>
                <Text style={styles.closeButtonText}>Delete Category</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Display Categories */}
        {categories.map((item) => (
          <View key={item.CategoryID} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text style={styles.item}>{item.category_name}</Text>
              </View>
              <TouchableOpacity style={styles.editButtonContainer} onPress={() => handleEdit(item)}>
                <Image source={edit} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  leftContent: {
    flex: 1,
  },
  item: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    paddingLeft: '5%',
  },
  editButtonContainer: {
    //backgroundColor: '#F3D014',
    padding: 8,
    borderRadius: 5,
  },
  editButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
    flex: 1,
    //marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfButton: {
    flex: 0.5,
    marginRight: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  filterButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
});


export default CategoriesScreen;



