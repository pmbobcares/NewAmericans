import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSuperuser } from '../components/Admins/FetchingSuperuser';
import right_arrow from '../assets/right-arrow.png';
const Superuser = () => {
  const [superuserPasscode, setSuperuserPasscode] = useState('');
  const [fetchedPasscode, setFetchedPasscode] = useState('');
  const navigation = useNavigation();

  const handleCheckPasscode = () => {
    if (superuserPasscode == fetchedPasscode) {
      setSuperuserPasscode('');
      navigation.navigate('PasswordProtectedScreen');
    } else {
      console.log('Incorrect passcode');
      console.log(fetchedPasscode);
      console.log(superuserPasscode);
    }
  };

  useEffect(() => {
    const getRealPasscode = async () => {
      try {
        const superuser = await fetchSuperuser();
        setFetchedPasscode(superuser[0].passcode);
      } catch (error) {
        console.error('Error fetching real passcode:', error);
      }
    };

    getRealPasscode();
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when user presses outside of the input
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <View style={styles.textArea}>
          <Text style={styles.headerText}>Admin Control</Text>
          <Text style={styles.subText}>Please enter master passkey to continue.</Text>
        </View>
        <View style={styles.submissionArea}>
          <TextInput
            style={styles.input}
            placeholder="****"
            value={superuserPasscode}
            onChangeText={(text) => setSuperuserPasscode(text)}
            keyboardType="numeric"
            secureTextEntry={true}
          />
          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.button} onPress={handleCheckPasscode}>
              <Text style={styles.buttonText}>Submit</Text>
              <Image source={right_arrow} style={styles.right_arrow} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textArea: {
    width: '100%',
    height: '40%',
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Nunito-Bold',
    textAlign: 'left',
    paddingLeft: '5%',
    paddingTop: '30%',
  },
  subText: {
    fontSize: 20,
    color: 'grey',
    fontFamily: 'Nunito-Regular',
    textAlign: 'left',
    paddingLeft: '5%',
    paddingTop: '5%',
  },
  submissionArea: {
    width: '100%',
    height: '60%',
    marginTop: '5%',
    alignItems: 'center',
  },
  buttonArea: {
    width: '100%',
    height: '12%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  input: {
    padding: 10,
    marginBottom: 10,
    width: '90%',

    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3D014',
    marginRight: '5%',
    marginTop: '5%',
    borderRadius: 30,
    width: '30%',
    height: '100%',

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
    color: 'white',
    textAlign: 'center',
  },
  right_arrow: {
    marginLeft: '10%',
    width: 24,
    height: 24,
  },
});

export default Superuser;
