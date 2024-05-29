const fetchTransactionsWithDate = async (studentID, date) => {
    try {
      // Format the date in the required format
      const formattedDate = new Date(date);
      const year = formattedDate.getFullYear();
      const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
      const day = String(formattedDate.getDate()).padStart(2, '0');
      const hours = String(formattedDate.getHours()).padStart(2, '0');
      const minutes = String(formattedDate.getMinutes()).padStart(2, '0');
      const seconds = String(formattedDate.getSeconds()).padStart(2, '0');
      const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
      const response = await fetch(`http://34.16.206.128:3000/TransactionDataWithDate?StudentID=${studentID}&DateCreated=${formattedDateString}`);
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
    
  export { fetchTransactionsWithDate };
  