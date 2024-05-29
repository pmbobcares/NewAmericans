import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, TextInput, Image } from 'react-native';
import { fetchItems } from '../components/Categories/FetchingItems';
import { fetchCategories } from '../components/Categories/FetchingCategories';
import { postNewProduct } from '../components/Products/PostingProduct';
import { putProduct } from '../components/Products/PuttingProduct';
import { deleteProduct } from '../components/Products/DeleteProduct';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import edit from '../assets/edit.png';
import * as ImagePicker from 'expo-image-picker';


const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [newItemName, setNewItemName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editedProductName, setEditedProductName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchCategoryQuery, setSearchCategoryQuery] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [addErrorMessage, setAddErrorMessage] = useState('');
  const navigation = useNavigation();


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
  }, [refreshDataTrigger]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await fetchCategories();
        setAllCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const updatedCategories = await fetchCategories();
          setAllCategories(updatedCategories);
        } catch (error) {
          console.error('Error fetching category data:', error);
        }
      };

      fetchData();

      return () => {

      };
    }, [])
  );

  const handleEdit = (item) => {
    setEditedItem(item);
    setEditedProductName(item.ProductName);
    setEditedQuantity(String(item.ProductQuantity));
    const category = allCategories.find(cat => cat.CategoryID === item.CategoryID);
    setEditedCategory(category ? category.category_name : null);
    setEditModalVisible(true);
  };

  const getCategoryIDByName = (categoryName) => {
    const category = allCategories.find(cat => cat.category_name === categoryName);
    return category ? category.CategoryID : null;
  };

  const handleSaveChanges = async () => {
    const updatedCategoryID = getCategoryIDByName(editedCategory);

    if (!updatedCategoryID) {
      setSaveErrorMessage("Choose an existing category.");
      return;
    }

    const updatedProduct = {
      ...editedItem,
      ProductName: editedProductName !== '' ? editedProductName : editedItem.ProductName,
      ProductQuantity: editedQuantity !== '' ? editedQuantity : editedItem.ProductQuantity,
      CategoryID: updatedCategoryID !== '' ? updatedCategoryID : editedItem.CategoryID,
      PictureURI: selectedImage
    };

    putProduct(updatedProduct);
    const updatedInventory = await fetchItems();
    setInventory(updatedInventory);
    setEditModalVisible(false);
    setSelectedImage(null)
    setRefreshDataTrigger(t => !t);
    setEditedProductName('');
    setEditedQuantity('');
    setEditedCategory('');
    setSaveErrorMessage('');
    setSearchCategoryQuery('');
  };

  const handleSelectImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAddItem = async () => {
    const newCategoryID = getCategoryIDByName(newCategory);

    if (!newCategoryID) {
      setAddErrorMessage("Choose an existing category.");
      return;
    }

    const newItem = {
      ProductName: newItemName,
      ProductQuantity: newQuantity,
      CategoryID: newCategoryID,
      PictureURI: selectedImage,
    };
    console.log('New Item: ', newItem);
    postNewProduct(newItem);
    const updatedInventory = await fetchItems();
    setInventory(updatedInventory);
    setSelectedImage(null)
    setAddModalVisible(false);
    setRefreshDataTrigger(t => !t);
    setNewItemName('');
    setNewQuantity('');
    setNewCategory('');
    setAddErrorMessage('');
    setSearchCategoryQuery('');
  }

  const handleRemoveItem = async () => {
    try {
      // Remove the item
      await deleteProduct(editedItem);

      const updatedInventory = await fetchItems();
      setInventory(updatedInventory);

      setEditModalVisible(false);

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
  };


  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.sortOption} onPress={() => filterByCategory(item.id)}>
      <Text style={styles.sortOptionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const categories = [
    { name: 'All', id: 0 },
    ...allCategories.map(category => ({ name: category.category_name, id: category.CategoryID }))
  ];

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    setSortModalVisible(false);
  };

  const sortInventory = () => {
    let filteredInventory = [...inventory];

    if (selectedCategory !== 'All' && selectedCategory !== 0) {
      filteredInventory = inventory.filter(item => item.CategoryID === selectedCategory);
    }

    let sortedInventory = [...filteredInventory];

    if (sortCriteria === 'alphabetical') {
      sortedInventory.sort((a, b) => {
        const nameA = a.ProductName || ''; // Handle null or undefined values
        const nameB = b.ProductName || ''; // Handle null or undefined values
        return nameA.localeCompare(nameB);
      });
    } else if (sortCriteria === 'quantityLowToHigh') {
      sortedInventory.sort((a, b) => {
        const qtyA = a.ProductQuantity || 0; // Handle null or undefined values
        const qtyB = b.ProductQuantity || 0; // Handle null or undefined values
        return qtyA - qtyB;
      });
    } else if (sortCriteria === 'quantityHighToLow') {
      sortedInventory.sort((a, b) => {
        const qtyA = a.ProductQuantity || 0; // Handle null or undefined values
        const qtyB = b.ProductQuantity || 0; // Handle null or undefined values
        return qtyB - qtyA;
      });
    }
    return sortedInventory;
  };

  // Filter categories based on search text
  const filteredCategories = allCategories.filter(category =>
    category.category_name.toLowerCase().includes(searchCategoryQuery.toLowerCase())
  );

  const handleEditedCategorySelect = (category) => {
    setEditedCategory(`${category.category_name}`);
  };
  const handleNewCategorySelect = (category) => {
    setNewCategory(`${category.category_name}`);
  };


  const navigateToCategoryView = () => {
    navigation.navigate('Categories');
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.filterButton, styles.halfButton]} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.filterButtonText}>Add New Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.halfButton]} onPress={navigateToCategoryView}>
            <Text style={styles.filterButtonText}>Edit Categories</Text>
          </TouchableOpacity>
          </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.filterButton, styles.halfButton]} onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterButton, styles.halfButton]} onPress={() => setSortModalVisible(true)}>
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalContent, {maxHeight:'50%'}]}>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={[styles.closeButton, styles.buttonRight]}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for selecting sort option  */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={sortModalVisible}
          onRequestClose={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => handleSort('alphabetical')} style={styles.sortOption}>
                <Text style={styles.sortOptionText}>Sort Alphabetically</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('quantityLowToHigh')} style={styles.sortOption}>
                <Text style={styles.sortOptionText}>Sort by Quantity (Low to High)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('quantityHighToLow')} style={styles.sortOption}>
                <Text style={styles.sortOptionText}>Sort by Quantity (High to Low)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSortModalVisible(false)} style={[styles.closeButton, styles.buttonRight]}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add New Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setNewItemName(text)}
                  placeholder="Product Name"
                  placeholderTextColor="#808080"
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setNewQuantity(text)}
                  placeholder="Quantity"
                  placeholderTextColor="#808080"
                  keyboardType="numeric"
                />
              </View>
              {addErrorMessage && <Text style={{ color: 'red' }}>{addErrorMessage}</Text>}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={String(newCategory)}
                  onChangeText={(text) => {
                    setSearchCategoryQuery(text)
                    setNewCategory(text)}}
                  placeholder="Category"
                  placeholderTextColor="#808080"
                />
              </View>
              <ScrollView style={styles.scrollView}>
                {filteredCategories.map(category => (
                  <TouchableOpacity
                    key={category.CategoryID}
                    style={styles.itemButton}
                    onPress={() => handleNewCategorySelect(category)}
                  >
                    <Text>{category.category_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={[styles.saveButton]} onPress={handleSelectImage}>
                <Text style={styles.saveButtonText}>Select Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton]} onPress={handleAddItem}>
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeButton]} onPress={() => { 
                setNewCategory('')
                setNewItemName('')
                setNewQuantity('')
                setSearchCategoryQuery('')
                setAddErrorMessage('')
                setAddModalVisible(false) }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Edit modal */}
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
                  value={editedProductName}
                  onChangeText={(text) => setEditedProductName(text)}
                  placeholder="Name"
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={String(editedQuantity)}
                  onChangeText={(text) => setEditedQuantity(text)}
                  placeholder="Quantity"
                  keyboardType="numeric"
                />
              </View>
              {saveErrorMessage && <Text style={{ color: 'red' }}>{saveErrorMessage}</Text>}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={String(editedCategory)}
                  onChangeText={(text) => {
                    setSearchCategoryQuery(text)
                    setEditedCategory(text)}}
                  placeholder="Category"
                />
              </View>
              <ScrollView style={styles.scrollView}>
                {filteredCategories.map(category => (
                  <TouchableOpacity
                    key={category.CategoryID}
                    style={styles.itemButton}
                    onPress={() => handleEditedCategorySelect(category)}
                  >
                    <Text>{category.category_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={[styles.saveButton]} onPress={handleSelectImage}>
                <Text style={styles.saveButtonText}>Select Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton]} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeButton, { marginBottom: 10 }]} onPress={handleRemoveItem}>
                <Text style={styles.closeButtonText}>Delete Item</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeButton]} onPress={() => {
                setSearchCategoryQuery('')
                setSaveErrorMessage('')
                setEditModalVisible(false)}}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Displaying Inventory  */}
        {sortInventory().length > 0 ? (
          sortInventory().map((item) => (
            <View key={item.ProductID} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text style={styles.item}>{item.ProductName}</Text>
              </View>
              <Text style={styles.quantity}>QT: {item.ProductQuantity}</Text>
              <TouchableOpacity style={styles.editButtonContainer} onPress={() => handleEdit(item)}>
                <Image source={edit} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>  ))
        ) : (
          <Text style={styles.noItemsText}>No items found in this category.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: '100%',
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  halfButton: {
    flex: 0.5,
    marginRight: 5,
  },
  modalTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  buttonLeft: {
    marginRight: 'auto',
  },
  buttonRight: {
    marginLeft: 'auto',
  },
  filterButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterButtonText: {
    fontFamily: 'Nunito-Black',
    fontSize: 15,
    color: 'black',
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
    padding: 10,
    borderRadius: 10,
    width: '80%',
    maxHeight: '75%',
  },
  categoryItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#FA4616',
    padding: 10,
    borderRadius: 5,
    //marginBottom: 10,
    width: '100%',
  },
  closeButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  saveButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  sortButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sortButtonText: {
    fontFamily: 'Nunito-Black',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  sortOption: {
    paddingVertical: 10,
    //borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sortOptionText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  card: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '98%',
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    width: "70%",
  },
  item: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    paddingLeft: '5%',
  },
  quantity: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
  },
  editIconContainer: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: "flex-end"
  },
  editButton: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  cameraButton: {
    backgroundColor: '#F3D014',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  cameraButtonText: {
    fontFamily: 'Nunito-Black',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  itemButton: {
    padding: 6,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 3,
  },
  scrollView: {
    width: '100%',
    maxHeight: '16%',
    marginBottom: 10,
  },
  noItemsText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 40,
    alignSelf: 'stretch',
  },
});

export default Inventory;
