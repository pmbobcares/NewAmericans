const fetchTransactions = async (StudentID) => {
  console.log(StudentID)
  try {
    const response = await fetch(`http://34.16.206.128:3000/TransactionData?StudentID=${StudentID}`);
    if (response.ok) {
      const data = await response.json();
      return data || []; 
    } else {
      console.error('Failed to fetch transaction data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return [];
  }
};
  
  export { fetchTransactions };