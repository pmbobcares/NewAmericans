import React, { useState, useEffect, } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { fetchStudents } from '../components/Students/StudentFetching';
import { fetchAdminData } from '../components/Admins/FetchingAdmins';
import { SubmitOrder } from '../components/Orders/SubmitOrder';
import SelectBox from 'react-native-multi-selectbox'


const SubmitModal = ({ visible, onClose, cartItemsWithQuantity }) => {
    const [students, setStudents] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [adminOptions, setAdminOptions] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState({});
    const [selectedAdmin, setSelectedAdmin] = useState({});

    const [enteredPassword, setEnteredPassword] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all admins
                const fetchedAdmins = await fetchAdminData();
                const fetchedStudents = await fetchStudents();

                setAdmins(fetchedAdmins);
                setStudents(fetchedStudents);
            } catch (error) {
                console.error('Error fetching admins/students:', error);
            }
        };

        fetchData();

    }, []);





    useEffect(() => {
        // Map fetched data to options after admins and students states are updated
        const mappedAdmins = admins.map(admin => ({ item: admin.first_name + " " + admin.last_name, id: admin.AdminID, AdminID: admin.AdminID, email: admin.email, password: admin.password, first_name: admin.first_name, last_name: admin.last_name }));
        const mappedStudents = students.map(student => ({ item: student.first_name + " " + student.last_name, id: student.StudentID, StudentID: student.StudentID, first_name: student.first_name, last_name: student.last_name, familyID: student.familyID }));
        setAdminOptions(mappedAdmins);
        setStudentOptions(mappedStudents);
    }, [admins, students]);

    const handleSubmit = async () => {
        if (!selectedStudent || !selectedAdmin) {
            // Alert the user if either selectedStudent or selectedAdmin is null
            Alert.alert('Please make sure to select both a student and an admin.');
            return;
        }
        if (enteredPassword != selectedAdmin.password) {
            // Check if entered password matches selected admins password
            console.log("incorrect password");
            return;
        }
        console.log("Cart Items with Quantity:", cartItemsWithQuantity); // Log the cart items with quantity
        SubmitOrder(selectedAdmin, selectedStudent, cartItemsWithQuantity);
        onClose();
    };
    const handlePressOutside = () => {
        Keyboard.dismiss(); // Dismiss the keyboard when user presses outside of the input
    };
    return (

        <Modal visible={visible} transparent>
            <TouchableWithoutFeedback onPress={handlePressOutside}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.modalHeaderText}>Submit Order Confirmation</Text>
                        {/* Student dropdown */}
                        <View style={styles.selectBox}>

                            <SelectBox
                                label=""
                                inputPlaceholder="Select Student"
                                options={studentOptions}
                                value={selectedStudent}
                                onChange={studentChange()}
                                hideInputFilter={false}
                                inputFilterStyle={{ fontFamily: 'Nunito-Regular' }}
                                optionsLabelStyle={{ fontFamily: 'Nunito-Regular' }}
                                listEmptyLabelStyle={{ fontFamily: 'Nunito-Regular' }}
                                selectedItemStyle={{ fontFamily: 'Nunito-Regular' }}
                            />
                        </View>

                        {/* Admin dropdown */}
                        <View style={styles.selectBox}>

                            <SelectBox
                                label=""
                                inputPlaceholder="Select Admin"
                                options={adminOptions}
                                value={selectedAdmin}
                                onChange={adminChange()}
                                hideInputFilter={false}
                                inputFilterStyle={{ fontFamily: 'Nunito-Regular' }}
                                optionsLabelStyle={{ fontFamily: 'Nunito-Regular' }}
                                listEmptyLabelStyle={{ fontFamily: 'Nunito-Regular' }}
                                selectedItemStyle={{ fontFamily: 'Nunito-Regular' }}
                            />
                        </View>
                        <Text style={styles.subText}>Admin Passcode</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="****"
                            value={enteredPassword}
                            onChangeText={(text) => setEnteredPassword(text)}
                            keyboardType="numeric"
                            secureTextEntry={true}
                        />

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

    );
    function studentChange() {
        return (val) => setSelectedStudent(val)
    }
    function adminChange() {
        return (val) => setSelectedAdmin(val)
    }
};

const styles = StyleSheet.create({
    subText: {
        fontSize: 12,
        color: 'grey',
        fontFamily: 'Nunito-Regular',
        textAlign: 'left',
        paddingTop: '5%',
    },
    selectBox: {
        //backgroundColor: 'red',
        marginBottom: 30,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '85%',
        height: 'auto',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#F3D014',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '45%',

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
        width: '45%',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Nunito-Bold',

    },
    showButton: {
        flex: 1,
        backgroundColor: 'lightblue',
        padding: 20, // Increase padding for larger buttons
        borderRadius: 5,
        alignSelf: 'stretch',
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
        marginBottom: 20, // Increase bottom margin for more space
    },

    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    scrollView: {
        maxHeight: 150, // Reduce max height for smaller dropdowns
        marginBottom: 10,
    },
    itemButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalHeaderText: {
        marginBottom: 20, // Add some space between the header and other components
        fontSize: 18, // Adjust font size as needed
        fontWeight: 'bold', // Optionally set font weight
        textAlign: 'center',
    },
});

export default SubmitModal;
