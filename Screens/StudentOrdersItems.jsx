import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchTransactionsWithDate } from '../components/Transactions/TransactionFetchingWIthDate';

const StudentOrdersItems = ({ route }) => {
  const { student, transaction } = route.params;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchStudentTransactions = async () => {
      try {
        const studentID = student.StudentID;
        const date = transaction.DateCreated;
        const studentTransactions = await fetchTransactionsWithDate(studentID, date);
        setTransactions(studentTransactions);
        console.log('Fetched transactions:', studentTransactions); // Logging the fetched transactions
      } catch (error) {
        console.error('Error fetching student transactions:', error);
      }
    };
  
    fetchStudentTransactions();
  }, [student, transaction]);

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Combine student's first and last name with the formatted date
  const headerText = `${student.first_name} ${student.last_name}: ${formatDate(transaction.DateCreated)}`;

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.header}>{headerText}</Text>
      </View>
      <View style={styles.adminContainer}>
        <Text style={styles.adminText}>Admin: {transactions.length > 0 ? `${transactions[0].Admin_FirstName} ${transactions[0].Admin_LastName}` : 'N/A'}</Text>
      </View>
      {/* Render the fetched transactions */}
      <ScrollView style={styles.scrollView}>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.transactionContainer}>
              <Text style={styles.boldText}>{transaction.ProductName}</Text>
              <Text style={styles.transactionText}>Quantity: {transaction.Quantity}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Nunito-Bold',
  },
  scrollView: {
    width: '100%',
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#F3D014',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    justifyContent: 'space-between',
    marginRight: 40,
  },
  adminContainer: {
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
  },
  transactionText: {
    marginLeft: 5,
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
  },
  adminText: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});

export default StudentOrdersItems;
