// Function to fetch student data
const fetchStudents = async () => {
  try {
    const response = await fetch('http://34.16.206.128:3000/StudentData');
    if (response.ok) {
      const data = await response.json();
      return data || []; // Ensure we have a fallback for empty or missing data
    } else {
      console.error('Failed to fetch student data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
    return [];
  }
};

export { fetchStudents };
