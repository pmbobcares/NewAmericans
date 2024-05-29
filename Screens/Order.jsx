import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../components/Categories/FetchingCategories';
import checkout from '../assets/checkout.png';


const categoryImages = {
  'View All': require('../assets/cart.png'),
  'Clothes': require('../assets/clothes.png'),
  'Toiletries': require('../assets/toiletries.png'),
  'Hair Supplies': require('../assets/hair.png'),
  'Cleaning Supplies': require('../assets/cleaning.png'),
  'Baby Supplies': require('../assets/baby.png'),
  'School Supplies': require('../assets/school.png'),
  'Food': require('../assets/food.png'),
  'Miscellaneous': require('../assets/other.png'),
};

const Item = ({ category }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ProductsOrder', { categoryId: category.CategoryID });
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image source={categoryImages[category.category_name]} style={styles.itemImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{category.category_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Order = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

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

  return (
    <ScrollView contentContainerStyle={[styles.container, styles.scrollViewContent]}>
      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.checkout}>
          <Text style={styles.buttonText}>Checkout</Text>
          <Image source={checkout} style={styles.checkoutIcon} />
      </TouchableOpacity>
      {categories.map((category, index) => (
        <Item key={index} category={category} />
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  checkout: {
    flexDirection: 'row',
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
    width: '100%',
    justifyContent: 'center',
  },
  checkoutIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'space-between', // Add this to evenly distribute items horizontally
    backgroundColor: '#FFF',
  },
  itemContainer: {
    width: '48%', // Adjust the width as needed to fit two items in a row
    aspectRatio: 1, // Ensure aspect ratio is 1:1
    padding: 10,
    marginBottom: 10, // Add some margin to separate the items
  },
  innerContainer: {
    borderWidth: 2,
    borderColor: '#F3D014',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1, // Allow inner container to expand
  },
  imageContainer: {
    overflow: 'hidden',
    flex: 1, // Allow image to expand
  },
  itemImage: {
    width: '100%',
    height: '100%', // Adjust the height to fill the container
    marginTop: 5,
    resizeMode: 'contain',
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingTop: 10, // Adjust the padding top to create space for the icons
    paddingBottom: 100, // Add padding to the bottom of the ScrollView
  },
  cartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Order;
